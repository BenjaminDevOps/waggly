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
import { NacJournalEntry, NacJournalEntryType } from '../models/types';
import { COLLECTIONS } from '../constants/app';

export async function addJournalEntry(
  userId: string,
  petId: string,
  data: {
    type: NacJournalEntryType;
    date: string;
    note?: string;
    temperatureC?: number;
    humidityPct?: number;
  },
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.nacJournal), {
    userId,
    petId,
    type: data.type,
    date: data.date,
    note: data.note ?? null,
    temperatureC: data.temperatureC ?? null,
    humidityPct: data.humidityPct ?? null,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function deleteJournalEntry(entryId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.nacJournal, entryId));
}

export function subscribeToJournalEntries(
  petId: string,
  userId: string,
  callback: (entries: NacJournalEntry[]) => void,
): () => void {
  try {
    const q = query(
      collection(db, COLLECTIONS.nacJournal),
      where('petId', '==', petId),
      // Security rules scope these collections to their owner; a list
      // query must carry the same constraint or Firestore rejects it.
      where('userId', '==', userId),
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const entries: NacJournalEntry[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as NacJournalEntry[];
        entries.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
        callback(entries);
      },
      (error) => {
        console.error('Error subscribing to NAC journal entries:', error);
        callback([]);
      },
    );
  } catch (error) {
    console.error('Error setting up NAC journal subscription:', error);
    callback([]);
    return () => {};
  }
}
