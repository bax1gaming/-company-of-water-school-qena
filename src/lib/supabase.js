import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gzjczqmkmoqlhvopixeg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6amN6cW1rbW9xbGh2b3BpeGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxODEyMjgsImV4cCI6MjA2OTc1NzIyOH0.j-wvlj7coIf2JQMQhbvR_6STF8fF8wTPo-DOQXdgPJ0'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for authentication
export const auth = {
  // تسجيل الدخول بالبريد الإلكتروني
  async signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // تسجيل الدخول برقم الهاتف (كبريد إلكتروني)
  async signInWithPhone(phone, password) {
    // استخدام رقم الهاتف كبريد إلكتروني مؤقت للمصادقة
    const { data, error } = await supabase.auth.signInWithPassword({
      email: phone,
      password
    })
    return { data, error }
  },

  // إنشاء حساب جديد
  async signUp(userData) {
    const { name, phone, email, password, classId, className } = userData
    
    // التحقق من عدم وجود رقم الهاتف مسبقاً
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', phone)
      .maybeSingle()
    
    if (existingProfile) {
      return { data: null, error: { message: 'رقم الهاتف مسجل مسبقاً' } }
    }

    // إنشاء حساب في النظام
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: null, // تعطيل تأكيد البريد الإلكتروني
        data: {
          name,
          phone,
          class_id: classId,
          class_name: className
        }
      }
    })

    if (authError) return { data: null, error: authError }

    // الحصول على الملف الشخصي المُنشأ تلقائياً بواسطة التريجر
    if (authData.user) {
      const studentCode = await generateStudentCode()
      
      // تحديث الملف الشخصي بالبيانات الإضافية
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
          student_code: studentCode,
          class_id: classId,
          class_name: className
        })
        .eq('id', authData.user.id)
        .select()
        .single()

      if (profileError) {
        console.error('Error updating profile:', profileError)
        return { data: null, error: profileError }
      }

      return { data: { user: authData.user, profile: profileData }, error: null }
    }

    return { data: authData, error: authError }
  },

  // تسجيل الخروج
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // الحصول على المستخدم الحالي
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return { user: null, profile: null, error }

    // الحصول على الملف الشخصي
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return { user, profile: null, error: profileError }
    }

    return { user, profile, error: null }
  }
}

// Helper function لإنشاء كود طالب
async function generateStudentCode() {
  try {
    const { data, error } = await supabase.rpc('generate_student_code')
    if (error) {
      console.error('Error generating student code:', error)
      return `ST${Date.now().toString().slice(-6)}`
    }
    return data
  } catch (err) {
    console.error('Error calling generate_student_code function:', err)
    return `ST${Date.now().toString().slice(-6)}`
  }
}

// Database helper functions
export const database = {
  // الحصول على جميع الصفوف
  async getClasses() {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: true })
    
    return { data, error }
  },

  // الحصول على الفيديوهات حسب الصف
  async getVideosByClass(classId) {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        uploader:uploaded_by(name)
      `)
      .eq('class_id', classId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // الحصول على جميع الفيديوهات
  async getAllVideos() {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        uploader:uploaded_by(name),
        class:classes(name)
      `)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // إضافة فيديو جديد
  async addVideo(videoData) {
    const { data, error } = await supabase
      .from('videos')
      .insert(videoData)
      .select()
      .single()
    
    return { data, error }
  },

  // الحصول على الملفات حسب الصف
  async getFilesByClass(classId) {
    const { data, error } = await supabase
      .from('files')
      .select(`
        *,
        uploader:uploaded_by(name)
      `)
      .eq('class_id', classId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // إضافة ملف جديد
  async addFile(fileData) {
    const { data, error } = await supabase
      .from('files')
      .insert(fileData)
      .select()
      .single()
    
    return { data, error }
  },

  // الحصول على الإعلانات
  async getAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // إضافة إعلان جديد
  async addAnnouncement(announcementData) {
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcementData)
      .select()
      .single()
    
    return { data, error }
  },

  // حذف إعلان
  async deleteAnnouncement(id) {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id)
    
    return { error }
  },

  // الحصول على التبليغات
  async getReports() {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // إضافة تبليغ جديد
  async addReport(reportData) {
    const { data, error } = await supabase
      .from('reports')
      .insert(reportData)
      .select()
      .single()
    
    return { data, error }
  },

  // تحديث حالة التبليغ
  async updateReportStatus(id, status, adminNotes, reviewedBy) {
    const { data, error } = await supabase
      .from('reports')
      .update({
        status,
        admin_notes: adminNotes,
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // الحصول على التحذيرات للمستخدم
  async getWarningsForUser(userId) {
    const { data, error } = await supabase
      .from('warnings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // إضافة تحذير جديد
  async addWarning(warningData) {
    const { data, error } = await supabase
      .from('warnings')
      .insert(warningData)
      .select()
      .single()
    
    return { data, error }
  },

  // تحديد التحذير كمقروء
  async markWarningAsRead(id) {
    const { data, error } = await supabase
      .from('warnings')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // الحصول على جميع المستخدمين (للإدارة)
  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // تحديث دور المستخدم
  async updateUserRole(userId, role, additionalData = {}) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role, ...additionalData })
      .eq('id', userId)
      .select()
      .single()
    
    return { data, error }
  }
}