export type AcademyRole = 'owner' | 'admin' | 'leader' | 'co-leader' | 'member' | 'community_learner';

export interface PersonBrief {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

export interface CourseBrief {
  id: string;
  slug: string;
  title: string;
  description: string;
  content_type: 'community' | 'internal';
  proficiency_level: 'L1' | 'L2' | 'L3' | 'L4';
  thumbnail_url: string | null;
  lesson_count: number;
  estimated_minutes: number;
  total_xp: number;
  avg_rating: number | null;
  rating_count: number;
  is_offline_available: boolean;
  offline_size_mb: number | null;
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
    current_level: number;
    lessons_completed: number;
    hours_learned: number;
    certs_earned: number;
  };
  active_lesson: {
    course_id: string;
    course_slug: string;
    course_title: string;
    course_thumbnail_url: string | null;
    lesson_id: string;
    lesson_title: string;
    lesson_type: 'video' | 'reading' | 'quiz' | 'project';
    progress_pct: number;
    last_active_at: string;
  } | null;
  streak: Streak;
  daily_challenge: {
    xp_reward: number;
    is_completed_today: boolean;
    challenge_description: string;
  } | null;
}

export interface BadgeAward {
  id: string;
  code: string;
  title: string;
  description: string;
  icon_url: string | null;
  xp_bonus: number;
  awarded_at: string;
}

export interface GamificationState {
  total_xp: number;
  current_level: number;
  xp_to_next_level: number;
  xp_for_next_level_total: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  badges: BadgeAward[];
  xp_history: Array<{
    date: string;
    xp_earned: number;
    events_count: number;
  }>;
}

export interface LessonBrief {
  id: string;
  title: string;
  lesson_type: 'video' | 'reading' | 'quiz' | 'project';
  lesson_order: number;
  module_order: number;
  estimated_minutes: number;
  xp_reward: number;
  is_previewable: boolean;
  is_published: boolean;
}

export interface LessonWithStatus extends LessonBrief {
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  unlock_after_lesson_title: string | null;
  completed_at: string | null;
}

export interface ModuleWithLessonStatus {
  module_title: string;
  module_order: number;
  completion_pct: number;
  lessons: LessonWithStatus[];
}

export interface EnrollmentStatus {
  id: string;
  course_id: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  progress_pct: number;
  lessons_completed: number;
  total_lessons: number;
  xp_earned: number;
  enrolled_at: string;
  last_active_at: string;
  completed_at: string | null;
}

export interface CourseDetailWithProgress {
  course: CourseBrief;
  enrollment: EnrollmentStatus | null;
  modules: ModuleWithLessonStatus[];
}

export interface LessonContent extends LessonBrief {
  video_stream_url: string | null;
  video_duration_s: number | null;
  content_markdown: string | null;
  key_points: string[];
  next_lesson: LessonBrief | null;
  prev_lesson: LessonBrief | null;
  course_brief: CourseBrief;
}

