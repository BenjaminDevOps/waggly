import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { usePetStore } from '@/store/usePetStore';
import { useRewardStore } from '@/store/useRewardStore';
import { firestoreService } from '@/services/firestoreService';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Vaccination, WeightRecord } from '@/types/models';

type HealthTab = 'vaccinations' | 'weight' | 'appointments';

export default function HealthScreen() {
  const { user } = useAuthStore();
  const { selectedPet } = usePetStore();
  const { processReward } = useRewardStore();
  const [activeTab, setActiveTab] = useState<HealthTab>('vaccinations');
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [vaccinationForm, setVaccinationForm] = useState({
    name: '',
    date: new Date(),
    veterinarian: '',
    notes: '',
  });

  const [weightForm, setWeightForm] = useState({
    weight: '',
    date: new Date(),
    notes: '',
  });

  useEffect(() => {
    if (selectedPet) {
      loadHealthData();
    }
  }, [selectedPet]);

  const loadHealthData = async () => {
    if (!selectedPet) return;

    try {
      const [vaccs, weights] = await Promise.all([
        firestoreService.getPetVaccinations(selectedPet.id),
        firestoreService.getPetWeightRecords(selectedPet.id),
      ]);
      setVaccinations(vaccs);
      setWeightRecords(weights);
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  };

  const handleAddVaccination = async () => {
    if (!vaccinationForm.name || !selectedPet) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      await firestoreService.addVaccination({
        ...vaccinationForm,
        petId: selectedPet.id,
      });
      await processReward({ type: 'vaccination_added', userId: user!.uid });
      await loadHealthData();
      setModalVisible(false);
      setVaccinationForm({ name: '', date: new Date(), veterinarian: '', notes: '' });
      Alert.alert('Succès', 'Vaccination ajoutée ! 🎉');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter la vaccination');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWeight = async () => {
    if (!weightForm.weight || !selectedPet) {
      Alert.alert('Erreur', 'Veuillez entrer un poids');
      return;
    }

    try {
      setLoading(true);
      await firestoreService.addWeightRecord({
        weight: parseFloat(weightForm.weight),
        date: weightForm.date,
        notes: weightForm.notes,
        petId: selectedPet.id,
      });
      await processReward({ type: 'weight_recorded', userId: user!.uid });
      await loadHealthData();
      setModalVisible(false);
      setWeightForm({ weight: '', date: new Date(), notes: '' });
      Alert.alert('Succès', 'Poids enregistré ! 🎉');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'enregistrer le poids');
    } finally {
      setLoading(false);
    }
  };

  const renderVaccinations = () => (
    <View style={styles.tabContent}>
      {vaccinations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💉</Text>
          <Text style={styles.emptyText}>Aucune vaccination enregistrée</Text>
        </View>
      ) : (
        vaccinations.map((vaccination) => (
          <View key={vaccination.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons name="medical" size={24} color="#6366f1" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{vaccination.name}</Text>
                <Text style={styles.cardDate}>
                  {format(vaccination.date, 'dd MMMM yyyy', { locale: fr })}
                </Text>
                {vaccination.veterinarian && (
                  <Text style={styles.cardInfo}>Dr. {vaccination.veterinarian}</Text>
                )}
              </View>
            </View>
            {vaccination.notes && (
              <Text style={styles.cardNotes}>{vaccination.notes}</Text>
            )}
          </View>
        ))
      )}
    </View>
  );

  const renderWeightRecords = () => (
    <View style={styles.tabContent}>
      {weightRecords.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⚖️</Text>
          <Text style={styles.emptyText}>Aucun poids enregistré</Text>
        </View>
      ) : (
        <>
          <View style={styles.weightChart}>
            <Text style={styles.chartTitle}>Évolution du poids</Text>
            {weightRecords.slice(0, 5).map((record, index) => (
              <View key={record.id} style={styles.weightBar}>
                <Text style={styles.weightDate}>
                  {format(record.date, 'dd/MM', { locale: fr })}
                </Text>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        width: `${(record.weight / Math.max(...weightRecords.map(r => r.weight))) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.weightValue}>{record.weight} kg</Text>
              </View>
            ))}
          </View>
          <View style={styles.recordsList}>
            {weightRecords.map((record) => (
              <View key={record.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIcon}>
                    <Ionicons name="scale" size={24} color="#22c55e" />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{record.weight} kg</Text>
                    <Text style={styles.cardDate}>
                      {format(record.date, 'dd MMMM yyyy', { locale: fr })}
                    </Text>
                  </View>
                </View>
                {record.notes && (
                  <Text style={styles.cardNotes}>{record.notes}</Text>
                )}
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );

  const renderAppointments = () => (
    <View style={styles.tabContent}>
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={styles.emptyText}>Fonctionnalité à venir</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Carnet de Santé</Text>
        {selectedPet && (
          <View style={styles.petBadge}>
            <Text style={styles.petBadgeEmoji}>
              {selectedPet.type === 'dog' ? '🐕' :
               selectedPet.type === 'cat' ? '🐈' : '🐹'}
            </Text>
            <Text style={styles.petBadgeName}>{selectedPet.name}</Text>
          </View>
        )}
      </View>

      {!selectedPet ? (
        <View style={styles.noPetContainer}>
          <Text style={styles.noPetText}>
            Sélectionnez un animal dans "Mes Animaux"
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'vaccinations' && styles.activeTab]}
              onPress={() => setActiveTab('vaccinations')}
            >
              <Ionicons
                name="medical"
                size={20}
                color={activeTab === 'vaccinations' ? '#6366f1' : '#9ca3af'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'vaccinations' && styles.activeTabText,
                ]}
              >
                Vaccins
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'weight' && styles.activeTab]}
              onPress={() => setActiveTab('weight')}
            >
              <Ionicons
                name="scale"
                size={20}
                color={activeTab === 'weight' ? '#6366f1' : '#9ca3af'}
              />
              <Text
                style={[styles.tabText, activeTab === 'weight' && styles.activeTabText]}
              >
                Poids
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'appointments' && styles.activeTab]}
              onPress={() => setActiveTab('appointments')}
            >
              <Ionicons
                name="calendar"
                size={20}
                color={activeTab === 'appointments' ? '#6366f1' : '#9ca3af'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'appointments' && styles.activeTabText,
                ]}
              >
                RDV
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {activeTab === 'vaccinations' && renderVaccinations()}
            {activeTab === 'weight' && renderWeightRecords()}
            {activeTab === 'appointments' && renderAppointments()}
          </ScrollView>

          {activeTab !== 'appointments' && (
            <TouchableOpacity
              style={styles.fab}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          )}
        </>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {activeTab === 'vaccinations'
                  ? 'Ajouter une vaccination'
                  : 'Enregistrer le poids'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              {activeTab === 'vaccinations' ? (
                <>
                  <Text style={styles.label}>Nom du vaccin *</Text>
                  <TextInput
                    style={styles.input}
                    value={vaccinationForm.name}
                    onChangeText={(text) =>
                      setVaccinationForm({ ...vaccinationForm, name: text })
                    }
                    placeholder="Ex: Rage, DHPP"
                  />

                  <Text style={styles.label}>Vétérinaire</Text>
                  <TextInput
                    style={styles.input}
                    value={vaccinationForm.veterinarian}
                    onChangeText={(text) =>
                      setVaccinationForm({ ...vaccinationForm, veterinarian: text })
                    }
                    placeholder="Nom du vétérinaire"
                  />

                  <Text style={styles.label}>Notes</Text>
                  <TextInput
                    style={styles.textArea}
                    value={vaccinationForm.notes}
                    onChangeText={(text) =>
                      setVaccinationForm({ ...vaccinationForm, notes: text })
                    }
                    placeholder="Notes additionnelles"
                    multiline
                    numberOfLines={3}
                  />

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleAddVaccination}
                    disabled={loading}
                  >
                    <Text style={styles.submitButtonText}>Ajouter</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.label}>Poids (kg) *</Text>
                  <TextInput
                    style={styles.input}
                    value={weightForm.weight}
                    onChangeText={(text) =>
                      setWeightForm({ ...weightForm, weight: text })
                    }
                    placeholder="Ex: 15.5"
                    keyboardType="decimal-pad"
                  />

                  <Text style={styles.label}>Notes</Text>
                  <TextInput
                    style={styles.textArea}
                    value={weightForm.notes}
                    onChangeText={(text) =>
                      setWeightForm({ ...weightForm, notes: text })
                    }
                    placeholder="Notes additionnelles"
                    multiline
                    numberOfLines={3}
                  />

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleAddWeight}
                    disabled={loading}
                  >
                    <Text style={styles.submitButtonText}>Enregistrer</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
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
  petBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  petBadgeEmoji: {
    fontSize: 16,
  },
  petBadgeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  noPetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noPetText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  activeTabText: {
    color: '#6366f1',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  cardDate: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  cardInfo: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  cardNotes: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  weightChart: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  weightBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  weightDate: {
    fontSize: 12,
    color: '#6b7280',
    width: 40,
  },
  barContainer: {
    flex: 1,
    height: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  weightValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    width: 60,
    textAlign: 'right',
  },
  recordsList: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalForm: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
