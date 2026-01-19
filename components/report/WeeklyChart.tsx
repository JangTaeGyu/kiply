'use client';

import { motion } from 'framer-motion';
import { DailyActivity } from '@/types/report';

interface WeeklyChartProps {
  data: DailyActivity[];
}

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export function WeeklyChart({ data }: WeeklyChartProps) {
  const maxGames = Math.max(...data.map((d) => d.gamesPlayed), 1);
  const maxScore = Math.max(...data.map((d) => d.totalScore), 1);

  const totalGames = data.reduce((sum, d) => sum + d.gamesPlayed, 0);
  const totalScore = data.reduce((sum, d) => sum + d.totalScore, 0);
  const totalTime = data.reduce((sum, d) => sum + d.totalTime, 0);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg">
      <h3 className="font-bold text-foreground mb-4">이번 주 활동</h3>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-primary/10 rounded-2xl p-3 text-center">
          <div className="text-2xl font-bold text-primary">{totalGames}</div>
          <div className="text-xs text-foreground/60">게임 횟수</div>
        </div>
        <div className="bg-secondary/10 rounded-2xl p-3 text-center">
          <div className="text-2xl font-bold text-secondary">{totalScore}</div>
          <div className="text-xs text-foreground/60">총 점수</div>
        </div>
        <div className="bg-accent/10 rounded-2xl p-3 text-center">
          <div className="text-2xl font-bold text-accent">{Math.floor(totalTime / 60)}분</div>
          <div className="text-xs text-foreground/60">플레이 시간</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((day, index) => {
          const date = new Date(day.date);
          const dayName = DAY_NAMES[date.getDay()];
          const isToday = day.date === new Date().toISOString().split('T')[0];
          const barHeight = (day.gamesPlayed / maxGames) * 100;

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(barHeight, 5)}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`w-full rounded-t-lg ${
                  isToday ? 'bg-primary' : 'bg-primary/40'
                } relative group`}
              >
                {day.gamesPlayed > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-primary"
                  >
                    {day.gamesPlayed}
                  </motion.div>
                )}
              </motion.div>
              <span className={`text-xs ${isToday ? 'font-bold text-primary' : 'text-foreground/60'}`}>
                {dayName}
              </span>
            </div>
          );
        })}
      </div>

      {totalGames === 0 && (
        <div className="text-center text-foreground/50 py-4">
          <p className="text-sm">이번 주에 아직 게임 기록이 없어요</p>
        </div>
      )}
    </div>
  );
}
