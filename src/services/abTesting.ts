interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: ABVariant[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  trafficAllocation: number; // Percentage of users to include
  startDate?: Date;
  endDate?: Date;
  targetMetric: string;
  confidence: number;
  sampleSize?: number;
}

interface ABVariant {
  id: string;
  name: string;
  description: string;
  weight: number; // Percentage split
  config: Record<string, any>;
  metrics: ABMetrics;
}

interface ABMetrics {
  impressions: number;
  conversions: number;
  conversionRate: number;
  revenue?: number;
  bounceRate?: number;
  timeOnPage?: number;
}

interface ABTestResult {
  testId: string;
  winningVariant?: string;
  confidence: number;
  significanceLevel: number;
  results: ABVariant[];
  recommendations: string[];
}

interface UserSegment {
  id: string;
  name: string;
  criteria: Record<string, any>;
}

class ABTestingService {
  private tests: Map<string, ABTest> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map(); // userId -> testId -> variantId
  private analytics: Map<string, ABMetrics[]> = new Map();
  
  constructor() {
    this.loadFromStorage();
  }

  // Test Management
  createTest(test: Omit<ABTest, 'id'>): ABTest {
    const newTest: ABTest = {
      id: this.generateId(),
      ...test,
      status: 'draft'
    };
    
    this.tests.set(newTest.id, newTest);
    this.saveToStorage();
    return newTest;
  }

  startTest(testId: string): boolean {
    const test = this.tests.get(testId);
    if (!test) return false;
    
    test.status = 'running';
    test.startDate = new Date();
    this.saveToStorage();
    return true;
  }

  pauseTest(testId: string): boolean {
    const test = this.tests.get(testId);
    if (!test) return false;
    
    test.status = 'paused';
    this.saveToStorage();
    return true;
  }

  completeTest(testId: string): ABTestResult | null {
    const test = this.tests.get(testId);
    if (!test) return null;
    
    test.status = 'completed';
    test.endDate = new Date();
    
    const result = this.analyzeResults(testId);
    this.saveToStorage();
    return result;
  }

  // User Assignment
  assignUserToVariant(userId: string, testId: string): string | null {
    const test = this.tests.get(testId);
    if (!test || test.status !== 'running') return null;
    
    // Check if user is already assigned
    const userTests = this.userAssignments.get(userId) || new Map();
    const existingAssignment = userTests.get(testId);
    if (existingAssignment) return existingAssignment;
    
    // Check if user should be included (traffic allocation)
    if (Math.random() * 100 > test.trafficAllocation) return null;
    
    // Assign to variant based on weights
    const variantId = this.selectVariantByWeight(test.variants, userId);
    
    // Store assignment
    userTests.set(testId, variantId);
    this.userAssignments.set(userId, userTests);
    this.saveToStorage();
    
    return variantId;
  }

  getUserVariant(userId: string, testId: string): string | null {
    const userTests = this.userAssignments.get(userId);
    return userTests?.get(testId) || null;
  }

  // Metrics & Analytics
  trackEvent(userId: string, testId: string, eventType: 'impression' | 'conversion', metadata?: Record<string, any>): void {
    const variantId = this.getUserVariant(userId, testId);
    if (!variantId) return;
    
    const test = this.tests.get(testId);
    if (!test) return;
    
    const variant = test.variants.find(v => v.id === variantId);
    if (!variant) return;
    
    // Update metrics
    if (eventType === 'impression') {
      variant.metrics.impressions++;
    } else if (eventType === 'conversion') {
      variant.metrics.conversions++;
      if (metadata?.revenue) {
        variant.metrics.revenue = (variant.metrics.revenue || 0) + metadata.revenue;
      }
    }
    
    // Recalculate conversion rate
    variant.metrics.conversionRate = variant.metrics.impressions > 0 
      ? (variant.metrics.conversions / variant.metrics.impressions) * 100 
      : 0;
    
    this.saveToStorage();
  }

  // Analysis
  analyzeResults(testId: string): ABTestResult | null {
    const test = this.tests.get(testId);
    if (!test) return null;
    
    const variants = test.variants.map(v => ({ ...v }));
    variants.sort((a, b) => b.metrics.conversionRate - a.metrics.conversionRate);
    
    const winningVariant = variants[0];
    const confidence = this.calculateConfidence(variants[0], variants[1]);
    
    return {
      testId,
      winningVariant: confidence > 95 ? winningVariant.id : undefined,
      confidence,
      significanceLevel: 95,
      results: variants,
      recommendations: this.generateRecommendations(variants, confidence)
    };
  }

  getTestResults(testId: string): ABTestResult | null {
    return this.analyzeResults(testId);
  }

  getAllTests(): ABTest[] {
    return Array.from(this.tests.values());
  }

  getRunningTests(): ABTest[] {
    return Array.from(this.tests.values()).filter(test => test.status === 'running');
  }

  // Private Methods
  private selectVariantByWeight(variants: ABVariant[], userId: string): string {
    // Use consistent hash for user to ensure stable assignment
    const hash = this.hashString(userId);
    const random = (hash % 100) / 100;
    
    let cumulativeWeight = 0;
    for (const variant of variants) {
      cumulativeWeight += variant.weight / 100;
      if (random <= cumulativeWeight) {
        return variant.id;
      }
    }
    
    // Fallback to first variant
    return variants[0].id;
  }

  private calculateConfidence(variantA: ABVariant, variantB?: ABVariant): number {
    if (!variantB) return 0;
    
    const { impressions: nA, conversions: cA } = variantA.metrics;
    const { impressions: nB, conversions: cB } = variantB.metrics;
    
    if (nA < 30 || nB < 30) return 0; // Need minimum sample size
    
    const pA = cA / nA;
    const pB = cB / nB;
    const pPooled = (cA + cB) / (nA + nB);
    
    const se = Math.sqrt(pPooled * (1 - pPooled) * (1/nA + 1/nB));
    const zScore = Math.abs(pA - pB) / se;
    
    // Convert z-score to confidence percentage (simplified)
    return Math.min(99.9, zScore * 50);
  }

  private generateRecommendations(variants: ABVariant[], confidence: number): string[] {
    const recommendations: string[] = [];
    const winner = variants[0];
    
    if (confidence > 95) {
      recommendations.push(`Deploy variant "${winner.name}" - statistically significant winner with ${confidence.toFixed(1)}% confidence`);
    } else if (confidence > 80) {
      recommendations.push(`Variant "${winner.name}" shows promise but needs more data for statistical significance`);
    } else {
      recommendations.push('Continue test - no clear winner yet. Consider increasing sample size or test duration');
    }
    
    // Performance recommendations
    if (winner.metrics.conversions < 10) {
      recommendations.push('Low conversion volume - consider extending test duration or increasing traffic allocation');
    }
    
    // Variant-specific recommendations
    variants.forEach(variant => {
      if (variant.metrics.conversionRate > 0) {
        const performance = variant === winner ? 'best' : 'underperforming';
        recommendations.push(`"${variant.name}": ${variant.metrics.conversionRate.toFixed(2)}% conversion rate (${performance})`);
      }
    });
    
    return recommendations;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private generateId(): string {
    return 'test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ab_tests', JSON.stringify(Array.from(this.tests.entries())));
      localStorage.setItem('ab_assignments', JSON.stringify(Array.from(this.userAssignments.entries())));
    }
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const testsData = localStorage.getItem('ab_tests');
        if (testsData) {
          this.tests = new Map(JSON.parse(testsData));
        }
        
        const assignmentsData = localStorage.getItem('ab_assignments');
        if (assignmentsData) {
          const parsed = JSON.parse(assignmentsData);
          this.userAssignments = new Map(parsed.map(([k, v]: [string, [string, string][]]) => 
            [k, new Map(v)]
          ));
        }
      } catch (error) {
        console.error('Error loading A/B test data from storage:', error);
      }
    }
  }
}

// Singleton instance
export const abTestingService = new ABTestingService();

// Export types first
export { ABTest, ABVariant, ABTestResult, ABMetrics };

// React import for hooks
import React from 'react';

// Convenience hooks and utilities
export const useABTest = (testId: string, userId: string) => {
  const [variant, setVariant] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const assignedVariant = abTestingService.assignUserToVariant(userId, testId);
    setVariant(assignedVariant);
    setIsLoading(false);
    
    // Track impression
    if (assignedVariant) {
      abTestingService.trackEvent(userId, testId, 'impression');
    }
  }, [testId, userId]);
  
  const trackConversion = (metadata?: Record<string, any>) => {
    if (variant) {
      abTestingService.trackEvent(userId, testId, 'conversion', metadata);
    }
  };
  
  return { variant, isLoading, trackConversion };
};