import { apiClient } from '@/lib/api-client';

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  category: string;
  postedBy: { name: string; role: string };
  createdAt: string;
}

export async function getAnnouncements(limit?: number): Promise<Announcement[]> {
  const response = await apiClient.get<Announcement[]>('/announcements', {
    params: limit ? { limit } : undefined,
  });
  return response.data;
}

export async function createAnnouncement(data: { title: string; content: string; category?: string }) {
  const response = await apiClient.post<Announcement>('/announcements', data);
  return response.data;
}