import React, { useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/core/feedback';
import { parseAppError } from '@/core/errors';
import { Modal } from './Modal';
import { Button } from './Button';

export type ConfirmModalTone = 'danger' | 'primary';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: ConfirmModalTone;
  errorMessage?: string;
  children: React.ReactNode;
}

const toneStyles: Record<ConfirmModalTone, { box: string; icon: string }> = {
  danger: {
    box: 'bg-status-error/10 border-status-error/20',
    icon: 'text-status-error',
  },
  primary: {
    box: 'bg-primary/10 border-primary/20',
    icon: 'text-primary',
  },
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmLabel,
  cancelLabel = 'Cancelar',
  tone = 'danger',
  errorMessage = 'Não foi possível concluir a ação. Tente novamente.',
  children,
}) => {
  const toast = useToast();
  const [isConfirming, setIsConfirming] = useState(false);

  const Icon = tone === 'danger' ? AlertTriangle : Info;
  const styles = toneStyles[tone];

  const handleClose = () => {
    if (isConfirming) return;
    onClose();
  };

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      await onConfirm();
      setIsConfirming(false);
      onClose();
    } catch (err) {
      setIsConfirming(false);
      toast.error(parseAppError(err, errorMessage));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      maxWidth="xs"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={handleClose} disabled={isConfirming}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={tone === 'danger' ? 'danger' : 'solid'}
            isLoading={isConfirming}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 pt-1">
        <div
          className={`flex items-start gap-3 p-3.5 border rounded-xl text-text-secondary text-sm ${styles.box}`}
        >
          <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${styles.icon}`} />
          <div>{children}</div>
        </div>
      </div>
    </Modal>
  );
};
