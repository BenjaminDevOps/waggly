import { db } from './firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { COLLECTIONS } from '../constants/app';
import type { User, BadgeId, Pet, HealthRecord } from '../models/types';
import type { Translations } from '../i18n/types';

export function getBadgeName(t: Translations, id: BadgeId): string {
  return t.badges[`${id}Name` as keyof Translations['badges']] as string;
}

export function getBadgeDescription(t: Translations, id: BadgeId): string {
  return t.badges[`${id}Description` as keyof Translations['badges']] as string;
}

interface BadgeContext {
  user: User;
  pets: Pet[];
  records: HealthRecord[];
}

type BadgeCheck = (ctx: BadgeContext) => boolean;

const BADGE_CHECKS: Record<BadgeId, BadgeCheck> = {
  firstPet: (ctx) => ctx.pets.length >= 1,
  firstDiagnosis: (ctx) => ctx.user.aiDiagnosisUsed >= 1,
  streak7Days: (ctx) => ctx.user.dailyStreak >= 7,
  streak30Days: (ctx) => ctx.user.dailyStreak >= 30,
  points100: (ctx) => ctx.user.totalPoints >= 100,
  points500: (ctx) => ctx.user.totalPoints >= 500,
  points1000: (ctx) => ctx.user.totalPoints >= 1000,
  vetVisit5: (ctx) => ctx.records.filter(r => r.type === 'vetVisit').length >= 5,
  healthChampion: (ctx) => ctx.records.length >= 10,
};

export async function checkAndAwardBadges(
  userId: string,
  ctx: BadgeContext,
): Promise<BadgeId[]> {
  const currentBadges = new Set(ctx.user.badges ?? []);
  const newBadges: BadgeId[] = [];

  for (const [badgeId, check] of Object.entries(BADGE_CHECKS)) {
    if (!currentBadges.has(badgeId) && check(ctx)) {
      newBadges.push(badgeId as BadgeId);
    }
  }

  if (newBadges.length > 0) {
    try {
      const userRef = doc(db, COLLECTIONS.users, userId);
      await updateDoc(userRef, {
        badges: arrayUnion(...newBadges),
      });
    } catch (e) {
      console.error('Error awarding badges:', e);
    }
  }

  return newBadges;
}
