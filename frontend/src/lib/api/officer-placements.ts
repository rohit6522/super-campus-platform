import { apiClient } from '@/lib/api-client';

export interface CreateDriveInput {
  companyId: string;
  jobRole: string;
  jobDescription: string;
  packageLPA: number;
  requiredSkills: string[];
  minCGPA: number;
  allowedBranches: string[];
  maxBacklogs: number;
  graduationYear: number;
  applicationDeadline: string;
}

export interface DriveApplication {
  _id: string;
  status: string;
  studentId: { _id: string; rollNumber: string; currentCGPA: number };
  createdAt: string;
}

export async function createDrive(data: CreateDriveInput) {
  const response = await apiClient.post('/placements/drives', data);
  return response.data;
}

export async function getApplicationsForDrive(driveId: string): Promise<DriveApplication[]> {
  const response = await apiClient.get<DriveApplication[]>(`/placements/drives/${driveId}/applications`);
  return response.data;
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const response = await apiClient.patch(`/placements/applications/${applicationId}/status`, { status });
  return response.data;
}