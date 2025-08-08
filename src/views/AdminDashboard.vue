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
              <span v-if="pendingReportsCount > 0" 
                    class="notification-badge absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs">
                {{ pendingReportsCount }}
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
      <div class="card-enhanced mb-8">
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
              <span v-if="tab.badge && tab.badge > 0" 
                    class="notification-badge w-5 h-5 flex items-center justify-center text-xs ml-2">
                {{ tab.badge }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'">
        <!-- Admin Stats -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="card-enhanced p-8 hover-lift">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-2">إجمالي الطلاب</p>
                <p class="text-3xl font-bold text-gradient">{{ totalStudents }}</p>
              </div>
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center glow-effect">
                <Users class="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div class="card-enhanced p-8 hover-lift" style="animation-delay: 0.1s;">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-2">المدربين</p>
                <p class="text-3xl font-bold text-gradient">{{ totalTrainers }}</p>
              </div>
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center glow-effect">
                <UserCheck class="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div class="card-enhanced p-8 hover-lift" style="animation-delay: 0.2s;">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-2">التبليغات المعلقة</p>
                <p class="text-3xl font-bold text-gradient">{{ pendingReportsCount }}</p>
              </div>
              <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center glow-effect">
                <AlertTriangle class="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div class="card-enhanced p-8 hover-lift" style="animation-delay: 0.3s;">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-2">إجمالي الفيديوهات</p>
                <p class="text-3xl font-bold text-gradient">{{ totalVideos }}</p>
              </div>
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center glow-effect">
                <Video class="w-8 h-8 text-white" />
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
            <div v-for="activity in recentActivities" :key="activity.id" 
                 class="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover-lift">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <component :is="activity.icon" class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-sm text-gray-600">{{ activity.description }}</p>
              </div>
              <span class="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Reports Management Tab -->
      <div v-if="activeTab === 'reports'">
        <AdminSection title="إدارة التبليغات" :icon="AlertTriangle">
          <div class="space-y-6">
            <!-- Filter Controls -->
            <div class="flex flex-wrap gap-4 mb-6">
              <select v-model="reportFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="all">جميع التبليغات</option>
                <option value="pending">قيد المراجعة</option>
                <option value="reviewed">تمت المراجعة</option>
                <option value="resolved">تم الحل</option>
              </select>
              <select v-model="severityFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="all">جميع المستويات</option>
                <option value="info">عادي</option>
                <option value="warning">تحذير</option>
                <option value="critical">حرج</option>
              </select>
            </div>

            <!-- Reports List -->
            <div v-if="filteredReports.length === 0" class="text-center py-12">
              <AlertTriangle class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">لا توجد تبليغات</h3>
              <p class="text-gray-600">لا توجد تبليغات تطابق المعايير المحددة</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="report in filteredReports"
                :key="report.id"
                class="card-enhanced p-6 hover-lift"
                :class="[
                  report.severity === 'critical' ? 'border-r-4 border-r-red-500' : 
                  report.severity === 'warning' ? 'border-r-4 border-r-orange-500' : 
                  'border-r-4 border-r-blue-500'
                ]"
              >
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h4 class="font-bold text-gray-900 text-lg">{{ report.title }}</h4>
                    <p class="text-gray-600">الطالب: {{ report.studentName }} ({{ report.studentCode }})</p>
                    <p class="text-sm text-gray-500">المدرب: {{ report.trainerName }}</p>
                  </div>
                  <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="text-xs px-3 py-1 rounded-full font-medium"
                          :class="[
                            report.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                            report.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          ]">
                      {{ getStatusText(report.status) }}
                    </span>
                    <span class="text-xs px-3 py-1 rounded-full font-medium"
                          :class="[
                            report.severity === 'critical' ? 'bg-red-100 text-red-800' : 
                            report.severity === 'warning' ? 'bg-orange-100 text-orange-800' : 
                            'bg-blue-100 text-blue-800'
                          ]">
                      {{ getSeverityText(report.severity) }}
                    </span>
                  </div>
                </div>
                
                <p class="text-gray-700 mb-4 leading-relaxed">{{ report.description }}</p>
                
                <div v-if="report.actionTaken" class="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p class="text-sm font-medium text-blue-900">الإجراء المتخذ:</p>
                  <p class="text-sm text-blue-700">{{ report.actionTaken }}</p>
                </div>
                
                <div v-if="report.adminNotes && report.status !== 'pending'" class="mb-4 p-3 bg-green-50 rounded-lg">
                  <p class="text-sm font-medium text-green-900">ملاحظات الإدارة:</p>
                  <p class="text-sm text-green-700">{{ report.adminNotes }}</p>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">
                    {{ new Date(report.createdAt).toLocaleDateString('ar-EG') }}
                  </span>
                  
                  <div v-if="report.status === 'pending'" class="flex space-x-2 rtl:space-x-reverse">
                    <button
                      @click="openReportModal(report)"
                      class="btn-gradient-primary px-4 py-2 text-sm"
                    >
                      <span>مراجعة</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AdminSection>
      </div>

      <!-- User Management Tab -->
      <div v-if="activeTab === 'users'">
        <AdminSection title="إدارة المستخدمين" :icon="Users">
          <div class="space-y-6">
            <!-- Promote User Form -->
            <div class="card-enhanced p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">ترقية مستخدم</h4>
              <form @submit.prevent="promoteUser" class="space-y-4">
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف أو البريد الإلكتروني
                    </label>
                    <input
                      v-model="promoteForm.identifier"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="أدخل رقم الهاتف أو البريد الإلكتروني"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">الصلاحية الجديدة</label>
                    <select
                      v-model="promoteForm.newRole"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">اختر الصلاحية</option>
                      <option value="trainer">مدرب</option>
                      <option value="admin">مدير</option>
                    </select>
                  </div>
                </div>
                
                <div v-if="promoteForm.newRole === 'trainer'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">التخصص</label>
                  <input
                    v-model="promoteForm.specialization"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="أدخل التخصص (مثال: مياه الشرب)"
                  />
                </div>
                
                <button
                  type="submit"
                  class="btn-gradient-success px-6 py-2"
                >
                  <span>ترقية المستخدم</span>
                </button>
              </form>
            </div>

            <!-- Users List -->
            <div class="card-enhanced p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">قائمة المستخدمين</h4>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="text-right py-3 px-4 font-semibold text-gray-700">الاسم</th>
                      <th class="text-right py-3 px-4 font-semibold text-gray-700">البريد الإلكتروني</th>
                      <th class="text-right py-3 px-4 font-semibold text-gray-700">رقم الهاتف</th>
                      <th class="text-right py-3 px-4 font-semibold text-gray-700">الصلاحية</th>
                      <th class="text-right py-3 px-4 font-semibold text-gray-700">التخصص</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in mockUsers" :key="user.id" class="border-b border-gray-100 hover:bg-gray-50">
                      <td class="py-3 px-4">{{ user.name }}</td>
                      <td class="py-3 px-4">{{ user.email }}</td>
                      <td class="py-3 px-4">{{ user.phone }}</td>
                      <td class="py-3 px-4">
                        <span class="px-2 py-1 rounded-full text-xs font-medium"
                              :class="[
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'trainer' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              ]">
                          {{ getRoleText(user.role) }}
                        </span>
                      </td>
                      <td class="py-3 px-4">{{ user.specialization || user.className || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </AdminSection>
      </div>

      <!-- Announcements Tab -->
      <div v-if="activeTab === 'announcements'">
        <AdminSection title="إدارة الإعلانات" :icon="Megaphone">
          <div class="space-y-6">
            <!-- Add Announcement Form -->
            <div class="card-enhanced p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">إضافة إعلان جديد</h4>
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
                    placeholder="أدخل محتوى الإعلان"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  class="btn-gradient-primary px-6 py-2"
                >
                  <span>إضافة الإعلان</span>
                </button>
              </form>
            </div>

            <!-- Announcements List -->
            <div class="space-y-4">
              <div
                v-for="announcement in platformStore.announcements"
                :key="announcement.id"
                class="card-enhanced p-6 hover-lift"
              >
                <div class="flex justify-between items-start mb-3">
                  <h4 class="font-bold text-gray-900 text-lg">{{ announcement.title }}</h4>
                  <button
                    @click="deleteAnnouncement(announcement.id)"
                    class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 class="w-5 h-5" />
                  </button>
                </div>
                <p class="text-gray-700 mb-4 leading-relaxed">{{ announcement.content }}</p>
                <div class="flex justify-between text-sm text-gray-500">
                  <span class="font-medium">{{ announcement.author }}</span>
                  <span class="bg-gray-100 px-2 py-1 rounded-full">{{ announcement.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </AdminSection>
      </div>

      <!-- Warnings Tab -->
      <div v-if="activeTab === 'warnings'">
        <AdminSection title="إدارة التحذيرات" :icon="AlertCircle">
          <div class="space-y-6">
            <!-- Send Warning Form -->
            <div class="card-enhanced p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">إرسال تحذير</h4>
              <form @submit.prevent="sendWarning" class="space-y-4">
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">اختر المستخدم</label>
                    <select
                      v-model="newWarning.userId"
                      @change="onUserSelect"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">اختر المستخدم</option>
                      <option
                        v-for="user in mockUsers"
                        :key="user.id"
                        :value="user.id"
                      >
                        {{ user.name }} - {{ getRoleText(user.role) }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">مستوى التحذير</label>
                    <select
                      v-model="newWarning.severity"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">اختر المستوى</option>
                      <option value="info">إشعار</option>
                      <option value="warning">تحذير</option>
                      <option value="error">خطر</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">عنوان التحذير</label>
                  <input
                    v-model="newWarning.title"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="أدخل عنوان التحذير"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">رسالة التحذير</label>
                  <textarea
                    v-model="newWarning.message"
                    required
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="أدخل رسالة التحذير"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  class="btn-gradient-secondary px-6 py-2"
                >
                  <span>إرسال التحذير</span>
                </button>
              </form>
            </div>
          </div>
        </AdminSection>
      </div>
    </div>

    <!-- Report Review Modal -->
    <div v-if="showReportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">مراجعة التبليغ</h3>
            <button @click="closeReportModal" class="text-gray-400 hover:text-gray-600">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div v-if="selectedReport" class="space-y-4">
            <div>
              <h4 class="font-semibold text-gray-900">{{ selectedReport.title }}</h4>
              <p class="text-gray-600">الطالب: {{ selectedReport.studentName }} ({{ selectedReport.studentCode }})</p>
              <p class="text-sm text-gray-500">المدرب: {{ selectedReport.trainerName }}</p>
            </div>
            
            <div>
              <p class="font-medium text-gray-700 mb-2">وصف المشكلة:</p>
              <p class="text-gray-600 leading-relaxed">{{ selectedReport.description }}</p>
            </div>
            
            <div v-if="selectedReport.actionTaken">
              <p class="font-medium text-gray-700 mb-2">الإجراء المتخذ:</p>
              <p class="text-gray-600">{{ selectedReport.actionTaken }}</p>
            </div>
            
            <form @submit.prevent="updateReportStatus" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">حالة التبليغ</label>
                <select
                  v-model="reportReview.status"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="reviewed">تمت المراجعة</option>
                  <option value="resolved">تم الحل</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ملاحظات الإدارة</label>
                <textarea
                  v-model="reportReview.adminNotes"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="أدخل ملاحظاتك حول التبليغ..."
                ></textarea>
              </div>
              
              <div class="flex justify-end space-x-4 rtl:space-x-reverse">
                <button
                  type="button"
                  @click="closeReportModal"
                  class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  class="btn-gradient-success px-6 py-2"
                >
                  <span>حفظ</span>
                </button>
              </div>
            </form>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePlatformStore } from '../stores/platform'
import { useWarningsStore } from '../stores/warnings'
import { useReportsStore } from '../stores/reports'
import AdminSection from '../components/AdminSection.vue'
import WarningsModal from '../components/WarningsModal.vue'
import { 
  Shield,
  LogOut,
  Bell,
  Users,
  UserCheck,
  AlertTriangle,
  Video,
  Activity,
  Megaphone,
  AlertCircle,
  Trash2,
  X,
  Send
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const platformStore = usePlatformStore()
const warningsStore = useWarningsStore()
const reportsStore = useReportsStore()

const activeTab = ref('overview')
const showWarnings = ref(false)
const showReportModal = ref(false)
const selectedReport = ref(null)
const reportFilter = ref('all')
const severityFilter = ref('all')

const promoteForm = ref({
  identifier: '',
  newRole: '',
  specialization: ''
})

const newAnnouncement = ref({
  title: '',
  content: ''
})

const newWarning = ref({
  userId: '',
  userType: '',
  title: '',
  message: '',
  severity: ''
})

const reportReview = ref({
  status: 'reviewed',
  adminNotes: ''
})

const mockUsers = ref([
  { id: 1, name: 'أحمد محمد', email: 'student1@example.com', phone: '01234567890', role: 'student', className: 'الصف الأول - تخصص عام' },
  { id: 2, name: 'فاطمة علي', email: 'student2@example.com', phone: '01234567891', role: 'student', className: 'الصف الثاني - تخصص مياه شرب' },
  { id: 3, name: 'د. محمد أحمد', email: 'trainer1@example.com', phone: '01111111111', role: 'trainer', specialization: 'مياه الشرب' },
  { id: 4, name: 'مدير المنصة', email: 'admin@example.com', phone: '01000000000', role: 'admin' }
])

const tabs = computed(() => [
  { id: 'overview', name: 'نظرة عامة', icon: Activity },
  { id: 'reports', name: 'التبليغات', icon: AlertTriangle, badge: pendingReportsCount.value },
  { id: 'users', name: 'المستخدمين', icon: Users },
  { id: 'announcements', name: 'الإعلانات', icon: Megaphone },
  { id: 'warnings', name: 'التحذيرات', icon: AlertCircle }
])

const totalStudents = computed(() => {
  return mockUsers.value.filter(user => user.role === 'student').length
})

const totalTrainers = computed(() => {
  return mockUsers.value.filter(user => user.role === 'trainer').length
})

const totalVideos = computed(() => {
  return platformStore.videos.length
})

const pendingReportsCount = computed(() => {
  return reportsStore.getPendingReportsCount()
})

const filteredReports = computed(() => {
  let reports = reportsStore.reports
  
  if (reportFilter.value !== 'all') {
    reports = reports.filter(report => report.status === reportFilter.value)
  }
  
  if (severityFilter.value !== 'all') {
    reports = reports.filter(report => report.severity === severityFilter.value)
  }
  
  return reports
})

const recentActivities = computed(() => [
  {
    id: 1,
    title: 'تبليغ جديد',
    description: 'تم استلام تبليغ جديد من المدرب د. محمد أحمد',
    time: 'منذ ساعة',
    icon: AlertTriangle
  },
  {
    id: 2,
    title: 'طالب جديد',
    description: 'انضم طالب جديد إلى المنصة',
    time: 'منذ ساعتين',
    icon: Users
  },
  {
    id: 3,
    title: 'فيديو جديد',
    description: 'تم رفع فيديو تعليمي جديد',
    time: 'منذ 3 ساعات',
    icon: Video
  }
])

const logout = () => {
  authStore.logout()
  router.push('/')
}

const promoteUser = () => {
  if (!promoteForm.value.email || !promoteForm.value.newRole) {
    alert('يرجى ملء جميع الحقول المطلوبة')
    return
  }

  const additionalData = {}
  if (promoteForm.value.newRole === 'trainer' && promoteForm.value.specialization) {
    additionalData.specialization = promoteForm.value.specialization
  }

  const result = authStore.promoteUser(
    promoteForm.value.email,
    promoteForm.value.newRole,
    additionalData
  )

  if (result.success) {
    alert(result.message)
    promoteForm.value = { email: '', newRole: '', specialization: '' }
  } else {
    alert(result.message)
  }
}

const addAnnouncement = () => {
  if (!newAnnouncement.value.title || !newAnnouncement.value.content) {
    alert('يرجى ملء جميع الحقول')
    return
  }

  platformStore.addAnnouncement({
    title: newAnnouncement.value.title,
    content: newAnnouncement.value.content,
    author: authStore.user?.name || 'الإدارة'
  })

  newAnnouncement.value = { title: '', content: '' }
  alert('تم إضافة الإعلان بنجاح!')
}

const deleteAnnouncement = (announcementId) => {
  if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
    platformStore.deleteAnnouncement(announcementId)
    alert('تم حذف الإعلان بنجاح!')
  }
}

const sendWarning = () => {
  if (!newWarning.value.userId || !newWarning.value.title || !newWarning.value.message || !newWarning.value.severity) {
    alert('يرجى ملء جميع الحقول المطلوبة')
    return
  }

  const selectedUser = mockUsers.value.find(u => u.id === parseInt(newWarning.value.userId))
  
  warningsStore.addWarning({
    userId: parseInt(newWarning.value.userId),
    userType: selectedUser.role,
    title: newWarning.value.title,
    message: newWarning.value.message,
    severity: newWarning.value.severity,
    createdBy: authStore.user?.email || authStore.user?.username
  })

  newWarning.value = { userId: '', userType: '', title: '', message: '', severity: '' }
  alert('تم إرسال التحذير بنجاح!')
}

const onUserSelect = () => {
  const selectedUser = mockUsers.value.find(u => u.id === parseInt(newWarning.value.userId))
  if (selectedUser) {
    newWarning.value.userType = selectedUser.role
  }
}

const openReportModal = (report) => {
  selectedReport.value = report
  reportReview.value = { status: 'reviewed', adminNotes: '' }
  showReportModal.value = true
}

const closeReportModal = () => {
  showReportModal.value = false
  selectedReport.value = null
  reportReview.value = { status: 'reviewed', adminNotes: '' }
}

const updateReportStatus = () => {
  if (!reportReview.value.status) {
    alert('يرجى اختيار حالة التبليغ')
    return
  }

  reportsStore.updateReportStatus(
    selectedReport.value.id,
    reportReview.value.status,
    reportReview.value.adminNotes,
    authStore.user?.email || authStore.user?.username
  )

  alert('تم تحديث حالة التبليغ بنجاح!')
  closeReportModal()
}

const getStatusText = (status) => {
  const statusTexts = {
    pending: 'قيد المراجعة',
    reviewed: 'تمت المراجعة',
    resolved: 'تم الحل'
  }
  return statusTexts[status] || status
}

const getSeverityText = (severity) => {
  const severityTexts = {
    info: 'عادي',
    warning: 'تحذير',
    critical: 'حرج'
  }
  return severityTexts[severity] || severity
}

const getRoleText = (role) => {
  const roleTexts = {
    student: 'طالب',
    trainer: 'مدرب',
    admin: 'مدير'
  }
  return roleTexts[role] || role
}
</script>