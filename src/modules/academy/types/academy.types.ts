export type AcademyRole = 'owner' | 'admin' | 'leader' | 'co-leader' | 'member' | 'community_learner';

export interface PersonBrief {
  id: string;
  display_name: string;
  avatar_initials: string | null;
  avatar_url: string | null;
}

export interface CourseBrief {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'tuDuy' | 'taiChinh' | 'ngheNghiep' | 'giaoTiep' | 'sucKhoe';
  thumbnail_emoji: string | null;
  thumbnail_color: string | null;
  total_lessons: number;
  total_duration_minutes: number;
  difficulty_level: 'co_ban' | 'trung_cap' | 'nang_cao';
  xp_on_complete: number;
  avg_rating: number | null;
  rating_count: number;
  cert_category: string | null;
  is_offline_available: boolean;
  is_published: boolean;
}

export interface Streak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  streak_at_risk: boolean;
}

export interface LearnerDashboard {
  person: PersonBrief;
  stats: {
    total_xp: number;
    current_level: string;
    lessons_completed: number;
    hours_learned: number;
    certs_earned: number;
  };
  continue_learning: {
    course_id: string;
    course_slug: string;
    course_title: string;
    course_thumbnail_emoji: string | null;
    lesson_id: string;
    lesson_title: string;
    lesson_type: 'video' | 'quiz' | 'exercise';
    progress_percent: number;
    last_accessed_at: string;
  } | null;
  streak: Streak;
  daily_challenge: {
    xp_reward: number;
    is_completed_today: boolean;
    challenge_description: string;
  } | null;
  popular_courses?: Array<CourseBrief & { my_progress: number }>;
}

export interface AchievementAward {
  id: string;
  key: string;
  title: string;
  description: string;
  icon_emoji: string;
  xp_reward: number;
  unlocked_at: string | null;
  progress_percent?: number;
}

export interface GamificationState {
  total_xp: number;
  current_level: string;
  xp_to_next_level: number;
  xp_for_next_level_total: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  achievements: AchievementAward[];
  xp_history: Array<{
    date: string;
    xp_earned: number;
    events_count: number;
  }>;
}

export interface LessonBrief {
  id: string;
  title: string;
  lesson_type: 'video' | 'quiz' | 'exercise';
  order_index: number;
  duration_minutes: number | null;
  xp_on_complete: number;
  is_prerequisite_unlock: boolean;
  is_published: boolean;
}

export interface LessonWithStatus extends LessonBrief {
  status: 'not_started' | 'in_progress' | 'completed';
  progress_seconds: number;
  completed_at: string | null;
  is_locked: boolean;
}

export interface ModuleWithLessonStatus {
  module_title: string;
  order_index: number;
  completion_pct: number;
  lessons: LessonWithStatus[];
}

export interface EnrollmentStatus {
  id: string;
  course_id: string;
  is_offline_downloaded: boolean;
  progress_pct: number;
  lessons_completed: number;
  total_lessons: number;
  xp_earned: number;
  enrolled_at: string;
  last_accessed_at: string;
  completed_at: string | null;
}

export interface CourseDetailWithProgress {
  course: CourseBrief & {
    my_progress_percent?: number;
    my_xp_earned?: number;
    is_offline_downloaded?: boolean;
    cert_progress?: number;
  };
  enrollment: EnrollmentStatus | null;
  modules: ModuleWithLessonStatus[];
}

export interface LessonContent extends LessonBrief {
  video_url: string | null;
  video_stream_id: string | null;
  content_body: string | null;
  offline_package_url: string | null;
  resume_at_seconds: number;
  next_lesson: LessonBrief | null;
  prev_lesson: LessonBrief | null;
  course_brief: CourseBrief;
}
