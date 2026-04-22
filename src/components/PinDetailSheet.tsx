/**
 * Bottom sheet shown when a user taps a pin.
 * - Own pins: show a "Delete my pin" button that instantly removes it and refunds a drop slot
 * - Other pins: show "Mark as gone" community removal vote
 *
 * Theming follows the map's dark/light mode (passed in via isDark).
 * The sheet can be dismissed by tapping the backdrop OR by dragging the handle down.
 */
import React, { useRef, useState } from 'react';
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
import { PooPin } from '../types';
import { REMOVAL_VOTES_REQUIRED } from '../constants';
import { Language, translations } from '../i18n/translations';
import { useDragToClose } from '../hooks/useDragToClose';
import { LevelPill } from './LevelPill';

interface Props {
  pin: PooPin | null;
  onClose: () => void;
  onVoteRemove: (pin: PooPin) => void;
  onDeleteOwn: (pin: PooPin) => void;
  deviceId: string;
  language?: Language;
  isDark?: boolean;
}

function buildTheme(dark: boolean) {
  return dark
    ? {
        backdrop:     'rgba(0,0,0,0.55)',
        sheetBg:      '#1e1e1e',
        handle:       '#444444',
        ownLabel:     '#ffffff',
        age:          '#aaaaaa',
        votes:        '#888888',
        hint:         '#666666',
        deleteBg:     '#D9534F',
        deletePress:  '#e06360',
        deleteText:   '#ffffff',
        removeBg:     '#D9534F',
        removePress:  '#e06360',
        removeText:   '#ffffff',
        votedBg:      '#3a3a3a',
        votedText:    '#888888',
      }
    : {
        backdrop:     'rgba(0,0,0,0.35)',
        sheetBg:      '#ffffff',
        handle:       '#cccccc',
        ownLabel:     '#121212',
        age:          '#555555',
        votes:        '#888888',
        hint:         '#aaaaaa',
        deleteBg:     '#D9534F',
        deletePress:  '#e06360',
        deleteText:   '#ffffff',
        removeBg:     '#D9534F',
        removePress:  '#e06360',
        removeText:   '#ffffff',
        votedBg:      '#aaaaaa',
        votedText:    '#ffffff',
      };
}

export function PinDetailSheet({
  pin,
  onClose,
  onVoteRemove,
  onDeleteOwn,
  deviceId,
  language = 'en',
  isDark = false,
}: Props) {
  const t = translations[language];
  const th = buildTheme(isDark);

  const formatAge = (createdAt: number): string => {
    const diffMs = Date.now() - createdAt;
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return diffH > 0 ? t.hoursMinutesAgo(diffH, diffM) : t.minutesAgo(diffM);
  };

  const insets = useSafeAreaInsets();
  const { translateY, panHandlers } = useDragToClose(!!pin, onClose);

  const deleteScaleAnim = useRef(new Animated.Value(1)).current;
  const removeScaleAnim = useRef(new Animated.Value(1)).current;
  const [deletePressed, setDeletePressed] = useState(false);
  const [removePressed, setRemovePressed] = useState(false);

  const makeScaleHandlers = (
    scaleAnim: Animated.Value,
    setPressedFn: (v: boolean) => void,
  ) => ({
    onPressIn: () => {
      setPressedFn(true);
      Animated.spring(scaleAnim, { toValue: 0.93, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
    },
    onPressOut: () => {
      setPressedFn(false);
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 22, bounciness: 5 }).start();
    },
  });

  if (!pin) return null;

  const isOwnPin = pin.deviceId === deviceId;
  const alreadyVoted = pin.removalVotes.includes(deviceId);
  const votesLeft = REMOVAL_VOTES_REQUIRED - pin.removalVotes.length;

  return (
    <Modal
      transparent
      visible={!!pin}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: th.backdrop }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          {...panHandlers}
          style={[
            styles.sheet,
            {
              backgroundColor: th.sheetBg,
              paddingBottom: Math.max(insets.bottom, 24),
              transform: [{ translateY }],
            },
          ]}
        >
          {/* The whole sheet is draggable — PanResponder captures the gesture
              as soon as the finger moves >6px vertically, so buttons still
              fire on a tap but a swipe-down dismisses from anywhere. */}
          <View style={styles.dragRegion}>
            <View style={[styles.handle, { backgroundColor: th.handle }]} />
            <Text style={styles.emoji}>💩</Text>

            {isOwnPin && (
              <Text style={[styles.ownLabel, { color: th.ownLabel }]}>{t.yourPin}</Text>
            )}

            <Text style={[styles.age, { color: th.age }]}>
              {t.droppedAgo(formatAge(pin.createdAt))}
            </Text>

            {/* Danger-level pill — legacy pins without a level default to 3 */}
            <LevelPill
              level={pin.level}
              isDark={isDark}
              language={language}
              style={styles.levelPill}
            />
          </View>

          {isOwnPin ? (
            // Own pin — instant delete + refund
            <Animated.View style={{ transform: [{ scale: deleteScaleAnim }] }}>
              <TouchableOpacity
                style={[
                  styles.deleteBtn,
                  { backgroundColor: th.deleteBg },
                  deletePressed && { backgroundColor: th.deletePress },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onDeleteOwn(pin);
                }}
                activeOpacity={1}
                {...makeScaleHandlers(deleteScaleAnim, setDeletePressed)}
              >
                <Text style={[styles.deleteBtnText, { color: th.deleteText }]}>
                  {t.deleteMyPin}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            // Someone else's pin — community vote
            <>
              <Text style={[styles.votes, { color: th.votes }]}>
                {t.votesToRemove(pin.removalVotes.length, REMOVAL_VOTES_REQUIRED)}
              </Text>
              <Animated.View style={{ transform: [{ scale: removeScaleAnim }] }}>
                <TouchableOpacity
                  style={[
                    styles.removeBtn,
                    { backgroundColor: alreadyVoted ? th.votedBg : th.removeBg },
                    removePressed && !alreadyVoted && { backgroundColor: th.removePress },
                  ]}
                  onPress={() => {
                    if (!alreadyVoted) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      onVoteRemove(pin);
                    }
                  }}
                  disabled={alreadyVoted}
                  activeOpacity={1}
                  {...makeScaleHandlers(removeScaleAnim, setRemovePressed)}
                >
                  <Text
                    style={[
                      styles.removeBtnText,
                      { color: alreadyVoted ? th.votedText : th.removeText },
                    ]}
                  >
                    {alreadyVoted ? t.youReported : t.markAsGone}
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {!alreadyVoted && (
                <Text style={[styles.hint, { color: th.hint }]}>
                  {t.confirmationsNeeded(votesLeft)}
                </Text>
              )}
            </>
          )}
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
  dragRegion: {
    width: '100%',
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  ownLabel: {
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  age: {
    fontWeight: '400',
    fontSize: 16,
    marginBottom: 10,
  },
  levelPill: {
    marginBottom: 20,
  },
  votes: {
    fontWeight: '400',
    fontSize: 14,
    marginBottom: 20,
  },
  deleteBtn: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 200,
  },
  deleteBtnText: {
    fontWeight: '600',
    fontSize: 16,
  },
  removeBtn: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 200,
  },
  removeBtnText: {
    fontWeight: '600',
    fontSize: 16,
  },
  hint: {
    fontWeight: '400',
    marginTop: 10,
    fontSize: 13,
  },
});
