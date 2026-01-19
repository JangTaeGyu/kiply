'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '@/types/user';
import { ProfileCard } from './ProfileCard';

interface ProfileSwitcherProps {
  profiles: UserProfile[];
  currentProfileId: string | null;
  onSwitch: (id: string) => void;
  onManage: () => void;
}

export function ProfileSwitcher({
  profiles,
  currentProfileId,
  onSwitch,
  onManage,
}: ProfileSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentProfile = profiles.find((p) => p.id === currentProfileId);

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-2xl"
      >
        {currentProfile ? (
          <>
            <span className="text-2xl">{currentProfile.avatar}</span>
            <span className="text-sm font-medium">{currentProfile.name}</span>
          </>
        ) : (
          <>
            <span className="text-2xl">👤</span>
            <span className="text-sm font-medium">프로필 선택</span>
          </>
        )}
        <span className="text-xs ml-1">{isOpen ? '▲' : '▼'}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full mt-2 left-0 right-0 min-w-[200px] bg-white rounded-2xl shadow-xl p-2 z-50"
            >
              <div className="space-y-1 mb-2">
                {profiles.map((profile) => (
                  <motion.button
                    key={profile.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSwitch(profile.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition-colors
                      ${profile.id === currentProfileId
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-gray-100 text-foreground'
                      }`}
                  >
                    <span className="text-xl">{profile.avatar}</span>
                    <span className="font-medium text-sm">{profile.name}</span>
                    {profile.id === currentProfileId && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onManage();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 text-foreground/60"
                >
                  <span className="text-xl">⚙️</span>
                  <span className="text-sm">프로필 관리</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
