# Testing Infrastructure

## Overview

This project includes a comprehensive testing framework designed to validate business logic, UI components, performance, and accessibility. The testing infrastructure supports parallel execution, retries, and multiple reporting formats.

## Test Structure

### Core Components

1. **Test Runner** (`/src/utils/testing/testRunner.ts`)
   - Parallel and sequential test execution
   - Configurable timeout and retry mechanisms
   - Multiple reporting formats (console, JSON, HTML)
   - Test filtering by category, tag, or priority

2. **Test Helpers** (`/src/utils/testing/testHelpers.ts`)
   - DOM manipulation utilities
   - API testing helpers
   - Performance measurement tools
   - Business logic validators
   - Accessibility compliance checkers

3. **Test Suites**
   - **Business Logic Tests** (`/src/tests/suites/businessLogicTests.ts`)
   - **UI Tests** (`/src/tests/suites/uiTests.ts`)

## Running Tests

### Basic Test Execution
```bash
npm test
```

### Verbose Output
```bash
npm run test:verbose
```

### Direct Node.js Execution
```bash
node test.js
```

## Test Categories

### Business Logic Tests
- **CFA Calculations**: Customer Acquisition Cost vs 30-day Gross Profit validation
- **Revenue Data Validation**: Data structure and consistency checks
- **Business Profile Creation**: User profile validation and requirement checks
- **Growth Calculations**: Revenue growth rate computations
- **Performance Benchmarks**: Calculation speed and efficiency tests

### UI Tests
- **Dashboard Components**: Element presence and functionality
- **Live Button Tests**: Critical functionality that previously crashed
- **Settings Navigation**: Tab switching and URL parameter handling
- **Responsive Design**: Mobile, tablet, and desktop viewport testing
- **Accessibility Compliance**: WCAG AA standards validation

## Test Configuration

### TestRunnerConfig Options
```typescript
{
  parallel: boolean;          // Enable parallel execution
  maxConcurrency: number;     // Max concurrent tests
  timeout: number;            // Default timeout (ms)
  retries: number;            // Retry attempts on failure
  reporter: 'console' | 'json' | 'html';
  outputDir: string;          // Output directory for reports
  screenshots: boolean;       // Enable screenshot capture
  coverage: boolean;          // Enable code coverage
}
```

### Test Case Structure
```typescript
{
  id: string;                 // Unique test identifier
  name: string;               // Human-readable test name
  description: string;        // Test description
  category: 'unit' | 'integration' | 'e2e' | 'performance' | 'accessibility';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];            // Filterable tags
  test: () => Promise<TestResult>;
  setup?: () => Promise<void>;
  cleanup?: () => Promise<void>;
  timeout?: number;          // Override default timeout
  retries?: number;          // Override default retries
}
```

## Business Logic Validation

### CFA (Client Financed Acquisition) Testing
The framework includes comprehensive CFA calculation validation:
- Basic scenarios with various CAC/GP ratios
- Edge cases with zero/negative values
- Validation rule enforcement
- Performance benchmarking

### Revenue Data Testing
- Data structure validation
- Required field verification
- Type checking and consistency
- Growth rate calculations

## UI Component Testing

### Dashboard Validation
- Quick action button presence
- Navigation functionality
- Chart rendering verification
- Responsive layout testing

### Settings Integration Testing
- Tab navigation (profile, preferences, privacy, display, A/B testing, monitoring)
- URL parameter handling
- Component embedding validation

### Accessibility Testing
- Keyboard navigation verification
- ARIA label compliance
- Color contrast validation
- Screen reader compatibility

## Performance Monitoring

The framework includes performance benchmarks for:
- Business logic calculations (target: <1ms per calculation)
- Data generation (target: <100ms for 365 data points)
- Data validation (target: <50ms)
- Component rendering (target: 60fps threshold)

## Extending the Framework

### Adding New Test Suites
1. Create new test suite file in `/src/tests/suites/`
2. Import and register with test runner
3. Follow existing patterns for consistency

### Custom Test Helpers
Add domain-specific helpers to `/src/utils/testing/testHelpers.ts`:
- Extend existing helper classes
- Maintain consistent return types
- Include comprehensive error handling

### Browser Testing Integration
The framework is designed to work with Playwright for browser automation:
- Visual regression testing
- Cross-browser validation
- Mobile device simulation
- Screenshot comparison

## Test Results

### Console Output
- Real-time test execution status
- Pass/fail summary with statistics
- Failed test details with error messages
- Performance metrics and duration

### JSON Reports
Detailed test results saved to localStorage (browser) or file system (Node.js):
- Complete test execution data
- Metrics and timing information
- Configuration details
- Error stack traces

### HTML Reports
Formatted HTML output with:
- Visual test result summary
- Color-coded pass/fail indicators
- Test details and error information
- Responsive layout for easy viewing

## Best Practices

1. **Write Focused Tests**: Each test should validate a single concern
2. **Use Descriptive Names**: Test names should clearly indicate what is being tested
3. **Include Edge Cases**: Test boundary conditions and error scenarios
4. **Performance Awareness**: Include timing expectations for critical operations
5. **Accessibility First**: Validate WCAG compliance for all UI components
6. **Visual Evidence**: Capture screenshots for UI-related validations
7. **Error Handling**: Comprehensive error boundaries and failure recovery

## Integration with Development Workflow

The testing infrastructure integrates with:
- **Development Server**: Real-time validation during development
- **Build Process**: Pre-deployment validation
- **Continuous Integration**: Automated testing pipelines
- **Code Reviews**: Quality gates and validation requirements

## Troubleshooting

### Common Issues
1. **Timeout Errors**: Increase timeout values for slow operations
2. **Parallel Execution Failures**: Reduce maxConcurrency for resource-constrained environments
3. **Browser Environment**: Ensure proper mocking for Node.js execution
4. **Dependency Issues**: Verify all required dependencies are available

### Debug Mode
Enable verbose logging by running tests with debug flags or modifying log levels in test configuration.