import { http, HttpResponse } from 'msw';
import type { LearnerDashboard, CourseBrief, CourseDetailWithProgress, LessonContent, GamificationState } from '../../modules/academy/types/academy.types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.nquoc.vn';

const mockCourses: CourseBrief[] = [
  {
    id: 'c1', slug: 'critical-thinking-l1', title: 'Tư duy phản biện cơ bản', description: 'Nhận diện và phân tích các lỗi lập luận phổ biến trong cuộc sống.',
    category: 'tuDuy', difficulty_level: 'co_ban', thumbnail_emoji: '🧠', thumbnail_color: 'bg-teal-g',
    total_lessons: 8, total_duration_minutes: 130, xp_on_complete: 200, avg_rating: 4.9, rating_count: 120,
    is_offline_available: true, cert_category: null, is_published: true
  },
  {
    id: 'c2', slug: 'finance-l1', title: 'Quản lý tài chính cá nhân từ A–Z', description: '',
    category: 'taiChinh', difficulty_level: 'co_ban', thumbnail_emoji: '💰', thumbnail_color: 'bg-gold-g',
    total_lessons: 10, total_duration_minutes: 200, xp_on_complete: 300, avg_rating: 4.9, rating_count: 85,
    is_offline_available: true, cert_category: null, is_published: true
  },
  {
    id: 'c3', slug: 'career-l1', title: 'Kỹ năng xin việc & phỏng vấn', description: '',
    category: 'ngheNghiep', difficulty_level: 'co_ban', thumbnail_emoji: '💼', thumbnail_color: 'bg-blue-g',
    total_lessons: 12, total_duration_minutes: 240, xp_on_complete: 400, avg_rating: 4.8, rating_count: 320,
    is_offline_available: true, cert_category: null, is_published: true
  },
  {
    id: 'c4', slug: 'communication-l1', title: 'Nói trước đám đông tự tin', description: '',
    category: 'giaoTiep', difficulty_level: 'co_ban', thumbnail_emoji: '🗣️', thumbnail_color: 'bg-coral-g',
    total_lessons: 8, total_duration_minutes: 150, xp_on_complete: 200, avg_rating: 4.7, rating_count: 210,
    is_offline_available: false, cert_category: null, is_published: true
  }
];

const mockDashboard: LearnerDashboard = {
  person: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    display_name: 'Nguyễn Thị An',
    avatar_initials: 'AN',
    avatar_url: null,
  },
  stats: {
    total_xp: 340,
    current_level: 'co_ban',
    lessons_completed: 12,
    hours_learned: 8,
    certs_earned: 2,
  },
  continue_learning: {
    course_id: 'c1',
    course_slug: 'critical-thinking-l1',
    course_title: 'Tư duy phản biện cơ bản',
    course_thumbnail_emoji: '🧠',
    lesson_id: 'l5',
    lesson_title: 'Nhận biết ngụy biện trong thông tin hàng ngày',
    lesson_type: 'video',
    progress_percent: 60,
    last_accessed_at: new Date().toISOString(),
  },
  streak: {
    current_streak: 7,
    longest_streak: 12,
    last_activity_date: '2026-05-02',
    streak_at_risk: false,
  },
  daily_challenge: {
    xp_reward: 50,
    is_completed_today: false,
    challenge_description: 'Học 1 bài & trả lời đúng 3 câu hỏi',
  }
};

const mockCourseDetail: CourseDetailWithProgress = {
  course: mockCourses[0],
  enrollment: {
    id: 'e1', course_id: 'c1', is_offline_downloaded: true, progress_pct: 60,
    lessons_completed: 4, total_lessons: 8, xp_earned: 90,
    enrolled_at: new Date().toISOString(), last_accessed_at: new Date().toISOString(), completed_at: null
  },
  modules: [
    {
      module_title: 'Module 1 — Nền tảng tư duy', order_index: 1, completion_pct: 100,
      lessons: [
        { id: 'l1', title: 'Tư duy phản biện là gì?', lesson_type: 'video', order_index: 1, duration_minutes: 18, xp_on_complete: 20, is_prerequisite_unlock: false, is_published: true, status: 'completed', progress_seconds: 1080, is_locked: false, completed_at: new Date().toISOString() },
        { id: 'l2', title: 'Vì sao não người dễ bị lừa?', lesson_type: 'video', order_index: 2, duration_minutes: 22, xp_on_complete: 20, is_prerequisite_unlock: false, is_published: true, status: 'completed', progress_seconds: 1320, is_locked: false, completed_at: new Date().toISOString() },
        { id: 'l3', title: 'Bài kiểm tra Module 1', lesson_type: 'quiz', order_index: 3, duration_minutes: 10, xp_on_complete: 30, is_prerequisite_unlock: false, is_published: true, status: 'completed', progress_seconds: 0, is_locked: false, completed_at: new Date().toISOString() }
      ]
    },
    {
      module_title: 'Module 2 — Nhận diện ngụy biện', order_index: 2, completion_pct: 25,
      lessons: [
        { id: 'l4', title: '10 kiểu ngụy biện phổ biến nhất', lesson_type: 'video', order_index: 1, duration_minutes: 24, xp_on_complete: 20, is_prerequisite_unlock: false, is_published: true, status: 'completed', progress_seconds: 1440, is_locked: false, completed_at: new Date().toISOString() },
        { id: 'l5', title: 'Nhận biết ngụy biện trong thông tin hàng ngày', lesson_type: 'video', order_index: 2, duration_minutes: 20, xp_on_complete: 25, is_prerequisite_unlock: false, is_published: true, status: 'in_progress', progress_seconds: 600, is_locked: false, completed_at: null },
        { id: 'l6', title: 'Thực hành: Phân tích bài báo', lesson_type: 'exercise', order_index: 3, duration_minutes: 15, xp_on_complete: 35, is_prerequisite_unlock: true, is_published: true, status: 'not_started', progress_seconds: 0, is_locked: true, completed_at: null },
        { id: 'l7', title: 'Bài kiểm tra Module 2', lesson_type: 'quiz', order_index: 4, duration_minutes: 10, xp_on_complete: 40, is_prerequisite_unlock: true, is_published: true, status: 'not_started', progress_seconds: 0, is_locked: true, completed_at: null }
      ]
    }
  ]
};

const mockLessonContent: LessonContent = {
  id: 'l5', title: 'Nhận biết ngụy biện trong thông tin hàng ngày', lesson_type: 'video',
  order_index: 2, duration_minutes: 20, xp_on_complete: 25, is_prerequisite_unlock: false, is_published: true,
  video_url: 'https://example.com/video.mp4', video_stream_id: null, resume_at_seconds: 600, offline_package_url: null,
  content_body: 'Ngụy biện (logical fallacy) là lỗi lập luận khiến một lập luận trông có vẻ hợp lý nhưng thực ra có vấn đề ở nền tảng. Chúng xuất hiện khắp nơi — từ quảng cáo, mạng xã hội, đến các cuộc tranh luận thường ngày.\n\n### Điểm chính:\n- Ad Hominem: tấn công người thay vì lập luận của họ\n- Straw Man: bóp méo quan điểm đối phương để dễ bác bỏ\n- False Dilemma: chỉ đưa ra 2 lựa chọn dù còn nhiều hơn',
  prev_lesson: { id: 'l4', title: '10 kiểu ngụy biện phổ biến nhất', lesson_type: 'video', order_index: 1, duration_minutes: 24, xp_on_complete: 20, is_prerequisite_unlock: false, is_published: true },
  next_lesson: { id: 'l6', title: 'Thực hành: Phân tích bài báo', lesson_type: 'exercise', order_index: 3, duration_minutes: 15, xp_on_complete: 35, is_prerequisite_unlock: true, is_published: true },
  course_brief: mockCourses[0]
};

const mockGamification: GamificationState = {
  total_xp: 340, current_level: 'co_ban', xp_to_next_level: 160, xp_for_next_level_total: 500,
  current_streak: 7, longest_streak: 12, last_activity_date: '2026-05-02',
  achievements: [
    { id: 'a1', key: 'streak_7', title: 'Streak 7 ngày', description: 'Học liên tục không nghỉ', icon_emoji: '🔥', xp_reward: 50, unlocked_at: new Date().toISOString() },
    { id: 'a2', key: 'thinker', title: 'Nhà tư duy', description: 'Hoàn thành khoá tư duy đầu tiên', icon_emoji: '🧠', xp_reward: 100, unlocked_at: new Date().toISOString() }
  ],
  xp_history: [
    { date: '2026-05-02', xp_earned: 40, events_count: 2 },
    { date: '2026-05-01', xp_earned: 50, events_count: 1 }
  ]
};

export const academyHandlers = [
  http.get(`${API_BASE}/api/v1/academy/learn/dashboard`, () => {
    return HttpResponse.json(mockDashboard);
  }),
  http.get(`${API_BASE}/api/v1/academy/learn/courses`, () => {
    return HttpResponse.json({ data: mockCourses });
  }),
  http.get(`${API_BASE}/api/v1/academy/learn/courses/:slug`, () => {
    return HttpResponse.json(mockCourseDetail);
  }),
  http.get(`${API_BASE}/api/v1/academy/learn/lessons/:id`, () => {
    return HttpResponse.json(mockLessonContent);
  }),
  http.get(`${API_BASE}/api/v1/academy/learn/gamification`, () => {
    return HttpResponse.json(mockGamification);
  }),
];
