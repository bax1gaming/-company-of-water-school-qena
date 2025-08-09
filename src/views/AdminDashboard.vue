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
            <div class="w-12 h-12 bg-gradient-to-br from-red-600 to-purple-600 rounded-xl flex items-center justify-center glow-effect">
              <Shield class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gradient">لوحة الإدارة</h1>
              <p class="text-sm text-gray-700 font-medium">مرحباً {{ authStore.profile?.name }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              @click="showNotifications = true"
              class="relative text-gray-600 hover:text-purple-600 p-3 rounded-xl hover:bg-purple-50 transition-all duration-300"
              title="الإشعارات"
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
              <span v-if="tab.badge" class="notification-badge ml-2">{{ tab.badge }}</span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Dashboard Overview -->
      <div v-if="activeTab === 'overview'" class="space-y-8">
        <!-- Stats Cards -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          
          <div class="card-enhanced p-6 hover-lift">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-2">الطلاب</p>
                <p class="text-3xl font-bold text-gradient">{{ studentsCount }}</p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center glow-effect">
                <GraduationCap class="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div class="card-enhanced p-6 hover-lift">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-2">المدربين</p>
                <p class="text-3xl font-bold text-gradient">{{ trainersCount }}</p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center glow-effect">
                <UserCheck class="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div class="card-enhanced p-6 hover-lift">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-2">التبليغات المعلقة</p>
                <p class="text-3xl font-bold text-gradient">{{ pendingReportsCount }}</p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center glow-effect">
                <AlertTriangle class="w-7 h-7 text-white" />
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
              <span class="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Management -->
      <div v-if="activeTab === 'users'" class="space-y-8">
        <!-- User Actions -->
        <div class="card-enhanced p-6 hover-lift">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3 rtl:space-x-reverse">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center glow-effect">
                <Users class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-gradient">إدارة المستخدمين</h3>
            </div>
            <button
              @click="showAddUserModal = true"
              class="btn-gradient-primary flex items-center space-x-2 rtl:space-x-reverse hover-lift"
            >
              <Plus class="w-5 h-5" />
              <span>إضافة مستخدم</span>
            </button>
          </div>

          <!-- Search and Filter -->
          <div class="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <input
                v-model="userSearch"
                type="text"
                placeholder="البحث عن مستخدم..."
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <select
                v-model="userRoleFilter"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">جميع الأدوار</option>
                <option value="student">طالب</option>
                <option value="trainer">مدرب</option>
                <option value="admin">مدير</option>
              </select>
            </div>
            <div>
              <button
                @click="loadUsers"
                class="w-full btn-gradient-success flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <RefreshCw class="w-5 h-5" />
                <span>تحديث</span>
              </button>
            </div>
          </div>

          <!-- Users Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th class="px-6 py-4 text-right text-sm font-bold text-gray-900">الاسم</th>
                  <th class="px-6 py-4 text-right text-sm font-bold text-gray-900">البريد الإلكتروني</th>
                  <th class="px-6 py-4 text-right text-sm font-bold text-gray-900">الهاتف</th>
                  <th class="px-6 py-4 text-right text-sm font-bold text-gray-900">الدور</th>
                  <th class="px-6 py-4 text-right text-sm font-bold text-gray-900">تاريخ التسجيل</th>
                  <th class="px-6 py-4 text-right text-sm font-bold text-gray-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-3 rtl:space-x-reverse">
                      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span class="text-white font-bold text-sm">{{ user.name?.charAt(0) }}</span>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{ user.name }}</p>
                        <p v-if="user.student_code" class="text-sm text-gray-500">{{ user.student_code }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-900">{{ user.email }}</td>
                  <td class="px-6 py-4 text-gray-900">{{ user.phone }}</td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-full text-sm font-medium"
                          :class="getRoleBadgeClass(user.role)">
                      {{ getRoleDisplayName(user.role) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-gray-900">{{ formatDate(user.created_at) }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-2 rtl:space-x-reverse">
                      <button
                        @click="editUser(user)"
                        class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="تعديل"
                      >
                        <Edit class="w-4 h-4" />
                      </button>
                      <button
                        @click="promoteUser(user)"
                        class="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                        title="ترقية"
                      >
                        <UserPlus class="w-4 h-4" />
                      </button>
                      <button
                        @click="sendWarning(user)"
                        class="text-orange-600 hover:text-orange-800 p-2 rounded-lg hover:bg-orange-50 transition-colors"
                        title="إرسال تحذير"
                      >
                        <AlertTriangle class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Classes Management -->
      <div v-if="activeTab === 'classes'" class="space-y-8">
        <div class="card-enhanced p-6 hover-lift">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3 rtl:space-x-reverse">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center glow-effect">
                <BookOpen class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-gradient">إدارة الصفوف</h3>
            </div>
            <button
              @click="showAddClassModal = true"
              class="btn-gradient-primary flex items-center space-x-2 rtl:space-x-reverse hover-lift"
            >
              <Plus class="w-5 h-5" />
              <span>إضافة صف</span>
            </button>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="cls in platformStore.classes"
              :key="cls.id"
              class="card-enhanced p-6 hover-lift glow-effect"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen class="w-6 h-6 text-white" />
                </div>
                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                  <button
                    @click="editClass(cls)"
                    class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteClass(cls.id)"
                    class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h4 class="font-bold text-gray-900 text-lg mb-2">{{ cls.name }}</h4>
              <p class="text-gray-600 mb-4">{{ cls.description }}</p>
              <div class="space-y-2 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">الفيديوهات:</span>
                  <span class="font-medium">{{ getClassVideosCount(cls.id) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">الملفات:</span>
                  <span class="font-medium">{{ getClassFilesCount(cls.id) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reports Management -->
      <div v-if="activeTab === 'reports'" class="space-y-8">
        <div class="card-enhanced p-6 hover-lift">
          <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center glow-effect">
              <AlertTriangle class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gradient">إدارة التبليغات</h3>
          </div>

          <!-- Reports Filter -->
          <div class="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <select
                v-model="reportStatusFilter"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">جميع الحالات</option>
                <option value="pending">قيد المراجعة</option>
                <option value="reviewed">تمت المراجعة</option>
                <option value="resolved">تم الحل</option>
              </select>
            </div>
            <div>
              <select
                v-model="reportSeverityFilter"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">جميع المستويات</option>
                <option value="info">عادي</option>
                <option value="warning">تحذير</option>
                <option value="critical">حرج</option>
              </select>
            </div>
            <div>
              <button
                @click="loadReports"
                class="w-full btn-gradient-success flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <RefreshCw class="w-5 h-5" />
                <span>تحديث</span>
              </button>
            </div>
          </div>

          <!-- Reports List -->
          <div class="space-y-4">
            <div
              v-for="report in filteredReports"
              :key="report.id"
              class="border rounded-xl p-6 hover-lift"
              :class="getReportBorderClass(report.severity)"
            >
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h4 class="font-bold text-gray-900 text-lg mb-2">{{ report.title }}</h4>
                  <div class="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-600">
                    <span>الطالب: {{ report.student_name }} ({{ report.student_code }})</span>
                    <span>المدرب: {{ report.trainer_name }}</span>
                    <span>{{ formatDate(report.created_at) }}</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                  <span class="px-3 py-1 rounded-full text-xs font-medium"
                        :class="getStatusBadgeClass(report.status)">
                    {{ getStatusDisplayName(report.status) }}
                  </span>
                  <span class="px-3 py-1 rounded-full text-xs font-medium"
                        :class="getSeverityBadgeClass(report.severity)">
                    {{ getSeverityDisplayName(report.severity) }}
                  </span>
                </div>
              </div>
              
              <p class="text-gray-700 mb-4">{{ report.description }}</p>
              
              <div v-if="report.action_taken" class="mb-4 p-3 bg-blue-50 rounded-lg">
                <p class="text-sm font-medium text-blue-900 mb-1">الإجراء المتخذ:</p>
                <p class="text-sm text-blue-800">{{ report.action_taken }}</p>
              </div>

              <div v-if="report.admin_notes && report.status !== 'pending'" class="mb-4 p-3 bg-green-50 rounded-lg">
                <p class="text-sm font-medium text-green-900 mb-1">ملاحظات الإدارة:</p>
                <p class="text-sm text-green-800">{{ report.admin_notes }}</p>
              </div>

              <div v-if="report.status === 'pending'" class="flex items-center space-x-3 rtl:space-x-reverse">
                <button
                  @click="reviewReport(report)"
                  class="btn-gradient-primary flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Eye class="w-4 h-4" />
                  <span>مراجعة</span>
                </button>
                <button
                  @click="resolveReport(report)"
                  class="btn-gradient-success flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Check class="w-4 h-4" />
                  <span>حل</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Announcements Management -->
      <div v-if="activeTab === 'announcements'" class="space-y-8">
        <div class="card-enhanced p-6 hover-lift">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3 rtl:space-x-reverse">
              <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center glow-effect">
                <Megaphone class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-gradient">إدارة الإعلانات</h3>
            </div>
            <button
              @click="showAddAnnouncementModal = true"
              class="btn-gradient-primary flex items-center space-x-2 rtl:space-x-reverse hover-lift"
            >
              <Plus class="w-5 h-5" />
              <span>إضافة إعلان</span>
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="announcement in platformStore.announcements"
              :key="announcement.id"
              class="card-enhanced p-6 hover-lift"
            >
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h4 class="font-bold text-gray-900 text-lg mb-2">{{ announcement.title }}</h4>
                  <div class="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-600">
                    <span>الكاتب: {{ announcement.author_name }}</span>
                    <span>{{ formatDate(announcement.created_at) }}</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                  <button
                    @click="editAnnouncement(announcement)"
                    class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteAnnouncement(announcement.id)"
                    class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p class="text-gray-700">{{ announcement.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Management -->
      <div v-if="activeTab === 'content'" class="space-y-8">
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Videos Management -->
          <div class="card-enhanced p-6 hover-lift">
            <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center glow-effect">
                <Video class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gradient">إدارة الفيديوهات</h3>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span class="text-gray-700">إجمالي الفيديوهات</span>
                <span class="font-bold text-purple-600">{{ platformStore.videos.length }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span class="text-gray-700">فيديوهات عملي</span>
                <span class="font-bold text-blue-600">{{ practicalVideosCount }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span class="text-gray-700">فيديوهات مراجعة</span>
                <span class="font-bold text-green-600">{{ reviewVideosCount }}</span>
              </div>
            </div>
            
            <button
              @click="manageVideos"
              class="w-full mt-4 btn-gradient-primary"
            >
              إدارة الفيديوهات
            </button>
          </div>

          <!-- Files Management -->
          <div class="card-enhanced p-6 hover-lift">
            <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center glow-effect">
                <FileText class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gradient">إدارة الملفات</h3>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span class="text-gray-700">إجمالي الملفات</span>
                <span class="font-bold text-teal-600">{{ platformStore.files.length }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span class="text-gray-700">ملفات PDF</span>
                <span class="font-bold text-red-600">{{ pdfFilesCount }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span class="text-gray-700">ملفات أخرى</span>
                <span class="font-bold text-orange-600">{{ otherFilesCount }}</span>
              </div>
            </div>
            
            <button
              @click="manageFiles"
              class="w-full mt-4 btn-gradient-success"
            >
              إدارة الملفات
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Add User Modal -->
    <div v-if="showAddUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="card-enhanced p-8 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gradient">إضافة مستخدم جديد</h3>
          <button @click="showAddUserModal = false" class="text-gray-500 hover:text-gray-700">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="addUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
            <input
              v-model="newUser.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
            <input
              v-model="newUser.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
            <input
              v-model="newUser.phone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الدور</label>
            <select
              v-model="newUser.role"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">اختر الدور</option>
              <option value="student">طالب</option>
              <option value="trainer">مدرب</option>
              <option value="admin">مدير</option>
            </select>
          </div>
          <div class="flex space-x-3 rtl:space-x-reverse">
            <button
              type="submit"
              class="flex-1 btn-gradient-primary"
            >
              إضافة
            </button>
            <button
              type="button"
              @click="showAddUserModal = false"
              class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Class Modal -->
    <div v-if="showAddClassModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="card-enhanced p-8 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gradient">إضافة صف جديد</h3>
          <button @click="showAddClassModal = false" class="text-gray-500 hover:text-gray-700">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="addClass" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">اسم الصف</label>
            <input
              v-model="newClass.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
            <textarea
              v-model="newClass.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>
          <div class="flex space-x-3 rtl:space-x-reverse">
            <button
              type="submit"
              class="flex-1 btn-gradient-success"
            >
              إضافة
            </button>
            <button
              type="button"
              @click="showAddClassModal = false"
              class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Announcement Modal -->
    <div v-if="showAddAnnouncementModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="card-enhanced p-8 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gradient">إضافة إعلان جديد</h3>
          <button @click="showAddAnnouncementModal = false" class="text-gray-500 hover:text-gray-700">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="addAnnouncement" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">عنوان الإعلان</label>
            <input
              v-model="newAnnouncement.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">محتوى الإعلان</label>
            <textarea
              v-model="newAnnouncement.content"
              rows="4"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
          </div>
          <div class="flex space-x-3 rtl:space-x-reverse">
            <button
              type="submit"
              class="flex-1 btn-gradient-secondary"
            >
              نشر
            </button>
            <button
              type="button"
              @click="showAddAnnouncementModal = false"
              class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePlatformStore } from '../stores/platform'
import { useReportsStore } from '../stores/reports'
import { database } from '../lib/supabase'
import { 
  Shield,
  LogOut,
  Bell,
  Users,
  GraduationCap,
  UserCheck,
  AlertTriangle,
  Activity,
  Plus,
  RefreshCw,
  Edit,
  UserPlus,
  Trash2,
  BookOpen,
  Video,
  FileText,
  Megaphone,
  Eye,
  Check,
  X
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const platformStore = usePlatformStore()
const reportsStore = useReportsStore()

// Reactive data
const activeTab = ref('overview')
const showNotifications = ref(false)
const showAddUserModal = ref(false)
const showAddClassModal = ref(false)
const showAddAnnouncementModal = ref(false)

const users = ref([])
const reports = ref([])

// Search and filters
const userSearch = ref('')
const userRoleFilter = ref('')
const reportStatusFilter = ref('')
const reportSeverityFilter = ref('')

// Form data
const newUser = ref({
  name: '',
  email: '',
  phone: '',
  role: ''
})

const newClass = ref({
  name: '',
  description: ''
})

const newAnnouncement = ref({
  title: '',
  content: ''
})

// Tabs configuration
const tabs = computed(() => [
  { id: 'overview', name: 'نظرة عامة', icon: Activity },
  { id: 'users', name: 'المستخدمين', icon: Users },
  { id: 'classes', name: 'الصفوف', icon: BookOpen },
  { id: 'reports', name: 'التبليغات', icon: AlertTriangle, badge: pendingReportsCount.value },
  { id: 'announcements', name: 'الإعلانات', icon: Megaphone },
  { id: 'content', name: 'المحتوى', icon: Video }
])

// Computed properties
const totalUsers = computed(() => users.value.length)
const studentsCount = computed(() => users.value.filter(u => u.role === 'student').length)
const trainersCount = computed(() => users.value.filter(u => u.role === 'trainer').length)
const pendingReportsCount = computed(() => reports.value.filter(r => r.status === 'pending').length)

const practicalVideosCount = computed(() => 
  platformStore.videos.filter(v => v.category === 'practical').length
)
const reviewVideosCount = computed(() => 
  platformStore.videos.filter(v => v.category === 'review').length
)
const pdfFilesCount = computed(() => 
  platformStore.files.filter(f => f.file_type === 'pdf').length
)
const otherFilesCount = computed(() => 
  platformStore.files.filter(f => f.file_type !== 'pdf').length
)

const filteredUsers = computed(() => {
  let filtered = users.value
  
  if (userSearch.value) {
    filtered = filtered.filter(user => 
      user.name?.toLowerCase().includes(userSearch.value.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearch.value.toLowerCase()) ||
      user.phone?.includes(userSearch.value)
    )
  }
  
  if (userRoleFilter.value) {
    filtered = filtered.filter(user => user.role === userRoleFilter.value)
  }
  
  return filtered
})

const filteredReports = computed(() => {
  let filtered = reports.value
  
  if (reportStatusFilter.value) {
    filtered = filtered.filter(report => report.status === reportStatusFilter.value)
  }
  
  if (reportSeverityFilter.value) {
    filtered = filtered.filter(report => report.severity === reportSeverityFilter.value)
  }
  
  return filtered
})

const recentActivities = computed(() => [
  {
    id: 1,
    icon: Users,
    title: 'مستخدم جديد',
    description: 'انضم طالب جديد إلى المنصة',
    time: 'منذ 5 دقائق'
  },
  {
    id: 2,
    icon: Video,
    title: 'فيديو جديد',
    description: 'تم رفع فيديو جديد في الصف الثاني',
    time: 'منذ 15 دقيقة'
  },
  {
    id: 3,
    icon: AlertTriangle,
    title: 'تبليغ جديد',
    description: 'تم استلام تبليغ من مدرب',
    time: 'منذ 30 دقيقة'
  }
])

// Methods
const logout = () => {
  authStore.logout()
  router.push('/')
}

const loadUsers = async () => {
  try {
    const result = await database.getAllUsers()
    if (result.data) {
      users.value = result.data
    }
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

const loadReports = async () => {
  try {
    const result = await database.getReports()
    if (result.data) {
      reports.value = result.data
    }
  } catch (error) {
    console.error('Error loading reports:', error)
  }
}

const addUser = async () => {
  try {
    // Here you would typically call an API to create the user
    console.log('Adding user:', newUser.value)
    
    // Reset form and close modal
    newUser.value = { name: '', email: '', phone: '', role: '' }
    showAddUserModal.value = false
    
    // Reload users
    await loadUsers()
    
    alert('تم إضافة المستخدم بنجاح!')
  } catch (error) {
    console.error('Error adding user:', error)
    alert('حدث خطأ أثناء إضافة المستخدم')
  }
}

const addClass = async () => {
  try {
    const result = await database.addClass(newClass.value)
    if (result.data) {
      platformStore.classes.push(result.data)
      newClass.value = { name: '', description: '' }
      showAddClassModal.value = false
      alert('تم إضافة الصف بنجاح!')
    }
  } catch (error) {
    console.error('Error adding class:', error)
    alert('حدث خطأ أثناء إضافة الصف')
  }
}

const addAnnouncement = async () => {
  try {
    const announcementData = {
      ...newAnnouncement.value,
      author_id: authStore.user?.id,
      author_name: authStore.profile?.name
    }
    
    const result = await database.addAnnouncement(announcementData)
    if (result.data) {
      platformStore.announcements.unshift(result.data)
      newAnnouncement.value = { title: '', content: '' }
      showAddAnnouncementModal.value = false
      alert('تم نشر الإعلان بنجاح!')
    }
  } catch (error) {
    console.error('Error adding announcement:', error)
    alert('حدث خطأ أثناء نشر الإعلان')
  }
}

const editUser = (user) => {
  console.log('Editing user:', user)
  // Implement user editing logic
}

const promoteUser = (user) => {
  console.log('Promoting user:', user)
  // Implement user promotion logic
}

const sendWarning = (user) => {
  console.log('Sending warning to user:', user)
  // Implement warning logic
}

const editClass = (cls) => {
  console.log('Editing class:', cls)
  // Implement class editing logic
}

const deleteClass = async (classId) => {
  if (confirm('هل أنت متأكد من حذف هذا الصف؟')) {
    try {
      const result = await database.deleteClass(classId)
      if (!result.error) {
        platformStore.classes = platformStore.classes.filter(c => c.id !== classId)
        alert('تم حذف الصف بنجاح!')
      }
    } catch (error) {
      console.error('Error deleting class:', error)
      alert('حدث خطأ أثناء حذف الصف')
    }
  }
}

const editAnnouncement = (announcement) => {
  console.log('Editing announcement:', announcement)
  // Implement announcement editing logic
}

const deleteAnnouncement = async (announcementId) => {
  if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
    try {
      const result = await database.deleteAnnouncement(announcementId)
      if (!result.error) {
        platformStore.announcements = platformStore.announcements.filter(a => a.id !== announcementId)
        alert('تم حذف الإعلان بنجاح!')
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      alert('حدث خطأ أثناء حذف الإعلان')
    }
  }
}

const reviewReport = (report) => {
  const adminNotes = prompt('أدخل ملاحظات الإدارة:')
  if (adminNotes) {
    // Update report status to reviewed
    console.log('Reviewing report:', report, 'Notes:', adminNotes)
  }
}

const resolveReport = (report) => {
  const adminNotes = prompt('أدخل ملاحظات الحل:')
  if (adminNotes) {
    // Update report status to resolved
    console.log('Resolving report:', report, 'Notes:', adminNotes)
  }
}

const manageVideos = () => {
  console.log('Managing videos')
  // Implement video management logic
}

const manageFiles = () => {
  console.log('Managing files')
  // Implement file management logic
}

// Utility methods
const getRoleBadgeClass = (role) => {
  const classes = {
    student: 'bg-blue-100 text-blue-800',
    trainer: 'bg-green-100 text-green-800',
    admin: 'bg-purple-100 text-purple-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const getRoleDisplayName = (role) => {
  const names = {
    student: 'طالب',
    trainer: 'مدرب',
    admin: 'مدير'
  }
  return names[role] || role
}

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusDisplayName = (status) => {
  const names = {
    pending: 'قيد المراجعة',
    reviewed: 'تمت المراجعة',
    resolved: 'تم الحل'
  }
  return names[status] || status
}

const getSeverityBadgeClass = (severity) => {
  const classes = {
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  }
  return classes[severity] || 'bg-gray-100 text-gray-800'
}

const getSeverityDisplayName = (severity) => {
  const names = {
    info: 'عادي',
    warning: 'تحذير',
    critical: 'حرج'
  }
  return names[severity] || severity
}

const getReportBorderClass = (severity) => {
  const classes = {
    info: 'border-l-4 border-l-blue-500 bg-blue-50',
    warning: 'border-l-4 border-l-orange-500 bg-orange-50',
    critical: 'border-l-4 border-l-red-500 bg-red-50'
  }
  return classes[severity] || 'border-l-4 border-l-gray-500 bg-gray-50'
}

const getClassVideosCount = (classId) => {
  return platformStore.getVideosByClass(classId).length
}

const getClassFilesCount = (classId) => {
  return platformStore.getFilesByClass(classId).length
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ar-EG')
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    platformStore.loadAllData(),
    loadUsers(),
    loadReports()
  ])
})
</script>