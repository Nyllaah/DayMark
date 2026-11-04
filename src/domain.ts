export type Day = string;
export type Habit = { id: string; name: string; from: Day; until?: Day };
export type Routine = { id: string; name: string; from: Day; until?: Day; habits: Habit[] };
export type Completion = Record<Day, string[]>;
export type Preferences = { palette: number; appearance: 'light' | 'dark' | 'system'; language: 'en' | 'pt-BR' };
export type Data = { routines: Routine[]; completions: Completion; preferences: Preferences };

const pad = (value: number) => String(value).padStart(2, '0');
export const localDay = (date = new Date()): Day =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const calendarDate = (day: Day) => new Date(`${day}T00:00:00Z`);
export function shiftDay(day: Day, offset: number): Day {
  const date = calendarDate(day);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}
export function monthDays(year: number, month: number): Day[] {
  const length = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return Array.from({ length }, (_, index) => `${year}-${pad(month + 1)}-${pad(index + 1)}`);
}
export const active = (item: { from: Day; until?: Day }, day: Day) =>
  item.from <= day && (!item.until || day < item.until);

export function result(routine: Routine, completions: Completion, day: Day) {
  const habits = active(routine, day) ? routine.habits.filter(habit => active(habit, day)) : [];
  const done = new Set(completions[day]);
  const completed = habits.filter(habit => done.has(habit.id));
  return { habits, completed, percent: habits.length ? Math.round(completed.length / habits.length * 100) : null };
}

export function streak(routine: Routine, completions: Completion, today: Day): number {
  let day = result(routine, completions, today).percent === 100 ? today : shiftDay(today, -1);
  let count = 0;
  while (result(routine, completions, day).percent === 100) {
    count++;
    day = shiftDay(day, -1);
  }
  return count;
}

export function toggle(data: Data, habit: string, day: Day): Data {
  const done = data.completions[day] ?? [];
  return { ...data, completions: { ...data.completions, [day]: done.includes(habit)
    ? done.filter(id => id !== habit) : [...done, habit] } };
}

export function seed(today: Day, language: Preferences['language']): Data {
  const names = language === 'en'
    ? ['Drink a glass of water', 'Stretch for five minutes', 'Make the bed', 'Eat breakfast', 'Plan the day']
    : ['Beber um copo de água', 'Alongar por cinco minutos', 'Arrumar a cama', 'Tomar café da manhã', 'Planejar o dia'];
  return {
    routines: [{ id: 'morning', from: today, name: language === 'en' ? 'Morning Routine' : 'Rotina da manhã',
      habits: names.map((name, index) => ({ id: `sample-${index}`, name, from: today })) }],
    completions: {},
    preferences: { palette: 0, appearance: 'system', language },
  };
}

let sequence = 0;
export const newId = () => `${Date.now().toString(36)}-${(sequence++).toString(36)}-${Math.random().toString(36).slice(2)}`;

