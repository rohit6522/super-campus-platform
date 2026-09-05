'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { analyzeResume, getAtsHistory } from '@/lib/api/ats';

export function useAnalyzeResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ resumeId, jobDescription }: { resumeId: string; jobDescription: string }) =>
      analyzeResume(resumeId, jobDescription),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ats-history'] }),
  });
}

export function useAtsHistory() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['ats-history', userId],
    queryFn: getAtsHistory,
    enabled: !!userId,
  });
}