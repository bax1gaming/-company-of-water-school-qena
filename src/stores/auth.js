import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, database } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value && !!profile.value)

  // تسجيل الدخول
  const login = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      // استخدام الدالة الموحدة لتسجيل الدخول
      const result = await auth.signIn(email, password)

      if (result.error) {
        // Handle specific error cases with user-friendly messages
        if (result.error.message && result.error.message.includes('Email not confirmed')) {
          error.value = 'البريد الإلكتروني غير مؤكد. يرجى التحقق من بريدك الوارد لتأكيد حسابك.'
        } else if (result.error.message && result.error.message.includes('Invalid login credentials')) {
          error.value = 'بيانات تسجيل الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور.'
        } else {
          error.value = result.error.message || 'خطأ في تسجيل الدخول'
        }
        return false
      }

      // الحصول على بيانات المستخدم والملف الشخصي
      const userData = await auth.getCurrentUser()
      if (userData.user) {
        user.value = userData.user
        
        // Check if profile exists, if not create one
        if (!userData.profile) {
          // Check for pending profile data from signup
          const pendingData = localStorage.getItem('pendingProfileData')
          if (pendingData) {
            try {
              const profileData = JSON.parse(pendingData)
              const { data: newProfile, error: profileError } = await database.createProfile(userData.user.id, profileData)
              
              if (profileError) {
                console.error('Profile creation error:', profileError)
                error.value = 'فشل في إنشاء الملف الشخصي'
                return false
              }
              
              profile.value = newProfile
              localStorage.removeItem('pendingProfileData')
            } catch (err) {
              console.error('Error parsing pending profile data:', err)
              localStorage.removeItem('pendingProfileData')
              error.value = 'خطأ في بيانات الملف الشخصي'
              return false
            }
          } else {
            // Create basic profile if no pending data
            const basicProfileData = {
              email: userData.user.email,
              name: '',
              phone: '',
              role: 'student'
            }
            
            const { data: newProfile, error: profileError } = await database.createProfile(userData.user.id, basicProfileData)
            
            if (profileError) {
              console.error('Basic profile creation error:', profileError)
              error.value = 'فشل في إنشاء الملف الشخصي الأساسي'
              return false
            }
            
            profile.value = newProfile
          }
        } else {
          profile.value = userData.profile
        }
        
        user.value = userData.user
        return true
      }

      error.value = userData.error?.message || 'فشل في الحصول على بيانات المستخدم'
      return false
    } catch (err) {
      console.error('Login error:', err)
      error.value = 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.'
      return false
    } finally {
      loading.value = false
    }
  }

  // إنشاء حساب جديد
  const signup = async (userData) => {
    loading.value = true
    error.value = null

    try {
      const result = await auth.signUp(userData)
      
      if (result.error) {
        error.value = result.error.message
        return { success: false, message: result.error.message }
      }

      if (result.data?.user) {
        return { success: true, message: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.' }
      } else {
        return { success: false, message: 'فشل في إنشاء الحساب' }
      }
    } catch (err) {
      console.error('Signup error:', err)
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  // تسجيل الخروج
  const logout = async () => {
    loading.value = true
    
    try {
      await auth.signOut()
      user.value = null
      profile.value = null
      error.value = null
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // تهيئة المصادقة
  const initAuth = async () => {
    if (loading.value) return // تجنب التهيئة المتعددة
    
    loading.value = true
    
    try {
      const userData = await auth.getCurrentUser()
      if (userData.user && userData.profile) {
        user.value = userData.user
        profile.value = userData.profile
      }
    } catch (err) {
      console.error('Error initializing auth:', err)
      // لا نعرض خطأ للمستخدم في حالة عدم وجود مصادقة
      user.value = null
      profile.value = null
    } finally {
      loading.value = false
    }
  }

  // ترقية المستخدم (للإدارة)
  const promoteUser = async (identifier, newRole, additionalData = {}) => {
    try {
      // البحث عن المستخدم
      const { data: profiles } = await database.getAllUsers()
      const targetUser = profiles?.find(p => 
        p.phone === identifier || 
        p.email === identifier
      )

      if (!targetUser) {
        return { success: false, message: 'المستخدم غير موجود' }
      }

      if (targetUser.role === newRole) {
        return { success: false, message: `المستخدم لديه صلاحية ${newRole} بالفعل` }
      }

      const result = await database.updateUserRole(targetUser.id, newRole, additionalData)
      
      if (result.error) {
        return { success: false, message: result.error.message }
      }

      return { success: true, message: `تم ترقية المستخدم إلى ${newRole} بنجاح` }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
    initAuth,
    promoteUser
  }
})