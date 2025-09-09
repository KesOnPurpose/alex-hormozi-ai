import { TestSuite } from '@/utils/testing/testRunner';
import { DOMTestHelper, AccessibilityTestHelper, PerformanceTestHelper } from '@/utils/testing/testHelpers';

// UI Component Test Suite
export const uiTests: TestSuite = {
  id: 'ui_components',
  name: 'UI Component Tests',
  description: 'Tests for user interface components and interactions',
  
  beforeAll: async () => {
    // Wait for the DOM to be ready
    if (document.readyState !== 'complete') {
      await new Promise(resolve => {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', resolve);
        } else {
          resolve(undefined);
        }
      });
    }
  },
  
  tests: [
    // Dashboard Component Tests
    {
      id: 'dashboard_elements_present',
      name: 'Dashboard Elements Present',
      description: 'Check that all required dashboard elements are present',
      category: 'integration',
      priority: 'high',
      tags: ['dashboard', 'ui', 'elements'],
      
      async test() {
        const startTime = Date.now();
        const logs: string[] = [];
        const errors: string[] = [];
        
        try {
          // Navigate to dashboard (if not already there)
          if (!window.location.pathname.includes('/dashboard')) {
            window.history.pushState({}, '', '/dashboard');
          }
          
          // Wait for dashboard to load
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const requiredElements = [
            { selector: '[data-testid="dashboard-header"]', name: 'Dashboard Header' },
            { selector: '[data-testid="revenue-chart"]', name: 'Revenue Chart' },
            { selector: '[data-testid="cfa-chart"]', name: 'CFA Chart' },
            { selector: '[data-testid="live-metrics"]', name: 'Live Metrics' },
            { selector: '[data-testid="quick-actions"]', name: 'Quick Actions' },
            { selector: '[data-testid="recommendations"]', name: 'Recommendations' }
          ];
          
          // Fallback selectors if data-testid attributes aren't available
          const fallbackElements = [
            { selector: 'h1', name: 'Main Heading' },
            { selector: '.bg-white\\/10', name: 'Dashboard Cards' },
            { selector: 'button', name: 'Interactive Buttons' }
          ];
          
          const elementsToCheck = requiredElements.length > 0 ? requiredElements : fallbackElements;
          
          for (const { selector, name } of elementsToCheck) {
            try {
              const element = document.querySelector(selector);
              if (element) {
                logs.push(`✓ ${name} found`);
                
                // Check if element is visible
                if (DOMTestHelper.isElementVisible(selector)) {
                  logs.push(`✓ ${name} is visible`);
                } else {
                  errors.push(`${name} exists but is not visible`);
                }
              } else {
                errors.push(`${name} not found (${selector})`);
              }
            } catch (error) {
              errors.push(`Error checking ${name}: ${error}`);
            }
          }
          
          // Check for interactive elements
          const buttonCount = DOMTestHelper.countElements('button');
          const linkCount = DOMTestHelper.countElements('a');
          const inputCount = DOMTestHelper.countElements('input');
          
          logs.push(`Interactive elements found:`);
          logs.push(`  Buttons: ${buttonCount}`);
          logs.push(`  Links: ${linkCount}`);
          logs.push(`  Inputs: ${inputCount}`);
          
          return {
            passed: errors.length === 0,
            duration: Date.now() - startTime,
            logs: [...logs, ...errors],
            metrics: {
              elementsChecked: elementsToCheck.length,
              elementsFound: elementsToCheck.length - errors.length,
              buttonCount,
              linkCount,
              inputCount
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
    },
    
    // Live Button Functionality Tests
    {
      id: 'live_buttons_functionality',
      name: 'Live Buttons Functionality',
      description: 'Test that live buttons work without crashes',
      category: 'integration',
      priority: 'critical',
      tags: ['buttons', 'live', 'functionality'],
      
      async test() {
        const startTime = Date.now();
        const logs: string[] = [];
        const errors: string[] = [];
        
        try {
          // Wait for page to load
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find live buttons
          const liveButtonSelectors = [
            'button:contains("Start Live")',
            'button:contains("LIVE")',
            'button[title*="live"]',
            '.live-button',
            '[data-testid*="live-button"]'
          ];
          
          // Fallback: find buttons that might be live buttons
          const allButtons = Array.from(document.querySelectorAll('button'));
          const liveButtons = allButtons.filter(button => {
            const text = button.textContent?.toLowerCase() || '';
            return text.includes('live') || text.includes('start') || 
                   button.className.includes('live') ||
                   button.getAttribute('title')?.toLowerCase().includes('live');
          });
          
          logs.push(`Found ${liveButtons.length} potential live buttons`);
          
          if (liveButtons.length === 0) {
            // Look for any buttons in dashboard cards
            const dashboardButtons = Array.from(document.querySelectorAll('.bg-white\\/10 button'));
            liveButtons.push(...dashboardButtons.slice(0, 3)); // Test first 3 buttons
            logs.push(`Testing ${liveButtons.length} dashboard buttons as fallback`);
          }
          
          for (const [index, button] of liveButtons.entries()) {
            try {
              const buttonText = button.textContent?.trim() || `Button ${index}`;
              logs.push(`Testing button: ${buttonText}`);
              
              // Check if button is clickable
              if (button.disabled) {
                logs.push(`  Button is disabled, skipping`);
                continue;
              }
              
              // Simulate click
              const originalConsoleError = console.error;
              const errors: string[] = [];
              console.error = (...args) => {
                errors.push(args.join(' '));
                originalConsoleError(...args);
              };
              
              button.click();
              
              // Wait for any async operations
              await new Promise(resolve => setTimeout(resolve, 500));
              
              console.error = originalConsoleError;
              
              if (errors.length > 0) {
                logs.push(`  ❌ Button click caused errors: ${errors.join(', ')}`);
              } else {
                logs.push(`  ✓ Button clicked successfully`);
              }
              
              // Check if button state changed (became "LIVE" or similar)
              const newButtonText = button.textContent?.trim();
              if (newButtonText !== buttonText) {
                logs.push(`  ✓ Button state changed: ${buttonText} → ${newButtonText}`);
              }
              
            } catch (error) {
              errors.push(`Button ${index} click failed: ${error}`);
            }
          }
          
          return {
            passed: errors.length === 0,
            duration: Date.now() - startTime,
            logs: [...logs, ...errors],
            metrics: {
              buttonsFound: liveButtons.length,
              buttonsTestedSuccessfully: liveButtons.length - errors.length,
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
    },
    
    // Settings Page Tests
    {
      id: 'settings_tabs_navigation',
      name: 'Settings Tabs Navigation',
      description: 'Test navigation between settings tabs',
      category: 'integration',
      priority: 'medium',
      tags: ['settings', 'navigation', 'tabs'],
      
      async test() {
        const startTime = Date.now();
        const logs: string[] = [];
        const errors: string[] = [];
        
        try {
          // Navigate to settings
          window.history.pushState({}, '', '/settings');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Look for tab navigation
          const tabSelectors = [
            '[data-testid*="tab"]',
            '.tab',
            'button[role="tab"]',
            'nav button',
            '.bg-white\\/5 button' // Settings page styling
          ];
          
          let tabs: Element[] = [];
          for (const selector of tabSelectors) {
            tabs = Array.from(document.querySelectorAll(selector));
            if (tabs.length > 0) break;
          }
          
          logs.push(`Found ${tabs.length} potential tabs`);
          
          if (tabs.length === 0) {
            // Look for any navigation-like buttons
            const navButtons = Array.from(document.querySelectorAll('button'));
            tabs = navButtons.filter(btn => {
              const text = btn.textContent?.toLowerCase() || '';
              return text.includes('profile') || text.includes('preferences') || 
                     text.includes('display') || text.includes('privacy') ||
                     text.includes('testing') || text.includes('monitoring');
            });
            logs.push(`Found ${tabs.length} navigation buttons as fallback`);
          }
          
          // Test tab clicks
          for (const [index, tab] of tabs.entries()) {
            try {
              if (!(tab instanceof HTMLElement)) continue;
              
              const tabText = tab.textContent?.trim() || `Tab ${index}`;
              logs.push(`Testing tab: ${tabText}`);
              
              // Click tab
              tab.click();
              await new Promise(resolve => setTimeout(resolve, 300));
              
              // Check if tab appears active (common patterns)
              const isActive = tab.classList.contains('active') ||
                              tab.classList.contains('bg-purple-600') ||
                              tab.getAttribute('aria-selected') === 'true';
              
              if (isActive) {
                logs.push(`  ✓ Tab activated successfully`);
              } else {
                logs.push(`  ? Tab click registered (state change unclear)`);
              }
              
            } catch (error) {
              errors.push(`Tab ${index} navigation failed: ${error}`);
            }
          }
          
          // Test direct URL navigation to specific tabs
          const tabUrls = [
            '/settings?tab=abtesting',
            '/settings?tab=monitoring'
          ];
          
          for (const url of tabUrls) {
            try {
              logs.push(`Testing direct navigation to: ${url}`);
              window.history.pushState({}, '', url);
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // Check if content loaded
              const hasContent = document.body.innerHTML.length > 1000;
              if (hasContent) {
                logs.push(`  ✓ Content loaded for ${url}`);
              } else {
                errors.push(`No content loaded for ${url}`);
              }
            } catch (error) {
              errors.push(`Direct navigation to ${url} failed: ${error}`);
            }
          }
          
          return {
            passed: errors.length === 0,
            duration: Date.now() - startTime,
            logs: [...logs, ...errors],
            metrics: {
              tabsFound: tabs.length,
              tabsTestedSuccessfully: tabs.length - errors.filter(e => e.includes('Tab')).length,
              urlsTestedSuccessfully: tabUrls.length - errors.filter(e => e.includes('navigation')).length
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
    },
    
    // Responsive Design Tests
    {
      id: 'responsive_design',
      name: 'Responsive Design',
      description: 'Test responsive behavior at different screen sizes',
      category: 'integration',
      priority: 'medium',
      tags: ['responsive', 'mobile', 'design'],
      
      async test() {
        const startTime = Date.now();
        const logs: string[] = [];
        const errors: string[] = [];
        
        try {
          const originalViewport = {
            width: window.innerWidth,
            height: window.innerHeight
          };
          
          const viewports = [
            { name: 'Mobile', width: 375, height: 667 },
            { name: 'Tablet', width: 768, height: 1024 },
            { name: 'Desktop', width: 1440, height: 900 }
          ];
          
          for (const viewport of viewports) {
            logs.push(`Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})`);
            
            // Simulate viewport resize
            Object.defineProperty(window, 'innerWidth', { value: viewport.width, writable: true });
            Object.defineProperty(window, 'innerHeight', { value: viewport.height, writable: true });
            window.dispatchEvent(new Event('resize'));
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Check if layout adapts
            const body = document.body;
            const computedStyle = window.getComputedStyle(body);
            
            // Look for responsive elements
            const gridElements = document.querySelectorAll('.grid');
            const flexElements = document.querySelectorAll('.flex');
            const hiddenElements = document.querySelectorAll('.hidden, .md\\:block, .lg\\:block');
            
            logs.push(`  Grid elements: ${gridElements.length}`);
            logs.push(`  Flex elements: ${flexElements.length}`);
            logs.push(`  Responsive visibility elements: ${hiddenElements.length}`);
            
            // Check for horizontal scrollbars (bad on mobile)
            const hasHorizontalScroll = document.body.scrollWidth > viewport.width;
            if (hasHorizontalScroll && viewport.name === 'Mobile') {
              errors.push(`Horizontal scroll detected on mobile viewport`);
            } else {
              logs.push(`  ✓ No unwanted horizontal scroll`);
            }
            
            // Check if text is readable (not too small)
            const textElements = document.querySelectorAll('p, span, div');
            let smallTextCount = 0;
            
            for (const element of Array.from(textElements).slice(0, 10)) { // Sample first 10
              const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
              if (fontSize < 14 && viewport.name === 'Mobile') {
                smallTextCount++;
              }
            }
            
            if (smallTextCount > 3) {
              errors.push(`Too many small text elements on mobile (${smallTextCount})`);
            } else {
              logs.push(`  ✓ Text sizes appropriate`);
            }
          }
          
          // Restore original viewport
          Object.defineProperty(window, 'innerWidth', { value: originalViewport.width, writable: true });
          Object.defineProperty(window, 'innerHeight', { value: originalViewport.height, writable: true });
          window.dispatchEvent(new Event('resize'));
          
          return {
            passed: errors.length === 0,
            duration: Date.now() - startTime,
            logs: [...logs, ...errors],
            metrics: {
              viewportsTested: viewports.length,
              responsiveElementsFound: document.querySelectorAll('.grid, .flex, .hidden').length,
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
    },
    
    // Accessibility Tests
    {
      id: 'accessibility_compliance',
      name: 'Accessibility Compliance',
      description: 'Test basic accessibility compliance',
      category: 'accessibility',
      priority: 'high',
      tags: ['accessibility', 'a11y', 'compliance'],
      
      async test() {
        const startTime = Date.now();
        const logs: string[] = [];
        
        try {
          // Test keyboard navigation
          const interactiveElements = [
            'button',
            'a',
            'input',
            'select',
            'textarea',
            '[tabindex]'
          ];
          
          const keyboardResult = await AccessibilityTestHelper.testKeyboardNavigation(interactiveElements);
          logs.push('Keyboard Navigation Test:');
          logs.push(...keyboardResult.logs.map(log => `  ${log}`));
          
          // Test ARIA labels
          const elementsNeedingLabels = [
            'button',
            'input[type="text"]',
            'input[type="email"]',
            'select',
            'textarea'
          ];
          
          const ariaResult = AccessibilityTestHelper.checkAriaLabels(elementsNeedingLabels);
          logs.push('ARIA Labels Test:');
          logs.push(...ariaResult.logs.map(log => `  ${log}`));
          
          // Test color contrast (basic check)
          const contrastElements = [
            { selector: 'h1', expectedRatio: 4.5 },
            { selector: 'h2', expectedRatio: 4.5 },
            { selector: 'p', expectedRatio: 4.5 },
            { selector: 'button', expectedRatio: 4.5 }
          ];
          
          const contrastResult = AccessibilityTestHelper.checkColorContrast(contrastElements);
          logs.push('Color Contrast Test:');
          logs.push(...contrastResult.logs.map(log => `  ${log}`));
          
          // Check for alt text on images
          const images = Array.from(document.querySelectorAll('img'));
          const imagesWithoutAlt = images.filter(img => !img.getAttribute('alt'));
          
          logs.push(`Images found: ${images.length}`);
          logs.push(`Images without alt text: ${imagesWithoutAlt.length}`);
          
          if (imagesWithoutAlt.length > 0) {
            logs.push('Images missing alt text:');
            imagesWithoutAlt.forEach((img, index) => {
              logs.push(`  Image ${index}: ${img.src || 'no src'}`);
            });
          }
          
          // Overall accessibility score
          const keyboardScore = keyboardResult.passed ? 25 : 0;
          const ariaScore = ariaResult.passed ? 25 : 0;
          const contrastScore = contrastResult.passed ? 25 : 0;
          const altTextScore = imagesWithoutAlt.length === 0 ? 25 : Math.max(0, 25 - (imagesWithoutAlt.length * 5));
          
          const totalScore = keyboardScore + ariaScore + contrastScore + altTextScore;
          const passed = totalScore >= 75; // 75% threshold
          
          logs.push(`Accessibility Score: ${totalScore}/100`);
          logs.push(`  Keyboard Navigation: ${keyboardScore}/25`);
          logs.push(`  ARIA Labels: ${ariaScore}/25`);
          logs.push(`  Color Contrast: ${contrastScore}/25`);
          logs.push(`  Alt Text: ${altTextScore}/25`);
          
          return {
            passed,
            duration: Date.now() - startTime,
            logs,
            metrics: {
              accessibilityScore: totalScore,
              keyboardNavigableElements: keyboardResult.metrics?.focusableElements || 0,
              elementsWithAriaLabels: ariaResult.metrics?.labeledElements || 0,
              imagesWithoutAlt: imagesWithoutAlt.length,
              totalImages: images.length
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
  ]
};