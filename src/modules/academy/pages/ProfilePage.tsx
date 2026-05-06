import React from 'react';
import { useGamification, useLearnerDashboard } from '../hooks/use-academy';

export const ProfilePage: React.FC = () => {
  const { data: gamification, isLoading: loadingGamification } = useGamification();
  const { data: dashboard, isLoading: loadingDash } = useLearnerDashboard();

  if (loadingGamification || loadingDash) return <div style={{padding: '24px'}}>Đang tải dữ liệu hồ sơ...</div>;
  if (!gamification || !dashboard) return <div>Lỗi tải dữ liệu</div>;

  return (
    <div className="screen active" id="s-profile">
      <div className="pf-layout">
        <div>
          <div className="pf-hero">
            <div className="pf-av">{dashboard.person.display_name.charAt(0)}</div>
            <div className="pf-info">
              <div className="pf-name">{dashboard.person.display_name}</div>
              <div className="pf-lvl">🌱 Học viên Level {gamification.current_level} — NQuoc Academy</div>
              <div className="xp-row">
                <div className="xp-bar">
                  <div className="xp-f" style={{width: `${(gamification.total_xp / (gamification.total_xp + gamification.xp_to_next_level)) * 100}%`}}></div>
                </div>
                <div className="xp-lbl">{gamification.total_xp}/{gamification.total_xp + gamification.xp_to_next_level} XP</div>
              </div>
            </div>
          </div>
          <div className="pf-stats">
            <div className="pfs"><span className="pfs-v">{dashboard.stats.lessons_completed}</span><div className="pfs-l">Bài học</div></div>
            <div className="pfs"><span className="pfs-v">{dashboard.stats.hours_learned}h</span><div className="pfs-l">Giờ học</div></div>
            <div className="pfs"><span className="pfs-v">{gamification.current_streak}🔥</span><div className="pfs-l">Streak</div></div>
            <div className="pfs"><span className="pfs-v">{gamification.total_xp}</span><div className="pfs-l">Điểm NLT</div></div>
          </div>
          <div className="cert-card">
            <div className="cert-brand">Academy.nlt · NLT Certification</div>
            <div className="cert-name">Chứng chỉ Tư duy &amp; Phân tích</div>
            <div className="cert-desc">Hoàn thành 5 khoá học trong nhóm Tư duy để nhận chứng chỉ NLT chính thức.</div>
            <div className="cert-ps">
              <div className="cert-ps-top"><div className="cert-ps-lbl">Tiến độ chứng chỉ</div><div className="cert-ps-pct">40%</div></div>
              <div className="cert-ps-bar"><div className="cert-ps-f" style={{width: '40%'}}></div></div>
              <div className="cert-badges">
                <div className="cbadge done">✓ Tư duy phản biện</div>
                <div className="cbadge done">✓ Đọc hiểu thông tin</div>
                <div className="cbadge inprog">▶ Phân tích dữ liệu</div>
                <div className="cbadge">Tư duy sáng tạo</div>
                <div className="cbadge">Ra quyết định</div>
              </div>
            </div>
          </div>
          
          <div className="sec-h" style={{marginTop:'4px'}}><h2>Lịch sử học tập</h2></div>
          <div className="hist-list">
            {gamification.xp_history.map((hist, idx) => (
              <div key={idx} className="hist-item">
                <div className="hist-icon" style={{background:'var(--teal-l)'}}>🧠</div>
                <div style={{flex:1}}>
                  <div className="hist-title">Học {hist.events_count} bài học</div>
                  <div className="hist-date">{hist.date}</div>
                </div>
                <div className="hist-pts">+{hist.xp_earned} XP</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="sec-h"><h2>Thành tích</h2></div>
          <div className="ach-grid">
            {gamification.achievements.map((badge) => (
              <div key={badge.id} className="ach-card">
                <div className="ach-icon">{badge.key === 'streak_7' ? '🔥' : '🧠'}</div>
                <div className="ach-title">{badge.title}</div>
                <div className="ach-desc">{badge.description}</div>
                <div className="ach-bar"><div className="ach-bar-f" style={{width:'100%',background:'var(--teal)'}}></div></div>
              </div>
            ))}
            <div className="ach-card locked"><div className="ach-icon">🎓</div><div className="ach-title">Tốt nghiệp L1</div><div className="ach-desc">Đạt 500 XP để mở</div><div className="ach-bar"><div className="ach-bar-f" style={{width:'68%',background:'var(--blue)'}}></div></div></div>
            <div className="ach-card locked"><div className="ach-icon">📚</div><div className="ach-title">Mọt sách</div><div className="ach-desc">Hoàn thành 5 khoá học</div><div className="ach-bar"><div className="ach-bar-f" style={{width:'60%',background:'var(--purple)'}}></div></div></div>
          </div>

          <div className="offline-card">
            <div className="oc-head">Gói học offline</div>
            <div className="oc-title">1 khoá đã tải về</div>
            <div className="oc-sub">Học không cần internet — phù hợp vùng sóng yếu</div>
            <div className="oc-item"><span>🧠</span><span className="oc-item-name">Tư duy phản biện cơ bản</span><span className="oc-status">✓ Offline</span></div>
            <button className="oc-btn">+ Tải khoá học mới</button>
          </div>
        </div>
      </div>
    </div>
  );
};
