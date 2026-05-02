import React, { useState } from 'react';

const courses = [
  { id: 1, cat: 'tuDuy', title: 'Tư duy phản biện cơ bản', icon: '🧠', bg: 'bg-teal-g', tag: 'Tư duy', tagClass: 'tag-teal', info: '8 bài · 2h 10m', rat: '4.9', prog: 60, progColor: 'var(--teal)' },
  { id: 2, cat: 'taiChinh', title: 'Quản lý tài chính từ A–Z', icon: '💰', bg: 'bg-gold-g', tag: 'Tài chính', tagClass: 'tag-gold', info: '10 bài · 3h 20m', rat: '4.9', prog: 30, progColor: 'var(--gold)' },
  { id: 3, cat: 'ngheNghiep', title: 'Kỹ năng xin việc & phỏng vấn', icon: '💼', bg: 'bg-blue-g', tag: 'Nghề nghiệp', tagClass: 'tag-blue', info: '12 bài · 4h', rat: '4.8', prog: 0, progColor: 'var(--blue)' },
  { id: 4, cat: 'giaoTiep', title: 'Nói trước đám đông tự tin', icon: '🗣️', bg: 'bg-coral-g', tag: 'Giao tiếp', tagClass: 'tag-coral', info: '8 bài · 2h 30m', rat: '4.7', prog: 7, progColor: 'linear-gradient(90deg,var(--g1),var(--g2))' },
  { id: 5, cat: 'sucKhoe', title: 'Chăm sóc sức khoẻ tâm lý', icon: '🌱', bg: 'bg-purple-g', tag: 'Sức khỏe', tagClass: 'tag-purple', info: '8 bài · 2h', rat: '4.8', prog: 0, progColor: 'var(--purple)' },
  { id: 6, cat: 'tuDuy', title: 'Đọc sách & ghi chép thông minh', icon: '📖', bg: 'bg-gold-g', tag: 'Phát triển', tagClass: 'tag-gold', info: '6 bài · 1h 40m', rat: '4.7', prog: 0, progColor: 'var(--gold)' },
];

export const SearchPage: React.FC = () => {
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = courses.filter(c => {
    const matchCat = activeCat === 'all' || c.cat === activeCat || (activeCat === 'offline' && [1,2].includes(c.id));
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="screen active" id="s-search">
      <div className="search-wrap">
        <div className="search-input">
          <span>🔍</span>
          <input placeholder="Tìm kỹ năng, chủ đề, khoá học..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="search-pills">
          <span className={`sp ${activeCat === 'all' ? 'active-pill' : ''}`} onClick={() => setActiveCat('all')}>🌟 Tất cả</span>
          <span className={`sp ${activeCat === 'tuDuy' ? 'active-pill' : ''}`} onClick={() => setActiveCat('tuDuy')}>🧠 Tư duy</span>
          <span className={`sp ${activeCat === 'taiChinh' ? 'active-pill' : ''}`} onClick={() => setActiveCat('taiChinh')}>💰 Tài chính</span>
          <span className={`sp ${activeCat === 'ngheNghiep' ? 'active-pill' : ''}`} onClick={() => setActiveCat('ngheNghiep')}>💼 Nghề nghiệp</span>
          <span className={`sp ${activeCat === 'giaoTiep' ? 'active-pill' : ''}`} onClick={() => setActiveCat('giaoTiep')}>🗣️ Giao tiếp</span>
          <span className={`sp ${activeCat === 'sucKhoe' ? 'active-pill' : ''}`} onClick={() => setActiveCat('sucKhoe')}>🌱 Sức khỏe</span>
          <span className={`sp highlight ${activeCat === 'offline' ? 'active-pill' : ''}`} onClick={() => setActiveCat('offline')}>📥 Có offline</span>
        </div>
      </div>
      <div className="sec-h"><h2>Tất cả khoá học</h2><span style={{fontSize:'12px',color:'var(--ink-light)',fontWeight:700}}>{filtered.length} khoá</span></div>
      <div className="course-grid">
        {filtered.map(c => (
          <div key={c.id} className="cg-card">
            <div className={`cg-thumb ${c.bg}`}><span>{c.icon}</span></div>
            <div className="cg-body">
              <div className={`cg-tag ${c.tagClass}`}>{c.tag}</div>
              <div className="cg-title">{c.title}</div>
              <div className="cg-meta">
                <div className="cg-info">{c.info}</div>
                <div className="cg-rat">★ {c.rat}</div>
              </div>
              <div className="cg-prog"><div className="cg-prog-fill" style={{width:`${c.prog}%`,background:c.progColor}}></div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
