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
        deleteConnection,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
