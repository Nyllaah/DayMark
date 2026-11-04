import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Data } from './domain';

const key = 'daymark:v1';
export async function load(): Promise<Data | null> {
  const raw = await AsyncStorage.getItem(key);
  return raw === null ? null : JSON.parse(raw) as Data;
}

let pending = Promise.resolve();
export function save(data: Data) {
  const snapshot = JSON.stringify(data);
  pending = pending.catch(() => {}).then(() => AsyncStorage.setItem(key, snapshot));
  return pending;
}

