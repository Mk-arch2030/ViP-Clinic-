'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { calculateDetailedAge } = require('./patient');

test('date-only age reference preserves the selected calendar date across process timezones', () => {
  const code = `const {calculateDetailedAge}=require('./domain/patient');console.log(JSON.stringify(calculateDetailedAge('1990-02-01','2026-02-01')))`;
  for (const TZ of ['UTC', 'Africa/Cairo', 'America/New_York', 'Asia/Tokyo']) {
    const output = execFileSync(process.execPath, ['-e', code], { cwd: require('node:path').resolve(__dirname, '..'), env: { ...process.env, TZ }, encoding: 'utf8' });
    assert.deepEqual(JSON.parse(output), { years:36, months:0, days:0 }, TZ);
  }
});
test('invalid calendar reference dates reject instead of silently normalizing', () => {
  for (const date of ['2026-02-30', '2025-02-29', '2026-13-01', '0000-01-01']) {
    assert.throws(() => calculateDetailedAge('1990-02-01', date), /Invalid age reference date/);
  }
  assert.deepEqual(calculateDetailedAge('2024-02-29', '2025-02-28'), { years:1, months:0, days:0 });
});
