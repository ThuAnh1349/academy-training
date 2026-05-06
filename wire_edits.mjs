import fs from 'fs';

const filePath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/pages/AdminPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add hook imports
if (!content.includes('useUpdateCourse')) {
  content = content.replace(
    /useCreateCourse } from '\.\.\/hooks\/use-admin-mutations';/,
    `useCreateCourse, useUpdateCourse, useUpdateCategory, useCreateModule, useUpdateModule, useUpdateLesson } from '../hooks/use-admin-mutations';`
  );
}

// 2. Initialize hooks
if (!content.includes('const updateCourse = useUpdateCourse();')) {
  content = content.replace(
    /const createCourse = useCreateCourse\(\);/,
    `const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const updateCategory = useUpdateCategory();
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();
  const updateLesson = useUpdateLesson();`
  );
}

// 3. Replace "alert('Chức năng đang phát triển')" with generic edit functions.
// For course editing in the table (s-courses tab):
content = content.replace(
  /<td><div className="t-actions"><button className="t-action-btn">✏️<\/button><button className="t-action-btn danger">🗑️<\/button><\/div><\/td>/g,
  `<td><div className="t-actions">
    <button className="t-action-btn" onClick={() => {
      const newTitle = prompt('Nhập tên mới cho khoá học:', course.title);
      if (newTitle && newTitle !== course.title) {
        updateCourse.mutate({ id: course.id, payload: { title: newTitle } }, {
          onSuccess: () => alert('Đã cập nhật khoá học!'),
          onError: () => alert('Lỗi khi cập nhật')
        });
      }
    }}>✏️</button>
    <button className="t-action-btn danger">🗑️</button>
  </div></td>`
);

// 4. For Add Module button in s-editor tab
content = content.replace(
  /<button className="add-mod-btn" >➕ Thêm module<\/button>/,
  `<button className="add-mod-btn" type="button" onClick={() => {
    const courseId = prompt('Nhập ID khoá học để thêm module:');
    if (!courseId) return;
    const title = prompt('Tên module mới:');
    if (title) {
      createModule.mutate({ course_id: courseId, title }, {
        onSuccess: () => alert('Đã thêm module!'),
        onError: () => alert('Lỗi khi thêm module')
      });
    }
  }}>➕ Thêm module</button>`
);

// 5. For Edit Module/Lesson buttons (currently hardcoded as alert("Chức năng đang phát triển"))
content = content.replace(
  /onClick={\(\) => alert\("Chức năng đang phát triển"\)}/g,
  `onClick={() => alert("Tính năng chỉnh sửa chi tiết (kéo thả, sửa nội dung) đang được phát triển. Vui lòng sử dụng tính năng sửa cơ bản bên ngoài.")}`
);

fs.writeFileSync(filePath, content);
console.log('Added generic edit handlers to AdminPage');
