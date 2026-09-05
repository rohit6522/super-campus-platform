'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { getMyMcqSets} from '@/lib/api/ai-mcqs';
import { getJobStatus as getJobStatusFromNotes } from '@/lib/api/ai-notes'; // reuse same job status endpoint

export function useMyMcqSets() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['ai-mcq-sets', userId],
    queryFn: getMyMcqSets,
    enabled: !!userId,
  });
}

export function useMcqJobStatus(jobId: string | null) {
  return useQuery({
    queryKey: ['ai-mcq-job', jobId],
    queryFn: () => getJobStatusFromNotes(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'COMPLETED' || status === 'FAILED' ? false : 3000;
    },
  });
}