import React from 'react';
import IconButton from '@mui/material/IconButton';
import { format } from 'date-fns';
import { Radio, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { Connection } from '@/types';
import { Badge, Button } from '@/shared/components/ui';

interface ConnectionCardProps {
  connection: Connection;
  isActive: boolean;
  onSelectActive: (connection: Connection) => void;
  onEdit: (connection: Connection) => void;
  onDelete: (connection: Connection) => void;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  isActive,
  onSelectActive,
  onEdit,
  onDelete,
}) => {
  const createdAt = connection.createdAt
    ? format(connection.createdAt.toDate(), "dd/MM/yyyy 'às' HH:mm")
    : null;

  return (
    <div
      className={`rounded-xl p-5 bg-dark-surface flex flex-col justify-between gap-4 transition-all duration-200 border ${
        isActive
          ? 'border-primary/50 ring-1 ring-primary/20 shadow-md shadow-primary/5'
          : 'border-dark-border hover:border-dark-border-light'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              isActive ? 'bg-primary/20 text-primary' : 'bg-dark-border text-text-secondary'
            }`}
          >
            <Radio className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold text-text-primary truncate" title={connection.name}>
              {connection.name}
            </h3>
            {createdAt && (
              <p className="text-xs text-text-secondary mt-0.5">Criada em {createdAt}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <IconButton
            size="small"
            onClick={() => onEdit(connection)}
            className="text-text-secondary hover:text-primary hover:bg-primary/10"
            aria-label="Editar conexão"
          >
            <Pencil className="w-4 h-4" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(connection)}
            className="text-text-secondary hover:text-status-error hover:bg-status-error/10"
            aria-label="Excluir conexão"
          >
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-dark-border">
        {isActive ? (
          <Badge variant="active" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            Ativa
          </Badge>
        ) : (
          <>
            <span className="text-xs text-text-muted">Inativa</span>
            <Button variant="outline" size="sm" onClick={() => onSelectActive(connection)}>
              Tornar Ativa
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
