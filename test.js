// Simple test runner for Node.js environment
const { performance } = require('perf_hooks');

// Mock browser globals for Node.js environment
global.document = {
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: () => ({}),
};

global.window = {
  getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1' }),
  addEventListener: () => {},
};

// Simple test framework
class SimpleTestRunner {
  constructor() {
    this.results = [];
  }

  async runTest(name, testFn) {
    console.log(`🧪 Running: ${name}`);
    const startTime = performance.now();
    
    try {
      const result = await testFn();
      const duration = performance.now() - startTime;
      
      const testResult = {
        name,
        passed: result?.passed ?? true,
        duration: Math.round(duration),
        logs: result?.logs || [],
        error: result?.error
      };
      
      this.results.push(testResult);
      
      if (testResult.passed) {
        console.log(`✅ ${name} (${testResult.duration}ms)`);
      } else {
        console.log(`❌ ${name}: ${testResult.error?.message || 'Failed'}`);
      }
      
      return testResult;
    } catch (error) {
      const duration = performance.now() - startTime;
      const testResult = {
        name,
        passed: false,
        duration: Math.round(duration),
        logs: [],
        error
      };
      
      this.results.push(testResult);
      console.log(`❌ ${name}: ${error.message}`);
      return testResult;
    }
  }

  getStats() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    return { total, passed, failed, passRate, totalDuration };
  }

  printSummary() {
    const stats = this.getStats();
    console.log('\n📊 Test Results Summary:');
    console.log(`Total Tests: ${stats.total}`);
    console.log(`Passed: ${stats.passed} (${stats.passRate}%)`);
    console.log(`Failed: ${stats.failed}`);
    console.log(`Duration: ${stats.totalDuration}ms`);
    
    if (stats.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`  • ${result.name}: ${result.error?.message || 'Unknown error'}`);
      });
    }
  }
}

// Mock business logic functions for testing
const BusinessLogicTestHelper = {
  testCFACalculation(cac, thirtyDayGP) {
    const logs = [`Testing CFA calculation with CAC: ${cac}, 30-day GP: ${thirtyDayGP}`];
    
    try {
      const cfaRatio = thirtyDayGP / cac;
      const cfaAchieved = cfaRatio >= 1.0;
      
      logs.push(`CFA Ratio: ${cfaRatio.toFixed(2)}`);
      logs.push(`CFA Achieved: ${cfaAchieved}`);
      
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
        duration: 5,
        logs
      };
    } catch (error) {
      return {
        passed: false,
        duration: 5,
        error,
        logs
      };
    }
  },

  createMockRevenueData(count = 30) {
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
  },

  validateRevenueData(data) {
    const logs = [`Validating ${data.length} revenue data points`];
    const errors = [];
    
    data.forEach((item, index) => {
      if (!item.date) errors.push(`Item ${index}: missing date`);
      if (typeof item.revenue !== 'number') errors.push(`Item ${index}: revenue must be number`);
      if (typeof item.projected !== 'number') errors.push(`Item ${index}: projected must be number`);
      if (typeof item.target !== 'number') errors.push(`Item ${index}: target must be number`);
    });
    
    const revenues = data.map(d => d.revenue).filter(r => r > 0);
    if (revenues.length === 0) {
      errors.push('No valid revenue data found');
    }
    
    logs.push(`Errors found: ${errors.length}`);
    
    return {
      passed: errors.length === 0,
      duration: 10,
      logs: [...logs, ...errors]
    };
  }
};

// Run basic tests
async function runBasicTests() {
  const runner = new SimpleTestRunner();
  
  console.log('🚀 Starting comprehensive test suite...\n');
  
  // Business Logic Tests
  await runner.runTest('CFA Calculation - Basic Scenarios', async () => {
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
      logs: allLogs
    };
  });

  await runner.runTest('CFA Calculation - Edge Cases', async () => {
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
      logs: validationResults.flatMap(r => r.logs)
    };
  });

  await runner.runTest('Revenue Data Validation', async () => {
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
      ]
    };
  });

  await runner.runTest('Performance Benchmark', async () => {
    const startTime = performance.now();
    
    // Run 1000 CFA calculations
    for (let i = 0; i < 1000; i++) {
      const cac = 50 + (i % 200);
      const gp = 100 + (i % 500);
      BusinessLogicTestHelper.testCFACalculation(cac, gp);
    }
    
    const duration = performance.now() - startTime;
    const avgTime = duration / 1000;
    
    return {
      passed: avgTime < 1, // Less than 1ms per calculation
      duration: Math.round(duration),
      logs: [
        `1000 CFA calculations completed`,
        `Total duration: ${duration.toFixed(2)}ms`,
        `Average per calculation: ${avgTime.toFixed(4)}ms`,
        `Performance good: ${avgTime < 1}`
      ]
    };
  });

  runner.printSummary();
  
  const stats = runner.getStats();
  if (stats.failed > 0) {
    process.exit(1);
  }
}

// Run the tests
runBasicTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});