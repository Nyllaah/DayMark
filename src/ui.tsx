import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View, type TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDaymark } from './state';

export function Copy({ children, size = 15, bold, muted, style }: {
  children: ReactNode; size?: number; bold?: boolean; muted?: boolean; style?: TextStyle;
}) {
  const { theme } = useDaymark();
  return <Text style={[{ color: muted ? theme.muted : theme.text, fontSize: size, fontWeight: bold ? '700' : '400' }, style]}>{children}</Text>;
}

export function Button({ label, onPress, selected, primary, disabled, accessibilityLabel }: {
  label: string; onPress: () => void; selected?: boolean; primary?: boolean; disabled?: boolean; accessibilityLabel?: string;
}) {
  const { theme } = useDaymark();
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? label}
    aria-pressed={selected} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => ({
      minHeight: 44, justifyContent: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 16,
      backgroundColor: primary ? theme.accent : selected ? theme.tint : theme.surface,
      borderWidth: 1, borderColor: selected ? theme.accent : primary ? theme.accent : theme.border,
      opacity: disabled ? 0.45 : pressed ? 0.72 : 1,
    })}>
    <Copy bold size={14} style={primary ? { color: theme.onAccent } : undefined}>{label}</Copy>
  </Pressable>;
}

export function Card({ children }: { children: ReactNode }) {
  const { theme } = useDaymark();
  return <View style={{ backgroundColor: theme.surface, borderRadius: 24, borderWidth: 1, borderColor: theme.border, padding: 18, gap: 12 }}>
    {children}
  </View>;
}

export function Page({ tag, title, intro, children }: { tag: string; title: string; intro: string; children: ReactNode }) {
  const { theme } = useDaymark();
  return <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: theme.background }}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 18, paddingBottom: 30 }}>
      <View style={{ width: '100%', maxWidth: 680, alignSelf: 'center', gap: 16 }}>
        <View style={{ backgroundColor: theme.hero, borderRadius: 28, padding: 23, gap: 8 }}>
          <Copy bold size={12} style={{ letterSpacing: 2, color: theme.accent }}>DAYMARK  /  {tag}</Copy>
          <Copy bold size={36} style={{ letterSpacing: -1.4 }}>{title}</Copy>
          <Copy muted>{intro}</Copy>
        </View>
        {children}
      </View>
    </ScrollView>
  </SafeAreaView>;
}

