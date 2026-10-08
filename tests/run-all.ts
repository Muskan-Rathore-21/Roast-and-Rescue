/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { execSync } from 'child_process';

console.log('========================================================');
console.log('🚀 ROAST & RESCUE MASTER TEST & ACCESSIBILITY RUNNER 🚀');
console.log('========================================================\n');

const testSuites = [
  { name: 'Deterministic Scoring Suite', file: 'tests/scoring.test.ts' },
  { name: 'WCAG 2.1 AA Accessibility (A11y) Suite', file: 'tests/accessibility.test.ts' },
  { name: 'Components & Edge Cases Suite', file: 'tests/components.test.ts' },
];

let allPassed = true;

for (const suite of testSuites) {
  console.log(`▶ Running: ${suite.name}...`);
  try {
    const output = execSync(`npx tsx ${suite.file}`, { encoding: 'utf-8', stdio: 'inherit' });
  } catch (err) {
    allPassed = false;
    console.error(`❌ Suite failed: ${suite.name}`);
    process.exit(1);
  }
}

if (allPassed) {
  console.log('\n========================================================');
  console.log('🎉 ALL TEST SUITES & ACCESSIBILITY AUDITS PASSED 100%! 🎉');
  console.log('========================================================\n');
}
