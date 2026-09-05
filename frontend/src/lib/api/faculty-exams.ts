import { apiClient } from '@/lib/api-client';

export interface CreateExamInput {
  subjectId: string;
  departmentId: string;
  semester: number;
  examType: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  maxMarks: number;
}

export async function createExam(data: CreateExamInput) {
  const response = await apiClient.post('/exams', data);
  return response.data;
}

export async function enterResults(examId: string, results: { studentId: string; marksObtained: number }[]) {
  const response = await apiClient.post(`/exams/${examId}/results`, { results });
  return response.data;
}