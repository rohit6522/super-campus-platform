import { apiClient } from '@/lib/api-client';

export interface TimetableEntry {
  _id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  subjectId: { _id: string; name: string; code: string } | string;
  facultyId: { _id: string; name: string } | string;
}

export interface CreateTimetableInput {
  departmentId: string;
  semester: number;
  subjectId: string;
  facultyId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
}

export async function getTimetableEntries(departmentId: string, semester: number): Promise<TimetableEntry[]> {
  const response = await apiClient.get<TimetableEntry[]>('/timetable', {
    params: { departmentId, semester },
  });
  return response.data;
}

export async function createTimetableEntry(data: CreateTimetableInput) {
  const response = await apiClient.post<TimetableEntry>('/timetable', data);
  return response.data;
}

export async function updateTimetableEntry(id: string, data: Partial<CreateTimetableInput>) {
  const response = await apiClient.patch<TimetableEntry>(`/timetable/${id}`, data);
  return response.data;
}

export async function deleteTimetableEntry(id: string) {
  await apiClient.delete(`/timetable/${id}`);
}