import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  Platform,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

const settingsIcon = (color: string) =>
  `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="${color}" d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.06-.74-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.5.42l-.38 2.65c-.63.24-1.17.58-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.38 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.65c.63-.25 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/></svg>`;

const gpsIcon = (color: string) =>
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.5 11.25H20.2153C20.0376 9.3301 19.1939 7.53282 17.8306 6.16944C16.4672 4.80606 14.6699 3.96244 12.75 3.78469V1.5C12.75 1.30109 12.671 1.11032 12.5303 0.96967C12.3897 0.829018 12.1989 0.75 12 0.75C11.8011 0.75 11.6103 0.829018 11.4697 0.96967C11.329 1.11032 11.25 1.30109 11.25 1.5V3.78469C9.3301 3.96244 7.53282 4.80606 6.16944 6.16944C4.80606 7.53282 3.96244 9.3301 3.78469 11.25H1.5C1.30109 11.25 1.11032 11.329 0.96967 11.4697C0.829018 11.6103 0.75 11.8011 0.75 12C0.75 12.1989 0.829018 12.3897 0.96967 12.5303C1.11032 12.671 1.30109 12.75 1.5 12.75H3.78469C3.96244 14.6699 4.80606 16.4672 6.16944 17.8306C7.53282 19.1939 9.3301 20.0376 11.25 20.2153V22.5C11.25 22.6989 11.329 22.8897 11.4697 23.0303C11.6103 23.171 11.8011 23.25 12 23.25C12.1989 23.25 12.3897 23.171 12.5303 23.0303C12.671 22.8897 12.75 22.6989 12.75 22.5V20.2153C14.6699 20.0376 16.4672 19.1939 17.8306 17.8306C19.1939 16.4672 20.0376 14.6699 20.2153 12.75H22.5C22.6989 12.75 22.8897 12.671 23.0303 12.5303C23.171 12.3897 23.25 12.1989 23.25 12C23.25 11.8011 23.171 11.6103 23.0303 11.4697C22.8897 11.329 22.6989 11.25 22.5 11.25ZM12 18.75C10.665 18.75 9.35993 18.3541 8.2499 17.6124C7.13987 16.8707 6.2747 15.8165 5.76381 14.5831C5.25292 13.3497 5.11925 11.9925 5.3797 10.6831C5.64015 9.37377 6.28302 8.17103 7.22703 7.22703C8.17103 6.28302 9.37377 5.64015 10.6831 5.3797C11.9925 5.11925 13.3497 5.25292 14.5831 5.76381C15.8165 6.2747 16.8707 7.13987 17.6124 8.2499C18.3541 9.35993 18.75 10.665 18.75 12C18.748 13.7896 18.0362 15.5053 16.7708 16.7708C15.5053 18.0362 13.7896 18.748 12 18.75ZM15.75 12C15.75 12.7417 15.5301 13.4667 15.118 14.0834C14.706 14.7001 14.1203 15.1807 13.4351 15.4645C12.7498 15.7484 11.9958 15.8226 11.2684 15.6779C10.541 15.5333 9.8728 15.1761 9.34835 14.6517C8.8239 14.1272 8.46675 13.459 8.32205 12.7316C8.17736 12.0042 8.25162 11.2502 8.53545 10.5649C8.81928 9.87971 9.29993 9.29404 9.91661 8.88199C10.5333 8.46993 11.2583 8.25 12 8.25C12.9946 8.25 13.9484 8.64509 14.6517 9.34835C15.3549 10.0516 15.75 11.0054 15.75 12Z" fill="${color}"/></svg>`;

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useLocation } from '../hooks/useLocation';
import { usePins } from '../hooks/usePins';
import { useProximityAlerts } from '../hooks/useProximityAlerts';
import { PooPinMarker } from '../components/PooPin';
import { DropButton } from '../components/DropButton';
import { PinDetailSheet } from '../components/PinDetailSheet';
import { MenuSheet } from '../components/MenuSheet';
import { DangerLevelSheet } from '../components/DangerLevelSheet';

import { dropPin, voteToRemovePin } from '../services/pinsService';
import { canDropPin, recordDrop, remainingDrops, refundDrop } from '../services/spamProtection';
import { deletePin } from '../services/pinsService';
import { getDeviceId } from '../services/deviceId';
import { haversineDistance } from '../utils/geo';
import { PooPin } from '../types';
import { PROXIMITY_ALERT_RADIUS_M, SPAM_MAX_PINS } from '../constants';
import { DARK_MAP_STYLE, LIGHT_MAP_STYLE } from '../constants/darkMapStyle';
import { getStoredLanguage, storeLanguage } from '../services/languageService';
import { Language, translations } from '../i18n/translations';
import { getDarkModePreference, setDarkModePreference } from '../services/darkModeService';

const BELGRADE_REGION = {
  latitude: 44.8176,
  longitude: 20.4569,
  latitudeDelta: 0.18,  // wider pre-GPS view — covers most of Belgrade so pins are visible
  longitudeDelta: 0.18,
};

// Include pins within this radius of the user when auto-fitting the first view.
const INITIAL_FIT_RADIUS_M = 20_000;

export function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [menuVisible, setMenuVisible] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [dropping, setDropping] = useState(false);
  const [dangerSheetVisible, setDangerSheetVisible] = useState(false);
  const [selectedPin, setSelectedPin] = useState<PooPin | null>(null);
  const [dropsLeft, setDropsLeft] = useState<number>(SPAM_MAX_PINS);

  const [isDark, setIsDark] = useState(false);

  // Dark mode transition overlay
  const transitionAnim = useRef(new Animated.Value(0)).current;
  const nextIsDarkRef = useRef(false);

  // Press animations for utility buttons
  const locateScaleAnim = useRef(new Animated.Value(1)).current;
  const settingsScaleAnim = useRef(new Animated.Value(1)).current;
  const [locatePressed, setLocatePressed] = useState(false);
  const [settingsPressed, setSettingsPressed] = useState(false);

  const location = useLocation();
  const { pins, refresh: refreshPins, removeLocal: removePinLocal } = usePins();

  const userCoord =
    location.latitude !== null && location.longitude !== null
      ? { latitude: location.latitude, longitude: location.longitude }
      : null;

  useProximityAlerts(userCoord, location.heading ?? 0, pins, deviceId);

  useEffect(() => {
    getDeviceId().then(setDeviceId);
    getStoredLanguage().then((lang) => { if (lang) setLanguage(lang); });
    getDarkModePreference().then(setIsDark);
  }, []);

  const t = translations[language];

  const myPins = pins.filter((p) => p.deviceId === deviceId);

  const handleLanguageChange = async (lang: Language) => {
    await storeLanguage(lang);
    setLanguage(lang);
  };

  const handleGoToPin = (pin: PooPin) => {
    mapRef.current?.animateToRegion(
      { latitude: pin.latitude, longitude: pin.longitude, latitudeDelta: 0.003, longitudeDelta: 0.003 },
      500,
    );
  };

  // Refresh drop counter on mount and after each drop
  const refreshDropsLeft = useCallback(async () => {
    const n = await remainingDrops();
    setDropsLeft(n);
  }, []);

  useEffect(() => {
    refreshDropsLeft();
  }, [refreshDropsLeft]);

  // First-view auto-fit: once GPS locks, fit the map so the user AND every
  // pin within INITIAL_FIT_RADIUS_M of them is visible. Prevents the old
  // behavior where we'd snap to a 500m window and hide pins a few blocks away.
  const didInitialFitRef = useRef(false);
  useEffect(() => {
    if (didInitialFitRef.current) return;
    if (!userCoord || !mapRef.current) return;

    const nearbyPinCoords = pins
      .filter(
        (p) =>
          haversineDistance(userCoord, { latitude: p.latitude, longitude: p.longitude }) <=
          INITIAL_FIT_RADIUS_M,
      )
      .map((p) => ({ latitude: p.latitude, longitude: p.longitude }));

    if (nearbyPinCoords.length > 0) {
      mapRef.current.fitToCoordinates([userCoord, ...nearbyPinCoords], {
        edgePadding: { top: 140, right: 60, bottom: 220, left: 60 },
        animated: true,
      });
    } else {
      mapRef.current.animateToRegion(
        { ...userCoord, latitudeDelta: 0.03, longitudeDelta: 0.03 },
        600,
      );
    }
    didInitialFitRef.current = true;
  }, [userCoord, pins]);

  const handleLocateMe = useCallback(() => {
    if (!userCoord || !mapRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    mapRef.current.animateToRegion(
      { ...userCoord, latitudeDelta: 0.03, longitudeDelta: 0.03 },
      400,
    );
  }, [userCoord]);

  const handleToggleDarkMode = useCallback((next: boolean) => {
    nextIsDarkRef.current = next;
    Animated.sequence([
      Animated.timing(transitionAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(transitionAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setIsDark(next), 180);
    setDarkModePreference(next); // persist, fire-and-forget
  }, [transitionAnim]);

  const makeScaleHandlers = (
    scaleAnim: Animated.Value,
    setPressedFn: (v: boolean) => void,
  ) => ({
    onPressIn: () => {
      setPressedFn(true);
      Animated.spring(scaleAnim, {
        toValue: 0.91,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }).start();
    },
    onPressOut: () => {
      setPressedFn(false);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 22,
        bounciness: 5,
      }).start();
    },
  });

  // Tapping the drop button first opens the danger-level sheet. The actual
  // pin drop happens inside handleConfirmDrop once the user picks a level.
  const handleDrop = useCallback(async () => {
    if (!userCoord) {
      Alert.alert(t.noLocation, t.waitingForGps);
      return;
    }
    const allowed = await canDropPin();
    if (!allowed) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t.slowDown, t.spamLimit);
      return;
    }
    setDangerSheetVisible(true);
  }, [userCoord, t]);

  const handleConfirmDrop = useCallback(async (level: number) => {
    setDangerSheetVisible(false);
    if (!userCoord) return;
    setDropping(true);
    try {
      await dropPin(userCoord.latitude, userCoord.longitude, deviceId, level);
      await recordDrop();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await refreshDropsLeft();
      refreshPins();
    } catch (e) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t.error, t.dropError);
    } finally {
      setDropping(false);
    }
  }, [userCoord, deviceId, refreshDropsLeft, refreshPins, t]);

  const handleDeleteOwn = useCallback(
    (pin: PooPin) => {
      // Optimistic: close the sheet, drop the pin from local state, refund
      // the drop slot, buzz the haptic — all synchronously. Firestore gets
      // the delete in the background; if it fails we log but don't roll
      // back (the next poll will bring it back if the server still has it).
      setSelectedPin(null);
      removePinLocal(pin.id);
      refundDrop().then(refreshDropsLeft);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      deletePin(pin.id).catch(() => Alert.alert(t.error, t.deleteError));
    },
    [refreshDropsLeft, removePinLocal, t],
  );

  const handleDeletePinFromMenu = useCallback(
    (pin: PooPin) => {
      removePinLocal(pin.id);
      refundDrop().then(refreshDropsLeft);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      deletePin(pin.id).catch(() => Alert.alert(t.error, t.deleteError));
    },
    [refreshDropsLeft, removePinLocal, t],
  );

  const handleVoteRemove = useCallback(
    (pin: PooPin) => {
      setSelectedPin(null);
      const isOwnPin = pin.deviceId === deviceId;
      const willBeDeleted = pin.removalVotes.length + 1 >= 2;
      // Optimistically hide the pin if this vote will push it over the edge.
      if (willBeDeleted) removePinLocal(pin.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      voteToRemovePin(pin.id, deviceId, pin.removalVotes)
        .then(() => {
          if (isOwnPin && willBeDeleted) {
            return refundDrop().then(refreshDropsLeft);
          }
        })
        .catch(() => Alert.alert(t.error, t.voteError));
    },
    [deviceId, refreshDropsLeft, removePinLocal, t],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={BELGRADE_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        clusteringEnabled={false}
        mapToolbarEnabled={false}
        moveOnMarkerPress={false}
        customMapStyle={isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE}
      >
        {pins.map((pin) => {
          const isNearby = userCoord
            ? haversineDistance(userCoord, { latitude: pin.latitude, longitude: pin.longitude }) <= PROXIMITY_ALERT_RADIUS_M
            : false;
          const ageRatio = Math.min(1, (Date.now() - pin.createdAt) / (48 * 60 * 60 * 1000));
          return (
            <PooPinMarker
              key={pin.id}
              pin={pin}
              onPress={setSelectedPin}
              isNearby={isNearby}
              opacity={1 - ageRatio * 0.6} // fades from 1.0 → 0.4 over 48h
            />
          );
        })}
      </MapView>

      {/* Status banner when location unavailable */}
      {!userCoord && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            {location.error ?? t.acquiringGps}
          </Text>
        </View>
      )}

      {/* Dark mode transition overlay */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: nextIsDarkRef.current ? '#000' : '#fff',
            opacity: transitionAnim,
          },
        ]}
      />

      {/* Settings button — bottom-left */}
      <Animated.View
        style={[
          styles.iconButton,
          { position: 'absolute', bottom: 48, left: 24 },
          { transform: [{ scale: settingsScaleAnim }] },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.iconButtonInner,
            isDark && styles.iconButtonInnerDark,
            settingsPressed && (isDark ? styles.iconButtonPressedDark : styles.iconButtonPressed),
          ]}
          onPress={() => setMenuVisible(true)}
          activeOpacity={1}
          {...makeScaleHandlers(settingsScaleAnim, setSettingsPressed)}
        >
          <SvgXml xml={settingsIcon(isDark ? '#ffffff' : '#121212')} width={22} height={22} />
        </TouchableOpacity>
      </Animated.View>

      {/* Locate me button — bottom-right */}
      <Animated.View
        style={[
          styles.iconButton,
          { position: 'absolute', bottom: 48, right: 24 },
          !userCoord && styles.iconButtonDisabled,
          { transform: [{ scale: locateScaleAnim }] },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.iconButtonInner,
            isDark && styles.iconButtonInnerDark,
            locatePressed && (isDark ? styles.iconButtonPressedDark : styles.iconButtonPressed),
          ]}
          onPress={handleLocateMe}
          disabled={!userCoord}
          activeOpacity={1}
          {...makeScaleHandlers(locateScaleAnim, setLocatePressed)}
        >
          <SvgXml xml={gpsIcon(isDark ? '#ffffff' : '#1972E9')} width={24} height={24} />
        </TouchableOpacity>
      </Animated.View>

      {/* Drop counter + button — bottom-centre */}
      <View style={styles.dropButtonContainer}>
        <Text style={styles.dropCounter}>{t.dropsLeft(dropsLeft, SPAM_MAX_PINS)}</Text>
        <DropButton
          onPress={handleDrop}
          loading={dropping}
          disabled={!userCoord || !deviceId || dropsLeft === 0}
          isDark={isDark}
          language={language}
        />
      </View>


      <PinDetailSheet
        pin={selectedPin}
        onClose={() => setSelectedPin(null)}
        onVoteRemove={handleVoteRemove}
        onDeleteOwn={handleDeleteOwn}
        deviceId={deviceId}
        language={language}
        isDark={isDark}
      />

      <DangerLevelSheet
        visible={dangerSheetVisible}
        onConfirm={handleConfirmDrop}
        onClose={() => setDangerSheetVisible(false)}
        language={language}
        isDark={isDark}
      />

      <MenuSheet
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        language={language}
        onLanguageChange={handleLanguageChange}
        isDark={isDark}
        onDarkModeToggle={handleToggleDarkMode}
        myPins={myPins}
        onGoToPin={handleGoToPin}
        onDeletePin={handleDeletePinFromMenu}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 86 : 44,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bannerText: {
    fontWeight: '400',
    color: '#fff',
    fontSize: 13,
  },
  dropButtonContainer: {
    position: 'absolute',
    bottom: 48,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dropCounter: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  iconButton: {
    borderRadius: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  iconButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 200,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPressed: {
    backgroundColor: '#ececec',
  },
  iconButtonInnerDark: {
    backgroundColor: '#2d2d2d',
  },
  iconButtonPressedDark: {
    backgroundColor: '#3d3d3d',
  },
  iconButtonDisabled: {
    opacity: 0.4,
  },
});
