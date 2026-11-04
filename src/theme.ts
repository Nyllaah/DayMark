const palettes = [
  { name: 'Strawberry Milk', colors: ['#F0E9E5', '#FCE5D5', '#F9BEA5', '#F48D82', '#E46782', '#B84A78'], paper: '#FFF6F4', ink: '#452937', accent: '#963C63' },
  { name: 'Lavender Dreams', colors: ['#EFEAF5', '#E6DAFF', '#D3B9FF', '#B69AF0', '#A479D6', '#7950AD'], paper: '#F9F4FF', ink: '#37294A', accent: '#7044A3' },
  { name: 'Matcha Morning', colors: ['#ECEEE3', '#E1ECC7', '#C8DFA7', '#9FC782', '#76A865', '#4D804F'], paper: '#F5F8EC', ink: '#293A26', accent: '#426D43' },
  { name: 'Golden Hour', colors: ['#F2E9DD', '#FDE8BC', '#F9D58D', '#EAB264', '#D88D49', '#AA5D35'], paper: '#FFF8EB', ink: '#493025', accent: '#914C2C' },
] as const;
export { palettes };
export function makeTheme(index: number, dark: boolean) {
  const palette = palettes[index] ?? palettes[0];
  return {
    dark, heat: palette.colors, background: dark ? '#211D25' : palette.paper,
    surface: dark ? '#2F2934' : '#FFFDFB', text: dark ? '#FFF3F5' : palette.ink,
    muted: dark ? '#CFC0CF' : '#6E5964', border: dark ? '#504455' : '#E7D8DD',
    accent: dark ? palette.colors[2] : palette.accent, onAccent: dark ? '#271F2B' : '#FFFFFF',
    tint: dark ? '#3B3041' : palette.colors[1], hero: dark ? '#3B3041' : palette.colors[1],
  };
}

