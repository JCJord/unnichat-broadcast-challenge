import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SideBar } from './SideBar';
import { TopBar } from './TopBar';

interface AppLayoutProps {
  userEmail?: string | null;
  onLogout?: () => void;
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  userEmail,
  onLogout,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary flex">
      <SideBar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <TopBar
          userEmail={userEmail}
          onLogout={onLogout}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
