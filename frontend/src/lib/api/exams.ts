import { apiClient } from '@/lib/api-client';

export interface CGPAResponse {
  cgpa: number;
  semesterHistory: {
    semester: number;
    sgpa: number;
    totalCredits: number;
  }[];
}

export async function getMyCGPA(): Promise<CGPAResponse> {
  const response = await apiClient.get<CGPAResponse>('/exams/my/cgpa');
  return response.data;
}

export async function getMyResults() {
  const response = await apiClient.get('/exams/my/results');
  return response.data;
}