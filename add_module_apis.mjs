import fs from 'fs';

const backendControllerPath = 'e:/HỌC DATA WITH NHILE/Academy/academy-backend/src/controllers/admin.controller.ts';
let beContent = fs.readFileSync(backendControllerPath, 'utf-8');

const additionalAdminEndpoints = `
export const getCourseModules = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabaseAdmin.from('modules').select('*, lessons(*)').eq('course_id', req.params.id).order('order_index');
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: 'failed_to_get_modules' });
  }
};

export const deleteModule = async (req: Request, res: Response): Promise<void> => {
  try {
    await supabaseAdmin.from('modules').delete().eq('id', req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'failed_to_delete' });
  }
};

export const deleteLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    await supabaseAdmin.from('lessons').delete().eq('id', req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'failed_to_delete' });
  }
};
`;
beContent = beContent + additionalAdminEndpoints;
fs.writeFileSync(backendControllerPath, beContent);

const backendRoutesPath = 'e:/HỌC DATA WITH NHILE/Academy/academy-backend/src/routes/admin.routes.ts';
let routeContent = fs.readFileSync(backendRoutesPath, 'utf-8');
routeContent = routeContent.replace(
  /import { getAdminDashboardStats(.*?) } from '\.\.\/controllers\/admin\.controller';/,
  `import { getAdminDashboardStats$1, getCourseModules, deleteModule, deleteLesson } from '../controllers/admin.controller';`
);
const routeDefinitions = `
router.get('/courses/:id/modules', getCourseModules);
router.delete('/modules/:id', deleteModule);
router.delete('/lessons/:id', deleteLesson);
`;
routeContent = routeContent + routeDefinitions;
fs.writeFileSync(backendRoutesPath, routeContent);

const frontendHooksPath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/hooks/use-admin-mutations.ts';
let hookContent = fs.readFileSync(frontendHooksPath, 'utf-8');
hookContent += `
export const useDeleteModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(\`/v1/admin/modules/\${id}\`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminCourseModules'] }),
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(\`/v1/admin/lessons/\${id}\`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminCourseModules'] }),
  });
};
`;
fs.writeFileSync(frontendHooksPath, hookContent);

const frontendQueriesPath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/hooks/use-admin.ts';
let qContent = fs.readFileSync(frontendQueriesPath, 'utf-8');
qContent += `
export const useAdminCourseModules = (courseId: string | null) => {
  return useQuery({
    queryKey: ['adminCourseModules', courseId],
    queryFn: () => apiClient.get<any[]>(\`/v1/admin/courses/\${courseId}/modules\`),
    enabled: !!courseId
  });
};
`;
fs.writeFileSync(frontendQueriesPath, qContent);

console.log('Backend and frontend hooks updated for Modules and Lessons');
