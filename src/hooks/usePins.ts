/**
 * Polls the Firestore REST API every 5 seconds to fetch all active pins.
 * Using REST instead of the Firebase JS SDK real-time listener because the
 * SDK's WebSocket/gRPC transport is unreliable in React Native production builds.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { PooPin } from '../types';
import { PIN_TTL_MS } from '../constants';

const PROJECT_ID  = 'shitmap-belgrade';
const API_KEY     = 'AIzaSyD9eauwsLqA2YTEqqvl5PbJtqiIQTSIXxk';
const COLLECTION  = 'pins';
const POLL_MS     = 5000;

const REST_URL =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
  `/databases/(default)/documents/${COLLECTION}?key=${API_KEY}`;

function parseDoc(doc: any): PooPin | null {
  try {
    const f  = doc.fields;
    const id = (doc.name as string).split('/').pop()!;

    // Trust the server-set `createTime` rather than the writer's `createdAt`
    // field — devices with wrong system clocks (friend's phone set to the
    // past) would otherwise stamp `expiresAt` in the past and get filtered
    // out by every correctly-clocked reader.
    const serverCreatedMs = doc.createTime
      ? new Date(doc.createTime).getTime()
      : Number(f.createdAt?.integerValue ?? 0);

    return {
      id,
      latitude:      f.latitude?.doubleValue  ?? Number(f.latitude?.integerValue),
      longitude:     f.longitude?.doubleValue ?? Number(f.longitude?.integerValue),
      createdAt:     serverCreatedMs,
      expiresAt:     serverCreatedMs + PIN_TTL_MS,
      deviceId:      f.deviceId?.stringValue ?? '',
      removalVotes:  (f.removalVotes?.arrayValue?.values ?? [])
                       .map((v: any) => v.stringValue as string),
      level:         Math.max(1, Math.min(5,
                       Number(f.level?.integerValue ?? f.level?.doubleValue ?? 3))),
    };
  } catch {
    return null;
  }
}

export function usePins(): { pins: PooPin[]; refresh: () => void } {
  const [pins, setPins] = useState<PooPin[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPins = useCallback(async () => {
    try {
      const res = await fetch(REST_URL);
      if (!res.ok) return;
      const data = await res.json();
      const now  = Date.now();
      const next = ((data.documents ?? []) as any[])
        .map(parseDoc)
        .filter((p): p is PooPin => p !== null && p.expiresAt > now);
      setPins(next);
    } catch {
      // Network blip — keep showing last known pins
    }
  }, []);

  useEffect(() => {
    fetchPins();
    intervalRef.current = setInterval(fetchPins, POLL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchPins]);

  return { pins, refresh: fetchPins };
}
