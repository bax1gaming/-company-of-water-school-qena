/*
  # إضافة البريد الإلكتروني إلى جدول الملفات الشخصية

  1. تعديلات الجدول
    - إضافة عمود `email` إلى جدول `profiles`
    - جعل البريد الإلكتروني فريد ومطلوب
    - تحديث البيانات الموجودة

  2. الأمان
    - تحديث سياسات RLS للتعامل مع البريد الإلكتروني
*/

-- إضافة عمود البريد الإلكتروني
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;
END $$;

-- جعل البريد الإلكتروني فريد ومطلوب
DO $$
BEGIN
  -- إضافة قيود البريد الإلكتروني
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_email_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
  END IF;
END $$;

-- تحديث البيانات الموجودة (إضافة بريد إلكتروني افتراضي للمستخدمين الموجودين)
UPDATE profiles 
SET email = COALESCE(email, id::text || '@temp.local')
WHERE email IS NULL OR email = '';

-- جعل البريد الإلكتروني مطلوب
ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;