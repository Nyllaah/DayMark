import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DaymarkProvider, useDaymark } from '../src/state';
import { Copy } from '../src/ui';

function Navigation() {
  const { theme, t } = useDaymark();
  return <>
    <StatusBar style={theme.dark ? 'light' : 'dark'} />
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: theme.accent, tabBarInactiveTintColor: theme.muted,
      tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
      tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border } }}>
      <Tabs.Screen name="index" options={{ title: t.today, tabBarIcon: ({ color }) => <Copy size={19} style={{ color }}>☀</Copy> }} />
      <Tabs.Screen name="progress" options={{ title: t.progress, tabBarIcon: ({ color }) => <Copy size={19} style={{ color }}>▦</Copy> }} />
      <Tabs.Screen name="settings" options={{ title: t.settings, tabBarIcon: ({ color }) => <Copy size={19} style={{ color }}>⚙</Copy> }} />
    </Tabs>
  </>;
}
export default function Layout() {
  return <SafeAreaProvider><DaymarkProvider><Navigation /></DaymarkProvider></SafeAreaProvider>;
}

