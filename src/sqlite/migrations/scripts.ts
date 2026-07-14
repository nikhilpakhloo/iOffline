/**
 * Each element in this array represents a database version migration.
 * The index in the array + 1 is the migration version (e.g., index 0 = version 1).
 * DO NOT modify existing scripts once they have been shipped in production.
 * Instead, append new migration scripts to the end of the array.
 */
export const migrationScripts: string[] = [
  // Version 1
  `
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `,
];
