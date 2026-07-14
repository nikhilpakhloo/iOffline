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
  // Version 2 (TechReighs Game Tables)
  `
    CREATE TABLE IF NOT EXISTS Cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character_name TEXT NOT NULL,
      description TEXT NOT NULL,
      
      -- Effects for Swiping Right (Yes/Approve)
      effect_cash_yes INTEGER NOT NULL,
      effect_morale_yes INTEGER NOT NULL,
      effect_product_yes INTEGER NOT NULL,
      effect_pr_yes INTEGER NOT NULL,
      
      -- Effects for Swiping Left (No/Deny)
      effect_cash_no INTEGER NOT NULL,
      effect_morale_no INTEGER NOT NULL,
      effect_product_no INTEGER NOT NULL,
      effect_pr_no INTEGER NOT NULL,
      
      -- Optional conditions (e.g. "cash > 50")
      condition TEXT DEFAULT NULL
    );

    CREATE TABLE IF NOT EXISTS HighScores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      weeks_survived INTEGER NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `,
  // Version 3 (Fix for missing HighScores table due to statement splitting issue)
  `
    CREATE TABLE IF NOT EXISTS HighScores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      weeks_survived INTEGER NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `
];
