import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface Connection {
  id: string;
  userId: string;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Contact {
  id: string;
  userId: string;
  connectionId: string;
  name: string;
  phone: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type BroadcastStatus = 'scheduled' | 'sent';

export interface Broadcast {
  id: string;
  userId: string;
  connectionId: string;
  contactIds: string[];
  recipientCount: number;
  message: string;
  status: BroadcastStatus;
  scheduledFor: Timestamp | null;
  sentAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
