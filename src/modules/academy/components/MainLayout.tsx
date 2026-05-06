import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(-2)
      .map(w => w[0].toUpperCase())
      .join('');
  };

  const displayName = user?.display_name || user?.email?.split('@')[0] || 'User';
  const initials = getInitials(displayName);
  const xp = user?.total_xp ?? 0;
  const level = user?.current_level ?? 1;

  const handleSignOut = async () => {
    await signOut();
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

          {/* Chỉ hiện Admin Panel nếu user là admin */}
          {user?.role === 'admin' && (
            <>
              <div className="nav-lbl">Quản trị</div>
              <button
                className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}
                onClick={() => navigate('/admin')}
                style={{ background: location.pathname === '/admin' ? 'rgba(123,47,190,0.12)' : undefined }}
                onMouseEnter={e => { if (location.pathname !== '/admin') e.currentTarget.style.background = '#F0E8FA'; }}
                onMouseLeave={e => { if (location.pathname !== '/admin') e.currentTarget.style.background = ''; }}
              >
                <span className="nav-icon">⚙️</span>
                <span className="nav-text" style={{ color: '#7B2FBE', fontWeight: 900 }}>Admin Panel</span>
              </button>
            </>
          )}

          {/* Đường kẻ phân cách */}
          <div style={{
            margin: '12px 8px 8px',
            height: '1px',
            background: 'rgba(0,0,0,0.07)',
          }} />

          {/* Nút đăng xuất */}
          <button
            className="nav-item"
            onClick={handleSignOut}
            id="btn-sign-out"
            onMouseEnter={e => (e.currentTarget.style.background = '#FEF0EB')}
            onMouseLeave={e => (e.currentTarget.style.background = '')}
          >
            <span className="nav-icon" style={{ color: '#E53935' }}>🚪</span>
            <span className="nav-text" style={{ color: '#E53935' }}>Đăng xuất</span>
          </button>
        </nav>

        {/* User info — click để vào profile */}
        <div className="sb-user" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <div className="sb-av">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sb-uname">{displayName}</div>
            <div className="sb-ulvl">🌱 Lv.{level} · {xp} điểm NLT</div>
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
