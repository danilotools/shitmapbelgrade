/**
 * Local notification helpers.
 * Remote push (FCM) token registration lives here too — wired up in App.tsx.
 *
 * expo-notifications remote push is not supported in Expo Go (SDK 53+).
 * All functions are wrapped in try/catch so the app runs fine in Expo Go
 * and only fully works in a development or production build.
 */
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { CardinalDirection } from '../types';

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch {
  // Silently ignore — Expo Go limitation
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function getExpoPushToken(): Promise<string | null> {
  try {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch {
    return null;
  }
}

/** Fire a local proximity alert for a nearby pin. */
export async function sendProximityAlert(
  distanceM: number,
  direction: CardinalDirection,
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💩 POO nearby — watch your step!',
        body: `${direction}, ${Math.round(distanceM)}m`,
        sound: true,
        // Route through the high-importance channel we set up in
        // setupNotificationChannel() so the alert shows as a heads-up
        // notification on Android 8+.
        ...(Platform.OS === 'android' ? { channelId: 'proximity' } : {}),
      },
      trigger: null,
    });
  } catch {
    // Silently ignore — Expo Go limitation on Android
  }
}

/** Android notification channel setup (must run before any notification). */
export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  try {
    await Notifications.setNotificationChannelAsync('proximity', {
      name: 'Proximity Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#121212',
    });
  } catch {
    // Silently ignore
  }
}
