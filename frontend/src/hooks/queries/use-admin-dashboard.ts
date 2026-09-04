'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { getAdminStats } from '@/lib/api/admin';

export function useAdminStats() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['admin-stats', userId],
    queryFn: getAdminStats,
    enabled: !!userId,
  });
}