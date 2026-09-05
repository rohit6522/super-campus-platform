import { apiClient } from '@/lib/api-client';

export interface TestCaseInput {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface CreateProblemInput {
  title: string;
  description: string;
  difficulty: string;
  topics: string[];
  testCases: TestCaseInput[];
  starterCode?: string;
  points: number;
}

export async function createProblem(data: CreateProblemInput) {
  const response = await apiClient.post('/coding/problems', data);
  return response.data;
}