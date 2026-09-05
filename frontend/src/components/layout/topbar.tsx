'use client';

import { useRouter } from 'next/navigation';
import { Search, Bell, Bot, QrCode, LogOut, User, ChevronDown } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Topbar({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    queryClient.clear();
    router.push('/login');
  };

  return (
    <header
      className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6 transition-all duration-200 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}
    >
      <div className="relative w-full max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          className="h-9 w-full rounded-md border border-input bg-muted/30 pl-9 pr-3 text-sm outline-none"
          placeholder="Search subjects, drives, notes, faculty, rooms..."
        />
      </div>

      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline" className="gap-1.5">
          <Bot size={14} /> Ask Campus AI
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5" disabled title="Coming soon">
          <QrCode size={14} /> QR Check-in
        </Button>
        <button className="relative rounded-full p-2 hover:bg-muted">
          <Bell size={18} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md pl-2 pr-1 py-1 hover:bg-muted">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                {user?.name?.charAt(0) ?? '?'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium leading-tight">{user?.name}</p>
                <p className="text-xs text-muted-foreground leading-tight">{user?.role}</p>
              </div>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem disabled>
              <User size={14} className="mr-2" /> Profile (soon)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut size={14} className="mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}