import { apiClient } from '@/lib/api-client';

export interface Assignment {
  _id: string;
  title: string;
  description?: string;
  deadline: string;
  maxMarks: number;
  subjectId: string;
}

export interface Submission {
  _id: string;
  assignmentId: { _id: string; title: string; deadline: string; maxMarks: number };
  fileUrl: string;
  fileName: string;
  status: string;
  marksObtained?: number;
  feedback?: string;
}

export async function getAssignmentsForSubject(subjectId: string): Promise<Assignment[]> {
  const response = await apiClient.get<Assignment[]>(`/assignments/subject/${subjectId}`);
  return response.data;
}

export async function submitAssignment(assignmentId: string, fileUrl: string, fileName: string) {
  const response = await apiClient.post(`/assignments/${assignmentId}/submit`, { fileUrl, fileName });
  return response.data;
}

export async function getMySubmissions(): Promise<Submission[]> {
  const response = await apiClient.get<Submission[]>('/assignments/my/submissions');
  return response.data;
}