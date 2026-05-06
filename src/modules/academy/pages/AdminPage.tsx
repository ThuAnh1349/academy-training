import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDashboardStats, useAdminUsersList, useAdminCourses, useAdminCategories, useAdminAchievements, useAdminCourseModules } from '../hooks/use-admin';
import { useCreateCategory, useInviteUser, useCreateAchievement, useCreateLesson, useCreateCourse, useUpdateCourse, useUpdateCategory, useCreateModule, useUpdateModule, useUpdateLesson, useDeleteModule, useDeleteLesson } from '../hooks/use-admin-mutations';
import './AdminPage.css';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('s-dash');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingModuleTitle, setEditingModuleTitle] = useState('');
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingLessonTitle, setEditingLessonTitle] = useState('');
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{type: 'module'|'lesson', id: string, title: string} | null>(null);

  const [lessonType, setLessonType] = useState('video');
  const [videoInputType, setVideoInputType] = useState('upload');
  const [quizInputType, setQuizInputType] = useState('manual');

  
  // Mutations
  const createCategory = useCreateCategory();
  const inviteUser = useInviteUser();
  const createAch = useCreateAchievement();
  const createLesson = useCreateLesson();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const updateCategory = useUpdateCategory();
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();
  const updateLesson = useUpdateLesson();
  const deleteModule = useDeleteModule();
  const deleteLesson = useDeleteLesson();

  console.log(updateCategory, updateModule, updateLesson, updateCourse); // TS fix

  const handleCategorySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    createCategory.mutate(data, {
      onSuccess: () => {
        alert('Đã thêm danh mục!');
        closeModal(setCategoryModalOpen);
      },
      onError: (err) => alert('Lỗi: ' + err.message)
    });
  };

  const handleInviteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    inviteUser.mutate(data, {
      onSuccess: () => {
        alert('Đã gửi lời mời!');
        closeModal(setInviteModalOpen);
      },
      onError: (err) => alert('Lỗi: ' + err.message)
    });
  };

  const handleAchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    createAch.mutate(data, {
      onSuccess: () => {
        alert('Đã thêm thành tích!');
        closeModal(setAchModalOpen);
      },
      onError: (err) => alert('Lỗi: ' + err.message)
    });
  };

  const handleCourseSubmit = () => {
    const title = (document.getElementById('ed-title') as HTMLInputElement)?.value;
    const slug = (document.getElementById('ed-slug') as HTMLInputElement)?.value;
    const description = (document.getElementById('ed-desc') as HTMLTextAreaElement)?.value;
    const level = (document.getElementById('ed-level') as HTMLSelectElement)?.value;
    const xp = (document.getElementById('ed-xp') as HTMLInputElement)?.value;
    const categoryId = (document.getElementById('editor-cat-select') as HTMLSelectElement)?.value || 'tuDuy';
    
    if (!title) {
      alert('Vui lòng nhập tiêu đề khoá học!');
      return;
    }

    createCourse.mutate({
      title,
      slug,
      description,
      difficulty_level: level,
      xp_on_complete: xp,
      category: categoryId
    }, {
      onSuccess: () => {
        alert('Đã tạo/lưu khoá học thành công!');
        (document.getElementById('ed-title') as HTMLInputElement).value = '';
      },
      onError: (err) => alert('Lỗi: ' + err.message)
    });
  };

  const handleLessonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    createLesson.mutate(data, {
      onSuccess: () => {
        alert('Đã thêm bài học!');
        closeModal(setLessonModalOpen);
      },
      onError: (err) => alert('Lỗi: ' + err.message)
    });
  };


  // Modal states
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isCatDeleteModalOpen, setCatDeleteModalOpen] = useState(false);
  const [isQuickCatModalOpen, setQuickCatModalOpen] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isAchModalOpen, setAchModalOpen] = useState(false);
  const [isLessonModalOpen, setLessonModalOpen] = useState(false);
  
  // Handlers
  const openModal = (setter: React.Dispatch<React.SetStateAction<boolean>>) => setter(true);
  const closeModal = (setter: React.Dispatch<React.SetStateAction<boolean>>) => setter(false);
  const navigate = useNavigate();

  const { data: stats, isLoading: loadingStats } = useAdminDashboardStats();
  const { data: users, isLoading: loadingUsers } = useAdminUsersList();
  const { data: courses, isLoading: loadingCourses } = useAdminCourses();
  const { data: categories, isLoading: loadingCategories } = useAdminCategories();
  const { data: achievements, isLoading: loadingAchievements } = useAdminAchievements();
  const { data: courseModules, isLoading: loadingModules } = useAdminCourseModules(activeCourseId);

  // Consume achievements to prevent TS unused variable error
  console.log(achievements?.length);

  const goTo = (id: string) => setActiveTab(id);

  useEffect(() => {
    if (activeTab === 's-editor') {
      if (activeCourseId && courses) {
        const course = courses.find((c: any) => c.id === activeCourseId);
        if (course) {
          const elTitle = document.getElementById('ed-title') as HTMLInputElement;
          if (elTitle) {
            elTitle.value = course.title || '';
            (document.getElementById('ed-slug') as HTMLInputElement).value = course.slug || '';
            (document.getElementById('ed-desc') as HTMLTextAreaElement).value = course.description || '';
            (document.getElementById('ed-level') as HTMLSelectElement).value = course.difficulty_level || 'co_ban';
            (document.getElementById('ed-xp') as HTMLInputElement).value = course.xp_on_complete || '150';
            const catSelect = document.getElementById('editor-cat-select') as HTMLSelectElement;
            if (catSelect) {
               // handle finding category key, course.category might be the name or key, but usually the select expects key
               // We will just set it directly
               catSelect.value = course.category || '';
               if (!catSelect.value) catSelect.selectedIndex = 0;
            }
            const keyEl = document.getElementById('ed-course-key') as HTMLInputElement;
            if (keyEl) keyEl.value = course.id;
          }
        }
      } else {
        const elTitle = document.getElementById('ed-title') as HTMLInputElement;
        if (elTitle) {
          elTitle.value = '';
          (document.getElementById('ed-slug') as HTMLInputElement).value = '';
          (document.getElementById('ed-desc') as HTMLTextAreaElement).value = '';
          (document.getElementById('ed-level') as HTMLSelectElement).value = 'co_ban';
          (document.getElementById('ed-xp') as HTMLInputElement).value = '150';
          const catSelect = document.getElementById('editor-cat-select') as HTMLSelectElement;
          if (catSelect) catSelect.selectedIndex = 0;
          const keyEl = document.getElementById('ed-course-key') as HTMLInputElement;
          if (keyEl) keyEl.value = '';
        }
      }
    }
  }, [activeTab, activeCourseId, courses]);

  if (loadingStats || loadingUsers || loadingCourses || loadingCategories || loadingAchievements || loadingModules) return <div style={{padding: '24px'}}>Đang tải dữ liệu Admin...</div>;

  return (
    <div className="admin-root">
      <div className="admin-app">

  {/*  SIDEBAR  */}
  <div className="admin-sidebar">
    <div className="admin-sb-brand">
      <div className="admin-sb-logo">Academy.nlt</div>
      <div className="admin-sb-sub">Learning Platform</div>
      <div className="admin-sb-role">🛡️ Admin Portal</div>
    </div>
    <div className="admin-nav-section">
      <div className="admin-nav-lbl">Tổng quan</div>
      <button className={`admin-nav-item ${activeTab === 's-dash' ? 'active' : ''}`} onClick={() => goTo('s-dash')}>
        <span className="admin-nav-icon">📊</span><span className="admin-nav-text">Dashboard</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 's-analytics' ? 'active' : ''}`} onClick={() => goTo('s-analytics')}>
        <span className="admin-nav-icon">📈</span><span className="admin-nav-text">Phân tích</span>
      </button>

      <div className="admin-nav-lbl">Nội dung</div>
      <button className={`admin-nav-item ${activeTab === 's-courses' ? 'active' : ''}`} onClick={() => goTo('s-courses')}>
        <span className="admin-nav-icon">📚</span><span className="admin-nav-text">Khoá học</span>
        <span className="admin-nav-badge" style={{ background: 'var(--gold)', color: 'white' }}>{stats?.totalCourses || 0}</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 's-editor' ? 'active' : ''}`} onClick={() => { setActiveCourseId(null); goTo('s-editor'); }}>
        <span className="admin-nav-icon">✏️</span><span className="admin-nav-text">Tạo khoá học</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 's-categories' ? 'active' : ''}`} onClick={() => goTo('s-categories')}>
        <span className="admin-nav-icon">🏷️</span><span className="admin-nav-text">Danh mục</span>
      </button>

      <div className="admin-nav-lbl">Học viên</div>
      <button className={`admin-nav-item ${activeTab === 's-users' ? 'active' : ''}`} onClick={() => goTo('s-users')}>
        <span className="admin-nav-icon">👥</span><span className="admin-nav-text">Quản lý user</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 's-progress' ? 'active' : ''}`} onClick={() => goTo('s-progress')}>
        <span className="admin-nav-icon">🎯</span><span className="admin-nav-text">Tiến độ học</span>
      </button>

      <div className="admin-nav-lbl">Gamification</div>
      <button className={`admin-nav-item ${activeTab === 's-gam' ? 'active' : ''}`} onClick={() => goTo('s-gam')}>
        <span className="admin-nav-icon">🏆</span><span className="admin-nav-text">Thành tích</span>
      </button>
      <button className={`admin-nav-item ${activeTab === 's-certs' ? 'active' : ''}`} onClick={() => goTo('s-certs')}>
        <span className="admin-nav-icon">🎓</span><span className="admin-nav-text">Chứng chỉ</span>
      </button>
    </div>
    <div className="admin-sb-user">
      <div className="admin-sb-av">AD</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="admin-sb-uname">Admin NLT</div>
        <div className="admin-sb-ulvl"><span className="status-dot online">Online</span></div>
      </div>
    </div>
    {/* Nút chuyển sang giao diện học viên */}
    <button
      onClick={() => navigate('/')}
      style={{
        margin: '0 12px 14px',
        padding: '10px 14px',
        background: 'rgba(6,214,160,0.1)',
        border: '1.5px solid rgba(6,214,160,0.3)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: '12.5px',
        fontWeight: 800,
        color: '#04A87D',
        width: 'calc(100% - 24px)',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(6,214,160,0.18)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(6,214,160,0.1)')}
    >
      <span style={{ fontSize: '1rem' }}>👤</span>
      Xem giao diện học viên
    </button>
  </div>

  {/*  MAIN  */}
  <div className="admin-main">
    <div className="admin-topbar">
      <div className="admin-tb-title" id="admin-tb-title">
              {activeTab === 's-dash' && 'Dashboard'}
              {activeTab === 's-users' && 'Quản lý học viên'}
              {activeTab === 's-progress' && 'Tiến độ học tập'}
              {activeTab === 's-courses' && 'Quản lý khoá học'}
              {activeTab === 's-editor' && 'Tạo / chỉnh sửa khoá học'}
              {activeTab === 's-gam' && 'Gamification & Thành tích'}
              {activeTab === 's-certs' && 'Chứng chỉ'}
              {activeTab === 's-analytics' && 'Phân tích học tập'}
              {activeTab === 's-categories' && 'Quản lý danh mục'}
            </div>
      <div className="admin-tb-search">
        <span style={{ color: 'var(--ink-light)', fontSize: '.9rem' }}>🔍</span>
        <input placeholder="Tìm học viên, khoá học..." />
      </div>
      <div className="admin-tb-actions">
        <button className="admin-tb-btn" >
          🔔<div className="notif-dot"></div>
        </button>
        <div
          className="admin-tb-user-view"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
          title="Chuyển sang giao diện học viên"
        >
          <div className="admin-tb-user-av">AN</div>
          <div className="admin-tb-user-lbl">Xem như học viên</div>
        </div>
      </div>
    </div>

    <div className="admin-content" id="main-admin-content">

      {/*  ══ DASHBOARD ══  */}
      {activeTab === 's-dash' && (<>
<div className="admin-screen active" id="s-dash">
        <div className="admin-hero">
          <div className="ah-tag">Admin Overview · Hôm nay 02/05/2026</div>
          <div className="ah-title">Chào buổi sáng, Admin! 👋</div>
          <div className="ah-sub" id="dash-hero-sub">Academy có 2 khoá học draft cần publish · 1 user báo lỗi quiz</div>
          <div className="ah-stats">
            <div className="ahs"><div className="ahs-val">{stats?.totalUsers || 0}</div><div className="ahs-lbl">Tổng học viên</div></div>
            <div className="ahs"><div className="ahs-val" id="dash-live-count">{stats?.totalCourses || 0}</div><div className="ahs-lbl">Khoá học live</div></div>
            <div className="ahs"><div className="ahs-val">{stats?.satisfactionRate}%</div><div className="ahs-lbl">Tỷ lệ hài lòng</div></div>
            <div className="ahs"><div className="ahs-val">{stats?.xpGivenToday} XP</div><div className="ahs-lbl">Phát hôm nay</div></div>
          </div>
          <div className="ah-art">🛡️</div>
        </div>

        <div className="kpi-row">
          <div className="kpi-card k-purple" >
            <div className="kpi-icon">👥</div>
            <div className="kpi-val">{stats?.totalUsers || 0}</div>
            <div className="kpi-lbl">Tổng user</div>
            <div className="kpi-delta up">↑ +48 tuần này</div>
          </div>
          <div className="kpi-card k-teal" >
            <div className="kpi-icon">🔥</div>
            <div className="kpi-val">{stats?.activeToday || 0}</div>
            <div className="kpi-lbl">Đang học hôm nay</div>
            <div className="kpi-delta up">↑ +12% vs hôm qua</div>
          </div>
          <div className="kpi-card k-gold" >
            <div className="kpi-icon">✅</div>
            <div className="kpi-val" id="dash-kpi-completed">{stats?.completedCourses || 0}</div>
            <div className="kpi-lbl">Khoá hoàn thành</div>
            <div className="kpi-delta up">↑ +7 hôm nay</div>
          </div>
          <div className="kpi-card k-blue" >
            <div className="kpi-icon">🎓</div>
            <div className="kpi-val">{stats?.certsIssued || 0}</div>
            <div className="kpi-lbl">Cert đã cấp</div>
            <div className="kpi-delta down">↓ -2 vs tuần trước</div>
          </div>
        </div>

        <div className="dash-grid">
          {/*  Bar chart  */}
          <div className="chart-card">
            <div className="chart-hd">
              <h3>Học viên hoạt động</h3>
              <div className="chart-tabs">
                <button className="chart-tab active" >7 ngày</button>
                <button className="chart-tab" >30 ngày</button>
              </div>
            </div>
            <div className="bar-chart" id="bar-chart-admin-main">
              {/*  rendered by JS  */}
            </div>
          </div>

          {/*  Activity feed  */}
          <div className="act-feed">
            <div className="act-hd"><h3>Hoạt động gần đây</h3><button className="sec-action" >Xem tất cả</button></div>
            <div className="act-item">
              <div className="act-av" style={{ background: 'linear-gradient(135deg,#FF6B35,#F7931E)' }}>MT</div>
              <div className="act-body">
                <div className="act-text"><b>Minh Tuấn</b> hoàn thành khoá <b>Tư duy phản biện</b></div>
                <div className="act-time">3 phút trước</div>
              </div>
              <span className="act-badge tag-teal">+150 XP</span>
            </div>
            <div className="act-item">
              <div className="act-av" style={{ background: 'linear-gradient(135deg,#7B2FBE,#5B1F9E)' }}>LA</div>
              <div className="act-body">
                <div className="act-text"><b>Lan Anh</b> nhận chứng chỉ <b>NLT Tư duy & Phân tích</b></div>
                <div className="act-time">15 phút trước</div>
              </div>
              <span className="act-badge tag-gold">🎓 Cert</span>
            </div>
            <div className="act-item">
              <div className="act-av" style={{ background: 'linear-gradient(135deg,#06D6A0,#04A87D)' }}>HD</div>
              <div className="act-body">
                <div className="act-text"><b>Hoàng Đức</b> đăng ký khoá <b>Kỹ năng xin việc</b></div>
                <div className="act-time">32 phút trước</div>
              </div>
              <span className="act-badge t-tag community">Mới</span>
            </div>
            <div className="act-item">
              <div className="act-av" style={{ background: 'linear-gradient(135deg,#118AB2,#0A5A80)' }}>TN</div>
              <div className="act-body">
                <div className="act-text"><b>Thảo Ngân</b> báo lỗi quiz Bài 3 — <b>Quản lý tài chính</b></div>
                <div className="act-time">1 giờ trước</div>
              </div>
              <span className="act-badge" style={{ background: 'var(--red-l)', color: 'var(--red)' }}>⚠️ Báo lỗi</span>
            </div>
            <div className="act-item">
              <div className="act-av" style={{ background: 'linear-gradient(135deg,#F7931E,#FFD23F)' }}>BL</div>
              <div className="act-body">
                <div className="act-text"><b>Bảo Long</b> streak 🔥 <b>14 ngày</b> liên tiếp</div>
                <div className="act-time">2 giờ trước</div>
              </div>
              <span className="act-badge tag-gold">🔥 Streak</span>
            </div>
          </div>
        </div>

        {/*  Quick actions  */}
        <div className="admin-sec-h"><h2>Cần xử lý</h2></div>
        <div className="qs-row">
          <div className="qs-card"  style={{ cursor: 'pointer', border: '1.5px solid rgba(247,147,30,.3)', background: 'var(--gold-l)' }}>
            <div className="qs-icon">📝</div>
            <div>
              <div className="qs-val" style={{ color: 'var(--gold)' }} id="dash-draft-count">2 khoá draft</div>
              <div className="qs-lbl">Chờ publish</div>
            </div>
          </div>
          <div className="qs-card"  style={{ cursor: 'pointer', border: '1.5px solid rgba(239,68,68,.3)', background: 'var(--red-l)' }}>
            <div className="qs-icon">🐛</div>
            <div>
              <div className="qs-val" style={{ color: 'var(--red)' }}>1 báo cáo lỗi</div>
              <div className="qs-lbl">Quiz Tài chính Bài 3</div>
            </div>
          </div>
          <div className="qs-card"  style={{ cursor: 'pointer', border: '1.5px solid rgba(6,214,160,.3)', background: 'var(--teal-l)' }}>
            <div className="qs-icon">🎓</div>
            <div>
              <div className="qs-val" style={{ color: 'var(--teal-d)' }}>5 cert chờ duyệt</div>
              <div className="qs-lbl">Cần review thủ công</div>
            </div>
          </div>
        </div>
      </div>

      {/*  ══ USERS ══  */}
</>)}
{activeTab === 's-users' && (<>
<div className="admin-screen active" id="s-users">
        <div className="table-card">
          <div className="table-top">
            <h3>Quản lý học viên</h3>
            <div className="table-filters">
              <input className="tf-input" placeholder="🔍 Tìm tên, email..." />
              <select className="tf-select">
                <option>Tất cả loại</option>
                <option>Internal</option>
                <option>Community</option>
              </select>
              <select className="tf-select">
                <option>Tất cả cấp độ</option>
                <option>Cơ bản</option>
                <option>Trung cấp</option>
                <option>Nâng cao</option>
              </select>
              <button className="btn-pri" onClick={() => openModal(setInviteModalOpen)}>+ Mời học viên</button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Học viên</th>
                <th>Loại</th>
                <th>Tổng XP</th>
                <th>Streak</th>
                <th>Hoạt động gần nhất</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody id="users-tbody">
              {users?.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="t-name">
                      <div className="t-av" style={{ background: 'linear-gradient(135deg,#06D6A0,#04A87D)' }}>
                        {u.display_name?.substring(0, 2).toUpperCase() || 'NA'}
                      </div>
                      <div>
                        <div className="t-uname">{u.display_name}</div>
                        <div className="t-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`t-tag ${u.user_type === 'internal' ? 'pub' : 'community'}`}>
                      {u.user_type === 'internal' ? 'Nội bộ' : 'Community'}
                    </span>
                  </td>
                  <td className="t-xp">{u.total_xp} XP</td>
                  <td>{u.current_streak_days} ngày</td>
                  <td style={{ fontSize: '11.5px', color: 'var(--ink-light)', fontWeight: '700' }}>
                    {u.last_active_date || 'Chưa rõ'}
                  </td>
                  <td>
                    <div className="t-actions">
                      <button className="t-action-btn">✏️</button>
                      <button className="t-action-btn">📊</button>
                      <button className="t-action-btn danger">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <div className="pg-info">Hiển thị {users?.length || 0} học viên</div>
            <div className="pg-btns">
              <button className="pg-btn">‹</button>
              <button className="pg-btn active">1</button>
              <button className="pg-btn">›</button>
            </div>
          </div>
        </div>
      </div>

      {/*  ══ PROGRESS ══  */}
</>)}
{activeTab === 's-progress' && (<>
<div className="admin-screen active" id="s-progress">
        <div className="qs-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '18px' }}>
          <div className="qs-card"><div className="qs-icon">🎯</div><div><div className="qs-val">73%</div><div className="qs-lbl">Completion rate</div></div></div>
          <div className="qs-card"><div className="qs-icon">⏱️</div><div><div className="qs-val">4.2h</div><div className="qs-lbl">Học TB/tuần</div></div></div>
          <div className="qs-card"><div className="qs-icon">📉</div><div><div className="qs-val">18%</div><div className="qs-lbl">Drop-off rate</div></div></div>
          <div className="qs-card"><div className="qs-icon">🔁</div><div><div className="qs-val">68%</div><div className="qs-lbl">Quiz pass rate</div></div></div>
        </div>

        <div className="table-card">
          <div className="table-top">
            <h3>Tiến độ học viên theo khoá học</h3>
            <div className="table-filters">
              <select className="tf-select">
                <option>Tất cả khoá học</option>
                <option>Tư duy phản biện</option>
                <option>Quản lý tài chính</option>
                <option>Kỹ năng xin việc</option>
              </select>
              <button className="btn-sec" onClick={() => alert("Đang xuất CSV...")}>⬇ Xuất CSV</button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Học viên</th>
                <th>Khoá học</th>
                <th>Tiến độ</th>
                <th>Bài hoàn thành</th>
                <th>Quiz pass</th>
                <th>XP từ khoá</th>
                <th>Lần cuối học</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="t-name"><div className="t-av" style={{ background: 'linear-gradient(135deg,#FF6B35,#F7931E)' }}>MT</div><div><div className="t-uname">Minh Tuấn</div></div></div></td>
                <td><div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--ink-mid)' }}>🧠 Tư duy phản biện</div></td>
                <td><div className="t-prog"><div className="t-prog-bar"><div className="t-prog-f" style={{ width: '100%', background: 'var(--teal)' }}></div></div><div className="t-prog-txt">100%</div></div></td>
                <td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--ink)' }}>8 / 8</td>
                <td><span className="t-tag pub">Đạt 100%</span></td>
                <td className="t-xp">+150 XP</td>
                <td style={{ fontSize: '11.5px', color: 'var(--ink-light)', fontWeight: '700' }}>Hôm nay</td>
                <td><span className="t-tag pub">✓ Hoàn thành</span></td>
              </tr>
              <tr>
                <td><div className="t-name"><div className="t-av" style={{ background: 'linear-gradient(135deg,#06D6A0,#04A87D)' }}>LA</div><div><div className="t-uname">Lan Anh</div></div></div></td>
                <td><div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--ink-mid)' }}>💰 Quản lý tài chính</div></td>
                <td><div className="t-prog"><div className="t-prog-bar"><div className="t-prog-f" style={{ width: '60%', background: 'var(--gold)' }}></div></div><div className="t-prog-txt">60%</div></div></td>
                <td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--ink)' }}>6 / 10</td>
                <td><span className="t-tag draft">Đạt 80%</span></td>
                <td className="t-xp">+90 XP</td>
                <td style={{ fontSize: '11.5px', color: 'var(--ink-light)', fontWeight: '700' }}>Hôm qua</td>
                <td><span className="t-tag" style={{ background: 'var(--blue-l)', color: '#0A5A80' }}>Đang học</span></td>
              </tr>
              <tr>
                <td><div className="t-name"><div className="t-av" style={{ background: 'linear-gradient(135deg,#7B2FBE,#5B1F9E)' }}>HD</div><div><div className="t-uname">Hoàng Đức</div></div></div></td>
                <td><div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--ink-mid)' }}>💼 Kỹ năng xin việc</div></td>
                <td><div className="t-prog"><div className="t-prog-bar"><div className="t-prog-f" style={{ width: '15%', background: 'var(--blue)' }}></div></div><div className="t-prog-txt">15%</div></div></td>
                <td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--ink)' }}>2 / 12</td>
                <td><span className="t-tag" style={{ background: 'var(--red-l)', color: 'var(--red)' }}>Chưa làm</span></td>
                <td className="t-xp">+20 XP</td>
                <td style={{ fontSize: '11.5px', color: 'var(--ink-light)', fontWeight: '700' }}>2 ngày trước</td>
                <td><span className="t-tag" style={{ background: 'var(--blue-l)', color: '#0A5A80' }}>Đang học</span></td>
              </tr>
              <tr>
                <td><div className="t-name"><div className="t-av" style={{ background: 'linear-gradient(135deg,#F7931E,#FFD23F)' }}>BL</div><div><div className="t-uname">Bảo Long</div></div></div></td>
                <td><div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--ink-mid)' }}>🗣️ Nói trước đám đông</div></td>
                <td><div className="t-prog"><div className="t-prog-bar"><div className="t-prog-f" style={{ width: '40%', background: 'linear-gradient(90deg,var(--g1),var(--g2))' }}></div></div><div className="t-prog-txt">40%</div></div></td>
                <td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--ink)' }}>3 / 8</td>
                <td><span className="t-tag draft">Đạt 67%</span></td>
                <td className="t-xp">+55 XP</td>
                <td style={{ fontSize: '11.5px', color: 'var(--ink-light)', fontWeight: '700' }}>Hôm nay</td>
                <td><span className="t-tag" style={{ background: 'var(--blue-l)', color: '#0A5A80' }}>Đang học</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/*  ══ COURSES ══  */}
</>)}
{activeTab === 's-courses' && (<>
<div className="admin-screen active" id="s-courses">
        <div className="table-card">
          <div className="table-top">
            <h3>Quản lý khoá học</h3>
            <div className="table-filters">
              <input className="tf-input" id="courses-search" placeholder="🔍 Tìm khoá học..."  />
              <select className="tf-select" id="courses-status-filter" >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <select className="tf-select" id="courses-cat-filter" >
                <option value="all">Tất cả danh mục</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.key}>{cat.name}</option>
                ))}
              </select>
              <button className="btn-pri" onClick={() => { setActiveCourseId(null); goTo('s-editor'); }}>+ Khoá học mới</button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Khoá học</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Bài học</th>
                <th>Học viên</th>
                <th>Hoàn thành</th>
                <th>Rating</th>
                <th>Offline</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody id="courses-tbody">
  {courses?.map((course: any) => (
    <tr key={course.id}>
      <td><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#0A2E24,#0F3D30)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{course.thumbnail_emoji || '📚'}</div><div><div className="t-uname">{course.title}</div><div className="t-email">{course.difficulty_level} · {course.total_duration_minutes}m</div></div></div></td>
      <td><span className="t-tag" style={{ background: 'var(--teal-l)', color: 'var(--teal-d)' }}>{course.category}</span></td>
      <td><span className={"t-tag " + (course.is_published ? "pub" : "draft")}>{course.is_published ? "✓ Published" : "📝 Draft"}</span></td>
      <td style={{ fontSize: '13px', fontWeight: '800' }}>{course.total_lessons || 0} bài</td>
      <td style={{ fontSize: '13px', fontWeight: '800' }}>0</td>
      <td><span className="t-prog-txt" style={{ color: 'var(--green)' }}>0%</span></td>
      <td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--gold)' }}>★ {course.avg_rating || '5.0'}</td>
      <td><span className={"t-tag " + (course.is_offline_available ? "pub" : "")}>{course.is_offline_available ? "✓" : "✕"}</span></td>
      <td><div className="t-actions">
    <button className="t-action-btn" onClick={() => {
    setActiveCourseId(course.id);
    goTo('s-editor');
  }} title="Chỉnh sửa chi tiết khóa học">✏️</button>
    <button className="t-action-btn danger">🗑️</button>
  </div></td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>

      {/*  ══ EDITOR ══  */}
</>)}
{activeTab === 's-editor' && (<>
<div className="admin-screen active" id="s-editor">
        <div className="editor-layout">
          <div>
            <div className="editor-card">
              <h3>📝 Thông tin khoá học</h3>
              <div className="form-group">
                <label className="form-label">Tiêu đề khoá học *</label>
                <input className="form-input" id="ed-title" placeholder="VD: Quản lý thời gian hiệu quả" defaultValue=""  />
              </div>
              <div className="form-group">
                <label className="form-label">Slug (URL)</label>
                <input className="form-input" id="ed-slug" placeholder="quan-ly-thoi-gian" style={{ fontFamily: 'monospace' }} />
                <div className="form-hint">academy.nlt/khoa-hoc/quan-ly-thoi-gian</div>
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả khoá học</label>
                <textarea className="form-textarea" id="ed-desc" placeholder="Mô tả ngắn gọn nội dung và giá trị học viên nhận được..."></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Danh mục</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <select className="form-select" id="editor-cat-select" style={{ flex: '1' }}>
                      {categories?.map((cat: any) => (
                        <option key={cat.id} value={cat.key}>{cat.name}</option>
                      ))}
                    </select>
                    <button type="button" className="btn-pri" id="editor-add-cat-btn" style={{ height: "40px", padding: "0 12px", whiteSpace: "nowrap", flexShrink: "0", fontSize: "12px" }} title="Thêm danh mục mới" onClick={() => openModal(setQuickCatModalOpen)}>+ Danh mục</button>
                  </div>
                  <div id="editor-cat-preview" style={{ marginTop: '7px', display: 'none', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg)', borderRadius: 'var(--r-xs)' }}>
                    <span id="editor-cat-pill" style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '20px', display: 'inline-block' }}>🧠 Tư duy</span>
                    <span style={{ fontSize: '11px', color: 'var(--ink-light)', fontWeight: '700' }}>Danh mục được chọn</span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Cấp độ</label>
                  <select className="form-select" id="ed-level">
                    <option value="co_ban">Cơ bản</option>
                    <option value="trung_cap">Trung cấp</option>
                    <option value="nang_cao">Nâng cao</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">XP khi hoàn thành</label>
                  <input className="form-input" id="ed-xp" type="number" defaultValue="150" />
                </div>
                <div className="form-group">
                  <label className="form-label">Chứng chỉ liên kết</label>
                  <select className="form-select">
                    <option>Không có</option>
                    <option>NLT Tư duy & Phân tích</option>
                    <option>NLT Tài chính Cá nhân</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Thumbnail Emoji</label>
                <div className="emoji-pick" id="emoji-pick">
                  <div className="emoji-opt selected" >🧠</div>
                  <div className="emoji-opt" >💰</div>
                  <div className="emoji-opt" >💼</div>
                  <div className="emoji-opt" >🗣️</div>
                  <div className="emoji-opt" >🌱</div>
                  <div className="emoji-opt" >📖</div>
                  <div className="emoji-opt" >🎯</div>
                  <div className="emoji-opt" >🚀</div>
                  <div className="emoji-opt" >⚡</div>
                  <div className="emoji-opt" >🏆</div>
                </div>
              </div>
            </div>

            <div className="editor-card">
              <h3>📚 Modules & Bài học</h3>
              

<div className="mod-list">
  {activeCourseId ? (
    courseModules?.map((mod: any) => (
      <div className="mod-item" style={{ flexDirection: 'column', alignItems: 'stretch' }} key={mod.id}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="mod-drag">⣿</span>
          {editingModuleId === mod.id ? (
            <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
              <input 
                autoFocus
                className="form-input" 
                style={{ padding: '4px 8px', minHeight: 'auto', fontSize: '13px' }} 
                value={editingModuleTitle} 
                onChange={(e) => setEditingModuleTitle(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && editingModuleTitle.trim()) {
                    updateModule.mutate({ id: mod.id, payload: { title: editingModuleTitle } }, { onSuccess: () => setEditingModuleId(null) });
                  } else if (e.key === 'Escape') {
                    setEditingModuleId(null);
                  }
                }}
              />
              <button className="btn-pri" style={{ padding: '0 10px', height: '28px', fontSize: '12px' }} onClick={() => {
                if (editingModuleTitle.trim()) updateModule.mutate({ id: mod.id, payload: { title: editingModuleTitle } }, { onSuccess: () => setEditingModuleId(null) });
              }}>Lưu</button>
              <button className="btn-sec" style={{ padding: '0 10px', height: '28px', fontSize: '12px' }} onClick={() => setEditingModuleId(null)}>Hủy</button>
            </div>
          ) : (
            <>
              <span className="mod-title">{mod.title}</span>
              <span className="mod-meta">{mod.lessons?.length || 0} bài học</span>
              <div className="mod-item-actions" style={{ marginLeft: 'auto' }}>
                <button className="t-action-btn" onClick={() => {
                  setEditingModuleTitle(mod.title);
                  setEditingModuleId(mod.id);
                }}>✏️</button>
                <button className="t-action-btn danger" onClick={() => {
                  setConfirmDelete({ type: 'module', id: mod.id, title: mod.title });
                }}>🗑️</button>
              </div>
            </>
          )}
        </div>
        <div className="mod-lesson-list" style={{ width: '100%' }}>
          {mod.lessons?.map((les: any) => (
            <div className="mod-lesson-item" key={les.id}>
              <span className="ml-icon">{les.lesson_type === 'quiz' ? '📝' : '🛠️'}</span>
              
              {editingLessonId === les.id ? (
                <div style={{ display: 'flex', gap: '6px', flex: 1, alignItems: 'center' }}>
                  <input 
                    autoFocus
                    className="form-input" 
                    style={{ padding: '2px 6px', minHeight: 'auto', fontSize: '12px' }} 
                    value={editingLessonTitle} 
                    onChange={(e) => setEditingLessonTitle(e.target.value)} 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && editingLessonTitle.trim()) {
                        updateLesson.mutate({ id: les.id, payload: { title: editingLessonTitle } }, { onSuccess: () => setEditingLessonId(null) });
                      } else if (e.key === 'Escape') {
                        setEditingLessonId(null);
                      }
                    }}
                  />
                  <button className="btn-pri" style={{ padding: '0 8px', height: '24px', fontSize: '11px' }} onClick={() => {
                    if (editingLessonTitle.trim()) updateLesson.mutate({ id: les.id, payload: { title: editingLessonTitle } }, { onSuccess: () => setEditingLessonId(null) });
                  }}>Lưu</button>
                  <button className="btn-sec" style={{ padding: '0 8px', height: '24px', fontSize: '11px' }} onClick={() => setEditingLessonId(null)}>Hủy</button>
                </div>
              ) : (
                <>
                  <span className="ml-title">{les.title}</span>
                  <span className="ml-type tag-gold">{les.lesson_type}</span>
                  <span className="ml-xp">+{les.xp_on_complete} XP</span>
                  <button className="t-action-btn" style={{ marginLeft: '8px' }} onClick={() => {
                    setEditingLessonTitle(les.title);
                    setEditingLessonId(les.id);
                  }}>✏️</button>
                  <button className="t-action-btn danger" style={{ marginLeft: '4px' }} onClick={() => {
                    setConfirmDelete({ type: 'lesson', id: les.id, title: les.title });
                  }}>🗑️</button>
                </>
              )}
            </div>
          ))}
          <div className="mod-lesson-item" style={{ border: '1.5px dashed var(--border)', cursor: 'pointer', background: 'transparent' }} >
            <span style={{ color: 'var(--ink-light)', fontSize: '12px', fontWeight: '800', width: '100%', textAlign: 'center' }} onClick={() => {
              setActiveModuleId(mod.id);
              openModal(setLessonModalOpen);
            }}>+ Thêm bài học/quiz</span>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--ink-light)', fontSize: '12px' }}>
      Vui lòng lưu khoá học (hoặc chọn ✏️ sửa khóa học từ bảng) trước khi thêm module.
    </div>
  )}

  {isAddingModule && activeCourseId && (
    <div className="mod-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={{ display: 'flex', gap: '8px', padding: '10px' }}>
        <input 
          autoFocus
          className="form-input" 
          placeholder="Nhập tên module mới..."
          value={newModuleTitle} 
          onChange={(e) => setNewModuleTitle(e.target.value)} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newModuleTitle.trim()) {
              createModule.mutate({ course_id: activeCourseId, title: newModuleTitle }, { 
                onSuccess: () => { setIsAddingModule(false); setNewModuleTitle(''); } 
              });
            } else if (e.key === 'Escape') {
              setIsAddingModule(false); setNewModuleTitle('');
            }
          }}
        />
        <button className="btn-pri" style={{ whiteSpace: 'nowrap' }} onClick={() => {
          if (newModuleTitle.trim()) {
            createModule.mutate({ course_id: activeCourseId, title: newModuleTitle }, { 
              onSuccess: () => { setIsAddingModule(false); setNewModuleTitle(''); } 
            });
          }
        }}>Thêm</button>
        <button className="btn-sec" onClick={() => { setIsAddingModule(false); setNewModuleTitle(''); }}>Hủy</button>
      </div>
    </div>
  )}
</div>

{!isAddingModule && (
  <button className="add-mod-btn" type="button" onClick={() => {
    if (!activeCourseId) {
      alert('Vui lòng chọn khóa học để thêm!');
      return;
    }
    setIsAddingModule(true);
  }}>➕ Thêm module</button>
)}


            </div>
          </div>

          {/*  Right panel  */}
          <div>
            <div className="editor-card">
              <h3>⚙️ Cài đặt & Publish</h3>
              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Published</div>
                  <div className="toggle-sub">Học viên có thể thấy & đăng ký</div>
                </div>
                <div className="toggle" id="toggle-pub" data-field="published" ></div>
              </div>
              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Offline Available</div>
                  <div className="toggle-sub">Cho phép tải về học offline</div>
                </div>
                <div className="toggle on" id="toggle-offline" data-field="offline" ></div>
              </div>
              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Prerequisite unlock</div>
                  <div className="toggle-sub">Khoá bài tiếp theo cho đến khi xong bài trước</div>
                </div>
                <div className="toggle on" id="toggle-prereq" ></div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input type="hidden" id="ed-course-key" />
                <button className="btn-pri" type="button" onClick={handleCourseSubmit} style={{ justifyContent: "center", height: "40px", fontSize: "13.5px" }}>💾 Lưu nháp</button>
                <button className="btn-pri" type="button" onClick={handleCourseSubmit} style={{ justifyContent: "center", height: "40px", fontSize: "13.5px", background: "linear-gradient(135deg,var(--teal),var(--teal-d))" }}>🚀 Publish ngay</button>
              </div>
            </div>

            <div className="editor-card">
              <h3>👁️ Preview</h3>
              <div style={{ background: 'var(--bg)', borderRadius: 'var(--r-xs)', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }} id="prev-emoji">🧠</div>
                <div style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }} id="prev-cat-pill">Tư duy</div>
                <div style={{ fontSize: '14px', fontWeight: '900', color: 'var(--ink)', marginBottom: '4px' }} id="prev-title">[Tên khoá học]</div>
                <div style={{ fontSize: '11.5px', color: 'var(--ink-light)', fontWeight: '700' }} id="prev-meta">0 bài · 0 phút</div>
                <div style={{ marginTop: '8px', height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '0%', height: '100%', background: 'var(--teal)', borderRadius: '2px' }}></div>
                </div>
              </div>
              <button className="btn-sec" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} >Xem trước trong app</button>
            </div>
          </div>
        </div>
      </div>

      {/*  ══ GAMIFICATION ══  */}
</>)}
{activeTab === 's-gam' && (<>
<div className="admin-screen active" id="s-gam">
        <div className="admin-sec-h">
          <h2>Thành tích & Huy hiệu</h2>
          <button className="sec-action btn-pri" onClick={() => openModal(setAchModalOpen)}>+ Thêm thành tích</button>
        </div>
        <div className="gam-grid">
          <div className="gam-card">
            <div className="gam-icon">🔥</div>
            <div className="gam-title">Streak 7 ngày</div>
            <div className="gam-desc">Học liên tục 7 ngày không nghỉ để nhận huy hiệu này</div>
            <div className="gam-condition">streak_days {'>='} 7</div>
            <div className="gam-xp"><span className="gam-xp-val">+50 XP</span><button className="gam-edit" >Chỉnh sửa</button></div>
          </div>
          <div className="gam-card">
            <div className="gam-icon">🧠</div>
            <div className="gam-title">Nhà tư duy</div>
            <div className="gam-desc">Hoàn thành khoá học tư duy đầu tiên</div>
            <div className="gam-condition">completed_courses[tuDuy] {'>='} 1</div>
            <div className="gam-xp"><span className="gam-xp-val">+75 XP</span><button className="gam-edit" >Chỉnh sửa</button></div>
          </div>
          <div className="gam-card">
            <div className="gam-icon">⭐</div>
            <div className="gam-title">300 điểm NLT</div>
            <div className="gam-desc">Tích lũy đủ 300 XP học tập</div>
            <div className="gam-condition">total_xp {'>='} 300</div>
            <div className="gam-xp"><span className="gam-xp-val">+30 XP</span><button className="gam-edit" >Chỉnh sửa</button></div>
          </div>
          <div className="gam-card">
            <div className="gam-icon">🎓</div>
            <div className="gam-title">Tốt nghiệp L1</div>
            <div className="gam-desc">Tích lũy 500 XP để đạt cấp độ tiếp theo</div>
            <div className="gam-condition">total_xp {'>='} 500</div>
            <div className="gam-xp"><span className="gam-xp-val">+100 XP</span><button className="gam-edit" >Chỉnh sửa</button></div>
          </div>
          <div className="gam-card">
            <div className="gam-icon">📚</div>
            <div className="gam-title">Mọt sách</div>
            <div className="gam-desc">Hoàn thành 5 khoá học bất kỳ</div>
            <div className="gam-condition">total_completed_courses {'>='} 5</div>
            <div className="gam-xp"><span className="gam-xp-val">+150 XP</span><button className="gam-edit" >Chỉnh sửa</button></div>
          </div>
          <div className="gam-card" style={{ border: "2px dashed var(--border)", boxShadow: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", minHeight: "150px" }} onClick={() => openModal(setAchModalOpen)}>
            <div style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--ink-light)' }}>➕</div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--ink-light)' }}>Thêm thành tích mới</div>
          </div>
        </div>

        {/*  XP Ledger overview  */}
        <div className="table-card">
          <div className="table-top"><h3>XP Phát hôm nay</h3>
            <div className="table-filters">
              <button className="btn-sec" onClick={() => alert("Đang xuất CSV...")}>⬇ Xuất CSV</button>
            </div>
          </div>
          <table>
            <thead><tr><th>Học viên</th><th>Lý do</th><th>XP</th><th>Thời gian</th><th>Nguồn</th></tr></thead>
            <tbody>
              <tr><td><div className="t-name"><div className="t-av" style={{ background: 'linear-gradient(135deg,#FF6B35,#F7931E)' }}>MT</div><div className="t-uname">Minh Tuấn</div></div></td><td style={{ fontSize: '12.5px', color: 'var(--ink-mid)', fontWeight: '700' }}>Hoàn thành bài: Tư duy phản biện</td><td className="t-xp">+25</td><td style={{ fontSize: '11.5px', color: 'var(--ink-light)', fontWeight: '700' }}>10:34</td><td><span className="t-tag" style={{ background: 'var(--teal-l)', color: 'var(--teal-d)' }}>lesson</span></td></tr>
              <tr><td><div className="t-name"><div className="t-av" style={{ background: 'linear-gradient(135deg,#06D6A0,#04A87D)' }}>LA</div><div className="t-uname">Lan Anh</div></div></td><td style={{ fontSize: '12.5px', color: 'var(--ink-mid)', fontWeight: '700' }}>Nhận chứng chỉ NLT Tư duy</td><td className="t-xp">+200</td><td style={{ fontSize: '11.5px', color: 'var(--ink-light)', fontWeight: '700' }}>09:15</td><td><span className="t-tag" style={{ background: 'var(--purple-l)', color: 'var(--purple)' }}>cert</span></td></tr>
              <tr><td><div className="t-name"><div className="t-av" style={{ background: 'linear-gradient(135deg,#F7931E,#FFD23F)' }}>BL</div><div className="t-uname">Bảo Long</div></div></td><td style={{ fontSize: '12.5px', color: 'var(--ink-mid)', fontWeight: '700' }}>Quiz đúng — Quản lý tài chính B3</td><td className="t-xp">+15</td><td style={{ fontSize: '11.5px', color: 'var(--ink-light)', fontWeight: '700' }}>08:50</td><td><span className="t-tag" style={{ background: 'var(--gold-l)', color: '#A06000' }}>quiz</span></td></tr>
              <tr><td><div className="t-name"><div className="t-av" style={{ background: 'linear-gradient(135deg,#7B2FBE,#5B1F9E)' }}>HD</div><div className="t-uname">Hoàng Đức</div></div></td><td style={{ fontSize: '12.5px', color: 'var(--ink-mid)', fontWeight: '700' }}>Đạt thành tích: Streak 7 ngày</td><td className="t-xp">+50</td><td style={{ fontSize: '11.5px', color: 'var(--ink-light)', fontWeight: '700' }}>08:00</td><td><span className="t-tag" style={{ background: '#FEF0EB', color: '#B03A18' }}>achievement</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/*  ══ CERTS ══  */}
</>)}
{activeTab === 's-certs' && (<>
<div className="admin-screen active" id="s-certs">
        <div className="admin-sec-h">
          <h2>Quản lý chứng chỉ</h2>
          <button className="btn-pri" >+ Cert mới</button>
        </div>

        <div className="qs-row" style={{ marginBottom: '18px' }}>
          <div className="qs-card"><div className="qs-icon">🎓</div><div><div className="qs-val">34</div><div className="qs-lbl">Cert đã cấp</div></div></div>
          <div className="qs-card"><div className="qs-icon">⏳</div><div><div className="qs-val">5</div><div className="qs-lbl">Chờ duyệt</div></div></div>
          <div className="qs-card"><div className="qs-icon">✅</div><div><div className="qs-val">100%</div><div className="qs-lbl">Hợp lệ</div></div></div>
        </div>

        <div className="cert-list" style={{ marginBottom: '20px' }}>
          <div className="cert-item">
            <div className="cert-icon-wrap">🧠</div>
            <div className="cert-info">
              <div className="cert-title">NLT Chứng chỉ Tư duy & Phân tích</div>
              <div className="cert-desc">Cần hoàn thành 2/3 khoá tư duy để nhận chứng chỉ này</div>
              <div className="cert-req">
                <span className="cert-req-tag">🧠 Tư duy phản biện</span>
                <span className="cert-req-tag">📖 Đọc sách thông minh</span>
                <span style={{ fontSize: '10px', color: 'var(--ink-light)', fontWeight: '700' }}>+ 1 khoá khác</span>
              </div>
            </div>
            <div className="cert-stats">
              <div className="cert-count">12</div>
              <div className="cert-count-lbl">đã cấp</div>
              <button className="btn-sec" style={{ marginTop: '6px', fontSize: '11px', height: '28px', padding: '0 10px' }} >Chỉnh sửa</button>
            </div>
          </div>
          <div className="cert-item">
            <div className="cert-icon-wrap">💰</div>
            <div className="cert-info">
              <div className="cert-title">NLT Chứng chỉ Tài chính Cá nhân</div>
              <div className="cert-desc">Cần hoàn thành khoá Quản lý tài chính từ A–Z</div>
              <div className="cert-req">
                <span className="cert-req-tag">💰 Quản lý tài chính</span>
              </div>
            </div>
            <div className="cert-stats">
              <div className="cert-count">22</div>
              <div className="cert-count-lbl">đã cấp</div>
              <button className="btn-sec" style={{ marginTop: '6px', fontSize: '11px', height: '28px', padding: '0 10px' }} >Chỉnh sửa</button>
            </div>
          </div>
        </div>

        {/*  Cert issuance queue  */}
        <div className="table-card">
          <div className="table-top">
            <h3>Chứng chỉ chờ duyệt (5)</h3>
            <div className="table-filters">
              <button className="btn-pri" style={{ background: 'linear-gradient(135deg,var(--green),#16A34A)' }} >✓ Duyệt tất cả</button>
            </div>
          </div>
          <table>
            <thead><tr><th>Học viên</th><th>Chứng chỉ</th><th>Hoàn thành</th><th>XP tích lũy</th><th>Ngày đủ điều kiện</th><th style={{ textAlign: 'right' }}>Thao tác</th></tr></thead>
            <tbody>
              <tr><td><div className="t-name"><div className="t-av" style={{ background: 'linear-gradient(135deg,#FF6B35,#F7931E)' }}>TN</div><div><div className="t-uname">Thảo Ngân</div><div className="t-email">community</div></div></div></td><td style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--ink)' }}>NLT Tư duy & Phân tích</td><td style={{ fontSize: '12px', color: 'var(--ink-mid)', fontWeight: '700' }}>3/3 khoá ✓</td><td className="t-xp">420 XP</td><td style={{ fontSize: '11.5px', color: 'var(--ink-light)', fontWeight: '700' }}>01/05/2026</td><td><div className="t-actions"><button className="t-action-btn" style={{ background: 'var(--green-l)', borderColor: 'var(--green)', color: 'var(--green)' }} >✓ Cấp</button><button className="t-action-btn danger" >✕</button></div></td></tr>
              <tr><td><div className="t-name"><div className="t-av" style={{ background: 'linear-gradient(135deg,#7B2FBE,#5B1F9E)' }}>KH</div><div><div className="t-uname">Khắc Huy</div><div className="t-email">internal</div></div></div></td><td style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--ink)' }}>NLT Tài chính Cá nhân</td><td style={{ fontSize: '12px', color: 'var(--ink-mid)', fontWeight: '700' }}>1/1 khoá ✓</td><td className="t-xp">280 XP</td><td style={{ fontSize: '11.5px', color: 'var(--ink-light)', fontWeight: '700' }}>30/04/2026</td><td><div className="t-actions"><button className="t-action-btn" style={{ background: 'var(--green-l)', borderColor: 'var(--green)', color: 'var(--green)' }} >✓ Cấp</button><button className="t-action-btn danger" >✕</button></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/*  ══ ANALYTICS ══  */}
</>)}
{activeTab === 's-analytics' && (<>
<div className="admin-screen active" id="s-analytics">
        <div className="anal-kpi">
          <div className="akpi">
            <div className="akpi-title">Tỷ lệ hoàn thành</div>
            <div className="akpi-val">73%</div>
            <div className="akpi-sub">↑ +5% so với tháng trước</div>
            <div className="akpi-bar-wrap"><div className="akpi-bar" style={{ width: '73%', background: 'var(--teal)' }}></div></div>
          </div>
          <div className="akpi">
            <div className="akpi-title">Thời gian học TB/user</div>
            <div className="akpi-val">4.2h</div>
            <div className="akpi-sub">/ tuần · Mục tiêu 5h</div>
            <div className="akpi-bar-wrap"><div className="akpi-bar" style={{ width: '84%', background: 'var(--blue)' }}></div></div>
          </div>
          <div className="akpi">
            <div className="akpi-title">Quiz pass rate</div>
            <div className="akpi-val">68%</div>
            <div className="akpi-sub">↓ -3% so tháng trước</div>
            <div className="akpi-bar-wrap"><div className="akpi-bar" style={{ width: '68%', background: 'var(--gold)' }}></div></div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
          {/*  Funnel  */}
          <div className="funnel-wrap">
            <div className="funnel-hd"><h3>Funnel học tập</h3><span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--ink-light)' }}>tháng 4/2026</span></div>
            <div className="funnel-item">
              <div className="fi-top"><span className="fi-lbl">Đăng ký khoá</span><span className="fi-val">1,482</span></div>
              <div className="fi-bar"><div className="fi-fill" style={{ width: '100%', background: 'var(--purple)' }}></div></div>
              <div className="fi-pct">100%</div>
            </div>
            <div className="funnel-item">
              <div className="fi-top"><span className="fi-lbl">Bắt đầu học (≥1 bài)</span><span className="fi-val">1,241</span></div>
              <div className="fi-bar"><div className="fi-fill" style={{ width: '84%', background: 'var(--blue)' }}></div></div>
              <div className="fi-pct">84%</div>
            </div>
            <div className="funnel-item">
              <div className="fi-top"><span className="fi-lbl">Đến giữa khoá (≥50%)</span><span className="fi-val">890</span></div>
              <div className="fi-bar"><div className="fi-fill" style={{ width: '60%', background: 'var(--teal)' }}></div></div>
              <div className="fi-pct">60%</div>
            </div>
            <div className="funnel-item">
              <div className="fi-top"><span className="fi-lbl">Hoàn thành toàn bộ</span><span className="fi-val">1,082</span></div>
              <div className="fi-bar"><div className="fi-fill" style={{ width: '73%', background: 'var(--green)' }}></div></div>
              <div className="fi-pct">73%</div>
            </div>
            <div className="funnel-item">
              <div className="fi-top"><span className="fi-lbl">Nhận chứng chỉ</span><span className="fi-val">34</span></div>
              <div className="fi-bar"><div className="fi-fill" style={{ width: '2%', background: 'var(--gold)' }}></div></div>
              <div className="fi-pct">2.3%</div>
            </div>
          </div>

          {/*  Leaderboard  */}
          <div className="leaderboard">
            <div className="lb-hd"><h3>Top học viên tháng này</h3><button className="sec-action" >Xem tất cả</button></div>
            <div className="lb-row">
              <div className="lb-rank top">🥇</div>
              <div className="lb-av" style={{ background: 'linear-gradient(135deg,#FF6B35,#F7931E)' }}>BL</div>
              <div><div className="lb-name">Bảo Long</div><div className="lb-type">Community · 🔥 14 ngày</div></div>
              <div className="lb-xp">840 XP</div>
            </div>
            <div className="lb-row">
              <div className="lb-rank top">🥈</div>
              <div className="lb-av" style={{ background: 'linear-gradient(135deg,#7B2FBE,#5B1F9E)' }}>LA</div>
              <div><div className="lb-name">Lan Anh</div><div className="lb-type">Internal · 🔥 9 ngày</div></div>
              <div className="lb-xp">720 XP</div>
            </div>
            <div className="lb-row">
              <div className="lb-rank top">🥉</div>
              <div className="lb-av" style={{ background: 'linear-gradient(135deg,#06D6A0,#04A87D)' }}>MT</div>
              <div><div className="lb-name">Minh Tuấn</div><div className="lb-type">Community · 🔥 7 ngày</div></div>
              <div className="lb-xp">650 XP</div>
            </div>
            <div className="lb-row">
              <div className="lb-rank">4</div>
              <div className="lb-av" style={{ background: 'linear-gradient(135deg,#118AB2,#0A5A80)' }}>TN</div>
              <div><div className="lb-name">Thảo Ngân</div><div className="lb-type">Internal · 🔥 5 ngày</div></div>
              <div className="lb-xp">580 XP</div>
            </div>
            <div className="lb-row">
              <div className="lb-rank">5</div>
              <div className="lb-av" style={{ background: 'linear-gradient(135deg,#F7931E,#FFD23F)' }}>HD</div>
              <div><div className="lb-name">Hoàng Đức</div><div className="lb-type">Community · 🔥 3 ngày</div></div>
              <div className="lb-xp">420 XP</div>
            </div>
          </div>
        </div>

        {/*  Course performance table  */}
        <div className="table-card">
          <div className="table-top"><h3>Hiệu suất từng khoá học</h3>
            <div className="table-filters">
              <button className="btn-sec" onClick={() => alert("Đang xuất CSV...")}>⬇ Xuất CSV</button>
            </div>
          </div>
          <table>
            <thead><tr><th>Khoá học</th><th>Đăng ký</th><th>Đang học</th><th>Hoàn thành</th><th>Drop-off</th><th>Rating TB</th><th>XP tổng cấp</th></tr></thead>
            <tbody>
              <tr><td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>🧠</span><span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--ink)' }}>Tư duy phản biện</span></div></td><td style={{ fontSize: '13px', fontWeight: '800' }}>1,240</td><td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--blue)' }}>342</td><td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--green)' }}>898</td><td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--red)' }}>8%</td><td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--gold)' }}>★ 4.9</td><td className="t-xp">186,000</td></tr>
              <tr><td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>💰</span><span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--ink)' }}>Quản lý tài chính</span></div></td><td style={{ fontSize: '13px', fontWeight: '800' }}>892</td><td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--blue)' }}>210</td><td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--green)' }}>544</td><td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--red)' }}>15%</td><td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--gold)' }}>★ 4.9</td><td className="t-xp">136,000</td></tr>
              <tr><td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>💼</span><span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--ink)' }}>Kỹ năng xin việc</span></div></td><td style={{ fontSize: '13px', fontWeight: '800' }}>654</td><td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--blue)' }}>180</td><td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--green)' }}>314</td><td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--red)' }}>24%</td><td style={{ fontSize: '13px', fontWeight: '800', color: 'var(--gold)' }}>★ 4.8</td><td className="t-xp">112,000</td></tr>
            </tbody>
          </table>
        </div>
      </div>


      {/*  ══ CATEGORIES ══  */}
</>)}
{activeTab === 's-categories' && (<>
<div className="admin-screen active" id="s-categories">
        <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '20px' }}>
          <div className="kpi-card k-purple">
            <div className="kpi-icon">🏷️</div>
            <div className="kpi-val" id="cat-total-count">5</div>
            <div className="kpi-lbl">Danh mục hiện có</div>
            <div className="kpi-delta up">↑ Tất cả đang active</div>
          </div>
          <div className="kpi-card k-teal">
            <div className="kpi-icon">📚</div>
            <div className="kpi-val">8</div>
            <div className="kpi-lbl">Khoá học đã liên kết</div>
            <div className="kpi-delta up">↑ 3 published</div>
          </div>
          <div className="kpi-card k-gold">
            <div className="kpi-icon">⭐</div>
            <div className="kpi-val">4.87</div>
            <div className="kpi-lbl">Rating TB toàn danh mục</div>
            <div className="kpi-delta up">↑ Xuất sắc</div>
          </div>
        </div>
        <div className="admin-sec-h">
          <h2>Danh sách danh mục</h2>
          <button className="btn-pri" onClick={() => openModal(setCategoryModalOpen)}>+ Thêm danh mục</button>
        </div>
        <div id="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '20px' }}>
  {categories?.map((cat: any) => (
    <div key={cat.id} style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: 'var(--sh)', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ fontSize: '2rem' }}>{cat.emoji}</div>
      <div>
        <div style={{ fontWeight: 800, fontSize: '14px' }}>{cat.name}</div>
        <div style={{ fontSize: '11px', color: 'var(--ink-light)' }}>ID: {cat.key}</div>
      </div>
    </div>
  ))}
</div>
        <div className="table-card">
          <div className="table-top">
            <h3>Khoá học theo danh mục</h3>
            <div className="table-filters">
              <select className="tf-select" id="cat-filter-select" >
                <option value="all">Tất cả danh mục</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.key}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <table>
            <thead><tr><th>Khoá học</th><th>Danh mục</th><th>Trạng thái</th><th>Học viên</th><th>Rating</th><th style={{ textAlign: 'right' }}>Thao tác</th></tr></thead>
            <tbody id="cat-courses-tbody"></tbody>
          </table>
        </div>
      </div>
    </>)}
    </div>{/*  /content  */}
  </div>

{/*  Modal: Add/Edit Category  */}
{isCategoryModalOpen && (
<div className="modal-overlay" style={{ display: "flex" }} id="modal-category">
  <div className="modal" style={{ width: '520px', maxWidth: '92vw' }}>
    <form onSubmit={handleCategorySubmit}>
    <div className="modal-hd">
      <h3 id="modal-cat-title">➕ Thêm danh mục mới</h3>
      <button type="button" className="modal-close" onClick={() => closeModal(setCategoryModalOpen)}>✕</button>
    </div>
    <input type="hidden" id="cat-edit-key" />
    <div className="form-group">
      <label className="form-label">Tên danh mục (hiển thị) *</label>
      <input className="form-input" name="name" id="cat-name-input" placeholder="VD: Lãnh đạo"  />
    </div>
    <div className="form-group">
      <label className="form-label">Key (code định danh) *</label>
      <input className="form-input" name="key" id="cat-key-input" placeholder="VD: lanhDao" style={{ fontFamily: 'monospace' }} />
      <div className="form-hint">Dùng trong DB CHECK constraint. Không nên đổi sau khi có khoá học liên kết.</div>
    </div>
    <div className="form-group">
      <label className="form-label">Mô tả ngắn</label>
      <textarea className="form-textarea" name="description" id="cat-desc-input" style={{ minHeight: '60px' }} placeholder="Mô tả nội dung thuộc danh mục này..."></textarea>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Icon Emoji *</label>
        <input className="form-input" name="emoji" id="cat-emoji-input" placeholder="🧠" maxLength={4} style={{ fontSize: '1.3rem', textAlign: 'center' }}  />
      </div>
      <div className="form-group">
        <label className="form-label">Màu chủ đạo</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="color" id="cat-color-input" defaultValue="#06D6A0" style={{ width: '44px', height: '36px', border: '1.5px solid var(--border)', borderRadius: '8px', cursor: 'pointer', padding: '2px' }}  />
          <input className="form-input" id="cat-color-hex" defaultValue="#06D6A0" style={{ fontFamily: 'monospace', flex: '1' }}  />
        </div>
      </div>
    </div>
    <div className="form-group">
      <label className="form-label">Preview pill</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--bg)', borderRadius: 'var(--r-xs)' }}>
        <span id="cat-preview-pill" style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '20px', background: '#E0FBF4', color: '#04A87D', display: 'inline-block' }}>🧠 Tư duy</span>
        <span style={{ fontSize: '11px', color: 'var(--ink-light)', fontWeight: '700' }}>← Cập nhật realtime</span>
      </div>
    </div>
    <div className="form-group">
      <label className="form-label">Trạng thái</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 0' }}>
        <div className="toggle on" id="cat-active-toggle" ></div>
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink-mid)' }}>Hiển thị cho học viên</span>
      </div>
    </div>
    <div className="modal-footer">
      <button className="btn-sec" onClick={() => closeModal(setCategoryModalOpen)}>Hủy</button>
      <button className="btn-pri" type="submit">💾 Lưu danh mục</button>
    </div>
    </form>
  </div>
</div>
)}
{/*  Modal: Confirm Delete Category  */}
{isCatDeleteModalOpen && (
<div className="modal-overlay" style={{ display: "flex" }} id="modal-cat-delete">
  <div className="modal" style={{ width: '420px', maxWidth: '92vw' }}>
    <div className="modal-hd">
      <h3>⚠️ Xoá danh mục</h3>
      <button type="button" className="modal-close" onClick={() => closeModal(setCatDeleteModalOpen)}>✕</button>
    </div>
    <div style={{ padding: '8px 0 16px', textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '10px' }} id="del-cat-emoji">🏷️</div>
      <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--ink)', marginBottom: '8px' }} id="del-cat-name">Danh mục</div>
      <div style={{ fontSize: '13px', color: 'var(--ink-mid)', fontWeight: '700', lineHeight: '1.6' }}>Danh mục này đang có <b id="del-cat-courses" style={{ color: 'var(--red)' }}>0 khoá học</b> liên kết.<br />Khoá học sẽ mất tag danh mục nhưng không bị xoá.</div>
      <div style={{ background: 'var(--red-l)', border: '1.5px solid rgba(239,68,68,.2)', borderRadius: 'var(--r-xs)', padding: '10px 14px', marginTop: '14px', fontSize: '12px', fontWeight: '700', color: 'var(--red)', textAlign: 'left' }}>⚠️ Thao tác này không thể hoàn tác. Hãy cập nhật khoá học liên quan sau khi xoá.</div>
    </div>
    <div className="modal-footer">
      <button className="btn-sec" onClick={() => closeModal(setCatDeleteModalOpen)}>Hủy</button>
      <button className="btn-pri" style={{ background: 'linear-gradient(135deg,var(--red),#B91C1C)' }} >🗑️ Xác nhận xoá</button>
    </div>
  </div>
</div>
)}
{/*  Modal: Quick Add Category (from Editor)  */}
{isQuickCatModalOpen && (
<div className="modal-overlay" style={{ display: "flex" }} id="modal-quick-cat">
  <div className="modal" style={{ width: '460px', maxWidth: '92vw' }}>
    <div className="modal-hd">
      <h3>➕ Thêm danh mục nhanh</h3>
      <button type="button" className="modal-close" onClick={() => closeModal(setQuickCatModalOpen)}>✕</button>
    </div>
    <div style={{ background: 'var(--purple-l)', border: '1.5px solid rgba(123,47,190,.15)', borderRadius: 'var(--r-xs)', padding: '10px 14px', fontSize: '12px', fontWeight: '700', color: 'var(--purple)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span>💡</span> Danh mục sẽ được thêm ngay vào hệ thống và tự động chọn cho khoá học này.
    </div>
    <div className="form-group">
      <label className="form-label">Tên danh mục *</label>
      <input className="form-input" id="qcat-name" placeholder="VD: Lãnh đạo"  />
    </div>
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Key (code) *</label>
        <input className="form-input" id="qcat-key" placeholder="VD: lanhDao" style={{ fontFamily: 'monospace' }}  />
        <div className="form-hint">Không đổi sau khi có khoá học.</div>
      </div>
      <div className="form-group">
        <label className="form-label">Icon Emoji *</label>
        <input className="form-input" id="qcat-emoji" placeholder="🏆" maxLength={4} style={{ fontSize: '1.3rem', textAlign: 'center' }}  />
      </div>
    </div>
    <div className="form-group">
      <label className="form-label">Màu chủ đạo</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="color" id="qcat-color-pick" defaultValue="#7B2FBE" style={{ width: '44px', height: '36px', border: '1.5px solid var(--border)', borderRadius: '8px', cursor: 'pointer', padding: '2px' }}  />
        <input className="form-input" id="qcat-color-hex" defaultValue="#7B2FBE" style={{ fontFamily: 'monospace', flex: '1' }}  />
      </div>
    </div>
    {/*  Live preview pill  */}
    <div style={{ padding: '10px 14px', background: 'var(--bg)', borderRadius: 'var(--r-xs)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
      <span id="qcat-preview-pill" style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '20px', background: '#F0E8FA', color: '#7B2FBE', display: 'inline-block' }}>🏆 Danh mục</span>
      <span style={{ fontSize: '11px', color: 'var(--ink-light)', fontWeight: '700' }}>← Preview realtime</span>
    </div>
    <div className="modal-footer">
      <button className="btn-sec" onClick={() => closeModal(setQuickCatModalOpen)}>Hủy</button>
      <button className="btn-pri" >✓ Thêm &amp; chọn ngay</button>
    </div>
  </div>
</div>
)}
{/*  Modals  */}
{/*  Invite User Modal  */}
{isInviteModalOpen && (
<div className="modal-overlay" style={{ display: "flex" }} id="modal-invite">
  <div className="modal">
    <form onSubmit={handleInviteSubmit}>
    <div className="modal-hd">
      <h3>📨 Mời học viên mới</h3>
      <button type="button" className="modal-close" onClick={() => closeModal(setInviteModalOpen)}>✕</button>
    </div>
    <div className="form-group">
      <label className="form-label">Email học viên *</label>
      <input className="form-input" name="email" type="email" placeholder="hocvien@email.com" />
    </div>
    <div className="form-group">
      <label className="form-label">Loại tài khoản</label>
      <select name="user_type" className="form-select">
        <option value="community">Community (mặc định)</option>
        <option value="internal">Internal (team NhiLe)</option>
      </select>
    </div>
    <div className="form-group">
      <label className="form-label">Khoá học đăng ký ngay</label>
      <select className="form-select">
        <option>-- Không chọn --</option>
        <option>🧠 Tư duy phản biện cơ bản</option>
        <option>💰 Quản lý tài chính từ A–Z</option>
        <option>💼 Kỹ năng xin việc & phỏng vấn</option>
      </select>
    </div>
    <div className="form-group">
      <label className="form-label">Team ID (nếu là Internal)</label>
      <input className="form-input" placeholder="VD: team-marketing" />
    </div>
    <div className="modal-footer">
      <button className="btn-sec" onClick={() => closeModal(setInviteModalOpen)}>Hủy</button>
      <button className="btn-pri" type="submit">📨 Gửi lời mời</button>
    </div>
    </form>
  </div>
</div>
)}
{/*  Achievement Modal  */}
{isAchModalOpen && (
<div className="modal-overlay" style={{ display: "flex" }} id="modal-ach">
  <div className="modal">
    <form onSubmit={handleAchSubmit}>
    <div className="modal-hd">
      <h3>🏆 Cấu hình thành tích</h3>
      <button type="button" className="modal-close" onClick={() => closeModal(setAchModalOpen)}>✕</button>
    </div>
    <div className="form-group">
      <label className="form-label">Key (unique) *</label>
      <input className="form-input" name="key" placeholder="VD: streak_7_days" style={{ fontFamily: 'monospace' }} />
    </div>
    <div className="form-group">
      <label className="form-label">Tên thành tích *</label>
      <input className="form-input" name="title" placeholder="VD: Streak 7 ngày" />
    </div>
    <div className="form-group">
      <label className="form-label">Mô tả</label>
      <textarea className="form-textarea" name="description" style={{ minHeight: '60px' }} placeholder="Mô tả điều kiện nhận thành tích này..."></textarea>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Icon Emoji</label>
        <input className="form-input" name="icon_emoji" defaultValue="🔥" />
      </div>
      <div className="form-group">
        <label className="form-label">XP thưởng</label>
        <input className="form-input" name="xp_reward" type="number" defaultValue="50" />
      </div>
    </div>
    <div className="form-group">
      <label className="form-label">Điều kiện kích hoạt (JSON)</label>
      <textarea className="form-textarea" name="trigger_condition" style={{ minHeight: '60px', fontFamily: 'monospace', fontSize: '12px' }} defaultValue='{"streak_days": {"gte": 7}}'></textarea>
      <div className="form-hint">Xem docs trigger_condition để biết các field hợp lệ</div>
    </div>
    <div className="modal-footer">
      <button className="btn-sec" onClick={() => closeModal(setAchModalOpen)}>Hủy</button>
      <button className="btn-pri" type="submit">💾 Lưu</button>
    </div>
    </form>
  </div>
</div>
)}
{/*  Lesson Modal  */}

{/* Custom Confirm Delete Modal */}
{confirmDelete && (
<div className="modal-overlay" style={{ display: "flex", zIndex: 1000 }}>
  <div className="modal" style={{ width: '400px' }}>
    <div className="modal-hd">
      <h3 style={{ color: 'var(--red)' }}>⚠️ Xác nhận xóa</h3>
      <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
    </div>
    <div style={{ fontSize: '14px', color: 'var(--ink-mid)', lineHeight: '1.5', margin: '15px 0' }}>
      Bạn có chắc chắn muốn xóa <strong>{confirmDelete.title}</strong>?<br/>
      Hành động này không thể hoàn tác.
    </div>
    <div className="modal-footer">
      <button className="btn-sec" onClick={() => setConfirmDelete(null)}>Hủy</button>
      <button className="btn-pri" style={{ background: 'var(--red)' }} onClick={() => {
        if (confirmDelete.type === 'module') {
          deleteModule.mutate(confirmDelete.id, { onSuccess: () => setConfirmDelete(null) });
        } else {
          deleteLesson.mutate(confirmDelete.id, { onSuccess: () => setConfirmDelete(null) });
        }
      }}>🗑️ Xác nhận xóa</button>
    </div>
  </div>
</div>
)}

{isLessonModalOpen && (
<div className="modal-overlay" style={{ display: "flex" }} id="modal-lesson">
  <div className="modal">
    
    <form onSubmit={handleLessonSubmit}>
      <input type="hidden" name="module_id" value={activeModuleId || ''} />
      <input type="hidden" name="course_id" value={activeCourseId || ''} />
    <div className="modal-hd">
      <h3>📖 Thêm bài học / Quiz</h3>
      <button type="button" className="modal-close" onClick={() => closeModal(setLessonModalOpen)}>✕</button>
    </div>
    <div className="form-group">
      <label className="form-label">Tiêu đề bài học *</label>
      <input className="form-input" name="title" placeholder="VD: Nhận biết ngụy biện phổ biến" required />
    </div>
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Loại bài học</label>
        <select className="form-select" name="lesson_type" value={lessonType} onChange={(e) => setLessonType(e.target.value)}>
          <option value="video">Video / Bài giảng</option>
          <option value="quiz">Quiz / Bài tập</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Thời lượng (phút)</label>
        <input className="form-input" type="number" name="duration_minutes" defaultValue="20" />
      </div>
    </div>

    {/* VIDEO OPTIONS */}
    {lessonType === 'video' && (
      <>
        <div className="form-group">
          <label className="form-label">Nguồn Video</label>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input type="radio" name="video_source" value="upload" checked={videoInputType === 'upload'} onChange={() => setVideoInputType('upload')} /> Upload từ máy
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input type="radio" name="video_source" value="url" checked={videoInputType === 'url'} onChange={() => setVideoInputType('url')} /> Dán Link URL
            </label>
          </div>
          
          {videoInputType === 'upload' ? (
            <div style={{ border: '1.5px dashed var(--border)', padding: '20px', textAlign: 'center', borderRadius: 'var(--r-xs)', background: 'var(--bg-card)' }}>
              <span style={{ fontSize: '24px' }}>📤</span>
              <p style={{ margin: '8px 0', fontSize: '13px', color: 'var(--ink-mid)' }}>Kéo thả file mp4 vào đây hoặc bấm để chọn</p>
              <input type="file" accept="video/mp4,video/x-m4v,video/*" style={{ fontSize: '12px' }} />
            </div>
          ) : (
            <input className="form-input" name="video_url" placeholder="https://youtube.com/..." />
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Nội dung tóm tắt / Key points</label>
          <textarea className="form-textarea" name="content_data" placeholder="Nội dung chính của bài học..."></textarea>
        </div>
      </>
    )}

    {/* QUIZ OPTIONS */}
    {lessonType === 'quiz' && (
      <>
        <div className="form-group">
          <label className="form-label">Phương thức nhập câu hỏi</label>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input type="radio" name="quiz_source" value="manual" checked={quizInputType === 'manual'} onChange={() => setQuizInputType('manual')} /> Nhập tay (Trắc nghiệm/Tự luận)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input type="radio" name="quiz_source" value="upload" checked={quizInputType === 'upload'} onChange={() => setQuizInputType('upload')} /> Upload file Excel (.xlsx)
            </label>
          </div>

          {quizInputType === 'upload' ? (
            <div style={{ border: '1.5px dashed var(--border)', padding: '20px', textAlign: 'center', borderRadius: 'var(--r-xs)', background: 'var(--bg-card)' }}>
              <span style={{ fontSize: '24px' }}>📊</span>
              <p style={{ margin: '8px 0', fontSize: '13px', color: 'var(--ink-mid)' }}>Upload file danh sách câu hỏi theo mẫu</p>
              <div style={{ marginBottom: '12px' }}>
                <a href="#" style={{ fontSize: '12px', color: 'var(--blue)', textDecoration: 'underline' }}>📥 Tải file mẫu (.xlsx)</a>
              </div>
              <input type="file" accept=".xlsx, .xls, .csv" style={{ fontSize: '12px' }} />
            </div>
          ) : (
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-xs)', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Danh sách câu hỏi (0)</span>
                <button type="button" className="btn-sec" style={{ padding: '4px 8px', fontSize: '11px', height: 'auto' }}>+ Thêm câu hỏi</button>
              </div>
              <div style={{ padding: '20px', textAlign: 'center', background: 'var(--bg)', borderRadius: '4px', border: '1px dashed var(--border)', fontSize: '12px', color: 'var(--ink-light)' }}>
                Chưa có câu hỏi nào. Bấm Thêm câu hỏi để tạo câu hỏi trắc nghiệm hoặc tự luận.
              </div>
            </div>
          )}
        </div>
      </>
    )}

    <div className="form-row">
      <div className="form-group">
        <label className="form-label">XP khi hoàn thành</label>
        <input className="form-input" type="number" name="xp_on_complete" defaultValue="25" />
      </div>
      <div className="form-group">
        <label className="form-label">Yêu cầu bài trước?</label>
        <select className="form-select" name="is_required">
          <option value="false">Không (free access)</option>
          <option value="true">Có (prerequisite lock)</option>
        </select>
      </div>
    </div>
    <div className="modal-footer">
      <button type="button" className="btn-sec" onClick={() => closeModal(setLessonModalOpen)}>Hủy</button>
      <button className="btn-pri" type="submit">✓ Lưu Bài học/Quiz</button>
    </div>
    </form>

  </div>
</div>
)}

</div>
    </div>
  );
};
