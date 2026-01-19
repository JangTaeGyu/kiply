import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // Sound settings
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  musicEnabled: boolean;
  musicVolume: number; // 0 to 1

  // Actions
  toggleSound: () => void;
  setSoundVolume: (volume: number) => void;
  toggleMusic: () => void;
  setMusicVolume: (volume: number) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  soundVolume: 0.7,
  musicEnabled: true,
  musicVolume: 0.5,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },

      setSoundVolume: (volume: number) => {
        set({ soundVolume: Math.max(0, Math.min(1, volume)) });
      },

      toggleMusic: () => {
        set((state) => ({ musicEnabled: !state.musicEnabled }));
      },

      setMusicVolume: (volume: number) => {
        set({ musicVolume: Math.max(0, Math.min(1, volume)) });
      },

      resetSettings: () => {
        set(DEFAULT_SETTINGS);
      },
    }),
    {
      name: 'kiply-settings',
    }
  )
);
