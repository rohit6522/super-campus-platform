import { apiClient } from '@/lib/api-client';

export interface TimetableEntry {
  _id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  subjectId: { name: string; code: string };
  facultyId: { name: string };
}

export async function getTimetable(
  departmentId: string,
  semester: number,
): Promise<TimetableEntry[]> {
  const response = await apiClient.get<TimetableEntry[]>('/timetable', {
    params: { departmentId, semester },
  });
  return response.data;
}