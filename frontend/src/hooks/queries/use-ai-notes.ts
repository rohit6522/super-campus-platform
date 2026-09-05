'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { getMyNotes, getJobStatus } from '@/lib/api/ai-notes';

export function useMyNotes() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['ai-notes', userId],
    queryFn: getMyNotes,
    enabled: !!userId,
  });
}

// Polls job status every 3 seconds until it reaches a terminal state (COMPLETED/FAILED)
export function useJobStatus(jobId: string | null) {
  return useQuery({
    queryKey: ['ai-job', jobId],
    queryFn: () => getJobStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'COMPLETED' || status === 'FAILED' ? false : 3000;
    },
  });
}