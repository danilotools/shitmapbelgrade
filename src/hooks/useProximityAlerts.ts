/**
 * Watches the user's position against the live pin list and fires a local
 * notification when the device enters the proximity radius of a pin.
 *
 * De-dupe policy (see notificationDedupe.ts): each pin alerts the user at
 * least once and at most once every 12h, persisted across app restarts and
 * shared with the background location task.
 */
import { useEffect, useRef } from 'react';
import { PooPin, Coordinate } from '../types';
import { PROXIMITY_ALERT_RADIUS_M } from '../constants';
import { haversineDistance, bearingTo, relativeDirection } from '../utils/geo';
import { sendProximityAlert } from '../services/notificationService';
import {
  shouldAlertForPin,
  markAlertedForPin,
} from '../services/notificationDedupe';

export function useProximityAlerts(
  userCoord: Coordinate | null,
  userHeading: number,
  pins: PooPin[],
  deviceId: string,
  enabled: boolean = true,
): void {
  // In-memory guard so we don't re-check dedupe storage every single location
  // tick while the user is standing still inside a pin's radius.
  const inRadiusRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!userCoord || !enabled) return;

    const nowInside = new Set<string>();

    for (const pin of pins) {
      // Never alert for pins dropped by this device.
      if (pin.deviceId === deviceId) continue;

      const pinCoord: Coordinate = {
        latitude: pin.latitude,
        longitude: pin.longitude,
      };
      const dist = haversineDistance(userCoord, pinCoord);
      if (dist > PROXIMITY_ALERT_RADIUS_M) continue;

      nowInside.add(pin.id);

      // Only run the dedupe check on radius entry; skip if we already knew
      // we were inside this pin's radius from a prior tick.
      if (inRadiusRef.current.has(pin.id)) continue;

      (async () => {
        if (!(await shouldAlertForPin(pin.id))) return;
        const bearing = bearingTo(userCoord, pinCoord);
        const direction = relativeDirection(bearing, userHeading);
        await sendProximityAlert(dist, direction);
        await markAlertedForPin(pin.id);
      })();
    }

    inRadiusRef.current = nowInside;
  }, [userCoord, userHeading, pins, deviceId, enabled]);
}
