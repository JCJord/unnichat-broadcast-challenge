import React from 'react';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { Phone, Pencil, Trash2 } from 'lucide-react';
import { Contact } from '@/types';
import { formatPhone } from '../utils/phone';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onEdit,
  onDelete,
}) => {
  const initial = contact.name.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className="rounded-xl p-4 bg-dark-surface border border-dark-border hover:border-dark-border-light flex items-center justify-between gap-3 transition-all duration-150">
      <div className="flex items-center gap-3.5 min-w-0">
        <Avatar
          sx={{ width: 40, height: 40 }}
          className="bg-primary/10 text-primary font-bold text-sm shrink-0 border border-primary/20"
        >
          {initial}
        </Avatar>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-text-primary truncate" title={contact.name}>
            {contact.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-0.5">
            <Phone className="w-3.5 h-3.5 shrink-0 text-text-muted" />
            <span className="font-mono">{formatPhone(contact.phone)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <IconButton
          size="small"
          onClick={() => onEdit(contact)}
          className="text-text-secondary hover:text-primary hover:bg-primary/10"
          aria-label="Editar contato"
        >
          <Pencil className="w-4 h-4" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete(contact)}
          className="text-text-secondary hover:text-status-error hover:bg-status-error/10"
          aria-label="Excluir contato"
        >
          <Trash2 className="w-4 h-4" />
        </IconButton>
      </div>
    </div>
  );
};
