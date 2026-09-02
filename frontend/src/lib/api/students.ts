import { apiClient } from '@/lib/api-client';

export interface StudentProfile {
  _id: string;
  rollNumber: string;
  semester: number;
  batchYear: number;
  graduationYear: number;
  currentCGPA: number;
  attendancePercentage: number;
  backlogs: number;
  userId: { _id: string; name: string; email: string; role: string };
  departmentId: { _id: string; name: string; code: string };
}

export async function getMyStudentProfile(): Promise<StudentProfile> {
  const response = await apiClient.get<StudentProfile>('/students/me');
  return response.data;
}