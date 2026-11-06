/**
 * Cron Scheduler — registers recurring tasks on server startup.
 * Schedule: every 6 hours (adjustable via FETCH_INTERVAL_HOURS env var)
 */

import cron from 'node-cron';
import { runRssFetch } from '../services/rssService';

export function startScheduler(): void {
  const intervalHours = parseInt(process.env.FETCH_INTERVAL_HOURS || '6', 10);

  // Build cron expression: "0 */N * * *" (every N hours)
  const cronExpression = `0 */${intervalHours} * * *`;

  console.log(`[Scheduler] RSS auto-fetch registered — runs every ${intervalHours} hours.`);

  cron.schedule(cronExpression, async () => {
    await runRssFetch();
  });

  // Also run once immediately at startup (after a 10-second delay for DB to connect)
  setTimeout(async () => {
    await runRssFetch();
  }, 10_000);
}
