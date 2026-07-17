import { BaseRepository } from './BaseRepository';
import { CardModel } from '../types';

export class CardRepository extends BaseRepository<CardModel> {
  protected tableName = 'Cards';

  /**
   * Fetches a random card from the database.
   * Can be extended later to include conditions (e.g., only fetch cards if cash > 50)
   */
  public async getRandomCard(excludeIds: number[] = []): Promise<CardModel | null> {
    let query = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];
    if (excludeIds.length > 0) {
      const placeholders = excludeIds.map(() => '?').join(',');
      query += ` WHERE id NOT IN (${placeholders})`;
      params.push(...excludeIds);
    }
    query += ` ORDER BY RANDOM() LIMIT 1`;
    const rows = await this.executeAsync(query, params);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Seeds the database with initial tech startup scenarios if the table is empty.
   */
  public async seedCardsIfEmpty(): Promise<void> {
    // Always refresh the cards with our new realistic startup questions
    await this.executeAsync(`DELETE FROM ${this.tableName}`);
    console.log('Seeding initial TechReighs scenario cards...');
    const seedData = [
      { character: "Lead Engineer", desc: "We need 3 weeks to rewrite the codebase to fix massive technical debt.", y_cash: -15, y_morale: -10, y_prod: 25, y_pr: 0, n_cash: 0, n_morale: -20, n_prod: -15, n_pr: 0 },
      { character: "Head of Marketing", desc: "Let's sponsor a controversial influencer for a massive marketing push.", y_cash: -20, y_morale: -5, y_prod: 0, y_pr: 30, n_cash: 0, n_morale: 5, n_prod: 0, n_pr: -10 },
      { character: "Angel Investor", desc: "I will double my investment, but I want you to fire your co-founder.", y_cash: 40, y_morale: -40, y_prod: -10, y_pr: -10, n_cash: -10, n_morale: 20, n_prod: 10, n_pr: 5 },
      { character: "Office Manager", desc: "The team is exhausted. Should we buy a $5,000 espresso machine?", y_cash: -10, y_morale: 25, y_prod: 5, y_pr: 0, n_cash: 5, n_morale: -15, n_prod: -5, n_pr: 0 },
      { character: "Customer Support", desc: "A major bug is deleting user data! Do we publicly apologize immediately?", y_cash: -10, y_morale: -10, y_prod: -10, y_pr: 15, n_cash: 0, n_morale: 0, n_prod: -20, n_pr: -30 },
      { character: "Legal Counsel", desc: "A patent troll is suing us. Settle out of court for $50k?", y_cash: -25, y_morale: -5, y_prod: 0, y_pr: -5, n_cash: -10, n_morale: -15, n_prod: -10, n_pr: 5 },
      { character: "Cloud Provider", desc: "Our AWS bill skyrocketed. We need to throttle user features to save costs.", y_cash: 20, y_morale: -5, y_prod: -20, y_pr: -15, n_cash: -30, n_morale: 5, n_prod: 10, n_pr: 0 },
      { character: "Product Manager", desc: "Let's launch the 'AI Chatbot' feature even though it hallucinates 50% of the time.", y_cash: 10, y_morale: -10, y_prod: -15, y_pr: 20, n_cash: 0, n_morale: 10, n_prod: 10, n_pr: -5 },
      { character: "Venture Capitalist", desc: "Pivot the company to crypto/Web3 and I'll write a $5M check today.", y_cash: 50, y_morale: -30, y_prod: -25, y_pr: 10, n_cash: -10, n_morale: 15, n_prod: 10, n_pr: 0 },
      { character: "Competitor", desc: "Our rival just launched a smear campaign against us. Retaliate?", y_cash: -10, y_morale: 10, y_prod: 0, y_pr: -20, n_cash: 0, n_morale: -10, n_prod: 0, n_pr: 15 },
      { character: "HR Director", desc: "We should mandate 5-days-a-week Return to Office. Productivity is dropping.", y_cash: 5, y_morale: -35, y_prod: 15, y_pr: -10, n_cash: -5, n_morale: 25, n_prod: -10, n_pr: 5 },
      { character: "Data Scientist", desc: "We can sell our users' anonymized data to a 3rd party broker for quick revenue.", y_cash: 35, y_morale: -15, y_prod: 0, y_pr: -40, n_cash: -10, n_morale: 10, n_prod: 0, n_pr: 20 },
      { character: "Enterprise Client", desc: "We'll sign a massive contract, but you must build 5 custom features just for us.", y_cash: 40, y_morale: -20, y_prod: -25, y_pr: 10, n_cash: -20, n_morale: 10, n_prod: 15, n_pr: -5 },
      { character: "Security Lead", desc: "We suffered a minor data breach. Do we disclose it before the press finds out?", y_cash: -15, y_morale: -10, y_prod: 0, y_pr: 15, n_cash: 0, n_morale: -5, n_prod: 0, n_pr: -50 }
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
