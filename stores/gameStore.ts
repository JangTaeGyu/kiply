import { create } from 'zustand';
import { GameResult } from '@/types/game';

interface GameState {
  currentResult: GameResult | null;
  setResult: (result: GameResult) => void;
  clearResult: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentResult: null,
  setResult: (result) => set({ currentResult: result }),
  clearResult: () => set({ currentResult: null }),
}));
