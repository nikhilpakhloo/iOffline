import db from '../database';

/**
 * An abstract base class for repositories (DAOs).
 * Provides common database operations and standard error handling.
 */
export abstract class BaseRepository<T> {
  protected abstract tableName: string;

  /**
   * Executes an asynchronous query, mostly used for writing or heavy reads.
   */
  protected async executeAsync(sql: string, params: any[] = []): Promise<T[]> {
    try {
      const result = await db.executeAsync(sql, params);
      return (result.results || []) as T[];
    } catch (error) {
      console.error(`[BaseRepository] Query Error in table ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Executes a synchronous query, ideal for quick, small reads.
   */
  protected execute(sql: string, params: any[] = []): T[] {
    try {
      const result = db.execute(sql, params);
      return (result.results || []) as T[];
    } catch (error) {
      console.error(`[BaseRepository] Query Error in table ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Find a record by its ID.
   */
  public async findById(id: number): Promise<T | null> {
    const rows = await this.executeAsync(`SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Get all records from the table.
   */
  public async findAll(): Promise<T[]> {
    return this.executeAsync(`SELECT * FROM ${this.tableName}`);
  }

  /**
   * Delete a record by ID.
   */
  public async deleteById(id: number): Promise<void> {
    await this.executeAsync(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
  }
}
