import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';
import { usePets } from './usePets';
import { checkAndAwardBadges, getBadgeName } from '../services/badgeService';
import { subscribeToHealthRecords } from '../services/healthRecordService';
import { addPoints } from '../services/userService';
import { POINTS } from '../constants/app';
import { BADGES } from '../models/types';
import { useCelebrations } from '../components/CelebrationProvider';
import { useI18n } from '../i18n';
import type { HealthRecord } from '../models/types';

export function useBadgeChecker() {
  const { firebaseUser, user } = useAuth();
  const { pets } = usePets();
  const { celebrate } = useCelebrations();
  const { t } = useI18n();
  const recordsRef = useRef<HealthRecord[]>([]);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!firebaseUser || pets.length === 0) return;
    const unsubs = pets.map(p =>
      subscribeToHealthRecords(p.id, (r) => {
        recordsRef.current = [
          ...recordsRef.current.filter(rec => rec.petId !== p.id),
          ...r,
        ];
      }),
    );
    return () => unsubs.forEach(u => u());
  }, [firebaseUser, pets]);

  const runCheck = useCallback(() => {
    if (!firebaseUser || !user) return;

    checkAndAwardBadges(firebaseUser.uid, {
      user,
      pets,
      records: recordsRef.current,
    }).then((newBadges) => {
      for (const badgeId of newBadges) {
        const badge = BADGES.find(b => b.id === badgeId);
        if (!badge) continue;
        celebrate({
          id: badgeId,
          emoji: badge.emoji,
          title: getBadgeName(t, badgeId),
          subtitle: t.badges.celebrationSubtitle,
          xpReward: POINTS.badgeEarned,
        });
        addPoints(firebaseUser.uid, POINTS.badgeEarned).catch((e) => console.error('Error awarding badge XP:', e));
      }
    }).catch(console.error);
  }, [firebaseUser, user, pets, celebrate, t]);

  useEffect(() => {
    if (!firebaseUser || !user || checkedRef.current) return;
    checkedRef.current = true;

    const timer = setTimeout(runCheck, 3000);
    return () => clearTimeout(timer);
  }, [firebaseUser, user, runCheck]);

  useEffect(() => {
    if (!firebaseUser || !user) return;

    const interval = setInterval(runCheck, 60000);
    return () => clearInterval(interval);
  }, [firebaseUser, user, runCheck]);
}
