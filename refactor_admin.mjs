import fs from 'fs';

const filePath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/pages/AdminPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Ensure hooks are imported
if (!content.includes('useAdminCourses')) {
  content = content.replace(
    /import { useAdminDashboardStats, useAdminUsersList } from '\.\.\/hooks\/use-admin';/,
    `import { useAdminDashboardStats, useAdminUsersList, useAdminCourses, useAdminCategories, useAdminAchievements } from '../hooks/use-admin';`
  );
}

// 2. Initialize hooks in the component
if (!content.includes('const { data: courses }')) {
  content = content.replace(
    /const { data: users, isLoading: loadingUsers } = useAdminUsersList\(\);/,
    `const { data: users, isLoading: loadingUsers } = useAdminUsersList();
  const { data: courses, isLoading: loadingCourses } = useAdminCourses();
  const { data: categories, isLoading: loadingCategories } = useAdminCategories();
  const { data: achievements, isLoading: loadingAchievements } = useAdminAchievements();`
  );
}

// 3. Fix modal overlays display
content = content.replace(/className="modal-overlay"/g, 'className="modal-overlay" style={{ display: "flex" }}');

// 4. Make sure NO input has value="" without onChange. We already did defaultValue, but just in case:
content = content.replace(/<input([^>]*?)value=/g, '<input$1defaultValue=');

// 5. Replace Courses tbody
const coursesTbodyRegex = /<tbody id="courses-tbody">[\s\S]*?<\/tbody>/;
const dynamicCoursesTbody = `<tbody id="courses-tbody">
  {courses?.map((course: any) => (
    <tr key={course.id}>
      <td><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#0A2E24,#0F3D30)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{course.thumbnail_emoji || '📚'}</div><div><div className="t-uname">{course.title}</div><div className="t-email">{course.difficulty_level} · {course.total_duration_minutes}m</div></div></div></td>
      <td><span className="t-tag" style={{ background: 'var(--teal-l)', color: 'var(--teal-d)' }}>{course.category}</span></td>
      <td><span className={"t-tag " + (course.is_published ? "pub" : "draft")}>{course.is_published ? "✓ Published" : "📝 Draft"}</span></td>
      <td style={{ fontSize: '13px', fontWeight: '800' }}>{course.total_lessons || 0} bài</td>
      <td style={{ fontSize: '13px', fontWeight: '800' }}>0</td>
      <td><span className="t-prog-txt" style={{ color: 'var(--green)' }}>0%</span></td>
      <td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--gold)' }}>★ {course.avg_rating || '5.0'}</td>
      <td><span className={"t-tag " + (course.is_offline_available ? "pub" : "")}>{course.is_offline_available ? "✓" : "✕"}</span></td>
      <td><div className="t-actions"><button className="t-action-btn">✏️</button><button className="t-action-btn danger">🗑️</button></div></td>
    </tr>
  ))}
</tbody>`;
content = content.replace(coursesTbodyRegex, dynamicCoursesTbody);

// 6. Replace Achievements gam-grid
const gamGridRegex = /<div className="gam-grid">[\s\S]*?<div className="cert-list">/;
const dynamicGamGrid = `<div className="gam-grid">
  {achievements?.map((ach: any) => (
    <div className="gam-card" key={ach.id}>
      <div className="gam-icon">{ach.icon_emoji}</div>
      <div className="gam-title">{ach.title}</div>
      <div className="gam-desc">{ach.description}</div>
      <div className="gam-condition">{ach.key}</div>
      <div className="gam-xp"><span className="gam-xp-val">+{ach.xp_reward} XP</span><button className="gam-edit">Chỉnh sửa</button></div>
    </div>
  ))}
</div>
<div className="cert-list">`;
content = content.replace(gamGridRegex, dynamicGamGrid);

fs.writeFileSync(filePath, content);
console.log('Refactored AdminPage with dynamic data and fixed modals');
