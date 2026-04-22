/**
 * A tiny colored pill that represents a danger level (1-5).
 * Colors run green → red. Dark and light themes use different hues: light
 * mode is a soft pastel fill with a darker foreground, dark mode is a
 * muted dark fill with a vivid accent foreground so it glows a bit on
 * the dark background.
 *
 * Used everywhere a pin's level is displayed — the danger-level picker,
 * the pin-detail sheet, anywhere else that shows it going forward.
 */
import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Language, translations } from '../i18n/translations';

type Level = 1 | 2 | 3 | 4 | 5;

interface Palette {
  bg: string;
  fg: string;
  border: string;
}

/** Light-mode palette — soft pastel fills, darker text. */
const LIGHT: Record<Level, Palette> = {
  1: { bg: '#e6f7ea', fg: '#1f7a3a', border: '#c4ead0' },
  2: { bg: '#eef8d8', fg: '#5a7a1a', border: '#d9edb4' },
  3: { bg: '#fff4d0', fg: '#8a6a10', border: '#f3e2a4' },
  4: { bg: '#ffe4cc', fg: '#9a4a10', border: '#f5ccaa' },
  5: { bg: '#fde0de', fg: '#b0231f', border: '#f7bcb8' },
};

/** Dark-mode palette — muted dark fills, vivid accent text. */
const DARK: Record<Level, Palette> = {
  1: { bg: '#12321c', fg: '#6ee38a', border: '#1e4a2c' },
  2: { bg: '#2a3410', fg: '#b4dd4a', border: '#3d4a1c' },
  3: { bg: '#3a2e10', fg: '#f0c453', border: '#4e3e1c' },
  4: { bg: '#3a2410', fg: '#f09a53', border: '#4e3218' },
  5: { bg: '#3a1614', fg: '#ff6a64', border: '#4e201e' },
};

interface Props {
  level: number | undefined;
  isDark?: boolean;
  language?: Language;
  /** When true, only the "Level N" short form is shown. */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function LevelPill({
  level,
  isDark = false,
  language = 'en',
  compact = false,
  style,
}: Props) {
  const t = translations[language];
  const n = Math.max(1, Math.min(5, level ?? 3)) as Level;
  const palette = (isDark ? DARK : LIGHT)[n];
  const label = t.dangerLevelLabels[n - 1];

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
        },
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: palette.fg }]} />
      <Text style={[styles.text, { color: palette.fg }]} numberOfLines={1}>
        {compact ? t.levelSuffix(n) : `${t.levelSuffix(n)} · ${label}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 200,
    borderWidth: 1,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.2,
  },
});
