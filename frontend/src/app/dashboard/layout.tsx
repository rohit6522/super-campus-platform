'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isChecking } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth < 768) setCollapsed(true);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  if (isChecking) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
      <Topbar sidebarCollapsed={collapsed} />
      <main className={`p-4 sm:p-6 transition-all duration-200 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        {children}
      </main>
    </div>
  );
}