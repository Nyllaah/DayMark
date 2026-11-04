import type { Preferences } from './domain';
const en = {
  today: 'Today', progress: 'Progress', settings: 'Settings', todayTag: '✦  ONE DAY AT A TIME', todayTitle: 'Make today count.',
  todayIntro: 'Small rituals make good days.', progressTag: '✦  YOUR GROWTH', progressTitle: 'Little wins add up.',
  progressIntro: 'See the days you showed up for yourself.', settingsTag: '✦  MAKE IT YOURS', settingsTitle: 'Your Daymark.',
  settingsIntro: 'A little space that feels like you.', routines: 'Your routines', newRoutine: 'New routine',
  editRoutine: 'Edit routine', addHabit: 'Add habit', editHabit: 'Edit habit', routineName: 'Routine name',
  habitName: 'Habit name', cancel: 'Cancel', save: 'Save', remove: 'Delete', edit: 'Edit',
  removeQuestion: 'Delete this item?', removeHint: 'Earlier days will stay in your history.',
  emptyToday: 'Start with one small routine.', emptyHabits: 'Add a habit to get started.', emptyProgress: 'Create a routine to start tracking your progress.',
  month: 'Month', year: 'Year', less: '0%', more: '100%', unavailable: 'No routine that day', archived: 'Archived',
  previous: 'Previous period', next: 'Next period', chooseRoutine: 'Choose a routine', completed: 'Completed',
  noCompleted: 'No habits completed.', palette: 'Color palette', appearance: 'Appearance', language: 'Language',
  light: 'Light', dark: 'Dark', system: 'System', loading: 'Opening Daymark…', readError: 'Could not open local data.',
  writeError: 'Your changes could not be saved on this device.', retry: 'Retry', streak: 'day streak',
  localNote: '♡  Your routines and progress are stored on this device.',
};
const pt: typeof en = {
  today: 'Hoje', progress: 'Progresso', settings: 'Configurações', todayTag: '✦  UM DIA DE CADA VEZ', todayTitle: 'Faça o dia valer.',
  todayIntro: 'Pequenos rituais fazem bons dias.', progressTag: '✦  SEU CRESCIMENTO', progressTitle: 'Cada conquista conta.',
  progressIntro: 'Veja os dias em que você cuidou de si.', settingsTag: '✦  DO SEU JEITO', settingsTitle: 'Seu Daymark.',
  settingsIntro: 'Um cantinho com a sua cara.', routines: 'Suas rotinas', newRoutine: 'Nova rotina',
  editRoutine: 'Editar rotina', addHabit: 'Adicionar hábito', editHabit: 'Editar hábito', routineName: 'Nome da rotina',
  habitName: 'Nome do hábito', cancel: 'Cancelar', save: 'Salvar', remove: 'Excluir', edit: 'Editar',
  removeQuestion: 'Excluir este item?', removeHint: 'Os dias anteriores continuarão no seu histórico.',
  emptyToday: 'Comece com uma pequena rotina.', emptyHabits: 'Adicione um hábito para começar.', emptyProgress: 'Crie uma rotina para acompanhar seu progresso.',
  month: 'Mês', year: 'Ano', less: '0%', more: '100%', unavailable: 'Sem rotina neste dia', archived: 'Arquivada',
  previous: 'Período anterior', next: 'Próximo período', chooseRoutine: 'Escolha uma rotina', completed: 'Concluídos',
  noCompleted: 'Nenhum hábito concluído.', palette: 'Paleta de cores', appearance: 'Aparência', language: 'Idioma',
  light: 'Claro', dark: 'Escuro', system: 'Sistema', loading: 'Abrindo o Daymark…', readError: 'Não foi possível abrir os dados locais.',
  writeError: 'Não foi possível salvar suas alterações neste dispositivo.', retry: 'Tentar novamente', streak: 'dias seguidos',
  localNote: '♡  Suas rotinas e seu progresso ficam neste dispositivo.',
};
export const strings = (language: Preferences['language']) => language === 'pt-BR' ? pt : en;

