import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../services/api-client';

export interface AdminDashboardStats {
  totalUsers: number;
  totalCourses: number;
  satisfactionRate: number;
  xpGivenToday: number;
  activeToday: number;
  completedCourses: number;
  certsIssued: number;
}

export interface AdminUser {
  id: string;
  email: string;
  display_name: string;
  user_type: string;
  total_xp: number;
  current_streak_days: number;
  last_active_date: string | null;
}

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => apiClient.get<AdminDashboardStats>('/v1/admin/dashboard-stats'),
  });
};

export const useAdminUsersList = () => {
  return useQuery({
    queryKey: ['adminUsersList'],
    queryFn: () => apiClient.get<AdminUser[]>('/v1/admin/users'),
  });
};

export const useAdminCourses = () => {
  return useQuery({
    queryKey: ['adminCourses'],
    queryFn: () => apiClient.get<any[]>('/v1/admin/courses'),
  });
};

export const useAdminCategories = () => {
  return useQuery({
    queryKey: ['adminCategories'],
    queryFn: () => apiClient.get<any[]>('/v1/admin/categories'),
  });
};

export const useAdminAchievements = () => {
  return useQuery({
    queryKey: ['adminAchievements'],
    queryFn: () => apiClient.get<any[]>('/v1/admin/achievements'),
  });
};

export const useAdminCourseModules = (courseId: string | null) => {
  return useQuery({
    queryKey: ['adminCourseModules', courseId],
    queryFn: () => apiClient.get<any[]>(`/v1/admin/courses/${courseId}/modules`),
    enabled: !!courseId
  });
};
