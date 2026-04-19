import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyD9eauwsLqA2YTEqqvl5PbJtqiIQTSIXxk',
  authDomain: 'shitmap-belgrade.firebaseapp.com',
  projectId: 'shitmap-belgrade',
  storageBucket: 'shitmap-belgrade.firebasestorage.app',
  messagingSenderId: '896789994875',
  appId: '1:896789994875:web:66e2f9551428c17d3f71de',
};

// Prevent duplicate app initialisation on hot-reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Force long-polling instead of WebSockets/gRPC.
// The Firebase JS SDK's default gRPC transport fails silently in React Native
// production builds — long-polling is reliable across all environments.
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// FCM is only available on native — gracefully skip on web/simulator
export const getMessagingInstance = async () => {
  const supported = await isSupported().catch(() => false);
  if (!supported) return null;
  return getMessaging(app);
};

export default app;
