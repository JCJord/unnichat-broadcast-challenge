import React from 'react';
import IconButton from '@mui/material/IconButton';
import { Send, Clock, Users, Pencil, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Broadcast } from '@/types';
import { Badge } from '@/shared/components/ui';

interface BroadcastCardProps {
  broadcast: Broadcast;
  onEdit?: (broadcast: Broadcast) => void;
  onDelete: (broadcast: Broadcast) => void;
}

export const BroadcastCard: React.FC<BroadcastCardProps> = ({
  broadcast,
  onEdit,
  onDelete,
}) => {
  const isScheduled = broadcast.status === 'scheduled';

  const scheduledDate = broadcast.scheduledFor
    ? format(broadcast.scheduledFor.toDate(), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })
    : null;

  const sentDate = broadcast.sentAt
    ? format(broadcast.sentAt.toDate(), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })
    : null;

  return (
    <div className="rounded-2xl p-5 bg-dark-surface border border-dark-border hover:border-dark-border-light transition-all flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={isScheduled ? 'warning' : 'sent'}>
            <span className="flex items-center gap-1.5">
              {isScheduled ? <Clock className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              {isScheduled ? 'Agendada' : 'Enviada'}
            </span>
          </Badge>

          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Users className="w-3.5 h-3.5" />
            <span>{broadcast.recipientCount} {broadcast.recipientCount === 1 ? 'destinatário' : 'destinatários'}</span>
          </div>
        </div>

        <p className="text-sm text-text-primary whitespace-pre-wrap break-words line-clamp-4 leading-relaxed font-normal">
          {broadcast.message}
        </p>
      </div>

      <div className="pt-3 border-t border-dark-border/60 flex items-center justify-between gap-2 text-xs text-text-secondary">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <span>
            {isScheduled
              ? `Agendado para: ${scheduledDate}`
              : `Enviado em: ${sentDate || 'Agora'}`}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isScheduled && onEdit && (
            <IconButton
              size="small"
              onClick={() => onEdit(broadcast)}
              className="text-text-secondary hover:text-primary hover:bg-primary/10"
              aria-label="Editar agendamento"
            >
              <Pencil className="w-4 h-4" />
            </IconButton>
          )}

          <IconButton
            size="small"
            onClick={() => onDelete(broadcast)}
            className="text-text-secondary hover:text-status-error hover:bg-status-error/10"
            aria-label="Excluir broadcast"
          >
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
