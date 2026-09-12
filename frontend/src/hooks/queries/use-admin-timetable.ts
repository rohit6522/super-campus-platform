'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getTimetableEntries, createTimetableEntry, updateTimetableEntry, deleteTimetableEntry, CreateTimetableInput } from '@/lib/api/admin-timetable';


export function useTimetableEntries(departmentId?: string, semester?: number) {
  return useQuery({
    queryKey: ['admin-timetable', departmentId, semester],
    queryFn: () => getTimetableEntries(departmentId!, semester!),
    enabled: !!departmentId && !!semester,
  });
}

export function useCreateTimetableEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTimetableInput) => createTimetableEntry(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-timetable'] }),
  });
}

export function useDeleteTimetableEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTimetableEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-timetable'] }),
  });
}

export function useUpdateTimetableEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTimetableInput> }) =>
      updateTimetableEntry(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-timetable'] }),
  });
}