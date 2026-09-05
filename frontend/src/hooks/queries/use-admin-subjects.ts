'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubjects, createSubject, deleteSubject, CreateSubjectInput } from '@/lib/api/admin-subjects';

export function useAllSubjects() {
  return useQuery({
    queryKey: ['admin-subjects'],
    queryFn: () => getSubjects(),
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubjectInput) => createSubject(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-subjects'] }),
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-subjects'] }),
  });
}