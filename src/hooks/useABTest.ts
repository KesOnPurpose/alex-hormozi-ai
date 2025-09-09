'use client';

import { useState, useEffect } from 'react';
import { abTestingService } from '@/services/abTesting';

export function useABTest(testId: string, userId: string) {
  const [variant, setVariant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  const trackCustomEvent = (eventType: string, metadata?: Record<string, any>) => {
    if (variant) {
      // Custom events can be tracked for additional metrics
      console.log(`A/B Test Custom Event: ${eventType}`, { testId, variant, metadata });
    }
  };

  return { variant, isLoading, trackConversion, trackCustomEvent };
}

export function useABTestConfig<T = any>(testId: string, userId: string, defaultConfig: T): T {
  const { variant, isLoading } = useABTest(testId, userId);
  const [config, setConfig] = useState<T>(defaultConfig);

  useEffect(() => {
    if (!isLoading && variant) {
      const test = abTestingService.getAllTests().find(t => t.id === testId);
      const variantConfig = test?.variants.find(v => v.id === variant)?.config;
      
      if (variantConfig) {
        setConfig({ ...defaultConfig, ...variantConfig });
      }
    }
  }, [variant, isLoading, testId, defaultConfig]);

  return config;
}

// Hook for multiple tests
export function useMultipleABTests(tests: Array<{ testId: string; userId: string }>) {
  const [assignments, setAssignments] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const newAssignments: Record<string, string | null> = {};
    
    tests.forEach(({ testId, userId }) => {
      const variant = abTestingService.assignUserToVariant(userId, testId);
      newAssignments[testId] = variant;
      
      if (variant) {
        abTestingService.trackEvent(userId, testId, 'impression');
      }
    });
    
    setAssignments(newAssignments);
    setIsLoading(false);
  }, [tests]);

  const trackConversion = (testId: string, metadata?: Record<string, any>) => {
    const variant = assignments[testId];
    const test = tests.find(t => t.testId === testId);
    
    if (variant && test) {
      abTestingService.trackEvent(test.userId, testId, 'conversion', metadata);
    }
  };

  return { assignments, isLoading, trackConversion };
}

// Component wrapper for A/B testing
export function ABTestWrapper({ 
  testId, 
  userId, 
  variants, 
  children, 
  fallback 
}: {
  testId: string;
  userId: string;
  variants: Record<string, React.ReactNode>;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { variant, isLoading } = useABTest(testId, userId);

  if (isLoading) {
    return fallback ? <>{fallback}</> : <>{children}</>;
  }

  if (variant && variants[variant]) {
    return <>{variants[variant]}</>;
  }

  return <>{children}</>;
}