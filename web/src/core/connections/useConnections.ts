import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/core/auth/useAuth';
import { Connection } from '@/types';

const connectionsCollection = collection(db, 'connections');
const contactsCollection = collection(db, 'contacts');
const broadcastsCollection = collection(db, 'broadcasts');

export const useConnections = () => {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;

    const connectionsQuery = query(
      connectionsCollection,
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
    );

    return onSnapshot(
      connectionsQuery,
      (snapshot) => {
        setConnections(
          snapshot.docs.map((document) => {
            const data = document.data({ serverTimestamps: 'estimate' });
            return {
              id: document.id,
              userId: data.userId,
              name: data.name,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            };
          }),
        );
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('Failed to subscribe to connections:', err);
        setError('Não foi possível carregar as conexões.');
        setLoading(false);
      },
    );
  }, [uid]);

  const createConnection = async (name: string): Promise<string> => {
    if (!uid) throw new Error('Usuário não autenticado.');

    const docRef = await addDoc(connectionsCollection, {
      userId: uid,
      name: name.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  };

  const updateConnection = async (id: string, name: string): Promise<void> => {
    await updateDoc(doc(db, 'connections', id), {
      name: name.trim(),
      updatedAt: serverTimestamp(),
    });
  };

  const deleteConnection = async (id: string): Promise<void> => {
    if (!uid) throw new Error('Usuário não autenticado.');

    const contactsQuery = query(
      contactsCollection,
      where('userId', '==', uid),
      where('connectionId', '==', id),
    );

    const broadcastsQuery = query(
      broadcastsCollection,
      where('userId', '==', uid),
      where('connectionId', '==', id),
    );

    const [contactsSnap, broadcastsSnap] = await Promise.all([
      getDocs(contactsQuery),
      getDocs(broadcastsQuery),
    ]);

    const allRefs = [
      ...contactsSnap.docs.map((d) => d.ref),
      ...broadcastsSnap.docs.map((d) => d.ref),
      doc(db, 'connections', id),
    ];

    const CHUNK_SIZE = 450;
    for (let i = 0; i < allRefs.length; i += CHUNK_SIZE) {
      const chunk = allRefs.slice(i, i + CHUNK_SIZE);
      const batch = writeBatch(db);
      chunk.forEach((ref) => batch.delete(ref));
      await batch.commit();
    }
  };

  return {
    connections,
    loading,
    error,
    createConnection,
    updateConnection,
    deleteConnection,
  };
};
