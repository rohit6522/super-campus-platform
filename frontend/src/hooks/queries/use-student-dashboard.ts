'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { getMyStudentProfile } from '@/lib/api/students';
import { getMyOverallAttendance } from '@/lib/api/attendance';
import { getMyCGPA } from '@/lib/api/exams';
import { getMySubmissions } from '@/lib/api/assignments';
import { getTimetable } from '@/lib/api/timetable';

export function useStudentProfile() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['student-profile', userId],
    queryFn: getMyStudentProfile,
    enabled: !!userId,
  });
}

export function useMyAttendance() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['my-attendance', userId],
    queryFn: getMyOverallAttendance,
    enabled: !!userId,
  });
}

export function useMyCGPA() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['my-cgpa', userId],
    queryFn: getMyCGPA,
    enabled: !!userId,
  });
}

export function useMySubmissions() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['my-submissions', userId],
    queryFn: getMySubmissions,
    enabled: !!userId,
  });
}

export function useMyTimetable(departmentId?: string, semester?: number) {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    queryKey: ['my-timetable', userId, departmentId, semester],
    queryFn: () => getTimetable(departmentId!, semester!),
    enabled: !!userId && !!departmentId && !!semester,
  });
}