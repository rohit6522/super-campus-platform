'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAssignment,
  getSubmissionsForAssignment,
  gradeSubmission,
  CreateAssignmentInput,
} from '@/lib/api/faculty-assignments';

export function useCreateAssignment() {
  return useMutation({
    mutationFn: (data: CreateAssignmentInput) => createAssignment(data),
  });
}

export function useSubmissionsForAssignment(assignmentId: string) {
  return useQuery({
    queryKey: ['submissions', assignmentId],
    queryFn: () => getSubmissionsForAssignment(assignmentId),
    enabled: !!assignmentId,
  });
}

export function useGradeSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ submissionId, marksObtained, feedback }: { submissionId: string; marksObtained: number; feedback?: string }) =>
      gradeSubmission(submissionId, marksObtained, feedback),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
}