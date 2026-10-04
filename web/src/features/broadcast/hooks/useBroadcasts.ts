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
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/core/auth/useAuth';
import { Broadcast, BroadcastStatus } from '@/types';

const broadcastsCollection = collection(db, 'broadcasts');

interface BroadcastsSnapshot {
  key: string;
  items: Broadcast[];
  error: string | null;
}

export interface CreateBroadcastInput {
  message: string;
  contactIds: string[];
  mode: 'now' | 'scheduled';
  scheduledForDate?: Date;
}

export interface UpdateBroadcastInput {
  message: string;
  contactIds: string[];
  scheduledForDate?: Date;
}

export const useBroadcasts = (connectionId: string | null | undefined) => {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;
  const [snapshotState, setSnapshotState] = useState<BroadcastsSnapshot | null>(null);

  const subscriptionKey = uid && connectionId ? `${uid}:${connectionId}` : null;

  useEffect(() => {
    if (!uid || !connectionId) return;

    const key = `${uid}:${connectionId}`;
    const broadcastsQuery = query(
      broadcastsCollection,
      where('userId', '==', uid),
      where('connectionId', '==', connectionId),
      orderBy('createdAt', 'desc'),
    );

    return onSnapshot(
      broadcastsQuery,
      (snapshot) => {
        const items = snapshot.docs.map((document) => {
          const data = document.data({ serverTimestamps: 'estimate' });
          return {
            id: document.id,
            userId: data.userId,
            connectionId: data.connectionId,
            contactIds: data.contactIds || [],
            recipientCount: data.recipientCount || (data.contactIds?.length ?? 0),
            message: data.message,
            status: data.status as BroadcastStatus,
            scheduledFor: data.scheduledFor ?? null,
            sentAt: data.sentAt ?? null,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });

        setSnapshotState({ key, items, error: null });
      },
      (err) => {
        console.error('Failed to subscribe to broadcasts:', err);
        setSnapshotState({ key, items: [], error: 'Não foi possível carregar os broadcasts.' });
      },
    );
  }, [uid, connectionId]);

  const createBroadcast = async (input: CreateBroadcastInput): Promise<string> => {
    if (!uid) throw new Error('Usuário não autenticado.');
    if (!connectionId) throw new Error('Nenhuma conexão ativa selecionada.');
    if (!input.contactIds.length) throw new Error('Selecione pelo menos um contato.');

    const isScheduled = input.mode === 'scheduled';
    const scheduledFor = isScheduled && input.scheduledForDate
      ? Timestamp.fromDate(input.scheduledForDate)
      : null;

    const docRef = await addDoc(broadcastsCollection, {
      userId: uid,
      connectionId,
      contactIds: input.contactIds,
      recipientCount: input.contactIds.length,
      message: input.message.trim(),
      status: isScheduled ? 'scheduled' : 'sent',
      scheduledFor,
      sentAt: isScheduled ? null : serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  };

  const updateBroadcast = async (id: string, input: UpdateBroadcastInput): Promise<void> => {
    if (!input.contactIds.length) throw new Error('Selecione pelo menos um contato.');

    const updatePayload: Record<string, unknown> = {
      message: input.message.trim(),
      contactIds: input.contactIds,
      recipientCount: input.contactIds.length,
      updatedAt: serverTimestamp(),
    };

    if (input.scheduledForDate) {
      updatePayload.scheduledFor = Timestamp.fromDate(input.scheduledForDate);
    }

    await updateDoc(doc(db, 'broadcasts', id), updatePayload);
  };

  const deleteBroadcast = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'broadcasts', id));
  };

  const current =
    subscriptionKey !== null && snapshotState?.key === subscriptionKey ? snapshotState : null;

  return {
    broadcasts: current?.items ?? [],
    loading: subscriptionKey !== null && current === null,
    error: current?.error ?? null,
    createBroadcast,
    updateBroadcast,
    deleteBroadcast,
  };
};
