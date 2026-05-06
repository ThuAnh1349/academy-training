const fs = require('fs');
const filePath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/pages/AdminPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add states
content = content.replace(
  /const \[activeTab, setActiveTab\] = useState\('s-dash'\);/,
  \`const [activeTab, setActiveTab] = useState('s-dash');

  // Modal states
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isCatDeleteModalOpen, setCatDeleteModalOpen] = useState(false);
  const [isQuickCatModalOpen, setQuickCatModalOpen] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isAchModalOpen, setAchModalOpen] = useState(false);
  const [isLessonModalOpen, setLessonModalOpen] = useState(false);
  
  // Handlers
  const openModal = (setter) => setter(true);
  const closeModal = (setter) => setter(false);\`
);

// 2. Add handlers to open modals
content = content.replace(
  /<button className="btn-pri" >\+ Thêm danh mục<\/button>/g,
  '<button className="btn-pri" onClick={() => openModal(setCategoryModalOpen)}>+ Thêm danh mục</button>'
);
content = content.replace(
  /<button className="btn-pri" >\+ Mời học viên<\/button>/g,
  '<button className="btn-pri" onClick={() => openModal(setInviteModalOpen)}>+ Mời học viên</button>'
);
content = content.replace(
  /<button className="sec-action btn-pri" >\+ Thêm thành tích<\/button>/g,
  '<button className="sec-action btn-pri" onClick={() => openModal(setAchModalOpen)}>+ Thêm thành tích</button>'
);
content = content.replace(
  /<div className="gam-card" style={{ border: '2px dashed var\(--border\)', boxShadow: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '150px' }} >/g,
  '<div className="gam-card" style={{ border: "2px dashed var(--border)", boxShadow: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", minHeight: "150px" }} onClick={() => openModal(setAchModalOpen)}>'
);
content = content.replace(
  /<span style={{ color: 'var\(--ink-light\)', fontSize: '12px', fontWeight: '800', width: '100%', textAlign: 'center' }}>\+ Thêm bài học<\/span>\s*<\/div>/g,
  \`<span style={{ color: 'var(--ink-light)', fontSize: '12px', fontWeight: '800', width: '100%', textAlign: 'center' }} onClick={() => openModal(setLessonModalOpen)}>+ Thêm bài học</span>
                    </div>\`
);
content = content.replace(
  /<button type="button" className="btn-pri" id="editor-add-cat-btn"[\s\S]*?title="Thêm danh mục mới">\+ Danh mục<\/button>/g,
  '<button type="button" className="btn-pri" id="editor-add-cat-btn" style={{ height: "40px", padding: "0 12px", whiteSpace: "nowrap", flexShrink: "0", fontSize: "12px" }} title="Thêm danh mục mới" onClick={() => openModal(setQuickCatModalOpen)}>+ Danh mục</button>'
);

// 3. Wrap Modals
const modals = [
  { startComment: '{/*  Modal: Add/Edit Category  */}', endComment: '{/*  Modal: Confirm Delete Category  */}', state: 'isCategoryModalOpen', setter: 'setCategoryModalOpen' },
  { startComment: '{/*  Modal: Confirm Delete Category  */}', endComment: '{/*  Modal: Quick Add Category (from Editor)  */}', state: 'isCatDeleteModalOpen', setter: 'setCatDeleteModalOpen' },
  { startComment: '{/*  Modal: Quick Add Category (from Editor)  */}', endComment: '{/*  Modals  */}', state: 'isQuickCatModalOpen', setter: 'setQuickCatModalOpen' },
  { startComment: '{/*  Invite User Modal  */}', endComment: '{/*  Achievement Modal  */}', state: 'isInviteModalOpen', setter: 'setInviteModalOpen' },
  { startComment: '{/*  Achievement Modal  */}', endComment: '{/*  Lesson Modal  */}', state: 'isAchModalOpen', setter: 'setAchModalOpen' },
  { startComment: '{/*  Lesson Modal  */}', endComment: '</div>\\n    </div>\\n  );', state: 'isLessonModalOpen', setter: 'setLessonModalOpen' },
];

for (const modal of modals) {
  const startIndex = content.indexOf(modal.startComment);
  const endIndex = content.indexOf(modal.endComment);
  
  if (startIndex !== -1 && endIndex !== -1) {
    let modalContent = content.substring(startIndex + modal.startComment.length, endIndex);
    
    // Add onClick to modal close buttons inside this content
    modalContent = modalContent.replace(/<button className="modal-close" >✕<\/button>/g, \`<button className="modal-close" onClick={() => closeModal(\${modal.setter})}>✕</button>\`);
    modalContent = modalContent.replace(/<button className="btn-sec" >Hủy<\/button>/g, \`<button className="btn-sec" onClick={() => closeModal(\${modal.setter})}>Hủy</button>\`);
    
    // Wrap with conditional
    modalContent = \`\\n{\${modal.state} && (\` + modalContent.trimRight() + \`\\n)}\\n\`;
    
    content = content.substring(0, startIndex + modal.startComment.length) + modalContent + content.substring(endIndex);
  }
}

// Add simple alert to some action buttons
content = content.replace(/<button className="t-action-btn" >✏️<\/button>/g, '<button className="t-action-btn" onClick={() => alert("Chức năng đang phát triển")}>✏️</button>');
content = content.replace(/<button className="t-action-btn danger" >🗑️<\/button>/g, '<button className="t-action-btn danger" onClick={() => alert("Chức năng đang phát triển")}>🗑️</button>');
content = content.replace(/<button className="btn-sec" >⬇ Xuất CSV<\/button>/g, '<button className="btn-sec" onClick={() => alert("Đang xuất CSV...")}>⬇ Xuất CSV</button>');

fs.writeFileSync(filePath, content);
console.log('Done replacement');
