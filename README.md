# Daymark

Daymark is a cozy, local-first habit tracker for Android, iOS, and web. Build daily routines, check off individual habits, and watch your progress fill a calendar.

## Getting started

Install Node.js 22.18 or later and pnpm 11. Then run:

```sh
pnpm install --frozen-lockfile
pnpm start
```

Press **a** for an Android emulator, **i** for an iOS simulator on macOS, or **w** for web. For a native development build, run `pnpm exec expo run:android` or `pnpm exec expo run:ios` with the corresponding native toolchain installed. An Expo Go client must support the project's Expo SDK 54.

## Features

- **Today** starts with a five-habit Morning Routine. Create, rename, and delete routines and habits, and check off each habit independently.
- **Progress** shows monthly and yearly heatmaps, a daily breakdown, and the current completion streak. A streak can carry through today while today's routine is still in progress.
- **Settings** offers Strawberry Milk, Lavender Dreams, Matcha Morning, and Golden Hour, plus light, dark, and system appearance and English or Brazilian Portuguese.

## Architecture

- `app/` contains the Expo Router screens.
- `src/ui.tsx`, `src/theme.ts`, and `src/locale.ts` contain shared UI, palette tokens, and translations.
- `src/domain.ts` derives progress and streaks from individual habit IDs checked on each local date.
- `src/state.tsx` coordinates hydration and state updates. `src/storage.ts` serializes snapshots to AsyncStorage on each device or browser origin.
- `tests/` covers rounding, history, streaks, leap days, and day-specific toggles.

Membership uses inclusive start dates and exclusive removal dates. Membership edits apply to the current local day and future days. Archived routines remain available in Progress when they have earlier history. Renames update the labels shown throughout the app, including history. Date keys use local calendar fields, and calendar arithmetic uses UTC solely to advance those civil dates without daylight-saving shifts.

## Checks and web deployment

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build:web
```

Publish the generated `dist/` folder to a static host that serves clean URLs for the exported routes. See the [Expo web deployment guide](https://docs.expo.dev/deploy/web/) for Expo Hosting setup. Progress and preferences are specific to the device or browser origin, and clearing app or site data removes them.

## License

Daymark is licensed under the [MIT License](LICENSE).

