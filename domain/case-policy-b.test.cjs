'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { policyDate, reopeningCalendarWindow } = require('./case-policy-b.cjs');

for (const [day, eligible] of [[0,true],[89,true],[90,true],[91,false]]) {
  test(`Policy B calendar Day ${day} eligibility (calculation only)`, () => {
    const completedAt = '2026-01-01T10:00:00.000Z';
    const decisionAt = new Date(Date.parse(completedAt) + day * 86400000).toISOString();
    const result = reopeningCalendarWindow(completedAt, decisionAt);
    assert.equal(result.calendarDays, day); assert.equal(result.eligible, eligible);
  });
}
test('Day90 remains eligible after 2160 elapsed hours until Cairo calendar Day91', () => {
  const completed = '2026-01-01T00:00:00.000Z';
  assert.equal(reopeningCalendarWindow(completed, '2026-04-01T21:59:59.999Z').eligible, true);
  assert.equal(reopeningCalendarWindow(completed, '2026-04-01T22:00:00.000Z').eligible, false);
});
test('completion date comes from Cairo event instant, not UTC or a working date', () => {
  assert.equal(policyDate('2026-01-01T23:00:00.000Z'), '2026-01-02');
  assert.equal(policyDate('2026-07-01T21:30:00.000Z'), '2026-07-02');
});
test('month/year/leap boundary dates retain calendar meaning', () => {
  for (const [completion, day90, day91] of [
    ['2026-12-31', '2027-03-31', '2027-04-01'],
    ['2028-02-28', '2028-05-28', '2028-05-29'],
    ['2028-02-29', '2028-05-29', '2028-05-30']
  ]) {
    const c = completion + 'T12:00:00.000Z';
    assert.equal(reopeningCalendarWindow(c, day90 + 'T12:00:00.000Z').eligible, true);
    assert.equal(reopeningCalendarWindow(c, day91 + 'T12:00:00.000Z').eligible, false);
  }
});
test('Cairo spring and autumn offset transitions use local dates, not fixed offsets', () => {
  assert.equal(policyDate('2026-04-23T21:59:59.999Z'), '2026-04-23');
  assert.equal(policyDate('2026-04-23T22:00:00.000Z'), '2026-04-24');
  assert.equal(policyDate('2026-10-29T20:59:59.999Z'), '2026-10-29');
  assert.equal(policyDate('2026-10-29T21:00:00.000Z'), '2026-10-29');
  assert.equal(policyDate('2026-10-29T22:00:00.000Z'), '2026-10-30');
});
test('untrusted/missing or impossible instants are never fabricated; future closure denies', () => {
  for (const value of [null, undefined, '', '2026-01-01', '2026-02-30T00:00:00.000Z', '0000-01-01T00:00:00.000Z']) {
    assert.throws(() => reopeningCalendarWindow(value, '2026-04-01T12:00:00.000Z'));
  }
  assert.equal(reopeningCalendarWindow('2026-01-01T12:00:00.000Z', '2026-01-01T11:00:00.000Z').eligible, false);
});
test('calendar results are independent of the host process timezone', () => {
  const code = `console.log(JSON.stringify(require('./domain/case-policy-b.cjs').reopeningCalendarWindow('2026-01-01T23:00:00.000Z','2026-04-02T21:59:59.999Z')))`;
  let expected;
  for (const TZ of ['UTC','Africa/Cairo','America/New_York','Asia/Tokyo']) {
    const result = execFileSync(process.execPath, ['-e',code], { cwd:require('node:path').resolve(__dirname,'..'), env:{...process.env,TZ}, encoding:'utf8' }).trim();
    if (expected === undefined) expected = result; else assert.equal(result,expected);
  }
});
