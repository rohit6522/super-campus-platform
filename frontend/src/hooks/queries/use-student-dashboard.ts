'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyStudentProfile } from '@/lib/api/students';
import { getMyOverallAttendance } from '@/lib/api/attendance';
import { getMyCGPA } from '@/lib/api/exams';
import { getMySubmissions } from '@/lib/api/assignments';
import { getTimetable } from '@/lib/api/timetable';

export function useStudentProfile() {
  return useQuery({
    queryKey: ['student-profile'],
    queryFn: getMyStudentProfile,
  });
}

export function useMyAttendance() {
  return useQuery({
    queryKey: ['my-attendance'],
    queryFn: getMyOverallAttendance,
  });
}

export function useMyCGPA() {
  return useQuery({
    queryKey: ['my-cgpa'],
    queryFn: getMyCGPA,
  });
}

export function useMySubmissions() {
  return useQuery({
    queryKey: ['my-submissions'],
    queryFn: getMySubmissions,
  });
}

export function useMyTimetable(departmentId?: string, semester?: number) {
  return useQuery({
    queryKey: ['my-timetable', departmentId, semester],
    queryFn: () => getTimetable(departmentId!, semester!),
    enabled: !!departmentId && !!semester, // only run once we know dept/semester (from profile)
  });
}