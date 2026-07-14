import { open } from 'react-native-nitro-sqlite';

const DB_NAME = 'Nativelens_DB.sqlite';

// Open the database connection
const db = open({ name: DB_NAME });

/**
 * Configure standard performance PRAGMAs for SQLite.
 * WAL mode improves concurrency and write performance.
 */
export const configureDatabase = async () => {
  try {
    // Execute PRAGMAs outside of standard transactions
    db.execute('PRAGMA journal_mode = WAL;');
    db.execute('PRAGMA foreign_keys = ON;');
    console.log('Database PRAGMAs configured successfully.');
  } catch (error) {
    console.error('Failed to configure database PRAGMAs:', error);
  }
};

export default db;
