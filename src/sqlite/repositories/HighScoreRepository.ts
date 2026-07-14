import { BaseRepository } from './BaseRepository';
import { HighScoreModel } from '../types';

export class HighScoreRepository extends BaseRepository<HighScoreModel> {
  protected tableName = 'HighScores';

  /**
   * Saves a new high score.
   */
  public async saveScore(weeksSurvived: number): Promise<void> {
    await this.executeAsync(
      `INSERT INTO ${this.tableName} (weeks_survived) VALUES (?)`,
      [weeksSurvived]
    );
  }

  /**
   * Gets the highest score the player has ever achieved.
   */
  public async getBestScore(): Promise<number> {
    const rows = await this.executeAsync(`SELECT MAX(weeks_survived) as best FROM ${this.tableName}`) as any[];
    return rows.length > 0 && rows[0].best ? (rows[0].best as number) : 0;
  }
}

export const highScoreRepository = new HighScoreRepository();
