import { useState, useEffect, useRef } from 'react';
import { subscribeToPins } from '../services/pinsService';
import { PooPin } from '../types';

export function usePins(): PooPin[] {
  const [pins, setPins] = useState<PooPin[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Small delay to ensure Firebase is fully initialised before subscribing
    const timer = setTimeout(() => {
      unsubscribeRef.current = subscribeToPins(setPins);
    }, 500);

    return () => {
      clearTimeout(timer);
      unsubscribeRef.current?.();
    };
  }, []);

  return pins;
}
