import { useQuery } from '@tanstack/react-query';
import { academyService } from '../services/academy.service';

export const useLearnerDashboard = () => {
  return useQuery({
    queryKey: ['learnerDashboard'],
    queryFn: academyService.getDashboard,
  });
};

export const useAcademyCourses = () => {
  return useQuery({
    queryKey: ['academyCourses'],
    queryFn: academyService.getCourses,
  });
};

export const useCourseDetail = (slug: string) => {
  return useQuery({
    queryKey: ['courseDetail', slug],
    queryFn: () => academyService.getCourseDetail(slug),
  });
};

export const useLessonContent = (id: string) => {
  return useQuery({
    queryKey: ['lessonContent', id],
    queryFn: () => academyService.getLessonContent(id),
  });
};

export const useGamification = () => {
  return useQuery({
    queryKey: ['gamification'],
    queryFn: academyService.getGamification,
  });
};
