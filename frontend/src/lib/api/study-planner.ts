import { apiClient } from '@/lib/api-client';

export interface DailyTask {
  day: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  priority: string;
}

export interface StudyPlan {
  _id: string;
  availableHoursPerDay: number;
  weakTopics: string[];
  dailySchedule: DailyTask[];
  priorityTopics: string[];
  summary: string;
  createdAt: string;
}

export async function generateStudyPlan(data: {
  departmentId: string;
  semester: number;
  availableHoursPerDay: number;
  weakTopics: string[];
}): Promise<StudyPlan> {
  const response = await apiClient.post<StudyPlan>('/ai/study-plan', data);
  return response.data;
}

export async function getMyStudyPlans(): Promise<StudyPlan[]> {
  const response = await apiClient.get<StudyPlan[]>('/ai/study-plans');
  return response.data;
}