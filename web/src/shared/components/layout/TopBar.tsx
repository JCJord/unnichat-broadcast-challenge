import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { Menu as MenuIcon, LogOut } from 'lucide-react';
import { Button } from '../ui';

interface TopBarProps {
  userEmail?: string | null;
  onLogout?: () => void;
  onToggleMobileMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  userEmail,
  onLogout,
  onToggleMobileMenu,
}) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      className="!h-16 !bg-dark-surface/90 !backdrop-blur-md !border-b !border-dark-border !text-white !box-border"
    >
      <Toolbar className="!h-16 !min-h-16 !max-h-16 !px-4 lg:!px-8 !flex !items-center !justify-between !box-border">
        <div className="flex items-center gap-3">
          <IconButton
            size="small"
            onClick={onToggleMobileMenu}
            className="lg:!hidden !text-slate-400 hover:!text-white hover:!bg-white/5 cursor-pointer"
            aria-label="Abrir menu"
          >
            <MenuIcon className="w-5 h-5" />
          </IconButton>
        </div>

        <div className="flex items-center gap-3">
          {userEmail && (
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-dark-bg border border-dark-border text-xs text-text-secondary">
              <Avatar
                sx={{ width: 22, height: 22 }}
                className="!bg-primary/20 !text-primary !text-[11px] !font-bold"
              >
                {userEmail.charAt(0).toUpperCase()}
              </Avatar>
              <span className="font-medium text-white max-w-[180px] truncate">
                {userEmail}
              </span>
            </div>
          )}

          {onLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              leftIcon={<LogOut className="w-4 h-4 text-rose-400" />}
              className="text-xs hover:!bg-rose-500/10 hover:!text-rose-400"
            >
              <span className="hidden sm:inline">Sair</span>
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};
