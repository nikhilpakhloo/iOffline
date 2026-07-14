import db, { configureDatabase } from './database';
import { runMigrations } from './migrations';

// Export Repositories
export { userRepository } from './repositories/UserRepository';
export { BaseRepository } from './repositories/BaseRepository';
export { cardRepository } from './repositories/CardRepository';
export { highScoreRepository } from './repositories/HighScoreRepository';

// Export Types
export * from './types';

/**
 * Initialize the database. Should be called exactly once on app startup.
 */
export const initDB = async () => {
    try {
        // 1. Configure DB settings (e.g. WAL mode)
        await configureDatabase();

        // 2. Run schema migrations
        await runMigrations();
        
        // 3. Seed initial game data if needed
        const { cardRepository } = require('./repositories/CardRepository');
        await cardRepository.seedCardsIfEmpty();

        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
};

export default db;