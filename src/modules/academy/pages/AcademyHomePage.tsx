import React from 'react';
import { useLearnerDashboard, useAcademyCourses } from '../hooks/use-academy';
import { useNavigate } from 'react-router-dom';

export const AcademyHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: dashboard, isLoading: loadingDash } = useLearnerDashboard();
  const { data: courses, isLoading: loadingCourses } = useAcademyCourses();

  if (loadingDash || loadingCourses) return <div style={{padding: '24px'}}>Đang tải dữ liệu...</div>;

  if (!dashboard) return <div>Lỗi tải dữ liệu</div>;

  return (
    <div className="screen active" id="s-home" data-hm="home">
      <div className="welcome-hero">
        <div className="wh-text">
          <div className="wh-greeting">Chào buổi sáng, thứ Tư ☀️</div>
          <div className="wh-name">{dashboard.person.display_name} ơi,<br/>hôm nay học gì?</div>
          <div className="wh-badge">🔥 Streak {dashboard.streak.current_streak} ngày liên tục!</div>
        </div>
        <div className="wh-art">📖</div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">⭐</div><div className="stat-val">{dashboard.stats.total_xp}</div>
          <div className="stat-lbl">Điểm NLT</div><div className="stat-sub" style={{color:'var(--teal)'}}>+40 hôm nay</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div><div className="stat-val">{dashboard.stats.lessons_completed}</div>
          <div className="stat-lbl">Bài đã học</div><div className="stat-sub" style={{color:'var(--ink-light)'}}>3 khoá đang học</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div><div className="stat-val">{dashboard.stats.hours_learned}h</div>
          <div className="stat-lbl">Tổng giờ học</div><div className="stat-sub" style={{color:'var(--primary)'}}>Mục tiêu: 10h</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏅</div><div className="stat-val">{dashboard.stats.certs_earned}</div>
          <div className="stat-lbl">Chứng chỉ</div><div className="stat-sub" style={{color:'var(--gold)'}}>NLT Level {dashboard.stats.current_level}</div>
        </div>
      </div>

      {dashboard.active_lesson && (
        <>
          <div className="sec-h"><h2>Tiếp tục học</h2></div>
          <div className="continue-card" onClick={() => navigate('/player')}>
            <div className="cc-emoji">🧠</div>
            <div className="cc-info">
              <div className="cc-tag">Đang học</div>
              <div className="cc-title">{dashboard.active_lesson.course_title}</div>
              <div className="cc-sub">{dashboard.active_lesson.lesson_title}</div>
              <div className="prog-bar"><div className="prog-fill" style={{width: `${dashboard.active_lesson.progress_pct}%`}}></div></div>
              <div className="prog-txt">{dashboard.active_lesson.progress_pct}% hoàn thành</div>
            </div>
            <button className="cc-btn" onClick={(e) => { e.stopPropagation(); navigate('/player'); }}>▶ Học tiếp</button>
          </div>
        </>
      )}

      <div className="sec-h"><h2>Khoá học phổ biến</h2><button onClick={() => navigate('/search')}>Xem tất cả →</button></div>
      <div className="course-grid">
        {courses?.slice(0, 3).map(c => (
          <div key={c.id} className="cg-card" onClick={() => navigate('/course')}>
            <div className={`cg-thumb ${c.slug === 'critical-thinking-l1' ? 'bg-teal-g' : 'bg-gold-g'}`}><span>🧠</span></div>
            <div className="cg-body">
              <div className={`cg-tag ${c.slug === 'critical-thinking-l1' ? 'tag-teal' : 'tag-gold'}`}>{c.slug === 'critical-thinking-l1' ? 'Tư duy' : 'Tài chính'}</div>
              <div className="cg-title">{c.title}</div>
              <div className="cg-meta">
                <div className="cg-info">{c.lesson_count} bài · {Math.floor(c.estimated_minutes/60)}h {c.estimated_minutes%60}m</div>
                <div className="cg-rat">★ {c.avg_rating}</div>
              </div>
              <div className="cg-prog"><div className="cg-prog-fill" style={{width:'0%',background:'var(--bg)'}}></div></div>
            </div>
          </div>
        ))}
      </div>

      {dashboard.daily_challenge && (
        <div className="daily-card">
          <div className="dc-icon">⚡</div>
          <div className="dc-info">
            <div className="dc-lbl">Thử thách hôm nay</div>
            <div className="dc-title">{dashboard.daily_challenge.challenge_description}</div>
            <div className="dc-sub">Nhận +{dashboard.daily_challenge.xp_reward} điểm NLT · Hết hạn sau 8 giờ</div>
          </div>
          <button className="dc-btn">Bắt đầu →</button>
        </div>
      )}
    </div>
  );
};
