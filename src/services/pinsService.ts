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
  query,
  where,
  Timestamp,
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
  const now = Date.now();
  const q = query(
    collection(db, PINS_COLLECTION),
    where('expiresAt', '>', now),
  );

  return onSnapshot(q, (snapshot) => {
    console.log('[usePins] snapshot received, docs:', snapshot.docs.length);
    const pins: PooPin[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<PooPin, 'id'>),
    }));
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
): Promise<string> {
  const now = Date.now();
  const docRef = await addDoc(collection(db, PINS_COLLECTION), {
    latitude,
    longitude,
    createdAt: now,
    expiresAt: now + PIN_TTL_MS,
    deviceId,
    removalVotes: [],
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
