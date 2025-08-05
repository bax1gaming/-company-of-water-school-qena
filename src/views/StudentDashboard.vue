<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse"></div>
      <div class="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-10 animate-pulse" style="animation-delay: 1s;"></div>
    </div>

    <!-- Header -->
    <header class="glass-morphism shadow-xl relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center glow-effect">
              <Droplets class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gradient">لوحة الطالب</h1>
              <p class="text-sm text-gray-700 font-medium">مرحباً {{ authStore.user?.name }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              @click="showWarnings = true"
              class="relative text-gray-600 hover:text-purple-600 p-3 rounded-xl hover:bg-purple-50 transition-all duration-300"
              title="التحذيرات والإشعارات"
            >
              <Bell class="w-6 h-6" />
              <span v-if="unreadWarningsCount > 0" 
                    class="notification-badge absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs">
                {{ unreadWarningsCount }}
              </span>
            </button>
            <button
              @click="logout"
              class="btn-gradient-secondary flex items-center space-x-2 rtl:space-x-reverse hover-lift"
            >
              <LogOut class="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <!-- Student Info Card -->
      <div class="card-enhanced p-8 mb-8 hover-lift">
        <div class="flex items-center space-x-4 rtl:space-x-reverse">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg glow-effect float-animation">
            <User class="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gradient mb-2">{{ authStore.user?.name }}</h2>
            <p class="text-gray-700 font-semibold text-lg">{{ authStore.user?.className }}</p>
            <p class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block mt-2">كود الطالب: {{ authStore.user?.studentCode }}</p>
          </div>
        </div>
      </div>

      <!-- Announcements -->
      <div v-if="platformStore.announcements.length > 0" class="card-enhanced p-8 mb-8 hover-lift">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center glow-effect">
            <Megaphone class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-2xl font-bold text-gradient">الإعلانات</h3>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="announcement in platformStore.announcements.slice(0, 3)"
            :key="announcement.id"
            class="border-r-4 border-gradient-to-b from-blue-500 to-purple-500 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl hover-lift"
          >
            <h4 class="font-bold text-gray-900 mb-3 text-lg">{{ announcement.title }}</h4>
            <p class="text-gray-700 mb-3 leading-relaxed">{{ announcement.content }}</p>
            <div class="flex justify-between text-sm text-gray-500">
              <span class="font-medium">{{ announcement.author }}</span>
              <span class="bg-white px-2 py-1 rounded-full">{{ announcement.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div class="card-enhanced p-8 hover-lift">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium mb-2">الفيديوهات المتاحة</p>
              <p class="text-3xl font-bold text-gradient">{{ availableVideos }}</p>
            </div>
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center glow-effect">
              <Video class="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div class="card-enhanced p-8 hover-lift" style="animation-delay: 0.1s;">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium mb-2">الملفات والملخصات</p>
              <p class="text-3xl font-bold text-gradient">{{ availableFiles }}</p>
            </div>
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center glow-effect">
              <FileText class="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div class="card-enhanced p-8 hover-lift" style="animation-delay: 0.2s;">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium mb-2">الصف الدراسي</p>
              <p class="text-2xl font-bold text-gradient">{{ getClassLevel() }}</p>
            </div>
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center glow-effect">
              <BookOpen class="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Available Classes -->
      <div class="card-enhanced p-8 hover-lift">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center glow-effect">
            <BookOpen class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-2xl font-bold text-gradient">الصفوف الدراسية المتاحة</h3>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="cls in availableClasses"
            :key="cls.id"
            class="card-enhanced p-8 cursor-pointer hover-lift glow-effect"
            @click="viewClass(cls.id)"
          >
            <div class="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen class="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 class="font-bold text-gray-900 text-lg">{{ cls.name }}</h4>
                <p class="text-sm text-gray-600 leading-relaxed">{{ cls.description }}</p>
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm text-gray-600 font-medium">
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
                  class="w-full btn-gradient-primary py-3 px-4 font-semibold"
                >
                  <span>دخول الصف</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="availableClasses.length === 0" class="text-center py-12">
          <div class="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <BookOpen class="w-10 h-10 text-white" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">لا توجد صفوف متاحة</h3>
          <p class="text-gray-600 leading-relaxed">لم يتم العثور على صفوف دراسية متاحة لك حالياً</p>
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

<style scoped>
/* Mobile Responsive Styles for Student Dashboard */
@media (max-width: 768px) {
  .max-w-7xl {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .py-8 {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  
  .py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  
  .p-8 {
    padding: 1.5rem;
  }
  
  .grid.md\\:grid-cols-3 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .grid.md\\:grid-cols-2.lg\\:grid-cols-3 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .text-3xl {
    font-size: 1.5rem;
  }
  
  .text-2xl {
    font-size: 1.25rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  .w-20.h-20 {
    width: 4rem;
    height: 4rem;
  }
  
  .w-16.h-16 {
    width: 3rem;
    height: 3rem;
  }
  
  .w-14.h-14 {
    width: 3rem;
    height: 3rem;
  }
  
  .w-12.h-12 {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .space-x-4 > * + * {
    margin-right: 0.75rem;
  }
  
  .rtl\\:space-x-reverse > * + * {
    margin-right: 0;
    margin-left: 0.75rem;
  }
  
  .flex.items-center.space-x-4 {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .flex.items-center.space-x-4.rtl\\:space-x-reverse {
    align-items: center;
  }
}

@media (max-width: 480px) {
  .py-8 {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
  
  .p-8 {
    padding: 1rem;
  }
  
  .text-3xl {
    font-size: 1.25rem;
  }
  
  .text-2xl {
    font-size: 1.125rem;
  }
  
  .text-xl {
    font-size: 1rem;
  }
  
  .w-20.h-20 {
    width: 3rem;
    height: 3rem;
  }
  
  .w-16.h-16 {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .w-12.h-12 {
    width: 2rem;
    height: 2rem;
  }
  
  .w-10.h-10 {
    width: 2rem;
    height: 2rem;
  }
  
  .w-8.h-8 {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .w-7.h-7 {
    width: 1.25rem;
    height: 1.25rem;
  }
}
</script>