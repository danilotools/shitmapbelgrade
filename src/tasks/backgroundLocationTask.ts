/**
 * Background location task — registered with expo-task-manager.
 * This file MUST be imported at the top level of App.tsx (before the component
 * renders) so the task is available when the OS wakes the app.
 *
 * The task fetches the latest pins from Firestore and checks proximity.
 * Because background tasks have tight CPU budgets we keep this minimal.
 */
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { BACKGROUND_LOCATION_TASK, PROXIMITY_ALERT_RADIUS_M } from '../constants';
import { haversineDistance, bearingTo, relativeDirection } from '../utils/geo';
import { sendProximityAlert } from '../services/notificationService';

// Module-level cache of pins — updated by the foreground Firestore listener
// and read here in the background task without making a network call.
let cachedPins: Array<{ id: string; latitude: number; longitude: number }> = [];
let alreadyAlerted: Set<string> = new Set();

export function updateCachedPins(
  pins: Array<{ id: string; latitude: number; longitude: number }>,
) {
  cachedPins = pins;
}

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }) => {
  if (error) {
    console.warn('[BG Location Task]', error.message);
    return;
  }

  const { locations } = data as { locations: Location.LocationObject[] };
  const latest = locations[locations.length - 1];
  if (!latest) return;

  const userCoord = {
    latitude: latest.coords.latitude,
    longitude: latest.coords.longitude,
  };
  const heading = latest.coords.heading ?? 0;

  const nowInside = new Set<string>();

  for (const pin of cachedPins) {
    const dist = haversineDistance(userCoord, {
      latitude: pin.latitude,
      longitude: pin.longitude,
    });

    if (dist <= PROXIMITY_ALERT_RADIUS_M) {
      nowInside.add(pin.id);
      if (!alreadyAlerted.has(pin.id)) {
        const bearing = bearingTo(userCoord, {
          latitude: pin.latitude,
          longitude: pin.longitude,
        });
        const direction = relativeDirection(bearing, heading);
        sendProximityAlert(dist, direction);
      }
    }
  }

  alreadyAlerted = nowInside;
});
