import React, { useState, useMemo } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Search, Users, CheckSquare, Square } from 'lucide-react';
import { Contact } from '@/types';
import { Input, Button } from '@/shared/components/ui';
import { formatPhone } from '@/features/contacts/utils/phone';

interface ContactSelectorProps {
  contacts: Contact[];
  selectedContactIds: string[];
  onChange: (ids: string[]) => void;
  error?: string;
}

export const ContactSelector: React.FC<ContactSelectorProps> = ({
  contacts,
  selectedContactIds,
  onChange,
  error,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return contacts;
    const termDigits = term.replace(/\D/g, '');

    return contacts.filter((c) => {
      const matchName = c.name.toLowerCase().includes(term);
      const matchPhone = termDigits.length > 0 && c.phone.includes(termDigits);
      return matchName || matchPhone;
    });
  }, [contacts, searchTerm]);

  const allFilteredSelected =
    filteredContacts.length > 0 &&
    filteredContacts.every((c) => selectedContactIds.includes(c.id));

  const handleToggleAll = () => {
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredContacts.map((c) => c.id));
      onChange(selectedContactIds.filter((id) => !filteredIds.has(id)));
    } else {
      const union = new Set([...selectedContactIds, ...filteredContacts.map((c) => c.id)]);
      onChange(Array.from(union));
    }
  };

  const handleToggleOne = (contactId: string) => {
    if (selectedContactIds.includes(contactId)) {
      onChange(selectedContactIds.filter((id) => id !== contactId));
    } else {
      onChange([...selectedContactIds, contactId]);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs">
        <label className="font-medium text-text-secondary flex items-center gap-1.5">
          <Users className="w-4 h-4 text-primary" />
          Destinatários ({selectedContactIds.length} de {contacts.length} selecionados)
        </label>
        {contacts.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleToggleAll}
            className="text-xs h-7 px-2"
            leftIcon={
              allFilteredSelected ? (
                <Square className="w-3.5 h-3.5 text-text-muted" />
              ) : (
                <CheckSquare className="w-3.5 h-3.5 text-primary" />
              )
            }
          >
            {allFilteredSelected ? 'Desmarcar' : 'Selecionar todos'}
          </Button>
        )}
      </div>

      <Input
        placeholder="Buscar contato por nome ou telefone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        leftIcon={<Search className="w-4 h-4" />}
      />

      {error && <span className="text-xs text-status-error">{error}</span>}

      <div className="border border-dark-border rounded-xl bg-dark-bg/60 max-h-52 overflow-y-auto divide-y divide-dark-border/40">
        {contacts.length === 0 ? (
          <div className="p-4 text-center text-xs text-text-muted">
            Nenhum contato cadastrado nesta conexão.
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-xs text-text-muted">
            Nenhum contato encontrado na busca.
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const isSelected = selectedContactIds.includes(contact.id);
            return (
              <label
                key={contact.id}
                className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-white/5 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleToggleOne(contact.id)}
                  size="small"
                  className="p-0 text-dark-border hover:text-primary"
                  sx={{
                    color: 'var(--color-dark-border)',
                    '&.Mui-checked': { color: 'var(--color-primary)' },
                  }}
                />
                <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-text-primary truncate">
                    {contact.name}
                  </span>
                  <span className="text-xs font-mono text-text-secondary shrink-0">
                    {formatPhone(contact.phone)}
                  </span>
                </div>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
};
