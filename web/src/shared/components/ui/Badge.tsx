import React from 'react';
import Chip from '@mui/material/Chip';

export type BadgeVariant = 'scheduled' | 'sent' | 'error' | 'warning' | 'neutral' | 'active';

export interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactElement;
  size?: 'small' | 'medium';
}

const badgeStyles: Record<BadgeVariant, string> = {
  scheduled: 'bg-status-scheduled/10 text-status-scheduled border border-status-scheduled/30',
  sent: 'bg-status-sent/10 text-status-sent border border-status-sent/30',
  active: 'bg-status-sent/10 text-status-sent border border-status-sent/30',
  warning: 'bg-status-warning/10 text-status-warning border border-status-warning/30',
  error: 'bg-status-error/10 text-status-error border border-status-error/30',
  neutral: 'bg-dark-border text-text-secondary border border-dark-border-light',
};

export const Badge: React.FC<BadgeProps> = ({ variant, children, icon, size = 'small' }) => (
  <Chip
    size={size}
    icon={icon}
    label={children}
    className={`font-medium rounded-full [&_.MuiChip-icon]:text-current ${badgeStyles[variant]}`}
  />
);
