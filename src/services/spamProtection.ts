/**
 * Rate-limits pin drops to SPAM_MAX_PINS per device per SPAM_WINDOW_MS.
 * Drop timestamps are persisted in AsyncStorage so limits survive app restarts.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SPAM_MAX_PINS, SPAM_WINDOW_MS } from '../constants';

const SPAM_KEY = '@shitmap/dropTimestamps';

async function getTimestamps(): Promise<number[]> {
  const raw = await AsyncStorage.getItem(SPAM_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveTimestamps(ts: number[]): Promise<void> {
  await AsyncStorage.setItem(SPAM_KEY, JSON.stringify(ts));
}

/** Returns true if the user is allowed to drop another pin right now. */
export async function canDropPin(): Promise<boolean> {
  const now = Date.now();
  const all = await getTimestamps();
  const recent = all.filter((t) => now - t < SPAM_WINDOW_MS);
  return recent.length < SPAM_MAX_PINS;
}

/** Record a new pin drop timestamp (call after a successful drop). */
export async function recordDrop(): Promise<void> {
  const now = Date.now();
  const all = await getTimestamps();
  const recent = all.filter((t) => now - t < SPAM_WINDOW_MS);
  await saveTimestamps([...recent, now]);
}

/** Returns how many more pins the user can drop in the current window. */
export async function remainingDrops(): Promise<number> {
  const now = Date.now();
  const all = await getTimestamps();
  const recent = all.filter((t) => now - t < SPAM_WINDOW_MS);
  return Math.max(0, SPAM_MAX_PINS - recent.length);
}

/** Refund one drop — called when the user's own pin gets removed. */
export async function refundDrop(): Promise<void> {
  const now = Date.now();
  const all = await getTimestamps();
  const recent = all.filter((t) => now - t < SPAM_WINDOW_MS);
  // Remove the most recent timestamp to give back one drop slot
  if (recent.length > 0) {
    recent.pop();
  }
  await saveTimestamps(recent);
}
