import { BaseRepository } from './BaseRepository';
import { UserModel } from '../types';

/**
 * Repository for interacting with the Users table.
 */
export class UserRepository extends BaseRepository<UserModel> {
  protected tableName = 'Users';

  /**
   * Creates a new user in the database.
   */
  public async create(name: string, email?: string): Promise<UserModel | null> {
    const sql = `
      INSERT INTO ${this.tableName} (name, email)
      VALUES (?, ?)
      RETURNING *;
    `;
    const rows = await this.executeAsync(sql, [name, email || null]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Example of a custom synchronous query to fetch a user by email.
   */
  public findByEmail(email: string): UserModel | null {
    const rows = this.execute(`SELECT * FROM ${this.tableName} WHERE email = ? LIMIT 1`, [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Updates an existing user's name and email.
   */
  public async update(id: number, name: string, email?: string): Promise<UserModel | null> {
    const sql = `
      UPDATE ${this.tableName}
      SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      RETURNING *;
    `;
    const rows = await this.executeAsync(sql, [name, email || null, id]);
    return rows.length > 0 ? rows[0] : null;
  }
}

// Export a singleton instance of the repository
export const userRepository = new UserRepository();
