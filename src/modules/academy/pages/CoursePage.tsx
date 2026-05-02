import React from 'react';
import { useCourseDetail } from '../hooks/use-academy';
import { useNavigate } from 'react-router-dom';

export const CoursePage: React.FC = () => {
  const navigate = useNavigate();
  // Using a hardcoded slug 'critical-thinking-l1' for demo.
  // In a real app, this would come from useParams()
  const { data: detail, isLoading } = useCourseDetail('critical-thinking-l1');

  if (isLoading) return <div style={{padding: '24px'}}>Đang tải khoá học...</div>;
  if (!detail) return <div>Lỗi tải khoá học</div>;

  const { course, enrollment, modules } = detail;
  const progressPct = enrollment?.progress_pct || 0;

  return (
    <div className="screen active" id="s-course" data-hm="course">
      <div className="cd-layout">
        <div>
          <div className="cd-hero">
            <span className="cd-emoji">🧠</span>
            <div className="cd-tag">{course.slug === 'critical-thinking-l1' ? 'Tư duy' : 'Chủ đề'} · {course.proficiency_level}</div>
            <div className="cd-title">{course.title}</div>
            <div className="cd-desc">{course.description || 'Khoá học này sẽ cung cấp kiến thức nền tảng và kỹ năng thiết yếu.'}</div>
            <div className="cd-stats">
              <div className="cds"><div className="cds-val">{course.lesson_count}</div><div className="cds-lbl">Bài học</div></div>
              <div className="cds"><div className="cds-val">{Math.floor(course.estimated_minutes/60)}h {course.estimated_minutes%60}m</div><div className="cds-lbl">Thời lượng</div></div>
              <div className="cds"><div className="cds-val">★ {course.avg_rating}</div><div className="cds-lbl">Đánh giá</div></div>
              <div className="cds"><div className="cds-val">{course.rating_count}</div><div className="cds-lbl">Học viên</div></div>
            </div>
          </div>
          <button className="cd-cta" onClick={() => navigate('/player')}>▶ Tiếp tục học</button>

          {modules.map((mod) => (
            <React.Fragment key={mod.module_order}>
              <div className="mod-hd" style={{marginTop: mod.module_order > 1 ? '6px' : '0'}}>
                <h3>{mod.module_title}</h3>
                {mod.completion_pct === 100 && <span className="mod-done">✓ Hoàn thành</span>}
              </div>
              {mod.lessons.map((lesson) => (
                <div 
                  key={lesson.id} 
                  className={`lesson-row ${lesson.status === 'locked' ? 'locked-row' : 'clickable'}`}
                  style={lesson.status === 'in_progress' ? {border:'1.5px solid rgba(255,107,53,.3)',background:'#FFFAF8'} : {}}
                  onClick={() => lesson.status !== 'locked' && navigate('/player')}
                >
                  <div className={`ln ${lesson.status === 'completed' ? 'ln-done' : lesson.status === 'in_progress' ? 'ln-active' : lesson.status === 'locked' ? 'ln-locked' : ''}`}>
                    {lesson.status === 'completed' ? '✓' : lesson.status === 'locked' ? '🔒' : lesson.lesson_order}
                  </div>
                  <div className="lr-info">
                    <div className="lr-title">{lesson.title}</div>
                    <div className="lr-meta">
                      <span className={`lr-type tag-${lesson.lesson_type === 'quiz' ? 'purple' : lesson.lesson_type === 'project' ? 'gold' : 'teal'}`}>
                        {lesson.lesson_type === 'video' ? 'Video' : lesson.lesson_type === 'quiz' ? 'Quiz' : lesson.lesson_type === 'project' ? 'Bài tập' : 'Bài đọc'}
                      </span>
                      {lesson.estimated_minutes} phút
                      {lesson.status === 'in_progress' && <span style={{marginLeft: '4px'}}>· <b style={{color:'var(--primary-d)'}}>Đang học</b></span>}
                      {lesson.status === 'locked' && <span style={{marginLeft: '4px'}}>· Hoàn thành bài trước để mở</span>}
                    </div>
                  </div>
                  <div className="lr-xp">+{lesson.xp_reward} XP</div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        <div>
          <div className="cd-panel">
            <div className="cdp-h3">Tiến độ khoá học</div>
            <div className="cdp-circle">
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="46" fill="none" stroke="#F4F2FA" strokeWidth="9"/>
                <circle cx="55" cy="55" r="46" fill="none" stroke="url(#cg2)" strokeWidth="9" strokeDasharray={`${(progressPct/100)*289} 289`} strokeLinecap="round" transform="rotate(-90 55 55)"/>
                <defs><linearGradient id="cg2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#FF6B35"/><stop offset="100%" stopColor="#06D6A0"/></linearGradient></defs>
                <text x="55" y="51" textAnchor="middle" fontSize="20" fontWeight="900" fill="#1A1520" fontFamily="Nunito">{progressPct}%</text>
                <text x="55" y="66" textAnchor="middle" fontSize="10" fontWeight="700" fill="#9A96B0" fontFamily="Nunito">hoàn thành</text>
              </svg>
            </div>
            <div className="cdp-pil"><div className="cdp-pil-icon" style={{background:'var(--teal-l)'}}>⏱️</div><div className="cdp-pil-t">Đã học</div><div className="cdp-pil-v">{enrollment ? '1h 20m' : '0m'}</div></div>
            <div className="cdp-pil"><div className="cdp-pil-icon" style={{background:'var(--primary-l)'}}>📝</div><div className="cdp-pil-t">Bài hoàn thành</div><div className="cdp-pil-v">{enrollment?.lessons_completed || 0} / {course.lesson_count}</div></div>
            <div className="cdp-pil"><div className="cdp-pil-icon" style={{background:'var(--gold-l)'}}>⭐</div><div className="cdp-pil-t">Điểm tích lũy</div><div className="cdp-pil-v">{enrollment?.xp_earned || 0} XP</div></div>
            <div className="cdp-pil"><div className="cdp-pil-icon" style={{background:'var(--teal-l)'}}>📥</div><div className="cdp-pil-t">Học offline</div><div className="cdp-pil-v" style={{color: course.is_offline_available ? 'var(--teal)' : 'var(--ink-light)',fontSize:'11.5px'}}>{course.is_offline_available ? '✓ Có sẵn' : 'Không có sẵn'}</div></div>
            <div className="skills-h">Kỹ năng đạt được</div>
            <span className="skill-tag">Phân tích logic</span>
            <span className="skill-tag">Đọc hiểu</span>
            <span className="skill-tag">Tư duy độc lập</span>
            <span className="skill-tag">Nhận diện ngụy biện</span>
            <div className="cert-prev">
              <h4>NLT Cert</h4>
              <p>Hoàn thành để tiến gần hơn chứng chỉ <b style={{color:'var(--gold)'}}>Tư duy & Phân tích</b></p>
              <div className="cert-pr"><div className="cert-bar"><div className="cert-bar-f" style={{width:'40%'}}></div></div><div className="cert-pct">40%</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
