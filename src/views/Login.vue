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
          {{ isSignup ? 'إنشاء حساب جديد' : 'تسجيل الدخول' }}
        </h2>
        <p class="mt-2 text-gray-700 font-medium text-lg">المنصة الرسمية لطلاب مياه الشرب والصرف الصحي</p>
      </div>

      <form @submit.prevent="isSignup ? handleSignup() : handleLogin()" class="mt-8 space-y-6 relative z-10">
        <div class="card-enhanced p-10 space-y-6 hover-lift">
          <!-- Login Form -->
          <div v-if="!isSignup">
            <label for="identifier" class="block text-sm font-bold text-gray-700 mb-3">
              رقم الهاتف أو البريد الإلكتروني
            </label>
            <input
              id="identifier"
              v-model="identifier"
              type="email"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
              placeholder="أدخل رقم الهاتف أو البريد الإلكتروني"
            />
          </div>

          <!-- Signup Form -->
          <div v-if="isSignup" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-bold text-gray-700 mb-3">
                الاسم الكامل
              </label>
              <input
                id="name"
                v-model="signupData.name"
                type="text"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                placeholder="أدخل الاسم الكامل"
              />
            </div>

            <div>
              <label for="username" class="block text-sm font-bold text-gray-700 mb-3">
                اسم المستخدم
              </label>
              <input
                id="username"
                v-model="signupData.username"
                type="text"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                placeholder="أدخل اسم المستخدم"
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-bold text-gray-700 mb-3">
                رقم الهاتف
              </label>
              <input
                id="phone"
                v-model="signupData.phone"
                type="tel"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                placeholder="أدخل رقم الهاتف"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-bold text-gray-700 mb-3">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                v-model="signupData.email"
                type="email"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>

            <div>
              <label for="class" class="block text-sm font-bold text-gray-700 mb-3">
                الصف الدراسي
              </label>
              <select
                id="class"
                v-model="signupData.class"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
              >
                <option value="">اختر الصف</option>
                <option value="first-general">الصف الأول - تخصص عام</option>
                <option value="second-water">الصف الثاني - تخصص مياه شرب</option>
                <option value="second-sewage">الصف الثاني - تخصص صرف صحي</option>
                <option value="third-water">الصف الثالث - تخصص مياه شرب</option>
                <option value="third-sewage">الصف الثالث - تخصص صرف صحي</option>
              </select>
            </div>
          </div>
          <div>
            <label for="password" class="block text-sm font-bold text-gray-700 mb-3">
              كلمة المرور
            </label>
            <input
              id="password"
              v-model="passwordModel"
              type="password"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
              placeholder="أدخل كلمة المرور"
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
              {{ isSignup ? 'جاري إنشاء الحساب...' : 'جاري تسجيل الدخول...' }}
            </span>
            <span v-else>{{ isSignup ? 'إنشاء حساب' : 'تسجيل الدخول' }}</span>
          </button>

          <div class="text-center">
            <button
              type="button"
              @click="toggleMode"
              class="text-purple-600 hover:text-purple-800 font-semibold text-sm transition-colors duration-300"
            >
              {{ isSignup ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب جديد' }}
            </button>
          </div>
        </div>
      </form>

      <!-- Demo Accounts -->
      <div v-if="!isSignup" class="card-enhanced p-8 hover-lift relative z-10">
        <h3 class="text-xl font-bold text-gradient mb-6">حسابات تجريبية:</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="font-bold text-blue-600">طالب:</span>
            <span class="text-gray-700 bg-blue-50 px-3 py-1 rounded-full">01234567890 / 123456</span>
          </div>
          <div class="flex justify-between">
            <span class="font-bold text-green-600">مدرب:</span>
            <span class="text-gray-700 bg-green-50 px-3 py-1 rounded-full">trainer1@example.com / 123456</span>
          </div>
          <div class="flex justify-between">
            <span class="font-bold text-purple-600">مدير:</span>
            <span class="text-gray-700 bg-purple-50 px-3 py-1 rounded-full">admin@example.com / 123456</span>
          </div>
          <div class="text-xs text-gray-600 mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <strong>ملاحظة:</strong> إذا لم تعمل الحسابات التجريبية، يرجى إنشاء حساب جديد أولاً من خلال "إنشاء حساب جديد"
          </div>
          <div class="text-xs text-gray-600 mt-4 p-3 bg-gray-50 rounded-lg">
            يمكن تسجيل الدخول باستخدام رقم الهاتف أو البريد الإلكتروني
          </div>
        </div>
      </div>

      <!-- Quick Demo Account Creation -->
      <div v-if="!isSignup" class="card-enhanced p-6 hover-lift relative z-10">
        <h4 class="text-lg font-bold text-gradient mb-4">إنشاء حسابات تجريبية سريعة:</h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            @click="createDemoAccount('student')"
            class="btn-gradient-primary py-2 px-4 text-sm"
            :disabled="loading"
          >
            <span>إنشاء حساب طالب</span>
          </button>
          <button
            @click="createDemoAccount('trainer')"
            class="btn-gradient-success py-2 px-4 text-sm"
            :disabled="loading"
          >
            <span>إنشاء حساب مدرب</span>
          </button>
          <button
            @click="createDemoAccount('admin')"
            class="btn-gradient-secondary py-2 px-4 text-sm"
            :disabled="loading"
          >
            <span>إنشاء حساب مدير</span>
          </button>
        </div>
        <p class="text-xs text-gray-600 mt-3 text-center">
          سيتم إنشاء حسابات تجريبية بكلمة مرور: 123456
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Droplets } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const isSignup = ref(false)
const identifier = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const signupData = ref({
  name: '',
  username: '',
  phone: '',
  email: '',
  class: '',
  password: ''
})

const passwordModel = computed({
  get() {
    return isSignup.value ? signupData.value.password : password.value
  },
  set(value) {
    if (isSignup.value) {
      signupData.value.password = value
    } else {
      password.value = value
    }
  }
})

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

const toggleMode = () => {
  isSignup.value = !isSignup.value
  error.value = ''
  success.value = ''
}
const handleLogin = async () => {
const createDemoAccount = async (role) => {
  loading.value = true
  error.value = ''
  success.value = ''

  const demoAccounts = {
    student: {
      name: 'أحمد محمد (تجريبي)',
      phone: '01234567890',
      email: 'student.demo@example.com',
      password: '123456',
      classId: 'first-general',
      className: 'الصف الأول - تخصص عام'
    },
    trainer: {
      name: 'د. محمد أحمد (مدرب تجريبي)',
      phone: '01111111111',
      email: 'trainer.demo@example.com',
      password: '123456',
      classId: 'trainer',
      className: 'مدرب'
    },
    admin: {
      name: 'مدير المنصة (تجريبي)',
      phone: '01000000000',
      email: 'admin.demo@example.com',
      password: '123456',
      classId: 'admin',
      className: 'مدير'
    }
  }

  try {
    const accountData = demoAccounts[role]
    const result = await authStore.signup(accountData)
    
    if (result.success) {
      success.value = `تم إنشاء حساب ${role === 'student' ? 'الطالب' : role === 'trainer' ? 'المدرب' : 'المدير'} التجريبي بنجاح!`
      setTimeout(() => {
        success.value = ''
      }, 3000)
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = 'حدث خطأ أثناء إنشاء الحساب التجريبي'
  } finally {
    loading.value = false
  }
}
  loading.value = true
  error.value = ''

  try {
    const loginSuccess = await authStore.login(identifier.value, password.value)
    
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
      error.value = authStore.error || 'بيانات تسجيل الدخول غير صحيحة'
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'حدث خطأ أثناء تسجيل الدخول'
  } finally {
    loading.value = false
  }
}

const handleSignup = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const result = await authStore.signup({
      name: signupData.value.name,
      phone: signupData.value.phone,
      email: signupData.value.email,
      password: signupData.value.password,
      classId: signupData.value.class,
      className: getClassNameById(signupData.value.class)
    })
    
    if (result.success) {
      success.value = result.message
      // Reset form
      signupData.value = {
        name: '',
        username: '',
        phone: '',
        email: '',
        class: '',
        password: ''
      }
      // Switch to login mode after 2 seconds
      setTimeout(() => {
        isSignup.value = false
        success.value = ''
      }, 2000)
    } else {
      error.value = result.message
    }
  } catch (err) {
    console.error('Signup error:', err)
    error.value = 'حدث خطأ أثناء إنشاء الحساب'
  } finally {
    loading.value = false
  }
}
</script>