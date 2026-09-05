import { apiClient } from '@/lib/api-client';

export interface AttendanceSession {
  _id: string;
  subjectId: string;
  departmentId: string;
  semester: number;
  date: string;
  isFinalized: boolean;
}

export interface CreateSessionInput {
  subjectId: string;
  departmentId: string;
  semester: number;
  date: string;
}

export interface RosterStudent {
  studentId: { _id: string; rollNumber: string };
  status?: string;
}

export async function createSession(data: CreateSessionInput): Promise<AttendanceSession> {
  const response = await apiClient.post<AttendanceSession>('/attendance/sessions', data);
  return response.data;
}

export async function markAttendance(
  sessionId: string,
  records: { studentId: string; status: 'PRESENT' | 'ABSENT' }[],
) {
  const response = await apiClient.post(`/attendance/sessions/${sessionId}/mark`, { records });
  return response.data;
}

export async function getSessionRoster(sessionId: string) {
  const response = await apiClient.get(`/attendance/sessions/${sessionId}`);
  return response.data;
}