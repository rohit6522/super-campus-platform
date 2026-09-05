'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import {
  getAssignmentsForSubject,
  submitAssignment,
  getMySubmissions,
} from '@/lib/api/student-assignments';

export function useAssignmentsForSubject(subjectId: string) {
  return useQuery({
    queryKey: ['assignments-for-subject', subjectId],
    queryFn: () => getAssignmentsForSubject(subjectId),
    enabled: !!subjectId,
  });
}

export function useMySubmissions() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['my-assignment-submissions', userId],
    queryFn: getMySubmissions,
    enabled: !!userId,
  });
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, fileUrl, fileName }: { assignmentId: string; fileUrl: string; fileName: string }) =>
      submitAssignment(assignmentId, fileUrl, fileName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-assignment-submissions'] }),
  });
}