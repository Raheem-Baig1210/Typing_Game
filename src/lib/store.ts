import { create } from 'zustand';
import { useSession } from 'next-auth/react';

export type GameMode = 'classic' | 'survival' | 'custom' | 'multiplayer';

export type ThemeType = 'light' | 'dark' | 'neon' | 'retro';

export interface UserStats {
  wpm: number;
  accuracy: number;
  highestWpm: number;
  averageWpm: number;
  gamesPlayed: number;
  totalTimePlayed: number; // in seconds
  lastPlayed: Date | null;
}

export interface GameState {
  // Game settings
  gameMode: GameMode;
  theme: ThemeType;
  soundEnabled: boolean;
  
  // Game state
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  startTime: number | null;
  endTime: number | null;
  
  // Text and typing data
  currentText: string;
  userInput: string;
  position: number;
  errors: number;
  correctChars: number;
  
  // Stats
  wpm: number;
  accuracy: number;
  userStats: UserStats;
  
  // Custom text
  customTexts: string[];
  
  // Actions
  setGameMode: (mode: GameMode) => void;
  setTheme: (theme: ThemeType) => void;
  toggleSound: () => void;
  
  startGame: (text?: string) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  
  updateUserInput: (input: string) => void;
  addCustomText: (text: string) => void;
  removeCustomText: (index: number) => void;
  
  // Database actions
  saveGameResults: () => Promise<void>;
}

const initialUserStats: UserStats = {
  wpm: 0,
  accuracy: 0,
  highestWpm: 0,
  averageWpm: 0,
  gamesPlayed: 0,
  totalTimePlayed: 0,
  lastPlayed: null,
};

export const useGameStore = create<GameState>((set, get) => ({
  // Game settings
  gameMode: 'classic',
  theme: 'light',
  soundEnabled: true,
  
  // Game state
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  startTime: null,
  endTime: null,
  
  // Text and typing data
  currentText: '',
  userInput: '',
  position: 0,
  errors: 0,
  correctChars: 0,
  
  // Stats
  wpm: 0,
  accuracy: 0,
  userStats: initialUserStats,
  
  // Custom text
  customTexts: [],
  
  // Actions
  setGameMode: (mode) => set({ gameMode: mode }),
  setTheme: (theme) => set({ theme }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  
  startGame: (text) => {
    const textToUse = text || get().currentText;
    set({
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      startTime: Date.now(),
      endTime: null,
      currentText: textToUse,
      userInput: '',
      position: 0,
      errors: 0,
      correctChars: 0,
      wpm: 0,
      accuracy: 0,
    });
  },
  
  pauseGame: () => set({ isPaused: true }),
  
  resumeGame: () => set({ isPaused: false }),
  
  endGame: () => {
    const state = get();
    const endTime = Date.now();
    const timeElapsed = (endTime - (state.startTime || 0)) / 1000 / 60; // in minutes
    
    // Calculate WPM: (characters / 5) / minutes
    const wpm = Math.round((state.correctChars / 5) / timeElapsed);
    
    // Calculate accuracy
    const totalChars = state.position;
    const accuracy = totalChars > 0 ? Math.round((totalChars - state.errors) / totalChars * 100) : 0;
    
    // Update user stats
    const userStats = { ...state.userStats };
    userStats.wpm = wpm;
    userStats.accuracy = accuracy;
    userStats.highestWpm = Math.max(userStats.highestWpm, wpm);
    userStats.gamesPlayed += 1;
    userStats.totalTimePlayed += timeElapsed * 60; // convert to seconds
    userStats.lastPlayed = new Date();
    
    // Calculate new average WPM
    userStats.averageWpm = Math.round(
      (userStats.averageWpm * (userStats.gamesPlayed - 1) + wpm) / userStats.gamesPlayed
    );
    
    set({
      isPlaying: false,
      isGameOver: true,
      endTime,
      wpm,
      accuracy,
      userStats,
    });
    
    // Save game results to database if user is authenticated
    get().saveGameResults();
  },
  
  resetGame: () => set({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    startTime: null,
    endTime: null,
    userInput: '',
    position: 0,
    errors: 0,
    correctChars: 0,
    wpm: 0,
    accuracy: 0,
  }),
  
  updateUserInput: (input) => {
    const state = get();
    const { currentText } = state;
    
    if (!state.isPlaying || state.isPaused || state.isGameOver) return;
    
    let newErrors = state.errors;
    let newCorrectChars = state.correctChars;
    
    // Check if the new character is correct
    if (input.length > state.userInput.length) {
      const newChar = input[input.length - 1];
      const expectedChar = currentText[state.position];
      
      if (newChar === expectedChar) {
        newCorrectChars += 1;
      } else {
        newErrors += 1;
      }
    }
    
    // Update position
    const newPosition = input.length;
    
    // Check if the game is complete
    if (newPosition === currentText.length) {
      set({
        userInput: input,
        position: newPosition,
        errors: newErrors,
        correctChars: newCorrectChars,
      });
      get().endGame();
      return;
    }
    
    set({
      userInput: input,
      position: newPosition,
      errors: newErrors,
      correctChars: newCorrectChars,
    });
  },
  
  addCustomText: (text) => set((state) => ({
    customTexts: [...state.customTexts, text],
  })),
  
  removeCustomText: (index) => set((state) => ({
    customTexts: state.customTexts.filter((_, i) => i !== index),
  })),
  
  saveGameResults: async () => {
    try {
      const state = get();
      
      // Only save if the game is over and we have a valid WPM
      if (!state.isGameOver || state.wpm <= 0) return;
      
      // Check if user is authenticated
      const session = useSession();
      if (session.status !== 'authenticated') return;
      
      // Calculate duration in seconds
      const duration = state.endTime && state.startTime 
        ? Math.round((state.endTime - state.startTime) / 1000) 
        : 0;
      
      // Save game results to the database
      const response = await fetch('/api/user/game-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameMode: state.gameMode,
          wpm: state.wpm,
          accuracy: state.accuracy,
          textLength: state.currentText.length,
          duration,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save game results');
      }
      
      console.log('Game results saved successfully');
    } catch (error) {
      console.error('Error saving game results:', error);
    }
  },
})); 