import React from 'react';
import { NavLink } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Radio, Users, Send } from 'lucide-react';

interface SideBarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const navItems = [
  {
    label: 'Conexões',
    to: '/connections',
    icon: Radio,
  },
  {
    label: 'Contatos',
    to: '/contacts',
    icon: Users,
  },
  {
    label: 'Broadcast',
    to: '/broadcast',
    icon: Send,
  },
];

export const SideBar: React.FC<SideBarProps> = ({
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const sidebarContent = (
    <div className="w-64 h-full bg-dark-surface border-r border-dark-border flex flex-col text-white">
      <div className="h-16 flex items-center px-6 border-b border-dark-border gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-xs shadow-primary/20">
          <Radio className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="font-bold text-base text-white tracking-tight">Broadcast</span>
          <span className="block text-[10px] uppercase tracking-wider text-text-muted font-medium">
            Painel de Controle
          </span>
        </div>
      </div>

      <List className="flex-1 !px-3 !py-4 !space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem key={item.to} disablePadding className="!block">
              <NavLink
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) => `
                  block rounded-xl transition-all duration-150 no-underline
                  ${
                    isActive
                      ? '[&_.MuiListItemButton-root]:!bg-primary/10 [&_.MuiListItemButton-root]:!text-primary [&_.MuiListItemButton-root]:!border-primary/30 [&_.MuiListItemIcon-root]:!text-primary'
                      : '[&_.MuiListItemButton-root]:!text-slate-400 hover:[&_.MuiListItemButton-root]:!text-white hover:[&_.MuiListItemButton-root]:!bg-white/5'
                  }
                `}
              >
                <ListItemButton className="!rounded-xl !border !border-transparent !px-3.5 !py-2.5 !gap-3">
                  <ListItemIcon className="!min-w-0 !text-inherit">
                    <Icon className="w-4 h-4 shrink-0" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<span className="text-sm font-medium">{item.label}</span>}
                  />
                </ListItemButton>
              </NavLink>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={isOpenMobile}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            className: '!bg-transparent !border-none !shadow-none',
          },
          backdrop: {
            className: '!bg-black/70 !backdrop-blur-xs',
          },
        }}
        className="lg:hidden"
      >
        {sidebarContent}
      </Drawer>

      <Drawer
        variant="permanent"
        slotProps={{
          paper: {
            className: '!bg-transparent !border-none !shadow-none',
          },
        }}
        className="hidden lg:block w-64 shrink-0"
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};
