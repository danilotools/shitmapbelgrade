/**
 * Returns a stable anonymous device identifier.
 * Uses expo-device's opaqueId on physical devices and a generated UUID stored
 * in AsyncStorage as a fallback (simulator / web).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Crypto from 'expo-crypto';

const DEVICE_ID_KEY = '@shitmap/deviceId';

let cached: string | null = null;

export async function getDeviceId(): Promise<string> {
  if (cached) return cached;

  // Physical device — use a stable opaque identifier
  if (Device.isDevice && Device.opaqueId) {
    cached = Device.opaqueId;
    return cached;
  }

  // Simulator / web fallback — generate once, persist in AsyncStorage
  const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (stored) {
    cached = stored;
    return cached;
  }

  const uuid = Crypto.randomUUID();
  await AsyncStorage.setItem(DEVICE_ID_KEY, uuid);
  cached = uuid;
  return cached;
}
