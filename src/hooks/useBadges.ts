import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { usePets } from './usePets';
import { checkAndAwardBadges } from '../services/badgeService';
import { subscribeToWalks } from '../services/walkFirestoreService';
import { subscribeToHealthRecords } from '../services/healthRecordService';
import type { Walk, HealthRecord } from '../models/types';

export function useBadgeChecker() {
  const { firebaseUser, user } = useAuth();
  const { pets } = usePets();
  const walksRef = useRef<Walk[]>([]);
  const recordsRef = useRef<HealthRecord[]>([]);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!firebaseUser) return;
    const unsub = subscribeToWalks(firebaseUser.uid, (w) => { walksRef.current = w; });
    return unsub;
  }, [firebaseUser]);

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

  useEffect(() => {
    if (!firebaseUser || !user || checkedRef.current) return;
    checkedRef.current = true;

    const timer = setTimeout(() => {
      checkAndAwardBadges(firebaseUser.uid, {
        user,
        pets,
        walks: walksRef.current,
        records: recordsRef.current,
      }).catch(console.error);
    }, 3000);

    return () => clearTimeout(timer);
  }, [firebaseUser, user, pets]);

  useEffect(() => {
    if (!firebaseUser || !user) return;

    const interval = setInterval(() => {
      checkAndAwardBadges(firebaseUser.uid, {
        user,
        pets,
        walks: walksRef.current,
        records: recordsRef.current,
      }).catch(console.error);
    }, 60000);

    return () => clearInterval(interval);
  }, [firebaseUser, user, pets]);
}
