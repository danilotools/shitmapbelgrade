/**
 * Firestore CRUD operations for poo pins.
 */
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';
import { PooPin } from '../types';
import {
  PIN_TTL_MS,
  PINS_COLLECTION,
  REMOVAL_VOTES_REQUIRED,
} from '../constants';

/** Subscribe to all active (non-expired) pins. Returns an unsubscribe fn. */
export function subscribeToPins(
  onUpdate: (pins: PooPin[]) => void,
): () => void {
  // Fetch all pins from Firestore, filter expired ones client-side.
  // Avoids the need for a server-side index on expiresAt.
  return onSnapshot(collection(db, PINS_COLLECTION), (snapshot) => {
    const now = Date.now();
    const pins: PooPin[] = snapshot.docs
      .map((d) => ({ id: d.id, ...(d.data() as Omit<PooPin, 'id'>) }))
      .filter((p) => p.expiresAt > now);
    onUpdate(pins);
  }, (error) => {
    console.error('[usePins] snapshot error:', error.code, error.message);
  });
}

/** Drop a new pin at the given coordinates for the given device. */
export async function dropPin(
  latitude: number,
  longitude: number,
  deviceId: string,
  level: number = 3,
): Promise<string> {
  const now = Date.now();
  const clampedLevel = Math.max(1, Math.min(5, Math.round(level)));
  const docRef = await addDoc(collection(db, PINS_COLLECTION), {
    latitude,
    longitude,
    createdAt: now,
    expiresAt: now + PIN_TTL_MS,
    deviceId,
    removalVotes: [],
    level: clampedLevel,
  });
  return docRef.id;
}

/**
 * Cast a removal vote for a pin.
 * If the vote threshold is reached the pin is deleted immediately.
 */
export async function voteToRemovePin(
  pinId: string,
  deviceId: string,
  currentVotes: string[],
): Promise<void> {
  // Idempotent — one vote per device
  if (currentVotes.includes(deviceId)) return;

  const newVotes = [...currentVotes, deviceId];
  const pinRef = doc(db, PINS_COLLECTION, pinId);

  if (newVotes.length >= REMOVAL_VOTES_REQUIRED) {
    await deleteDoc(pinRef);
  } else {
    await updateDoc(pinRef, { removalVotes: newVotes });
  }
}

/** Delete a single pin by ID (for admin / testing use). */
export async function deletePin(pinId: string): Promise<void> {
  await deleteDoc(doc(db, PINS_COLLECTION, pinId));
}
