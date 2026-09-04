'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { getPlacementStats, getAllDrives } from '@/lib/api/placements';

export function usePlacementStats() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['placement-stats', userId],
    queryFn: getPlacementStats,
    enabled: !!userId,
  });
}

export function useAllDrives() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['all-drives', userId],
    queryFn: getAllDrives,
    enabled: !!userId,
  });
}