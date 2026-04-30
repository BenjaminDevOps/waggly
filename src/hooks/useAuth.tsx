import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getOrCreateUser, subscribeToUser } from '../services/userService';
import type { User } from '../models/types';

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      clearTimeout(timeout);
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          await getOrCreateUser(
            fbUser.uid,
            fbUser.email ?? fbUser.uid + '@waggly.app',
            fbUser.displayName ?? 'Pet Lover',
          );
        } catch (e) {
          console.error('Error creating user:', e);
          setLoading(false);
        }
      }
      if (!fbUser) {
        setLoading(false);
      }
    });
    return () => { clearTimeout(timeout); unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!firebaseUser) {
      setUser(null);
      return;
    }
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribe = subscribeToUser(firebaseUser.uid, (u) => {
      clearTimeout(timeout);
      setUser(u);
      setLoading(false);
    });
    return () => { clearTimeout(timeout); unsubscribe(); };
  }, [firebaseUser]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
