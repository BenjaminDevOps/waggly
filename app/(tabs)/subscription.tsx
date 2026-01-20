import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/useAuthStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { PLAN_CONFIGS } from '@/types/subscription';
import { stripeService } from '@/services/stripeService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { subscription, loadSubscription, loading } = useSubscriptionStore();
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (user) {
      loadSubscription(user.uid);
    }
  }, [user]);

  const planConfig = subscription ? PLAN_CONFIGS[subscription.plan] : null;

  const handleUpgrade = () => {
    router.push('/(tabs)/pricing');
  };

  const handleManageBilling = async () => {
    if (!user || !subscription?.stripeCustomerId) {
      Alert.alert('Erreur', 'Impossible d\'accéder au portail de facturation');
      return;
    }

    try {
      const { url } = await stripeService.createCustomerPortalSession(
        user.uid,
        'pethealth://subscription'
      );

      // TODO: Ouvrir le portail Stripe dans une WebView
      Alert.alert(
        'Portail de facturation',
        'Vous allez être redirigé vers le portail Stripe pour gérer votre abonnement.',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Continuer',
            onPress: () => {
              console.log('Stripe Portal URL:', url);
              // Implémenter l'ouverture de la WebView
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir le portail de facturation');
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Annuler l\'abonnement',
      'Êtes-vous sûr de vouloir annuler votre abonnement ? Vous conserverez l\'accès jusqu\'à la fin de votre période de facturation.',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => {
            if (!subscription?.stripeSubscriptionId) return;

            try {
              setCanceling(true);
              await stripeService.cancelSubscription(
                subscription.stripeSubscriptionId
              );
              if (user) {
                await loadSubscription(user.uid);
              }
              Alert.alert('Succès', 'Votre abonnement a été annulé');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'annuler l\'abonnement');
            } finally {
              setCanceling(false);
            }
          },
        },
      ]
    );
  };

  if (loading || !subscription || !planConfig) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isPaid = subscription.plan !== 'free';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Mon Abonnement</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <LinearGradient
          colors={
            subscription.plan === 'pro'
              ? ['#f59e0b', '#d97706']
              : subscription.plan === 'premium'
              ? ['#6366f1', '#8b5cf6']
              : ['#6b7280', '#4b5563']
          }
          style={styles.planCard}
        >
          <View style={styles.planHeader}>
            <Text style={styles.planName}>{planConfig.name}</Text>
            <View
              style={[
                styles.statusBadge,
                subscription.status === 'active'
                  ? styles.statusActive
                  : styles.statusInactive,
              ]}
            >
              <Text style={styles.statusText}>
                {subscription.status === 'active' ? 'Actif' : 'Inactif'}
              </Text>
            </View>
          </View>

          <Text style={styles.planPrice}>
            {planConfig.price === 0
              ? 'Gratuit'
              : `${planConfig.price}€/mois`}
          </Text>

          {isPaid && (
            <View style={styles.billingInfo}>
              <View style={styles.billingRow}>
                <Text style={styles.billingLabel}>Période en cours:</Text>
                <Text style={styles.billingValue}>
                  {format(subscription.currentPeriodStart, 'dd MMM', { locale: fr })} -{' '}
                  {format(subscription.currentPeriodEnd, 'dd MMM yyyy', { locale: fr })}
                </Text>
              </View>
              {subscription.cancelAtPeriodEnd && (
                <Text style={styles.cancelWarning}>
                  ⚠️ Se termine le{' '}
                  {format(subscription.currentPeriodEnd, 'dd MMMM yyyy', {
                    locale: fr,
                  })}
                </Text>
              )}
            </View>
          )}
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fonctionnalités incluses</Text>
          <View style={styles.featuresList}>
            <FeatureItem
              icon="paw"
              text={
                planConfig.features.maxPets === -1
                  ? 'Animaux illimités'
                  : `Jusqu'à ${planConfig.features.maxPets} animaux`
              }
            />
            <FeatureItem
              icon="sparkles"
              text={
                planConfig.features.aiDiagnosticsPerMonth === -1
                  ? 'Diagnostics IA illimités'
                  : `${planConfig.features.aiDiagnosticsPerMonth} diagnostics IA/mois`
              }
            />
            {planConfig.features.exportPdf && (
              <FeatureItem icon="document-text" text="Export PDF" />
            )}
            {planConfig.features.advancedAnalytics && (
              <FeatureItem icon="analytics" text="Analyses avancées" />
            )}
            {planConfig.features.customReminders && (
              <FeatureItem icon="notifications" text="Rappels personnalisés" />
            )}
            {planConfig.features.veterinarianSharing && (
              <FeatureItem icon="share" text="Partage vétérinaires" />
            )}
            <FeatureItem
              icon="cloud"
              text={`Stockage ${planConfig.features.cloudStorage}`}
            />
            {planConfig.features.prioritySupport && (
              <FeatureItem icon="headset" text="Support prioritaire" />
            )}
          </View>
        </View>

        <View style={styles.actions}>
          {subscription.plan === 'free' && (
            <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                style={styles.upgradeGradient}
              >
                <Ionicons name="rocket" size={24} color="#fff" />
                <Text style={styles.upgradeButtonText}>
                  Passer à Premium
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {subscription.plan === 'premium' && (
            <>
              <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
                <LinearGradient
                  colors={['#f59e0b', '#d97706']}
                  style={styles.upgradeGradient}
                >
                  <Ionicons name="star" size={24} color="#fff" />
                  <Text style={styles.upgradeButtonText}>Passer à Pro</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.manageButton}
                onPress={handleManageBilling}
              >
                <Ionicons name="card" size={20} color="#6366f1" />
                <Text style={styles.manageButtonText}>
                  Gérer la facturation
                </Text>
              </TouchableOpacity>

              {!subscription.cancelAtPeriodEnd && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelSubscription}
                  disabled={canceling}
                >
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                  <Text style={styles.cancelButtonText}>
                    {canceling ? 'Annulation...' : 'Annuler l\'abonnement'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {subscription.plan === 'pro' && (
            <>
              <TouchableOpacity
                style={styles.manageButton}
                onPress={handleManageBilling}
              >
                <Ionicons name="card" size={20} color="#6366f1" />
                <Text style={styles.manageButtonText}>
                  Gérer la facturation
                </Text>
              </TouchableOpacity>

              {!subscription.cancelAtPeriodEnd && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelSubscription}
                  disabled={canceling}
                >
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                  <Text style={styles.cancelButtonText}>
                    {canceling ? 'Annulation...' : 'Annuler l\'abonnement'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Besoin d'aide ?</Text>
          <Text style={styles.helpText}>
            Contactez-nous à support@pethealth.app pour toute question concernant
            votre abonnement.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon as any} size={20} color="#6366f1" />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
  },
  planCard: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
  },
  statusInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  planPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  billingInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billingLabel: {
    color: '#e0e7ff',
    fontSize: 14,
  },
  billingValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelWarning: {
    color: '#fef3c7',
    fontSize: 12,
    marginTop: 8,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  featuresList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  upgradeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 18,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
  },
  manageButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 16,
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  helpSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
