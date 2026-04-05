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
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
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
        }
      }
      // No auto anonymous sign-in — let user sign in via Login page
      if (!fbUser) {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!firebaseUser) {
      setUser(null);
      return;
    }
    const unsubscribe = subscribeToUser(firebaseUser.uid, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
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
