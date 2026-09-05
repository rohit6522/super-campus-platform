import { apiClient } from '@/lib/api-client';

export interface Subject {
  _id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  departmentId: { _id: string; name: string; code: string } | string;
}

export interface CreateSubjectInput {
  name: string;
  code: string;
  credits: number;
  semester: number;
  departmentId: string;
}

export async function getSubjects(departmentId?: string, semester?: number): Promise<Subject[]> {
  const response = await apiClient.get<Subject[]>('/subjects', {
    params: { departmentId, semester },
  });
  return response.data;
}

export async function createSubject(data: CreateSubjectInput) {
  const response = await apiClient.post<Subject>('/subjects', data);
  return response.data;
}

export async function deleteSubject(id: string) {
  await apiClient.delete(`/subjects/${id}`);
}