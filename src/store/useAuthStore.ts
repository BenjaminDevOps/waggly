import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { User } from '@/types/models';
import { firestoreService } from '@/services/firestoreService';
import { biometricService } from '@/services/biometricService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// Nécessaire pour fermer le navigateur web après l'authentification
WebBrowser.maybeCompleteAuthSession();

const REMEMBER_ME_KEY = '@remember_me';
const LAST_EMAIL_KEY = '@last_email';

interface AuthState {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  error: string | null;
  biometricEnabled: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithBiometric: () => Promise<boolean>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
  enableBiometric: () => Promise<void>;
  disableBiometric: () => Promise<void>;
  checkBiometricAvailability: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userData: null,
  loading: true,
  error: null,
  biometricEnabled: false,

  signIn: async (email: string, password: string, rememberMe = false) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Sauvegarder les préférences
      if (rememberMe) {
        await AsyncStorage.setItem(REMEMBER_ME_KEY, 'true');
        await AsyncStorage.setItem(LAST_EMAIL_KEY, email);
        await biometricService.storeCredentials(email, userCredential.user.uid);
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });

      if (Platform.OS === 'web') {
        // Web: utiliser signInWithPopup
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const userCredential = await signInWithPopup(auth, provider);

        // Créer l'utilisateur dans Firestore s'il n'existe pas
        const existingUser = await firestoreService.getUser(userCredential.user.uid);
        if (!existingUser) {
          await firestoreService.createUser(userCredential.user.uid, {
            email: userCredential.user.email || '',
            displayName: userCredential.user.displayName || '',
            photoURL: userCredential.user.photoURL || undefined,
          });
        }
      } else {
        // React Native: utiliser expo-auth-session
        // Note: Nécessite EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID dans .env
        throw new Error(
          'Google Sign-In sur React Native nécessite une configuration OAuth.\n' +
          'Veuillez configurer EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID dans votre fichier .env'
        );
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signInWithBiometric: async () => {
    try {
      const credentials = await biometricService.getStoredCredentials();
      if (!credentials) {
        throw new Error('Aucune credentials sauvegardées');
      }

      const authenticated = await biometricService.authenticate(
        'Authentifiez-vous pour accéder à PetHealth'
      );

      if (authenticated) {
        // La session Firebase devrait persister automatiquement
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Biometric sign-in error:', error);
      return false;
    }
  },

  signUp: async (email: string, password: string, displayName: string) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await firestoreService.createUser(userCredential.user.uid, {
        email,
        displayName,
      });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      await AsyncStorage.removeItem(LAST_EMAIL_KEY);
      set({ user: null, userData: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  initializeAuth: () => {
    // Vérifier si la biométrie est activée
    biometricService.isBiometricEnabled().then((enabled) => {
      set({ biometricEnabled: enabled });
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await firestoreService.getUser(user.uid);
        set({ user, userData, loading: false });
      } else {
        set({ user: null, userData: null, loading: false });
      }
    });
    return unsubscribe;
  },

  enableBiometric: async () => {
    try {
      const capability = await biometricService.checkBiometricCapability();
      if (!capability.isAvailable) {
        throw new Error('La biométrie n\'est pas disponible sur cet appareil');
      }

      await biometricService.enableBiometric();
      const { user } = get();
      if (user) {
        await biometricService.storeCredentials(user.email || '', user.uid);
      }
      set({ biometricEnabled: true });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  disableBiometric: async () => {
    try {
      await biometricService.disableBiometric();
      set({ biometricEnabled: false });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  checkBiometricAvailability: async () => {
    const capability = await biometricService.checkBiometricCapability();
    return capability.isAvailable;
  },

  clearError: () => set({ error: null }),
}));
