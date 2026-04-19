/**
 * App entry point.
 *
 * Responsibilities:
 *  - Import background task definition (must happen at module level, before render)
 *  - Show onboarding on first launch
 *  - Bootstrap notification channel
 *  - Start background location updates
 *  - Set up React Navigation
 */

// ⚠️  Background task MUST be imported before any component is rendered.
import './src/tasks/backgroundLocationTask';

import React, { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MapScreen } from './src/screens/MapScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { LanguageSelectScreen } from './src/screens/LanguageSelectScreen';
import { setupNotificationChannel } from './src/services/notificationService';
import { startBackgroundLocationUpdates } from './src/services/locationService';
import { getStoredLanguage, storeLanguage } from './src/services/languageService';
import { getDarkModePreference } from './src/services/darkModeService';
import { Language } from './src/i18n/translations';

const ONBOARDING_KEY = '@shitmap/onboardingDone';

export type RootStackParamList = {
  Map: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  // Initialise synchronously from the system so onboarding/language screens
  // are themed correctly on the very first render — updated from storage below.
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === 'dark');

  useEffect(() => {
    (async () => {
      await setupNotificationChannel();
      const [storedLang, done, dark] = await Promise.all([
        getStoredLanguage(),
        AsyncStorage.getItem(ONBOARDING_KEY),
        getDarkModePreference(),
      ]);
      setLanguage(storedLang);
      setOnboardingDone(done === 'true');
      setIsDark(dark);
    })();
  }, []);

  const handleLanguageDone = async (lang: Language) => {
    await storeLanguage(lang);
    setLanguage(lang);
    // Always show onboarding after a fresh language pick, even if a previous
    // session had already completed it (e.g. language was reset / first install).
    setOnboardingDone(false);
  };

  const handleOnboardingDone = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setOnboardingDone(true);
    await startBackgroundLocationUpdates().catch(() => {});
  };

  // Still loading — render nothing to avoid flash
  if (onboardingDone === null) return null;

  // Step 1: language not yet chosen
  if (!language) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <LanguageSelectScreen onDone={handleLanguageDone} isDark={isDark} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  // Step 2: onboarding not yet seen
  if (!onboardingDone) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <OnboardingScreen language={language} onDone={handleOnboardingDone} isDark={isDark} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Map" component={MapScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
