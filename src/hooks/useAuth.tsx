import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getOrCreateUser, subscribeToUser } from '../services/userService';
import type { User } from '../models/types';

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          await getOrCreateUser(
            fbUser.uid,
            fbUser.email ?? 'anonymous@waggly.app',
            fbUser.displayName ?? 'Pet Lover',
          );
        } catch (e) {
          console.error('Error creating user:', e);
        }
      } else {
        // Sign in anonymously if no user
        try {
          await signInAnonymously(auth);
        } catch (e) {
          console.error('Error signing in anonymously:', e);
          setLoading(false);
        }
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!firebaseUser) {
      setUser(null);
      setLoading(false);
      return;
    }
    const unsubscribe = subscribeToUser(firebaseUser.uid, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, [firebaseUser]);

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
