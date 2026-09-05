import { apiClient } from '@/lib/api-client';

export interface McqQuestionForQuiz {
  question: string;
  options: string[];
  difficulty: string;
  topic?: string;
}

export interface McqSetSummary {
  _id: string;
  title: string;
  createdAt: string;
}

export interface QuizForTaking {
  _id: string;
  title: string;
  questions: McqQuestionForQuiz[];
}

export interface QuizAttemptResult {
  _id: string;
  score: number;
  totalQuestions: number;
}

export interface GradedQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizResultDetail {
  attempt: {
    score: number;
    totalQuestions: number;
    answers: { questionIndex: number; selectedIndex: number; isCorrect: boolean }[];
  };
  questions: GradedQuestion[];
}

export async function uploadPdfForMcqs(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/ai/pdf/mcqs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data as { _id: string; status: string; sourceFileName: string };
}

export async function getMyMcqSets(): Promise<McqSetSummary[]> {
  const response = await apiClient.get<McqSetSummary[]>('/ai/mcq-sets');
  return response.data;
}

export async function getQuizForTaking(mcqSetId: string): Promise<QuizForTaking> {
  const response = await apiClient.get<QuizForTaking>(`/ai/mcq-sets/${mcqSetId}/quiz`);
  return response.data;
}

export async function submitQuiz(mcqSetId: string, selectedAnswers: number[]): Promise<QuizAttemptResult> {
  const response = await apiClient.post<QuizAttemptResult>(`/ai/mcq-sets/${mcqSetId}/submit`, {
    selectedAnswers,
  });
  return response.data;
}

export async function getQuizResult(attemptId: string): Promise<QuizResultDetail> {
  const response = await apiClient.get<QuizResultDetail>(`/ai/attempts/${attemptId}/result`);
  return response.data;
} 