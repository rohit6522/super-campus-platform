'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { getProblems, getProblem, submitCode, getMySubmissions, getMyProgress } from '@/lib/api/coding';

export function useProblems(filters?: { difficulty?: string; topic?: string; search?: string }) {
  return useQuery({
    queryKey: ['coding-problems', filters],
    queryFn: () => getProblems(filters),
  });
}

export function useProblem(id: string) {
  return useQuery({
    queryKey: ['coding-problem', id],
    queryFn: () => getProblem(id),
    enabled: !!id,
  });
}

export function useSubmitCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ problemId, code, language }: { problemId: string; code: string; language: string }) =>
      submitCode(problemId, code, language),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coding-submissions', variables.problemId] });
      queryClient.invalidateQueries({ queryKey: ['coding-progress'] });
    },
  });
}

export function useMySubmissions(problemId?: string) {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['coding-submissions', problemId, userId],
    queryFn: () => getMySubmissions(problemId),
    enabled: !!userId,
  });
}

export function useMyProgress() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['coding-progress', userId],
    queryFn: getMyProgress,
    enabled: !!userId,
  });
}