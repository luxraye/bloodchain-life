import { synchronize } from '@nozbe/watermelondb/sync';
import api from '../lib/api';
import { isDemoSession } from '../lib/isDemoSession.js';

export async function syncWithCore(database) {
  if (isDemoSession()) {
    return { database, skipped: true }
  }

  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      // Ask API to send all changes since lastPulledAt
      const response = await api.get('/sync/pull', {
        params: { lastPulledAt, schemaVersion, migration }
      });

      const { changes, timestamp } = response.data;
      return { changes, timestamp };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      // Send local changes to API
      await api.post('/sync/push', {
        changes,
        lastPulledAt
      });
    },
    migrationsEnabledAtVersion: 1,
  });
}
