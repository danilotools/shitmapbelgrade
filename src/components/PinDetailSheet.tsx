/**
 * Bottom sheet shown when a user taps a pin.
 * - Own pins: show a "Delete my pin" button that instantly removes it and refunds a drop slot
 * - Other pins: show "Mark as gone" community removal vote
 *
 * The backdrop fades in via Modal animationType="fade".
 * The sheet springs up from the bottom via a manual Animated.spring.
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
import { PooPin } from '../types';
import { REMOVAL_VOTES_REQUIRED } from '../constants';
import { Language, translations } from '../i18n/translations';

interface Props {
  pin: PooPin | null;
  onClose: () => void;
  onVoteRemove: (pin: PooPin) => void;
  onDeleteOwn: (pin: PooPin) => void;
  deviceId: string;
  language?: Language;
}

export function PinDetailSheet({ pin, onClose, onVoteRemove, onDeleteOwn, deviceId, language = 'en' }: Props) {
  const t = translations[language];
  const formatAge = (createdAt: number): string => {
    const diffMs = Date.now() - createdAt;
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return diffH > 0 ? t.hoursMinutesAgo(diffH, diffM) : t.minutesAgo(diffM);
  };
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(400)).current;
  const deleteScaleAnim = useRef(new Animated.Value(1)).current;
  const removeScaleAnim = useRef(new Animated.Value(1)).current;
  const [deletePressed, setDeletePressed] = useState(false);
  const [removePressed, setRemovePressed] = useState(false);

  // Spring the sheet up each time a pin is selected
  useEffect(() => {
    if (pin) {
      slideAnim.setValue(400);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 22,
        mass: 0.9,
        stiffness: 220,
      }).start();
    }
  }, [pin, slideAnim]);

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
      <View style={styles.container}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, 24),
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.handle} />
          <Text style={styles.emoji}>💩</Text>

          {isOwnPin && (
            <Text style={styles.ownLabel}>{t.yourPin}</Text>
          )}

          <Text style={styles.age}>{t.droppedAgo(formatAge(pin.createdAt))}</Text>

          {isOwnPin ? (
            // Own pin — instant delete + refund
            <Animated.View style={{ transform: [{ scale: deleteScaleAnim }] }}>
              <TouchableOpacity
                style={[styles.deleteBtn, deletePressed && styles.deleteBtnPressed]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onDeleteOwn(pin);
                }}
                activeOpacity={1}
                {...makeScaleHandlers(deleteScaleAnim, setDeletePressed)}
              >
                <Text style={styles.deleteBtnText}>{t.deleteMyPin}</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            // Someone else's pin — community vote
            <>
              <Text style={styles.votes}>
                {t.votesToRemove(pin.removalVotes.length, REMOVAL_VOTES_REQUIRED)}
              </Text>
              <Animated.View style={{ transform: [{ scale: removeScaleAnim }] }}>
                <TouchableOpacity
                  style={[styles.removeBtn, alreadyVoted && styles.votedBtn, removePressed && !alreadyVoted && styles.removeBtnPressed]}
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
                  <Text style={styles.removeBtnText}>
                    {alreadyVoted ? t.youReported : t.markAsGone}
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {!alreadyVoted && (
                <Text style={styles.hint}>{t.confirmationsNeeded(votesLeft)}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: '#fff',
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
    backgroundColor: '#ccc',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  ownLabel: {
    fontWeight: '700',
    fontSize: 12,
    color: '#121212',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  age: {
    fontWeight: '400',
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  votes: {
    fontWeight: '400',
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  deleteBtn: {
    backgroundColor: '#D9534F',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 200,
  },
  deleteBtnPressed: {
    backgroundColor: '#e06360',
  },
  deleteBtnText: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 16,
  },
  removeBtn: {
    backgroundColor: '#D9534F',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 200,
  },
  removeBtnPressed: {
    backgroundColor: '#e06360',
  },
  votedBtn: {
    backgroundColor: '#aaa',
  },
  removeBtnText: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 16,
  },
  hint: {
    fontWeight: '400',
    marginTop: 10,
    fontSize: 13,
    color: '#aaa',
  },
});
