'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isChecking } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
      <Topbar sidebarCollapsed={collapsed} />
      <main
        className={`p-6 transition-all duration-200 ${collapsed ? 'ml-16' : 'ml-64'}`}
      >
        {children}
      </main>
    </div>
  );
}