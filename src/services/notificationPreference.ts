import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@shitmap/notificationsEnabled';

/** Returns true by default (first launch). */
export async function getNotificationsEnabled(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEY);
  return val === null ? true : val === 'true';
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(KEY, String(enabled));
}
