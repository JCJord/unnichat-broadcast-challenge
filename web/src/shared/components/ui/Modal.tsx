import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'sm',
}) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
    fullWidth
    maxWidth={maxWidth}
    slotProps={{
      backdrop: { className: 'bg-black/75 backdrop-blur-xs' },
      paper: { className: 'shadow-2xl text-text-primary' },
    }}
  >
    <DialogTitle className="p-5 border-b border-dark-border flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold text-text-primary">{title}</span>
        {description && (
          <span className="text-xs text-text-secondary font-normal">{description}</span>
        )}
      </div>
      <IconButton
        size="small"
        onClick={onClose}
        className="text-text-secondary hover:text-text-primary hover:bg-white/5"
        aria-label="Fechar"
      >
        <X size={18} />
      </IconButton>
    </DialogTitle>

    <DialogContent className="p-5 text-text-secondary">{children}</DialogContent>

    {footer && (
      <DialogActions className="p-4 bg-dark-surface/60 border-t border-dark-border gap-2">
        {footer}
      </DialogActions>
    )}
  </Dialog>
);
