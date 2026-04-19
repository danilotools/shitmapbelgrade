/**
 * Cluster marker — shown when multiple pins are grouped together by
 * react-native-maps's built-in clustering.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  count: number;
}

export function PinCluster({ count }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>💩</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 32,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#D9534F',
    borderRadius: 10,
    minWidth: 20,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  badgeText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 11,
  },
});
