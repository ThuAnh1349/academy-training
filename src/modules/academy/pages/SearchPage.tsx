import React, { useState } from 'react';
import { useAcademyCourses } from '../hooks/use-academy';
import { useNavigate } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data: courses, isLoading } = useAcademyCourses();

  if (isLoading) return <div style={{padding: '24px'}}>Đang tải danh sách khoá học...</div>;

  const filtered = (courses || []).filter(c => {
    const isTuDuy = c.category === 'tuDuy';
    const isTaiChinh = c.category === 'taiChinh';
    const isNgheNghiep = c.category === 'ngheNghiep';
    const isGiaoTiep = c.category === 'giaoTiep';

    let matchCat = activeCat === 'all';
    if (activeCat === 'tuDuy' && isTuDuy) matchCat = true;
    if (activeCat === 'taiChinh' && isTaiChinh) matchCat = true;
    if (activeCat === 'ngheNghiep' && isNgheNghiep) matchCat = true;
    if (activeCat === 'giaoTiep' && isGiaoTiep) matchCat = true;
    if (activeCat === 'offline' && c.is_offline_available) matchCat = true;

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
          <span className={`sp highlight ${activeCat === 'offline' ? 'active-pill' : ''}`} onClick={() => setActiveCat('offline')}>📥 Có offline</span>
        </div>
      </div>
      <div className="sec-h"><h2>Tất cả khoá học</h2><span style={{fontSize:'12px',color:'var(--ink-light)',fontWeight:700}}>{filtered.length} khoá</span></div>
      <div className="course-grid">
        {filtered.map(c => {
          const isTuDuy = c.category === 'tuDuy';
          const isTaiChinh = c.category === 'taiChinh';
          const isNghe = c.category === 'ngheNghiep';
          const bg = c.thumbnail_color || (isTuDuy ? 'bg-teal-g' : isTaiChinh ? 'bg-gold-g' : isNghe ? 'bg-blue-g' : 'bg-coral-g');
          const icon = c.thumbnail_emoji || (isTuDuy ? '🧠' : isTaiChinh ? '💰' : isNghe ? '💼' : '🗣️');
          const tagClass = isTuDuy ? 'tag-teal' : isTaiChinh ? 'tag-gold' : isNghe ? 'tag-blue' : 'tag-coral';
          const tagLabel = isTuDuy ? 'Tư duy' : isTaiChinh ? 'Tài chính' : isNghe ? 'Nghề nghiệp' : 'Giao tiếp';
          return (
            <div key={c.id} className="cg-card" onClick={() => navigate('/course')}>
              <div className={`cg-thumb ${bg}`}><span>{icon}</span></div>
              <div className="cg-body">
                <div className={`cg-tag ${tagClass}`}>{tagLabel}</div>
                <div className="cg-title">{c.title}</div>
                <div className="cg-meta">
                  <div className="cg-info">{c.total_lessons} bài · {Math.floor(c.total_duration_minutes/60)}h {c.total_duration_minutes%60}m</div>
                  <div className="cg-rat">★ {c.avg_rating}</div>
                </div>
                <div className="cg-prog"><div className="cg-prog-fill" style={{width:'0%',background:'var(--bg)'}}></div></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};
