/**
 * Danger-level picker shown right before a pin is dropped.
 * User taps one of five 💩 buttons (tiny → enormous) to set the level,
 * then hits "Drop the pin" to confirm. Dismisses on backdrop tap or
 * drag-down on the handle.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Language, translations } from '../i18n/translations';
import { useDragToClose } from '../hooks/useDragToClose';
import { LevelPill } from './LevelPill';

interface Props {
  visible: boolean;
  onConfirm: (level: number) => void;
  onClose: () => void;
  language?: Language;
  isDark?: boolean;
}

function buildTheme(dark: boolean) {
  return dark
    ? {
        backdrop:    'rgba(0,0,0,0.55)',
        bg:          '#1e1e1e',
        handle:      '#444444',
        title:       '#ffffff',
        hint:        '#888888',
        label:       '#ffffff',
        segBg:       '#2a2a2a',
        segBgActive: '#3d3d3d',
        segBorder:   '#3a3a3a',
        segBorderActive: '#ffffff',
        confirmBg:   '#ffffff',
        confirmText: '#121212',
        cancelText:  '#888888',
      }
    : {
        backdrop:    'rgba(0,0,0,0.4)',
        bg:          '#ffffff',
        handle:      '#cccccc',
        title:       '#1a1a1a',
        hint:        '#888888',
        label:       '#1a1a1a',
        segBg:       '#f5f5f5',
        segBgActive: '#ffe9c7',
        segBorder:   '#eeeeee',
        segBorderActive: '#121212',
        confirmBg:   '#121212',
        confirmText: '#ffffff',
        cancelText:  '#999999',
      };
}

export function DangerLevelSheet({
  visible,
  onConfirm,
  onClose,
  language = 'en',
  isDark = false,
}: Props) {
  const t = translations[language];
  const th = buildTheme(isDark);
  const insets = useSafeAreaInsets();
  const { translateY, panHandlers } = useDragToClose(visible, onClose);

  const [level, setLevel] = useState(3);

  // Reset to 3 on every open so the picker doesn't remember the last choice.
  useEffect(() => {
    if (visible) setLevel(3);
  }, [visible]);

  if (!visible) return null;

  const handleSelect = (n: number) => {
    Haptics.selectionAsync();
    setLevel(n);
  };

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm(level);
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: th.backdrop }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          {...panHandlers}
          style={[
            styles.sheet,
            {
              backgroundColor: th.bg,
              paddingBottom: Math.max(insets.bottom, 24),
              transform: [{ translateY }],
            },
          ]}
        >
          <View>
            <View style={[styles.handle, { backgroundColor: th.handle }]} />
            <Text style={[styles.title, { color: th.title }]}>{t.dangerLevelTitle}</Text>
            <Text style={[styles.hint,  { color: th.hint  }]}>{t.dangerLevelHint}</Text>
          </View>

          {/* Five buttons — each with an emoji sized to match its level */}
          <View style={styles.segments}>
            {[1, 2, 3, 4, 5].map((n) => {
              const active = level === n;
              const size = 16 + (n - 1) * 6; // 16,22,28,34,40
              return (
                <TouchableOpacity
                  key={n}
                  onPress={() => handleSelect(n)}
                  activeOpacity={0.7}
                  style={[
                    styles.segment,
                    {
                      backgroundColor: active ? th.segBgActive : th.segBg,
                      borderColor:     active ? th.segBorderActive : th.segBorder,
                    },
                  ]}
                >
                  <Text style={{ fontSize: size }}>💩</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <LevelPill
            level={level}
            isDark={isDark}
            language={language}
            style={styles.levelPill}
          />

          <TouchableOpacity
            style={[styles.confirmBtn, { backgroundColor: th.confirmBg }]}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Text style={[styles.confirmText, { color: th.confirmText }]}>
              {t.confirmDrop}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.cancelBtn}>
            <Text style={[styles.cancelText, { color: th.cancelText }]}>{t.cancel}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: 'center',
    width: '100%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
    alignSelf: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 4,
  },
  hint: {
    fontWeight: '400',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  segments: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segment: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelPill: {
    marginTop: 8,
    marginBottom: 22,
  },
  confirmBtn: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 200,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  confirmText: {
    fontWeight: '700',
    fontSize: 16,
  },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 8,
  },
  cancelText: {
    fontWeight: '500',
    fontSize: 14,
  },
});
