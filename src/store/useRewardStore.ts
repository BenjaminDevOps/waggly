import { create } from 'zustand';
import { Achievement, Badge } from '@/types/models';
import { rewardService, RewardEvent } from '@/services/rewardService';

interface RewardState {
  achievements: Achievement[];
  earnedBadges: Badge[];
  totalPoints: number;
  level: number;
  progressToNextLevel: number;
  showRewardModal: boolean;
  lastEarnedReward: { points: number; badges: Badge[] } | null;
  loadAchievements: (userId: string) => Promise<void>;
  processReward: (event: RewardEvent) => Promise<void>;
  updatePoints: (points: number) => void;
  closeRewardModal: () => void;
}

export const useRewardStore = create<RewardState>((set, get) => ({
  achievements: [],
  earnedBadges: [],
  totalPoints: 0,
  level: 1,
  progressToNextLevel: 0,
  showRewardModal: false,
  lastEarnedReward: null,

  loadAchievements: async (userId: string) => {
    const achievements = await rewardService.checkAchievements(userId);
    set({ achievements });
  },

  processReward: async (event: RewardEvent) => {
    const reward = await rewardService.processRewardEvent(event);
    if (reward.points > 0 || reward.newBadges.length > 0) {
      set({
        showRewardModal: true,
        lastEarnedReward: reward,
      });
      get().updatePoints(reward.points);
    }
  },

  updatePoints: (points: number) => {
    const newTotal = get().totalPoints + points;
    const level = rewardService.calculateLevel(newTotal);
    const progress = rewardService.getProgressToNextLevel(newTotal);
    set({
      totalPoints: newTotal,
      level,
      progressToNextLevel: progress,
    });
  },

  closeRewardModal: () => {
    set({ showRewardModal: false, lastEarnedReward: null });
  },
}));
