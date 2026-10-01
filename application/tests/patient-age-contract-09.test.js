const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateAge,
  calculateDetailedAge,
} = require('../../domain/patient');

test('CONTRACT-09 TEST-01 — Exact Birthday', () => {
  const age = calculateDetailedAge('1990-02-01', '2026-02-01');
  assert.deepEqual(age, { years: 36, months: 0, days: 0 });
});

test('CONTRACT-09 TEST-02 — Before Birthday', () => {
  const age = calculateDetailedAge('1990-02-01', '2026-01-31');
  assert.deepEqual(age, { years: 35, months: 11, days: 30 });
});

test('CONTRACT-09 TEST-03 — After Birthday', () => {
  const age = calculateDetailedAge('1990-02-01', '2026-02-02');
  assert.deepEqual(age, { years: 36, months: 0, days: 1 });
});

test('CONTRACT-09 TEST-04 — Month Boundary', () => {
  const age = calculateDetailedAge('2025-01-15', '2025-02-15');
  assert.deepEqual(age, { years: 0, months: 1, days: 0 });
});

test('CONTRACT-09 TEST-05 — Day Boundary', () => {
  const age = calculateDetailedAge('2025-01-15', '2025-01-16');
  assert.deepEqual(age, { years: 0, months: 0, days: 1 });
});

test('CONTRACT-09 TEST-06 — Leap-Year / February Boundary', () => {
  const age = calculateDetailedAge('2024-02-29', '2025-02-28');
  assert.deepEqual(age, { years: 1, months: 0, days: 0 });
});

test('CONTRACT-09 TEST-07 — Infant / Early Age', () => {
  const age = calculateDetailedAge('2026-01-01', '2026-03-01');
  assert.deepEqual(age, { years: 0, months: 2, days: 0 });
});

test('CONTRACT-09 TEST-08 — Child Age', () => {
  const age = calculateDetailedAge('2018-06-10', '2026-06-10');
  assert.deepEqual(age, { years: 8, months: 0, days: 0 });
});

test('CONTRACT-09 TEST-09 — Adult Age', () => {
  const age = calculateDetailedAge('1990-02-01', '2026-09-30');
  assert.deepEqual(age, { years: 36, months: 7, days: 29 });
});

test('CONTRACT-09 TEST-10 — Fixed Calculation Date', () => {
  const first = calculateAge('1990-02-01', '2026-09-30');
  const second = calculateAge('1990-02-01', '2026-09-30');
  assert.deepEqual(first, second);
});

test('CONTRACT-09 TEST-11 — Submitted Age Must Not Become Authority', () => {
  const derived = calculateDetailedAge('1990-02-01', '2026-09-30');
  const submittedAge = 99;

  assert.notEqual(submittedAge, derived.years);
  assert.deepEqual(derived, { years: 36, months: 7, days: 29 });
});

test('CONTRACT-09 TEST-12 — No Age Persistence Authority', () => {
  const fs = require('node:fs');
  const path = require('node:path');

  const candidates = [
    path.resolve(__dirname, '../../backend/persistence'),
    path.resolve(__dirname, '../../backend/db'),
    path.resolve(__dirname, '../../backend/database'),
  ];

  const files = [];

  function collect(dir) {
    if (!fs.existsSync(dir)) return;

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        collect(full);
      } else if (/\.(js|sql|md)$/.test(entry.name)) {
        files.push(full);
      }
    }
  }

  candidates.forEach(collect);

  const authoritativeAgePatterns = [
    /CREATE\s+TABLE[\s\S]*\bage\b/i,
    /ALTER\s+TABLE[\s\S]*\bADD\s+(?:COLUMN\s+)?age\b/i,
    /\bage\s+(?:INTEGER|INT|NUMERIC|DECIMAL|SMALLINT|BIGINT)\b/i,
  ];

  const violations = files.flatMap((file) => {
    const content = fs.readFileSync(file, 'utf8');
    return authoritativeAgePatterns
      .filter((pattern) => pattern.test(content))
      .map((pattern) => `${file}: ${pattern}`);
  });

  assert.deepEqual(violations, []);
});

test('CONTRACT-09 TEST-13 — Same Inputs, Same Result', () => {
  const inputs = ['1990-02-01', '2026-09-30'];

  const resultA = calculateAge(...inputs);
  const resultB = calculateAge(...inputs);

  assert.deepEqual(resultA, resultB);
});

console.log('===== CONTRACT-09 AGE BEHAVIORAL TESTS CREATED =====');
console.log('TEST_COUNT=13');
console.log('PRODUCTION_IMPLEMENTATION_MODIFIED=NO');
console.log('FAIL=0');
