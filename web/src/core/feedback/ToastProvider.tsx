import React, { useState, useCallback, useMemo } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastContext, ToastType } from './ToastContext';

interface ToastState {
  open: boolean;
  message: string;
  type: ToastType;
  id: number;
}

const typeConfig: Record<ToastType, { icon: React.ReactNode; border: string; bg: string; text: string }> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 text-status-sent shrink-0" />,
    border: 'border-status-sent/30',
    bg: 'bg-dark-surface',
    text: 'text-text-primary',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5 text-status-error shrink-0" />,
    border: 'border-status-error/30',
    bg: 'bg-dark-surface',
    text: 'text-text-primary',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-status-warning shrink-0" />,
    border: 'border-status-warning/30',
    bg: 'bg-dark-surface',
    text: 'text-text-primary',
  },
  info: {
    icon: <Info className="w-5 h-5 text-primary shrink-0" />,
    border: 'border-primary/30',
    bg: 'bg-dark-surface',
    text: 'text-text-primary',
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    type: 'info',
    id: 0,
  });

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({
      open: true,
      message,
      type,
      id: Date.now(),
    });
  }, []);

  const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
  const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);
  const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast]);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  const contextValue = useMemo(
    () => ({ showToast, success, error, info, warning }),
    [showToast, success, error, info, warning],
  );

  const currentConfig = typeConfig[toast.type];

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Snackbar
        key={toast.id}
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <div
          role="status"
          className={`flex items-center gap-3 py-3 px-4 rounded-xl border shadow-xl shadow-black/40 min-w-[280px] max-w-md ${currentConfig.bg} ${currentConfig.border}`}
        >
          {currentConfig.icon}
          <span className={`text-sm font-medium flex-1 ${currentConfig.text}`}>
            {toast.message}
          </span>
          <IconButton
            size="small"
            onClick={handleClose}
            className="text-text-secondary hover:text-text-primary p-1 -mr-1"
            aria-label="Fechar"
          >
            <X size={16} />
          </IconButton>
        </div>
      </Snackbar>
    </ToastContext.Provider>
  );
};
