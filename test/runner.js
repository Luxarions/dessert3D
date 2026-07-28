/**
 * LXRN Test Runner Entry Point
 * Auto-discovers and imports all *.test.js files dynamically.
 */

import { TestRunner } from './assert.js';

export async function runAllMathTests() {
  const runner = new TestRunner();

  // Dynamically import all test files matching **/*.test.js
  const testModules = import.meta.glob('./**/*.test.js', { eager: true });

  for (const path in testModules) {
    const mod = testModules[path];
    const fileName = path.split('/').pop().replace('.test.js', '');
    const suiteName = fileName;

    // Find exported test object, e.g. Vec2Tests, or default, or first exported object
    const testSuite =
      mod[`${suiteName}Tests`] ||
      mod.default ||
      Object.values(mod).find((val) => typeof val === 'object' && val !== null);

    if (testSuite) {
      runner.addSuite(suiteName, testSuite);
    }
  }

  return await runner.runAll();
}

