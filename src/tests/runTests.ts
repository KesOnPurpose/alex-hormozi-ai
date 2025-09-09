import { testRunner } from '@/utils/testing/testRunner';
import { businessLogicTests } from './suites/businessLogicTests';
import { uiTests } from './suites/uiTests';

// Register all test suites
testRunner.addSuite(businessLogicTests);
testRunner.addSuite(uiTests);

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive test suite...');
  
  try {
    const results = await testRunner.runAllTests();
    
    const stats = testRunner.getTestStats();
    console.log('\n📊 Final Results:');
    console.log(`Total: ${stats.total}`);
    console.log(`Passed: ${stats.passed}`);
    console.log(`Failed: ${stats.failed}`);
    console.log(`Pass Rate: ${stats.passRate}%`);
    console.log(`Duration: ${stats.duration}ms`);
    
    if (stats.failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Test run failed:', error);
    process.exit(1);
  }
}

// Export for programmatic usage
export { testRunner, runAllTests };

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}