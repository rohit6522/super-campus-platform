'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import {
  getMyResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
  ResumeInput,
} from '@/lib/api/resumes';

export function useMyResumes() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['resumes', userId],
    queryFn: getMyResumes,
    enabled: !!userId,
  });
}

export function useResume(id: string) {
  return useQuery({
    queryKey: ['resume', id],
    queryFn: () => getResume(id),
    enabled: !!id,
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ResumeInput>) => createResume(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  });
}

export function useUpdateResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ResumeInput> }) => updateResume(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['resume', variables.id] });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteResume(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  });
}

export function useDuplicateResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => duplicateResume(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  });
}