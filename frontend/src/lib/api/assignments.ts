import { apiClient } from '@/lib/api-client';

export async function getMySubmissions() {
  const response = await apiClient.get('/assignments/my/submissions');
  return response.data;
}