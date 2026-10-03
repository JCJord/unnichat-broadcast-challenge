import React from 'react';
import { Users } from 'lucide-react';

export const ContactsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-primary" />
            Contatos
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Lista de contatos da conexão.
          </p>
        </div>
      </div>
    </div>
  );
};
