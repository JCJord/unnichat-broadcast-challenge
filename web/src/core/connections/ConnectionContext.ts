import { createContext } from 'react';
import { Connection } from '@/types';

export interface ConnectionContextType {
  connections: Connection[];
  activeConnection: Connection | null;
  setActiveConnection: (connection: Connection) => void;
  loading: boolean;
  error: string | null;
  createConnection: (name: string) => Promise<string>;
  updateConnection: (id: string, name: string) => Promise<void>;
  deleteConnection: (id: string) => Promise<void>;
}

export const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);
