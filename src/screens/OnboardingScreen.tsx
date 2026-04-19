import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { requestNotificationPermissions } from '../services/notificationService';
import { requestLocationPermissions } from '../services/locationService';
import { Language, translations } from '../i18n/translations';

const { width } = Dimensions.get('window');

interface Props {
  language: Language;
  onDone: () => void;
  isDark?: boolean;
}

function buildTheme(dark: boolean) {
  return dark
    ? {
        bg:          '#121212',
        title:       '#ffffff',
        body:        '#999999',
        itemBg:      '#1e1e1e',
        itemText:    '#bbbbbb',
        dotInactive: '#3a3a3a',
        dotActive:   '#ffffff',
        btnBg:       '#ffffff',
        btnText:     '#121212',
        skipText:    '#555555',
      }
    : {
        bg:          '#ffffff',
        title:       '#1a1a1a',
        body:        '#555555',
        itemBg:      '#f7f7f7',
        itemText:    '#444444',
        dotInactive: '#dddddd',
        dotActive:   '#121212',
        btnBg:       '#121212',
        btnText:     '#ffffff',
        skipText:    '#aaaaaa',
      };
}

export function OnboardingScreen({ language, onDone, isDark = false }: Props) {
  const t = translations[language];
  const th = buildTheme(isDark);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const isLast = currentIndex === t.slides.length - 1;

  const handleNext = () => {
    const next = currentIndex + 1;
    scrollRef.current?.scrollTo({ x: next * width, animated: true });
    setCurrentIndex(next);
  };

  const handleGetStarted = async () => {
    setLoading(true);
    await requestLocationPermissions();
    await requestNotificationPermissions();
    setLoading(false);
    onDone();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: th.bg }]}>
      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {t.slides.map((slide, i) => (
          <View key={i} style={styles.slide}>
            <Text style={styles.slideEmoji}>{slide.emoji}</Text>
            <Text style={[styles.slideTitle, { color: th.title }]}>{slide.title}</Text>
            {slide.items ? (
              <View style={styles.itemList}>
                {slide.items.map((item, j) => (
                  <View key={j} style={[styles.item, { backgroundColor: th.itemBg }]}>
                    <Text style={styles.itemIcon}>{item.icon}</Text>
                    <Text style={[styles.itemText, { color: th.itemText }]}>{item.text}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={[styles.slideBody, { color: th.body }]}>{slide.body}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dots}>
        {t.slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: th.dotInactive },
              i === currentIndex && [styles.dotActive, { backgroundColor: th.dotActive }],
            ]}
          />
        ))}
      </View>

      {/* Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: th.btnBg }, loading && styles.buttonDisabled]}
          onPress={isLast ? handleGetStarted : handleNext}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={[styles.buttonText, { color: th.btnText }]}>
            {loading ? t.settingUp : isLast ? t.getStarted : t.next}
          </Text>
        </TouchableOpacity>

        {!isLast && (
          <TouchableOpacity onPress={onDone} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: th.skipText }]}>{t.skip}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  slideEmoji: {
    fontSize: 96,
    marginBottom: 32,
  },
  slideTitle: {
    fontWeight: '800',
    fontSize: 34,
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 20,
  },
  slideBody: {
    fontWeight: '400',
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 26,
  },
  itemList: {
    width: '100%',
    gap: 14,
    marginTop: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 14,
  },
  itemIcon: {
    fontSize: 26,
    lineHeight: 32,
  },
  itemText: {
    flex: 1,
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 22,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 16 : 32,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 17,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    fontWeight: '400',
    fontSize: 15,
  },
});
