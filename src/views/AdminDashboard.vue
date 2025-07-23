<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <Droplets class="w-8 h-8 text-blue-600" />
            <div>
              <h1 class="text-xl font-semibold text-gray-900">لوحة الإدارة</h1>
              <p class="text-sm text-gray-600">مرحباً {{ authStore.user?.name }}</p>
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
      <!-- Statistics -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">إجمالي الطلاب</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalStudents }}</p>
            </div>
            <Users class="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">الصفوف الدراسية</p>
              <p class="text-2xl font-bold text-gray-900">{{ platformStore.classes.length }}</p>
            </div>
            <BookOpen class="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">إجمالي الفيديوهات</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalVideos }}</p>
            </div>
            <Video class="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">الإعلانات</p>
              <p class="text-2xl font-bold text-gray-900">{{ platformStore.announcements.length }}</p>
            </div>
            <Bell class="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <!-- Add Announcement -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <Megaphone class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">إضافة إعلان جديد</h3>
        </div>
        
        <form @submit.prevent="addAnnouncement" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">عنوان الإعلان</label>
            <input
              v-model="newAnnouncement.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل عنوان الإعلان"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">محتوى الإعلان</label>
            <textarea
              v-model="newAnnouncement.content"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل محتوى الإعلان"
            ></textarea>
          </div>

          <button
            type="submit"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            نشر الإعلان
          </button>
        </form>
      </div>

      <!-- Classes Management -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <BookOpen class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">إدارة الصفوف الدراسية</h3>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="cls in platformStore.classes"
            :key="cls.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="viewClass(cls.id)"
          >
            <h4 class="font-semibold text-gray-900 mb-2">{{ cls.name }}</h4>
            <p class="text-sm text-gray-600 mb-3">{{ cls.description }}</p>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span class="flex items-center space-x-2 rtl:space-x-reverse">
                  <Users class="w-4 h-4" />
                  <span>{{ cls.students }} طالب</span>
                </span>
                <span class="flex items-center space-x-2 rtl:space-x-reverse">
                  <Video class="w-4 h-4" />
                  <span>{{ platformStore.getVideosByClass(cls.id).length }} فيديو</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Announcements -->
      <!-- User Management -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <UserCog class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">إدارة المستخدمين</h3>
        </div>
        
        <div class="grid md:grid-cols-3 gap-6">
          <!-- Promote User -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-4">ترقية مستخدم إلى مدرب</h4>
            <form @submit.prevent="promoteToTrainer" class="space-y-3">
              <input
                v-model="promoteForm.identifier"
                type="text"
                placeholder="رقم الهاتف أو البريد الإلكتروني"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                v-model="promoteForm.specialization"
                type="text"
                placeholder="التخصص (مثل: مياه الشرب)"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                ترقية إلى مدرب
              </button>
            </form>
          </div>
          
          <!-- Promote to Admin -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-4">ترقية مستخدم إلى مدير</h4>
            <form @submit.prevent="promoteToAdmin" class="space-y-3">
              <input
                v-model="adminForm.identifier"
                type="text"
                placeholder="رقم الهاتف أو البريد الإلكتروني"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                class="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                ترقية إلى مدير
              </button>
            </form>
          </div>
          
          <!-- Send Warning -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-4">إرسال تحذير لمستخدم</h4>
            <form @submit.prevent="sendWarning" class="space-y-3">
              <input
                v-model="warningForm.identifier"
                type="text"
                placeholder="رقم الهاتف أو البريد الإلكتروني"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                v-model="warningForm.title"
                type="text"
                placeholder="عنوان التحذير"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                v-model="warningForm.message"
                placeholder="نص التحذير"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
              <select
                v-model="warningForm.severity"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">اختر مستوى التحذير</option>
                <option value="low">تحذير بسيط</option>
                <option value="medium">تحذير متوسط</option>
                <option value="high">تحذير شديد</option>
              </select>
              <button
                type="submit"
                class="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700"
              >
                إرسال التحذير
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Video Management -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <Upload class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">إدارة الفيديوهات</h3>
        </div>
        
        <!-- Upload Video Form -->
        <div class="border border-gray-200 rounded-lg p-6 mb-6">
          <h4 class="font-semibold text-gray-900 mb-4">رفع فيديو جديد</h4>
          <form @submit.prevent="uploadVideo" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">عنوان الفيديو</label>
                <input
                  v-model="newVideo.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل عنوان الفيديو"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الصف الدراسي</label>
                <select
                  v-model="newVideo.classId"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر الصف الدراسي</option>
                  <option
                    v-for="cls in platformStore.classes"
                    :key="cls.id"
                    :value="cls.id"
                  >
                    {{ cls.name }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">مدة الفيديو</label>
                <input
                  v-model="newVideo.duration"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: 45:30"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">تصنيف الفيديو</label>
                <select
                  v-model="newVideo.category"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر تصنيف الفيديو</option>
                  <option value="practical">فيديوهات عملي</option>
                  <option value="review">فيديوهات مراجعة</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">وصف الفيديو</label>
              <textarea
                v-model="newVideo.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل وصف الفيديو"
              ></textarea>
            </div>

            <!-- Video Upload Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">طريقة رفع الفيديو</label>
              <div class="flex space-x-4 rtl:space-x-reverse mb-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="uploadMethod"
                    value="file"
                    class="mr-2 ml-2"
                  />
                  <span>رفع ملف فيديو</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="uploadMethod"
                    value="url"
                    class="mr-2 ml-2"
                  />
                  <span>رابط فيديو</span>
                </label>
              </div>

              <!-- File Upload -->
              <div v-if="uploadMethod === 'file'">
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Video class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p class="text-gray-600 mb-2">اسحب الفيديو هنا أو انقر للاختيار</p>
                  <input
                    type="file"
                    accept="video/*"
                    class="hidden"
                    ref="fileInput"
                    @change="handleFileSelect"
                  />
                  <button
                    type="button"
                    @click="$refs.fileInput.click()"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    اختيار فيديو
                  </button>
                </div>
                <p v-if="selectedFile" class="mt-2 text-sm text-green-600">
                  تم اختيار: {{ selectedFile.name }}
                </p>
              </div>

              <!-- URL Input -->
              <div v-if="uploadMethod === 'url'">
                <input
                  v-model="newVideo.url"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل رابط الفيديو (YouTube, Vimeo, إلخ)"
                />
                <p class="mt-2 text-sm text-gray-500">
                  يمكنك إدخال رابط من YouTube أو Vimeo أو أي منصة فيديو أخرى
                </p>
              </div>
            </div>

            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              رفع الفيديو
            </button>
          </form>
        </div>
        
        <!-- Videos List -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-4">الفيديوهات المرفوعة</h4>
          <div class="space-y-4">
            <div
              v-for="video in platformStore.videos"
              :key="video.id"
              class="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div class="flex items-center space-x-4 rtl:space-x-reverse">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Video class="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h5 class="font-medium text-gray-900">{{ video.title }}</h5>
                  <p class="text-sm text-gray-600">{{ video.description }}</p>
                  <div class="flex items-center space-x-4 rtl:space-x-reverse text-xs text-gray-500 mt-1">
                    <span>{{ video.duration }}</span>
                    <span>{{ getClassName(video.classId) }}</span>
                    <span>{{ video.category === 'practical' ? 'عملي' : 'مراجعة' }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  @click="editVideo(video)"
                  class="text-blue-600 hover:text-blue-800 p-2"
                  title="تعديل"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button
                  @click="deleteVideo(video.id)"
                  class="text-red-600 hover:text-red-800 p-2"
                  title="حذف"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <AlertTriangle class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">التحذيرات المرسلة</h3>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="warning in platformStore.getAllWarnings"
            :key="warning.id"
            class="border-r-4 p-4 rounded-lg"
            :class="[
              warning.severity === 'low' ? 'border-yellow-500 bg-yellow-50' :
              warning.severity === 'medium' ? 'border-orange-500 bg-orange-50' :
              'border-red-500 bg-red-50'
            ]"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <h4 class="font-semibold text-gray-900">{{ warning.title }}</h4>
                <p class="text-sm text-gray-600">إلى: {{ warning.userName }}</p>
              </div>
              <div class="flex items-center space-x-2 rtl:space-x-reverse">
                <span 
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="[
                    warning.severity === 'low' ? 'bg-yellow-100 text-yellow-800' :
                    warning.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  ]"
                >
                  {{ 
                    warning.severity === 'low' ? 'بسيط' :
                    warning.severity === 'medium' ? 'متوسط' : 'شديد'
                  }}
                </span>
                <span 
                  v-if="!warning.isRead"
                  class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                >
                  غير مقروء
                </span>
                <button
                  @click="deleteWarning(warning.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
            <p class="text-gray-700 mb-2">{{ warning.message }}</p>
            <div class="flex justify-between text-sm text-gray-500">
              <span>بواسطة: {{ warning.sentBy }}</span>
              <span>{{ warning.date }}</span>
            </div>
          </div>
          
          <div v-if="platformStore.getAllWarnings.length === 0" class="text-center py-8 text-gray-500">
            <AlertTriangle class="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>لا توجد تحذيرات مرسلة</p>
          </div>
        </div>
      </div>
      
      <!-- Recent Announcements -->
      <div class="bg-white rounded-xl shadow-lg p-6 mt-8">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <Bell class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">الإعلانات الحديثة</h3>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="announcement in platformStore.announcements"
            :key="announcement.id"
            class="border-r-4 border-blue-500 bg-blue-50 p-4 rounded-lg"
          >
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-semibold text-gray-900">{{ announcement.title }}</h4>
              <button
                @click="deleteAnnouncement(announcement.id)"
                class="text-red-600 hover:text-red-800"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
            <p class="text-gray-700 mb-2">{{ announcement.content }}</p>
            <div class="flex justify-between text-sm text-gray-500">
              <span>{{ announcement.author }}</span>
              <span>{{ announcement.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePlatformStore } from '../stores/platform'
import { 
  Droplets, 
  LogOut, 
  Users, 
  BookOpen, 
  Video, 
  Bell, 
  Megaphone,
  Trash2,
  UserCog,
  Upload,
  Edit,
  AlertTriangle
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const platformStore = usePlatformStore()

const newAnnouncement = ref({
  title: '',
  content: ''
})

const promoteForm = ref({
  identifier: '',
  specialization: ''
})

const adminForm = ref({
  identifier: ''
})

const warningForm = ref({
  identifier: '',
  title: '',
  message: '',
  severity: ''
})

const newVideo = ref({
  title: '',
  classId: '',
  duration: '',
  category: '',
  description: '',
  url: ''
})

const uploadMethod = ref('file')
const selectedFile = ref(null)

const totalStudents = computed(() => {
  return platformStore.classes.reduce((total, cls) => total + cls.students, 0)
})

const totalVideos = computed(() => {
  return platformStore.getTotalVideosCount
})

const logout = () => {
  authStore.logout()
  router.push('/')
}

const addAnnouncement = () => {
  platformStore.addAnnouncement({
    title: newAnnouncement.value.title,
    content: newAnnouncement.value.content,
    author: authStore.user.name
  })
  
  // Reset form
  newAnnouncement.value = { title: '', content: '' }
  
  alert('تم نشر الإعلان بنجاح!')
}

const deleteAnnouncement = (id) => {
  if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
    const index = platformStore.announcements.findIndex(a => a.id === id)
    if (index !== -1) {
      platformStore.announcements.splice(index, 1)
    }
  }
}

const viewClass = (classId) => {
  router.push(`/class/${classId}`)
}

const promoteToTrainer = () => {
  const result = authStore.promoteUser(promoteForm.value.identifier, 'trainer', {
    specialization: promoteForm.value.specialization
  })
  
  if (result.success) {
    alert('تم ترقية المستخدم إلى مدرب بنجاح!')
    promoteForm.value = { identifier: '', specialization: '' }
  } else {
    alert(result.message)
  }
}

const promoteToAdmin = () => {
  const result = authStore.promoteUser(adminForm.value.identifier, 'admin')
  
  if (result.success) {
    alert('تم ترقية المستخدم إلى مدير بنجاح!')
    adminForm.value = { identifier: '' }
  } else {
    alert(result.message)
  }
}

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0]
}

const uploadVideo = () => {
  if (uploadMethod.value === 'file' && !selectedFile.value) {
    alert('يرجى اختيار ملف فيديو')
    return
  }
  
  if (uploadMethod.value === 'url' && !newVideo.value.url) {
    alert('يرجى إدخال رابط الفيديو')
    return
  }

  const videoData = {
    title: newVideo.value.title,
    description: newVideo.value.description,
    duration: newVideo.value.duration,
    classId: parseInt(newVideo.value.classId),
    category: newVideo.value.category,
    url: uploadMethod.value === 'url' ? newVideo.value.url : null,
    uploadedBy: authStore.user.email || authStore.user.username,
    uploadDate: new Date()
  }

  platformStore.addVideo(videoData)
  
  // Reset form
  newVideo.value = {
    title: '',
    classId: '',
    duration: '',
    category: '',
    description: '',
    url: ''
  }
  selectedFile.value = null
  uploadMethod.value = 'file'
  
  alert('تم رفع الفيديو بنجاح!')
}

const editVideo = (video) => {
  // يمكن إضافة modal للتعديل لاحقاً
  console.log('تعديل الفيديو:', video.title)
}

const deleteVideo = (videoId) => {
  if (confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
    platformStore.deleteVideo(videoId)
    alert('تم حذف الفيديو بنجاح!')
  }
}

const getClassName = (classId) => {
  const cls = platformStore.getClassById(classId)
  return cls ? cls.name : 'غير محدد'
}

const sendWarning = () => {
  // البحث عن المستخدم
  const users = [
    ...authStore.mockUsers || []
  ]
  
  const targetUser = users.find(u => 
    u.phone === warningForm.value.identifier || 
    u.email === warningForm.value.identifier ||
    u.username === warningForm.value.identifier
  )
  
  if (!targetUser) {
    alert('المستخدم غير موجود')
    return
  }
  
  const warningData = {
    userId: targetUser.id,
    userName: targetUser.name,
    title: warningForm.value.title,
    message: warningForm.value.message,
    severity: warningForm.value.severity,
    sentBy: authStore.user.name
  }
  
  platformStore.addWarning(warningData)
  
  // Reset form
  warningForm.value = {
    identifier: '',
    title: '',
    message: '',
    severity: ''
  }
  
  alert('تم إرسال التحذير بنجاح!')
}

const deleteWarning = (warningId) => {
  if (confirm('هل أنت متأكد من حذف هذا التحذير؟')) {
    platformStore.deleteWarning(warningId)
    alert('تم حذف التحذير بنجاح!')
  }
}
</script>