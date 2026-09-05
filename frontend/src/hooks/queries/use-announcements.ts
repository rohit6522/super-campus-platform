'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnnouncements, createAnnouncement } from '@/lib/api/announcements';

export function useAnnouncements(limit?: number) {
  return useQuery({
    queryKey: ['announcements', limit],
    queryFn: () => getAnnouncements(limit),
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; content: string; category?: string }) => createAnnouncement(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
  });
}