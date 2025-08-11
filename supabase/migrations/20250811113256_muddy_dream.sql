/*
  # تحديث نظام تسجيل الدخول برقم القومي والكود

  1. تعديل جدول profiles
    - إضافة عمود national_id (رقم القومي)
    - إضافة عمود login_code (كود تسجيل الدخول)
    - إزالة الحاجة لكلمة المرور التقليدية
  
  2. الأمان
    - إضافة فهارس للبحث السريع
    - تحديث سياسات الأمان
    - ضمان عدم تكرار الأرقام القومية
*/

-- إضافة الأعمدة الجديدة
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'national_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN national_id text UNIQUE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'login_code'
  ) THEN
    ALTER TABLE profiles ADD COLUMN login_code text;
  END IF;
END $$;

-- إضافة فهارس للبحث السريع
CREATE INDEX IF NOT EXISTS profiles_national_id_idx ON profiles(national_id);
CREATE INDEX IF NOT EXISTS profiles_login_code_idx ON profiles(login_code);

-- تحديث سياسة تسجيل الدخول
DROP POLICY IF EXISTS "Allow login with national_id and code" ON profiles;
CREATE POLICY "Allow login with national_id and code"
  ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- إضافة بيانات تجريبية
INSERT INTO profiles (
  id,
  name,
  email,
  phone,
  role,
  national_id,
  login_code,
  student_code,
  class_name,
  specialization
) VALUES 
(
  gen_random_uuid(),
  'أحمد محمد علي',
  'student@demo.com',
  '01234567890',
  'student',
  '12345678901234',
  '1234',
  'ST001',
  'الصف الأول - تخصص عام',
  'عام'
),
(
  gen_random_uuid(),
  'د. محمد أحمد',
  'trainer@demo.com',
  '01111111111',
  'trainer',
  '98765432109876',
  '5678',
  null,
  null,
  'مياه الشرب'
),
(
  gen_random_uuid(),
  'مدير المنصة',
  'admin@demo.com',
  '01000000000',
  'admin',
  '11111111111111',
  '0000',
  null,
  null,
  null
)
ON CONFLICT (email) DO UPDATE SET
  national_id = EXCLUDED.national_id,
  login_code = EXCLUDED.login_code;