'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { AvatarPicker, ProfileCard } from '@/components/user';
import { useUserStore } from '@/stores/userStore';
import { AVATAR_OPTIONS, MAX_PROFILES } from '@/types/user';

type ModalState = 'none' | 'create' | 'edit' | 'delete';

export default function ProfilePage() {
  const router = useRouter();
  const {
    profiles,
    currentProfileId,
    createProfile,
    updateProfile,
    deleteProfile,
    switchProfile,
    canCreateProfile,
  } = useUserStore();

  const [modalState, setModalState] = useState<ModalState>('none');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);

  const handleCreateProfile = () => {
    if (!name.trim()) return;
    createProfile(name.trim(), avatar);
    resetForm();
  };

  const handleUpdateProfile = () => {
    if (!editingProfileId || !name.trim()) return;
    updateProfile(editingProfileId, { name: name.trim(), avatar });
    resetForm();
  };

  const handleDeleteProfile = () => {
    if (!editingProfileId) return;
    deleteProfile(editingProfileId);
    resetForm();
  };

  const openEditModal = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId);
    if (profile) {
      setEditingProfileId(profileId);
      setName(profile.name);
      setAvatar(profile.avatar);
      setModalState('edit');
    }
  };

  const openDeleteModal = (profileId: string) => {
    setEditingProfileId(profileId);
    setModalState('delete');
  };

  const resetForm = () => {
    setModalState('none');
    setEditingProfileId(null);
    setName('');
    setAvatar(AVATAR_OPTIONS[0]);
  };

  const profileToDelete = editingProfileId
    ? profiles.find((p) => p.id === editingProfileId)
    : null;

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white px-6 pt-12 pb-8 rounded-b-[2rem]">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="absolute top-12 left-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
        >
          <span className="text-xl">&larr;</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-5xl mb-3"
          >
            👤
          </motion.div>
          <h1 className="text-2xl font-bold mb-1">프로필 관리</h1>
          <p className="text-white/80 text-sm">
            최대 {MAX_PROFILES}개의 프로필을 만들 수 있어요
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-6 space-y-4 overflow-y-auto">
        {/* Profile List */}
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProfileCard
              profile={profile}
              isActive={profile.id === currentProfileId}
              onClick={() => switchProfile(profile.id)}
              onEdit={() => openEditModal(profile.id)}
              onDelete={profiles.length > 1 ? () => openDeleteModal(profile.id) : undefined}
              showActions
            />
          </motion.div>
        ))}

        {/* Add Profile Button */}
        {canCreateProfile() && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: profiles.length * 0.1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModalState('create')}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-300 text-foreground/60 hover:border-primary hover:text-primary transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">+</span>
              <span className="font-medium">새 프로필 추가</span>
            </div>
          </motion.button>
        )}

        {/* Info */}
        <div className="text-center text-xs text-foreground/40 pt-4 pb-8">
          <p>프로필마다 별도의 통계와 기록이 저장됩니다</p>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(modalState === 'create' || modalState === 'edit') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-foreground mb-4 text-center">
                {modalState === 'create' ? '새 프로필 만들기' : '프로필 수정'}
              </h2>

              {/* Avatar Picker */}
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground/70 mb-2 block">
                  아바타 선택
                </label>
                <AvatarPicker selected={avatar} onSelect={setAvatar} />
              </div>

              {/* Name Input */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground/70 mb-2 block">
                  이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="ghost" onClick={resetForm} fullWidth>
                  취소
                </Button>
                <Button
                  onClick={modalState === 'create' ? handleCreateProfile : handleUpdateProfile}
                  fullWidth
                  disabled={!name.trim()}
                >
                  {modalState === 'create' ? '만들기' : '저장'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {modalState === 'delete' && profileToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-4">{profileToDelete.avatar}</div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                프로필을 삭제할까요?
              </h2>
              <p className="text-foreground/60 text-sm mb-6">
                &apos;{profileToDelete.name}&apos;의 모든 게임 기록이 삭제됩니다.
                <br />
                이 작업은 되돌릴 수 없어요.
              </p>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={resetForm} fullWidth>
                  취소
                </Button>
                <Button variant="accent" onClick={handleDeleteProfile} fullWidth>
                  삭제
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
