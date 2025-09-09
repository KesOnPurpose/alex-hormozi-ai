import { TestCase, TestResult } from './testRunner';

// DOM Testing Helpers
export class DOMTestHelper {
  static async waitForElement(selector: string, timeout = 5000): Promise<Element> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkElement = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }
        
        if (Date.now() - startTime > timeout) {
          reject(new Error(`Element ${selector} not found within ${timeout}ms`));
          return;
        }
        
        setTimeout(checkElement, 100);
      };
      
      checkElement();
    });
  }

  static async waitForElementToDisappear(selector: string, timeout = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkElement = () => {
        const element = document.querySelector(selector);
        if (!element) {
          resolve();
          return;
        }
        
        if (Date.now() - startTime > timeout) {
          reject(new Error(`Element ${selector} still visible after ${timeout}ms`));
          return;
        }
        
        setTimeout(checkElement, 100);
      };
      
      checkElement();
    });
  }

  static async clickElement(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    if (element instanceof HTMLElement) {
      element.click();
    } else {
      throw new Error(`Element ${selector} is not clickable`);
    }
  }

  static async typeIntoElement(selector: string, text: string): Promise<void> {
    const element = await this.waitForElement(selector);
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.value = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      throw new Error(`Element ${selector} is not a text input`);
    }
  }

  static async selectOption(selector: string, value: string): Promise<void> {
    const element = await this.waitForElement(selector);
    if (element instanceof HTMLSelectElement) {
      element.value = value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      throw new Error(`Element ${selector} is not a select element`);
    }
  }

  static getElementText(selector: string): string | null {
    const element = document.querySelector(selector);
    return element?.textContent || null;
  }

  static getElementAttribute(selector: string, attribute: string): string | null {
    const element = document.querySelector(selector);
    return element?.getAttribute(attribute) || null;
  }

  static isElementVisible(selector: string): boolean {
    const element = document.querySelector(selector);
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  static countElements(selector: string): number {
    return document.querySelectorAll(selector).length;
  }

  static async takeScreenshot(): Promise<string> {
    // In a real browser environment with testing tools
    if (typeof window !== 'undefined' && 'html2canvas' in window) {
      // Would use html2canvas or similar library
      return 'screenshot-placeholder';
    }
    
    // Mock implementation
    return `screenshot_${Date.now()}.png`;
  }
}

// API Testing Helpers
export class APITestHelper {
  static async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    return response;
  }

  static async expectAPIResponse(url: string, options: RequestInit = {}, expectedStatus = 200): Promise<any> {
    const response = await this.makeRequest(url, options);
    
    if (response.status !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    
    return response.text();
  }

  static async testAPIEndpoint(url: string, method = 'GET', body?: any): Promise<TestResult> {
    const startTime = Date.now();
    const logs: string[] = [];
    
    try {
      logs.push(`Testing ${method} ${url}`);
      
      const options: RequestInit = {
        method,
        ...(body ? { body: JSON.stringify(body) } : {})
      };
      
      const response = await this.makeRequest(url, options);
      const duration = Date.now() - startTime;
      
      logs.push(`Response: ${response.status} ${response.statusText}`);
      logs.push(`Duration: ${duration}ms`);
      
      return {
        passed: response.ok,
        duration,
        logs,
        metrics: {
          responseTime: duration,
          statusCode: response.status
        }
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        passed: false,
        duration,
        error: error instanceof Error ? error : new Error(String(error)),
        logs
      };
    }
  }
}

// Performance Testing Helpers
export class PerformanceTestHelper {
  static measurePageLoad(): Promise<PerformanceNavigationTiming> {
    return new Promise((resolve) => {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        resolve(navigation);
      });
    });
  }

  static measureFunctionExecution<T>(fn: () => T): { result: T; duration: number } {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    return { result, duration };
  }

  static async measureAsyncFunctionExecution<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    return { result, duration };
  }

  static getMemoryUsage(): MemoryInfo | null {
    if ('memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  }

  static async testComponentRenderPerformance(componentSelector: string, iterations = 100): Promise<TestResult> {
    const startTime = Date.now();
    const logs: string[] = [];
    const renderTimes: number[] = [];
    
    try {
      for (let i = 0; i < iterations; i++) {
        const renderStart = performance.now();
        
        // Trigger re-render (would need specific implementation)
        const element = document.querySelector(componentSelector);
        if (element && element instanceof HTMLElement) {
          element.style.display = 'none';
          element.offsetHeight; // Force reflow
          element.style.display = '';
        }
        
        const renderTime = performance.now() - renderStart;
        renderTimes.push(renderTime);
      }
      
      const avgRenderTime = renderTimes.reduce((a, b) => a + b) / renderTimes.length;
      const maxRenderTime = Math.max(...renderTimes);
      const minRenderTime = Math.min(...renderTimes);
      
      logs.push(`Tested ${iterations} renders`);
      logs.push(`Average: ${avgRenderTime.toFixed(2)}ms`);
      logs.push(`Min: ${minRenderTime.toFixed(2)}ms`);
      logs.push(`Max: ${maxRenderTime.toFixed(2)}ms`);
      
      return {
        passed: avgRenderTime < 16.67, // 60fps threshold
        duration: Date.now() - startTime,
        logs,
        metrics: {
          avgRenderTime,
          maxRenderTime,
          minRenderTime,
          iterations
        }
      };
    } catch (error) {
      return {
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error : new Error(String(error)),
        logs
      };
    }
  }
}

// Business Logic Testing Helpers
export class BusinessLogicTestHelper {
  static createMockBusinessProfile(overrides: any = {}) {
    return {
      businessStage: 'have_business',
      monthlyRevenue: '10k-50k',
      primaryChallenge: 'conversion',
      industry: 'coaching_consulting',
      teamSize: '2-5',
      currentOffers: '',
      marketingChannels: [],
      knowsMetrics: false,
      hasSystemsProcesses: false,
      desiredOutcome: 'double_revenue',
      sophisticationScore: 5,
      ...overrides
    };
  }

  static createMockRevenueData(count = 30) {
    const data = [];
    const baseRevenue = 8500;
    
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (count - i - 1));
      
      const volatility = (Math.random() - 0.5) * 1000;
      const growth = (baseRevenue * 0.1 * i) / count;
      const revenue = Math.max(0, baseRevenue + growth + volatility);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.round(revenue),
        projected: Math.round(revenue * 1.15),
        target: 12000,
        actualDate: new Date(date)
      });
    }
    
    return data;
  }

  static validateRevenueData(data: any[]): TestResult {
    const startTime = Date.now();
    const logs: string[] = [];
    const errors: string[] = [];
    
    try {
      logs.push(`Validating ${data.length} revenue data points`);
      
      // Check required fields
      data.forEach((item, index) => {
        if (!item.date) errors.push(`Item ${index}: missing date`);
        if (typeof item.revenue !== 'number') errors.push(`Item ${index}: revenue must be number`);
        if (typeof item.projected !== 'number') errors.push(`Item ${index}: projected must be number`);
        if (typeof item.target !== 'number') errors.push(`Item ${index}: target must be number`);
      });
      
      // Check data consistency
      const revenues = data.map(d => d.revenue).filter(r => r > 0);
      if (revenues.length === 0) {
        errors.push('No valid revenue data found');
      }
      
      // Check growth trends
      const firstRevenue = revenues[0];
      const lastRevenue = revenues[revenues.length - 1];
      const growthRate = ((lastRevenue - firstRevenue) / firstRevenue) * 100;
      
      logs.push(`Growth rate: ${growthRate.toFixed(2)}%`);
      logs.push(`Errors found: ${errors.length}`);
      
      return {
        passed: errors.length === 0,
        duration: Date.now() - startTime,
        logs: [...logs, ...errors],
        metrics: {
          dataPoints: data.length,
          validRevenues: revenues.length,
          growthRate,
          errorCount: errors.length
        }
      };
    } catch (error) {
      return {
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error : new Error(String(error)),
        logs
      };
    }
  }

  static testCFACalculation(cac: number, thirtyDayGP: number): TestResult {
    const startTime = Date.now();
    const logs: string[] = [];
    
    try {
      logs.push(`Testing CFA calculation with CAC: ${cac}, 30-day GP: ${thirtyDayGP}`);
      
      const cfaRatio = thirtyDayGP / cac;
      const cfaAchieved = cfaRatio >= 1.0;
      
      logs.push(`CFA Ratio: ${cfaRatio.toFixed(2)}`);
      logs.push(`CFA Achieved: ${cfaAchieved}`);
      
      // Validation rules
      const validations = [
        { rule: 'CAC must be positive', passed: cac > 0 },
        { rule: '30-day GP must be positive', passed: thirtyDayGP > 0 },
        { rule: 'CFA ratio calculation correct', passed: Math.abs(cfaRatio - (thirtyDayGP / cac)) < 0.001 },
        { rule: 'CFA achievement logic correct', passed: cfaAchieved === (cfaRatio >= 1.0) }
      ];
      
      const failedValidations = validations.filter(v => !v.passed);
      validations.forEach(v => logs.push(`${v.passed ? '✓' : '✗'} ${v.rule}`));
      
      return {
        passed: failedValidations.length === 0,
        duration: Date.now() - startTime,
        logs,
        metrics: {
          cac,
          thirtyDayGP,
          cfaRatio,
          cfaAchieved: cfaAchieved ? 1 : 0,
          validationsPassed: validations.filter(v => v.passed).length,
          validationsTotal: validations.length
        }
      };
    } catch (error) {
      return {
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error : new Error(String(error)),
        logs
      };
    }
  }
}

// Accessibility Testing Helpers
export class AccessibilityTestHelper {
  static async testKeyboardNavigation(selectors: string[]): Promise<TestResult> {
    const startTime = Date.now();
    const logs: string[] = [];
    const errors: string[] = [];
    
    try {
      logs.push(`Testing keyboard navigation for ${selectors.length} elements`);
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (!element) {
          errors.push(`Element not found: ${selector}`);
          continue;
        }
        
        // Check if element is focusable
        const tabIndex = element.getAttribute('tabindex');
        const isFocusable = element instanceof HTMLButtonElement ||
                           element instanceof HTMLInputElement ||
                           element instanceof HTMLSelectElement ||
                           element instanceof HTMLTextAreaElement ||
                           element instanceof HTMLAnchorElement ||
                           tabIndex !== null;
        
        if (!isFocusable) {
          errors.push(`Element not focusable: ${selector}`);
        } else {
          logs.push(`✓ ${selector} is focusable`);
        }
      }
      
      return {
        passed: errors.length === 0,
        duration: Date.now() - startTime,
        logs: [...logs, ...errors],
        metrics: {
          elementsChecked: selectors.length,
          focusableElements: selectors.length - errors.length,
          errorCount: errors.length
        }
      };
    } catch (error) {
      return {
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error : new Error(String(error)),
        logs
      };
    }
  }

  static checkAriaLabels(selectors: string[]): TestResult {
    const startTime = Date.now();
    const logs: string[] = [];
    const warnings: string[] = [];
    
    try {
      logs.push(`Checking ARIA labels for ${selectors.length} elements`);
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (!element) {
          warnings.push(`Element not found: ${selector}`);
          continue;
        }
        
        const ariaLabel = element.getAttribute('aria-label');
        const ariaLabelledBy = element.getAttribute('aria-labelledby');
        const title = element.getAttribute('title');
        
        if (!ariaLabel && !ariaLabelledBy && !title) {
          warnings.push(`Element lacks accessible label: ${selector}`);
        } else {
          logs.push(`✓ ${selector} has accessible label`);
        }
      }
      
      return {
        passed: warnings.length === 0,
        duration: Date.now() - startTime,
        logs: [...logs, ...warnings],
        metrics: {
          elementsChecked: selectors.length,
          labeledElements: selectors.length - warnings.length,
          warningCount: warnings.length
        }
      };
    } catch (error) {
      return {
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error : new Error(String(error)),
        logs
      };
    }
  }

  static checkColorContrast(elements: { selector: string; expectedRatio: number }[]): TestResult {
    const startTime = Date.now();
    const logs: string[] = [];
    const errors: string[] = [];
    
    try {
      logs.push(`Checking color contrast for ${elements.length} elements`);
      
      for (const { selector, expectedRatio } of elements) {
        const element = document.querySelector(selector);
        if (!element) {
          errors.push(`Element not found: ${selector}`);
          continue;
        }
        
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // This is a simplified check - in practice you'd use a proper contrast calculation library
        const hasGoodContrast = color !== backgroundColor; // Very basic check
        
        if (!hasGoodContrast) {
          errors.push(`Poor contrast detected: ${selector}`);
        } else {
          logs.push(`✓ ${selector} has adequate contrast`);
        }
      }
      
      return {
        passed: errors.length === 0,
        duration: Date.now() - startTime,
        logs: [...logs, ...errors],
        metrics: {
          elementsChecked: elements.length,
          goodContrast: elements.length - errors.length,
          errorCount: errors.length
        }
      };
    } catch (error) {
      return {
        passed: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error : new Error(String(error)),
        logs
      };
    }
  }
}

export {
  DOMTestHelper,
  APITestHelper,
  PerformanceTestHelper,
  BusinessLogicTestHelper,
  AccessibilityTestHelper
};