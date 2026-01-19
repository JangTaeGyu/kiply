import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AccessibilitySettings, DEFAULT_ACCESSIBILITY_SETTINGS } from '@/types/accessibility';

interface AccessibilityState {
  settings: AccessibilitySettings;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  toggleVoice: () => void;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleReducedMotion: () => void;
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
