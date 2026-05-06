import fs from 'fs';

const filePath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/pages/AdminPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Imports
if (!content.includes('useAdminCourseModules')) {
  content = content.replace(
    /useAdminAchievements } from '\.\.\/hooks\/use-admin';/,
    `useAdminAchievements, useAdminCourseModules } from '../hooks/use-admin';`
  );
}
if (!content.includes('useDeleteModule')) {
  content = content.replace(
    /useUpdateLesson } from '\.\.\/hooks\/use-admin-mutations';/,
    `useUpdateLesson, useDeleteModule, useDeleteLesson } from '../hooks/use-admin-mutations';`
  );
}

// 2. Add active course state and hooks
content = content.replace(
  /const \[activeTab, setActiveTab\] = useState\('s-dash'\);/,
  `const [activeTab, setActiveTab] = useState('s-dash');\n  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);`
);

if (!content.includes('const deleteModule = useDeleteModule();')) {
  content = content.replace(
    /const updateLesson = useUpdateLesson\(\);/,
    `const updateLesson = useUpdateLesson();
  const deleteModule = useDeleteModule();
  const deleteLesson = useDeleteLesson();`
  );
}

if (!content.includes('const { data: courseModules }')) {
  content = content.replace(
    /const { data: achievements, isLoading: loadingAchievements } = useAdminAchievements\(\);/,
    `const { data: achievements, isLoading: loadingAchievements } = useAdminAchievements();
  const { data: courseModules, isLoading: loadingModules } = useAdminCourseModules(activeCourseId);`
  );
}

// 3. Update Course Editor tab to show dynamic modules
const modListRegex = /<div className="mod-list">[\s\S]*?<button className="add-mod-btn" type="button" onClick=\{[\s\S]*?\}>➕ Thêm module<\/button>/;

const dynamicModList = `
<div className="mod-list">
  {activeCourseId ? (
    courseModules?.map((mod: any) => (
      <div className="mod-item" style={{ flexDirection: 'column', alignItems: 'stretch' }} key={mod.id}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="mod-drag">⣿</span>
          <span className="mod-title">{mod.title}</span>
          <span className="mod-meta">{mod.lessons?.length || 0} bài học</span>
          <div className="mod-item-actions" style={{ marginLeft: 'auto' }}>
            <button className="t-action-btn" onClick={() => {
              const newTitle = prompt('Đổi tên module:', mod.title);
              if (newTitle) updateModule.mutate({ id: mod.id, payload: { title: newTitle } });
            }}>✏️</button>
            <button className="t-action-btn danger" onClick={() => {
              if(confirm('Bạn có chắc xoá module này?')) deleteModule.mutate(mod.id);
            }}>🗑️</button>
          </div>
        </div>
        <div className="mod-lesson-list" style={{ width: '100%' }}>
          {mod.lessons?.map((les: any) => (
            <div className="mod-lesson-item" key={les.id}>
              <span className="ml-icon">{les.lesson_type === 'quiz' ? '📝' : '🛠️'}</span>
              <span className="ml-title">{les.title}</span>
              <span className="ml-type tag-gold">{les.lesson_type}</span>
              <span className="ml-xp">+{les.xp_on_complete} XP</span>
              <button className="t-action-btn" style={{ marginLeft: '8px' }} onClick={() => {
                const newTitle = prompt('Đổi tên bài học/quiz:', les.title);
                if (newTitle) updateLesson.mutate({ id: les.id, payload: { title: newTitle } });
              }}>✏️</button>
              <button className="t-action-btn danger" style={{ marginLeft: '4px' }} onClick={() => {
                if(confirm('Bạn có chắc xoá bài học này?')) deleteLesson.mutate(les.id);
              }}>🗑️</button>
            </div>
          ))}
          <div className="mod-lesson-item" style={{ border: '1.5px dashed var(--border)', cursor: 'pointer' }} >
            <span style={{ color: 'var(--ink-light)', fontSize: '12px', fontWeight: '800', width: '100%', textAlign: 'center' }} onClick={() => {
              // Hack to pass module_id to the modal
              (document.getElementById('lesson-module-id') as HTMLInputElement).value = mod.id;
              openModal(setLessonModalOpen);
            }}>+ Thêm bài học/quiz</span>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--ink-light)', fontSize: '12px' }}>
      Vui lòng lưu khoá học (hoặc chọn ✏️ sửa khóa học từ bảng) trước khi thêm module.
    </div>
  )}
</div>
<button className="add-mod-btn" type="button" onClick={() => {
  if (!activeCourseId) {
    alert('Vui lòng lưu khoá học trước khi thêm module!');
    return;
  }
  const title = prompt('Tên module mới:');
  if (title) {
    createModule.mutate({ course_id: activeCourseId, title }, {
      onSuccess: () => alert('Đã thêm module!'),
      onError: () => alert('Lỗi khi thêm module')
    });
  }
}}>➕ Thêm module</button>
`;

content = content.replace(modListRegex, dynamicModList);

// 4. Bind the ✏️ Edit Course button in the table to set activeCourseId and go to editor
content = content.replace(
  /onClick=\{\(\) => \{\n      const newTitle = prompt\('Nhập tên mới cho khoá học:', course\.title\);\n      if \(newTitle && newTitle !== course\.title\) \{\n        updateCourse\.mutate\(\{ id: course\.id, payload: \{ title: newTitle \} \}, \{\n          onSuccess: \(\) => alert\('Đã cập nhật khoá học!'\),\n          onError: \(\) => alert\('Lỗi khi cập nhật'\)\n        \}\);\n      \}\n    \}\}/g,
  `onClick={() => {
    setActiveCourseId(course.id);
    // Populate form
    setTimeout(() => {
      (document.getElementById('ed-title') as HTMLInputElement).value = course.title || '';
      (document.getElementById('ed-slug') as HTMLInputElement).value = course.slug || '';
      (document.getElementById('ed-desc') as HTMLTextAreaElement).value = course.description || '';
      (document.getElementById('ed-course-key') as HTMLInputElement).value = course.id;
    }, 100);
    goTo('s-editor');
  }} title="Chỉnh sửa chi tiết khóa học"`
);

// 5. Lesson Modal: add hidden input for module_id
content = content.replace(
  /<input type="hidden" name="course_id" value="[a-zA-Z0-9-]*" \/>/,
  `<input type="hidden" name="module_id" id="lesson-module-id" />
   <input type="hidden" name="course_id" value={activeCourseId || ''} />`
);

fs.writeFileSync(filePath, content);
console.log('AdminPage updated to support dynamic modules and lessons');
