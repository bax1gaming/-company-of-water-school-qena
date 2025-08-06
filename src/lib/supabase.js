import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

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
    // تحويل رقم الهاتف إلى بريد إلكتروني مؤقت
    const email = `${phone}@temp.local`
    return this.signInWithEmail(email, password)
  },

  // إنشاء حساب جديد
  async signUp(userData) {
    const { name, phone, email, password, classId, className } = userData
    
    // إنشاء حساب في النظام
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    })

    if (authError) return { data: null, error: authError }

    // إنشاء الملف الشخصي
    if (authData.user) {
      const studentCode = await generateStudentCode()
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name,
          phone,
          role: 'student',
          student_code: studentCode,
          class_id: classId,
          class_name: className
        })
        .select()
        .single()

      if (profileError) {
        // حذف المستخدم إذا فشل إنشاء الملف الشخصي
        await supabase.auth.admin.deleteUser(authData.user.id)
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

    return { user, profile, error: profileError }
  }
}

// Helper function لإنشاء كود طالب
async function generateStudentCode() {
  const { data, error } = await supabase.rpc('generate_student_code')
  if (error) {
    console.error('Error generating student code:', error)
    return `ST${Date.now().toString().slice(-6)}`
  }
  return data
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