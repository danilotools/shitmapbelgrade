/**
 * Per-pin notification dedupe with a 12h cooldown.
 *
 * Each proximity alert is keyed by pinId. We remember the last alert
 * timestamp in AsyncStorage so the dedupe survives app restarts, switches
 * between foreground and background, and cold boots. A pin alerts the user
 * at least once; re-alerts for the same pin are suppressed for 12h.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@shitmap/lastPinAlerts';

export const PIN_ALERT_COOLDOWN_MS = 12 * 60 * 60 * 1000; // 12h

// Prune entries older than this to keep storage compact.
const PRUNE_HORIZON_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

type AlertLedger = Record<string, number>; // pinId -> epoch ms

async function load(): Promise<AlertLedger> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AlertLedger) : {};
  } catch {
    return {};
  }
}

async function save(ledger: AlertLedger): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
  } catch {
    // best effort — dedupe is not critical to app function
  }
}

/** Returns true if this pin hasn't alerted the user in the last 12h. */
export async function shouldAlertForPin(pinId: string): Promise<boolean> {
  const ledger = await load();
  const last = ledger[pinId] ?? 0;
  return Date.now() - last >= PIN_ALERT_COOLDOWN_MS;
}

/** Record that we alerted the user about this pin just now. */
export async function markAlertedForPin(pinId: string): Promise<void> {
  const ledger = await load();
  ledger[pinId] = Date.now();

  // Opportunistic prune so the ledger can't grow forever.
  const cutoff = Date.now() - PRUNE_HORIZON_MS;
  for (const id of Object.keys(ledger)) {
    if (ledger[id] < cutoff) delete ledger[id];
  }

  await save(ledger);
}
