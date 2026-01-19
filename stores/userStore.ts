import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, AVATAR_OPTIONS, MAX_PROFILES } from '@/types/user';

interface UserState {
  profiles: UserProfile[];
  currentProfileId: string | null;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  createProfile: (name: string, avatar: string) => UserProfile | null;
  updateProfile: (id: string, updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>) => void;
  deleteProfile: (id: string) => void;
  switchProfile: (id: string) => void;
  getCurrentProfile: () => UserProfile | null;
  canCreateProfile: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profiles: [],
      currentProfileId: null,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      createProfile: (name, avatar) => {
        const { profiles } = get();
        if (profiles.length >= MAX_PROFILES) return null;

        const newProfile: UserProfile = {
          id: `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          avatar,
          createdAt: Date.now(),
        };

        set((state) => ({
          profiles: [...state.profiles, newProfile],
          currentProfileId: state.currentProfileId || newProfile.id,
        }));

        return newProfile;
      },

      updateProfile: (id, updates) => {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProfile: (id) => {
        set((state) => {
          const newProfiles = state.profiles.filter((p) => p.id !== id);
          let newCurrentId = state.currentProfileId;

          // If deleting current profile, switch to another
          if (state.currentProfileId === id) {
            newCurrentId = newProfiles.length > 0 ? newProfiles[0].id : null;
          }

          return {
            profiles: newProfiles,
            currentProfileId: newCurrentId,
          };
        });
      },

      switchProfile: (id) => {
        const { profiles } = get();
        if (profiles.some((p) => p.id === id)) {
          set({ currentProfileId: id });
        }
      },

      getCurrentProfile: () => {
        const { profiles, currentProfileId } = get();
        return profiles.find((p) => p.id === currentProfileId) || null;
      },

      canCreateProfile: () => {
        return get().profiles.length < MAX_PROFILES;
      },
    }),
    {
      name: 'kiply-users',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
