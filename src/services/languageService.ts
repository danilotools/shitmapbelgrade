import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../i18n/translations';

const LANGUAGE_KEY = '@shitmap/language';

export async function getStoredLanguage(): Promise<Language | null> {
  const value = await AsyncStorage.getItem(LANGUAGE_KEY);
  return (value as Language) ?? null;
}

export async function storeLanguage(lang: Language): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
}
