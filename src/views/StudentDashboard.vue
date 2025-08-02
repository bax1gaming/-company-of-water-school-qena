<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <Droplets class="w-8 h-8 text-blue-600" />
            <div>
              <h1 class="text-xl font-semibold text-gray-900">لوحة الطالب</h1>
              <p class="text-sm text-gray-600">مرحباً {{ authStore.user?.name }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              @click="showWarnings = true"
              class="relative text-gray-600 hover:text-gray-900 p-2"
              title="التحذيرات والإشعارات"
            >
              <Bell class="w-6 h-6" />
              <span v-if="unreadWarningsCount > 0" 
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ unreadWarningsCount }}
              </span>
            </button>
            <button
              @click="logout"
              class="text-gray-600 hover:text-gray-900 flex items-center space-x-2 rtl:space-x-reverse"
            >
              <LogOut class="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Student Info Card -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-4 rtl:space-x-reverse">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User class="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ authStore.user?.name }}</h2>
            <p class="text-gray-600">{{ authStore.user?.className }}</p>
            <p class="text-sm text-gray-500">كود الطالب: {{ authStore.user?.studentCode }}</p>
          </div>
        </div>
      </div>

      <!-- Announcements -->
      <div v-if="platformStore.announcements.length > 0" class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <Megaphone class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">الإعلانات</h3>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="announcement in platformStore.announcements.slice(0, 3)"
            :key="announcement.id"
            class="border-r-4 border-blue-500 bg-blue-50 p-4 rounded-lg"
          >
            <h4 class="font-semibold text-gray-900 mb-2">{{ announcement.title }}</h4>
            <p class="text-gray-700 mb-2">{{ announcement.content }}</p>
            <div class="flex justify-between text-sm text-gray-500">
              <span>{{ announcement.author }}</span>
              <span>{{ announcement.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">الفيديوهات المتاحة</p>
              <p class="text-2xl font-bold text-gray-900">{{ availableVideos }}</p>
            </div>
            <Video class="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">الملفات والملخصات</p>
              <p class="text-2xl font-bold text-gray-900">{{ availableFiles }}</p>
            </div>
            <FileText class="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">الصف الدراسي</p>
              <p class="text-lg font-bold text-gray-900">{{ getClassLevel() }}</p>
            </div>
            <BookOpen class="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <!-- Available Classes -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <BookOpen class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">الصفوف الدراسية المتاحة</h3>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="cls in availableClasses"
            :key="cls.id"
            class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
            @click="viewClass(cls.id)"
          >
            <div class="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">{{ cls.name }}</h4>
                <p class="text-sm text-gray-600">{{ cls.description }}</p>
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span class="flex items-center space-x-2 rtl:space-x-reverse">
                  <Video class="w-4 h-4" />
                  <span>{{ getClassVideosCount(cls.id) }} فيديو</span>
                </span>
                <span class="flex items-center space-x-2 rtl:space-x-reverse">
                  <FileText class="w-4 h-4" />
                  <span>{{ getClassFilesCount(cls.id) }} ملف</span>
                </span>
              </div>
              
              <div class="pt-3">
                <button
                  @click.stop="viewClass(cls.id)"
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  دخول الصف
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="availableClasses.length === 0" class="text-center py-12">
          <BookOpen class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">لا توجد صفوف متاحة</h3>
          <p class="text-gray-600">لم يتم العثور على صفوف دراسية متاحة لك حالياً</p>
        </div>
      </div>
    </div>

    <!-- Warnings Modal -->
    <WarningsModal 
      :is-open="showWarnings" 
      @close="showWarnings = false" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePlatformStore } from '../stores/platform'
import { useWarningsStore } from '../stores/warnings'
import WarningsModal from '../components/WarningsModal.vue'
import { 
  Droplets, 
  LogOut, 
  User, 
  BookOpen, 
  Video, 
  FileText, 
  Bell,
  Megaphone
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const platformStore = usePlatformStore()
const warningsStore = useWarningsStore()

const showWarnings = ref(false)

// Computed properties
const availableClasses = computed(() => {
  // يمكن للطالب الوصول لجميع الصفوف أو حسب مستواه
  return platformStore.classes
})

const availableVideos = computed(() => {
  return platformStore.videos.length
})

const availableFiles = computed(() => {
  return platformStore.files.length
})

const unreadWarningsCount = computed(() => {
  if (!authStore.user) return 0
  return warningsStore.getUnreadWarningsCount(authStore.user.id, authStore.user.role)
})

// Methods
const logout = () => {
  authStore.logout()
  router.push('/')
}

const viewClass = (classId) => {
  router.push(`/class/${classId}`)
}

const getClassLevel = () => {
  const className = authStore.user?.className || ''
  if (className.includes('الأول')) return 'الأول'
  if (className.includes('الثاني')) return 'الثاني'
  if (className.includes('الثالث')) return 'الثالث'
  return 'غير محدد'
}

const getClassVideosCount = (classId) => {
  return platformStore.getVideosByClass(classId).length
}

const getClassFilesCount = (classId) => {
  return platformStore.getFilesByClass(classId).length
}
</script>