import { apiClient } from '@/lib/api-client';
import { RegisterFormValues, LoginFormValues } from '@/lib/validations/auth';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export async function registerUser(data: RegisterFormValues): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
}

export async function loginUser(data: LoginFormValues): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
}