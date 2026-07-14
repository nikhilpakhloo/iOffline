export interface GameState {
  cash: number;
  morale: number;
  product: number;
  pr: number;
  weeksSurvived: number;
}

export const INITIAL_GAME_STATE: GameState = {
  cash: 50,
  morale: 50,
  product: 50,
  pr: 50,
  weeksSurvived: 0,
};
