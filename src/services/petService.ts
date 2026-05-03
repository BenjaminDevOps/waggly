import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { Pet, PetType, PetGender } from '../models/types';
import { COLLECTIONS } from '../constants/app';

export async function addPet(
  userId: string,
  data: {
    name: string;
    type: PetType;
    breed?: string;
    gender: PetGender;
    weight?: number;
    microchipId?: string;
    photoUrl?: string;
  },
): Promise<string> {
  const now = new Date().toISOString();
  const docRef = await addDoc(collection(db, COLLECTIONS.pets), {
    userId,
    name: data.name,
    type: data.type,
    breed: data.breed ?? null,
    gender: data.gender,
    weight: data.weight ?? null,
    microchipId: data.microchipId ?? null,
    photoUrl: data.photoUrl ?? null,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updatePet(
  petId: string,
  data: Partial<Pet>,
): Promise<void> {
  const { id, ...updateData } = data;
  await updateDoc(doc(db, COLLECTIONS.pets, petId), {
    ...updateData,
    updatedAt: new Date().toISOString(),
  });
}

export async function deletePet(petId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.pets, petId));
}

export function subscribeToPets(
  userId: string,
  callback: (pets: Pet[]) => void,
): () => void {
  try {
    const q = query(
      collection(db, COLLECTIONS.pets),
      where('userId', '==', userId),
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const pets: Pet[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Pet[];
        pets.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
        callback(pets);
      },
      (error) => {
        console.error('Error subscribing to pets:', error);
        callback([]);
      },
    );
  } catch (error) {
    console.error('Error setting up pets subscription:', error);
    callback([]);
    return () => {};
  }
}
