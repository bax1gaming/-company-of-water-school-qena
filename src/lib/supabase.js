import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gzjczqmkmoqlhvopixeg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6amN6cW1rbW9xbGh2b3BpeGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxODEyMjgsImV4cCI6MjA2OTc1NzIyOH0.j-wvlj7coIf2JQMQhbvR_6STF8fF8wTPo-DOQXdgPJ0'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const auth = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async signUp(credentials) {
    const { email, password, name, phone, role = 'student', studentCode, classId, className, specialization } = credentials;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          role,
          student_code: studentCode,
          class_id: classId,
          class_name: className,
          specialization
        }
      }
    })
    
    // Store signup data for later profile creation
    if (data?.user && !error) {
      // Store the signup data in localStorage temporarily
      localStorage.setItem('pendingProfileData', JSON.stringify({
        email,
        name: name || '',
        phone: phone || '',
        role,
        student_code: studentCode,
        class_id: classId,
        class_name: className,
        specialization
      }));
    }
    
    return { data, error }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return { user: null, profile: null, error }
    }
    
    // Get user profile
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .limit(1)
    
    if (profileError) {
      return { user, profile: null, error: profileError }
    }
    
    if (!profiles || profiles.length === 0) {
      return { user, profile: null, error: { message: 'لم يتم العثور على الملف الشخصي للمستخدم' } }
    }
    
    return { user, profile: profiles[0], error: null }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    // Clear any pending profile data
    localStorage.removeItem('pendingProfileData')
    return { error }
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export const database = {
  // Create profile for authenticated user
  async createProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        ...profileData
      }])
      .select()
      .single()
    return { data, error }
  },

  // Get profile by phone number
  async getProfileByPhone(phone) {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .limit(1)
    
    if (error) {
      return { data: null, error }
    }
    
    return { data: profiles && profiles.length > 0 ? profiles[0] : null, error: null }
  },

  // Profile operations
  async getProfile(userId) {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .limit(1)
    
    if (error) {
      return { data: null, error }
    }
    
    return { data: profiles && profiles.length > 0 ? profiles[0] : null, error: null }
  },

  async updateProfile(userId, updates) {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
    
    if (error) {
      return { data: null, error }
    }
    
    return { data: profiles && profiles.length > 0 ? profiles[0] : null, error: null }
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async updateUserRole(userId, role) {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
    
    if (error) {
      return { data: null, error }
    }
    
    if (!profiles || profiles.length === 0) {
      return { data: null, error: { message: 'لم يتم العثور على المستخدم للتحديث' } }
    }
    
    return { data: profiles[0], error: null }
  },

  // Classes operations
  async getClasses() {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async addClass(classData) {
    const { data, error } = await supabase
      .from('classes')
      .insert([classData])
      .select()
      .single()
    return { data, error }
  },

  async updateClass(classId, updates) {
    const { data, error } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', classId)
      .select()
      .single()
    return { data, error }
  },

  async deleteClass(classId) {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId)
    return { error }
  },

  // Videos operations
  async getVideos(classId = null) {
    let query = supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (classId) {
      query = query.eq('class_id', classId)
    }
    
    const { data, error } = await query
    return { data, error }
  },

  async addVideo(videoData) {
    const { data, error } = await supabase
      .from('videos')
      .insert([videoData])
      .select()
      .single()
    return { data, error }
  },

  async updateVideo(videoId, updates) {
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', videoId)
      .select()
      .single()
    return { data, error }
  },

  async deleteVideo(videoId) {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId)
    return { error }
  },

  // Files operations
  async getFiles(classId = null) {
    let query = supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (classId) {
      query = query.eq('class_id', classId)
    }
    
    const { data, error } = await query
    return { data, error }
  },

  async addFile(fileData) {
    const { data, error } = await supabase
      .from('files')
      .insert([fileData])
      .select()
      .single()
    return { data, error }
  },

  async updateFile(fileId, updates) {
    const { data, error } = await supabase
      .from('files')
      .update(updates)
      .eq('id', fileId)
      .select()
      .single()
    return { data, error }
  },

  async deleteFile(fileId) {
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId)
    return { error }
  },

  // Announcements operations
  async getAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async addAnnouncement(announcementData) {
    const { data, error } = await supabase
      .from('announcements')
      .insert([announcementData])
      .select()
      .single()
    return { data, error }
  },

  async updateAnnouncement(announcementId, updates) {
    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', announcementId)
      .select()
      .single()
    return { data, error }
  },

  async deleteAnnouncement(announcementId) {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', announcementId)
    return { error }
  },

  // Reports operations
  async getReports() {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async addReport(reportData) {
    const { data, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select()
      .single()
    return { data, error }
  },

  async updateReport(reportId, updates) {
    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', reportId)
      .select()
      .single()
    return { data, error }
  },

  async deleteReport(reportId) {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId)
    return { error }
  },

  // Warnings operations
  async getWarnings(userId = null) {
    let query = supabase
      .from('warnings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    return { data, error }
  },

  async addWarning(warningData) {
    const { data, error } = await supabase
      .from('warnings')
      .insert([warningData])
      .select()
      .single()
    return { data, error }
  },

  async updateWarning(warningId, updates) {
    const { data, error } = await supabase
      .from('warnings')
      .update(updates)
      .eq('id', warningId)
      .select()
      .single()
    return { data, error }
  },

  async deleteWarning(warningId) {
    const { error } = await supabase
      .from('warnings')
      .delete()
      .eq('id', warningId)
    return { error }
  }
}

export default supabase