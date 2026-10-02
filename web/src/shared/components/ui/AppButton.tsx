import React from 'react';
import Button, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  solid:
    '!bg-primary !text-dark-bg !font-semibold hover:!bg-primary-hover active:!bg-primary-active !shadow-sm !shadow-primary/20 disabled:!bg-slate-800 disabled:!text-slate-500',
  outline:
    '!bg-transparent !text-white !border !border-dark-border hover:!border-primary hover:!text-primary active:!bg-primary/10 disabled:!border-slate-800 disabled:!text-slate-600',
  ghost:
    '!bg-transparent !text-slate-300 hover:!text-white hover:!bg-white/5 active:!bg-white/10 disabled:!text-slate-600',
  danger:
    '!bg-rose-500/10 !text-rose-400 !border !border-rose-500/30 hover:!bg-rose-500/20 hover:!border-rose-500/50 active:!bg-rose-500/30 disabled:!border-slate-800 disabled:!text-slate-600',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: '!px-3 !py-1.5 !text-xs !rounded-md !gap-1.5',
  md: '!px-4 !py-2 !text-sm !rounded-lg !gap-2',
  lg: '!px-5 !py-2.5 !text-base !rounded-lg !gap-2.5',
};

export const AppButton: React.FC<AppButtonProps> = ({
  variant = 'solid',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <Button
      disabled={isDisabled}
      fullWidth={fullWidth}
      startIcon={!isLoading ? leftIcon : undefined}
      endIcon={!isLoading ? rightIcon : undefined}
      className={`
        !normal-case !tracking-normal !transition-all !duration-150 !cursor-pointer
        disabled:!cursor-not-allowed disabled:!pointer-events-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...rest}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <CircularProgress size={16} color="inherit" thickness={5} />
          <span>Carregando...</span>
        </span>
      ) : (
        children
      )}
    </Button>
  );
};
