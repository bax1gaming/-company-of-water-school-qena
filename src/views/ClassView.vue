<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <button @click="goBack" class="text-gray-600 hover:text-gray-900">
              <ArrowRight class="w-6 h-6" />
            </button>
            <Droplets class="w-8 h-8 text-blue-600" />
            <div>
              <h1 class="text-xl font-semibold text-gray-900">{{ classData?.name }}</h1>
              <p class="text-sm text-gray-600">{{ classData?.description }}</p>
            </div>
          </div>
          <button
            @click="logout"
            class="text-gray-600 hover:text-gray-900 flex items-center space-x-2 rtl:space-x-reverse"
          >
            <LogOut class="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="classData">
        <!-- Class Info -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen class="w-8 h-8 text-blue-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900">{{ classData.name }}</h3>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users class="w-8 h-8 text-green-600" />
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ classData.students }}</p>
              <p class="text-sm text-gray-600">طالب مسجل</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video class="w-8 h-8 text-purple-600" />
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ classData.videos.length }}</p>
              <p class="text-sm text-gray-600">فيديو تعليمي</p>
            </div>
          </div>
        </div>

        <!-- Videos List -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
            <Video class="w-6 h-6 text-blue-600" />
            <h3 class="text-xl font-semibold text-gray-900">المحتوى التعليمي</h3>
          </div>
          
          <!-- Sections Tabs -->
          <div v-if="classData.sections" class="mb-6">
            <div class="flex space-x-1 rtl:space-x-reverse bg-gray-100 p-1 rounded-lg">
              <button
                v-for="(section, key) in classData.sections"
                :key="key"
                @click="activeSection = key"
                :class="[
                  'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
                  activeSection === key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                {{ section.name }}
              </button>
            </div>
          </div>
          
          <!-- Section Content -->
          <div v-if="classData.sections && activeSection">
            <!-- Videos Section -->
            <div v-if="activeSection !== 'files' && classData.sections[activeSection]?.videos?.length > 0" class="space-y-4">
              <div
                v-for="video in classData.sections[activeSection].videos"
                :key="video.id"
                class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                @click="watchVideo(video.id)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4 rtl:space-x-reverse">
                    <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Play class="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900 mb-1">{{ video.title }}</h4>
                      <p class="text-gray-600 mb-2">{{ video.trainer }}</p>
                      <div class="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                        <span class="flex items-center space-x-1 rtl:space-x-reverse">
                          <Clock class="w-4 h-4" />
                          <span>{{ video.duration }}</span>
                        </span>
                        <span class="flex items-center space-x-1 rtl:space-x-reverse">
                          <Calendar class="w-4 h-4" />
                          <span>{{ video.uploadDate }}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="text-blue-600">
                    <ChevronLeft class="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Files Section -->
            <div v-else-if="activeSection === 'files' && classData.sections.files?.files?.length > 0" class="space-y-4">
              <div
                v-for="file in classData.sections.files.files"
                :key="file.id"
                class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4 rtl:space-x-reverse">
                    <div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText class="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900 mb-1">{{ file.title }}</h4>
                      <p class="text-gray-600 mb-2">{{ file.trainer }}</p>
                      <div class="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                        <span class="flex items-center space-x-1 rtl:space-x-reverse">
                          <FileText class="w-4 h-4" />
                          <span>{{ file.type.toUpperCase() }}</span>
                        </span>
                        <span class="flex items-center space-x-1 rtl:space-x-reverse">
                          <Calendar class="w-4 h-4" />
                          <span>{{ file.uploadDate }}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="text-green-600">
                    <Download class="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <div class="w-16 h-16 text-gray-300 mx-auto mb-4">
                <Video v-if="activeSection !== 'files'" class="w-full h-full" />
                <FileText v-else class="w-full h-full" />
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">
                {{ activeSection === 'files' ? 'لا توجد ملفات متاحة' : 'لا توجد فيديوهات متاحة' }}
              </h4>
              <p class="text-gray-600">
                {{ activeSection === 'files' ? 'سيتم إضافة الملفات والملخصات قريباً' : 'سيتم إضافة الفيديوهات التعليمية قريباً' }}
              </p>
            </div>
          </div>
          
          <!-- Legacy support for classes without sections -->
          <div v-else-if="classData.videos && classData.videos.length > 0" class="space-y-4">
            <div
              v-for="video in classData.videos"
              :key="video.id"
              class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              @click="watchVideo(video.id)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4 rtl:space-x-reverse">
                  <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Play class="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900 mb-1">{{ video.title }}</h4>
                    <p class="text-gray-600 mb-2">{{ video.trainer }}</p>
                    <div class="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                      <span class="flex items-center space-x-1 rtl:space-x-reverse">
                        <Clock class="w-4 h-4" />
                        <span>{{ video.duration }}</span>
                      </span>
                      <span class="flex items-center space-x-1 rtl:space-x-reverse">
                        <Calendar class="w-4 h-4" />
                        <span>{{ video.uploadDate }}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="text-blue-600">
                  <ChevronLeft class="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-12">
            <Video class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 class="text-lg font-semibold text-gray-900 mb-2">لا توجد فيديوهات متاحة</h4>
            <p class="text-gray-600">سيتم إضافة الفيديوهات التعليمية قريباً</p>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-12">
        <p class="text-gray-600">جاري تحميل بيانات الصف...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePlatformStore } from '../stores/platform'
import { 
  Droplets, 
  LogOut, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Video, 
  Play, 
  Clock, 
  Calendar,
  ChevronLeft,
  FileText,
  Download
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const platformStore = usePlatformStore()

const activeSection = ref('practical')

const classData = computed(() => {
  return platformStore.getClassById(route.params.classId)
})

const goBack = () => {
  const userRole = authStore.user?.role
  switch (userRole) {
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
}

const logout = () => {
  authStore.logout()
  router.push('/')
}

const watchVideo = (videoId) => {
  router.push(`/video/${videoId}`)
}
</script>