'use client';

import { motion } from 'framer-motion';
import { UserProfile } from '@/types/user';

interface ProfileCardProps {
  profile: UserProfile;
  isActive: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export function ProfileCard({
  profile,
  isActive,
  onClick,
  onEdit,
  onDelete,
  showActions = false,
}: ProfileCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-4 rounded-2xl cursor-pointer transition-all
        ${isActive
          ? 'bg-white shadow-lg ring-2 ring-primary'
          : 'bg-white/60 hover:bg-white hover:shadow-md'
        }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl
          ${isActive ? 'bg-primary/20' : 'bg-gray-100'}`}
        >
          {profile.avatar}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-foreground">{profile.name}</h3>
          {isActive && (
            <span className="text-xs text-primary font-medium">현재 사용 중</span>
          )}
        </div>
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
          >
            <span className="text-white text-sm">✓</span>
          </motion.div>
        )}
      </div>

      {showActions && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex-1 py-2 text-sm text-foreground/60 hover:text-primary transition-colors"
            >
              수정
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex-1 py-2 text-sm text-foreground/60 hover:text-error transition-colors"
            >
              삭제
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
