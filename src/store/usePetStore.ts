import { create } from 'zustand';
import { Pet } from '@/types/models';
import { firestoreService } from '@/services/firestoreService';

interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
  loading: boolean;
  error: string | null;
  loadPets: (userId: string) => Promise<void>;
  selectPet: (pet: Pet) => void;
  addPet: (petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePet: (petId: string, petData: Partial<Pet>) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;
}

export const usePetStore = create<PetState>((set, get) => ({
  pets: [],
  selectedPet: null,
  loading: false,
  error: null,

  loadPets: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const pets = await firestoreService.getUserPets(userId);
      set({ pets, loading: false });
      if (pets.length > 0 && !get().selectedPet) {
        set({ selectedPet: pets[0] });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  selectPet: (pet: Pet) => {
    set({ selectedPet: pet });
  },

  addPet: async (petData) => {
    try {
      set({ loading: true, error: null });
      const petId = await firestoreService.createPet(petData);
      const newPet = await firestoreService.getPet(petId);
      if (newPet) {
        set((state) => ({
          pets: [newPet, ...state.pets],
          selectedPet: newPet,
          loading: false,
        }));
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updatePet: async (petId: string, petData: Partial<Pet>) => {
    try {
      set({ loading: true, error: null });
      await firestoreService.updatePet(petId, petData);
      const updatedPet = await firestoreService.getPet(petId);
      if (updatedPet) {
        set((state) => ({
          pets: state.pets.map((p) => (p.id === petId ? updatedPet : p)),
          selectedPet: state.selectedPet?.id === petId ? updatedPet : state.selectedPet,
          loading: false,
        }));
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deletePet: async (petId: string) => {
    try {
      set({ loading: true, error: null });
      await firestoreService.deletePet(petId);
      set((state) => {
        const remainingPets = state.pets.filter((p) => p.id !== petId);
        return {
          pets: remainingPets,
          selectedPet: state.selectedPet?.id === petId
            ? (remainingPets[0] || null)
            : state.selectedPet,
          loading: false,
        };
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
