/**
 * A single map marker — solid brown square whose size scales with the pin's
 * danger level (1-5). Pulses via opacity when `isNearby` is true.
 *
 * Structure: one Animated.View, no nesting, no scale transform. Previous
 * versions used a scale animation inside an oversized container, but on
 * Android react-native-maps was clipping the scaled child out of the native
 * marker bitmap at the larger sizes. A single flat view of a fixed size is
 * the only reliable layout.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { Marker } from 'react-native-maps';
import { PooPin as PooPinType } from '../types';

interface Props {
  pin: PooPinType;
  onPress: (pin: PooPinType) => void;
  isNearby?: boolean;
  opacity?: number;
}

export function PooPinMarker({ pin, onPress, isNearby = false, opacity = 1 }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;

  // Keep tracksViewChanges on briefly at mount so Android snapshots the view
  // AFTER children have drawn — otherwise the marker renders blank.
  const [tracking, setTracking] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setTracking(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isNearby) {
      pulse.setValue(1);
      return;
    }
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.55, duration: 600, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 1,    duration: 600, useNativeDriver: false }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [isNearby, pulse]);

  // Level 1..5 → box edge 16..28 px (kept modest so Android's marker
  // snapshot never clips regardless of screen density).
  const level = Math.max(1, Math.min(5, pin.level ?? 3));
  const boxSize = 16 + (level - 1) * 3; // 16,19,22,25,28

  const combinedOpacity = Animated.multiply(new Animated.Value(opacity), pulse);

  return (
    <Marker
      coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
      onPress={() => onPress(pin)}
      tracksViewChanges={tracking || isNearby}
      anchor={{ x: 0.5, y: 0.5 }}
      calloutEnabled={false}
    >
      <Animated.View
        style={{
          width: boxSize,
          height: boxSize,
          backgroundColor: '#6B3F1D',
          borderRadius: 3,
          borderWidth: 1.5,
          borderColor: '#ffffff',
          opacity: combinedOpacity,
        }}
      />
    </Marker>
  );
}
