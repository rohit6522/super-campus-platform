import { apiClient } from '@/lib/api-client';

export interface Drive {
  _id: string;
  jobRole: string;
  jobDescription: string;
  packageLPA: number;
  requiredSkills: string[];
  minCGPA: number;
  allowedBranches: string[];
  maxBacklogs: number;
  graduationYear: number;
  applicationDeadline: string;
  status: string;
  companyId: { _id: string; name: string; industry: string; location: string; logoUrl?: string };
}

export interface EligibilityReason {
  criterion: string;
  required: string;
  actual: string;
  passed: boolean;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: EligibilityReason[];
}

export interface Application {
  _id: string;
  status: string;
  createdAt: string;
  driveId: {
    _id: string;
    jobRole: string;
    packageLPA: number;
    companyId: { name: string; industry: string };
  };
}

export async function getAllDrives(): Promise<Drive[]> {
  const response = await apiClient.get<Drive[]>('/placements/drives');
  return response.data;
}

export async function getDrive(driveId: string): Promise<Drive> {
  const response = await apiClient.get<Drive>(`/placements/drives/${driveId}`);
  return response.data;
}

export async function checkEligibility(driveId: string): Promise<EligibilityResult> {
  const response = await apiClient.get<EligibilityResult>(`/placements/drives/${driveId}/eligibility`);
  return response.data;
}

export async function applyToDrive(driveId: string): Promise<Application> {
  const response = await apiClient.post<Application>(`/placements/drives/${driveId}/apply`, {});
  return response.data;
}

export async function getMyApplications(): Promise<Application[]> {
  const response = await apiClient.get<Application[]>('/placements/my/applications');
  return response.data;
}