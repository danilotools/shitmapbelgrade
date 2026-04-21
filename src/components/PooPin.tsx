/**
 * A single 💩 map marker.
 * When `isNearby` is true the emoji gently pulses in size.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Marker } from 'react-native-maps';
import { PooPin as PooPinType } from '../types';

interface Props {
  pin: PooPinType;
  onPress: (pin: PooPinType) => void;
  isNearby?: boolean;
  opacity?: number;
}

export function PooPinMarker({ pin, onPress, isNearby = false, opacity = 1 }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  // react-native-maps on Android renders a blank marker if tracksViewChanges
  // is false on mount — it snapshots the native view before the child emoji
  // has drawn. Keep tracking on briefly, then flip off for performance.
  const [tracking, setTracking] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setTracking(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isNearby) {
      scale.setValue(1);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.35,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [isNearby, scale]);

  // Danger-level 1-5 scales the emoji from small to enormous. Legacy pins
  // without a level fall back to 3 (medium) via type-level default.
  const level = Math.max(1, Math.min(5, pin.level ?? 3));
  const fontSize = 20 + (level - 1) * 5; // 20,25,30,35,40

  return (
    <Marker
      coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
      onPress={() => onPress(pin)}
      tracksViewChanges={tracking || isNearby}
      anchor={{ x: 0.5, y: 0.5 }}
      calloutEnabled={false}
    >
      <View style={[styles.container, { opacity }]}>
        <Animated.Text style={[styles.emoji, { fontSize, transform: [{ scale }] }]}>
          💩
        </Animated.Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
  },
  emoji: {
    fontSize: 28,
  },
});
