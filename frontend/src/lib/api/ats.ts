import { apiClient } from '@/lib/api-client';

export interface AtsAnalysis {
  _id: string;
  resumeId: string;
  jobDescription: string;
  overallScore: number;
  keywordMatchScore: number;
  skillsMatchScore: number;
  experienceMatchScore: number;
  educationMatchScore: number;
  missingKeywords: string[];
  formattingIssues: string[];
  suggestions: string[];
  createdAt: string;
}

export async function analyzeResume(resumeId: string, jobDescription: string): Promise<AtsAnalysis> {
  const response = await apiClient.post<AtsAnalysis>('/ats/analyze', { resumeId, jobDescription });
  return response.data;
}

export async function getAtsHistory(): Promise<AtsAnalysis[]> {
  const response = await apiClient.get<AtsAnalysis[]>('/ats/history');
  return response.data;
}