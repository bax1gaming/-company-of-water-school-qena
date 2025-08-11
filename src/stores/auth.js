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
  const login = async (nationalId, loginCode) => {
    loading.value = true
    error.value = null

    try {
      // استخدام الدالة الجديدة لتسجيل الدخول برقم القومي والكود
      const result = await auth.signInWithNationalId(nationalId, loginCode)

      if (result.error) {
        error.value = result.error.message || 'رقم القومي أو الكود غير صحيح'
        return false
      }

      if (result.data?.user) {
        user.value = result.data.user
        profile.value = result.profile
        
        // حفظ بيانات المستخدم محلياً للجلسات المستقبلية
        localStorage.setItem('currentUser', JSON.stringify({
          user: result.data.user,
          profile: result.profile
        }))
        
        return true
      }

      error.value = 'فشل في تسجيل الدخول'
      return false
    } catch (err) {
      console.error('Login error:', err)
      error.value = 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.'
      return false
    } finally {
      loading.value = false
    }
  }

  // إزالة دالة التسجيل

  // تسجيل الخروج
  const logout = async () => {
    loading.value = true
    
    try {
      await auth.signOut()
      user.value = null
      profile.value = null
      error.value = null
      localStorage.removeItem('currentUser')
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
      // محاولة الحصول على المستخدم من Supabase أولاً
      const userData = await auth.getCurrentUser()
      if (userData.user && userData.profile) {
        user.value = userData.user
        profile.value = userData.profile
      } else {
        // محاولة الحصول على المستخدم من التخزين المحلي
        const storedUser = localStorage.getItem('currentUser')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          user.value = parsedUser.user
          profile.value = parsedUser.profile
        }
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
    logout,
    initAuth,
    promoteUser
  }
})