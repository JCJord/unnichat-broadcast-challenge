import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as logger from 'firebase-functions/logger';

initializeApp();
const db = getFirestore();

/**
 * Scheduled Cloud Function running every minute.
 * Finds all broadcast messages where status == 'scheduled' and scheduledFor <= now.
 * Automatically updates them to 'sent' and sets sentAt to current timestamp.
 */
export const processScheduledBroadcastsHandler = async (): Promise<number> => {
  const now = Timestamp.now();
  logger.info(`Starting broadcast scheduler check at ${now.toDate().toISOString()}`);

  try {
    const scheduledQuery = db
      .collection('broadcasts')
      .where('status', '==', 'scheduled')
      .where('scheduledFor', '<=', now);

    const snapshot = await scheduledQuery.get();

    if (snapshot.empty) {
      logger.info('No pending scheduled broadcasts to process.');
      return 0;
    }

    logger.info(`Found ${snapshot.size} scheduled broadcasts ready to send.`);

    const CHUNK_SIZE = 450;
    for (let i = 0; i < snapshot.docs.length; i += CHUNK_SIZE) {
      const chunk = snapshot.docs.slice(i, i + CHUNK_SIZE);
      const batch = db.batch();
      chunk.forEach((doc) => {
        batch.update(doc.ref, {
          status: 'sent',
          sentAt: now,
          updatedAt: now,
        });
      });
      await batch.commit();
    }

    logger.info(`Successfully updated ${snapshot.size} broadcasts to 'sent'.`);
    return snapshot.size;
  } catch (error) {
    logger.error('Error processing scheduled broadcasts:', error);
    throw error;
  }
};

export const processScheduledBroadcasts = onSchedule(
  {
    schedule: 'every 1 minutes',
    timeZone: 'America/Sao_Paulo',
    retryCount: 3,
  },
  async () => {
    await processScheduledBroadcastsHandler();
  }
);
