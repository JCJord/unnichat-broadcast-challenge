import React, { useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FullScreenLoader } from '@/shared/components/ui';
import { AuthContext, AuthContextType } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    login: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    register: async (email, password) => {
      await createUserWithEmailAndPassword(auth, email, password);
    },
    logout: async () => {
      await signOut(auth);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <FullScreenLoader /> : children}
    </AuthContext.Provider>
  );
};
