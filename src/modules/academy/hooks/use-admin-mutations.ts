import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../services/api-client';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newCategory: any) => apiClient.post('/v1/admin/categories', newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
    },
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseData: any) => apiClient.post('/v1/admin/courses', courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
    },
  });
};

export const useInviteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteData: any) => apiClient.post('/v1/admin/users/invite', inviteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsersList'] });
    },
  });
};

export const useCreateAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (achData: any) => apiClient.post('/v1/admin/achievements', achData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAchievements'] });
    },
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonData: any) => apiClient.post('/v1/admin/lessons', lessonData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCourseModules'] });
    },
  });
};

export const useIssueCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { userId: string, certId: string }) => apiClient.post('/v1/admin/certificates/issue', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCertificates'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { key: string, payload: any }) => apiClient.patch(`/v1/admin/categories/${data.key}`, data.payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminCategories'] }),
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string, payload: any }) => apiClient.patch(`/v1/admin/courses/${data.id}`, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
    },
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (moduleData: any) => apiClient.post('/v1/admin/modules', moduleData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminCourseModules'] }),
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string, payload: any }) => apiClient.patch(`/v1/admin/modules/${data.id}`, data.payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminCourseModules'] }),
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string, payload: any }) => apiClient.patch(`/v1/admin/lessons/${data.id}`, data.payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminCourseModules'] }),
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/v1/admin/modules/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminCourseModules'] }),
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/v1/admin/lessons/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminCourseModules'] }),
  });
};
