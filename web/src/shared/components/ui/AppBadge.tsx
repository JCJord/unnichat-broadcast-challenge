import React from 'react';
import Chip from '@mui/material/Chip';

export type BadgeVariant = 'scheduled' | 'sent' | 'error' | 'neutral';

export interface AppBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactElement;
  size?: 'small' | 'medium';
}

const badgeStyles: Record<BadgeVariant, string> = {
  scheduled: '!bg-primary/10 !text-primary !border !border-primary/30',
  sent: '!bg-emerald-500/10 !text-emerald-400 !border !border-emerald-500/30',
  error: '!bg-rose-500/10 !text-rose-400 !border !border-rose-500/30',
  neutral: '!bg-slate-800 !text-slate-300 !border !border-slate-700',
};

export const AppBadge: React.FC<AppBadgeProps> = ({
  variant,
  children,
  icon,
  size = 'small',
}) => {
  return (
    <Chip
      size={size}
      icon={icon}
      label={children}
      className={`
        !font-medium !rounded-full
        ${badgeStyles[variant]}
        [&_.MuiChip-icon]:!text-current
      `}
    />
  );
};
