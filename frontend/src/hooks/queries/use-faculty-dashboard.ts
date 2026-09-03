'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { getMyFacultyProfile } from '@/lib/api/faculty';
import { getMySubjects } from '@/lib/api/subjects';
import { getTimetable } from '@/lib/api/timetable';

export function useFacultyProfile() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['faculty-profile', userId],
    queryFn: getMyFacultyProfile,
    enabled: !!userId,
  });
}

export function useMySubjects() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['my-subjects', userId],
    queryFn: getMySubjects,
    enabled: !!userId,
  });
}

export function useFacultyTimetable(departmentId?: string, semester?: number) {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['faculty-timetable', userId, departmentId, semester],
    queryFn: () => getTimetable(departmentId!, semester!),
    enabled: !!userId && !!departmentId && !!semester,
  });
}