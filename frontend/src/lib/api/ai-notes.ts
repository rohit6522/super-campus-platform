import { apiClient } from '@/lib/api-client';

export interface AiJob {
  _id: string;
  type: string;
  status: string;
  sourceFileName: string;
  errorMessage?: string;
  resultId?: string;
}

export interface Note {
  _id: string;
  title: string;
  summary: string;
  keyConcepts: string[];
  importantPoints: string[];
  definitions: { term: string; definition: string }[];
  examples: string[];
  createdAt: string;
}

export async function uploadPdfForNotes(file: File): Promise<AiJob> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<AiJob>('/ai/pdf/notes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function getJobStatus(jobId: string): Promise<AiJob> {
  const response = await apiClient.get<AiJob>(`/ai/jobs/${jobId}`);
  return response.data;
}

export async function getMyNotes(): Promise<Note[]> {
  const response = await apiClient.get<Note[]>('/ai/notes');
  return response.data;
}

export async function getNote(id: string): Promise<Note> {
  const response = await apiClient.get<Note>(`/ai/notes/${id}`);
  return response.data;
}