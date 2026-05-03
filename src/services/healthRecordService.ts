import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { HealthRecord, RecordType } from '../models/types';
import { COLLECTIONS } from '../constants/app';

export async function addHealthRecord(
  userId: string,
  petId: string,
  data: {
    type: RecordType;
    title: string;
    description?: string;
    date: string;
    nextDueDate?: string;
    vetName?: string;
    weight?: number;
  },
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.healthRecords), {
    userId,
    petId,
    type: data.type,
    title: data.title,
    description: data.description ?? null,
    date: data.date,
    nextDueDate: data.nextDueDate ?? null,
    vetName: data.vetName ?? null,
    weight: data.weight ?? null,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function deleteHealthRecord(recordId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.healthRecords, recordId));
}

export function subscribeToHealthRecords(
  petId: string,
  callback: (records: HealthRecord[]) => void,
): () => void {
  try {
    const q = query(
      collection(db, COLLECTIONS.healthRecords),
      where('petId', '==', petId),
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const records: HealthRecord[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as HealthRecord[];
        records.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
        callback(records);
      },
      (error) => {
        console.error('Error subscribing to health records:', error);
        callback([]);
      },
    );
  } catch (error) {
    console.error('Error setting up health records subscription:', error);
    callback([]);
    return () => {};
  }
}
