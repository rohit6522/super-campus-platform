import { apiClient } from '@/lib/api-client';

export interface SearchResult {
  type: string;
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export async function search(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  const response = await apiClient.get<SearchResult[]>('/search', { params: { q: query } });
  return response.data;
}