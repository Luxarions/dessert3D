/**
 * LXRN Test Assertion Library & Suite Runner
 */

export class TestRunner {
  constructor() {
    this.suites = [];
    this.results = [];
  }

  addSuite(name, testFns) {
    this.suites.push({ name, testFns });
  }

  async runAll() {
    this.results = [];
    let totalPassed = 0;
    let totalFailed = 0;
    const startTime = performance.now();

    for (const suite of this.suites) {
      const suiteResult = {
        name: suite.name,
        passed: 0,
        failed: 0,
        tests: []
      };

      for (const [testName, fn] of Object.entries(suite.testFns)) {
        const testStart = performance.now();
        try {
          await fn();
          const duration = (performance.now() - testStart).toFixed(2);
          suiteResult.passed++;
          suiteResult.tests.push({ name: testName, status: 'PASSED', duration });
        } catch (err) {
          const duration = (performance.now() - testStart).toFixed(2);
          suiteResult.failed++;
          suiteResult.tests.push({ name: testName, status: 'FAILED', duration, error: err.message || String(err) });
        }
      }

      totalPassed += suiteResult.passed;
      totalFailed += suiteResult.failed;
      this.results.push(suiteResult);
    }

    const totalDuration = (performance.now() - startTime).toFixed(2);
    return {
      results: this.results,
      totalPassed,
      totalFailed,
      totalDuration,
      totalTests: totalPassed + totalFailed
    };
  }
}

export function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new Error(message);
  }
}

export function assertTrue(value, message = 'Expected value to be true') {
  assert(value === true, `${message} - Got: ${value}`);
}

export function assertFalse(value, message = 'Expected value to be false') {
  assert(value === false, `${message} - Got: ${value}`);
}

export function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message ? message + ': ' : ''}Expected ${expected}, but got ${actual}`);
  }
}

export function assertAlmostEqual(actual, expected, epsilon = 0.0001, message = '') {
  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(`${message ? message + ': ' : ''}Expected ~${expected}, got ${actual} (diff: ${Math.abs(actual - expected)})`);
  }
}

export function assertVec3Equal(actual, expected, epsilon = 0.0001, message = '') {
  assertAlmostEqual(actual.x, expected.x, epsilon, `${message} [X]`);
  assertAlmostEqual(actual.y, expected.y, epsilon, `${message} [Y]`);
  assertAlmostEqual(actual.z, expected.z, epsilon, `${message} [Z]`);
}

export function assertVec2Equal(actual, expected, epsilon = 0.0001, message = '') {
  assertAlmostEqual(actual.x, expected.x, epsilon, `${message} [X]`);
  assertAlmostEqual(actual.y, expected.y, epsilon, `${message} [Y]`);
}
