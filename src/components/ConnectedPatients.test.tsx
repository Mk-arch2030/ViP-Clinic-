import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ConnectedPatients } from './ConnectedPatients';
import { Header } from './Header';
import { TEST_ORIGIN } from '../integration/web-api-client';
function withOrigin(origin: string, work: () => void) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', { configurable:true, value:{ location:{ origin } } });
  try { work(); } finally { if (previous) Object.defineProperty(globalThis,'window',previous); else Reflect.deleteProperty(globalThis,'window'); }
}
const props = { currentDay:{ id:'MOCK-DAY', workingDate:'2026-10-10', status:'OPEN' as const, lifecycle:'WORKING' as const, counter:0, openedAt:'2026-10-10' }, actorRole:'Doctor' as const, operatingMode:'DOCTOR_NURSE' as const, onSetActorRole:() => {}, onSetOperatingMode:() => {}, onCloseClinicDay:() => {}, onOpenClinicDay:() => {}, language:'en' as const, onToggleLanguage:() => {}, theme:'light' as const, onToggleTheme:() => {}, dailyVisitsCount:7 };
test('HTTP/Vite patient tab offers fixed HTTPS clinic link without login form or credential transmission', () => {
  withOrigin('http://localhost:3000', () => {
    const html=renderToStaticMarkup(<ConnectedPatients language="en" onIdentity={() => { throw Error('identity emitted during render'); }} />);
    assert.ok(html.includes('href="' + TEST_ORIGIN + '"')); assert.ok(!html.includes('type="password"')); assert.ok(!html.includes('<form'));
  });
});
test('server Header shows persisted-role context without mock role/mode/day controls; demo Header retains them', () => {
  const server=renderToStaticMarkup(<Header {...props} serverMode serverRole="Nurse" />);
  assert.ok(server.includes('Server identity: Nurse')); assert.ok(!server.includes('MOCK-DAY'));
  assert.ok(!server.includes('Toggle Doctor Only')); assert.ok(!server.includes('Close Clinic Day'));
  const demo=renderToStaticMarkup(<Header {...props} />);
  assert.ok(demo.includes('MOCK-DAY')); assert.ok(demo.includes('Toggle Doctor Only'));
});
test('protected patient panel renders current clinic theme classes and begins checking without remembered identity', () => {
  withOrigin(TEST_ORIGIN, () => {
    const html=renderToStaticMarkup(<ConnectedPatients language="en" onIdentity={() => { throw Error('identity emitted during render'); }} />);
    assert.ok(html.includes('Checking session')); assert.ok(html.includes('theme-surface'));
    assert.ok(html.includes('Register patient')); assert.ok(!html.includes('Server identity: Doctor'));
    assert.ok(!html.includes('CPN-1001')); assert.ok(!html.includes('name="role"'));
  });
});
