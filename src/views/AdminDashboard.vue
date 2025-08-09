<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>لوحة الإدارة</h1>
      <p>إدارة النظام والمستخدمين والمحتوى</p>
    </div>

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

    <!-- Modals would go here -->
    <!-- Add User Modal, Add Class Modal, etc. -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import supabase from '../lib/supabase'

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
  // Implementation for editing user
  console.log('Edit user:', user)
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
    } catch (error) {
      console.error('Error deleting user:', error)
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
    } catch (error) {
      console.error('Error deleting class:', error)
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
    } catch (error) {
      console.error('Error deleting announcement:', error)
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
    } catch (error) {
      console.error('Error deleting warning:', error)
    }
  }
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
  
  table {
    font-size: 0.875rem;
  }
  
  th, td {
    padding: 0.5rem;
  }
}
</style>