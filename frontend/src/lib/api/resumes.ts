import { apiClient } from '@/lib/api-client';

export interface EducationEntry {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear?: string;
  endYear?: string;
  grade?: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface ProjectEntry {
  title: string;
  description?: string;
  technologies: string[];
  link?: string;
}

export interface CertificationEntry {
  name: string;
  issuer?: string;
  date?: string;
}

export interface Resume {
  _id: string;
  title: string;
  fullName: string;
  email: string;
  phone?: string;
  summary?: string;
  education: EducationEntry[];
  skills: string[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  achievements: string[];
  languages: string[];
}

export type ResumeInput = Omit<Resume, '_id'>;

export async function getMyResumes(): Promise<Resume[]> {
  const response = await apiClient.get<Resume[]>('/resumes');
  return response.data;
}

export async function getResume(id: string): Promise<Resume> {
  const response = await apiClient.get<Resume>(`/resumes/${id}`);
  return response.data;
}

export async function createResume(data: Partial<ResumeInput>): Promise<Resume> {
  const response = await apiClient.post<Resume>('/resumes', data);
  return response.data;
}

export async function updateResume(id: string, data: Partial<ResumeInput>): Promise<Resume> {
  const response = await apiClient.patch<Resume>(`/resumes/${id}`, data);
  return response.data;
}

export async function deleteResume(id: string): Promise<void> {
  await apiClient.delete(`/resumes/${id}`);
}

export async function duplicateResume(id: string): Promise<Resume> {
  const response = await apiClient.post<Resume>(`/resumes/${id}/duplicate`);
  return response.data;
}