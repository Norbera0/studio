// src/lib/config.ts

/**
 * @fileOverview Centralized configuration based on environment variables.
 * This file checks for the presence of environment variables to determine if
 * external services like Google Drive, a database, or Google Auth are enabled.
 */

export const config = {
  gdrive: {
    enabled: process.env.GOOGLE_DRIVE_ENABLED === 'true' && !!process.env.GOOGLE_CLIENT_ID,
  },
  database: {
    enabled: !!process.env.DATABASE_URL,
  },
  auth: {
    google: {
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    }
  }
};
