export interface UserModel {
  id: number;
  name: string;
  email: string | null;
  created_at: string;
  updated_at: string;
}

// Represents the result structure from Nitro SQLite
export interface SQLiteResult {
  results: any[];
  rowsAffected: number;
  insertId?: number;
}
