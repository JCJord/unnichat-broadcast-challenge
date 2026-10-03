import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { FullScreenLoader } from '@/shared/components/ui';
import { useAuth } from './useAuth';

export const PublicRoute: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) return <FullScreenLoader />;
  if (currentUser) return <Navigate to="/connections" replace />;

  return <Outlet />;
};
