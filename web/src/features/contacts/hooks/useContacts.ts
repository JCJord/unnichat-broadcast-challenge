import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/core/auth/useAuth';
import { Contact } from '@/types';
import { toPhoneDigits } from '../utils/phone';

const contactsCollection = collection(db, 'contacts');

interface ContactsSnapshot {
  key: string;
  items: Contact[];
  error: string | null;
}

export const useContacts = (connectionId: string | null | undefined) => {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;
  const [snapshotState, setSnapshotState] = useState<ContactsSnapshot | null>(null);

  const subscriptionKey = uid && connectionId ? `${uid}:${connectionId}` : null;

  useEffect(() => {
    if (!uid || !connectionId) return;

    const key = `${uid}:${connectionId}`;
    const contactsQuery = query(
      contactsCollection,
      where('userId', '==', uid),
      where('connectionId', '==', connectionId),
      orderBy('name', 'asc'),
    );

    return onSnapshot(
      contactsQuery,
      (snapshot) => {
        const items = snapshot.docs.map((document) => {
          const data = document.data({ serverTimestamps: 'estimate' });
          return {
            id: document.id,
            userId: data.userId,
            connectionId: data.connectionId,
            name: data.name,
            phone: data.phone,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });

        setSnapshotState({ key, items, error: null });
      },
      (err) => {
        console.error('Failed to subscribe to contacts:', err);
        setSnapshotState({ key, items: [], error: 'Não foi possível carregar os contatos.' });
      },
    );
  }, [uid, connectionId]);

  const createContact = async (data: { name: string; phone: string }): Promise<string> => {
    if (!uid) throw new Error('Usuário não autenticado.');
    if (!connectionId) throw new Error('Nenhuma conexão ativa selecionada.');

    const docRef = await addDoc(contactsCollection, {
      userId: uid,
      connectionId,
      name: data.name.trim(),
      phone: toPhoneDigits(data.phone),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  };

  const updateContact = async (
    id: string,
    data: { name: string; phone: string },
  ): Promise<void> => {
    await updateDoc(doc(db, 'contacts', id), {
      name: data.name.trim(),
      phone: toPhoneDigits(data.phone),
      updatedAt: serverTimestamp(),
    });
  };

  const deleteContact = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'contacts', id));
  };

  const current =
    subscriptionKey !== null && snapshotState?.key === subscriptionKey ? snapshotState : null;

  return {
    contacts: current?.items ?? [],
    loading: subscriptionKey !== null && current === null,
    error: current?.error ?? null,
    createContact,
    updateContact,
    deleteContact,
  };
};
