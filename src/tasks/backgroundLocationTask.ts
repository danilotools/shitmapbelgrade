/**
 * Background location task — registered with expo-task-manager.
 * This file MUST be imported at the top level of App.tsx (before the component
 * renders) so the task is available when the OS wakes the app.
 *
 * When the OS fires a background location update we:
 *   1. Pull the latest pins from Firestore via REST (no SDK, no WebSocket).
 *   2. Skip pins owned by this device.
 *   3. For every pin inside the alert radius, consult the dedupe ledger
 *      (12h cooldown) and fire a local notification if allowed.
 *
 * Keeping the task self-sufficient (rather than relying on module-level state
 * populated by the foreground) is essential: when the OS wakes the app from
 * a fully-killed state the JS context is fresh and any in-memory caches are
 * empty.
 */
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { BACKGROUND_LOCATION_TASK, PROXIMITY_ALERT_RADIUS_M, PIN_TTL_MS } from '../constants';
import { haversineDistance, bearingTo, relativeDirection } from '../utils/geo';
import { sendProximityAlert } from '../services/notificationService';
import { shouldAlertForPin, markAlertedForPin } from '../services/notificationDedupe';
import { getDeviceId } from '../services/deviceId';

const PROJECT_ID = 'shitmap-belgrade';
const API_KEY    = 'AIzaSyD9eauwsLqA2YTEqqvl5PbJtqiIQTSIXxk';
const COLLECTION = 'pins';
const REST_URL =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
  `/databases/(default)/documents/${COLLECTION}?key=${API_KEY}&pageSize=1000`;

interface BgPin {
  id: string;
  latitude: number;
  longitude: number;
  deviceId: string;
  expiresAt: number;
}

function parseDoc(doc: any): BgPin | null {
  try {
    const f = doc.fields ?? {};
    const id = (doc.name as string).split('/').pop()!;
    const serverCreatedMs = doc.createTime
      ? new Date(doc.createTime).getTime()
      : Number(f.createdAt?.integerValue ?? 0);
    return {
      id,
      latitude:  f.latitude?.doubleValue  ?? Number(f.latitude?.integerValue),
      longitude: f.longitude?.doubleValue ?? Number(f.longitude?.integerValue),
      deviceId:  f.deviceId?.stringValue ?? '',
      expiresAt: serverCreatedMs + PIN_TTL_MS,
    };
  } catch {
    return null;
  }
}

async function fetchLivePins(): Promise<BgPin[]> {
  try {
    const res = await fetch(REST_URL);
    if (!res.ok) return [];
    const data = await res.json();
    const now = Date.now();
    return ((data.documents ?? []) as any[])
      .map(parseDoc)
      .filter((p): p is BgPin => p !== null && p.expiresAt > now);
  } catch {
    return [];
  }
}

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.warn('[BG Location Task]', error.message);
    return;
  }

  const { locations } = (data ?? {}) as { locations?: Location.LocationObject[] };
  const latest = locations?.[locations.length - 1];
  if (!latest) return;

  // Proximity alerts are a core feature — always on whenever the OS wakes us.
  // No user-facing toggle gates this path any more.

  const userCoord = {
    latitude: latest.coords.latitude,
    longitude: latest.coords.longitude,
  };
  const heading = latest.coords.heading ?? 0;

  const [pins, myDeviceId] = await Promise.all([fetchLivePins(), getDeviceId()]);

  for (const pin of pins) {
    if (pin.deviceId === myDeviceId) continue;

    const pinCoord = { latitude: pin.latitude, longitude: pin.longitude };
    const dist = haversineDistance(userCoord, pinCoord);
    if (dist > PROXIMITY_ALERT_RADIUS_M) continue;

    if (!(await shouldAlertForPin(pin.id))) continue;

    const bearing = bearingTo(userCoord, pinCoord);
    const direction = relativeDirection(bearing, heading);
    await sendProximityAlert(dist, direction);
    await markAlertedForPin(pin.id);
  }
});
