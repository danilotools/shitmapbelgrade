import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  Switch,
  Share,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { Language, LANGUAGE_OPTIONS, translations } from '../i18n/translations';
import { LanguagePickerModal } from './LanguagePickerModal';
import { PooPin } from '../types';
import { useDragToClose } from '../hooks/useDragToClose';

const SCREEN_HEIGHT = Dimensions.get('window').height;

function formatTimeLeft(expiresAt: number): { h: number; m: number } {
  const diffMs = Math.max(0, expiresAt - Date.now());
  const h = Math.floor(diffMs / (1000 * 60 * 60));
  const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return { h, m };
}

async function geocodePin(pin: PooPin): Promise<string> {
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude: pin.latitude,
      longitude: pin.longitude,
    });
    const r = results[0];
    if (!r) throw new Error('No result');
    const parts = [r.street, r.name].filter(Boolean);
    return parts.length > 0
      ? parts.join(' ')
      : `${pin.latitude.toFixed(4)}, ${pin.longitude.toFixed(4)}`;
  } catch {
    return `${pin.latitude.toFixed(4)}, ${pin.longitude.toFixed(4)}`;
  }
}

// ─── Theme ────────────────────────────────────────────────────────────────────

function buildTheme(dark: boolean) {
  return dark
    ? {
        bg:                  '#1e1e1e',
        handle:              '#444444',
        title:               '#ffffff',
        sectionLabel:        '#888888',
        divider:             '#2e2e2e',
        rowLabel:            '#ffffff',
        rowDesc:             '#888888',
        switchFalse:         '#555555',
        switchTrue:          '#ffffff',
        switchThumb:         '#f0f0f0',
        emptyText:           '#555555',
        pinRowBorder:        '#2e2e2e',
        pinAddress:          '#ffffff',
        pinExpiry:           '#888888',
        chevron:             '#ffffff',
        actionLabel:         '#ffffff',
        versionText:         '#666666',
        actionCardBg:        '#272727',
        actionCardBorder:    '#323232',
      }
    : {
        bg:                  '#ffffff',
        handle:              '#cccccc',
        title:               '#1a1a1a',
        sectionLabel:        '#aaaaaa',
        divider:             '#f0f0f0',
        rowLabel:            '#1a1a1a',
        rowDesc:             '#aaaaaa',
        switchFalse:         '#dddddd',
        switchTrue:          '#121212',
        switchThumb:         '#ffffff',
        emptyText:           '#bbbbbb',
        pinRowBorder:        '#f5f5f5',
        pinAddress:          '#1a1a1a',
        pinExpiry:           '#aaaaaa',
        chevron:             '#121212',
        actionLabel:         '#1a1a1a',
        versionText:         '#bbbbbb',
        actionCardBg:        '#f5f5f5',
        actionCardBorder:    '#e8e8e8',
      };
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onDarkModeToggle: (val: boolean) => void;
  myPins: PooPin[];
  onGoToPin: (pin: PooPin) => void;
  onDeletePin: (pin: PooPin) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function MenuSheet({
  visible,
  onClose,
  language,
  onLanguageChange,
  isDark,
  onDarkModeToggle,
  myPins,
  onGoToPin,
  onDeletePin,
}: Props) {
  const t = translations[language];
  const th = buildTheme(isDark);
  const insets = useSafeAreaInsets();
  const { translateY, Gesture, RootView } = useDragToClose(visible, onClose);
  const [addresses, setAddresses] = useState<Record<string, string>>({});
  const [langPickerOpen, setLangPickerOpen] = useState(false);

  useEffect(() => {
    if (!visible || myPins.length === 0) return;
    let cancelled = false;
    Promise.all(myPins.map(async (pin) => ({ id: pin.id, addr: await geocodePin(pin) })))
      .then((results) => {
        if (cancelled) return;
        const map: Record<string, string> = {};
        results.forEach(({ id, addr }) => { map[id] = addr; });
        setAddresses(map);
      });
    return () => { cancelled = true; };
  }, [visible, myPins]);

  const handleShare = async () => {
    try { await Share.share({ message: t.menuShareMessage }); } catch {}
  };

  const version = Constants.expoConfig?.version ?? '—';

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <RootView>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: th.bg, transform: [{ translateY }] },
          ]}
        >
          {/* Drag region — handle + title respond to downward pan. Kept
              outside the ScrollView so vertical drags here don't fight
              the scroll gesture inside. */}
          <Gesture>
            <View style={styles.dragRegion}>
              <View style={[styles.handle, { backgroundColor: th.handle }]} />
              <Text style={[styles.title, { color: th.title }]}>{t.menuTitle}</Text>
            </View>
          </Gesture>

          <ScrollView
            style={{ maxHeight: SCREEN_HEIGHT * 0.62 }}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* ── Language ── */}
            {(() => {
              const opt = LANGUAGE_OPTIONS.find((o) => o.code === language);
              return (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => setLangPickerOpen(true)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.actionCardIcon}>🌍</Text>
                  <View style={styles.rowText}>
                    <Text style={[styles.rowLabel, { color: th.rowLabel }]}>{t.menuLanguage}</Text>
                  </View>
                  <Text style={[styles.langCurrentText, { color: th.rowDesc }]}>
                    {opt ? `${opt.flag} ${opt.native}` : ''}
                  </Text>
                  <Text style={[styles.langChevron, { color: th.rowDesc }]}>›</Text>
                </TouchableOpacity>
              );
            })()}

            {/* ── Dark mode ── */}
            <View style={[styles.divider, { backgroundColor: th.divider }]} />
            <View style={styles.row}>
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: th.rowLabel }]}>{t.menuDarkMode}</Text>
                <Text style={[styles.rowDesc,  { color: th.rowDesc  }]}>{t.menuDarkModeDesc}</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={onDarkModeToggle}
                trackColor={{ false: th.switchFalse, true: th.switchTrue }}
                thumbColor={th.switchThumb}
              />
            </View>

            {/* ── My active pins ── */}
            <View style={[styles.divider, { backgroundColor: th.divider }]} />
            <Text style={[styles.sectionLabel, { color: th.sectionLabel }]}>{t.menuMyPins}</Text>
            {myPins.length === 0 ? (
              <Text style={[styles.emptyPins, { color: th.emptyText }]}>{t.menuNoPins}</Text>
            ) : (
              myPins.map((pin) => {
                const { h, m } = formatTimeLeft(pin.expiresAt);
                const label = addresses[pin.id]
                  ?? `${pin.latitude.toFixed(4)}, ${pin.longitude.toFixed(4)}`;
                return (
                  <View key={pin.id} style={[styles.pinRow, { borderBottomColor: th.pinRowBorder }]}>
                    <TouchableOpacity
                      style={styles.pinRowNav}
                      onPress={() => { onClose(); onGoToPin(pin); }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.pinEmoji}>💩</Text>
                      <View style={styles.pinInfo}>
                        <Text style={[styles.pinAddress, { color: th.pinAddress }]}>{label}</Text>
                        <Text style={[styles.pinExpiry,  { color: th.pinExpiry  }]}>
                          {t.menuPinExpiresIn(h, m)}
                        </Text>
                      </View>
                      <Text style={[styles.pinChevron, { color: th.chevron }]}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.pinDeleteBtn}
                      onPress={() => onDeletePin(pin)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.pinDeleteText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}

            {/* ── Share + About inline ── */}
            <View style={[styles.divider, { backgroundColor: th.divider }]} />
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: th.actionCardBg, borderColor: th.actionCardBorder }]}
                onPress={handleShare}
                activeOpacity={0.75}
              >
                <Text style={styles.actionCardIcon}>📤</Text>
                <Text style={[styles.actionCardLabel, { color: th.actionLabel }]}>{t.menuShare}</Text>
              </TouchableOpacity>

              <View style={[styles.actionCard, { backgroundColor: th.actionCardBg, borderColor: th.actionCardBorder }]}>
                <Text style={styles.actionCardIcon}>ℹ️</Text>
                <Text style={[styles.actionCardLabel, { color: th.actionLabel }]}>{t.menuAbout}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Bottom safe-area fill — same bg as sheet, no seams */}
          <View style={{ height: Math.max(insets.bottom, 28) }} />
        </Animated.View>
      </View>
      </RootView>

      <LanguagePickerModal
        visible={langPickerOpen}
        current={language}
        onSelect={onLanguageChange}
        onClose={() => setLangPickerOpen(false)}
        isDark={isDark}
      />
    </Modal>
  );
}

// ─── Styles (layout only — colours applied inline via theme) ───────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 24,
  },
  dragRegion: {
    // Generous hit area so users can grab from anywhere near the top of
    // the sheet, not just the tiny 40-px handle bar.
    paddingTop: 6,
    paddingBottom: 8,
    marginHorizontal: -24, // extend the drag zone to the sheet edges
    paddingHorizontal: 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  langCurrentText: {
    fontWeight: '500',
    fontSize: 14,
  },
  langChevron: {
    fontSize: 22,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  rowDesc: {
    fontWeight: '400',
    fontSize: 13,
    marginTop: 2,
  },
  emptyPins: {
    fontWeight: '400',
    fontSize: 15,
    marginBottom: 4,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  pinRowNav: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  pinEmoji: {
    fontSize: 22,
  },
  pinInfo: {
    flex: 1,
  },
  pinAddress: {
    fontWeight: '500',
    fontSize: 14,
  },
  pinExpiry: {
    fontWeight: '400',
    fontSize: 12,
    marginTop: 2,
  },
  pinChevron: {
    fontSize: 26,
    marginRight: 8,
  },
  pinDeleteBtn: {
    backgroundColor: '#D9534F',
    borderRadius: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  pinDeleteText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  actionCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 4,
  },
  actionCardIcon: {
    fontSize: 17,
  },
  actionCardLabel: {
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
  },
  actionCardVersion: {
    fontWeight: '400',
    fontSize: 11,
    textAlign: 'center',
  },
  versionText: {
    fontWeight: '400',
    fontSize: 13,
  },
});
