import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { requestLocationPermissions } from '../services/locationService';

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  heading: number | null; // degrees, 0 = North
  permissionGranted: boolean;
  error: string | null;
}

export function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    heading: null,
    permissionGranted: false,
    error: null,
  });

  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const granted = await requestLocationPermissions();
      if (!active) return;

      if (!granted) {
        setState((s) => ({
          ...s,
          permissionGranted: false,
          error: 'Location permission denied.',
        }));
        return;
      }

      setState((s) => ({ ...s, permissionGranted: true }));

      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 3000,
        },
        (location) => {
          if (!active) return;
          setState((s) => ({
            ...s,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            heading: location.coords.heading ?? s.heading,
          }));
        },
      );
    })();

    return () => {
      active = false;
      subscriptionRef.current?.remove();
    };
  }, []);

  return state;
}
