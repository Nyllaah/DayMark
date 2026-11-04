import { useState } from 'react';
import { LayoutAnimation, Modal, Platform, Pressable, TextInput, View } from 'react-native';
import { active, localDay, newId, result, toggle } from '../src/domain';
import { useDaymark } from '../src/state';
import { Button, Card, Copy, Page } from '../src/ui';

type Editor = { routine?: string; habit?: string; isHabit?: boolean; deleting?: boolean };

export default function Today() {
  const { data, update, day, theme, t } = useDaymark();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [name, setName] = useState('');
  const routines = data.routines.filter(routine => active(routine, day));
  const language = data.preferences.language;
  const date = new Intl.DateTimeFormat(language, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  function open(target: Editor, value = '') {
    setName(value);
    setEditor(target);
  }

  function submit() {
    if (!editor) return;
    const value = name.trim();
    if (!editor.deleting && !value) return;
    const today = localDay();
    const id = newId();
    update(current => {
      if (!editor.routine) return {
        ...current, routines: [...current.routines, { id, name: value, from: today, habits: [] }],
      };
      return {
        ...current,
        routines: current.routines.map(routine => {
          if (routine.id !== editor.routine) return routine;
          if (!editor.isHabit) return editor.deleting ? { ...routine, until: today } : { ...routine, name: value };
          const habits = editor.habit
            ? routine.habits.map(habit => habit.id !== editor.habit ? habit
              : editor.deleting ? { ...habit, until: today } : { ...habit, name: value })
            : [...routine.habits, { id, name: value, from: today }];
          return { ...routine, habits };
        }),
      };
    });
    setEditor(null);
  }

  const row = { flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' } as const;
  return <Page tag={t.todayTag} title={t.todayTitle} intro={t.todayIntro}>
    <View style={[row, { justifyContent: 'space-between' }]}>
      <View style={{ gap: 3 }}>
        <Copy muted size={13} style={{ textTransform: 'capitalize' }}>{date}</Copy>
        <Copy bold size={23}>{t.routines}</Copy>
      </View>
      <Button primary label={`＋ ${t.newRoutine}`} onPress={() => open({})} />
    </View>
    {routines.length === 0 && <Card><Copy>{t.emptyToday}</Copy></Card>}
    {routines.map((routine, index) => {
      const { habits, completed, percent } = result(routine, data.completions, day);
      return <Card key={routine.id}>
        <View style={[row, { justifyContent: 'space-between', backgroundColor: theme.tint, padding: 13, borderRadius: 17 }]}>
          <Copy bold size={20} style={{ flexShrink: 1 }}>{['✿', '☀', '✦', '♡'][index % 4]}  {routine.name}</Copy>
          <Copy bold style={{ color: theme.accent }}>{completed.length}/{habits.length} · {percent ?? 0}%</Copy>
        </View>
        <View accessibilityRole="progressbar" accessibilityLabel={routine.name}
          accessibilityValue={{ min: 0, max: 100, now: percent ?? 0 }}
          style={{ height: 8, borderRadius: 8, backgroundColor: theme.border, overflow: 'hidden' }}>
          <View style={{ width: `${percent ?? 0}%`, height: '100%', backgroundColor: theme.accent, borderRadius: 8 }} />
        </View>
        {habits.length === 0 && <Copy muted>{t.emptyHabits}</Copy>}
        {habits.map(habit => {
          const checked = completed.some(item => item.id === habit.id);
          return <View key={habit.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable accessibilityRole="checkbox" accessibilityLabel={habit.name} aria-checked={checked}
              onPress={() => {
                if (Platform.OS === 'ios') LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                update(current => toggle(current, habit.id, localDay()));
              }}
              style={({ pressed }) => ({ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
                minHeight: 46, padding: 8, borderRadius: 13, backgroundColor: checked ? theme.tint : theme.surface, opacity: pressed ? 0.7 : 1 })}>
              <View style={{ width: 24, height: 24, borderWidth: 1, borderColor: theme.accent, borderRadius: 8,
                alignItems: 'center', justifyContent: 'center', backgroundColor: checked ? theme.accent : theme.surface }}>
                {checked && <Copy bold style={{ color: theme.onAccent }}>✓</Copy>}
              </View>
              <Copy style={{ flex: 1 }}>{habit.name}</Copy>
            </Pressable>
            <Button label="✎" accessibilityLabel={`${t.editHabit} · ${habit.name}`} onPress={() => open({ routine: routine.id, habit: habit.id, isHabit: true }, habit.name)} />
          </View>;
        })}
        <View style={row}>
          <Button label={`＋ ${t.addHabit}`} onPress={() => open({ routine: routine.id, isHabit: true })} />
          <Button label={t.editRoutine} onPress={() => open({ routine: routine.id }, routine.name)} />
        </View>
      </Card>;
    })}
    <Modal visible={!!editor} transparent animationType="fade" onRequestClose={() => setEditor(null)}>
      <View style={{ flex: 1, backgroundColor: '#21182499', justifyContent: 'center', padding: 20 }}>
        <View style={{ width: '100%', maxWidth: 460, alignSelf: 'center' }} accessibilityViewIsModal>
          <Card>
            <Copy bold size={22}>{editor?.deleting ? t.removeQuestion : editor?.isHabit
              ? editor.habit ? t.editHabit : t.addHabit : editor?.routine ? t.editRoutine : t.newRoutine}</Copy>
            {editor?.deleting ? <Copy muted>{t.removeHint}</Copy> : <TextInput value={name} onChangeText={setName}
              autoFocus maxLength={80} onSubmitEditing={submit} placeholder={editor?.isHabit ? t.habitName : t.routineName}
              accessibilityLabel={editor?.isHabit ? t.habitName : t.routineName} placeholderTextColor={theme.muted}
              style={{ color: theme.text, borderWidth: 1, borderColor: theme.border, padding: 13, borderRadius: 13, fontSize: 16 }} />}
            <View style={row}>
              <Button label={t.cancel} onPress={() => setEditor(null)} />
              <Button primary label={editor?.deleting ? t.remove : t.save} disabled={!editor?.deleting && !name.trim()} onPress={submit} />
              {editor && !editor.deleting && (editor.isHabit ? editor.habit : editor.routine)
                && <Button label={t.remove} onPress={() => setEditor({ ...editor, deleting: true })} />}
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  </Page>;
}

