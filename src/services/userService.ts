import { db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  arrayUnion,
  onSnapshot,
} from 'firebase/firestore';
import { User } from '../models/types';
import { COLLECTIONS } from '../constants/app';

export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName: string,
): Promise<User> {
  const userRef = doc(db, COLLECTIONS.users, uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() } as User;
  }

  const newUser: Omit<User, 'id'> = {
    email,
    displayName,
    isPremium: false,
    totalPoints: 0,
    dailyStreak: 0,
    aiDiagnosisUsed: 0,
    badges: [],
    createdAt: new Date().toISOString(),
  };

  await setDoc(userRef, newUser);
  return { id: uid, ...newUser };
}

export async function addPoints(
  userId: string,
  points: number,
): Promise<void> {
  const userRef = doc(db, COLLECTIONS.users, userId);
  await updateDoc(userRef, {
    totalPoints: increment(points),
  });
}

export async function updateStreak(userId: string): Promise<void> {
  const userRef = doc(db, COLLECTIONS.users, userId);
  await updateDoc(userRef, {
    dailyStreak: increment(1),
  });
}

export async function addBadge(
  userId: string,
  badgeId: string,
): Promise<void> {
  const userRef = doc(db, COLLECTIONS.users, userId);
  await updateDoc(userRef, {
    badges: arrayUnion(badgeId),
  });
}

export function subscribeToUser(
  userId: string,
  callback: (user: User | null) => void,
): () => void {
  try {
    const userRef = doc(db, COLLECTIONS.users, userId);
    return onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback({ id: snapshot.id, ...snapshot.data() } as User);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error subscribing to user:', error);
        callback(null);
      },
    );
  } catch (error) {
    console.error('Error setting up user subscription:', error);
    callback(null);
    return () => {};
  }
}
