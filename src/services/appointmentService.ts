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
import { Appointment } from '../models/types';
import { COLLECTIONS } from '../constants/app';

export async function addAppointment(
  userId: string,
  petId: string,
  data: {
    date: string;
    time?: string;
    vetName: string;
    location?: string;
    note?: string;
  },
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.appointments), {
    userId,
    petId,
    date: data.date,
    time: data.time ?? null,
    vetName: data.vetName,
    location: data.location ?? null,
    note: data.note ?? null,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function deleteAppointment(appointmentId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.appointments, appointmentId));
}

export function subscribeToAppointments(
  petId: string,
  userId: string,
  callback: (appointments: Appointment[]) => void,
): () => void {
  try {
    const q = query(
      collection(db, COLLECTIONS.appointments),
      where('petId', '==', petId),
      // Security rules scope these collections to their owner; a list
      // query must carry the same constraint or Firestore rejects it.
      where('userId', '==', userId),
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const appointments: Appointment[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Appointment[];
        appointments.sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
        callback(appointments);
      },
      (error) => {
        console.error('Error subscribing to appointments:', error);
        callback([]);
      },
    );
  } catch (error) {
    console.error('Error setting up appointments subscription:', error);
    callback([]);
    return () => {};
  }
}

/** First appointment today or later, from an already-sorted-ascending list. */
export function getNextUpcoming(appointments: Appointment[]): Appointment | null {
  const today = new Date().toISOString().split('T')[0];
  return appointments.find((a) => a.date >= today) ?? null;
}
