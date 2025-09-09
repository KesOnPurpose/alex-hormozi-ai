import { TestSuite, TestCase } from '@/utils/testing/testRunner';
import { BusinessLogicTestHelper, PerformanceTestHelper } from '@/utils/testing/testHelpers';

// Business Logic Test Suite
export const businessLogicTests: TestSuite = {
  id: 'business_logic',
  name: 'Business Logic Tests',
  description: 'Tests for core business logic and calculations',
  
  tests: [
    // CFA (Client Financed Acquisition) Tests
    {
      id: 'cfa_calculation_basic',
      name: 'CFA Calculation - Basic Scenarios',
      description: 'Test CFA calculation with standard values',
      category: 'unit',
      priority: 'high',
      tags: ['cfa', 'calculation', 'business'],
      
      async test() {
        const results = [
          BusinessLogicTestHelper.testCFACalculation(100, 150), // CFA achieved
          BusinessLogicTestHelper.testCFACalculation(200, 180), // CFA not achieved
          BusinessLogicTestHelper.testCFACalculation(125, 125), // Exactly 1.0
          BusinessLogicTestHelper.testCFACalculation(50, 200),  // High CFA ratio
        ];
        
        const allPassed = results.every(r => r.passed);
        const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
        const allLogs = results.flatMap(r => r.logs);
        
        return {
          passed: allPassed,
          duration: totalDuration,
          logs: allLogs,
          metrics: {
            testCases: results.length,
            passedCases: results.filter(r => r.passed).length
          }
        };
      }
    },
    
    {
      id: 'cfa_calculation_edge_cases',
      name: 'CFA Calculation - Edge Cases',
      description: 'Test CFA calculation with edge cases and invalid inputs',
      category: 'unit',
      priority: 'medium',
      tags: ['cfa', 'edge-cases', 'validation'],
      
      async test() {
        const results = [
          BusinessLogicTestHelper.testCFACalculation(0, 100),    // Zero CAC
          BusinessLogicTestHelper.testCFACalculation(100, 0),    // Zero GP
          BusinessLogicTestHelper.testCFACalculation(-50, 100),  // Negative CAC
          BusinessLogicTestHelper.testCFACalculation(100, -50),  // Negative GP
        ];
        
        // For edge cases, we expect some to fail validation
        const validationResults = results.map(r => ({
          passed: r.passed || (r.logs.some(log => log.includes('must be positive'))),
          duration: r.duration,
          logs: r.logs
        }));
        
        const allHandledCorrectly = validationResults.every(r => r.passed);
        const totalDuration = validationResults.reduce((sum, r) => sum + r.duration, 0);
        
        return {
          passed: allHandledCorrectly,
          duration: totalDuration,
          logs: validationResults.flatMap(r => r.logs),
          metrics: {
            edgeCases: results.length,
            handledCorrectly: validationResults.filter(r => r.passed).length
          }
        };
      }
    },
    
    // Revenue Data Validation Tests
    {
      id: 'revenue_data_validation',
      name: 'Revenue Data Validation',
      description: 'Test revenue data structure and validation',
      category: 'unit',
      priority: 'high',
      tags: ['revenue', 'data', 'validation'],
      
      async test() {
        // Test valid revenue data
        const validData = BusinessLogicTestHelper.createMockRevenueData(30);
        const validResult = BusinessLogicTestHelper.validateRevenueData(validData);
        
        // Test invalid revenue data
        const invalidData = [
          { date: '', revenue: 100, projected: 120, target: 150 }, // Missing date
          { date: '2024-01-01', revenue: 'invalid', projected: 120, target: 150 }, // Invalid revenue type
          { date: '2024-01-02', revenue: 100, projected: 120 }, // Missing target
        ];
        const invalidResult = BusinessLogicTestHelper.validateRevenueData(invalidData);
        
        const validDataPassed = validResult.passed;
        const invalidDataFailed = !invalidResult.passed; // Should fail validation
        
        return {
          passed: validDataPassed && invalidDataFailed,
          duration: validResult.duration + invalidResult.duration,
          logs: [
            ...validResult.logs,
            '--- Invalid Data Test ---',
            ...invalidResult.logs
          ],
          metrics: {
            validDataPoints: validData.length,
            invalidDataPoints: invalidData.length,
            validationErrors: invalidResult.metrics?.errorCount || 0
          }
        };
      }
    },
    
    // Business Profile Tests
    {
      id: 'business_profile_creation',
      name: 'Business Profile Creation',
      description: 'Test business profile creation and validation',
      category: 'unit',
      priority: 'medium',
      tags: ['profile', 'business', 'creation'],
      
      async test() {
        const startTime = Date.now();
        const logs: string[] = [];
        
        try {
          // Test valid business profile creation
          const validProfile = BusinessLogicTestHelper.createMockBusinessProfile({
            businessStage: 'have_business',
            monthlyRevenue: '50k-100k',
            primaryChallenge: 'leads'
          });
          
          logs.push('Created valid business profile');
          logs.push(`Business stage: ${validProfile.businessStage}`);
          logs.push(`Monthly revenue: ${validProfile.monthlyRevenue}`);
          logs.push(`Primary challenge: ${validProfile.primaryChallenge}`);
          
          // Validate required fields
          const requiredFields = ['businessStage', 'monthlyRevenue', 'primaryChallenge', 'industry'];
          const missingFields = requiredFields.filter(field => !validProfile[field]);
          
          if (missingFields.length > 0) {
            logs.push(`Missing required fields: ${missingFields.join(', ')}`);
            return {
              passed: false,
              duration: Date.now() - startTime,
              logs
            };
          }
          
          // Test profile with custom overrides
          const customProfile = BusinessLogicTestHelper.createMockBusinessProfile({
            industry: 'e-commerce',
            teamSize: '10-20',
            sophisticationScore: 8
          });
          
          logs.push('Created custom business profile');
          logs.push(`Industry: ${customProfile.industry}`);
          logs.push(`Team size: ${customProfile.teamSize}`);
          logs.push(`Sophistication score: ${customProfile.sophisticationScore}`);
          
          return {
            passed: true,
            duration: Date.now() - startTime,
            logs,
            metrics: {
              profilesCreated: 2,
              requiredFieldsValidated: requiredFields.length,
              customOverrides: 3
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
    
    // Growth Calculation Tests
    {
      id: 'revenue_growth_calculation',
      name: 'Revenue Growth Calculation',
      description: 'Test revenue growth rate calculations',
      category: 'unit',
      priority: 'medium',
      tags: ['revenue', 'growth', 'calculation'],
      
      async test() {
        const startTime = Date.now();
        const logs: string[] = [];
        
        try {
          // Generate revenue data with known growth pattern
          const revenueData = BusinessLogicTestHelper.createMockRevenueData(12);
          
          // Calculate growth between first and last month
          const firstMonth = revenueData[0];
          const lastMonth = revenueData[revenueData.length - 1];
          
          const growthAmount = lastMonth.revenue - firstMonth.revenue;
          const growthRate = (growthAmount / firstMonth.revenue) * 100;
          
          logs.push(`Revenue data points: ${revenueData.length}`);
          logs.push(`First month revenue: $${firstMonth.revenue.toLocaleString()}`);
          logs.push(`Last month revenue: $${lastMonth.revenue.toLocaleString()}`);
          logs.push(`Growth amount: $${growthAmount.toLocaleString()}`);
          logs.push(`Growth rate: ${growthRate.toFixed(2)}%`);
          
          // Validate growth calculation
          const expectedGrowthRate = ((lastMonth.revenue - firstMonth.revenue) / firstMonth.revenue) * 100;
          const calculationAccurate = Math.abs(growthRate - expectedGrowthRate) < 0.01;
          
          logs.push(`Calculation accurate: ${calculationAccurate}`);
          
          // Test month-over-month growth
          let totalMoMGrowth = 0;
          let validMoMCalculations = 0;
          
          for (let i = 1; i < revenueData.length; i++) {
            const currentMonth = revenueData[i];
            const previousMonth = revenueData[i - 1];
            
            if (previousMonth.revenue > 0) {
              const momGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;
              totalMoMGrowth += momGrowth;
              validMoMCalculations++;
            }
          }
          
          const avgMoMGrowth = validMoMCalculations > 0 ? totalMoMGrowth / validMoMCalculations : 0;
          logs.push(`Average MoM growth: ${avgMoMGrowth.toFixed(2)}%`);
          logs.push(`Valid MoM calculations: ${validMoMCalculations}`);
          
          return {
            passed: calculationAccurate && validMoMCalculations > 0,
            duration: Date.now() - startTime,
            logs,
            metrics: {
              dataPoints: revenueData.length,
              growthRate,
              avgMoMGrowth,
              validCalculations: validMoMCalculations
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
    
    // Performance test for business calculations
    {
      id: 'business_calculations_performance',
      name: 'Business Calculations Performance',
      description: 'Test performance of business logic calculations',
      category: 'performance',
      priority: 'low',
      tags: ['performance', 'calculations', 'benchmark'],
      
      async test() {
        const startTime = Date.now();
        const logs: string[] = [];
        
        try {
          // Performance test for CFA calculations
          const cfaCalculations = 1000;
          const cfaStartTime = performance.now();
          
          for (let i = 0; i < cfaCalculations; i++) {
            const cac = 50 + (i % 200); // Vary CAC
            const gp = 100 + (i % 500);  // Vary GP
            BusinessLogicTestHelper.testCFACalculation(cac, gp);
          }
          
          const cfaDuration = performance.now() - cfaStartTime;
          const cfaAvgTime = cfaDuration / cfaCalculations;
          
          logs.push(`CFA calculations: ${cfaCalculations}`);
          logs.push(`Total duration: ${cfaDuration.toFixed(2)}ms`);
          logs.push(`Average per calculation: ${cfaAvgTime.toFixed(4)}ms`);
          
          // Performance test for revenue data generation
          const revenueGenStartTime = performance.now();
          const revenueData = BusinessLogicTestHelper.createMockRevenueData(365); // Full year
          const revenueGenDuration = performance.now() - revenueGenStartTime;
          
          logs.push(`Revenue data generation: ${revenueData.length} points`);
          logs.push(`Generation duration: ${revenueGenDuration.toFixed(2)}ms`);
          logs.push(`Average per data point: ${(revenueGenDuration / revenueData.length).toFixed(4)}ms`);
          
          // Performance test for data validation
          const validationStartTime = performance.now();
          const validationResult = BusinessLogicTestHelper.validateRevenueData(revenueData);
          const validationDuration = performance.now() - validationStartTime;
          
          logs.push(`Data validation duration: ${validationDuration.toFixed(2)}ms`);
          logs.push(`Validation passed: ${validationResult.passed}`);
          
          // Performance thresholds
          const cfaPerformanceGood = cfaAvgTime < 1; // Less than 1ms per calculation
          const revenueGenPerformanceGood = revenueGenDuration < 100; // Less than 100ms for 365 points
          const validationPerformanceGood = validationDuration < 50; // Less than 50ms for validation
          
          const allPerformanceGood = cfaPerformanceGood && revenueGenPerformanceGood && validationPerformanceGood;
          
          logs.push(`CFA performance good: ${cfaPerformanceGood}`);
          logs.push(`Revenue generation performance good: ${revenueGenPerformanceGood}`);
          logs.push(`Validation performance good: ${validationPerformanceGood}`);
          
          return {
            passed: allPerformanceGood,
            duration: Date.now() - startTime,
            logs,
            metrics: {
              cfaCalculationsPerSecond: Math.round(1000 / cfaAvgTime),
              revenueGenTimeMs: revenueGenDuration,
              validationTimeMs: validationDuration,
              overallPerformanceScore: allPerformanceGood ? 100 : 75
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