'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProblem, CreateProblemInput } from '@/lib/api/admin-coding';

export function useCreateProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProblemInput) => createProblem(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coding-problems'] }),
  });
}