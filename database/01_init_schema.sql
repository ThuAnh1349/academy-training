-- ==========================================
-- ACADEMY NLT - DATABASE SCHEMA (SUPABASE)
-- ==========================================

-- 1. TẠO CÁC KIỂU DỮ LIỆU (ENUM)
CREATE TYPE content_type AS ENUM ('community', 'internal');
CREATE TYPE proficiency_level AS ENUM ('L1', 'L2', 'L3', 'L4');
CREATE TYPE lesson_type AS ENUM ('video', 'reading', 'quiz', 'project');
CREATE TYPE enrollment_status AS ENUM ('in_progress', 'completed', 'abandoned');
CREATE TYPE lesson_status AS ENUM ('locked', 'available', 'in_progress', 'completed');

-- 2. TẠO BẢNG PROFILES (Mở rộng từ bảng auth.users có sẵn của Supabase)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TẠO BẢNG KHÓA HỌC (COURSES)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type content_type DEFAULT 'community',
  proficiency_level proficiency_level DEFAULT 'L1',
  thumbnail_url TEXT,
  estimated_minutes INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  is_offline_available BOOLEAN DEFAULT false,
  offline_size_mb NUMERIC,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TẠO BẢNG MODULES KHÓA HỌC
CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  module_order INTEGER NOT NULL,
  UNIQUE(course_id, module_order)
);

-- 5. TẠO BẢNG BÀI HỌC (LESSONS)
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  lesson_type lesson_type DEFAULT 'video',
  lesson_order INTEGER NOT NULL,
  estimated_minutes INTEGER DEFAULT 0,
  xp_reward INTEGER DEFAULT 0,
  is_previewable BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  video_stream_url TEXT,
  video_duration_s INTEGER,
  content_markdown TEXT,
  key_points JSONB DEFAULT '[]'::jsonb,
  unlock_after_lesson_id UUID REFERENCES lessons(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TẠO BẢNG ĐĂNG KÝ HỌC (ENROLLMENTS - Lưu tiến độ tổng quan)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  status enrollment_status DEFAULT 'in_progress',
  progress_pct INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- 7. TẠO BẢNG TIẾN ĐỘ BÀI HỌC (LESSON PROGRESS - Lưu tiến độ từng bài)
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status lesson_status DEFAULT 'locked',
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- 8. TẠO BẢNG HUY HIỆU (BADGES)
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  xp_bonus INTEGER DEFAULT 0
);

-- 9. TẠO BẢNG HUY HIỆU NGƯỜI DÙNG (USER BADGES)
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ==========================================
-- THIẾT LẬP RLS (Row Level Security) - Bảo mật dữ liệu
-- ==========================================

-- Bật RLS cho các bảng
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Ai cũng có thể đọc khóa học, bài học (vì là data public)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courses are readable by everyone" ON courses FOR SELECT USING (true);

ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Modules are readable by everyone" ON course_modules FOR SELECT USING (true);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lessons are readable by everyone" ON lessons FOR SELECT USING (true);

-- User chỉ đọc/sửa data của chính mình
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own enrollments" ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollments" ON enrollments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own lesson progress" ON lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lesson progress" ON lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lesson progress" ON lesson_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
