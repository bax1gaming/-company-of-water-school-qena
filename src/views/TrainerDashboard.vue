<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <Droplets class="w-8 h-8 text-blue-600" />
            <div>
              <h1 class="text-xl font-semibold text-gray-900">لوحة المدرب</h1>
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
      <!-- Navigation Tabs -->
      <div class="bg-white rounded-xl shadow-lg mb-8">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 rtl:space-x-reverse px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-2 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center space-x-2 rtl:space-x-reverse">
                <component :is="tab.icon" class="w-5 h-5" />
                <span>{{ tab.name }}</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      <!-- Trainer Info -->
      <div v-if="activeTab === 'overview'" class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-4 rtl:space-x-reverse">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <UserCheck class="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ authStore.user?.name }}</h2>
            <p class="text-gray-600">مدرب {{ authStore.user?.specialization }}</p>
          </div>
        </div>
      </div>

      <!-- Upload Video Section -->
      <div v-if="activeTab === 'upload'" class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <Upload class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">رفع فيديو جديد</h3>
        </div>
        
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
              <label class="block text-sm font-medium text-gray-700 mb-2">الفئة المستهدفة</label>
              <select
                v-model="newVideo.classId"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر الفئة المستهدفة</option>
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
              v-model="newVideo.section"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر تصنيف الفيديو</option>
              <option value="practical">فيديوهات عملي</option>
              <option value="review">فيديوهات مراجعة</option>
            </select>
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
                v-model="newVideo.videoUrl"
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
            class="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            رفع الفيديو
          </button>
        </form>
      </div>

      <!-- Classes Overview -->
      <div v-if="activeTab === 'overview'" class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <BookOpen class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">الصفوف الدراسية</h3>
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

      <!-- Student Report Section -->
      <div v-if="activeTab === 'reports'" class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <AlertTriangle class="w-6 h-6 text-orange-600" />
          <h3 class="text-xl font-semibold text-gray-900">تبليغ عن سلوك طالب</h3>
        </div>
        
        <form @submit.prevent="submitReport" class="space-y-6">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">اختر الطالب</label>
              <select
                v-model="newReport.studentId"
                @change="onStudentSelect"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">اختر الطالب</option>
                <option
                  v-for="student in mockStudents"
                  :key="student.id"
                  :value="student.id"
                >
                  {{ student.name }} - {{ student.code }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نوع التبليغ</label>
              <select
                v-model="newReport.reportType"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">اختر نوع التبليغ</option>
                <option value="behavior">سلوك غير مناسب</option>
                <option value="attendance">مشاكل الحضور</option>
                <option value="academic">مشاكل أكاديمية</option>
                <option value="other">أخرى</option>
              </select>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">درجة الخطورة</label>
              <select
                v-model="newReport.severity"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">اختر درجة الخطورة</option>
                <option value="info">إشعار عادي</option>
                <option value="warning">تحذير</option>
                <option value="critical">حرج</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">كود الطالب</label>
              <input
                v-model="newReport.studentCode"
                type="text"
                readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="سيتم ملؤه تلقائياً"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">عنوان التبليغ</label>
            <input
              v-model="newReport.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="أدخل عنوان مختصر للتبليغ"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">وصف المشكلة</label>
            <textarea
              v-model="newReport.description"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="اشرح المشكلة بالتفصيل..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الإجراء المتخذ (اختياري)</label>
            <textarea
              v-model="newReport.actionTaken"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="اذكر أي إجراء قمت باتخاذه..."
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            <Send class="w-5 h-5" />
            <span>إرسال التبليغ</span>
          </button>
        </form>
      </div>

      <!-- My Reports Section -->
      <div v-if="activeTab === 'my-reports'" class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <FileText class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-900">تبليغاتي</h3>
        </div>
        
        <div v-if="myReports.length === 0" class="text-center py-12">
          <FileText class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">لا توجد تبليغات</h3>
          <p class="text-gray-600">لم تقم بإرسال أي تبليغات بعد</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="report in myReports"
            :key="report.id"
            class="border rounded-lg p-4"
            :class="[
              report.severity === 'critical' ? 'border-l-4 border-l-red-500 bg-red-50' : 
              report.severity === 'warning' ? 'border-l-4 border-l-orange-500 bg-orange-50' : 
              'border-l-4 border-l-blue-500 bg-blue-50'
            ]"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <h4 class="font-semibold text-gray-900">{{ report.title }}</h4>
                <p class="text-sm text-gray-600">الطالب: {{ report.studentName }} ({{ report.studentCode }})</p>
              </div>
              <div class="flex items-center space-x-2 rtl:space-x-reverse">
                <span class="text-xs px-2 py-1 rounded-full"
                      :class="[
                        report.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                        report.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      ]">
                  {{ report.status === 'resolved' ? 'تم الحل' : 
                     report.status === 'reviewed' ? 'تمت المراجعة' : 'قيد المراجعة' }}
                </span>
                <span class="text-xs px-2 py-1 rounded-full"
                      :class="[
                        report.severity === 'critical' ? 'bg-red-100 text-red-800' : 
                        report.severity === 'warning' ? 'bg-orange-100 text-orange-800' : 
                        'bg-blue-100 text-blue-800'
                      ]">
                  {{ report.severity === 'critical' ? 'حرج' : 
                     report.severity === 'warning' ? 'تحذير' : 'عادي' }}
                </span>
              </div>
            </div>
            <p class="text-gray-700 mb-3">{{ report.description }}</p>
            <div v-if="report.actionTaken" class="mb-3">
              <p class="text-sm font-medium text-gray-700">الإجراء المتخذ:</p>
              <p class="text-sm text-gray-600">{{ report.actionTaken }}</p>
            </div>
            <div v-if="report.adminNotes && report.status !== 'pending'" class="mb-3 p-3 bg-gray-100 rounded-lg">
              <p class="text-sm font-medium text-gray-700">ملاحظات الإدارة:</p>
              <p class="text-sm text-gray-600">{{ report.adminNotes }}</p>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
              <span>{{ new Date(report.createdAt).toLocaleDateString('ar-EG') }}</span>
              <span v-if="report.reviewedAt">
                تمت المراجعة: {{ new Date(report.reviewedAt).toLocaleDateString('ar-EG') }}
              </span>
            </div>
          </div>
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
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePlatformStore } from '../stores/platform'
import { useWarningsStore } from '../stores/warnings'
import { useReportsStore } from '../stores/reports'
import WarningsModal from '../components/WarningsModal.vue'
import { 
  Droplets, 
  LogOut, 
  UserCheck, 
  Upload, 
  Video, 
  BookOpen, 
  Users,
  Bell,
  AlertTriangle,
  FileText,
  Send
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const platformStore = usePlatformStore()
const warningsStore = useWarningsStore()
const reportsStore = useReportsStore()

const activeTab = ref('overview')
const showWarnings = ref(false)
const newVideo = ref({
  title: '',
  classId: '',
  duration: '',
  section: '',
  videoUrl: ''
})

const newReport = ref({
  studentId: '',
  studentName: '',
  studentCode: '',
  reportType: '',
  severity: '',
  title: '',
  description: '',
  actionTaken: ''
})

const tabs = [
  { id: 'overview', name: 'نظرة عامة', icon: BookOpen },
  { id: 'upload', name: 'رفع فيديو', icon: Upload },
  { id: 'reports', name: 'تبليغ عن طالب', icon: AlertTriangle },
  { id: 'my-reports', name: 'تبليغاتي', icon: FileText }
]

const mockStudents = ref([
  { id: 1, name: 'أحمد محمد', code: 'ST001', class: 'الصف الأول - تخصص عام' },
  { id: 2, name: 'فاطمة علي', code: 'ST002', class: 'الصف الثاني - تخصص مياه شرب' },
  { id: 5, name: 'محمد حسن', code: 'ST003', class: 'الصف الثاني - تخصص صرف صحي' },
  { id: 6, name: 'سارة أحمد', code: 'ST004', class: 'الصف الثالث - تخصص مياه شرب' },
  { id: 7, name: 'عمر محمود', code: 'ST005', class: 'الصف الثالث - تخصص صرف صحي' }
])

const uploadMethod = ref('file')
const selectedFile = ref(null)

const unreadWarningsCount = computed(() => {
  if (!authStore.user) return 0
  return warningsStore.getUnreadWarningsCount(authStore.user.id, authStore.user.role)
})

const myReports = computed(() => {
  return reportsStore.getReportsByTrainer(authStore.user?.email || authStore.user?.username)
})

// تحميل البيانات عند تحميل المكون
onMounted(async () => {
  // تحميل الصفوف الدراسية إذا لم تكن محملة
  if (platformStore.classes.length === 0) {
    await platformStore.loadClasses()
  }
  
  // تحميل باقي البيانات
  await platformStore.loadAllData()
})

const logout = () => {
  authStore.logout()
  router.push('/')
}

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0]
}

const uploadVideo = () => {
  if (uploadMethod.value === 'file' && !selectedFile.value) {
    alert('يرجى اختيار ملف فيديو')
    return
  }
  
  if (uploadMethod.value === 'url' && !newVideo.value.videoUrl) {
    alert('يرجى إدخال رابط الفيديو')
    return
  }

  const video = {
    title: newVideo.value.title,
    duration: newVideo.value.duration,
    trainer: authStore.user.name,
    videoUrl: uploadMethod.value === 'url' ? newVideo.value.videoUrl : null,
    fileName: uploadMethod.value === 'file' ? selectedFile.value?.name : null
  }

  platformStore.addVideo(newVideo.value.classId, video)
  
  // Reset form
  newVideo.value = { title: '', classId: '', duration: '', section: '', videoUrl: '' }
  selectedFile.value = null
  uploadMethod.value = 'file'
  
  alert('تم رفع الفيديو بنجاح!')
}

const viewClass = (classId) => {
  router.push(`/class/${classId}`)
}

const onStudentSelect = () => {
  const selectedStudent = mockStudents.value.find(s => s.id === parseInt(newReport.value.studentId))
  if (selectedStudent) {
    newReport.value.studentName = selectedStudent.name
    newReport.value.studentCode = selectedStudent.code
  }
}

const submitReport = () => {
  if (!newReport.value.studentId || !newReport.value.reportType || !newReport.value.title || !newReport.value.description) {
    alert('يرجى ملء جميع الحقول المطلوبة')
    return
  }

  const reportData = {
    studentId: parseInt(newReport.value.studentId),
    studentName: newReport.value.studentName,
    studentCode: newReport.value.studentCode,
    reportedBy: authStore.user.email || authStore.user.username,
    trainerName: authStore.user.name,
    reportType: newReport.value.reportType,
    severity: newReport.value.severity,
    title: newReport.value.title,
    description: newReport.value.description,
    actionTaken: newReport.value.actionTaken
  }

  reportsStore.addReport(reportData)
  
  // Reset form
  newReport.value = {
    studentId: '',
    studentName: '',
    studentCode: '',
    reportType: '',
    severity: '',
    title: '',
    description: '',
    actionTaken: ''
  }
  
  alert('تم إرسال التبليغ بنجاح!')
}
</script>