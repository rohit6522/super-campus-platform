'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '@/lib/api/admin-departments';

export function useDepartments() {
  return useQuery({
    queryKey: ['admin-departments'],
    queryFn: getDepartments,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-departments'] }),
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{ name: string; code: string; description?: string }> }) =>
      updateDepartment(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-departments'] }),
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-departments'] }),
  });
}