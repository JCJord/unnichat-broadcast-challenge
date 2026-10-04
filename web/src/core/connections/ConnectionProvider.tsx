import React, { useState } from 'react';
import { Connection } from '@/types';
import { ConnectionContext } from './ConnectionContext';
import { useConnections } from './useConnections';

const ACTIVE_CONNECTION_KEY = 'activeConnectionId';

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connections, loading, error, createConnection, updateConnection, deleteConnection } =
    useConnections();
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    localStorage.getItem(ACTIVE_CONNECTION_KEY),
  );

  const activeConnection =
    connections.find((connection) => connection.id === selectedId) ?? connections[0] ?? null;

  const setActiveConnection = (connection: Connection) => {
    setSelectedId(connection.id);
    localStorage.setItem(ACTIVE_CONNECTION_KEY, connection.id);
  };

  const handleDeleteConnection = async (id: string): Promise<void> => {
    await deleteConnection(id);
    if (selectedId === id) {
      localStorage.removeItem(ACTIVE_CONNECTION_KEY);
      const remaining = connections.filter((c) => c.id !== id);
      const nextActiveId = remaining[0]?.id ?? null;
      setSelectedId(nextActiveId);
      if (nextActiveId) {
        localStorage.setItem(ACTIVE_CONNECTION_KEY, nextActiveId);
      }
    }
  };

  return (
    <ConnectionContext.Provider
      value={{
        connections,
        activeConnection,
        setActiveConnection,
        loading,
        error,
        createConnection,
        updateConnection,
        deleteConnection: handleDeleteConnection,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
