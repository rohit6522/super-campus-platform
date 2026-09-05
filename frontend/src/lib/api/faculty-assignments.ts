import { apiClient } from '@/lib/api-client';

export interface CreateAssignmentInput {
  title: string;
  description?: string;
  subjectId: string;
  departmentId: string;
  semester: number;
  deadline: string;
  maxMarks: number;
}

export interface Submission {
  _id: string;
  studentId: { _id: string; rollNumber: string };
  fileUrl: string;
  fileName: string;
  status: string;
  marksObtained?: number;
  feedback?: string;
  submittedAt: string;
}

export async function createAssignment(data: CreateAssignmentInput) {
  const response = await apiClient.post('/assignments', data);
  return response.data;
}

export async function getSubmissionsForAssignment(assignmentId: string): Promise<Submission[]> {
  const response = await apiClient.get<Submission[]>(`/assignments/${assignmentId}/submissions`);
  return response.data;
}

export async function gradeSubmission(submissionId: string, marksObtained: number, feedback?: string) {
  const response = await apiClient.post(`/assignments/submissions/${submissionId}/grade`, {
    marksObtained,
    feedback,
  });
  return response.data;
}