import fs from 'fs';

const filePath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/pages/AdminPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add states
const stateInjection = `
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingModuleTitle, setEditingModuleTitle] = useState('');
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingLessonTitle, setEditingLessonTitle] = useState('');
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{type: 'module'|'lesson', id: string, title: string} | null>(null);
`;

if (!content.includes('editingModuleId')) {
  content = content.replace(
    /const \[activeCourseId, setActiveCourseId\] = useState<string \| null>\(null\);\n  const \[activeModuleId, setActiveModuleId\] = useState<string \| null>\(null\);/,
    `const [activeCourseId, setActiveCourseId] = useState<string | null>(null);\n  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);${stateInjection}`
  );
}

// 2. Replace the mod-list and add-mod-btn block
const modListRegex = /<div className="mod-list">[\s\S]*?<button className="add-mod-btn" type="button" onClick=\{[\s\S]*?\}>➕ Thêm module<\/button>/;

const newModList = `
<div className="mod-list">
  {activeCourseId ? (
    courseModules?.map((mod: any) => (
      <div className="mod-item" style={{ flexDirection: 'column', alignItems: 'stretch' }} key={mod.id}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="mod-drag">⣿</span>
          {editingModuleId === mod.id ? (
            <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
              <input 
                autoFocus
                className="form-input" 
                style={{ padding: '4px 8px', minHeight: 'auto', fontSize: '13px' }} 
                value={editingModuleTitle} 
                onChange={(e) => setEditingModuleTitle(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && editingModuleTitle.trim()) {
                    updateModule.mutate({ id: mod.id, payload: { title: editingModuleTitle } }, { onSuccess: () => setEditingModuleId(null) });
                  } else if (e.key === 'Escape') {
                    setEditingModuleId(null);
                  }
                }}
              />
              <button className="btn-pri" style={{ padding: '0 10px', height: '28px', fontSize: '12px' }} onClick={() => {
                if (editingModuleTitle.trim()) updateModule.mutate({ id: mod.id, payload: { title: editingModuleTitle } }, { onSuccess: () => setEditingModuleId(null) });
              }}>Lưu</button>
              <button className="btn-sec" style={{ padding: '0 10px', height: '28px', fontSize: '12px' }} onClick={() => setEditingModuleId(null)}>Hủy</button>
            </div>
          ) : (
            <>
              <span className="mod-title">{mod.title}</span>
              <span className="mod-meta">{mod.lessons?.length || 0} bài học</span>
              <div className="mod-item-actions" style={{ marginLeft: 'auto' }}>
                <button className="t-action-btn" onClick={() => {
                  setEditingModuleTitle(mod.title);
                  setEditingModuleId(mod.id);
                }}>✏️</button>
                <button className="t-action-btn danger" onClick={() => {
                  setConfirmDelete({ type: 'module', id: mod.id, title: mod.title });
                }}>🗑️</button>
              </div>
            </>
          )}
        </div>
        <div className="mod-lesson-list" style={{ width: '100%' }}>
          {mod.lessons?.map((les: any) => (
            <div className="mod-lesson-item" key={les.id}>
              <span className="ml-icon">{les.lesson_type === 'quiz' ? '📝' : '🛠️'}</span>
              
              {editingLessonId === les.id ? (
                <div style={{ display: 'flex', gap: '6px', flex: 1, alignItems: 'center' }}>
                  <input 
                    autoFocus
                    className="form-input" 
                    style={{ padding: '2px 6px', minHeight: 'auto', fontSize: '12px' }} 
                    value={editingLessonTitle} 
                    onChange={(e) => setEditingLessonTitle(e.target.value)} 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && editingLessonTitle.trim()) {
                        updateLesson.mutate({ id: les.id, payload: { title: editingLessonTitle } }, { onSuccess: () => setEditingLessonId(null) });
                      } else if (e.key === 'Escape') {
                        setEditingLessonId(null);
                      }
                    }}
                  />
                  <button className="btn-pri" style={{ padding: '0 8px', height: '24px', fontSize: '11px' }} onClick={() => {
                    if (editingLessonTitle.trim()) updateLesson.mutate({ id: les.id, payload: { title: editingLessonTitle } }, { onSuccess: () => setEditingLessonId(null) });
                  }}>Lưu</button>
                  <button className="btn-sec" style={{ padding: '0 8px', height: '24px', fontSize: '11px' }} onClick={() => setEditingLessonId(null)}>Hủy</button>
                </div>
              ) : (
                <>
                  <span className="ml-title">{les.title}</span>
                  <span className="ml-type tag-gold">{les.lesson_type}</span>
                  <span className="ml-xp">+{les.xp_on_complete} XP</span>
                  <button className="t-action-btn" style={{ marginLeft: '8px' }} onClick={() => {
                    setEditingLessonTitle(les.title);
                    setEditingLessonId(les.id);
                  }}>✏️</button>
                  <button className="t-action-btn danger" style={{ marginLeft: '4px' }} onClick={() => {
                    setConfirmDelete({ type: 'lesson', id: les.id, title: les.title });
                  }}>🗑️</button>
                </>
              )}
            </div>
          ))}
          <div className="mod-lesson-item" style={{ border: '1.5px dashed var(--border)', cursor: 'pointer', background: 'transparent' }} >
            <span style={{ color: 'var(--ink-light)', fontSize: '12px', fontWeight: '800', width: '100%', textAlign: 'center' }} onClick={() => {
              setActiveModuleId(mod.id);
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

  {isAddingModule && activeCourseId && (
    <div className="mod-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={{ display: 'flex', gap: '8px', padding: '10px' }}>
        <input 
          autoFocus
          className="form-input" 
          placeholder="Nhập tên module mới..."
          value={newModuleTitle} 
          onChange={(e) => setNewModuleTitle(e.target.value)} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newModuleTitle.trim()) {
              createModule.mutate({ course_id: activeCourseId, title: newModuleTitle }, { 
                onSuccess: () => { setIsAddingModule(false); setNewModuleTitle(''); } 
              });
            } else if (e.key === 'Escape') {
              setIsAddingModule(false); setNewModuleTitle('');
            }
          }}
        />
        <button className="btn-pri" style={{ whiteSpace: 'nowrap' }} onClick={() => {
          if (newModuleTitle.trim()) {
            createModule.mutate({ course_id: activeCourseId, title: newModuleTitle }, { 
              onSuccess: () => { setIsAddingModule(false); setNewModuleTitle(''); } 
            });
          }
        }}>Thêm</button>
        <button className="btn-sec" onClick={() => { setIsAddingModule(false); setNewModuleTitle(''); }}>Hủy</button>
      </div>
    </div>
  )}
</div>

{!isAddingModule && (
  <button className="add-mod-btn" type="button" onClick={() => {
    if (!activeCourseId) {
      alert('Vui lòng chọn khóa học để thêm!');
      return;
    }
    setIsAddingModule(true);
  }}>➕ Thêm module</button>
)}
`;

content = content.replace(modListRegex, newModList);

// 3. Add Custom Delete Confirm Modal
const deleteModalInjection = `
{/* Custom Confirm Delete Modal */}
{confirmDelete && (
<div className="modal-overlay" style={{ display: "flex", zIndex: 1000 }}>
  <div className="modal" style={{ width: '400px' }}>
    <div className="modal-hd">
      <h3 style={{ color: 'var(--red)' }}>⚠️ Xác nhận xóa</h3>
      <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
    </div>
    <div style={{ fontSize: '14px', color: 'var(--ink-mid)', lineHeight: '1.5', margin: '15px 0' }}>
      Bạn có chắc chắn muốn xóa <strong>{confirmDelete.title}</strong>?<br/>
      Hành động này không thể hoàn tác.
    </div>
    <div className="modal-footer">
      <button className="btn-sec" onClick={() => setConfirmDelete(null)}>Hủy</button>
      <button className="btn-pri" style={{ background: 'var(--red)' }} onClick={() => {
        if (confirmDelete.type === 'module') {
          deleteModule.mutate(confirmDelete.id, { onSuccess: () => setConfirmDelete(null) });
        } else {
          deleteLesson.mutate(confirmDelete.id, { onSuccess: () => setConfirmDelete(null) });
        }
      }}>🗑️ Xác nhận xóa</button>
    </div>
  </div>
</div>
)}
`;

if (!content.includes('Custom Confirm Delete Modal')) {
  content = content.replace(
    /\{isLessonModalOpen && \(/,
    `${deleteModalInjection}\n{isLessonModalOpen && (`
  );
}

fs.writeFileSync(filePath, content);
console.log('Replaced prompt alerts with inline React UI');
