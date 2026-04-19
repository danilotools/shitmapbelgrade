// Pin lifetime — 48 hours in milliseconds
export const PIN_TTL_MS = 48 * 60 * 60 * 1000;

// Metres from a pin that triggers a proximity notification
export const PROXIMITY_ALERT_RADIUS_M = 10;

// How many removal confirmations before a pin is deleted
export const REMOVAL_VOTES_REQUIRED = 2;

// Spam protection — max pins dropped per device within the window
export const SPAM_MAX_PINS = 5;
export const SPAM_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Background location task name (registered with expo-task-manager)
export const BACKGROUND_LOCATION_TASK = 'BACKGROUND_LOCATION_TASK';

// Minimum distance (metres) the device must move before a new location update fires
export const LOCATION_DISTANCE_INTERVAL_M = 10;

// Firestore collection name
export const PINS_COLLECTION = 'pins';

// Cluster radius in pixels (react-native-maps supercluster)
export const CLUSTER_RADIUS = 40;
