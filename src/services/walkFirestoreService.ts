import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { Walk } from '../models/types';
import { COLLECTIONS } from '../constants/app';

export async function saveWalk(
  userId: string,
  data: Omit<Walk, 'id' | 'userId'>,
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.walks), {
    userId,
    ...data,
  });
  return docRef.id;
}

export function subscribeToWalks(
  userId: string,
  callback: (walks: Walk[]) => void,
  maxResults?: number,
): () => void {
  try {
    const q = maxResults
      ? query(
          collection(db, COLLECTIONS.walks),
          where('userId', '==', userId),
          orderBy('startTime', 'desc'),
          limit(maxResults),
        )
      : query(
          collection(db, COLLECTIONS.walks),
          where('userId', '==', userId),
          orderBy('startTime', 'desc'),
        );

    return onSnapshot(
      q,
      (snapshot) => {
        const walks: Walk[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Walk[];
        callback(walks);
      },
      (error) => {
        console.error('Error subscribing to walks:', error);
        callback([]);
      },
    );
  } catch (error) {
    console.error('Error setting up walks subscription:', error);
    callback([]);
    return () => {};
  }
}

export function subscribeToTodayWalks(
  userId: string,
  callback: (walks: Walk[]) => void,
): () => void {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString();

    const q = query(
      collection(db, COLLECTIONS.walks),
      where('userId', '==', userId),
      where('startTime', '>=', todayIso),
      orderBy('startTime', 'desc'),
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const walks: Walk[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Walk[];
        callback(walks);
      },
      (error) => {
        console.error('Error subscribing to today walks:', error);
        callback([]);
      },
    );
  } catch (error) {
    console.error('Error setting up today walks subscription:', error);
    callback([]);
    return () => {};
  }
}
