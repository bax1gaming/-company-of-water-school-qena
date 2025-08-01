import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  // تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
  const login = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (authError) {
        error.value = authError.message
        return false
      }
      
      // جلب الملف الشخصي للمستخدم
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      if (profileError) {
        console.error('خطأ في جلب الملف الشخصي:', profileError)
      }
      
      user.value = {
        id: data.user.id,
        email: data.user.email,
        ...profile
      }
      
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // تسجيل الدخول بالهاتف أو البريد الإلكتروني
  const loginWithPhoneOrEmail = async (identifier, password) => {
    try {
      loading.value = true
      error.value = null
      
      // التحقق من نوع المعرف (بريد إلكتروني أم رقم هاتف)
      const isEmail = identifier.includes('@')
      
      if (isEmail) {
        return await login(identifier, password)
      } else {
        // البحث عن المستخدم برقم الهاتف
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('phone', identifier)
          .single()
        
        if (profileError || !profile) {
          error.value = 'رقم الهاتف غير مسجل'
          return false
        }
        
        // الحصول على البريد الإلكتروني من auth.users
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(profile.id)
        
        if (authError || !authUser.user) {
          error.value = 'خطأ في النظام'
          return false
        }
        
        return await login(authUser.user.email, password)
      }
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // إنشاء حساب جديد
  const signup = async (userData) => {
    try {
      loading.value = true
      error.value = null
      
      // التحقق من عدم وجود رقم الهاتف مسبقاً
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('phone')
        .eq('phone', userData.phone)
        .single()
      
      if (existingProfile) {
        error.value = 'رقم الهاتف مستخدم بالفعل'
        return { success: false, message: 'رقم الهاتف مستخدم بالفعل' }
      }
      
      // إنشاء حساب المصادقة
      const { data, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            role: 'student'
          }
        }
      })
      
      if (authError) {
        error.value = authError.message
        return { success: false, message: authError.message }
      }
      
      // إنشاء الملف الشخصي
      const studentCode = `ST${Date.now().toString().slice(-6)}`
      const className = getClassNameById(userData.class)
      
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          name: userData.name,
          phone: userData.phone,
          role: 'student',
          student_code: studentCode,
          class_id: userData.class,
          class_name: className
        })
      
      if (profileError) {
        console.error('خطأ في إنشاء الملف الشخصي:', profileError)
      }
      
      return { success: true, message: 'تم إنشاء الحساب بنجاح' }
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  // ترقية المستخدم
  const promoteUser = async (identifier, newRole, additionalData = {}) => {
    try {
      loading.value = true
      error.value = null
      
      // البحث عن المستخدم
      const { data: profile, error: findError } = await supabase
        .from('user_profiles')
        .select('*')
        .or(`phone.eq.${identifier},email.eq.${identifier}`)
        .single()
      
      if (findError || !profile) {
        return { success: false, message: 'المستخدم غير موجود' }
      }
      
      if (profile.role === newRole) {
        return { success: false, message: `المستخدم لديه صلاحية ${newRole} بالفعل` }
      }
      
      // تحديث الدور
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          role: newRole,
          ...additionalData
        })
        .eq('id', profile.id)
      
      if (updateError) {
        return { success: false, message: 'فشل في ترقية المستخدم' }
      }
      
      return { success: true, message: `تم ترقية المستخدم إلى ${newRole} بنجاح` }
    } catch (err) {
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  // تسجيل الخروج
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('خطأ في تسجيل الخروج:', error)
      }
    } catch (err) {
      console.error('خطأ في تسجيل الخروج:', err)
    } finally {
      user.value = null
    }
  }

  // تهيئة المصادقة
  const initAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // جلب الملف الشخصي
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (!profileError && profile) {
          user.value = {
            id: session.user.id,
            email: session.user.email,
            ...profile
          }
        }
      }
      
      // الاستماع لتغييرات المصادقة
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          user.value = {
            id: session.user.id,
            email: session.user.email,
            ...profile
          }
        } else if (event === 'SIGNED_OUT') {
          user.value = null
        }
      })
    } catch (err) {
      console.error('خطأ في تهيئة المصادقة:', err)
    }
  }
  
  // دالة مساعدة للحصول على اسم الصف
  const getClassNameById = (classId) => {
    const classNames = {
      'first-general': 'الصف الأول - تخصص عام',
      'second-water': 'الصف الثاني - تخصص مياه شرب',
      'second-sewage': 'الصف الثاني - تخصص صرف صحي',
      'third-water': 'الصف الثالث - تخصص مياه شرب',
      'third-sewage': 'الصف الثالث - تخصص صرف صحي'
    }
    return classNames[classId] || ''
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    loginWithPhoneOrEmail,
    signup,
    promoteUser,
    logout,
    initAuth,
    getClassNameById
  }
})