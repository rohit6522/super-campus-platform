import { apiClient } from '@/lib/api-client';

export interface Department {
  _id: string;
  name: string;
  code: string;
  description?: string;
}

export async function getDepartments(): Promise<Department[]> {
  const response = await apiClient.get<Department[]>('/departments');
  return response.data;
}

export async function createDepartment(data: { name: string; code: string; description?: string }) {
  const response = await apiClient.post<Department>('/departments', data);
  return response.data;
}

export async function updateDepartment(id: string, data: Partial<{ name: string; code: string; description?: string }>) {
  const response = await apiClient.patch<Department>(`/departments/${id}`, data);
  return response.data;
}

export async function deleteDepartment(id: string) {
  await apiClient.delete(`/departments/${id}`);
}