/*
  # إضافة بيانات تجريبية للمنصة التعليمية

  1. بيانات تجريبية
    - حسابات مستخدمين تجريبية (طلاب، مدربين، مديرين)
    - فيديوهات تعليمية تجريبية
    - ملفات وملخصات تجريبية
    - إعلانات تجريبية
    - تبليغات تجريبية
    - تحذيرات تجريبية

  2. ملاحظات
    - جميع كلمات المرور للحسابات التجريبية هي: 123456
    - يمكن تسجيل الدخول باستخدام البريد الإلكتروني أو رقم الهاتف
*/

-- إدراج حسابات تجريبية في auth.users (يتم إنشاؤها عبر التطبيق عادة)
-- هذه البيانات للمرجع فقط - الحسابات الفعلية يجب إنشاؤها عبر واجهة التسجيل

-- إدراج ملفات شخصية تجريبية (بعد إنشاء الحسابات)
-- سيتم إدراجها عند إنشاء الحسابات عبر التطبيق

-- إدراج فيديوهات تجريبية
DO $$
DECLARE
    class1_id uuid;
    class2_id uuid;
    class3_id uuid;
BEGIN
    -- الحصول على معرفات الصفوف
    SELECT id INTO class1_id FROM classes WHERE name = 'الصف الأول الثانوي' LIMIT 1;
    SELECT id INTO class2_id FROM classes WHERE name = 'الصف الثاني الثانوي - مياه شرب' LIMIT 1;
    SELECT id INTO class3_id FROM classes WHERE name = 'الصف الثالث الثانوي - مياه شرب' LIMIT 1;

    -- إدراج فيديوهات تجريبية
    INSERT INTO videos (title, description, url, duration, class_id, category) VALUES
    ('مقدمة في مياه الشرب', 'شرح المفاهيم الأساسية لمياه الشرب وأهميتها', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '25:30', class1_id, 'practical'),
    ('أساسيات معالجة المياه', 'طرق معالجة المياه الأساسية والتقنيات المستخدمة', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '35:45', class1_id, 'practical'),
    ('مراجعة الوحدة الأولى', 'مراجعة شاملة للوحدة الأولى من المنهج', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '20:15', class1_id, 'review'),
    
    ('تقنيات تنقية المياه المتقدمة', 'شرح التقنيات المتقدمة في تنقية المياه', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '40:20', class2_id, 'practical'),
    ('أنظمة التوزيع', 'دراسة أنظمة توزيع المياه في المدن', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '30:10', class2_id, 'practical'),
    ('مراجعة منتصف الفصل', 'مراجعة شاملة لمنهج منتصف الفصل الدراسي', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '45:00', class2_id, 'review'),
    
    ('إدارة محطات المياه', 'كيفية إدارة وتشغيل محطات معالجة المياه', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '50:30', class3_id, 'practical'),
    ('مراقبة جودة المياه', 'طرق مراقبة والتحكم في جودة المياه', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '35:25', class3_id, 'practical'),
    ('مراجعة نهائية', 'مراجعة شاملة للمنهج كاملاً', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '60:00', class3_id, 'review');

    -- إدراج ملفات تجريبية
    INSERT INTO files (title, description, file_type, file_size, url, class_id) VALUES
    ('ملخص الوحدة الأولى', 'ملخص شامل للوحدة الأولى من منهج مياه الشرب', 'pdf', '2.5 MB', 'https://example.com/files/unit1-summary.pdf', class1_id),
    ('تمارين محلولة - الفصل الأول', 'مجموعة تمارين محلولة للفصل الأول', 'pdf', '1.8 MB', 'https://example.com/files/chapter1-exercises.pdf', class1_id),
    ('جداول المعايير', 'جداول معايير جودة المياه المحلية والدولية', 'pdf', '3.2 MB', 'https://example.com/files/water-standards.pdf', class1_id),
    
    ('دليل التشغيل', 'دليل تشغيل محطات معالجة المياه', 'pdf', '5.1 MB', 'https://example.com/files/operation-manual.pdf', class2_id),
    ('أوراق عمل تطبيقية', 'أوراق عمل للتطبيق العملي', 'docx', '1.2 MB', 'https://example.com/files/practical-worksheets.docx', class2_id),
    ('عرض تقديمي - أنظمة التوزيع', 'عرض تقديمي شامل عن أنظمة توزيع المياه', 'pptx', '8.7 MB', 'https://example.com/files/distribution-systems.pptx', class2_id),
    
    ('مشروع التخرج - نماذج', 'نماذج ومتطلبات مشاريع التخرج', 'pdf', '2.9 MB', 'https://example.com/files/graduation-project-templates.pdf', class3_id),
    ('دراسات حالة', 'دراسات حالة من محطات مياه حقيقية', 'pdf', '4.3 MB', 'https://example.com/files/case-studies.pdf', class3_id);

END $$;

-- إدراج إعلانات تجريبية
INSERT INTO announcements (title, content, author_name) VALUES
('بداية العام الدراسي الجديد', 'نرحب بجميع الطلاب في العام الدراسي الجديد. يرجى مراجعة الجداول الدراسية والاستعداد للمحاضرات.', 'إدارة المنصة'),
('تحديث في نظام المنصة', 'تم إضافة ميزات جديدة للمنصة تشمل تحسينات في مشغل الفيديو وواجهة المستخدم.', 'الدعم التقني'),
('موعد الامتحانات النهائية', 'تم تحديد مواعيد الامتحانات النهائية. يرجى مراجعة الجدول الزمني في قسم الإعلانات.', 'شؤون الطلاب'),
('ورشة عمل تطبيقية', 'سيتم عقد ورشة عمل تطبيقية حول تشغيل محطات المياه يوم السبت القادم.', 'قسم التدريب'),
('تهنئة بالنجاح', 'نهنئ جميع الطلاب الناجحين في امتحانات منتصف الفصل ونتمنى لهم التوفيق في باقي المواد.', 'إدارة المنصة');

-- إنشاء دالة لإدراج بيانات تجريبية للمستخدمين (تستدعى بعد إنشاء الحسابات)
CREATE OR REPLACE FUNCTION insert_demo_user_data()
RETURNS void AS $$
DECLARE
    student_id uuid;
    trainer_id uuid;
    admin_id uuid;
BEGIN
    -- البحث عن المستخدمين التجريبيين (إذا كانوا موجودين)
    SELECT id INTO student_id FROM profiles WHERE phone = '01234567890' LIMIT 1;
    SELECT id INTO trainer_id FROM profiles WHERE role = 'trainer' LIMIT 1;
    SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;

    -- إدراج تبليغات تجريبية (إذا وجد مدرب وطالب)
    IF trainer_id IS NOT NULL AND student_id IS NOT NULL THEN
        INSERT INTO reports (student_id, student_name, student_code, reported_by, trainer_name, report_type, severity, title, description, action_taken, status)
        VALUES 
        (student_id, 'أحمد محمد', 'ST001', trainer_id, 'د. محمد أحمد', 'behavior', 'warning', 'تأخير في تسليم الواجبات', 'الطالب متأخر في تسليم واجبات الأسبوع الماضي', 'تم التنبيه على الطالب', 'pending'),
        (student_id, 'أحمد محمد', 'ST001', trainer_id, 'د. محمد أحمد', 'attendance', 'info', 'غياب بعذر', 'الطالب غائب لظروف صحية', 'تم قبول العذر', 'resolved');
    END IF;

    -- إدراج تحذيرات تجريبية (إذا وجد مدير وطالب)
    IF admin_id IS NOT NULL AND student_id IS NOT NULL THEN
        INSERT INTO warnings (user_id, user_type, title, message, severity, created_by)
        VALUES 
        (student_id, 'student', 'تنبيه أكاديمي', 'يرجى الالتزام بمواعيد تسليم الواجبات والمشاركة في المحاضرات بانتظام.', 'warning', admin_id),
        (student_id, 'student', 'إشعار هام', 'تم تحديث جدول المحاضرات. يرجى مراجعة الجدول الجديد.', 'info', admin_id);
    END IF;

    -- إدراج تحذير للمدرب (إذا وجد)
    IF admin_id IS NOT NULL AND trainer_id IS NOT NULL THEN
        INSERT INTO warnings (user_id, user_type, title, message, severity, created_by)
        VALUES 
        (trainer_id, 'trainer', 'تحديث في النظام', 'تم إضافة ميزات جديدة لرفع الفيديوهات. يرجى مراجعة الدليل المحدث.', 'info', admin_id);
    END IF;

END;
$$ LANGUAGE plpgsql;

-- رسالة للمطور
SELECT 'تم إنشاء البيانات التجريبية بنجاح! يرجى إنشاء الحسابات التجريبية عبر واجهة التسجيل ثم تشغيل دالة insert_demo_user_data()' as message;