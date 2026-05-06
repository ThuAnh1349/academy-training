import fs from 'fs';

const filePath = 'e:/HỌC DATA WITH NHILE/Academy/academy-training/src/modules/academy/pages/AdminPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace Ach modal content
content = content.replace(
  /<div className="form-group">\s*<label className="form-label">Key \(unique\) \*<\/label>\s*<input className="form-input" placeholder="VD: streak_7_days" style={{ fontFamily: 'monospace' }} \/>\s*<\/div>\s*<div className="form-group">\s*<label className="form-label">Tên thành tích \*<\/label>\s*<input className="form-input" placeholder="VD: Streak 7 ngày" \/>\s*<\/div>\s*<div className="form-group">\s*<label className="form-label">Mô tả<\/label>\s*<textarea className="form-textarea" style={{ minHeight: '60px' }} placeholder="Mô tả điều kiện nhận thành tích này\.\.\."><\/textarea>\s*<\/div>\s*<div className="form-row">\s*<div className="form-group">\s*<label className="form-label">Icon Emoji<\/label>\s*<input className="form-input" defaultValue="🔥" \/>\s*<\/div>\s*<div className="form-group">\s*<label className="form-label">XP thưởng<\/label>\s*<input className="form-input" type="number" defaultValue="50" \/>\s*<\/div>\s*<\/div>\s*<div className="form-group">\s*<label className="form-label">Điều kiện kích hoạt \(JSON\)<\/label>\s*<textarea className="form-textarea" style={{ minHeight: '60px', fontFamily: 'monospace', fontSize: '12px' }} defaultValue='\{"streak_days": \{"gte": 7\}\}'><\/textarea>/g,
  `<div className="form-group">
      <label className="form-label">Key (unique) *</label>
      <input className="form-input" name="key" placeholder="VD: streak_7_days" style={{ fontFamily: 'monospace' }} />
    </div>
    <div className="form-group">
      <label className="form-label">Tên thành tích *</label>
      <input className="form-input" name="title" placeholder="VD: Streak 7 ngày" />
    </div>
    <div className="form-group">
      <label className="form-label">Mô tả</label>
      <textarea className="form-textarea" name="description" style={{ minHeight: '60px' }} placeholder="Mô tả điều kiện nhận thành tích này..."></textarea>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Icon Emoji</label>
        <input className="form-input" name="icon_emoji" defaultValue="🔥" />
      </div>
      <div className="form-group">
        <label className="form-label">XP thưởng</label>
        <input className="form-input" name="xp_reward" type="number" defaultValue="50" />
      </div>
    </div>
    <div className="form-group">
      <label className="form-label">Điều kiện kích hoạt (JSON)</label>
      <textarea className="form-textarea" name="trigger_condition" style={{ minHeight: '60px', fontFamily: 'monospace', fontSize: '12px' }} defaultValue='{"streak_days": {"gte": 7}}'></textarea>`
);

// Replace Lesson modal content
content = content.replace(
  /<div className="form-group">\s*<label className="form-label">Tiêu đề bài học \*<\/label>\s*<input className="form-input" placeholder="VD: Nhận biết ngụy biện phổ biến" \/>\s*<\/div>\s*<div className="form-row">\s*<div className="form-group">\s*<label className="form-label">Loại bài học<\/label>\s*<select className="form-select">\s*<option>Video<\/option>\s*<option>Quiz<\/option>\s*<option>Exercise<\/option>\s*<\/select>\s*<\/div>\s*<div className="form-group">\s*<label className="form-label">Thời lượng \(phút\)<\/label>\s*<input className="form-input" type="number" defaultValue="20" \/>\s*<\/div>\s*<\/div>\s*<div className="form-group">\s*<label className="form-label">Video URL \/ Stream ID<\/label>\s*<input className="form-input" placeholder="https:\/\/\.\.\." \/>\s*<\/div>\s*<div className="form-group">\s*<label className="form-label">Nội dung \/ Key points<\/label>\s*<textarea className="form-textarea" placeholder="Nội dung chính của bài học\.\.\."><\/textarea>\s*<\/div>\s*<div className="form-row">\s*<div className="form-group">\s*<label className="form-label">XP khi hoàn thành<\/label>\s*<input className="form-input" type="number" defaultValue="20" \/>\s*<\/div>\s*<div className="form-group">\s*<label className="form-label">Cần hoàn thành để đi tiếp<\/label>\s*<select className="form-select">\s*<option>Bắt buộc<\/option>\s*<option>Tùy chọn<\/option>\s*<\/select>\s*<\/div>\s*<\/div>/g,
  `<div className="form-group">
      <label className="form-label">Tiêu đề bài học *</label>
      <input className="form-input" name="title" placeholder="VD: Nhận biết ngụy biện phổ biến" />
    </div>
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Loại bài học</label>
        <select className="form-select" name="lesson_type">
          <option value="video">Video</option>
          <option value="quiz">Quiz</option>
          <option value="exercise">Exercise</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Thời lượng (phút)</label>
        <input className="form-input" name="duration_minutes" type="number" defaultValue="20" />
      </div>
    </div>
    <div className="form-group">
      <label className="form-label">Video URL / Stream ID</label>
      <input className="form-input" name="video_url" placeholder="https://..." />
    </div>
    <div className="form-group">
      <label className="form-label">Nội dung / Key points</label>
      <textarea className="form-textarea" name="content_data" placeholder="Nội dung chính của bài học..."></textarea>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">XP khi hoàn thành</label>
        <input className="form-input" name="xp_on_complete" type="number" defaultValue="20" />
      </div>
      <div className="form-group">
        <label className="form-label">Cần hoàn thành để đi tiếp</label>
        <select className="form-select" name="is_required">
          <option value="true">Bắt buộc</option>
          <option value="false">Tùy chọn</option>
        </select>
      </div>
    </div>`
);

fs.writeFileSync(filePath, content);
console.log('Fixed missing name attributes on forms');
