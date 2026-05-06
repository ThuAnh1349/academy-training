import { apiClient } from '../../../services/api-client';
import type { LearnerDashboard, CourseBrief, CourseDetailWithProgress, LessonContent, GamificationState } from '../types/academy.types';

export const academyService = {
  getDashboard: async (): Promise<LearnerDashboard> => {
    return apiClient.get<LearnerDashboard>('/v1/academy/learn/dashboard');
  },
  getCourses: async (): Promise<CourseBrief[]> => {
    return apiClient.get<CourseBrief[]>('/v1/academy/learn/courses');
  },
  getCourseDetail: async (slug: string): Promise<CourseDetailWithProgress> => {
    return apiClient.get<CourseDetailWithProgress>(`/v1/academy/learn/courses/${slug}`);
  },
  getLessonContent: async (id: string): Promise<LessonContent> => {
    return apiClient.get<LessonContent>(`/v1/academy/learn/lessons/${id}`);
  },
  getGamification: async (): Promise<GamificationState> => {
    return apiClient.get<GamificationState>('/v1/academy/learn/gamification');
  }
};
