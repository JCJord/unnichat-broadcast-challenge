import { useContext } from 'react';
import { ConnectionContext, ConnectionContextType } from './ConnectionContext';

export const useActiveConnection = (): ConnectionContextType => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useActiveConnection deve ser utilizado dentro de um <ConnectionProvider>');
  }
  return context;
};
