import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { usePetStore } from '@/store/usePetStore';
import { useRewardStore } from '@/store/useRewardStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { geminiService } from '@/services/geminiService';
import { firestoreService } from '@/services/firestoreService';
import { PLAN_CONFIGS } from '@/types/subscription';
import { CountdownTimer } from '@/components/CountdownTimer';
import { Ionicons } from '@expo/vector-icons';

export default function DiagnosticScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { selectedPet, pets } = usePetStore();
  const { processReward } = useRewardStore();
  const { subscription } = useSubscriptionStore();
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [diagnosticsLeft, setDiagnosticsLeft] = useState(0);

  useEffect(() => {
    const checkDiagnosticsLeft = async () => {
      if (!user || !subscription) return;

      const currentUser = await firestoreService.getUser(user.uid);
      if (!currentUser) return;

      const plan = PLAN_CONFIGS[subscription.plan];
      const maxDiagnostics = plan.features.aiDiagnosticsPerMonth;

      // Unlimited diagnostics for pro plan
      if (maxDiagnostics === -1) {
        setDiagnosticsLeft(-1);
        return;
      }

      // Check if we need to reset the counter
      const now = new Date();
      const resetDate = currentUser.diagnosticsResetDate;
      if (resetDate && now > resetDate) {
        // Reset counter for new month
        await firestoreService.updateUser(user.uid, {
          diagnosticsUsedThisMonth: 0,
          diagnosticsResetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        });
        setDiagnosticsLeft(maxDiagnostics);
      } else {
        setDiagnosticsLeft(maxDiagnostics - (currentUser.diagnosticsUsedThisMonth || 0));
      }
    };

    checkDiagnosticsLeft();
  }, [user, subscription]);

  const handleDiagnostic = async () => {
    if (!selectedPet) {
      Alert.alert('Erreur', 'Veuillez sélectionner un animal');
      return;
    }

    if (!symptoms.trim()) {
      Alert.alert('Erreur', 'Veuillez décrire les symptômes');
      return;
    }

    // Check diagnostic limit
    if (diagnosticsLeft === 0) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      setLoading(true);
      const age = Math.floor(
        (new Date().getTime() - selectedPet.birthDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365)
      );

      const response = await geminiService.getDiagnostic({
        petName: selectedPet.name,
        petType: selectedPet.type,
        age,
        symptoms,
        duration,
        additionalInfo,
      });

      setResult(response);

      await firestoreService.saveDiagnosticSession({
        petId: selectedPet.id,
        userId: user!.uid,
        symptoms,
        aiResponse: response.analysis,
        severity: response.severity,
        timestamp: new Date(),
      });

      // Increment diagnostics counter
      if (diagnosticsLeft !== -1) {
        const currentUser = await firestoreService.getUser(user!.uid);
        await firestoreService.updateUser(user!.uid, {
          diagnosticsUsedThisMonth: (currentUser?.diagnosticsUsedThisMonth || 0) + 1,
        });
        setDiagnosticsLeft(diagnosticsLeft - 1);
      }

      await processReward({ type: 'diagnostic_completed', userId: user!.uid });
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSymptoms('');
    setDuration('');
    setAdditionalInfo('');
    setResult(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return '#22c55e';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'Faible';
      case 'medium':
        return 'Moyenne';
      case 'high':
        return 'Élevée';
      default:
        return 'Inconnue';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Diagnostic IA</Text>
          {diagnosticsLeft !== -1 && (
            <View style={[
              styles.diagnosticsCounter,
              diagnosticsLeft === 0 && styles.diagnosticsCounterEmpty
            ]}>
              <Ionicons
                name={diagnosticsLeft > 0 ? "medical" : "lock-closed"}
                size={14}
                color={diagnosticsLeft > 0 ? "#22c55e" : "#ef4444"}
              />
              <Text style={[
                styles.diagnosticsCounterText,
                diagnosticsLeft === 0 && styles.diagnosticsCounterTextEmpty
              ]}>
                {diagnosticsLeft} / {PLAN_CONFIGS[subscription?.plan || 'free'].features.aiDiagnosticsPerMonth}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles" size={16} color="#fff" />
          <Text style={styles.aiBadgeText}>Powered by Gemini</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {!result ? (
          <>
            <View style={styles.warningCard}>
              <Ionicons name="warning" size={24} color="#f59e0b" />
              <Text style={styles.warningText}>
                Ce diagnostic IA ne remplace pas une consultation vétérinaire
                professionnelle. En cas de doute, consultez un vétérinaire.
              </Text>
            </View>

            <View style={styles.petSelector}>
              <Text style={styles.label}>Animal concerné</Text>
              {selectedPet ? (
                <View style={styles.selectedPetCard}>
                  <Text style={styles.petEmoji}>
                    {selectedPet.type === 'dog' ? '🐕' :
                     selectedPet.type === 'cat' ? '🐈' : '🐹'}
                  </Text>
                  <Text style={styles.selectedPetName}>{selectedPet.name}</Text>
                </View>
              ) : (
                <Text style={styles.noPetText}>
                  Aucun animal sélectionné. Allez dans "Mes Animaux" pour en ajouter un.
                </Text>
              )}
            </View>

            <Text style={styles.label}>Symptômes observés *</Text>
            <TextInput
              style={styles.textArea}
              value={symptoms}
              onChangeText={setSymptoms}
              placeholder="Décrivez les symptômes observés (éternuements, vomissements, léthargie, etc.)"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Text style={styles.label}>Durée des symptômes</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="Ex: Depuis 2 jours"
            />

            <Text style={styles.label}>Informations additionnelles</Text>
            <TextInput
              style={styles.textArea}
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              placeholder="Changements de comportement, d'appétit, autres observations..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.button, (!selectedPet || !symptoms) && styles.buttonDisabled]}
              onPress={handleDiagnostic}
              disabled={loading || !selectedPet || !symptoms}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="medical" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Obtenir un diagnostic</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <View>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Résultat du diagnostic</Text>
              <TouchableOpacity onPress={resetForm}>
                <Ionicons name="close-circle" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.severityCard,
                { backgroundColor: getSeverityColor(result.severity) + '20' },
              ]}
            >
              <Text style={styles.severityLabel}>Gravité</Text>
              <View style={styles.severityBadge}>
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color={getSeverityColor(result.severity)}
                />
                <Text
                  style={[
                    styles.severityText,
                    { color: getSeverityColor(result.severity) },
                  ]}
                >
                  {getSeverityLabel(result.severity)}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Analyse</Text>
              <Text style={styles.analysisText}>{result.analysis}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommandations</Text>
              {result.recommendations.map((rec: string, index: number) => (
                <View key={index} style={styles.recommendation}>
                  <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>

            <View style={styles.urgencyCard}>
              <Ionicons name="time" size={24} color="#6366f1" />
              <View style={styles.urgencyContent}>
                <Text style={styles.urgencyTitle}>Urgence</Text>
                <Text style={styles.urgencyText}>{result.urgency}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.newDiagnosticButton} onPress={resetForm}>
              <Text style={styles.newDiagnosticText}>
                Nouveau diagnostic
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Upgrade Modal */}
      <Modal
        visible={showUpgradeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUpgradeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="sparkles" size={48} color="#6366f1" />
              <Text style={styles.modalTitle}>
                Limite de diagnostics atteinte
              </Text>
            </View>

            <Text style={styles.modalText}>
              Vous avez utilisé vos {PLAN_CONFIGS.free.features.aiDiagnosticsPerMonth} diagnostics IA gratuits pour ce mois. 🐾
            </Text>

            {/* Countdown Timer */}
            <View style={styles.timerContainer}>
              <CountdownTimer />
            </View>

            {/* Promotional Pricing */}
            <View style={styles.promoCard}>
              <View style={styles.promoBadge}>
                <Ionicons name="flame" size={16} color="#fff" />
                <Text style={styles.promoBadgeText}>PROMOTION EXCEPTIONNELLE</Text>
              </View>

              <View style={styles.priceComparison}>
                <View>
                  <Text style={styles.originalPriceText}>
                    {PLAN_CONFIGS.premium.originalPrice}€
                  </Text>
                  <Text style={styles.currentPriceText}>
                    {PLAN_CONFIGS.premium.price}€<Text style={styles.perMonth}>/mois</Text>
                  </Text>
                </View>
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>
                    -{Math.round((1 - PLAN_CONFIGS.premium.price / PLAN_CONFIGS.premium.originalPrice!) * 100)}%
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsTitle}>Passez à Premium pour :</Text>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <Text style={styles.benefitText}>
                  {PLAN_CONFIGS.premium.features.aiDiagnosticsPerMonth} diagnostics IA par mois
                </Text>
              </View>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <Text style={styles.benefitText}>
                  Jusqu'à {PLAN_CONFIGS.premium.features.maxPets} animaux
                </Text>
              </View>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <Text style={styles.benefitText}>
                  Export PDF des carnets de santé
                </Text>
              </View>
              <View style={styles.benefit}>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <Text style={styles.benefitText}>
                  Analyses avancées et rappels personnalisés
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => {
                setShowUpgradeModal(false);
                router.push('/(tabs)/pricing');
              }}
            >
              <Ionicons name="rocket" size={20} color="#fff" />
              <Text style={styles.upgradeButtonText}>Découvrir Premium</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowUpgradeModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Plus tard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  aiBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  petSelector: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  selectedPetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  petEmoji: {
    fontSize: 32,
  },
  selectedPetName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  noPetText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 100,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  severityCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  severityLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  severityText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  analysisText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  recommendation: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  urgencyCard: {
    flexDirection: 'row',
    backgroundColor: '#eef2ff',
    padding: 20,
    borderRadius: 12,
    gap: 16,
    marginBottom: 20,
  },
  urgencyContent: {
    flex: 1,
  },
  urgencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  urgencyText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  newDiagnosticButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#6366f1',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  newDiagnosticText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  diagnosticsCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  diagnosticsCounterEmpty: {
    backgroundColor: '#fef2f2',
  },
  diagnosticsCounterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  diagnosticsCounterTextEmpty: {
    color: '#dc2626',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  benefitsCard: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
    textAlign: 'center',
    marginBottom: 20,
  },
  upgradeButton: {
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  timerContainer: {
    marginBottom: 20,
  },
  promoCard: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  promoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  promoBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  priceComparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  originalPriceText: {
    fontSize: 20,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  currentPriceText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  perMonth: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
  },
  savingsBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  savingsText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
