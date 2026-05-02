import React from 'react';

export const AcademyHomePage: React.FC = () => {
  return (
    <div className="screen active" id="s-home" data-hm="home">
      <div className="welcome-hero">
        <div className="wh-text">
          <div className="wh-greeting">Chào buổi sáng, thứ Tư ☀️</div>
          <div className="wh-name">An ơi,<br/>hôm nay học gì?</div>
          <div className="wh-badge">🔥 Streak 7 ngày liên tục!</div>
        </div>
        <div className="wh-art">📖</div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">⭐</div><div className="stat-val">340</div>
          <div className="stat-lbl">Điểm NLT</div><div className="stat-sub" style={{color:'var(--teal)'}}>+40 hôm nay</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div><div className="stat-val">12</div>
          <div className="stat-lbl">Bài đã học</div><div className="stat-sub" style={{color:'var(--ink-light)'}}>3 khoá đang học</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div><div className="stat-val">8h</div>
          <div className="stat-lbl">Tổng giờ học</div><div className="stat-sub" style={{color:'var(--primary)'}}>Mục tiêu: 10h</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏅</div><div className="stat-val">2</div>
          <div className="stat-lbl">Chứng chỉ</div><div className="stat-sub" style={{color:'var(--gold)'}}>NLT Level 1</div>
        </div>
      </div>

      <div className="sec-h"><h2>Tiếp tục học</h2></div>
      <div className="continue-card">
        <div className="cc-emoji">🧠</div>
        <div className="cc-info">
          <div className="cc-tag">Đang học — Module 2</div>
          <div className="cc-title">Tư duy phản biện cơ bản</div>
          <div className="cc-sub">Bài 5: Nhận biết ngụy biện trong thông tin hàng ngày</div>
          <div className="prog-bar"><div className="prog-fill" style={{width:'60%'}}></div></div>
          <div className="prog-txt">60% · 4/8 bài · còn 48 phút</div>
        </div>
        <button className="cc-btn">▶ Học tiếp</button>
      </div>

      <div className="sec-h"><h2>Khoá học phổ biến</h2><button>Xem tất cả →</button></div>
      <div className="course-grid">
        <div className="cg-card">
          <div className="cg-thumb bg-gold-g"><span>💰</span></div>
          <div className="cg-body"><div className="cg-tag tag-gold">Tài chính</div><div className="cg-title">Quản lý tài chính cá nhân từ A–Z</div><div className="cg-meta"><div className="cg-info">10 bài · 3h 20m</div><div className="cg-rat">★ 4.9</div></div><div className="cg-prog"><div className="cg-prog-fill" style={{width:'30%',background:'var(--gold)'}}></div></div></div>
        </div>
        <div className="cg-card">
          <div className="cg-thumb bg-blue-g"><span>💼</span></div>
          <div className="cg-body"><div className="cg-tag tag-blue">Nghề nghiệp</div><div className="cg-title">Kỹ năng xin việc & phỏng vấn</div><div className="cg-meta"><div className="cg-info">12 bài · 4h</div><div className="cg-rat">★ 4.8</div></div><div className="cg-prog"><div className="cg-prog-fill" style={{width:'0%',background:'var(--blue)'}}></div></div></div>
        </div>
        <div className="cg-card">
          <div className="cg-thumb bg-coral-g"><span>🗣️</span></div>
          <div className="cg-body"><div className="cg-tag tag-coral">Giao tiếp</div><div className="cg-title">Nói trước đám đông tự tin</div><div className="cg-meta"><div className="cg-info">8 bài · 2h 30m</div><div className="cg-rat">★ 4.7</div></div><div className="cg-prog"><div className="cg-prog-fill" style={{width:'7%',background:'linear-gradient(90deg,var(--g1),var(--g2))'}}></div></div></div>
        </div>
      </div>

      <div className="daily-card">
        <div className="dc-icon">⚡</div>
        <div className="dc-info">
          <div className="dc-lbl">Thử thách hôm nay</div>
          <div className="dc-title">Học 1 bài &amp; trả lời đúng 3 câu hỏi</div>
          <div className="dc-sub">Nhận +50 điểm NLT · Hết hạn sau 8 giờ</div>
        </div>
        <button className="dc-btn">Bắt đầu →</button>
      </div>
    </div>
  );
};
