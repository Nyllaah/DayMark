import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localDay, monthDays, result, seed, shiftDay, streak, toggle, type Routine } from '../src/domain.ts';

const routine: Routine = {
  id: 'morning', name: 'Morning', from: '2026-03-06',
  habits: [
    { id: 'water', name: 'Water', from: '2026-03-06' },
    { id: 'read', name: 'Read', from: '2026-03-06', until: '2026-03-09' },
    { id: 'walk', name: 'Walk', from: '2026-03-08' },
  ],
};

test('percentage uses individual completions and rounds to a whole percent', () => {
  assert.equal(result(routine, { '2026-03-08': ['read', 'read', 'other'] }, '2026-03-08').percent, 33);
  assert.equal(result(routine, {}, '2026-03-08').percent, 0);
  assert.equal(result({ ...routine, habits: [] }, {}, '2026-03-08').percent, null);
});

test('membership changes and routine deletion preserve earlier dates', () => {
  const archived = { ...routine, until: '2026-03-10' };
  const history = {
    '2026-03-07': ['water', 'read'], '2026-03-08': ['water', 'read'],
    '2026-03-09': ['water', 'walk', 'read'], '2026-03-10': ['water', 'walk'],
  };
  assert.equal(result(archived, history, '2026-03-05').percent, null);
  assert.equal(result(archived, history, '2026-03-07').percent, 100);
  assert.equal(result(archived, history, '2026-03-08').percent, 67);
  assert.deepEqual(result(archived, history, '2026-03-09').completed.map(habit => habit.id), ['water', 'walk']);
  assert.equal(result(archived, history, '2026-03-10').percent, null);
});

test('streak spans membership changes and allows the current day to be unfinished', () => {
  const history = { '2026-03-07': ['water', 'read'], '2026-03-08': ['water', 'read', 'walk'], '2026-03-09': ['water', 'walk'] };
  assert.equal(streak(routine, history, '2026-03-09'), 3);
  assert.equal(streak(routine, history, '2026-03-10'), 3);
  assert.equal(streak(routine, history, '2026-03-11'), 0);
});

test('day keys use local date fields and calendar arithmetic handles leap and DST dates', () => {
  assert.equal(localDay(new Date(2026, 2, 8, 23, 59)), '2026-03-08');
  assert.equal(shiftDay('2026-03-08', 1), '2026-03-09');
  assert.equal(shiftDay('2024-03-01', -1), '2024-02-29');
  assert.equal(shiftDay('2026-01-01', -1), '2025-12-31');
  assert.equal(monthDays(2024, 1).length, 29);
});

test('toggling a sample habit only changes the given day', () => {
  const data = seed('2026-03-07', 'en');
  const once = toggle(data, 'sample-0', '2026-03-07');
  const twice = toggle(toggle(once, 'sample-0', '2026-03-08'), 'sample-0', '2026-03-07');
  assert.equal(data.routines[0].habits.length, 5);
  assert.deepEqual(twice.completions['2026-03-07'], []);
  assert.deepEqual(twice.completions['2026-03-08'], ['sample-0']);
});

