export interface UserModel {
  id: number;
  name: string;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface CardModel {
  id: number;
  character_name: string;
  description: string;

  effect_cash_yes: number;
  effect_morale_yes: number;
  effect_product_yes: number;
  effect_pr_yes: number;

  effect_cash_no: number;
  effect_morale_no: number;
  effect_product_no: number;
  effect_pr_no: number;

  condition: string | null;
}

export interface HighScoreModel {
  id: number;
  weeks_survived: number;
  date: string;
}

// Represents the result structure from Nitro SQLite
export interface SQLiteResult {
  results: any[];
  rowsAffected: number;
  insertId?: number;
}
