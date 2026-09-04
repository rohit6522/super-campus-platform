'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { getAllDrives, getDrive, checkEligibility, applyToDrive, getMyApplications } from '@/lib/api/student-placements';

export function useDrives() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['drives', userId],
    queryFn: getAllDrives,
    enabled: !!userId,
  });
}

export function useDrive(driveId: string) {
  return useQuery({
    queryKey: ['drive', driveId],
    queryFn: () => getDrive(driveId),
    enabled: !!driveId,
  });
}

export function useEligibility(driveId: string) {
  return useQuery({
    queryKey: ['eligibility', driveId],
    queryFn: () => checkEligibility(driveId),
    enabled: !!driveId,
  });
}

export function useApplyToDrive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (driveId: string) => applyToDrive(driveId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
  });
}

export function useMyApplications() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['my-applications', userId],
    queryFn: getMyApplications,
    enabled: !!userId,
  });
}