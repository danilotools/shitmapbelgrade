/**
 * Watches the user's position against the live pin list and fires a local
 * notification when the device enters the proximity radius of a pin.
 *
 * Tracks which pins have already been alerted to avoid repeating notifications
 * until the user exits and re-enters the zone.
 */
import { useEffect, useRef } from 'react';
import { PooPin, Coordinate } from '../types';
import { PROXIMITY_ALERT_RADIUS_M } from '../constants';
import { haversineDistance, bearingTo, relativeDirection } from '../utils/geo';
import { sendProximityAlert } from '../services/notificationService';

export function useProximityAlerts(
  userCoord: Coordinate | null,
  userHeading: number,
  pins: PooPin[],
  deviceId: string,
  enabled: boolean = true,
): void {
  // Set of pin IDs currently inside the alert radius
  const activeAlertsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!userCoord || !enabled) return;

    const nowInside = new Set<string>();

    for (const pin of pins) {
      // Never alert for pins dropped by this device
      if (pin.deviceId === deviceId) continue;
      const pinCoord: Coordinate = {
        latitude: pin.latitude,
        longitude: pin.longitude,
      };
      const dist = haversineDistance(userCoord, pinCoord);

      if (dist <= PROXIMITY_ALERT_RADIUS_M) {
        nowInside.add(pin.id);

        // Only alert on entry (was outside, now inside)
        if (!activeAlertsRef.current.has(pin.id)) {
          const bearing = bearingTo(userCoord, pinCoord);
          const direction = relativeDirection(bearing, userHeading);
          sendProximityAlert(dist, direction);
        }
      }
    }

    activeAlertsRef.current = nowInside;
  }, [userCoord, userHeading, pins]);
}
