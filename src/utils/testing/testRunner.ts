interface TestCase {
  id: string;
  name: string;
  description: string;
  category: 'unit' | 'integration' | 'e2e' | 'performance' | 'accessibility';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  setup?: () => Promise<void>;
  test: () => Promise<TestResult>;
  cleanup?: () => Promise<void>;
  timeout?: number;
  retries?: number;
}

interface TestResult {
  passed: boolean;
  duration: number;
  error?: Error;
  logs: string[];
  metrics?: Record<string, number>;
  screenshots?: string[];
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: TestCase[];
  beforeAll?: () => Promise<void>;
  afterAll?: () => Promise<void>;
  beforeEach?: () => Promise<void>;
  afterEach?: () => Promise<void>;
}

interface TestRunnerConfig {
  parallel: boolean;
  maxConcurrency: number;
  timeout: number;
  retries: number;
  reporter: 'console' | 'json' | 'html';
  outputDir: string;
  screenshots: boolean;
  coverage: boolean;
}

class TestRunner {
  private suites: Map<string, TestSuite> = new Map();
  private results: Map<string, TestResult> = new Map();
  private config: TestRunnerConfig;
  private isRunning = false;
  private currentRun: string | null = null;

  constructor(config: Partial<TestRunnerConfig> = {}) {
    this.config = {
      parallel: true,
      maxConcurrency: 4,
      timeout: 30000,
      retries: 2,
      reporter: 'console',
      outputDir: './test-results',
      screenshots: true,
      coverage: false,
      ...config
    };
  }

  // Suite Management
  addSuite(suite: TestSuite): void {
    this.suites.set(suite.id, suite);
  }

  removeSuite(suiteId: string): void {
    this.suites.delete(suiteId);
  }

  getSuite(suiteId: string): TestSuite | undefined {
    return this.suites.get(suiteId);
  }

  getAllSuites(): TestSuite[] {
    return Array.from(this.suites.values());
  }

  // Test Execution
  async runAllTests(): Promise<Map<string, TestResult>> {
    if (this.isRunning) {
      throw new Error('Test runner is already running');
    }

    this.isRunning = true;
    this.currentRun = `run_${Date.now()}`;
    this.results.clear();

    console.log('🚀 Starting test run...');
    const startTime = Date.now();

    try {
      for (const suite of this.suites.values()) {
        await this.runSuite(suite);
      }

      const duration = Date.now() - startTime;
      await this.generateReport(duration);
      
      console.log(`✅ Test run completed in ${duration}ms`);
      return new Map(this.results);
    } catch (error) {
      console.error('❌ Test run failed:', error);
      throw error;
    } finally {
      this.isRunning = false;
      this.currentRun = null;
    }
  }

  async runSuite(suite: TestSuite): Promise<void> {
    console.log(`📋 Running suite: ${suite.name}`);

    try {
      // Suite setup
      if (suite.beforeAll) {
        await suite.beforeAll();
      }

      // Run tests
      if (this.config.parallel) {
        await this.runTestsParallel(suite);
      } else {
        await this.runTestsSequential(suite);
      }

      // Suite cleanup
      if (suite.afterAll) {
        await suite.afterAll();
      }

      console.log(`✅ Suite completed: ${suite.name}`);
    } catch (error) {
      console.error(`❌ Suite failed: ${suite.name}`, error);
      throw error;
    }
  }

  private async runTestsParallel(suite: TestSuite): Promise<void> {
    const chunks = this.chunkArray(suite.tests, this.config.maxConcurrency);
    
    for (const chunk of chunks) {
      const promises = chunk.map(test => this.runTest(test, suite));
      await Promise.all(promises);
    }
  }

  private async runTestsSequential(suite: TestSuite): Promise<void> {
    for (const test of suite.tests) {
      await this.runTest(test, suite);
    }
  }

  private async runTest(test: TestCase, suite: TestSuite): Promise<void> {
    const testId = `${suite.id}.${test.id}`;
    const timeout = test.timeout || this.config.timeout;
    const retries = test.retries ?? this.config.retries;

    console.log(`🧪 Running test: ${test.name}`);

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Test setup
        if (suite.beforeEach) {
          await suite.beforeEach();
        }
        if (test.setup) {
          await test.setup();
        }

        // Run test with timeout
        const result = await this.runWithTimeout(test.test, timeout);
        
        // Test cleanup
        if (test.cleanup) {
          await test.cleanup();
        }
        if (suite.afterEach) {
          await suite.afterEach();
        }

        this.results.set(testId, result);
        
        if (result.passed) {
          console.log(`✅ ${test.name} (${result.duration}ms)`);
        } else {
          console.log(`❌ ${test.name}: ${result.error?.message}`);
        }
        
        return; // Success, no need to retry
      } catch (error) {
        const isLastAttempt = attempt === retries;
        
        if (isLastAttempt) {
          const failedResult: TestResult = {
            passed: false,
            duration: 0,
            error: error instanceof Error ? error : new Error(String(error)),
            logs: [`Test failed after ${retries + 1} attempts`]
          };
          
          this.results.set(testId, failedResult);
          console.log(`❌ ${test.name}: ${failedResult.error?.message} (failed after ${retries + 1} attempts)`);
        } else {
          console.log(`⚠️ ${test.name}: Attempt ${attempt + 1} failed, retrying...`);
        }
      }
    }
  }

  private async runWithTimeout<T>(fn: () => Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Test timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      fn()
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  // Test Filtering and Selection
  getTestsByCategory(category: TestCase['category']): TestCase[] {
    const allTests: TestCase[] = [];
    for (const suite of this.suites.values()) {
      allTests.push(...suite.tests.filter(test => test.category === category));
    }
    return allTests;
  }

  getTestsByTag(tag: string): TestCase[] {
    const allTests: TestCase[] = [];
    for (const suite of this.suites.values()) {
      allTests.push(...suite.tests.filter(test => test.tags.includes(tag)));
    }
    return allTests;
  }

  getTestsByPriority(priority: TestCase['priority']): TestCase[] {
    const allTests: TestCase[] = [];
    for (const suite of this.suites.values()) {
      allTests.push(...suite.tests.filter(test => test.priority === priority));
    }
    return allTests;
  }

  // Results and Reporting
  getResults(): Map<string, TestResult> {
    return new Map(this.results);
  }

  getPassedTests(): string[] {
    return Array.from(this.results.entries())
      .filter(([_, result]) => result.passed)
      .map(([testId]) => testId);
  }

  getFailedTests(): string[] {
    return Array.from(this.results.entries())
      .filter(([_, result]) => !result.passed)
      .map(([testId]) => testId);
  }

  getTestStats() {
    const total = this.results.size;
    const passed = this.getPassedTests().length;
    const failed = this.getFailedTests().length;
    const passRate = total > 0 ? (passed / total) * 100 : 0;
    
    return {
      total,
      passed,
      failed,
      passRate: Math.round(passRate * 100) / 100,
      duration: this.getTotalDuration()
    };
  }

  private getTotalDuration(): number {
    return Array.from(this.results.values())
      .reduce((total, result) => total + result.duration, 0);
  }

  private async generateReport(totalDuration: number): Promise<void> {
    const stats = this.getTestStats();
    
    switch (this.config.reporter) {
      case 'console':
        this.generateConsoleReport(stats, totalDuration);
        break;
      case 'json':
        await this.generateJsonReport(stats, totalDuration);
        break;
      case 'html':
        await this.generateHtmlReport(stats, totalDuration);
        break;
    }
  }

  private generateConsoleReport(stats: any, totalDuration: number): void {
    console.log('\n📊 Test Results Summary:');
    console.log(`Total Tests: ${stats.total}`);
    console.log(`Passed: ${stats.passed} (${stats.passRate}%)`);
    console.log(`Failed: ${stats.failed}`);
    console.log(`Duration: ${totalDuration}ms`);
    
    if (stats.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.getFailedTests().forEach(testId => {
        const result = this.results.get(testId);
        console.log(`  • ${testId}: ${result?.error?.message}`);
      });
    }
  }

  private async generateJsonReport(stats: any, totalDuration: number): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      runId: this.currentRun,
      stats,
      totalDuration,
      results: Object.fromEntries(this.results),
      config: this.config
    };

    if (typeof window === 'undefined') {
      // Node.js environment - save to file
      console.log('JSON report generated (would save to file in Node.js)');
    } else {
      // Browser environment - save to localStorage or download
      localStorage.setItem('testReport', JSON.stringify(report, null, 2));
      console.log('JSON report saved to localStorage');
    }
  }

  private async generateHtmlReport(stats: any, totalDuration: number): Promise<void> {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Results - ${new Date().toLocaleString()}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .passed { color: #22c55e; }
        .failed { color: #ef4444; }
        .test-result { margin: 10px 0; padding: 10px; border-left: 4px solid #ddd; }
        .test-result.passed { border-color: #22c55e; }
        .test-result.failed { border-color: #ef4444; }
    </style>
</head>
<body>
    <h1>Test Results</h1>
    <div class="summary">
        <h2>Summary</h2>
        <p>Total Tests: ${stats.total}</p>
        <p>Passed: <span class="passed">${stats.passed}</span> (${stats.passRate}%)</p>
        <p>Failed: <span class="failed">${stats.failed}</span></p>
        <p>Duration: ${totalDuration}ms</p>
    </div>
    
    <h2>Test Results</h2>
    ${Array.from(this.results.entries()).map(([testId, result]) => `
        <div class="test-result ${result.passed ? 'passed' : 'failed'}">
            <h3>${testId}</h3>
            <p>Status: ${result.passed ? 'PASSED' : 'FAILED'}</p>
            <p>Duration: ${result.duration}ms</p>
            ${result.error ? `<p>Error: ${result.error.message}</p>` : ''}
        </div>
    `).join('')}
</body>
</html>
    `;

    // In a real environment, you'd save this to a file or display it
    console.log('HTML report generated');
  }

  // Utility Methods
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Mock/Stub Utilities
  createMock<T extends object>(implementation: Partial<T> = {}): T {
    return new Proxy(implementation as T, {
      get(target, prop) {
        if (prop in target) {
          return target[prop as keyof T];
        }
        
        // Return a mock function for missing methods
        return jest.fn();
      }
    });
  }

  createStub(returnValue?: any): jest.Mock {
    return jest.fn().mockReturnValue(returnValue);
  }

  // Test Data Helpers
  generateTestData<T>(template: T, count: number = 1): T[] {
    const data: T[] = [];
    for (let i = 0; i < count; i++) {
      data.push({
        ...template,
        // Add some variation based on index
        ...(typeof template === 'object' && template !== null ? { id: i } : {})
      } as T);
    }
    return data;
  }
}

// Export singleton instance
export const testRunner = new TestRunner();

export {
  TestCase,
  TestResult,
  TestSuite,
  TestRunnerConfig,
  TestRunner
};