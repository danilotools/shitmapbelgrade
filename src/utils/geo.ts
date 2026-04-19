/**
 * Haversine distance and bearing utilities.
 */
import { CardinalDirection, Coordinate } from '../types';

const R = 6371000; // Earth radius in metres

export function haversineDistance(a: Coordinate, b: Coordinate): number {
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const dLat = lat2 - lat1;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(x));
}

/**
 * Returns the bearing in degrees (0–360) from point `from` to point `to`.
 * 0 = North, 90 = East, etc.
 */
export function bearingTo(from: Coordinate, to: Coordinate): number {
  const lat1 = (from.latitude * Math.PI) / 180;
  const lat2 = (to.latitude * Math.PI) / 180;
  const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

/**
 * Converts an absolute compass bearing + device heading into a
 * human-readable relative direction label.
 *
 * @param absoluteBearing  Bearing from device to target (0–360°, 0=North)
 * @param deviceHeading    Direction the user is facing (0–360°, 0=North)
 */
export function relativeDirection(
  absoluteBearing: number,
  deviceHeading: number,
): CardinalDirection {
  const relative = ((absoluteBearing - deviceHeading + 360) % 360);
  // Divide into 8 sectors of 45° each, offset by 22.5°
  const sector = Math.floor(((relative + 22.5) % 360) / 45);
  const labels: CardinalDirection[] = [
    'ahead',
    'ahead-right',
    'right',
    'behind-right',
    'behind',
    'behind-left',
    'left',
    'ahead-left',
  ];
  return labels[sector];
}
