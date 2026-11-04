import { View } from 'react-native';
import type { Preferences } from '../src/domain';
import { useDaymark } from '../src/state';
import { palettes } from '../src/theme';
import { Button, Card, Copy, Page } from '../src/ui';

export default function Settings() {
  const { data, update, t } = useDaymark();
  const preferences = data.preferences;
  const change = (patch: Partial<Preferences>) =>
    update(current => ({ ...current, preferences: { ...current.preferences, ...patch } }));
  const row = { flexDirection: 'row', flexWrap: 'wrap', gap: 8 } as const;

  return <Page tag={t.settingsTag} title={t.settingsTitle} intro={t.settingsIntro}>
    <Card>
      <Copy bold size={20}>{t.palette}</Copy>
      {palettes.map((palette, index) => <View key={palette.name} style={[row, { alignItems: 'center' }]}>
        <Button label={palette.name} selected={preferences.palette === index} onPress={() => change({ palette: index })} />
        <View style={row}>{palette.colors.map(color => <View key={color} style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: color }} />)}</View>
      </View>)}
    </Card>
    <Card>
      <Copy bold size={20}>{t.appearance}</Copy>
      <View style={row}>{(['light', 'dark', 'system'] as const).map(appearance =>
        <Button key={appearance} label={t[appearance]} selected={preferences.appearance === appearance} onPress={() => change({ appearance })} />)}
      </View>
    </Card>
    <Card>
      <Copy bold size={20}>{t.language}</Copy>
      <View style={row}>
        <Button label="English" selected={preferences.language === 'en'} onPress={() => change({ language: 'en' })} />
        <Button label="Português (Brasil)" selected={preferences.language === 'pt-BR'} onPress={() => change({ language: 'pt-BR' })} />
      </View>
    </Card>
    <Copy muted size={13}>{t.localNote}</Copy>
  </Page>;
}

