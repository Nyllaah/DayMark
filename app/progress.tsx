import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { active, calendarDate, monthDays, result, streak, type Day } from '../src/domain';
import { useDaymark } from '../src/state';
import { Button, Card, Copy, Page } from '../src/ui';

const months = Array.from({ length: 12 }, (_, index) => index);
const week = Array.from({ length: 7 }, (_, index) => new Date(Date.UTC(2024, 0, 7 + index)));

export default function Progress() {
  const { data, day, theme, t } = useDaymark();
  const [routineId, setRoutineId] = useState('');
  const [yearMode, setYearMode] = useState(false);
  const [period, setPeriod] = useState(() => ({ year: Number(day.slice(0, 4)), month: Number(day.slice(5, 7)) - 1 }));
  const [selected, setSelected] = useState<Day | null>(day);
  const routines = data.routines.filter(item => !item.until || item.from < item.until);
  const routine = routines.find(item => item.id === routineId) ?? routines.find(item => active(item, day)) ?? routines[0];
  const language = data.preferences.language;
  const format = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(language, { ...options, timeZone: 'UTC' }).format(date);
  const detail = routine && selected ? result(routine, data.completions, selected) : null;
  const monthName = (month: number, style: 'short' | 'long') => format(new Date(Date.UTC(period.year, month, 1)), { month: style });
  const row = { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 } as const;

  function move(delta: number) {
    const date = new Date(Date.UTC(period.year + (yearMode ? delta : 0), period.month + (yearMode ? 0 : delta), 1));
    setPeriod({ year: date.getUTCFullYear(), month: date.getUTCMonth() });
    setSelected(null);
  }

  function grid(month: number) {
    if (!routine) return null;
    const days = monthDays(period.year, month);
    const offset = calendarDate(days[0]).getUTCDay();
    const cells = [...Array<null>(offset).fill(null), ...days];
    while (cells.length % 7) cells.push(null);

    return <View key={month} style={{ gap: 4, flexGrow: 1, flexBasis: yearMode ? 140 : '100%' }}>
      {yearMode && <Copy bold size={14} style={{ textTransform: 'capitalize' }}>{monthName(month, 'short')}</Copy>}
      {!yearMode && <View style={{ flexDirection: 'row', gap: 4 }}>
        {week.map((weekday, index) => <View key={index} style={{ flex: 1, alignItems: 'center' }}>
          <Copy muted size={11}>{format(weekday, { weekday: 'short' })}</Copy>
        </View>)}
      </View>}
      {Array.from({ length: cells.length / 7 }, (_, index) => <View key={index} style={{ flexDirection: 'row', gap: 4 }}>
        {cells.slice(index * 7, index * 7 + 7).map((date, column) => {
          if (!date) return <View key={column} style={{ flex: 1 }} />;
          const percent = date <= day ? result(routine, data.completions, date).percent : null;
          const color = percent === null ? theme.surface : theme.heat[Math.ceil(percent / 20)];
          const label = format(calendarDate(date), { dateStyle: 'long' });
          return <Pressable key={column} accessibilityRole="button" aria-pressed={date === selected}
            accessibilityLabel={`${label} · ${percent === null ? t.unavailable : `${percent}%`}`}
            onPress={() => setSelected(date)} style={({ pressed }) => ({
              flex: 1, height: yearMode ? 22 : 42, borderRadius: yearMode ? 5 : 9, alignItems: 'center', justifyContent: 'center',
              backgroundColor: color, borderWidth: date === selected ? 2 : 1,
              borderColor: date === selected ? theme.accent : percent === null ? theme.border : color,
              opacity: pressed ? 0.65 : 1,
            })}>
            {!yearMode && <Copy size={13} bold style={percent === null ? undefined : { color: percent > 80 ? '#FFF' : '#241923' }}>{Number(date.slice(8))}</Copy>}
          </Pressable>;
        })}
      </View>)}
    </View>;
  }

  return <Page tag={t.progressTag} title={t.progressTitle} intro={t.progressIntro}>
    {!routine ? <Card><Copy>{t.emptyProgress}</Copy></Card> : <>
      <Card>
        <Copy bold size={18}>{t.chooseRoutine}</Copy>
        <View style={row}>{routines.map(item => <Button key={item.id} label={item.until ? `${item.name} · ${t.archived}` : item.name}
          selected={item.id === routine.id} onPress={() => setRoutineId(item.id)} />)}</View>
        {active(routine, day) && <Copy muted>✦  {streak(routine, data.completions, day)} {t.streak}</Copy>}
      </Card>
      {selected && detail && <Card>
        <Copy bold size={17}>{format(calendarDate(selected), { dateStyle: 'long' })}</Copy>
        <Copy muted>{detail.percent === null || selected > day ? t.unavailable : `${t.completed} · ${detail.completed.length}/${detail.habits.length} · ${detail.percent}%`}</Copy>
        {detail.percent !== null && selected <= day && (detail.completed.length
          ? detail.completed.map(habit => <Copy key={habit.id}>✓  {habit.name}</Copy>)
          : <Copy>{t.noCompleted}</Copy>)}
      </Card>}
      <Card>
        <View style={[row, { justifyContent: 'space-between' }]}>
          <View style={row}>
            <Button label={t.month} selected={!yearMode} onPress={() => setYearMode(false)} />
            <Button label={t.year} selected={yearMode} onPress={() => setYearMode(true)} />
          </View>
          <View style={row}>
            <Button label="‹" accessibilityLabel={t.previous} onPress={() => move(-1)} />
            <Button label="›" accessibilityLabel={t.next} onPress={() => move(1)} />
          </View>
        </View>
        <Copy bold size={22} style={{ textTransform: 'capitalize' }}>
          {yearMode ? period.year : `${monthName(period.month, 'long')} ${period.year}`}
        </Copy>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>{(yearMode ? months : [period.month]).map(grid)}</View>
        <View style={row}>
          <Copy muted size={12}>{t.less}</Copy>
          {theme.heat.map(color => <View key={color} style={{ width: 16, height: 16, borderRadius: 5, backgroundColor: color }} />)}
          <Copy muted size={12}>{t.more}</Copy>
        </View>
      </Card>
    </>}
  </Page>;
}

