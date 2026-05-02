import { http, HttpResponse } from 'msw';
import type { LearnerDashboard, CourseBrief, CourseDetailWithProgress, LessonContent, GamificationState } from '../../modules/academy/types/academy.types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.nquoc.vn';

const mockDashboard: LearnerDashboard = {
  person: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    display_name: 'Nguyễn Thị An',
    avatar_url: null,
  },
  stats: {
    total_xp: 340,
    current_level: 1,
    lessons_completed: 12,
    hours_learned: 8,
    certs_earned: 2,
  },
  active_lesson: {
    course_id: 'c1',
    course_slug: 'critical-thinking-l1',
    course_title: 'Tư duy phản biện cơ bản',
    course_thumbnail_url: null,
    lesson_id: 'l5',
    lesson_title: 'Nhận biết ngụy biện trong thông tin hàng ngày',
    lesson_type: 'video',
    progress_pct: 60,
    last_active_at: new Date().toISOString(),
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

const mockCourses: CourseBrief[] = [
  {
    id: 'c1', slug: 'critical-thinking-l1', title: 'Tư duy phản biện cơ bản', description: 'Nhận diện và phân tích các lỗi lập luận phổ biến trong cuộc sống.',
    content_type: 'community', proficiency_level: 'L1', thumbnail_url: null,
    lesson_count: 8, estimated_minutes: 130, total_xp: 200, avg_rating: 4.9, rating_count: 1240,
    is_offline_available: true, offline_size_mb: 50, is_published: true
  },
  {
    id: 'c2', slug: 'finance-l1', title: 'Quản lý tài chính cá nhân từ A–Z', description: '',
    content_type: 'community', proficiency_level: 'L1', thumbnail_url: null,
    lesson_count: 10, estimated_minutes: 200, total_xp: 300, avg_rating: 4.9, rating_count: 800,
    is_offline_available: true, offline_size_mb: 80, is_published: true
  },
  {
    id: 'c3', slug: 'career-l1', title: 'Kỹ năng xin việc & phỏng vấn', description: '',
    content_type: 'community', proficiency_level: 'L1', thumbnail_url: null,
    lesson_count: 12, estimated_minutes: 240, total_xp: 400, avg_rating: 4.8, rating_count: 600,
    is_offline_available: true, offline_size_mb: 120, is_published: true
  },
  {
    id: 'c4', slug: 'communication-l1', title: 'Nói trước đám đông tự tin', description: '',
    content_type: 'community', proficiency_level: 'L1', thumbnail_url: null,
    lesson_count: 8, estimated_minutes: 150, total_xp: 200, avg_rating: 4.7, rating_count: 400,
    is_offline_available: false, offline_size_mb: null, is_published: true
  }
];

const mockCourseDetail: CourseDetailWithProgress = {
  course: mockCourses[0],
  enrollment: {
    id: 'e1', course_id: 'c1', status: 'in_progress', progress_pct: 60,
    lessons_completed: 4, total_lessons: 8, xp_earned: 90,
    enrolled_at: new Date().toISOString(), last_active_at: new Date().toISOString(), completed_at: null
  },
  modules: [
    {
      module_title: 'Module 1 — Nền tảng tư duy', module_order: 1, completion_pct: 100,
      lessons: [
        { id: 'l1', title: 'Tư duy phản biện là gì?', lesson_type: 'video', lesson_order: 1, module_order: 1, estimated_minutes: 18, xp_reward: 20, is_previewable: true, is_published: true, status: 'completed', unlock_after_lesson_title: null, completed_at: new Date().toISOString() },
        { id: 'l2', title: 'Vì sao não người dễ bị lừa?', lesson_type: 'video', lesson_order: 2, module_order: 1, estimated_minutes: 22, xp_reward: 20, is_previewable: false, is_published: true, status: 'completed', unlock_after_lesson_title: null, completed_at: new Date().toISOString() },
        { id: 'l3', title: 'Bài kiểm tra Module 1', lesson_type: 'quiz', lesson_order: 3, module_order: 1, estimated_minutes: 10, xp_reward: 30, is_previewable: false, is_published: true, status: 'completed', unlock_after_lesson_title: null, completed_at: new Date().toISOString() }
      ]
    },
    {
      module_title: 'Module 2 — Nhận diện ngụy biện', module_order: 2, completion_pct: 25,
      lessons: [
        { id: 'l4', title: '10 kiểu ngụy biện phổ biến nhất', lesson_type: 'video', lesson_order: 1, module_order: 2, estimated_minutes: 24, xp_reward: 20, is_previewable: false, is_published: true, status: 'completed', unlock_after_lesson_title: null, completed_at: new Date().toISOString() },
        { id: 'l5', title: 'Nhận biết ngụy biện trong thông tin hàng ngày', lesson_type: 'video', lesson_order: 2, module_order: 2, estimated_minutes: 20, xp_reward: 25, is_previewable: false, is_published: true, status: 'in_progress', unlock_after_lesson_title: null, completed_at: null },
        { id: 'l6', title: 'Thực hành: Phân tích bài báo', lesson_type: 'project', lesson_order: 3, module_order: 2, estimated_minutes: 15, xp_reward: 35, is_previewable: false, is_published: true, status: 'locked', unlock_after_lesson_title: 'Nhận biết ngụy biện trong thông tin hàng ngày', completed_at: null },
        { id: 'l7', title: 'Bài kiểm tra Module 2', lesson_type: 'quiz', lesson_order: 4, module_order: 2, estimated_minutes: 10, xp_reward: 40, is_previewable: false, is_published: true, status: 'locked', unlock_after_lesson_title: 'Thực hành: Phân tích bài báo', completed_at: null }
      ]
    }
  ]
};

const mockLessonContent: LessonContent = {
  id: 'l5', title: 'Nhận biết ngụy biện trong thông tin hàng ngày', lesson_type: 'video',
  lesson_order: 2, module_order: 2, estimated_minutes: 20, xp_reward: 25, is_previewable: false, is_published: true,
  video_stream_url: 'https://example.com/video.mp4', video_duration_s: 1200,
  content_markdown: 'Ngụy biện (logical fallacy) là lỗi lập luận khiến một lập luận trông có vẻ hợp lý nhưng thực ra có vấn đề ở nền tảng. Chúng xuất hiện khắp nơi — từ quảng cáo, mạng xã hội, đến các cuộc tranh luận thường ngày.',
  key_points: [
    'Ad Hominem: tấn công người thay vì lập luận của họ',
    'Straw Man: bóp méo quan điểm đối phương để dễ bác bỏ',
    'False Dilemma: chỉ đưa ra 2 lựa chọn dù còn nhiều hơn',
    'Hỏi: "Bằng chứng đâu? Còn lựa chọn nào khác?"'
  ],
  prev_lesson: { id: 'l4', title: '10 kiểu ngụy biện phổ biến nhất', lesson_type: 'video', lesson_order: 1, module_order: 2, estimated_minutes: 24, xp_reward: 20, is_previewable: false, is_published: true },
  next_lesson: { id: 'l6', title: 'Thực hành: Phân tích bài báo', lesson_type: 'project', lesson_order: 3, module_order: 2, estimated_minutes: 15, xp_reward: 35, is_previewable: false, is_published: true },
  course_brief: mockCourses[0]
};

const mockGamification: GamificationState = {
  total_xp: 340, current_level: 1, xp_to_next_level: 160, xp_for_next_level_total: 500,
  current_streak: 7, longest_streak: 12, last_activity_date: '2026-05-02',
  badges: [
    { id: 'b1', code: 'streak_7', title: 'Streak 7 ngày', description: 'Học liên tục không nghỉ', icon_url: null, xp_bonus: 50, awarded_at: new Date().toISOString() },
    { id: 'b2', code: 'thinker', title: 'Nhà tư duy', description: 'Hoàn thành khoá tư duy đầu tiên', icon_url: null, xp_bonus: 100, awarded_at: new Date().toISOString() }
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
