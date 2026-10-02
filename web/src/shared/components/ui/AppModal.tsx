import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { X } from 'lucide-react';

export interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
}

export const AppModal: React.FC<AppModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'sm',
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      slotProps={{
        backdrop: {
          className: '!bg-black/75 !backdrop-blur-xs',
        },
        paper: {
          className: '!bg-dark-elevated !border !border-dark-border !rounded-2xl !shadow-2xl !text-white',
        },
      }}
    >
      <DialogTitle className="!p-5 !border-b !border-dark-border !flex !items-start !justify-between">
        <div className="space-y-1 pr-4">
          <span className="text-lg font-semibold text-white block">{title}</span>
          {description && (
            <span className="text-xs text-text-secondary block font-normal">
              {description}
            </span>
          )}
        </div>
        <IconButton
          size="small"
          onClick={onClose}
          className="!text-slate-400 hover:!text-white hover:!bg-white/5 cursor-pointer"
          aria-label="Fechar"
        >
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent className="!p-5 !text-text-secondary">{children}</DialogContent>

      {footer && (
        <DialogActions className="!p-4 !bg-dark-surface/60 !border-t !border-dark-border !gap-2">
          {footer}
        </DialogActions>
      )}
    </Dialog>
  );
};
