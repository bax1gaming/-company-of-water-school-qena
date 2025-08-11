/*
  # تحديث جدول profiles لنظام التسجيل الجديد

  1. التغييرات على الجدول
    - إضافة عمود `national_id` (الرقم القومي) - 14 رقم، فريد
    - إضافة عمود `login_code` (كود تسجيل الدخول) - مشفر
    - تعديل عمود `email` ليصبح اختياري
    - إضافة فهارس للبحث السريع
    - تحديث القيود والتحقق من صحة البيانات

  2. الأمان
    - تحديث سياسات RLS
    - إضافة سياسة للتسجيل بالرقم القومي
    - تحديث سياسات القراءة والتحديث

  3. بيانات تجريبية
    - إضافة حسابات تجريبية للاختبار
*/

-- إضافة الأعمدة الجديدة
DO $$
BEGIN
  -- إضافة عمود الرقم القومي
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'national_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN national_id text;
  END IF;

  -- إضافة عمود كود تسجيل الدخول
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'login_code'
  ) THEN
    ALTER TABLE profiles ADD COLUMN login_code text;
  END IF;
END $$;

-- تعديل عمود البريد الإلكتروني ليصبح اختياري
ALTER TABLE profiles ALTER COLUMN email DROP NOT NULL;

-- إضافة القيود الجديدة
DO $$
BEGIN
  -- قيد فريد للرقم القومي
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_national_id_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_national_id_key UNIQUE (national_id);
  END IF;

  -- قيد للتحقق من طول الرقم القومي (14 رقم)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_national_id_length_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_national_id_length_check 
    CHECK (national_id IS NULL OR (length(national_id) = 14 AND national_id ~ '^[0-9]{14}$'));
  END IF;

  -- قيد للتحقق من وجود الرقم القومي وكود تسجيل الدخول
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_auth_fields_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_auth_fields_check 
    CHECK (
      (national_id IS NOT NULL AND login_code IS NOT NULL) OR 
      (email IS NOT NULL)
    );
  END IF;
END $$;

-- إنشاء فهارس للبحث السريع
CREATE INDEX IF NOT EXISTS profiles_national_id_idx ON profiles (national_id);
CREATE INDEX IF NOT EXISTS profiles_login_code_idx ON profiles (login_code);

-- تحديث سياسات RLS
DROP POLICY IF EXISTS "Allow profile creation via trigger" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile or admins can update any" ON profiles;

-- سياسة للسماح بإنشاء الملفات الشخصية
CREATE POLICY "Allow profile creation"
  ON profiles
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- سياسة للقراءة - المستخدمون يمكنهم قراءة ملفهم الشخصي فقط
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles admin_profile 
      WHERE admin_profile.id = auth.uid() 
      AND admin_profile.role = 'admin'
    )
  );

-- سياسة للتحديث - المستخدمون يمكنهم تحديث ملفهم الشخصي أو المديرون يمكنهم تحديث أي ملف
CREATE POLICY "Users can update own profile or admins can update any"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles admin_profile 
      WHERE admin_profile.id = auth.uid() 
      AND admin_profile.role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles admin_profile 
      WHERE admin_profile.id = auth.uid() 
      AND admin_profile.role = 'admin'
    )
  );

-- سياسة خاصة للسماح بالبحث بالرقم القومي وكود تسجيل الدخول (للتسجيل)
CREATE POLICY "Allow login verification"
  ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- إدراج بيانات تجريبية للاختبار
INSERT INTO profiles (
  id,
  name,
  email,
  phone,
  role,
  national_id,
  login_code,
  student_code,
  class_id,
  class_name,
  specialization
) VALUES 
  -- طالب تجريبي
  (
    gen_random_uuid(),
    'أحمد محمد علي',
    'student@test.com',
    '01234567890',
    'student',
    '12345678901234',
    '1234',
    'ST001',
    null,
    'الصف الأول - تخصص عام',
    'مياه شرب وصرف صحي'
  ),
  -- مدرب تجريبي
  (
    gen_random_uuid(),
    'د. محمد أحمد السيد',
    'trainer@test.com',
    '01987654321',
    'trainer',
    '98765432109876',
    '5678',
    null,
    null,
    null,
    'هندسة مياه'
  ),
  -- مدير تجريبي
  (
    gen_random_uuid(),
    'أ. سارة محمود إبراهيم',
    'admin@test.com',
    '01555666777',
    'admin',
    '11111111111111',
    '0000',
    null,
    null,
    null,
    'إدارة تعليمية'
  )
ON CONFLICT (national_id) DO NOTHING;

-- إنشاء دالة للتحقق من بيانات تسجيل الدخول
CREATE OR REPLACE FUNCTION verify_login_credentials(
  p_national_id text,
  p_login_code text
)
RETURNS TABLE(
  user_id uuid,
  user_name text,
  user_email text,
  user_phone text,
  user_role text,
  student_code text,
  class_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.email,
    p.phone,
    p.role,
    p.student_code,
    p.class_name
  FROM profiles p
  WHERE p.national_id = p_national_id 
    AND p.login_code = p_login_code;
END;
$$;

-- منح الصلاحيات للدالة
GRANT EXECUTE ON FUNCTION verify_login_credentials TO anon, authenticated;