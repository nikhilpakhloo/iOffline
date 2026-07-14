import db from '../database';
import { migrationScripts } from './scripts';

/**
 * Gets the current database schema version.
 */
const getCurrentVersion = (): number => {
  try {
    const result = db.execute('PRAGMA user_version;');
    if (result.results && result.results.length > 0) {
      return result.results[0].user_version as number;
    }
    return 0;
  } catch (error) {
    console.error('Failed to get database version:', error);
    return 0;
  }
};

/**
 * Sets the database schema version.
 */
const setVersion = (version: number) => {
  db.execute(`PRAGMA user_version = ${version};`);
};

/**
 * Runs all pending migrations in a transaction.
 */
export const runMigrations = async () => {
  const currentVersion = getCurrentVersion();
  const targetVersion = migrationScripts.length;

  if (currentVersion >= targetVersion) {
    console.log(`Database is up to date at version ${currentVersion}.`);
    return;
  }

  console.log(`Migrating database from version ${currentVersion} to ${targetVersion}...`);

  try {
    // We use a transaction so if any migration fails, the whole block rolls back
    await db.transaction(async (tx) => {
      for (let i = currentVersion; i < targetVersion; i++) {
        const versionNum = i + 1;
        const script = migrationScripts[i];
        
        console.log(`Applying migration v${versionNum}...`);
        tx.execute(script); // Execute script synchronously inside the async transaction
      }
    });

    // Update the version PRAGMA once all migrations succeed
    setVersion(targetVersion);
    console.log(`Successfully migrated to version ${targetVersion}.`);
  } catch (error) {
    console.error(`Database migration failed! DB remains at v${currentVersion}`, error);
    throw error;
  }
};
