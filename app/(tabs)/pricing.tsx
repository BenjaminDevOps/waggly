import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/useAuthStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { PLAN_CONFIGS, SubscriptionPlan } from '@/types/subscription';
import { stripeService } from '@/services/stripeService';
import { CountdownTimer } from '@/components/CountdownTimer';

export default function PricingScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { subscription, loading } = useSubscriptionStore();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('premium');
  const [processingPayment, setProcessingPayment] = useState(false);

  const plans = Object.values(PLAN_CONFIGS);

  const handleSelectPlan = async (planId: SubscriptionPlan) => {
    if (planId === 'free') {
      Alert.alert(
        'Plan Gratuit',
        'Vous êtes déjà sur le plan gratuit !',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté');
      return;
    }

    try {
      setProcessingPayment(true);

      // Créer une session Stripe
      const session = await stripeService.createCheckoutSession(
        user.uid,
        planId,
        'pethealth://success',
        'pethealth://cancel'
      );

      // En production, ouvrir le navigateur web avec l'URL Stripe
      // Pour React Native, vous devriez utiliser react-native-webview
      Alert.alert(
        'Redirection',
        'Vous allez être redirigé vers Stripe pour finaliser le paiement.',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Continuer',
            onPress: () => {
              // TODO: Implémenter l'ouverture de WebView avec session.url
              console.log('Stripe URL:', session.url);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer la session de paiement');
    } finally {
      setProcessingPayment(false);
    }
  };

  const renderFeature = (text: string, included: boolean) => (
    <View style={styles.feature}>
      <Ionicons
        name={included ? 'checkmark-circle' : 'close-circle'}
        size={20}
        color={included ? '#22c55e' : '#d1d5db'}
      />
      <Text style={[styles.featureText, !included && styles.featureTextDisabled]}>
        {text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Choisissez votre plan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          Débloquez toutes les fonctionnalités pour prendre soin de vos compagnons
        </Text>

        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoBannerHeader}>
            <Ionicons name="flame" size={24} color="#ef4444" />
            <Text style={styles.promoBannerTitle}>PROMOTION EXCEPTIONNELLE</Text>
          </View>
          <CountdownTimer />
          <Text style={styles.promoBannerText}>
            Profitez de -50% sur tous les abonnements !
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan) => {
            const isCurrentPlan = subscription?.plan === plan.id;
            const isPremiumOrPro = plan.id !== 'free';

            return (
              <View
                key={plan.id}
                style={[
                  styles.planCard,
                  plan.popular && styles.popularPlanCard,
                  isCurrentPlan && styles.currentPlanCard,
                ]}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>POPULAIRE</Text>
                  </View>
                )}

                {isCurrentPlan && (
                  <View style={styles.currentBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#fff" />
                    <Text style={styles.currentBadgeText}>Plan actuel</Text>
                  </View>
                )}

                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planDescription}>{plan.description}</Text>

                <View style={styles.priceContainer}>
                  {plan.originalPrice && (
                    <Text style={styles.originalPrice}>
                      {plan.originalPrice}€
                    </Text>
                  )}
                  <View style={styles.currentPriceRow}>
                    <Text style={styles.price}>
                      {plan.price === 0 ? 'Gratuit' : `${plan.price}€`}
                    </Text>
                    {plan.price > 0 && (
                      <Text style={styles.priceInterval}>/mois</Text>
                    )}
                  </View>
                  {plan.originalPrice && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>
                        -{Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.features}>
                  {renderFeature(
                    plan.features.maxPets === -1
                      ? 'Animaux illimités'
                      : `Jusqu'à ${plan.features.maxPets} animaux`,
                    true
                  )}
                  {renderFeature(
                    plan.features.aiDiagnosticsPerMonth === -1
                      ? 'Diagnostics IA illimités'
                      : `${plan.features.aiDiagnosticsPerMonth} diagnostics IA/mois`,
                    true
                  )}
                  {renderFeature(
                    'Export PDF du carnet de santé',
                    plan.features.exportPdf
                  )}
                  {renderFeature(
                    'Analyses avancées',
                    plan.features.advancedAnalytics
                  )}
                  {renderFeature(
                    'Rappels personnalisés',
                    plan.features.customReminders
                  )}
                  {renderFeature(
                    'Partage avec vétérinaires',
                    plan.features.veterinarianSharing
                  )}
                  {renderFeature(
                    `Stockage cloud ${plan.features.cloudStorage}`,
                    true
                  )}
                  {renderFeature(
                    'Support prioritaire',
                    plan.features.prioritySupport
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    isCurrentPlan && styles.currentButton,
                    plan.popular && !isCurrentPlan && styles.popularButton,
                  ]}
                  onPress={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan || processingPayment}
                >
                  {processingPayment && selectedPlan === plan.id ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text
                      style={[
                        styles.selectButtonText,
                        isCurrentPlan && styles.currentButtonText,
                      ]}
                    >
                      {isCurrentPlan
                        ? 'Plan actuel'
                        : plan.id === 'free'
                        ? 'Gratuit'
                        : 'Choisir ce plan'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Questions fréquentes</Text>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>
              Puis-je changer de plan à tout moment ?
            </Text>
            <Text style={styles.faqAnswer}>
              Oui ! Vous pouvez passer à un plan supérieur ou annuler votre
              abonnement à tout moment depuis votre profil.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>
              Que se passe-t-il si j'annule mon abonnement ?
            </Text>
            <Text style={styles.faqAnswer}>
              Vous conservez l'accès aux fonctionnalités premium jusqu'à la fin
              de votre période de facturation, puis vous revenez au plan gratuit.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Les paiements sont-ils sécurisés ?</Text>
            <Text style={styles.faqAnswer}>
              Absolument ! Tous les paiements sont sécurisés par Stripe, leader
              mondial du paiement en ligne.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  plansContainer: {
    padding: 20,
    gap: 20,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  popularPlanCard: {
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  currentPlanCard: {
    borderColor: '#22c55e',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  currentBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  priceInterval: {
    fontSize: 18,
    color: '#6b7280',
    marginLeft: 8,
  },
  features: {
    gap: 12,
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  featureTextDisabled: {
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  selectButton: {
    backgroundColor: '#6b7280',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  popularButton: {
    backgroundColor: '#6366f1',
  },
  currentButton: {
    backgroundColor: '#f3f4f6',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  currentButtonText: {
    color: '#6b7280',
  },
  faqSection: {
    padding: 20,
    paddingTop: 40,
  },
  faqTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  promoBanner: {
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  promoBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  promoBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991b1b',
    letterSpacing: 0.5,
  },
  promoBannerText: {
    fontSize: 14,
    color: '#7f1d1d',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  originalPrice: {
    fontSize: 18,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
    textAlign: 'center',
    marginBottom: 4,
  },
  currentPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  discountBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
