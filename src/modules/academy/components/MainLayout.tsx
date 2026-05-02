import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Trang chủ';
      case '/search': return 'Khám phá';
      case '/course': return 'Khoá học';
      case '/player': return 'Đang học';
      case '/profile': return 'Hồ sơ & Cert';
      default: return 'Trang chủ';
    }
  };

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sb-brand">
          <div className="sb-logo">Academy.nlt</div>
          <div className="sb-sub">NhiLe Mindset Lab</div>
        </div>
        <nav className="nav-section" id="nav">
          <div className="nav-lbl">Học tập</div>
          <button className={`nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>
            <span className="nav-icon">🏠</span><span className="nav-text">Trang chủ</span>
          </button>
          <button className={`nav-item ${location.pathname === '/search' ? 'active' : ''}`} onClick={() => navigate('/search')}>
            <span className="nav-icon">🔍</span><span className="nav-text">Khám phá</span>
          </button>
          <button className={`nav-item ${location.pathname === '/course' ? 'active' : ''}`} onClick={() => navigate('/course')}>
            <span className="nav-icon">📚</span><span className="nav-text">Khoá học</span>
            <span className="nav-badge">3</span>
          </button>
          <button className={`nav-item ${location.pathname === '/player' ? 'active' : ''}`} onClick={() => navigate('/player')}>
            <span className="nav-icon">▶️</span><span className="nav-text">Đang học</span>
          </button>
          <div className="nav-lbl">Cá nhân</div>
          <button className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`} onClick={() => navigate('/profile')}>
            <span className="nav-icon">🎓</span><span className="nav-text">Hồ sơ & Cert</span>
          </button>
        </nav>
        <div className="sb-user" onClick={() => navigate('/profile')}>
          <div className="sb-av">AN</div>
          <div>
            <div className="sb-uname">Nguyễn Thị An</div>
            <div className="sb-ulvl">🌱 Cơ bản · 340 điểm NLT</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <button className={`tb-back ${location.pathname !== '/' ? 'visible' : ''}`} onClick={() => navigate(-1)}>←</button>
          <div style={{flex: 1, minWidth: 0}}>
            <div className="tb-title">{getPageTitle()}</div>
          </div>
          <div className="tb-search" onClick={() => navigate('/search')}>
            <span>🔍</span>
            <span className="tb-search-txt">Tìm khoá học...</span>
          </div>
          <div className="tb-actions">
            <button className="tb-btn">🔥<div className="notif-dot"></div></button>
            <button className="tb-btn" onClick={() => navigate('/profile')}>👤</button>
          </div>
        </div>

        <div className="content" id="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
