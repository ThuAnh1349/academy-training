import fs from 'fs';

const filePath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/pages/AdminPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Ensure we have useMutation hooks imported
if (!content.includes('useCreateCategory')) {
  content = content.replace(
    /import { useAdminDashboardStats, useAdminUsersList } from '\.\.\/hooks\/use-admin';/,
    `import { useAdminDashboardStats, useAdminUsersList } from '../hooks/use-admin';
import { useCreateCategory, useInviteUser, useCreateAchievement, useCreateLesson } from '../hooks/use-admin-mutations';`
  );
}

// Add mutation definitions inside component
if (!content.includes('const createCategory = useCreateCategory()')) {
  content = content.replace(
    /const \[activeTab, setActiveTab\] = useState\('s-dash'\);/,
    `const [activeTab, setActiveTab] = useState('s-dash');
  
  // Mutations
  const createCategory = useCreateCategory();
  const inviteUser = useInviteUser();
  const createAch = useCreateAchievement();
  const createLesson = useCreateLesson();

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    createCategory.mutate(data, {
      onSuccess: () => {
        alert('Đã thêm danh mục!');
        closeModal(setCategoryModalOpen);
      },
      onError: (err) => alert('Lỗi: ' + err.message)
    });
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    inviteUser.mutate(data, {
      onSuccess: () => {
        alert('Đã gửi lời mời!');
        closeModal(setInviteModalOpen);
      },
      onError: (err) => alert('Lỗi: ' + err.message)
    });
  };

  const handleAchSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    createAch.mutate(data, {
      onSuccess: () => {
        alert('Đã thêm thành tích!');
        closeModal(setAchModalOpen);
      },
      onError: (err) => alert('Lỗi: ' + err.message)
    });
  };

  const handleLessonSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    createLesson.mutate(data, {
      onSuccess: () => {
        alert('Đã thêm bài học!');
        closeModal(setLessonModalOpen);
      },
      onError: (err) => alert('Lỗi: ' + err.message)
    });
  };
`
  );
}

// Add names to inputs so FormData works
content = content.replace(/id="cat-name-input" placeholder="VD: Lãnh đạo"/g, 'name="name" id="cat-name-input" placeholder="VD: Lãnh đạo"');
content = content.replace(/id="cat-key-input" placeholder="VD: lanhDao"/g, 'name="key" id="cat-key-input" placeholder="VD: lanhDao"');
content = content.replace(/id="cat-desc-input"/g, 'name="description" id="cat-desc-input"');
content = content.replace(/id="cat-emoji-input"/g, 'name="emoji" id="cat-emoji-input"');

content = content.replace(/type="email" placeholder="hocvien@email.com"/g, 'name="email" type="email" placeholder="hocvien@email.com"');
content = content.replace(/<select className="form-select">\s*<option>Community \(mặc định\)<\/option>\s*<option>Internal/g, '<select name="user_type" className="form-select">\n        <option value="community">Community (mặc định)</option>\n        <option value="internal">Internal');

// Change save buttons to type="submit"
content = content.replace(/<button className="btn-pri" >💾 Lưu danh mục<\/button>/g, '<button className="btn-pri" type="submit">💾 Lưu danh mục</button>');
content = content.replace(/<button className="btn-pri" >📨 Gửi lời mời<\/button>/g, '<button className="btn-pri" type="submit">📨 Gửi lời mời</button>');
content = content.replace(/<button className="btn-pri" >💾 Lưu<\/button>/g, '<button className="btn-pri" type="submit">💾 Lưu</button>');
content = content.replace(/<button className="btn-pri" >✓ Thêm bài học<\/button>/g, '<button className="btn-pri" type="submit">✓ Thêm bài học</button>');

// Wrap modal contents in <form onSubmit={...}>
// Modal Category
content = content.replace(
  /<div className="modal-hd">\s*<h3 id="modal-cat-title">➕ Thêm danh mục mới<\/h3>/g,
  '<form onSubmit={handleCategorySubmit}>\n    <div className="modal-hd">\n      <h3 id="modal-cat-title">➕ Thêm danh mục mới</h3>'
);
content = content.replace(
  /<button className="btn-pri" type="submit">💾 Lưu danh mục<\/button>\s*<\/div>\s*<\/div>\s*<\/div>/g,
  '<button className="btn-pri" type="submit">💾 Lưu danh mục</button>\n    </div>\n    </form>\n  </div>\n</div>'
);

// Modal Invite
content = content.replace(
  /<div className="modal-hd">\s*<h3>📨 Mời học viên mới<\/h3>/g,
  '<form onSubmit={handleInviteSubmit}>\n    <div className="modal-hd">\n      <h3>📨 Mời học viên mới</h3>'
);
content = content.replace(
  /<button className="btn-pri" type="submit">📨 Gửi lời mời<\/button>\s*<\/div>\s*<\/div>\s*<\/div>/g,
  '<button className="btn-pri" type="submit">📨 Gửi lời mời</button>\n    </div>\n    </form>\n  </div>\n</div>'
);

// Modal Achievement
content = content.replace(
  /<div className="modal-hd">\s*<h3>🏆 Cấu hình thành tích<\/h3>/g,
  '<form onSubmit={handleAchSubmit}>\n    <div className="modal-hd">\n      <h3>🏆 Cấu hình thành tích</h3>'
);
content = content.replace(
  /<button className="btn-pri" type="submit">💾 Lưu<\/button>\s*<\/div>\s*<\/div>\s*<\/div>/g,
  '<button className="btn-pri" type="submit">💾 Lưu</button>\n    </div>\n    </form>\n  </div>\n</div>'
);

// We need to fix the lesson modal to show using state
content = content.replace(
  /<div className="modal-overlay" id="modal-lesson">/g,
  '{isLessonModalOpen && (\n<div className="modal-overlay" id="modal-lesson">'
);
content = content.replace(
  /<h3>📖 Thêm bài học<\/h3>\s*<button className="modal-close" >✕<\/button>/g,
  '<h3>📖 Thêm bài học</h3>\n      <button className="modal-close" onClick={() => closeModal(setLessonModalOpen)}>✕</button>'
);
content = content.replace(
  /<button className="btn-sec" >Hủy<\/button>/g,
  '<button type="button" className="btn-sec" onClick={() => closeModal(setLessonModalOpen)}>Hủy</button>'
);

// It seems there are multiple modal-close buttons. The earlier ones were handled by replace_modals.mjs.
// We must be careful not to rewrite ones already rewritten.
// Let's just do a blanket fix for form wrapping

fs.writeFileSync(filePath, content);
console.log('AdminPage handlers enhanced');
