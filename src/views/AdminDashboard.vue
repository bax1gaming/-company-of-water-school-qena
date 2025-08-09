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
            <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center glow-effect">
              <Shield class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gradient">لوحة الإدارة</h1>
              <p class="text-sm text-gray-700 font-medium">مرحباً {{ authStore.profile?.name }}</p>
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
      <!-- Navigation Tabs -->
      <div class="card-enhanced mb-8 hover-lift">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 rtl:space-x-reverse px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 rtl:space-x-reverse',
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5" />
              <span>{{ tab.name }}</span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'">
        <!-- Admin Info Card -->
        <div class="card-enhanced p-8 mb-8 hover-lift">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg glow-effect float-animation">
              <Shield class="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 class="text-3xl font-bold text-gradient mb-2">{{ authStore.profile?.name }}</h2>
              <p class="text-gray-700 font-semibold text-lg">مدير المنصة</p>
              <p class="text-sm text-gray-600 bg-purple-100 px-3 py-1 rounded-full inline-block mt-2">صلاحيات كاملة</p>
            </div>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="card-enhanced p-6 hover-lift">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-2">إجمالي المستخدمين</p>
                <p class="text-3xl font-bold text-gradient">{{ totalUsers }}</p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center glow-effect">
                <Users class="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div class="card-enhanced p-6 hover-lift" style="animation-delay: 0.1s;">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-2">الفيديوهات</p>
                <p class="text-3xl font-bold text-gradient">{{ totalVideos }}</p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center glow-effect">
                <Video class="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div class="card-enhanced p-6 hover-lift" style="animation-delay: 0.2s;">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-2">التبليغات المعلقة</p>
                <p class="text-3xl font-bold text-gradient">{{ pendingReports }}</p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center glow-effect">
                <AlertTriangle class="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div class="card-enhanced p-6 hover-lift" style="animation-delay: 0.3s;">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-2">الصفوف الدراسية</p>
                <p class="text-3xl font-bold text-gradient">{{ totalClasses }}</p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center glow-effect">
                <BookOpen class="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card-enhanced p-8 hover-lift">
          <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center glow-effect">
              <Activity class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gradient">النشاط الأخير</h3>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-blue-50 rounded-xl border-r-4 border-blue-500">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <UserPlus class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-900">مستخدم جديد انضم للمنصة</p>
                <p class="text-sm text-gray-600">أحمد محمد - طالب في الصف الأول</p>
              </div>
              <span class="text-sm text-gray-500">منذ ساعتين</span>
            </div>
            
            <div class="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-green-50 rounded-xl border-r-4 border-green-500">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Upload class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-900">فيديو جديد تم رفعه</p>
                <p class="text-sm text-gray-600">د. محمد أحمد - أساسيات معالجة المياه</p>
              </div>
              <span class="text-sm text-gray-500">منذ 4 ساعات</span>
            </div>
            
            <div class="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-orange-50 rounded-xl border-r-4 border-orange-500">
              <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <AlertTriangle class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-900">تبليغ جديد</p>
                <p class="text-sm text-gray-600">تبليغ عن سلوك طالب - يحتاج مراجعة</p>
              </div>
              <span class="text-sm text-gray-500">منذ يوم</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Management Tab -->
      <div v-if="activeTab === 'users'">
        <AdminSection title="إدارة المستخدمين" :icon="Users">
          <!-- User Promotion Form -->
          <div class="card-enhanced p-6 mb-6 hover-lift">
            <h4 class="text-lg font-bold text-gray-900 mb-4">ترقية مستخدم</h4>
            <form @submit.prevent="promoteUser" class="space-y-4">
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني أو رقم الهاتف</label>
                  <input
                    v-model="promotionForm.identifier"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="أدخل البريد الإلكتروني أو رقم الهاتف"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">الدور الجديد</label>
                  <select
                    v-model="promotionForm.newRole"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">اختر الدور</option>
                    <option value="trainer">مدرب</option>
                    <option value="admin">مدير</option>
                  </select>
                </div>
              </div>
              
              <div v-if="promotionForm.newRole === 'trainer'">
                <label class="block text-sm font-medium text-gray-700 mb-2">التخصص</label>
                <input
                  v-model="promotionForm.specialization"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="مثال: مياه الشرب، صرف صحي"
                />
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full btn-gradient-primary py-3 px-4 font-semibold disabled:opacity-50"
              >
                <span v-if="loading">جاري الترقية...</span>
                <span v-else>ترقية المستخدم</span>
              </button>
            </form>
            
            <div v-if="promotionMessage" class="mt-4 p-4 rounded-lg"
                 :class="promotionSuccess ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
              {{ promotionMessage }}
            </div>
          </div>

          <!-- Users List -->
          <div class="card-enhanced p-6 hover-lift">
            <h4 class="text-lg font-bold text-gray-900 mb-4">قائمة المستخدمين</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-right py-3 px-4 font-semibold text-gray-700">الاسم</th>
                    <th class="text-right py-3 px-4 font-semibold text-gray-700">البريد الإلكتروني</th>
                    <th class="text-right py-3 px-4 font-semibold text-gray-700">الهاتف</th>
                    <th class="text-right py-3 px-4 font-semibold text-gray-700">الدور</th>
                    <th class="text-right py-3 px-4 font-semibold text-gray-700">تاريخ التسجيل</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in mockUsers" :key="user.id" class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-4 font-medium text-gray-900">{{ user.name }}</td>
                    <td class="py-3 px-4 text-gray-600">{{ user.email }}</td>
                    <td class="py-3 px-4 text-gray-600">{{ user.phone }}</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-1 text-xs rounded-full"
                            :class="getRoleBadgeClass(user.role)">
                        {{ getRoleText(user.role) }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-gray-600">{{ user.createdAt }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </AdminSection>
      </div>

      <!-- Content Management Tab -->
      <div v-if="activeTab === 'content'">
        <AdminSection title="إدارة المحتوى" :icon="FileText">
          <!-- Add Announcement Form -->
          <div class="card-enhanced p-6 mb-6 hover-lift">
            <h4 class="text-lg font-bold text-gray-900 mb-4">إضافة إعلان جديد</h4>
            <form @submit.prevent="addAnnouncement" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">عنوان الإعلان</label>
                <input
                  v-model="newAnnouncement.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="أدخل عنوان الإعلان"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">محتوى الإعلان</label>
                <textarea
                  v-model="newAnnouncement.content"
                  required
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="اكتب محتوى الإعلان..."
                ></textarea>
              </div>

              <button
                type="submit"
                class="w-full btn-gradient-success py-3 px-4 font-semibold"
              >
                نشر الإعلان
              </button>
            </form>
          </div>

          <!-- Announcements List -->
          <div class="card-enhanced p-6 hover-lift">
            <h4 class="text-lg font-bold text-gray-900 mb-4">الإعلانات المنشورة</h4>
            <div class="space-y-4">
              <div
                v-for="announcement in platformStore.announcements"
                :key="announcement.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex justify-between items-start mb-3">
                  <h5 class="font-semibold text-gray-900">{{ announcement.title }}</h5>
                  <button
                    @click="deleteAnnouncement(announcement.id)"
                    class="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
                <p class="text-gray-700 mb-3">{{ announcement.content }}</p>
                <div class="flex justify-between text-sm text-gray-500">
                  <span>{{ announcement.author_name }}</span>
                  <span>{{ new Date(announcement.created_at).toLocaleDateString('ar-EG') }}</span>
                </div>
              </div>
            </div>
          </div>
        </AdminSection>
      </div>

      <!-- Reports Management Tab -->
      <div v-if="activeTab === 'reports'">
        <AdminSection title="إدارة التبليغات" :icon="AlertTriangle">
          <div class="card-enhanced p-6 hover-lift">
            <h4 class="text-lg font-bold text-gray-900 mb-4">التبليغات المعلقة</h4>
            <div class="space-y-4">
              <div
                v-for="report in mockReports"
                :key="report.id"
                class="border rounded-lg p-4"
                :class="[
                  report.severity === 'critical' ? 'border-r-4 border-r-red-500 bg-red-50' : 
                  report.severity === 'warning' ? 'border-r-4 border-r-orange-500 bg-orange-50' : 
                  'border-r-4 border-r-blue-500 bg-blue-50'
                ]"
              >
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h5 class="font-semibold text-gray-900">{{ report.title }}</h5>
                    <p class="text-sm text-gray-600">الطالب: {{ report.studentName }} ({{ report.studentCode }})</p>
                    <p class="text-sm text-gray-600">المدرب: {{ report.trainerName }}</p>
                  </div>
                  <div class="flex items-center space-x-2 rtl:space-x-reverse">
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
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">{{ report.createdAt }}</span>
                  <div class="flex space-x-2 rtl:space-x-reverse">
                    <button
                      @click="resolveReport(report.id)"
                      class="btn-gradient-success py-1 px-3 text-sm"
                    >
                      حل المشكلة
                    </button>
                    <button
                      @click="reviewReport(report.id)"
                      class="btn-gradient-primary py-1 px-3 text-sm"
                    >
                      مراجعة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AdminSection>
      </div>

      <!-- Classes Management Tab -->
      <div v-if="activeTab === 'classes'">
        <AdminSection title="إدارة الصفوف الدراسية" :icon="BookOpen">
          <!-- Add Class Form -->
          <div class="card-enhanced p-6 mb-6 hover-lift">
            <h4 class="text-lg font-bold text-gray-900 mb-4">إضافة صف دراسي جديد</h4>
            <form @submit.prevent="addClass" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">اسم الصف</label>
                <input
                  v-model="newClass.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="مثال: الصف الرابع - تخصص متقدم"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">وصف الصف</label>
                <textarea
                  v-model="newClass.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="اكتب وصف للصف الدراسي..."
                ></textarea>
              </div>

              <button
                type="submit"
                class="w-full btn-gradient-primary py-3 px-4 font-semibold"
              >
                إضافة الصف
              </button>
            </form>
          </div>

          <!-- Classes List -->
          <div class="card-enhanced p-6 hover-lift">
            <h4 class="text-lg font-bold text-gray-900 mb-4">الصفوف الدراسية</h4>
            <div class="grid md:grid-cols-2 gap-4">
              <div
                v-for="cls in platformStore.classes"
                :key="cls.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex justify-between items-start mb-3">
                  <h5 class="font-semibold text-gray-900">{{ cls.name }}</h5>
                  <button
                    @click="deleteClass(cls.id)"
                    class="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
                <p class="text-gray-700 mb-3">{{ cls.description }}</p>
                <div class="flex justify-between text-sm text-gray-500">
                  <span class="flex items-center space-x-2 rtl:space-x-reverse">
                    <Video class="w-4 h-4" />
                    <span>{{ platformStore.getVideosByClass(cls.id).length }} فيديو</span>
                  </span>
                  <span class="flex items-center space-x-2 rtl:space-x-reverse">
                    <FileText class="w-4 h-4" />
                    <span>{{ platformStore.getFilesByClass(cls.id).length }} ملف</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </AdminSection>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePlatformStore } from '../stores/platform'
import { useWarningsStore } from '../stores/warnings'
import AdminSection from '../components/AdminSection.vue'
import WarningsModal from '../components/WarningsModal.vue'
import { 
  Shield,
  LogOut,
  Bell,
  Users,
  Video,
  AlertTriangle,
  BookOpen,
  Activity,
  UserPlus,
  Upload,
  FileText,
  Trash2
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const platformStore = usePlatformStore()
const warningsStore = useWarningsStore()

const activeTab = ref('overview')
const showWarnings = ref(false)
const loading = ref(false)

// Forms
const promotionForm = ref({
  identifier: '',
  newRole: '',
  specialization: ''
})

const newAnnouncement = ref({
  title: '',
  content: ''
})

const newClass = ref({
  name: '',
  description: ''
})

const promotionMessage = ref('')
const promotionSuccess = ref(false)

const tabs = [
  { id: 'overview', name: 'نظرة عامة', icon: Activity },
  { id: 'users', name: 'إدارة المستخدمين', icon: Users },
  { id: 'content', name: 'إدارة المحتوى', icon: FileText },
  { id: 'reports', name: 'إدارة التبليغات', icon: AlertTriangle },
  { id: 'classes', name: 'إدارة الصفوف', icon: BookOpen }
]

// Mock data
const mockUsers = ref([
  { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', phone: '01234567890', role: 'student', createdAt: '2025-01-01' },
  { id: 2, name: 'د. محمد أحمد', email: 'trainer@example.com', phone: '01111111111', role: 'trainer', createdAt: '2025-01-02' },
  { id: 3, name: 'فاطمة علي', email: 'fatma@example.com', phone: '01222222222', role: 'student', createdAt: '2025-01-03' },
  { id: 4, name: 'مدير النظام', email: 'admin@example.com', phone: '01000000000', role: 'admin', createdAt: '2025-01-04' }
])

const mockReports = ref([
  {
    id: 1,
    title: 'تأخير في تسليم الواجبات',
    studentName: 'أحمد محمد',
    studentCode: 'ST001',
    trainerName: 'د. محمد أحمد',
    severity: 'warning',
    description: 'الطالب متأخر في تسليم واجبات الأسبوع الماضي',
    actionTaken: 'تم التنبيه على الطالب',
    createdAt: '2025-01-08'
  },
  {
    id: 2,
    title: 'سلوك غير مناسب',
    studentName: 'محمد حسن',
    studentCode: 'ST003',
    trainerName: 'د. سارة أحمد',
    severity: 'critical',
    description: 'سلوك غير مناسب أثناء المحاضرة',
    actionTaken: 'تم استدعاء ولي الأمر',
    createdAt: '2025-01-07'
  }
])

// Computed properties
const totalUsers = computed(() => mockUsers.value.length)
const totalVideos = computed(() => platformStore.videos.length)
const totalClasses = computed(() => platformStore.classes.length)
const pendingReports = computed(() => mockReports.value.length)

const unreadWarningsCount = computed(() => {
  if (!authStore.user) return 0
  return warningsStore.getUnreadWarningsCount(authStore.user.id)
})

// Methods
const logout = () => {
  authStore.logout()
  router.push('/')
}

const getRoleBadgeClass = (role) => {
  const classes = {
    student: 'bg-blue-100 text-blue-800',
    trainer: 'bg-green-100 text-green-800',
    admin: 'bg-purple-100 text-purple-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const getRoleText = (role) => {
  const texts = {
    student: 'طالب',
    trainer: 'مدرب',
    admin: 'مدير'
  }
  return texts[role] || 'غير محدد'
}

const promoteUser = async () => {
  loading.value = true
  promotionMessage.value = ''
  
  try {
    const result = await authStore.promoteUser(
      promotionForm.value.identifier,
      promotionForm.value.newRole,
      { specialization: promotionForm.value.specialization }
    )
    
    promotionSuccess.value = result.success
    promotionMessage.value = result.message
    
    if (result.success) {
      promotionForm.value = { identifier: '', newRole: '', specialization: '' }
    }
  } catch (error) {
    promotionSuccess.value = false
    promotionMessage.value = 'حدث خطأ أثناء ترقية المستخدم'
  } finally {
    loading.value = false
  }
}

const addAnnouncement = async () => {
  if (!newAnnouncement.value.title || !newAnnouncement.value.content) return
  
  const announcementData = {
    title: newAnnouncement.value.title,
    content: newAnnouncement.value.content,
    author_name: authStore.profile?.name || 'مدير المنصة'
  }
  
  const success = await platformStore.addAnnouncement(announcementData)
  
  if (success) {
    newAnnouncement.value = { title: '', content: '' }
    alert('تم نشر الإعلان بنجاح!')
  } else {
    alert('فشل في نشر الإعلان')
  }
}

const deleteAnnouncement = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
    const success = await platformStore.deleteAnnouncement(id)
    if (success) {
      alert('تم حذف الإعلان بنجاح!')
    } else {
      alert('فشل في حذف الإعلان')
    }
  }
}

const addClass = () => {
  if (!newClass.value.name) return
  
  // Add class logic here
  alert('تم إضافة الصف بنجاح!')
  newClass.value = { name: '', description: '' }
}

const deleteClass = (id) => {
  if (confirm('هل أنت متأكد من حذف هذا الصف؟')) {
    // Delete class logic here
    alert('تم حذف الصف بنجاح!')
  }
}

const resolveReport = (id) => {
  const reportIndex = mockReports.value.findIndex(r => r.id === id)
  if (reportIndex !== -1) {
    mockReports.value.splice(reportIndex, 1)
    alert('تم حل المشكلة بنجاح!')
  }
}

const reviewReport = (id) => {
  alert('تم وضع علامة مراجعة على التبليغ')
}

// Load data on mount
onMounted(() => {
  if (platformStore.classes.length === 0) {
    platformStore.loadAllData()
  }
})
</script>