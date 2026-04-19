/**
 * Foreground & background location helpers.
 *
 * Background task: registered under BACKGROUND_LOCATION_TASK.
 * The task checks proximity to all known pins and fires a local notification
 * when the device comes within PROXIMITY_ALERT_RADIUS_M metres of one.
 */
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { BACKGROUND_LOCATION_TASK, LOCATION_DISTANCE_INTERVAL_M } from '../constants';

export async function requestLocationPermissions(): Promise<boolean> {
  // Foreground permission is required — without it the app cannot function
  const { status: fg } = await Location.requestForegroundPermissionsAsync();
  if (fg !== 'granted') return false;

  // Background permission is optional — enhances proximity alerts when app is backgrounded
  // but the app works fine without it (foreground-only mode)
  await Location.requestBackgroundPermissionsAsync().catch(() => {});

  return true;
}

export async function getCurrentLocation(): Promise<Location.LocationObject | null> {
  try {
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
  } catch {
    return null;
  }
}

/** Start battery-efficient background location updates (significant-change equivalent). */
export async function startBackgroundLocationUpdates(): Promise<void> {
  const hasTask = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
  if (hasTask) return;

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    distanceInterval: LOCATION_DISTANCE_INTERVAL_M,
    deferredUpdatesInterval: 5000,
    showsBackgroundLocationIndicator: false,
    foregroundService: {
      notificationTitle: 'Shitmap',
      notificationBody: 'Watching for nearby poo...',
      notificationColor: '#121212',
    },
    pausesUpdatesAutomatically: true, // iOS: pause when stationary
  });
}

export async function stopBackgroundLocationUpdates(): Promise<void> {
  const hasTask = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
  if (hasTask) {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  }
}
