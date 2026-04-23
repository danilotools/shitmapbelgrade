import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Language, LANGUAGE_OPTIONS } from '../i18n/translations';
import { useDragToClose } from '../hooks/useDragToClose';

interface Props {
  visible: boolean;
  current: Language;
  onSelect: (lang: Language) => void;
  onClose: () => void;
  isDark?: boolean;
}

function buildTheme(dark: boolean) {
  return dark
    ? {
        overlay:      'rgba(0,0,0,0.6)',
        bg:           '#1e1e1e',
        handle:       '#444444',
        title:        '#ffffff',
        itemBg:       '#1e1e1e',
        itemBgActive: '#2a2a2a',
        itemBorder:   '#2e2e2e',
        flag:         '#ffffff',
        native:       '#ffffff',
        name:         '#888888',
        checkColor:   '#ffffff',
        cancelBg:     '#2a2a2a',
        cancelText:   '#888888',
      }
    : {
        overlay:      'rgba(0,0,0,0.4)',
        bg:           '#ffffff',
        handle:       '#cccccc',
        title:        '#1a1a1a',
        itemBg:       '#ffffff',
        itemBgActive: '#f5f5f5',
        itemBorder:   '#f0f0f0',
        flag:         '#1a1a1a',
        native:       '#1a1a1a',
        name:         '#aaaaaa',
        checkColor:   '#121212',
        cancelBg:     '#f5f5f5',
        cancelText:   '#aaaaaa',
      };
}

export function LanguagePickerModal({ visible, current, onSelect, onClose, isDark = false }: Props) {
  const th = buildTheme(isDark);
  const insets = useSafeAreaInsets();
  const { translateY, Gesture, RootView } = useDragToClose(visible, onClose);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <RootView>
      <View style={[styles.overlay, { backgroundColor: th.overlay }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: th.bg, transform: [{ translateY }] },
          ]}
        >
          <Gesture>
            <View style={styles.dragRegion}>
              <View style={[styles.handle, { backgroundColor: th.handle }]} />
              <Text style={[styles.title, { color: th.title }]}>🌍</Text>
            </View>
          </Gesture>

          <FlatList
            data={LANGUAGE_OPTIONS}
            keyExtractor={(item) => item.code}
            style={styles.list}
            scrollEnabled={LANGUAGE_OPTIONS.length > 6}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={[styles.separator, { backgroundColor: th.itemBorder }]} />
            )}
            renderItem={({ item }) => {
              const active = item.code === current;
              return (
                <TouchableOpacity
                  style={[
                    styles.item,
                    { backgroundColor: active ? th.itemBgActive : th.itemBg },
                  ]}
                  onPress={() => { onSelect(item.code); onClose(); }}
                  activeOpacity={0.75}
                >
                  <Text style={styles.itemFlag}>{item.flag}</Text>
                  <View style={styles.itemText}>
                    <Text style={[styles.itemNative, { color: th.native }]}>{item.native}</Text>
                    <Text style={[styles.itemName,   { color: th.name   }]}>{item.name}</Text>
                  </View>
                  {active && (
                    <Text style={[styles.checkmark, { color: th.checkColor }]}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            }}
          />

          {/* Bottom safe-area spacer — no Cancel button; dismiss via
              backdrop tap or swipe-down. */}
          <View style={{ height: Math.max(insets.bottom, 20) }} />
        </Animated.View>
      </View>
      </RootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    maxHeight: '80%',
  },
  dragRegion: {
    // Enlarged hit area — drag anywhere in the top block to dismiss.
    paddingTop: 6,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 12,
  },
  list: {
    flexGrow: 0,
  },
  separator: {
    height: 1,
    marginHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 16,
  },
  itemFlag: {
    fontSize: 26,
  },
  itemText: {
    flex: 1,
  },
  itemNative: {
    fontWeight: '600',
    fontSize: 16,
  },
  itemName: {
    fontWeight: '400',
    fontSize: 13,
    marginTop: 1,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  cancelBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
