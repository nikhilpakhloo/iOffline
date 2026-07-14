import { BaseRepository } from './BaseRepository';
import { CardModel } from '../types';

export class CardRepository extends BaseRepository<CardModel> {
  protected tableName = 'Cards';

  /**
   * Fetches a random card from the database.
   * Can be extended later to include conditions (e.g., only fetch cards if cash > 50)
   */
  public async getRandomCard(): Promise<CardModel | null> {
    // ORDER BY RANDOM() is a SQLite built-in function
    const rows = await this.executeAsync(`SELECT * FROM ${this.tableName} ORDER BY RANDOM() LIMIT 1`);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Seeds the database with initial tech startup scenarios if the table is empty.
   */
  public async seedCardsIfEmpty(): Promise<void> {
    const existingCards = await this.executeAsync(`SELECT count(*) as count FROM ${this.tableName}`);
    if (existingCards[0] && (existingCards[0] as any).count > 0) {
      return; // Already seeded
    }

    console.log('Seeding initial TechReighs scenario cards...');
    const seedData = [
      {
        character: "Lead Engineer",
        desc: "We need 3 weeks to rewrite the codebase to fix massive technical debt.",
        y_cash: -15, y_morale: -10, y_prod: 25, y_pr: 0,
        n_cash: 10, n_morale: -20, n_prod: -15, n_pr: 0
      },
      {
        character: "Head of Marketing",
        desc: "Let's sponsor a controversial influencer for a massive marketing push.",
        y_cash: -20, y_morale: -5, y_prod: 0, y_pr: 30,
        n_cash: 0, n_morale: 5, n_prod: 0, n_pr: -10
      },
      {
        character: "Angel Investor",
        desc: "I will double my investment, but I want you to fire your co-founder.",
        y_cash: 40, y_morale: -40, y_prod: -10, y_pr: -10,
        n_cash: -10, n_morale: 20, n_prod: 10, n_pr: 5
      },
      {
        character: "Office Manager",
        desc: "The team is exhausted. Should we buy a $5,000 espresso machine?",
        y_cash: -10, y_morale: 25, y_prod: 5, y_pr: 0,
        n_cash: 5, n_morale: -15, n_prod: -5, n_pr: 0
      },
      {
        character: "Customer Support",
        desc: "A major bug is deleting user data! Do we publicly apologize immediately?",
        y_cash: -10, y_morale: -10, y_prod: -10, y_pr: 15,
        n_cash: 0, n_morale: 0, n_prod: -20, n_pr: -30
      }
    ];

    for (const card of seedData) {
      await this.executeAsync(`
        INSERT INTO ${this.tableName} 
        (character_name, description, effect_cash_yes, effect_morale_yes, effect_product_yes, effect_pr_yes, effect_cash_no, effect_morale_no, effect_product_no, effect_pr_no)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        card.character, card.desc, 
        card.y_cash, card.y_morale, card.y_prod, card.y_pr,
        card.n_cash, card.n_morale, card.n_prod, card.n_pr
      ]);
    }
    console.log('Finished seeding scenario cards.');
  }
}

export const cardRepository = new CardRepository();
