/*
  # إنشاء جداول المنصة التعليمية

  1. الجداول الجديدة
    - `profiles` - ملفات المستخدمين الشخصية
      - `id` (uuid, primary key, مرتبط بـ auth.users)
      - `name` (text) - الاسم الكامل
      - `phone` (text, unique) - رقم الهاتف
      - `role` (text) - الدور (student, trainer, admin)
      - `student_code` (text, unique) - كود الطالب
      - `class_id` (text) - معرف الصف
      - `class_name` (text) - اسم الصف
      - `specialization` (text) - التخصص للمدربين
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `classes` - الصفوف الدراسية
      - `id` (uuid, primary key)
      - `name` (text) - اسم الصف
      - `description` (text) - وصف الصف
      - `created_at` (timestamp)

    - `videos` - الفيديوهات التعليمية
      - `id` (uuid, primary key)
      - `title` (text) - عنوان الفيديو
      - `description` (text) - وصف الفيديو
      - `url` (text) - رابط الفيديو
      - `duration` (text) - مدة الفيديو
      - `class_id` (uuid) - معرف الصف
      - `category` (text) - فئة الفيديو (practical, review)
      - `uploaded_by` (uuid) - معرف المدرب الذي رفع الفيديو
      - `created_at` (timestamp)

    - `files` - الملفات والملخصات
      - `id` (uuid, primary key)
      - `title` (text) - عنوان الملف
      - `description` (text) - وصف الملف
      - `file_type` (text) - نوع الملف
      - `file_size` (text) - حجم الملف
      - `url` (text) - رابط الملف
      - `class_id` (uuid) - معرف الصف
      - `uploaded_by` (uuid) - معرف المدرب الذي رفع الملف
      - `created_at` (timestamp)

    - `announcements` - الإعلانات
      - `id` (uuid, primary key)
      - `title` (text) - عنوان الإعلان
      - `content` (text) - محتوى الإعلان
      - `author_id` (uuid) - معرف كاتب الإعلان
      - `author_name` (text) - اسم كاتب الإعلان
      - `created_at` (timestamp)

    - `reports` - التبليغات
      - `id` (uuid, primary key)
      - `student_id` (uuid) - معرف الطالب
      - `student_name` (text) - اسم الطالب
      - `student_code` (text) - كود الطالب
      - `reported_by` (uuid) - معرف المدرب المبلغ
      - `trainer_name` (text) - اسم المدرب
      - `report_type` (text) - نوع التبليغ
      - `severity` (text) - درجة الخطورة
      - `title` (text) - عنوان التبليغ
      - `description` (text) - وصف المشكلة
      - `action_taken` (text) - الإجراء المتخذ
      - `status` (text) - حالة التبليغ
      - `admin_notes` (text) - ملاحظات الإدارة
      - `reviewed_by` (uuid) - معرف مراجع التبليغ
      - `reviewed_at` (timestamp) - تاريخ المراجعة
      - `created_at` (timestamp)

    - `warnings` - التحذيرات
      - `id` (uuid, primary key)
      - `user_id` (uuid) - معرف المستخدم
      - `user_type` (text) - نوع المستخدم
      - `title` (text) - عنوان التحذير
      - `message` (text) - رسالة التحذير
      - `severity` (text) - درجة الخطورة
      - `is_read` (boolean) - هل تم قراءة التحذير
      - `created_by` (uuid) - معرف منشئ التحذير
      - `created_at` (timestamp)

  2. الأمان
    - تفعيل RLS على جميع الجداول
    - إضافة سياسات الأمان المناسبة لكل جدول

  3. البيانات الأولية
    - إضافة الصفوف الدراسية الأساسية
*/

-- إنشاء جدول الملفات الشخصية
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'trainer', 'admin')),
  student_code text UNIQUE,
  class_id text,
  class_name text,
  specialization text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول الصفوف الدراسية
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول الفيديوهات
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text,
  duration text,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  category text CHECK (category IN ('practical', 'review')),
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول الملفات
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_type text,
  file_size text,
  url text,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول الإعلانات
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول التبليغات
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  student_code text NOT NULL,
  reported_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  trainer_name text NOT NULL,
  report_type text NOT NULL CHECK (report_type IN ('behavior', 'attendance', 'academic', 'other')),
  severity text NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  title text NOT NULL,
  description text NOT NULL,
  action_taken text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  admin_notes text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول التحذيرات
CREATE TABLE IF NOT EXISTS warnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type text NOT NULL CHECK (user_type IN ('student', 'trainer', 'admin')),
  title text NOT NULL,
  message text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('info', 'warning', 'error')),
  is_read boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- تفعيل RLS على جميع الجداول
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE warnings ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للملفات الشخصية
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- سياسات الأمان للصفوف الدراسية
CREATE POLICY "Everyone can read classes"
  ON classes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage classes"
  ON classes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- سياسات الأمان للفيديوهات
CREATE POLICY "Everyone can read videos"
  ON videos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Trainers and admins can manage videos"
  ON videos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('trainer', 'admin')
    )
  );

-- سياسات الأمان للملفات
CREATE POLICY "Everyone can read files"
  ON files
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Trainers and admins can manage files"
  ON files
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('trainer', 'admin')
    )
  );

-- سياسات الأمان للإعلانات
CREATE POLICY "Everyone can read announcements"
  ON announcements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage announcements"
  ON announcements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- سياسات الأمان للتبليغات
CREATE POLICY "Users can read own reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR 
    reported_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Trainers can create reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('trainer', 'admin')
    )
  );

CREATE POLICY "Admins can manage reports"
  ON reports
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- سياسات الأمان للتحذيرات
CREATE POLICY "Users can read own warnings"
  ON warnings
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own warnings"
  ON warnings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage warnings"
  ON warnings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- إدراج البيانات الأولية للصفوف الدراسية
INSERT INTO classes (name, description) VALUES
  ('الصف الأول الثانوي', 'مواد الصف الأول الثانوي - تخصص عام'),
  ('الصف الثاني الثانوي - مياه شرب', 'مواد الصف الثاني الثانوي - تخصص مياه الشرب'),
  ('الصف الثاني الثانوي - صرف صحي', 'مواد الصف الثاني الثانوي - تخصص صرف صحي'),
  ('الصف الثالث الثانوي - مياه شرب', 'مواد الصف الثالث الثانوي - تخصص مياه الشرب'),
  ('الصف الثالث الثانوي - صرف صحي', 'مواد الصف الثالث الثانوي - تخصص صرف صحي')
ON CONFLICT DO NOTHING;

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء trigger لتحديث updated_at في جدول profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- إنشاء دالة لإنشاء كود طالب تلقائي
CREATE OR REPLACE FUNCTION generate_student_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- إنشاء كود جديد
    new_code := 'ST' || LPAD((EXTRACT(EPOCH FROM NOW())::BIGINT % 1000000)::TEXT, 6, '0');
    
    -- التحقق من عدم وجود الكود
    SELECT EXISTS(SELECT 1 FROM profiles WHERE student_code = new_code) INTO code_exists;
    
    -- إذا لم يكن الكود موجود، اخرج من الحلقة
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;