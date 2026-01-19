import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AccessibilitySettings,
  DEFAULT_ACCESSIBILITY_SETTINGS,
  BalloonSize,
  BalloonSpeed,
  ColorMode,
} from '@/types/accessibility';

interface AccessibilityState {
  settings: AccessibilitySettings;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  toggleVoice: () => void;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleReducedMotion: () => void;
  toggleEnlargedTouchArea: () => void;
  toggleKeyboardEnabled: () => void;
  setColorMode: (mode: ColorMode) => void;
  setBalloonSize: (size: BalloonSize) => void;
  setBalloonSpeed: (speed: BalloonSpeed) => void;
  resetSettings: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      settings: DEFAULT_ACCESSIBILITY_SETTINGS,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      toggleVoice: () => {
        set((state) => ({
          settings: { ...state.settings, voiceEnabled: !state.settings.voiceEnabled },
        }));
      },

      toggleHighContrast: () => {
        set((state) => ({
          settings: { ...state.settings, highContrast: !state.settings.highContrast },
        }));
      },

      toggleLargeText: () => {
        set((state) => ({
          settings: { ...state.settings, largeText: !state.settings.largeText },
        }));
      },

      toggleReducedMotion: () => {
        set((state) => ({
          settings: { ...state.settings, reducedMotion: !state.settings.reducedMotion },
        }));
      },

      toggleEnlargedTouchArea: () => {
        set((state) => ({
          settings: { ...state.settings, enlargedTouchArea: !state.settings.enlargedTouchArea },
        }));
      },

      toggleKeyboardEnabled: () => {
        set((state) => ({
          settings: { ...state.settings, keyboardEnabled: !state.settings.keyboardEnabled },
        }));
      },

      setColorMode: (mode) => {
        set((state) => ({
          settings: { ...state.settings, colorMode: mode },
        }));
      },

      setBalloonSize: (size) => {
        set((state) => ({
          settings: { ...state.settings, balloonSize: size },
        }));
      },

      setBalloonSpeed: (speed) => {
        set((state) => ({
          settings: { ...state.settings, balloonSpeed: speed },
        }));
      },

      resetSettings: () => {
        set({ settings: DEFAULT_ACCESSIBILITY_SETTINGS });
      },
    }),
    {
      name: 'kiply-accessibility',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
