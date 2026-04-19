import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Language, LANGUAGE_OPTIONS } from '../i18n/translations';
import { LanguagePickerModal } from '../components/LanguagePickerModal';

function buildTheme(dark: boolean) {
  return dark
    ? {
        bg:             '#121212',
        title:          '#ffffff',
        subtitle:       '#666666',
        selectorBg:     '#1e1e1e',
        selectorBorder: '#2e2e2e',
        selectorText:   '#ffffff',
        selectorPlaceholder: '#555555',
        chevron:        '#555555',
        btnBg:          '#ffffff',
        btnText:        '#121212',
      }
    : {
        bg:             '#ffffff',
        title:          '#1a1a1a',
        subtitle:       '#aaaaaa',
        selectorBg:     '#f5f5f5',
        selectorBorder: '#eeeeee',
        selectorText:   '#1a1a1a',
        selectorPlaceholder: '#bbbbbb',
        chevron:        '#cccccc',
        btnBg:          '#121212',
        btnText:        '#ffffff',
      };
}

interface Props {
  onDone: (lang: Language) => void;
  isDark?: boolean;
}

export function LanguageSelectScreen({ onDone, isDark = false }: Props) {
  const [selected, setSelected] = useState<Language | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const th = buildTheme(isDark);

  const selectedOption = LANGUAGE_OPTIONS.find((o) => o.code === selected);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: th.bg }]}>
      <View style={styles.content}>
        <Text style={styles.globe}>🌍</Text>
        <Text style={[styles.title, { color: th.title }]}>Choose your language</Text>
        <Text style={[styles.subtitle, { color: th.subtitle }]}>Izaberi jezik · Elige tu idioma</Text>

        {/* Dropdown selector */}
        <TouchableOpacity
          style={[
            styles.selector,
            {
              backgroundColor: th.selectorBg,
              borderColor: selectedOption ? th.selectorBorder : th.selectorBorder,
            },
          ]}
          onPress={() => setPickerOpen(true)}
          activeOpacity={0.8}
        >
          {selectedOption ? (
            <View style={styles.selectorContent}>
              <Text style={styles.selectorFlag}>{selectedOption.flag}</Text>
              <Text style={[styles.selectorText, { color: th.selectorText }]}>
                {selectedOption.native}
              </Text>
            </View>
          ) : (
            <View style={styles.selectorContent}>
              <Text style={styles.selectorFlag}>🏳️</Text>
              <Text style={[styles.selectorText, { color: th.selectorPlaceholder }]}>
                Select language…
              </Text>
            </View>
          )}
          <Text style={[styles.chevron, { color: th.chevron }]}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: th.btnBg },
            !selected && styles.buttonDisabled,
          ]}
          onPress={() => selected && onDone(selected)}
          disabled={!selected}
          activeOpacity={0.85}
        >
          <Text style={[styles.buttonText, { color: th.btnText }]}>
            {selected === 'sr' ? 'Nastavi' :
             selected === 'es' ? 'Continuar' :
             selected === 'it' ? 'Continua' :
             selected === 'de' ? 'Weiter' :
             selected === 'fr' ? 'Continuer' :
             'Continue'}
          </Text>
        </TouchableOpacity>
      </View>

      <LanguagePickerModal
        visible={pickerOpen}
        current={selected ?? 'en'}
        onSelect={setSelected}
        onClose={() => setPickerOpen(false)}
        isDark={isDark}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  globe: {
    fontSize: 72,
    marginBottom: 24,
  },
  title: {
    fontWeight: '800',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontWeight: '400',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 36,
  },
  selector: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  selectorContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  selectorFlag: {
    fontSize: 26,
  },
  selectorText: {
    fontWeight: '600',
    fontSize: 17,
  },
  chevron: {
    fontSize: 26,
    fontWeight: '300',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 16 : 32,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 17,
  },
});
