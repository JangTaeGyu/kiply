'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ParentLock, WeeklyChart, GameProgressCard, InsightCard } from '@/components/report';
import { useReportStore } from '@/stores/reportStore';

export default function ReportPage() {
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { getWeeklyActivity, getAllGameProgress, getInsights } = useReportStore();

  if (!isUnlocked) {
    return <ParentLock onUnlock={() => setIsUnlocked(true)} />;
  }

  const weeklyActivity = getWeeklyActivity();
  const gameProgress = getAllGameProgress();
  const insights = getInsights();

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-6 pt-12 pb-8 rounded-b-[2rem]">
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
            📊
          </motion.div>
          <h1 className="text-2xl font-bold mb-1">학습 리포트</h1>
          <p className="text-white/80 text-sm">우리 아이의 학습 현황을 확인해요</p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-6 space-y-6 overflow-y-auto">
        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <WeeklyChart data={weeklyActivity} />
        </motion.div>

        {/* Learning Insights */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-bold text-foreground mb-3">학습 인사이트</h3>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <InsightCard key={insight.id} insight={insight} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Game Progress */}
        {gameProgress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-bold text-foreground mb-3">게임별 진행 상황</h3>
            <div className="space-y-3">
              {gameProgress.map((progress, index) => (
                <GameProgressCard key={progress.gameId} progress={progress} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {gameProgress.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4">🎮</div>
            <p className="text-foreground/60">아직 게임 기록이 없어요</p>
            <p className="text-foreground/40 text-sm">게임을 플레이하면 여기에 기록이 나타나요!</p>
          </motion.div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-foreground/40 pt-4 pb-8">
          <p>이 리포트는 자동으로 업데이트됩니다</p>
        </div>
      </div>
    </div>
  );
}
