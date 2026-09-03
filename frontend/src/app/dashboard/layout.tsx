'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isChecking, clearAuth } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    clearAuth();
    queryClient.clear(); // wipe all cached query data so the next login starts fresh
    router.push('/login');
  };




  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <span className="font-semibold">Super Campus</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.name} · {user?.role}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}