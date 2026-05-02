import axios from 'axios';
import type { LearnerDashboard, CourseBrief, CourseDetailWithProgress, LessonContent, GamificationState } from '../types/academy.types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.nquoc.vn';

const apiClient = axios.create({
  baseURL: `${API_BASE}/api/v1/academy`,
});

export const academyService = {
  getDashboard: async (): Promise<LearnerDashboard> => {
    const response = await apiClient.get('/learn/dashboard');
    return response.data;
  },
  getCourses: async (): Promise<CourseBrief[]> => {
    const response = await apiClient.get('/learn/courses');
    return response.data.data;
  },
  getCourseDetail: async (slug: string): Promise<CourseDetailWithProgress> => {
    const response = await apiClient.get(`/learn/courses/${slug}`);
    return response.data;
  },
  getLessonContent: async (id: string): Promise<LessonContent> => {
    const response = await apiClient.get(`/learn/lessons/${id}`);
    return response.data;
  },
  getGamification: async (): Promise<GamificationState> => {
    const response = await apiClient.get('/learn/gamification');
    return response.data;
  }
};
