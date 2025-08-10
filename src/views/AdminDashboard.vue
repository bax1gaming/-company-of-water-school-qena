<template>
  <div class="admin-dashboard">
    <!-- Header with logout button -->
    <header class="admin-header">
      <div class="header-content">
        <div class="header-left">
          <h1>لوحة الإدارة</h1>
          <p>إدارة النظام والمستخدمين والمحتوى</p>
        </div>
        <div class="header-right">
          <div class="admin-info">
            <span>مرحباً {{ authStore.profile?.name }}</span>
          </div>
          <button @click="logout" class="logout-btn">
            تسجيل الخروج
          </button>
        </div>
      </div>
    </header>


    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>{{ stats.totalUsers }}</h3>
          <p>إجمالي المستخدمين</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎓</div>
        <div class="stat-content">
          <h3>{{ stats.totalStudents }}</h3>
          <p>الطلاب</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👨‍🏫</div>
        <div class="stat-content">
          <h3>{{ stats.totalTrainers }}</h3>
          <p>المدربين</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-content">
          <h3>{{ stats.totalClasses }}</h3>
          <p>الفصول</p>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="admin-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="{ active: activeTab === tab.id }"
        class="tab-button"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Users Management -->
    <div v-if="activeTab === 'users'" class="admin-section">
      <div class="section-header">
        <h2>إدارة المستخدمين</h2>
        <button @click="showAddUserModal = true" class="btn-primary">إضافة مستخدم جديد</button>
      </div>
      
      <div class="users-table">
        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>الهاتف</th>
              <th>الدور</th>
              <th>كود الطالب</th>
              <th>الفصل</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>
                <span :class="`role-badge role-${user.role}`">
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <td>{{ user.student_code || '-' }}</td>
              <td>{{ user.class_name || '-' }}</td>
              <td>
                <button @click="editUser(user)" class="btn-edit">تعديل</button>
                <button @click="deleteUser(user.id)" class="btn-delete">حذف</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Classes Management -->
    <div v-if="activeTab === 'classes'" class="admin-section">
      <div class="section-header">
        <h2>إدارة الفصول</h2>
        <button @click="showAddClassModal = true" class="btn-primary">إضافة فصل جديد</button>
      </div>
      
      <div class="classes-grid">
        <div v-for="classItem in classes" :key="classItem.id" class="class-card">
          <h3>{{ classItem.name }}</h3>
          <p>{{ classItem.description }}</p>
          <div class="class-actions">
            <button @click="editClass(classItem)" class="btn-edit">تعديل</button>
            <button @click="deleteClass(classItem.id)" class="btn-delete">حذف</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reports Management -->
    <div v-if="activeTab === 'reports'" class="admin-section">
      <div class="section-header">
        <h2>إدارة التقارير</h2>
      </div>
      
      <div class="reports-table">
        <table>
          <thead>
            <tr>
              <th>الطالب</th>
              <th>المدرب</th>
              <th>نوع التقرير</th>
              <th>الخطورة</th>
              <th>العنوان</th>
              <th>الحالة</th>
              <th>التاريخ</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in reports" :key="report.id">
              <td>{{ report.student_name }}</td>
              <td>{{ report.trainer_name }}</td>
              <td>{{ getReportTypeLabel(report.report_type) }}</td>
              <td>
                <span :class="`severity-badge severity-${report.severity}`">
                  {{ getSeverityLabel(report.severity) }}
                </span>
              </td>
              <td>{{ report.title }}</td>
              <td>
                <span :class="`status-badge status-${report.status}`">
                  {{ getStatusLabel(report.status) }}
                </span>
              </td>
              <td>{{ formatDate(report.created_at) }}</td>
              <td>
                <button @click="reviewReport(report)" class="btn-edit">مراجعة</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Announcements Management -->
    <div v-if="activeTab === 'announcements'" class="admin-section">
      <div class="section-header">
        <h2>إدارة الإعلانات</h2>
        <button @click="showAddAnnouncementModal = true" class="btn-primary">إضافة إعلان جديد</button>
      </div>
      
      <div class="announcements-list">
        <div v-for="announcement in announcements" :key="announcement.id" class="announcement-card">
          <h3>{{ announcement.title }}</h3>
          <p>{{ announcement.content }}</p>
          <div class="announcement-meta">
            <span>بواسطة: {{ announcement.author_name }}</span>
            <span>{{ formatDate(announcement.created_at) }}</span>
          </div>
          <div class="announcement-actions">
            <button @click="editAnnouncement(announcement)" class="btn-edit">تعديل</button>
            <button @click="deleteAnnouncement(announcement.id)" class="btn-delete">حذف</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Warnings Management -->
    <div v-if="activeTab === 'warnings'" class="admin-section">
      <div class="section-header">
        <h2>إدارة التحذيرات</h2>
        <button @click="showAddWarningModal = true" class="btn-primary">إضافة تحذير جديد</button>
      </div>
      
      <div class="warnings-table">
        <table>
          <thead>
            <tr>
              <th>المستخدم</th>
              <th>نوع المستخدم</th>
              <th>العنوان</th>
              <th>الرسالة</th>
              <th>الخطورة</th>
              <th>مقروء</th>
              <th>التاريخ</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="warning in warnings" :key="warning.id">
              <td>{{ getUserName(warning.user_id) }}</td>
              <td>{{ getRoleLabel(warning.user_type) }}</td>
              <td>{{ warning.title }}</td>
              <td>{{ warning.message }}</td>
              <td>
                <span :class="`severity-badge severity-${warning.severity}`">
                  {{ getSeverityLabel(warning.severity) }}
                </span>
              </td>
              <td>
                <span :class="`read-status ${warning.is_read ? 'read' : 'unread'}`">
                  {{ warning.is_read ? 'مقروء' : 'غير مقروء' }}
                </span>
              </td>
              <td>{{ formatDate(warning.created_at) }}</td>
              <td>
                <button @click="deleteWarning(warning.id)" class="btn-delete">حذف</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddUserModal" class="modal-overlay" @click="closeModal('user')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>إضافة مستخدم جديد</h3>
          <button @click="closeModal('user')" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addUser" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
              <input
                v-model="newUser.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل الاسم الكامل"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <input
                v-model="newUser.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
              <input
                v-model="newUser.phone"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل رقم الهاتف"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الدور</label>
              <select
                v-model="newUser.role"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر الدور</option>
                <option value="student">طالب</option>
                <option value="trainer">مدرب</option>
                <option value="admin">مدير</option>
              </select>
            </div>
            <div v-if="newUser.role === 'student'">
              <label class="block text-sm font-medium text-gray-700 mb-2">كود الطالب</label>
              <input
                v-model="newUser.studentCode"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل كود الطالب"
              />
            </div>
            <div v-if="newUser.role === 'student'">
              <label class="block text-sm font-medium text-gray-700 mb-2">الصف</label>
              <select
                v-model="newUser.classId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر الصف</option>
                <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
              </select>
            </div>
            <div class="flex justify-end space-x-3 rtl:space-x-reverse">
              <button type="button" @click="closeModal('user')" class="btn-secondary">إلغاء</button>
              <button type="submit" class="btn-primary">إضافة المستخدم</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add Class Modal -->
    <div v-if="showAddClassModal" class="modal-overlay" @click="closeModal('class')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>إضافة فصل جديد</h3>
          <button @click="closeModal('class')" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addClass" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">اسم الفصل</label>
              <input
                v-model="newClass.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل اسم الفصل"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">وصف الفصل</label>
              <textarea
                v-model="newClass.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل وصف الفصل"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3 rtl:space-x-reverse">
              <button type="button" @click="closeModal('class')" class="btn-secondary">إلغاء</button>
              <button type="submit" class="btn-primary">إضافة الفصل</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add Announcement Modal -->
    <div v-if="showAddAnnouncementModal" class="modal-overlay" @click="closeModal('announcement')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>إضافة إعلان جديد</h3>
          <button @click="closeModal('announcement')" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addAnnouncement" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان الإعلان</label>
              <input
                v-model="newAnnouncement.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل عنوان الإعلان"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">محتوى الإعلان</label>
              <textarea
                v-model="newAnnouncement.content"
                rows="4"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل محتوى الإعلان"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3 rtl:space-x-reverse">
              <button type="button" @click="closeModal('announcement')" class="btn-secondary">إلغاء</button>
              <button type="submit" class="btn-primary">إضافة الإعلان</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add Warning Modal -->
    <div v-if="showAddWarningModal" class="modal-overlay" @click="closeModal('warning')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>إضافة تحذير جديد</h3>
          <button @click="closeModal('warning')" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addWarning" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">المستخدم المستهدف</label>
              <select
                v-model="newWarning.userId"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر المستخدم</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ getRoleLabel(user.role) }})
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان التحذير</label>
              <input
                v-model="newWarning.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل عنوان التحذير"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">رسالة التحذير</label>
              <textarea
                v-model="newWarning.message"
                rows="3"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل رسالة التحذير"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">درجة الخطورة</label>
              <select
                v-model="newWarning.severity"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر درجة الخطورة</option>
                <option value="info">معلومات</option>
                <option value="warning">تحذير</option>
                <option value="error">خطأ</option>
              </select>
            </div>
            <div class="flex justify-end space-x-3 rtl:space-x-reverse">
              <button type="button" @click="closeModal('warning')" class="btn-secondary">إلغاء</button>
              <button type="submit" class="btn-primary">إضافة التحذير</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditUserModal" class="modal-overlay" @click="closeModal('editUser')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>تعديل بيانات المستخدم</h3>
          <button @click="closeModal('editUser')" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateUser" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
              <input
                v-model="editingUser.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل الاسم الكامل"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <input
                v-model="editingUser.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
              <input
                v-model="editingUser.phone"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل رقم الهاتف"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الدور</label>
              <select
                v-model="editingUser.role"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="student">طالب</option>
                <option value="trainer">مدرب</option>
                <option value="admin">مدير</option>
              </select>
            </div>
            <div v-if="editingUser.role === 'student'">
              <label class="block text-sm font-medium text-gray-700 mb-2">كود الطالب</label>
              <input
                v-model="editingUser.student_code"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل كود الطالب"
              />
            </div>
            <div v-if="editingUser.role === 'student'">
              <label class="block text-sm font-medium text-gray-700 mb-2">الصف</label>
              <select
                v-model="editingUser.class_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر الصف</option>
                <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
              </select>
            </div>
            <div class="flex justify-end space-x-3 rtl:space-x-reverse">
              <button type="button" @click="closeModal('editUser')" class="btn-secondary">إلغاء</button>
              <button type="submit" class="btn-primary">حفظ التغييرات</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import supabase from '../lib/supabase'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const activeTab = ref('users')
const users = ref([])
const classes = ref([])
const reports = ref([])
const announcements = ref([])
const warnings = ref([])
const loading = ref(false)

// Modal states
const showAddUserModal = ref(false)
const showAddClassModal = ref(false)
const showAddAnnouncementModal = ref(false)
const showAddWarningModal = ref(false)
const showEditUserModal = ref(false)

// Form data
const newUser = ref({
  name: '',
  email: '',
  phone: '',
  role: '',
  studentCode: '',
  classId: ''
})

const newClass = ref({
  name: '',
  description: ''
})

const newAnnouncement = ref({
  title: '',
  content: ''
})

const newWarning = ref({
  userId: '',
  title: '',
  message: '',
  severity: ''
})

const editingUser = ref({
  id: '',
  name: '',
  email: '',
  phone: '',
  role: '',
  student_code: '',
  class_id: ''
})

// Tabs configuration
const tabs = [
  { id: 'users', label: 'المستخدمين' },
  { id: 'classes', label: 'الفصول' },
  { id: 'reports', label: 'التقارير' },
  { id: 'announcements', label: 'الإعلانات' },
  { id: 'warnings', label: 'التحذيرات' }
]

// Computed statistics
const stats = computed(() => ({
  totalUsers: users.value.length,
  totalStudents: users.value.filter(u => u.role === 'student').length,
  totalTrainers: users.value.filter(u => u.role === 'trainer').length,
  totalClasses: classes.value.length
}))

// Load data functions
const loadUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    users.value = data || []
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

const loadClasses = async () => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    classes.value = data || []
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

const loadReports = async () => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    reports.value = data || []
  } catch (error) {
    console.error('Error loading reports:', error)
  }
}

const loadAnnouncements = async () => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    announcements.value = data || []
  } catch (error) {
    console.error('Error loading announcements:', error)
  }
}

const loadWarnings = async () => {
  try {
    const { data, error } = await supabase
      .from('warnings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    warnings.value = data || []
  } catch (error) {
    console.error('Error loading warnings:', error)
  }
}

// Modal functions
const closeModal = (type) => {
  switch (type) {
    case 'user':
      showAddUserModal.value = false
      newUser.value = { name: '', email: '', phone: '', role: '', studentCode: '', classId: '' }
      break
    case 'class':
      showAddClassModal.value = false
      newClass.value = { name: '', description: '' }
      break
    case 'announcement':
      showAddAnnouncementModal.value = false
      newAnnouncement.value = { title: '', content: '' }
      break
    case 'warning':
      showAddWarningModal.value = false
      newWarning.value = { userId: '', title: '', message: '', severity: '' }
      break
    case 'editUser':
      showEditUserModal.value = false
      editingUser.value = { id: '', name: '', email: '', phone: '', role: '', student_code: '', class_id: '' }
      break
  }
}

// CRUD functions
const addUser = async () => {
  try {
    // Create user in Supabase Auth first
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: newUser.value.email,
      password: '123456', // Default password
      email_confirm: true,
      user_metadata: {
        name: newUser.value.name,
        phone: newUser.value.phone,
        role: newUser.value.role
      }
    })

    if (authError) throw authError

    // Create profile
    const profileData = {
      id: authData.user.id,
      name: newUser.value.name,
      email: newUser.value.email,
      phone: newUser.value.phone,
      role: newUser.value.role
    }

    if (newUser.value.role === 'student') {
      profileData.student_code = newUser.value.studentCode
      profileData.class_id = newUser.value.classId
      profileData.class_name = classes.value.find(c => c.id === newUser.value.classId)?.name
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([profileData])

    if (profileError) throw profileError

    await loadUsers()
    closeModal('user')
    alert('تم إضافة المستخدم بنجاح!')
  } catch (error) {
    console.error('Error adding user:', error)
    alert('حدث خطأ أثناء إضافة المستخدم: ' + error.message)
  }
}

const addClass = async () => {
  try {
    const { error } = await supabase
      .from('classes')
      .insert([{
        name: newClass.value.name,
        description: newClass.value.description
      }])

    if (error) throw error

    await loadClasses()
    closeModal('class')
    alert('تم إضافة الفصل بنجاح!')
  } catch (error) {
    console.error('Error adding class:', error)
    alert('حدث خطأ أثناء إضافة الفصل: ' + error.message)
  }
}

const addAnnouncement = async () => {
  try {
    const { error } = await supabase
      .from('announcements')
      .insert([{
        title: newAnnouncement.value.title,
        content: newAnnouncement.value.content,
        author_id: authStore.user.id,
        author_name: authStore.profile.name
      }])

    if (error) throw error

    await loadAnnouncements()
    closeModal('announcement')
    alert('تم إضافة الإعلان بنجاح!')
  } catch (error) {
    console.error('Error adding announcement:', error)
    alert('حدث خطأ أثناء إضافة الإعلان: ' + error.message)
  }
}

const addWarning = async () => {
  try {
    const targetUser = users.value.find(u => u.id === newWarning.value.userId)
    if (!targetUser) {
      alert('المستخدم المحدد غير موجود')
      return
    }

    const { error } = await supabase
      .from('warnings')
      .insert([{
        user_id: newWarning.value.userId,
        user_type: targetUser.role,
        title: newWarning.value.title,
        message: newWarning.value.message,
        severity: newWarning.value.severity,
        created_by: authStore.user.id
      }])

    if (error) throw error

    await loadWarnings()
    closeModal('warning')
    alert('تم إضافة التحذير بنجاح!')
  } catch (error) {
    console.error('Error adding warning:', error)
    alert('حدث خطأ أثناء إضافة التحذير: ' + error.message)
  }
}

// Helper functions
const getRoleLabel = (role) => {
  const labels = {
    student: 'طالب',
    trainer: 'مدرب',
    admin: 'مدير'
  }
  return labels[role] || role
}

const getReportTypeLabel = (type) => {
  const labels = {
    behavior: 'سلوك',
    attendance: 'حضور',
    academic: 'أكاديمي',
    other: 'أخرى'
  }
  return labels[type] || type
}

const getSeverityLabel = (severity) => {
  const labels = {
    info: 'معلومات',
    warning: 'تحذير',
    critical: 'حرج',
    error: 'خطأ'
  }
  return labels[severity] || severity
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'معلق',
    reviewed: 'تمت المراجعة',
    resolved: 'تم الحل'
  }
  return labels[status] || status
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.name : 'غير معروف'
}

// Action functions
const editUser = (user) => {
  editingUser.value = { ...user }
  showEditUserModal.value = true
}

const updateUser = async () => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: editingUser.value.name,
        email: editingUser.value.email,
        phone: editingUser.value.phone,
        role: editingUser.value.role,
        student_code: editingUser.value.student_code,
        class_id: editingUser.value.class_id,
        class_name: editingUser.value.class_id ? classes.value.find(c => c.id === editingUser.value.class_id)?.name : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingUser.value.id)

    if (error) throw error

    await loadUsers()
    closeModal('editUser')
    alert('تم تحديث بيانات المستخدم بنجاح!')
  } catch (error) {
    console.error('Error updating user:', error)
    alert('حدث خطأ أثناء تحديث المستخدم: ' + error.message)
  }
}

const deleteUser = async (userId) => {
  if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)
      
      if (error) throw error
      await loadUsers()
      alert('تم حذف المستخدم بنجاح!')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('حدث خطأ أثناء حذف المستخدم: ' + error.message)
    }
  }
}

const editClass = (classItem) => {
  // Implementation for editing class
  console.log('Edit class:', classItem)
}

const deleteClass = async (classId) => {
  if (confirm('هل أنت متأكد من حذف هذا الفصل؟')) {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId)
      
      if (error) throw error
      await loadClasses()
      alert('تم حذف الفصل بنجاح!')
    } catch (error) {
      console.error('Error deleting class:', error)
      alert('حدث خطأ أثناء حذف الفصل: ' + error.message)
    }
  }
}

const reviewReport = (report) => {
  // Implementation for reviewing report
  console.log('Review report:', report)
}

const editAnnouncement = (announcement) => {
  // Implementation for editing announcement
  console.log('Edit announcement:', announcement)
}

const deleteAnnouncement = async (announcementId) => {
  if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', announcementId)
      
      if (error) throw error
      await loadAnnouncements()
      alert('تم حذف الإعلان بنجاح!')
    } catch (error) {
      console.error('Error deleting announcement:', error)
      alert('حدث خطأ أثناء حذف الإعلان: ' + error.message)
    }
  }
}

const deleteWarning = async (warningId) => {
  if (confirm('هل أنت متأكد من حذف هذا التحذير؟')) {
    try {
      const { error } = await supabase
        .from('warnings')
        .delete()
        .eq('id', warningId)
      
      if (error) throw error
      await loadWarnings()
      alert('تم حذف التحذير بنجاح!')
    } catch (error) {
      console.error('Error deleting warning:', error)
      alert('حدث خطأ أثناء حذف التحذير: ' + error.message)
    }
  }
}

// Logout function
const logout = async () => {
  await authStore.logout()
  router.push('/')
}

// Initialize data
onMounted(async () => {
  loading.value = true
  await Promise.all([
    loadUsers(),
    loadClasses(),
    loadReports(),
    loadAnnouncements(),
    loadWarnings()
  ])
  loading.value = false
})
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.admin-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  border-radius: 8px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
}

.header-left h1 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.header-left p {
  margin: 0;
  color: #7f8c8d;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-info {
  color: #2c3e50;
  font-weight: 500;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #c0392b;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content h3 {
  font-size: 2rem;
  margin: 0;
  color: #3498db;
}

.stat-content p {
  margin: 0;
  color: #7f8c8d;
}

.admin-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #ecf0f1;
}

.tab-button {
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tab-button:hover {
  background: #f8f9fa;
}

.tab-button.active {
  border-bottom-color: #3498db;
  color: #3498db;
  font-weight: bold;
}

.admin-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
}

.btn-primary {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.btn-edit {
  background: #f39c12;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.btn-delete {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.users-table, .reports-table, .warnings-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 1rem;
  text-align: right;
  border-bottom: 1px solid #ecf0f1;
}

th {
  background: #f8f9fa;
  font-weight: bold;
  color: #2c3e50;
}

.role-badge, .severity-badge, .status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: bold;
}

.role-student { background: #3498db; color: white; }
.role-trainer { background: #2ecc71; color: white; }
.role-admin { background: #9b59b6; color: white; }

.severity-info { background: #3498db; color: white; }
.severity-warning { background: #f39c12; color: white; }
.severity-critical, .severity-error { background: #e74c3c; color: white; }

.status-pending { background: #f39c12; color: white; }
.status-reviewed { background: #3498db; color: white; }
.status-resolved { background: #2ecc71; color: white; }

.read-status.read { color: #2ecc71; }
.read-status.unread { color: #e74c3c; font-weight: bold; }

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.class-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ecf0f1;
}

.class-card h3 {
  margin-top: 0;
  color: #2c3e50;
}

.class-actions {
  margin-top: 1rem;
}

.announcements-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.announcement-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ecf0f1;
}

.announcement-card h3 {
  margin-top: 0;
  color: #2c3e50;
}

.announcement-meta {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  color: #7f8c8d;
  font-size: 0.875rem;
}

.announcement-actions {
  margin-top: 1rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: #374151;
}

.modal-body {
  padding: 1rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-x-3 > * + * {
  margin-left: 0.75rem;
}

.rtl .space-x-3 > * + * {
  margin-left: 0;
  margin-right: 0.75rem;
}

input, select, textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .admin-tabs {
    flex-wrap: wrap;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-right {
    justify-content: center;
  }
  
  table {
    font-size: 0.875rem;
  }
  
  th, td {
    padding: 0.5rem;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}
</style>