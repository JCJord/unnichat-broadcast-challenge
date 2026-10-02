import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/core/auth/useAuth';
import { SideBar } from './SideBar';
import { TopBar } from './TopBar';

export const Layout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary flex">
      <SideBar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          userEmail={currentUser?.email}
          onLogout={logout}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
