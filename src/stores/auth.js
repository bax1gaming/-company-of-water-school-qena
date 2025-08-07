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
  const login = async (identifier, password) => {
    loading.value = true
    error.value = null

    try {
      let result
      
      // التحقق من نوع المعرف (بريد إلكتروني أم رقم هاتف)
      if (identifier.includes('@')) {
        result = await auth.signInWithEmail(identifier, password)
      } else {
        // البحث عن المستخدم برقم الهاتف أولاً
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, email:auth.users(email)')
          .eq('phone', identifier)
          .single()
        
        if (profileData?.email) {
          result = await auth.signInWithEmail(profileData.email, password)
        } else {
          result = await auth.signInWithPhone(identifier, password)
        }
      }

      if (result.error) {
        error.value = result.error.message
        return false
      }

      // الحصول على بيانات المستخدم والملف الشخصي
      const userData = await auth.getCurrentUser()
      if (userData.user && userData.profile) {
        user.value = userData.user
        profile.value = userData.profile
        return true
      }

      error.value = 'فشل في الحصول على بيانات المستخدم'
      return false
    } catch (err) {
      error.value = err.message
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

      return { success: true, message: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.' }
    } catch (err) {
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