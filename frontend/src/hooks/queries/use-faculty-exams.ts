'use client';

import { useMutation } from '@tanstack/react-query';
import { createExam, enterResults, CreateExamInput } from '@/lib/api/faculty-exams';

export function useCreateExam() {
  return useMutation({
    mutationFn: (data: CreateExamInput) => createExam(data),
  });
}

export function useEnterResults() {
  return useMutation({
    mutationFn: ({ examId, results }: { examId: string; results: { studentId: string; marksObtained: number }[] }) =>
      enterResults(examId, results),
  });
}