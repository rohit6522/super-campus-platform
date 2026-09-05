import { apiClient } from '@/lib/api-client';

export async function askAssistant(question: string): Promise<{ answer: string; sourcesUsed: number }> {
  const response = await apiClient.post<{ answer: string; sourcesUsed: number }>('/ai/assistant/ask', {
    question,
  });
  return response.data;
}