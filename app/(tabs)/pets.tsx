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
import { Ionicons } from '@expo/vector-icons';
import { PetType, PetGender } from '@/types/models';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function PetsScreen() {
  const { user } = useAuthStore();
  const { pets, loadPets, addPet, selectPet, selectedPet } = usePetStore();
  const { processReward } = useRewardStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog' as PetType,
    breed: '',
    gender: 'male' as PetGender,
    birthDate: new Date(),
  });

  useEffect(() => {
    if (user) {
      loadPets(user.uid);
    }
  }, [user]);

  const handleAddPet = async () => {
    if (!formData.name) {
      Alert.alert('Erreur', 'Veuillez entrer un nom');
      return;
    }

    try {
      await addPet({
        ...formData,
        userId: user!.uid,
      });
      await processReward({ type: 'pet_added', userId: user!.uid });
      setModalVisible(false);
      setFormData({
        name: '',
        type: 'dog',
        breed: '',
        gender: 'male',
        birthDate: new Date(),
      });
      Alert.alert('Succès', 'Animal ajouté avec succès ! 🎉');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'animal');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Animaux</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {pets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🐾</Text>
            <Text style={styles.emptyText}>Aucun animal enregistré</Text>
            <Text style={styles.emptySubtext}>
              Ajoutez votre premier compagnon pour commencer !
            </Text>
          </View>
        ) : (
          <View style={styles.petsList}>
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={[
                  styles.petCard,
                  selectedPet?.id === pet.id && styles.selectedPetCard,
                ]}
                onPress={() => selectPet(pet)}
              >
                <View style={styles.petCardHeader}>
                  <View style={styles.petIcon}>
                    <Text style={styles.petEmoji}>
                      {pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐈' : '🐹'}
                    </Text>
                  </View>
                  <View style={styles.petMainInfo}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petBreed}>{pet.breed || 'Race inconnue'}</Text>
                  </View>
                  {selectedPet?.id === pet.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                  )}
                </View>
                <View style={styles.petDetails}>
                  <View style={styles.petDetail}>
                    <Ionicons name="transgender" size={16} color="#6b7280" />
                    <Text style={styles.petDetailText}>
                      {pet.gender === 'male' ? 'Mâle' : 'Femelle'}
                    </Text>
                  </View>
                  <View style={styles.petDetail}>
                    <Ionicons name="calendar" size={16} color="#6b7280" />
                    <Text style={styles.petDetailText}>
                      {format(pet.birthDate, 'dd/MM/yyyy', { locale: fr })}
                    </Text>
                  </View>
                  {pet.weight && (
                    <View style={styles.petDetail}>
                      <Ionicons name="scale" size={16} color="#6b7280" />
                      <Text style={styles.petDetailText}>{pet.weight} kg</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter un animal</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form}>
              <Text style={styles.label}>Nom *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Ex: Max"
              />

              <Text style={styles.label}>Type d'animal</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    formData.type === 'dog' && styles.typeOptionSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, type: 'dog' })}
                >
                  <Text style={styles.typeEmoji}>🐕</Text>
                  <Text style={styles.typeText}>Chien</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    formData.type === 'cat' && styles.typeOptionSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, type: 'cat' })}
                >
                  <Text style={styles.typeEmoji}>🐈</Text>
                  <Text style={styles.typeText}>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    formData.type === 'nac' && styles.typeOptionSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, type: 'nac' })}
                >
                  <Text style={styles.typeEmoji}>🐹</Text>
                  <Text style={styles.typeText}>NAC</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Race</Text>
              <TextInput
                style={styles.input}
                value={formData.breed}
                onChangeText={(text) => setFormData({ ...formData, breed: text })}
                placeholder="Ex: Labrador"
              />

              <Text style={styles.label}>Sexe</Text>
              <View style={styles.genderSelector}>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    formData.gender === 'male' && styles.genderOptionSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, gender: 'male' })}
                >
                  <Text>Mâle</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    formData.gender === 'female' && styles.genderOptionSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, gender: 'female' })}
                >
                  <Text>Femelle</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleAddPet}>
                <Text style={styles.submitButtonText}>Ajouter</Text>
              </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  addButton: {
    backgroundColor: '#6366f1',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  petsList: {
    gap: 16,
  },
  petCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPetCard: {
    borderColor: '#22c55e',
  },
  petCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  petIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  petEmoji: {
    fontSize: 32,
  },
  petMainInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  petBreed: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  petDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  petDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  petDetailText: {
    fontSize: 14,
    color: '#6b7280',
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  form: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeOptionSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  typeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    color: '#1f2937',
  },
  genderSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  genderOptionSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
