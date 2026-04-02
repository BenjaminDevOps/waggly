import { useEffect, useState } from 'react';
import { subscribeToPets } from '../services/petService';
import { useAuth } from './useAuth';
import type { Pet } from '../models/types';

export function usePets(): { pets: Pet[]; loading: boolean } {
  const { firebaseUser } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) {
      setPets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToPets(firebaseUser.uid, (p) => {
      setPets(p);
      setLoading(false);
    });

    return unsubscribe;
  }, [firebaseUser]);

  return { pets, loading };
}
