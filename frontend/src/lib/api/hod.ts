import { apiClient } from '@/lib/api-client';

export interface DepartmentStats {
  totalStudents: number;
  totalFaculty: number;
  averageCGPA: number;
  averageAttendance: number;
}

export async function getDepartmentStats(departmentId: string): Promise<DepartmentStats> {
  const response = await apiClient.get<DepartmentStats>(`/admin/department/${departmentId}/stats`);
  return response.data;
}