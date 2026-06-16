import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getOrCreateUser, subscribeToUser, deleteUserData } from '../services/userService';
import type { User } from '../models/types';

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  user: null,
  loading: true,
  signOut: async () => {},
  deleteAccount: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      clearTimeout(timeout);
      setFirebaseUser(fbUser);
      if (fbUser) {
        getOrCreateUser(
          fbUser.uid,
          fbUser.email ?? fbUser.uid + '@waggly.app',
          fbUser.displayName ?? 'Pet Lover',
        ).catch((e) => console.error('Error creating user:', e));
      }
      setLoading(false);
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

  const deleteAccount = async (password: string) => {
    if (!firebaseUser?.email) throw new Error('No authenticated user');
    const credential = EmailAuthProvider.credential(firebaseUser.email, password);
    await reauthenticateWithCredential(firebaseUser, credential);
    await deleteUserData(firebaseUser.uid);
    await deleteUser(firebaseUser);
    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
