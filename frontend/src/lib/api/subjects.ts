import { apiClient } from '@/lib/api-client';

export interface Subject {
  _id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  departmentId: { name: string; code: string };
}

export async function getMySubjects(): Promise<Subject[]> {
  const response = await apiClient.get<Subject[]>('/subjects/my-subjects');
  return response.data;
}