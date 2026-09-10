import { apiClient } from '@/lib/api-client';

export async function generateQrToken(sessionId: string): Promise<{ token: string; expiresAt: string }> {
  const response = await apiClient.post(`/attendance/sessions/${sessionId}/qr/generate`);
  return response.data;
}

export async function scanQrCode(token: string): Promise<{ message: string }> {
  const response = await apiClient.post('/attendance/qr/scan', { token });
  return response.data;
}