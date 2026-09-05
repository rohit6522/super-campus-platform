'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCompanies } from '@/hooks/queries/use-admin-companies';
import {
  createDrive,
  getApplicationsForDrive,
  updateApplicationStatus,
  CreateDriveInput,
} from '@/lib/api/officer-placements';

export { useCompanies };

export function useCreateDrive() {
  return useMutation({
    mutationFn: (data: CreateDriveInput) => createDrive(data),
  });
}

export function useDriveApplications(driveId: string) {
  return useQuery({
    queryKey: ['drive-applications', driveId],
    queryFn: () => getApplicationsForDrive(driveId),
    enabled: !!driveId,
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: string }) =>
      updateApplicationStatus(applicationId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['drive-applications'] });
    },
  });
}