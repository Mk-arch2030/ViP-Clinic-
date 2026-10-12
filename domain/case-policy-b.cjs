'use strict';

// Calendar computation only. This is NOT authentication, state mutation or a
// declaration that caller-supplied completion evidence is trusted.
const POLICY_TIMEZONE = 'Africa/Cairo';
const calendar = new Intl.DateTimeFormat('en-CA', {
  timeZone: POLICY_TIMEZONE, calendar: 'gregory', numberingSystem: 'latn',
  year: 'numeric', month: '2-digit', day: '2-digit'
});
function policyDate(instant) {
  if (typeof instant !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(instant)) throw new Error('Invalid event instant');
  const date = new Date(instant);
  if (Number.isNaN(date.getTime()) || date.toISOString() !== instant || date.getUTCFullYear() < 1) throw new Error('Invalid event instant');
  const parts = Object.fromEntries(calendar.formatToParts(date).map(p => [p.type, p.value]));
  return `${parts.year.padStart(4, '0')}-${parts.month}-${parts.day}`;
}
function reopeningCalendarWindow(completedAt, decisionAt) {
  const completionDate = policyDate(completedAt);
  const decisionDate = policyDate(decisionAt);
  const calendarDays = Math.round((Date.parse(decisionDate + 'T00:00:00.000Z') - Date.parse(completionDate + 'T00:00:00.000Z')) / 86400000);
  // A genuinely earlier decision instant is invalid even on the same local date.
  const chronological = Date.parse(decisionAt) >= Date.parse(completedAt);
  return Object.freeze({ policyTimezone: POLICY_TIMEZONE, completionDate, decisionDate, calendarDays,
    eligible: chronological && calendarDays >= 0 && calendarDays <= 90 });
}
module.exports = { POLICY_TIMEZONE, policyDate, reopeningCalendarWindow };
