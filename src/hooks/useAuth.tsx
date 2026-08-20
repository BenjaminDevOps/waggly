import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getOrCreateUser, subscribeToUser, deleteUserData } from '../services/userService';
import { syncEntitlement } from '../services/entitlementService';
import { isNativePlatform } from '../services/platform';
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

  // What Firestore currently says, kept in a ref so the resume listener below
  // can read it without being torn down and re-registered on every snapshot.
  const cachedPremiumRef = useRef(false);
  useEffect(() => { cachedPremiumRef.current = user?.isPremium ?? false; }, [user?.isPremium]);

  // Entitlement is reconciled against the store rather than trusted from the
  // profile document, so a subscription that lapsed, was cancelled or was
  // refunded stops granting premium, and one bought on another device starts.
  // The reconciliation writes to Firestore, which the subscription above is
  // already listening to — so the whole app updates without any extra state.
  const syncedUidRef = useRef<string | null>(null);

  // Once per sign-in, and only after the profile document exists: syncing
  // earlier would try to update a document Firestore has not created yet.
  useEffect(() => {
    const uid = firebaseUser?.uid;
    // Clearing on sign-out means signing back in re-checks the store, rather
    // than inheriting the previous session's verdict.
    if (!uid) { syncedUidRef.current = null; return; }
    if (user?.id !== uid || syncedUidRef.current === uid) return;
    syncedUidRef.current = uid;
    syncEntitlement(uid, user.isPremium ?? false).catch((e) =>
      console.error('[Auth] Entitlement sync failed:', e),
    );
  }, [firebaseUser?.uid, user]);

  // And again whenever the app comes back to the foreground, which is where a
  // change made outside it lands: subscribing, cancelling and refunding all
  // happen on the store's own screens, and the user returns here straight
  // afterwards.
  useEffect(() => {
    const uid = firebaseUser?.uid;
    if (!uid || !isNativePlatform()) return;

    let cancelled = false;
    let listenerHandle: { remove: () => void } | undefined;

    import('@capacitor/app').then(({ App: CapApp }) =>
      CapApp.addListener('resume', () => {
        syncEntitlement(uid, cachedPremiumRef.current).catch((e) =>
          console.error('[Auth] Entitlement sync failed:', e),
        );
      }).then((handle) => {
        // Guard against the effect being cleaned up while the dynamic import
        // was still in flight, which would otherwise leak the listener.
        if (cancelled) handle.remove();
        else listenerHandle = handle;
      }),
    ).catch(() => {});

    return () => { cancelled = true; listenerHandle?.remove(); };
  }, [firebaseUser?.uid]);

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
