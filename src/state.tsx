import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AppState, Platform, Pressable, Text, View, useColorScheme } from 'react-native';
import { localDay, seed, type Data } from './domain';
import { strings } from './locale';
import { load, save } from './storage';
import { makeTheme } from './theme';

type State = { data: Data; update: (fn: (data: Data) => Data) => void; day: string;
  theme: ReturnType<typeof makeTheme>; t: ReturnType<typeof strings> };
const Context = createContext<State | null>(null);
export function useDaymark() {
  const context = useContext(Context);
  if (!context) throw new Error('Daymark provider is missing');
  return context;
}

export function DaymarkProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [day, setDay] = useState(localDay);
  const [data, setData] = useState<Data | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [saveAttempt, setSaveAttempt] = useState(0);
  const [readError, setReadError] = useState(false);
  const [writeError, setWriteError] = useState(false);
  const language = data?.preferences.language ?? 'en';
  const appearance = data?.preferences.appearance ?? 'system';
  const theme = makeTheme(data?.preferences.palette ?? 0, appearance === 'system' ? system === 'dark' : appearance === 'dark');
  const t = strings(language);

  useEffect(() => {
    if (Platform.OS === 'web') document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const refresh = () => setDay(localDay());
    const timer = setInterval(refresh, 1000);
    const listener = AppState.addEventListener('change', refresh);
    return () => { clearInterval(timer); listener.remove(); };
  }, []);

  useEffect(() => {
    let current = true;
    load().then(saved => {
      if (!current) return;
      const locale = Intl.DateTimeFormat().resolvedOptions().locale;
      setData(saved ?? seed(localDay(), locale.startsWith('pt') ? 'pt-BR' : 'en'));
    }).catch(() => { if (current) setReadError(true); });
    return () => { current = false; };
  }, [attempt]);

  useEffect(() => {
    if (!data) return;
    let current = true;
    save(data).then(() => { if (current) setWriteError(false); })
      .catch(() => { if (current) setWriteError(true); });
    return () => { current = false; };
  }, [data, saveAttempt]);

  if (!data) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background }}>
    <Text style={{ color: theme.text }}>{readError ? t.readError : t.loading}</Text>
    {readError && <Pressable accessibilityRole="button" onPress={() => { setReadError(false); setAttempt(n => n + 1); }}>
      <Text style={{ color: theme.accent, padding: 12 }}>{t.retry}</Text>
    </Pressable>}
  </View>;

  return <Context.Provider value={{ data, update: fn => setData(current => current && fn(current)), day, theme, t }}>
    {writeError && <Pressable accessibilityRole="button" onPress={() => setSaveAttempt(n => n + 1)}
      style={{ padding: 12, backgroundColor: theme.tint }}>
      <Text style={{ color: theme.text, textAlign: 'center' }}>{t.writeError} · {t.retry}</Text>
    </Pressable>}
    {children}
  </Context.Provider>;
}

