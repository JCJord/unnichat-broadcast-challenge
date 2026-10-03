import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  solid:
    'bg-primary text-primary-contrast font-semibold hover:bg-primary-hover active:bg-primary-active shadow-sm shadow-primary/20 disabled:bg-dark-border disabled:text-text-muted disabled:shadow-none',
  outline:
    'bg-transparent text-text-primary border border-dark-border hover:border-primary hover:text-primary active:bg-primary/10 disabled:border-dark-border disabled:text-text-muted',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5 active:bg-white/10 disabled:text-text-muted',
  danger:
    'bg-status-error/10 text-status-error border border-status-error/30 hover:bg-status-error/20 hover:border-status-error/50 active:bg-status-error/30 disabled:border-dark-border disabled:text-text-muted',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base rounded-lg gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
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
}) => (
  <MuiButton
    disabled={disabled || isLoading}
    fullWidth={fullWidth}
    startIcon={isLoading ? undefined : leftIcon}
    endIcon={isLoading ? undefined : rightIcon}
    className={`min-w-0 normal-case tracking-normal transition-all duration-150 cursor-pointer disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
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
  </MuiButton>
);
