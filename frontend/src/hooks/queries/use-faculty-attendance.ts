'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { createSession, markAttendance, CreateSessionInput } from '@/lib/api/faculty-attendance';

export function useMySubjectsForAttendance() {
  return useQuery({
    queryKey: ['faculty-subjects-attendance'],
    queryFn: async () => {
      const response = await apiClient.get('/subjects/my-subjects');
      return response.data;
    },
  });
}

export function useStudentsByClass(departmentId?: string, semester?: number) {
  return useQuery({
    queryKey: ['students-by-class', departmentId, semester],
    queryFn: async () => {
      const response = await apiClient.get('/students/by-class', {
        params: { departmentId, semester },
      });
      return response.data;
    },
    enabled: !!departmentId && !!semester,
  });
}

export function useCreateSession() {
  return useMutation({
    mutationFn: (data: CreateSessionInput) => createSession(data),
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, records }: { sessionId: string; records: { studentId: string; status: 'PRESENT' | 'ABSENT' }[] }) =>
      markAttendance(sessionId, records),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['faculty-sessions'] }),
  });
}