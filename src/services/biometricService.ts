import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRIC_ENABLED_KEY = '@biometric_enabled';
const STORED_CREDENTIALS_KEY = '@stored_credentials';

export interface BiometricCapability {
  isAvailable: boolean;
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
}

export class BiometricService {
  /**
   * Vérifie si la biométrie est disponible sur l'appareil
   */
  async checkBiometricCapability(): Promise<BiometricCapability> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    return {
      isAvailable: hasHardware && isEnrolled,
      hasHardware,
      isEnrolled,
      supportedTypes,
    };
  }

  /**
   * Authentifie l'utilisateur avec la biométrie
   */
  async authenticate(promptMessage: string = 'Authentification requise'): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Annuler',
        fallbackLabel: 'Utiliser le code',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  /**
   * Active l'authentification biométrique
   */
  async enableBiometric(): Promise<void> {
    await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
  }

  /**
   * Désactive l'authentification biométrique
   */
  async disableBiometric(): Promise<void> {
    await AsyncStorage.removeItem(BIOMETRIC_ENABLED_KEY);
    await AsyncStorage.removeItem(STORED_CREDENTIALS_KEY);
  }

  /**
   * Vérifie si la biométrie est activée
   */
  async isBiometricEnabled(): Promise<boolean> {
    const enabled = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
    return enabled === 'true';
  }

  /**
   * Sauvegarde les identifiants de l'utilisateur de manière sécurisée
   * Note: Pour une sécurité maximale en production, utilisez expo-secure-store
   */
  async storeCredentials(email: string, userId: string): Promise<void> {
    const credentials = JSON.stringify({ email, userId, timestamp: Date.now() });
    await AsyncStorage.setItem(STORED_CREDENTIALS_KEY, credentials);
  }

  /**
   * Récupère les identifiants stockés
   */
  async getStoredCredentials(): Promise<{ email: string; userId: string } | null> {
    try {
      const credentials = await AsyncStorage.getItem(STORED_CREDENTIALS_KEY);
      if (!credentials) return null;

      const parsed = JSON.parse(credentials);
      return { email: parsed.email, userId: parsed.userId };
    } catch (error) {
      console.error('Error getting stored credentials:', error);
      return null;
    }
  }

  /**
   * Obtient le type d'authentification biométrique disponible
   */
  async getBiometricType(): Promise<string> {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Touch ID';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris';
    }
    return 'Biométrie';
  }
}

export const biometricService = new BiometricService();
