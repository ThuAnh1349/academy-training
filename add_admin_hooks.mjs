import fs from 'fs';

const filePath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/hooks/use-admin-mutations.ts';
let content = fs.readFileSync(filePath, 'utf-8');

const additionalMutations = `
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { key: string, payload: any }) => apiClient.patch(\`/v1/admin/categories/\${data.key}\`, data.payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminCategories'] }),
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string, payload: any }) => apiClient.patch(\`/v1/admin/courses/\${data.id}\`, data.payload),
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminCourses'] }),
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string, payload: any }) => apiClient.patch(\`/v1/admin/modules/\${data.id}\`, data.payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminCourses'] }),
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string, payload: any }) => apiClient.patch(\`/v1/admin/lessons/\${data.id}\`, data.payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminLessons'] }),
  });
};
`;

content = content + additionalMutations;

fs.writeFileSync(filePath, content);
console.log('Added UPDATE and MODULE mutations');
