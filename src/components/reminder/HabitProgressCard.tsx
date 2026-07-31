/**
 * Habit Progress Card Component
 *
 * Displays habit metrics: consistency rate, current streak, longest streak.
 */
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Target, Calendar } from "lucide-react";
import type { HabitProgress } from "@/services/habit/habit-types";

interface HabitProgressCardProps {
  progress: HabitProgress;
  compact?: boolean;
}

export function HabitProgressCard({ progress, compact = false }: HabitProgressCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Flame className="h-4 w-4 text-orange-500" />
          <span>{progress.currentStreak} day streak</span>
        </div>
        <div className="flex items-center gap-1">
          <Target className="h-4 w-4 text-blue-500" />
          <span>{progress.consistencyRate}% consistency</span>
        </div>
      </div>
    );
  }

  const getStatusColor = (state: string) => {
    switch (state) {
      case "maintained": return "text-green-600";
      case "active": return "text-blue-600";
      case "paused": return "text-yellow-600";
      case "archived": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const getStatusBadge = (state: string) => {
    switch (state) {
      case "maintained": return "🌟 Well maintained";
      case "active": return "🔥 Building momentum";
      case "paused": return "⏸️ Paused";
      case "archived": return "📦 Archived";
      default: return "🌱 Getting started";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className={getStatusColor(progress.currentState)}>
          {getStatusBadge(progress.currentState)}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <Target className="h-4 w-4 text-blue-500" />
            Consistency Rate
          </span>
          <span className="font-medium">{progress.consistencyRate}%</span>
        </div>
        <Progress value={progress.consistencyRate} className="h-2" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Flame className="h-6 w-6 text-orange-500" />
          </div>
          <div className="mt-1 text-2xl font-bold">{progress.currentStreak}</div>
          <div className="text-xs text-gray-500">Current Streak</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center">
            <Trophy className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="mt-1 text-2xl font-bold">{progress.longestStreak}</div>
          <div className="text-xs text-gray-500">Longest Streak</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center">
            <Calendar className="h-6 w-6 text-green-500" />
          </div>
          <div className="mt-1 text-2xl font-bold">{progress.completionCount}</div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
      </div>
    </div>
  );
}
