/**
 * The "Pin the Poo 💩" drop button.
 * - Light mode: dark pill (#121212), white text
 * - Dark mode:  white pill, black text
 * Press feedback: scale down + lighten/darken background + haptic.
 */
import React, { useRef, useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Language, translations } from '../i18n/translations';

interface Props {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  isDark?: boolean;
  language?: Language;
}

export function DropButton({ onPress, loading = false, disabled = false, isDark = false, language = 'en' }: Props) {
  const t = translations[language];
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 22,
      bounciness: 5,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const buttonStyle = [
    styles.button,
    isDark ? styles.buttonDark : styles.buttonLight,
    pressed && (isDark ? styles.buttonDarkPressed : styles.buttonLightPressed),
    disabled && styles.disabled,
  ];

  const labelStyle = [
    styles.label,
    isDark ? styles.labelDark : styles.labelLight,
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        {loading ? (
          <ActivityIndicator color={isDark ? '#121212' : '#fff'} />
        ) : (
          <>
            <Text style={labelStyle}>{t.pinThePoo}</Text>
            <Text style={styles.emoji}>💩</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonLight: {
    backgroundColor: '#121212',
  },
  buttonLightPressed: {
    backgroundColor: '#2e2e2e',
  },
  buttonDark: {
    backgroundColor: '#ffffff',
  },
  buttonDarkPressed: {
    backgroundColor: '#e8e8e8',
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
  },
  labelLight: {
    color: '#fff',
  },
  labelDark: {
    color: '#121212',
  },
  emoji: {
    fontSize: 24,
  },
});
