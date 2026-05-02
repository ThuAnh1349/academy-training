import React from 'react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="screen active" id="s-profile">
      <div className="pf-layout">
        <div>
          <div className="pf-hero">
            <div className="pf-av">AN</div>
            <div className="pf-info">
              <div className="pf-name">Nguyễn Thị An</div>
              <div className="pf-lvl">🌱 Học viên cơ bản — NhiLe Academy</div>
              <div className="xp-row"><div className="xp-bar"><div className="xp-f" style={{width:'68%'}}></div></div><div className="xp-lbl">340/500 XP</div></div>
            </div>
          </div>
          <div className="pf-stats">
            <div className="pfs"><span className="pfs-v">12</span><div className="pfs-l">Bài học</div></div>
            <div className="pfs"><span className="pfs-v">8h</span><div className="pfs-l">Giờ học</div></div>
            <div className="pfs"><span className="pfs-v">7🔥</span><div className="pfs-l">Streak</div></div>
            <div className="pfs"><span className="pfs-v">340</span><div className="pfs-l">Điểm NLT</div></div>
          </div>
          <div className="cert-card">
            <div className="cert-brand">Academy.nlt · NLT Certification</div>
            <div className="cert-name">Chứng chỉ Tư duy &amp; Phân tích</div>
            <div className="cert-desc">Hoàn thành 5 khoá học trong nhóm Tư duy để nhận chứng chỉ NLT chính thức.</div>
            <div className="cert-ps">
              <div className="cert-ps-top"><div className="cert-ps-lbl">Tiến độ chứng chỉ</div><div className="cert-ps-pct">40%</div></div>
              <div className="cert-ps-bar"><div className="cert-ps-f"></div></div>
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
            <div className="hist-item"><div className="hist-icon" style={{background:'var(--teal-l)'}}>🧠</div><div style={{flex:1}}><div className="hist-title">Hoàn thành bài 4 — Tư duy phản biện</div><div className="hist-date">Hôm nay · 9:15 SA</div></div><div className="hist-pts">+20 XP</div></div>
            <div className="hist-item"><div className="hist-icon" style={{background:'var(--purple-l)'}}>⚡</div><div style={{flex:1}}><div className="hist-title">Hoàn thành thử thách ngày</div><div className="hist-date">Hôm qua · 8:30 SA</div></div><div className="hist-pts">+50 XP</div></div>
            <div className="hist-item"><div className="hist-icon" style={{background:'var(--gold-l)'}}>💰</div><div style={{flex:1}}><div className="hist-title">Bắt đầu khoá Quản lý tài chính</div><div className="hist-date">2 ngày trước</div></div><div className="hist-pts">+10 XP</div></div>
            <div className="hist-item"><div className="hist-icon" style={{background:'var(--teal-l)'}}>🏅</div><div style={{flex:1}}><div className="hist-title">Đạt huy hiệu "Tuần học chăm chỉ"</div><div className="hist-date">3 ngày trước</div></div><div className="hist-pts">+30 XP</div></div>
          </div>
        </div>

        <div>
          <div className="sec-h"><h2>Thành tích</h2></div>
          <div className="ach-grid">
            <div className="ach-card"><div className="ach-icon">🔥</div><div className="ach-title">Streak 7 ngày</div><div className="ach-desc">Học liên tục không nghỉ</div><div className="ach-bar"><div className="ach-bar-f" style={{width:'100%',background:'linear-gradient(90deg,var(--g1),var(--g2))'}}></div></div></div>
            <div className="ach-card"><div className="ach-icon">🧠</div><div className="ach-title">Nhà tư duy</div><div className="ach-desc">Hoàn thành khoá tư duy đầu tiên</div><div className="ach-bar"><div className="ach-bar-f" style={{width:'100%',background:'var(--teal)'}}></div></div></div>
            <div className="ach-card"><div className="ach-icon">⭐</div><div className="ach-title">300 điểm NLT</div><div className="ach-desc">Tích lũy 300 điểm học tập</div><div className="ach-bar"><div className="ach-bar-f" style={{width:'100%',background:'var(--gold)'}}></div></div></div>
            <div className="ach-card locked"><div className="ach-icon">🎓</div><div className="ach-title">Tốt nghiệp L1</div><div className="ach-desc">Đạt 500 XP để mở</div><div className="ach-bar"><div className="ach-bar-f" style={{width:'68%',background:'var(--blue)'}}></div></div></div>
            <div className="ach-card locked"><div className="ach-icon">📚</div><div className="ach-title">Mọt sách</div><div className="ach-desc">Hoàn thành 5 khoá học</div><div className="ach-bar"><div className="ach-bar-f" style={{width:'60%',background:'var(--purple)'}}></div></div></div>
            <div className="ach-card locked"><div className="ach-icon">🌟</div><div className="ach-title">NLT Certified</div><div className="ach-desc">Nhận chứng chỉ đầu tiên</div><div className="ach-bar"><div className="ach-bar-f" style={{width:'40%',background:'linear-gradient(90deg,var(--g1),var(--g3))'}}></div></div></div>
          </div>

          <div className="offline-card">
            <div className="oc-head">Gói học offline</div>
            <div className="oc-title">3 khoá đã tải về</div>
            <div className="oc-sub">Học không cần internet — phù hợp vùng sóng yếu</div>
            <div className="oc-item"><span>🧠</span><span className="oc-item-name">Tư duy phản biện cơ bản</span><span className="oc-status">✓ Offline</span></div>
            <div className="oc-item"><span>💰</span><span className="oc-item-name">Quản lý tài chính cá nhân</span><span className="oc-status">✓ Offline</span></div>
            <button className="oc-btn">+ Tải khoá học mới</button>
          </div>
        </div>
      </div>
    </div>
  );
};
