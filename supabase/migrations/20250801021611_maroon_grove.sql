/*
  # إنشاء جداول المستخدمين والملفات الشخصية

  1. الجداول الجديدة
    - `user_profiles`
      - `id` (uuid, primary key, مرتبط بـ auth.users)
      - `name` (text, الاسم الكامل)
      - `phone` (text, رقم الهاتف)
      - `role` (text, الدور: student/trainer/admin)
      - `student_code` (text, كود الطالب)
      - `class_id` (text, معرف الصف)
      - `class_name` (text, اسم الصف)
      - `specialization` (text, التخصص للمدربين)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. الأمان
    - تفعيل RLS على جدول `user_profiles`
    - إضافة سياسات للقراءة والكتابة
    - إنشاء trigger لإنشاء ملف شخصي تلقائياً عند التسجيل

  3. الفهارس
    - فهرس على `phone` للبحث السريع
    - فهرس على `student_code` للطلاب
    - فهرس على `role` لتصفية الأدوار
*/

-- إنشاء جدول الملفات الشخصية للمستخدمين
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text UNIQUE,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'trainer', 'admin')),
  student_code text UNIQUE,
  class_id text,
  class_name text,
  specialization text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- تفعيل Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- سياسة للمستخدمين لقراءة ملفهم الشخصي
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- سياسة للمستخدمين لتحديث ملفهم الشخصي
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- سياسة للمدراء لقراءة جميع الملفات الشخصية
CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- سياسة للمدراء لتحديث جميع الملفات الشخصية
CREATE POLICY "Admins can update all profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- سياسة لإنشاء ملف شخصي جديد
CREATE POLICY "Users can create own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- إنشاء فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_user_profiles_student_code ON user_profiles(student_code);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_class_id ON user_profiles(class_id);

-- دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء trigger لتحديث updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- دالة لإنشاء ملف شخصي تلقائياً عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'مستخدم جديد'),
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء trigger لإنشاء ملف شخصي تلقائياً
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();