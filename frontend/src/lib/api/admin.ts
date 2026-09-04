import { apiClient } from '@/lib/api-client';

export interface AdminStats {
  totalStudents: number;
  totalFaculty: number;
  totalDepartments: number;
  totalCompanies: number;
  activeDrives: number;
  totalUsers: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const response = await apiClient.get<AdminStats>('/admin/stats');
  return response.data;
}