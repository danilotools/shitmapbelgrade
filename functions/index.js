/**
 * Cloud Functions — auto-expiry cleanup.
 *
 * Runs every 30 minutes and deletes all pins where expiresAt < now.
 * This is a fallback — Firestore queries already filter expired pins
 * client-side, but this keeps the collection clean.
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.cleanExpiredPins = functions.pubsub
  .schedule('every 30 minutes')
  .onRun(async () => {
    const now = Date.now();
    const expired = await db
      .collection('pins')
      .where('expiresAt', '<', now)
      .get();

    if (expired.empty) return null;

    const batch = db.batch();
    expired.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    console.log(`Deleted ${expired.size} expired pins.`);
    return null;
  });
