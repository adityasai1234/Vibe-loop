import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

// Ensure Firebase Admin is initialized (if not already done in index.ts or elsewhere)
if (admin.apps.length === 0) {
  admin.initializeApp();
}

interface AnalyticsEvent {
  eventName: string;
  eventParams: { [key: string]: any };
  userId?: string; // Optional: if event is user-specific
  timestamp?: number;
}

/**
 * Callable Cloud Function to log analytics events.
 * This acts as a proxy to send events to Google Analytics 4 (GA4) and/or BigQuery.
 * 
 * IMPORTANT: Actual integration with GA4/BigQuery SDKs is required here.
 * This is a placeholder demonstrating the structure and logging to Cloud Functions logger.
 */
export const logAnalyticsEvent = functions.https.onCall(async (data: AnalyticsEvent, context) => {
  // Authentication check (optional, but recommended for user-specific events)
  // if (!context.auth && data.userId) {
  //   throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to log user-specific events.');
  // }

  const { eventName, eventParams, userId, timestamp } = data;

  if (!eventName || typeof eventName !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid "eventName" string.');
  }

  if (!eventParams || typeof eventParams !== 'object') {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid "eventParams" object.');
  }

  const effectiveUserId = userId || context.auth?.uid;
  const eventTimestamp = timestamp || Date.now();

  functions.logger.info('Analytics Event Received:', {
    eventName,
    eventParams,
    userId: effectiveUserId,
    timestamp: eventTimestamp,
    firebaseAuthUid: context.auth?.uid, // For debugging/verification
  });

  // TODO: Implement actual GA4 event logging
  // Example (conceptual - requires GA4 SDK setup):
  // if (process.env.GA4_MEASUREMENT_ID) {
  //   try {
  //     // const { GoogleAnalytics } = require('google-analytics-data'); // Or appropriate SDK
  //     // const analyticsClient = new GoogleAnalytics();
  //     // await analyticsClient.logEvent(...);
  //     functions.logger.info('Successfully logged event to GA4 (conceptual)', { eventName });
  //   } catch (error) {
  //     functions.logger.error('Error logging event to GA4:', error);
  //   }
  // }

  // TODO: Implement actual BigQuery event logging
  // Example (conceptual - requires BigQuery SDK setup):
  // if (process.env.BIGQUERY_PROJECT_ID && process.env.BIGQUERY_DATASET_ID && process.env.BIGQUERY_TABLE_ID) {
  //   try {
  //     // const { BigQuery } = require('@google-cloud/bigquery');
  //     // const bigquery = new BigQuery({ projectId: process.env.BIGQUERY_PROJECT_ID });
  //     // await bigquery
  //     //   .dataset(process.env.BIGQUERY_DATASET_ID)
  //     //   .table(process.env.BIGQUERY_TABLE_ID)
  //     //   .insert([{ eventName, ...eventParams, userId: effectiveUserId, timestamp: new Date(eventTimestamp) }]);
  //     functions.logger.info('Successfully logged event to BigQuery (conceptual)', { eventName });
  //   } catch (error) {
  //     functions.logger.error('Error logging event to BigQuery:', error);
  //   }
  // }

  return {
    success: true,
    message: `Event '${eventName}' logged for processing.`,
    loggedDetails: {
        eventName,
        userId: effectiveUserId,
        timestamp: eventTimestamp
    }
  };
});