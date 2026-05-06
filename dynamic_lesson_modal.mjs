import fs from 'fs';

const filePath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/pages/AdminPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add states for dynamic lesson modal
const stateInjection = `
  const [lessonType, setLessonType] = useState('video');
  const [videoInputType, setVideoInputType] = useState('upload');
  const [quizInputType, setQuizInputType] = useState('manual');
`;

if (!content.includes('lessonType')) {
  content = content.replace(
    /const \[confirmDelete, setConfirmDelete\] = useState<\{type: 'module'\|'lesson', id: string, title: string\} \| null>\(null\);\n/,
    `const [confirmDelete, setConfirmDelete] = useState<{type: 'module'|'lesson', id: string, title: string} | null>(null);\n${stateInjection}`
  );
}

// 2. Rewrite the Lesson modal
const lessonModalRegex = /<form onSubmit=\{handleLessonSubmit\}>[\s\S]*?<\/form>/;

const newLessonModal = `
    <form onSubmit={handleLessonSubmit}>
      <input type="hidden" name="module_id" value={activeModuleId || ''} />
      <input type="hidden" name="course_id" value={activeCourseId || ''} />
    <div className="modal-hd">
      <h3>📖 Thêm bài học / Quiz</h3>
      <button type="button" className="modal-close" onClick={() => closeModal(setLessonModalOpen)}>✕</button>
    </div>
    <div className="form-group">
      <label className="form-label">Tiêu đề bài học *</label>
      <input className="form-input" name="title" placeholder="VD: Nhận biết ngụy biện phổ biến" required />
    </div>
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Loại bài học</label>
        <select className="form-select" name="lesson_type" value={lessonType} onChange={(e) => setLessonType(e.target.value)}>
          <option value="video">Video / Bài giảng</option>
          <option value="quiz">Quiz / Bài tập</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Thời lượng (phút)</label>
        <input className="form-input" type="number" name="duration_minutes" defaultValue="20" />
      </div>
    </div>

    {/* VIDEO OPTIONS */}
    {lessonType === 'video' && (
      <>
        <div className="form-group">
          <label className="form-label">Nguồn Video</label>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input type="radio" name="video_source" value="upload" checked={videoInputType === 'upload'} onChange={() => setVideoInputType('upload')} /> Upload từ máy
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input type="radio" name="video_source" value="url" checked={videoInputType === 'url'} onChange={() => setVideoInputType('url')} /> Dán Link URL
            </label>
          </div>
          
          {videoInputType === 'upload' ? (
            <div style={{ border: '1.5px dashed var(--border)', padding: '20px', textAlign: 'center', borderRadius: 'var(--r-xs)', background: 'var(--bg-card)' }}>
              <span style={{ fontSize: '24px' }}>📤</span>
              <p style={{ margin: '8px 0', fontSize: '13px', color: 'var(--ink-mid)' }}>Kéo thả file mp4 vào đây hoặc bấm để chọn</p>
              <input type="file" accept="video/mp4,video/x-m4v,video/*" style={{ fontSize: '12px' }} />
            </div>
          ) : (
            <input className="form-input" name="video_url" placeholder="https://youtube.com/..." />
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Nội dung tóm tắt / Key points</label>
          <textarea className="form-textarea" name="content_data" placeholder="Nội dung chính của bài học..."></textarea>
        </div>
      </>
    )}

    {/* QUIZ OPTIONS */}
    {lessonType === 'quiz' && (
      <>
        <div className="form-group">
          <label className="form-label">Phương thức nhập câu hỏi</label>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input type="radio" name="quiz_source" value="manual" checked={quizInputType === 'manual'} onChange={() => setQuizInputType('manual')} /> Nhập tay (Trắc nghiệm/Tự luận)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input type="radio" name="quiz_source" value="upload" checked={quizInputType === 'upload'} onChange={() => setQuizInputType('upload')} /> Upload file Excel (.xlsx)
            </label>
          </div>

          {quizInputType === 'upload' ? (
            <div style={{ border: '1.5px dashed var(--border)', padding: '20px', textAlign: 'center', borderRadius: 'var(--r-xs)', background: 'var(--bg-card)' }}>
              <span style={{ fontSize: '24px' }}>📊</span>
              <p style={{ margin: '8px 0', fontSize: '13px', color: 'var(--ink-mid)' }}>Upload file danh sách câu hỏi theo mẫu</p>
              <div style={{ marginBottom: '12px' }}>
                <a href="#" style={{ fontSize: '12px', color: 'var(--blue)', textDecoration: 'underline' }}>📥 Tải file mẫu (.xlsx)</a>
              </div>
              <input type="file" accept=".xlsx, .xls, .csv" style={{ fontSize: '12px' }} />
            </div>
          ) : (
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-xs)', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Danh sách câu hỏi (0)</span>
                <button type="button" className="btn-sec" style={{ padding: '4px 8px', fontSize: '11px', height: 'auto' }}>+ Thêm câu hỏi</button>
              </div>
              <div style={{ padding: '20px', textAlign: 'center', background: 'var(--bg)', borderRadius: '4px', border: '1px dashed var(--border)', fontSize: '12px', color: 'var(--ink-light)' }}>
                Chưa có câu hỏi nào. Bấm Thêm câu hỏi để tạo câu hỏi trắc nghiệm hoặc tự luận.
              </div>
            </div>
          )}
        </div>
      </>
    )}

    <div className="form-row">
      <div className="form-group">
        <label className="form-label">XP khi hoàn thành</label>
        <input className="form-input" type="number" name="xp_on_complete" defaultValue="25" />
      </div>
      <div className="form-group">
        <label className="form-label">Yêu cầu bài trước?</label>
        <select className="form-select" name="is_required">
          <option value="false">Không (free access)</option>
          <option value="true">Có (prerequisite lock)</option>
        </select>
      </div>
    </div>
    <div className="modal-footer">
      <button type="button" className="btn-sec" onClick={() => closeModal(setLessonModalOpen)}>Hủy</button>
      <button className="btn-pri" type="submit">✓ Lưu Bài học/Quiz</button>
    </div>
    </form>
`;

content = content.replace(lessonModalRegex, newLessonModal);

fs.writeFileSync(filePath, content);
console.log('Updated lesson modal for dynamic video/quiz options');
