<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse" style="animation-delay: 1s;"></div>
    </div>

    <div class="max-w-md w-full space-y-8">
      <div class="text-center relative z-10">
        <div class="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl glow-effect float-animation">
          <Droplets class="w-12 h-12 text-white" />
        </div>
        <h2 class="text-4xl font-bold text-gradient mb-4">
          تسجيل الدخول
        </h2>
        <p class="mt-2 text-gray-700 font-medium text-lg">المنصة الرسمية لطلاب مياه الشرب والصرف الصحي</p>
      </div>

      <form @submit.prevent="handleLogin()" class="mt-8 space-y-6 relative z-10">
        <div class="card-enhanced p-10 space-y-6 hover-lift">
          <div>
            <label for="nationalId" class="block text-sm font-bold text-gray-700 mb-3">
              رقم القومي (14 رقم)
            </label>
            <input
              id="nationalId"
              v-model="nationalId"
              type="text"
              maxlength="14"
              pattern="[0-9]{14}"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
              placeholder="أدخل رقم القومي (14 رقم)"
            />
          </div>

          <div>
            <label for="loginCode" class="block text-sm font-bold text-gray-700 mb-3">
              كود تسجيل الدخول
            </label>
            <input
              id="loginCode"
              v-model="loginCode"
              type="password"
              maxlength="10"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
              placeholder="أدخل كود تسجيل الدخول"
            />
          </div>

          <div v-if="error" class="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl font-medium">
            {{ error }}
          </div>

          <div v-if="success" class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl font-medium">
            {{ success }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-gradient-primary py-4 px-6 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <div class="loading-spinner w-5 h-5 mr-3"></div>
              جاري تسجيل الدخول...
            </span>
            <span v-else>تسجيل الدخول</span>
          </button>
        </div>
      </form>

      <!-- Demo Accounts -->
      <div class="card-enhanced p-8 hover-lift relative z-10">
        <h3 class="text-xl font-bold text-gradient mb-6">حسابات تجريبية:</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="font-bold text-blue-600">طالب:</span>
            <span class="text-gray-700 bg-blue-50 px-3 py-1 rounded-full">12345678901234 / 1234</span>
          </div>
          <div class="flex justify-between">
            <span class="font-bold text-green-600">مدرب:</span>
            <span class="text-gray-700 bg-green-50 px-3 py-1 rounded-full">98765432109876 / 5678</span>
          </div>
          <div class="flex justify-between">
            <span class="font-bold text-purple-600">مدير:</span>
            <span class="text-gray-700 bg-purple-50 px-3 py-1 rounded-full">11111111111111 / 0000</span>
          </div>
              استخدم الرقم القومي (14 رقم) وكود تسجيل الدخول للوصول للمنصة. البيانات محفوظة بشكل آمن في قاعدة البيانات.
            استخدم رقم القومي وكود تسجيل الدخول للوصول للمنصة
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Droplets } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const nationalId = ref('')
const loginCode = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  // التحقق من صحة رقم القومي (14 رقم)
  if (nationalId.value.length !== 14 || !/^\d{14}$/.test(nationalId.value)) {
    error.value = 'رقم القومي يجب أن يكون 14 رقم'
    loading.value = false
    return
  }

  try {
    const loginSuccess = await authStore.login(nationalId.value, loginCode.value)
    
    if (loginSuccess) {
      const role = authStore.profile?.role
      switch (role) {
        case 'student':
          router.push('/student')
          break
        case 'trainer':
          router.push('/trainer')
          break
        case 'admin':
          router.push('/admin')
          break
        default:
          router.push('/')
      }
    } else {
      error.value = authStore.error || 'رقم القومي أو الكود غير صحيح'
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'حدث خطأ أثناء تسجيل الدخول'
  } finally {
    loading.value = false
  }
}
</script>