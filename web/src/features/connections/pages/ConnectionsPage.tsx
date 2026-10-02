import React from 'react';
import { Radio } from 'lucide-react';

export const ConnectionsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-primary" />
            Conexões
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Gerenciamento de conexões ativas.
          </p>
        </div>
      </div>
    </div>
  );
};
