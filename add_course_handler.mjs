import fs from 'fs';

const filePath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/pages/AdminPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Ensure useCreateCourse is imported if not already there
if (!content.includes('useCreateCourse')) {
  content = content.replace(
    /import { useCreateCategory, useInviteUser, useCreateAchievement, useCreateLesson } from '\.\.\/hooks\/use-admin-mutations';/,
    `import { useCreateCategory, useInviteUser, useCreateAchievement, useCreateLesson, useCreateCourse } from '../hooks/use-admin-mutations';`
  );
}

// Add createCourse hook instantiation
if (!content.includes('const createCourse = useCreateCourse();')) {
  content = content.replace(
    /const createLesson = useCreateLesson\(\);/,
    `const createLesson = useCreateLesson();
  const createCourse = useCreateCourse();`
  );
}

// Add handleCourseSubmit method
if (!content.includes('const handleCourseSubmit = () => {')) {
  content = content.replace(
    /const handleLessonSubmit = \(e: React.FormEvent<HTMLFormElement>\) => {/,
    `const handleCourseSubmit = () => {
    const title = (document.getElementById('ed-title') as HTMLInputElement)?.value;
    const slug = (document.getElementById('ed-slug') as HTMLInputElement)?.value;
    const description = (document.getElementById('ed-desc') as HTMLTextAreaElement)?.value;
    const level = (document.getElementById('ed-level') as HTMLSelectElement)?.value;
    const xp = (document.getElementById('ed-xp') as HTMLInputElement)?.value;
    
    if (!title) {
      alert('Vui lòng nhập tiêu đề khoá học!');
      return;
    }

    createCourse.mutate({
      title,
      slug,
      description,
      difficulty_level: level,
      xp_on_complete: xp,
      category: 'tuDuy'
    }, {
      onSuccess: () => {
        alert('Đã tạo/lưu khoá học thành công!');
        (document.getElementById('ed-title') as HTMLInputElement).value = '';
      },
      onError: (err) => alert('Lỗi: ' + err.message)
    });
  };

  const handleLessonSubmit = (e: React.FormEvent<HTMLFormElement>) => {`
  );
}

// Wire up the course save buttons
content = content.replace(
  /<button className="btn-pri" style={{ justifyContent: 'center', height: '40px', fontSize: '13\.5px' }} >💾 Lưu nháp<\/button>/g,
  '<button className="btn-pri" type="button" onClick={handleCourseSubmit} style={{ justifyContent: "center", height: "40px", fontSize: "13.5px" }}>💾 Lưu nháp</button>'
);

content = content.replace(
  /<button className="btn-pri" style={{ justifyContent: 'center', height: '40px', fontSize: '13\.5px', background: 'linear-gradient\(135deg,var\(--teal\),var\(--teal-d\)\)' }} >🚀 Publish ngay<\/button>/g,
  '<button className="btn-pri" type="button" onClick={handleCourseSubmit} style={{ justifyContent: "center", height: "40px", fontSize: "13.5px", background: "linear-gradient(135deg,var(--teal),var(--teal-d))" }}>🚀 Publish ngay</button>'
);

fs.writeFileSync(filePath, content);
console.log('Course handlers added');
