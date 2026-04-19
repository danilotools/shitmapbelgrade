import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const KEY = '@shitmap/darkMode';

/**
 * Returns the stored dark-mode preference.
 * Falls back to the device's system colour scheme on first launch.
 */
export async function getDarkModePreference(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEY);
  if (val !== null) return val === 'true';
  return Appearance.getColorScheme() === 'dark';
}

export async function setDarkModePreference(dark: boolean): Promise<void> {
  await AsyncStorage.setItem(KEY, String(dark));
}
