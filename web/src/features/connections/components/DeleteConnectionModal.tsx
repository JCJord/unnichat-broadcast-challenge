import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from '@/shared/components/ui';

interface DeleteConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  connectionName?: string;
}

export const DeleteConnectionModal: React.FC<DeleteConnectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  connectionName,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await onConfirm();
      handleClose();
    } catch {
      setError('Não foi possível excluir a conexão. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Excluir Conexão"
      maxWidth="xs"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={handleClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button type="button" variant="danger" isLoading={isDeleting} onClick={handleDelete}>
            Excluir Conexão
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 pt-1">
        {error && (
          <div className="p-3 text-xs text-status-error bg-status-error/10 border border-status-error/20 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-start gap-3 p-3.5 bg-status-error/10 border border-status-error/20 rounded-xl text-text-secondary text-sm">
          <AlertTriangle className="w-5 h-5 text-status-error shrink-0 mt-0.5" />
          <p>
            Tem certeza que deseja excluir a conexão{' '}
            <strong className="text-text-primary font-semibold">"{connectionName}"</strong>? Esta
            ação é permanente e não poderá ser desfeita.
          </p>
        </div>
      </div>
    </Modal>
  );
};
