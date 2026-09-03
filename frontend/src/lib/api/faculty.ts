import { apiClient } from '@/lib/api-client';

export interface FacultyProfile {
  _id: string;
  employeeId: string;
  designation: string;
  specialization?: string | null;
  userId: { _id: string; name: string; email: string; role: string };
  departmentId: { _id: string; name: string; code: string };
}

export async function getMyFacultyProfile(): Promise<FacultyProfile> {
  const response = await apiClient.get<FacultyProfile>('/faculty/me');
  return response.data;
}