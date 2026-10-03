import React from 'react';
import { Send } from 'lucide-react';

export const BroadcastPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2.5">
            <Send className="w-6 h-6 text-primary" />
            Broadcast
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Envio imediato e agendamento de mensagens.
          </p>
        </div>
      </div>
    </div>
  );
};
