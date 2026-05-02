import React from 'react';

export const CoursePage: React.FC = () => {
  return (
    <div className="screen active" id="s-course" data-hm="course">
      <div className="cd-layout">
        <div>
          <div className="cd-hero">
            <span className="cd-emoji">🧠</span>
            <div className="cd-tag">Tư duy · Cơ bản</div>
            <div className="cd-title">Tư duy phản biện cơ bản</div>
            <div className="cd-desc">Học cách đặt câu hỏi đúng, phân tích thông tin, và tránh bẫy ngụy biện trong cuộc sống — kỹ năng nền tảng cho mọi người.</div>
            <div className="cd-stats">
              <div className="cds"><div className="cds-val">8</div><div className="cds-lbl">Bài học</div></div>
              <div className="cds"><div className="cds-val">2h 10m</div><div className="cds-lbl">Thời lượng</div></div>
              <div className="cds"><div className="cds-val">★ 4.9</div><div className="cds-lbl">Đánh giá</div></div>
              <div className="cds"><div className="cds-val">1,240</div><div className="cds-lbl">Học viên</div></div>
            </div>
          </div>
          <button className="cd-cta">▶ Tiếp tục học — Bài 5</button>

          <div className="mod-hd"><h3>Module 1 — Nền tảng tư duy</h3><span className="mod-done">✓ Hoàn thành</span></div>
          <div className="lesson-row clickable"><div className="ln ln-done">✓</div><div className="lr-info"><div className="lr-title">Tư duy phản biện là gì?</div><div className="lr-meta"><span className="lr-type tag-teal">Video</span>18 phút</div></div><div className="lr-xp">+20 XP</div></div>
          <div className="lesson-row clickable"><div className="ln ln-done">✓</div><div className="lr-info"><div className="lr-title">Vì sao não người dễ bị lừa?</div><div className="lr-meta"><span className="lr-type tag-teal">Video</span>22 phút</div></div><div className="lr-xp">+20 XP</div></div>
          <div className="lesson-row clickable"><div className="ln ln-done">✓</div><div className="lr-info"><div className="lr-title">Bài kiểm tra Module 1</div><div className="lr-meta"><span className="lr-type tag-purple">Quiz</span>10 phút</div></div><div className="lr-xp">+30 XP</div></div>

          <div className="mod-hd" style={{marginTop:'6px'}}><h3>Module 2 — Nhận diện ngụy biện</h3></div>
          <div className="lesson-row clickable"><div className="ln ln-done">✓</div><div className="lr-info"><div className="lr-title">10 kiểu ngụy biện phổ biến nhất</div><div className="lr-meta"><span className="lr-type tag-teal">Video</span>24 phút</div></div><div className="lr-xp">+20 XP</div></div>
          <div className="lesson-row clickable" style={{border:'1.5px solid rgba(255,107,53,.3)',background:'#FFFAF8'}}>
            <div className="ln ln-active">5</div>
            <div className="lr-info"><div className="lr-title">Nhận biết ngụy biện trong thông tin hàng ngày</div><div className="lr-meta"><span className="lr-type tag-teal">Video</span>20 phút · <b style={{color:'var(--primary-d)'}}>Đang học</b></div></div>
            <div className="lr-xp">+25 XP</div>
          </div>
          <div className="lesson-row locked-row"><div className="ln ln-locked">🔒</div><div className="lr-info"><div className="lr-title">Thực hành: Phân tích bài báo</div><div className="lr-meta"><span className="lr-type tag-gold">Bài tập</span>15 phút · Hoàn thành bài 5 để mở</div></div><div className="lr-xp">+35 XP</div></div>
          <div className="lesson-row locked-row"><div className="ln ln-locked">🔒</div><div className="lr-info"><div className="lr-title">Bài kiểm tra Module 2</div><div className="lr-meta"><span className="lr-type tag-purple">Quiz</span>10 phút · Hoàn thành bài 6 để mở</div></div><div className="lr-xp">+40 XP</div></div>
        </div>

        <div>
          <div className="cd-panel">
            <div className="cdp-h3">Tiến độ khoá học</div>
            <div className="cdp-circle">
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="46" fill="none" stroke="#F4F2FA" strokeWidth="9"/>
                <circle cx="55" cy="55" r="46" fill="none" stroke="url(#cg2)" strokeWidth="9" strokeDasharray="173 115" strokeLinecap="round" transform="rotate(-90 55 55)"/>
                <defs><linearGradient id="cg2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#FF6B35"/><stop offset="100%" stopColor="#06D6A0"/></linearGradient></defs>
                <text x="55" y="51" textAnchor="middle" fontSize="20" fontWeight="900" fill="#1A1520" fontFamily="Nunito">60%</text>
                <text x="55" y="66" textAnchor="middle" fontSize="10" fontWeight="700" fill="#9A96B0" fontFamily="Nunito">hoàn thành</text>
              </svg>
            </div>
            <div className="cdp-pil"><div className="cdp-pil-icon" style={{background:'var(--teal-l)'}}>⏱️</div><div className="cdp-pil-t">Đã học</div><div className="cdp-pil-v">1h 20m</div></div>
            <div className="cdp-pil"><div className="cdp-pil-icon" style={{background:'var(--primary-l)'}}>📝</div><div className="cdp-pil-t">Bài hoàn thành</div><div className="cdp-pil-v">4 / 8</div></div>
            <div className="cdp-pil"><div className="cdp-pil-icon" style={{background:'var(--gold-l)'}}>⭐</div><div className="cdp-pil-t">Điểm tích lũy</div><div className="cdp-pil-v">90 XP</div></div>
            <div className="cdp-pil"><div className="cdp-pil-icon" style={{background:'var(--teal-l)'}}>📥</div><div className="cdp-pil-t">Học offline</div><div className="cdp-pil-v" style={{color:'var(--teal)',fontSize:'11.5px'}}>✓ Đã tải</div></div>
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
