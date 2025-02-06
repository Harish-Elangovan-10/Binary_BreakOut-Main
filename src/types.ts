export type CardType = {
  id: number;
  type: 'answer' | 'penalty' | 'bonus' | 'shuffle' | 'message';
  value?: number;
  message?: string;
  isFlipped: boolean;
};

export type GameState = 'playing' | 'won' | 'lost';