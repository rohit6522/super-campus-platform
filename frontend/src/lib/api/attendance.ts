import { apiClient } from '@/lib/api-client';

export interface OverallAttendance {
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

export async function getMyOverallAttendance(): Promise<OverallAttendance> {
  const response = await apiClient.get<OverallAttendance>('/attendance/my/overall');
  return response.data;
}