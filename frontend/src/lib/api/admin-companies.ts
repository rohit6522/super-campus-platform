import { apiClient } from '@/lib/api-client';

export interface Company {
  _id: string;
  name: string;
  industry: string;
  location: string;
  description?: string;
  website?: string;
}

export interface CreateCompanyInput {
  name: string;
  industry: string;
  location: string;
  description?: string;
  website?: string;
}

export async function getCompanies(): Promise<Company[]> {
  const response = await apiClient.get<Company[]>('/companies');
  return response.data;
}

export async function createCompany(data: CreateCompanyInput) {
  const response = await apiClient.post<Company>('/companies', data);
  return response.data;
}

export async function deleteCompany(id: string) {
  await apiClient.delete(`/companies/${id}`);
}