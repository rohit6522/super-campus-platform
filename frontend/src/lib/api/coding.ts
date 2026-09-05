import { apiClient } from '@/lib/api-client';

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface CodingProblem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  topics: string[];
  points: number;
  starterCode?: string;
  testCases?: TestCase[]; // present on detail view (non-hidden only), absent on list view
}

export interface CodingSubmission {
  _id: string;
  problemId: { _id: string; title: string; difficulty: string } | string;
  code: string;
  language: string;
  verdict: string;
  testCasesPassed: number;
  totalTestCases: number;
  createdAt: string;
}

export interface Progress {
  problemsSolved: number;
  totalPoints: number;
}

export async function getProblems(filters?: { difficulty?: string; topic?: string; search?: string }) {
  const response = await apiClient.get<CodingProblem[]>('/coding/problems', { params: filters });
  return response.data;
}

export async function getProblem(id: string) {
  const response = await apiClient.get<CodingProblem>(`/coding/problems/${id}`);
  return response.data;
}

export async function submitCode(problemId: string, code: string, language: string) {
  const response = await apiClient.post<CodingSubmission>('/coding/submissions', {
    problemId,
    code,
    language,
  });
  return response.data;
}

export async function getMySubmissions(problemId?: string) {
  const response = await apiClient.get<CodingSubmission[]>('/coding/my/submissions', {
    params: problemId ? { problemId } : undefined,
  });
  return response.data;
}

export async function getMyProgress() {
  const response = await apiClient.get<Progress>('/coding/my/progress');
  return response.data;
}