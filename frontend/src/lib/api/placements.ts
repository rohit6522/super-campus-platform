import { apiClient } from '@/lib/api-client';

export interface PlacementStats {
  totalDrives: number;
  totalApplications: number;
  selectedCount: number;
  averagePackageLPA: number;
  highestPackageLPA: number;
}

export interface Drive {
  _id: string;
  jobRole: string;
  packageLPA: number;
  applicationDeadline: string;
  status: string;
  companyId: { name: string; logoUrl?: string; industry: string };
}

export async function getPlacementStats(): Promise<PlacementStats> {
  const response = await apiClient.get<PlacementStats>('/placements/stats');
  return response.data;
}

export async function getAllDrives(): Promise<Drive[]> {
  const response = await apiClient.get<Drive[]>('/placements/drives');
  return response.data;
}