'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { getMyFacultyProfile } from '@/lib/api/faculty';
import { getDepartmentStats } from '@/lib/api/hod';

export function useHodProfile() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['hod-profile', userId],
    queryFn: getMyFacultyProfile, // HOD reuses the faculty profile endpoint
    enabled: !!userId,
  });
}

export function useDepartmentStats(departmentId?: string) {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['department-stats', userId, departmentId],
    queryFn: () => getDepartmentStats(departmentId!),
    enabled: !!userId && !!departmentId,
  });
}