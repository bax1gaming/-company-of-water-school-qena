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
            </button>
          </nav>
        </div>
      </div>

      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'">
        <!-- Admin Info -->
        <div class="card-enhanced p-8 mb-8 hover-lift">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div class="w-20 h-20 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg glow-effect float-animation">
              <Shield class="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 class="text-3xl font-bold text-gradient mb-2">{{ authStore.user?.name }}</h2>
              <p class="text-gray-700 font-semibold text-lg">مدير المنصة</p>
              <p class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block mt-2">صلاحيات كاملة</p>
            </div>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="card-enhanced p-6 hover-lift">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-2">إجمالي الطلاب</p>
                <p class="text-3xl font-bold text-gradient">{{ totalStudents }}</p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center glow-effect">
                <Users class="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div class="card-enhanced p-6 hover-lift" style="animation-delay: 0.1s;">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-2">المدربين</p>
                <p class="text-3xl font-bold text-gradient">{{ totalTrainers }}</p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center glow-effect">
                <UserCheck class="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div class="card-enhanced p-6 hover-lift" style="animation-delay: 0.2s;">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-2">التبليغات المعلقة</p>
                <p class="text-3xl font-bold text-gradient">{{ pendingReports }}</p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center glow-effect">
                <AlertTriangle class="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div class="card-enhanced p-6 hover-lift" style="animation-delay: 0.3s;">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium mb-2">إجمالي الفيديوهات</p>
                <p class="text-3xl font-bold text-gradient">{{ totalVideos }}</p>
              </div>
              <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center glow-effect">
                <Video class="w-7 h-7 text-white" />
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
            <div class="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <UserPlus class="w-5 h-5 text-white" />
              </div>
              <div>
                <p class="font-semibold text-gray-900">انضم طالب جديد</p>
                <p class="text-sm text-gray-600">محمد أحمد انضم إلى الصف الثاني</p>
              </div>
              <span class="text-sm text-gray-500 mr-auto">منذ ساعتين</span>
            </div>
            
            <div class="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Upload class="w-5 h-5 text-white" />
              </div>
              <div>
                <p class="font-semibold text-gray-900">فيديو جديد</p>
                <p class="text-sm text-gray-600">د. محمد أحمد رفع فيديو جديد</p>
              </div>
              <span class="text-sm text-gray-500 mr-auto">منذ 4 ساعات</span>
            </div>
          </div>
        </div>
      </div>

      <!-- User Management Tab -->
      <div v-if="activeTab === 'users'">
        <AdminSection title="إدارة المستخدمين" :icon="Users">
          <!-- Promote User Form -->
          <div class="card-enhanced p-6 mb-6">
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
                class="btn-gradient-primary py-2 px-6"
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
                    <th class="text-right py-3 px-4 font-semibold text-gray-700">الهاتف</th>
                    <th class="text-right py-3 px-4 font-semibold text-gray-700">الصلاحية</th>
                    <th class="text-right py-3 px-4 font-semibold text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in mockUsers" :key="user.id" class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-4">{{ user.name }}</td>
                    <td class="py-3 px-4">{{ user.email }}</td>
                    <td class="py-3 px-4">{{ user.phone }}</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-1 rounded-full text-xs font-medium"
                            :class="getRoleClass(user.role)">
                        {{ getRoleText(user.role) }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <button
                        @click="sendWarningToUser(user)"
                        class="text-orange-600 hover:text-orange-800 text-sm font-medium"
                      >
                        إرسال تحذير
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </AdminSection>
      </div>

      <!-- Reports Management Tab -->
      <div v-if="activeTab === 'reports'">
        <AdminSection title="إدارة التبليغات" :icon="FileText">
          <div class="space-y-6">
            <!-- Pending Reports -->
            <div class="card-enhanced p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                <AlertTriangle class="w-5 h-5 text-orange-500" />
                <span>التبليغات المعلقة ({{ pendingReportsList.length }})</span>
              </h4>
              
              <div v-if="pendingReportsList.length === 0" class="text-center py-8">
                <CheckCircle class="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p class="text-gray-600">لا توجد تبليغات معلقة</p>
              </div>
              
              <div v-else class="space-y-4">
                <div
                  v-for="report in pendingReportsList"
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
                      <h5 class="font-semibold text-gray-900">{{ report.title }}</h5>
                      <p class="text-sm text-gray-600">
                        الطالب: {{ report.studentName }} ({{ report.studentCode }})
                      </p>
                      <p class="text-sm text-gray-600">
                        المدرب: {{ report.trainerName }}
                      </p>
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
                  
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">
                      {{ new Date(report.createdAt).toLocaleDateString('ar-EG') }}
                    </span>
                    <div class="flex space-x-2 rtl:space-x-reverse">
                      <button
                        @click="reviewReport(report.id, 'reviewed')"
                        class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        مراجعة
                      </button>
                      <button
                        @click="reviewReport(report.id, 'resolved')"
                        class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        حل المشكلة
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- All Reports -->
            <div class="card-enhanced p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">جميع التبليغات</h4>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-gray-200">
                      <th class="text-right py-3 px-4 font-semibold text-gray-700">العنوان</th>
                      <th class="text-right py-3 px-4 font-semibold text-gray-700">الطالب</th>
                      <th class="text-right py-3 px-4 font-semibold text-gray-700">المدرب</th>
                      <th class="text-right py-3 px-4 font-semibold text-gray-700">الحالة</th>
                      <th class="text-right py-3 px-4 font-semibold text-gray-700">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="report in reportsStore.reports" :key="report.id" class="border-b border-gray-100 hover:bg-gray-50">
                      <td class="py-3 px-4">{{ report.title }}</td>
                      <td class="py-3 px-4">{{ report.studentName }}</td>
                      <td class="py-3 px-4">{{ report.trainerName }}</td>
                      <td class="py-3 px-4">
                        <span class="px-2 py-1 rounded-full text-xs font-medium"
                              :class="getStatusClass(report.status)">
                          {{ getStatusText(report.status) }}
                        </span>
                      </td>
                      <td class="py-3 px-4">{{ new Date(report.createdAt).toLocaleDateString('ar-EG') }}</td>
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
          <!-- Add Announcement Form -->
          <div class="card-enhanced p-6 mb-6">
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
                  placeholder="أدخل محتوى الإعلان..."
                ></textarea>
              </div>

              <button
                type="submit"
                class="btn-gradient-primary py-2 px-6"
              >
                <span>نشر الإعلان</span>
              </button>
            </form>
          </div>

          <!-- Announcements List -->
          <div class="card-enhanced p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">الإعلانات المنشورة</h4>
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
                    class="text-red-600 hover:text-red-800"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
                <p class="text-gray-700 mb-3">{{ announcement.content }}</p>
                <div class="flex justify-between text-sm text-gray-500">
                  <span>{{ announcement.author }}</span>
                  <span>{{ announcement.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </AdminSection>
      </div>

      <!-- Platform Settings Tab -->
      <div v-if="activeTab === 'settings'">
        <AdminSection title="إعدادات المنصة" :icon="Settings">
          <div class="space-y-6">
            <!-- General Settings -->
            <div class="card-enhanced p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">الإعدادات العامة</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">اسم المنصة</label>
                  <input
                    type="text"
                    value="المنصة الرسمية لطلاب مياه الشرب والصرف الصحي بقنا"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">وصف المنصة</label>
                  <textarea
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >منصة تعليمية متخصصة في مجال مياه الشرب والصرف الصحي</textarea>
                </div>
              </div>
            </div>

            <!-- System Statistics -->
            <div class="card-enhanced p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">إحصائيات النظام</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <h5 class="font-semibold text-gray-900 mb-2">المستخدمين</h5>
                  <p class="text-2xl font-bold text-blue-600">{{ totalUsers }}</p>
                </div>
                <div class="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg">
                  <h5 class="font-semibold text-gray-900 mb-2">المحتوى</h5>
                  <p class="text-2xl font-bold text-green-600">{{ totalContent }}</p>
                </div>
              </div>
            </div>
          </div>
        </AdminSection>
      </div>
    </div>

    <!-- Warning Modal -->
    <div v-if="showWarningModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">إرسال تحذير</h3>
        <form @submit.prevent="sendWarning">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">عنوان التحذير</label>
              <input
                v-model="warningForm.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="أدخل عنوان التحذير"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نص التحذير</label>
              <textarea
                v-model="warningForm.message"
                required
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="أدخل نص التحذير..."
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">نوع التحذير</label>
              <select
                v-model="warningForm.severity"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="info">إشعار</option>
                <option value="warning">تحذير</option>
                <option value="error">خطر</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-3 rtl:space-x-reverse mt-6">
            <button
              type="button"
              @click="showWarningModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              إلغاء
            </button>
            <button
              type="submit"
              class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              إرسال التحذير
            </button>
          </div>
        </form>
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
  Users,
  UserCheck,
  AlertTriangle,
  Video,
  Bell,
  Activity,
  UserPlus,
  Upload,
  FileText,
  Megaphone,
  Settings,
  Trash2,
  CheckCircle
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const platformStore = usePlatformStore()
const warningsStore = useWarningsStore()
const reportsStore = useReportsStore()

const activeTab = ref('overview')
const showWarnings = ref(false)
const showWarningModal = ref(false)
const selectedUser = ref(null)

const tabs = [
  { id: 'overview', name: 'نظرة عامة', icon: Activity },
  { id: 'users', name: 'إدارة المستخدمين', icon: Users },
  { id: 'reports', name: 'إدارة التبليغات', icon: FileText },
  { id: 'announcements', name: 'الإعلانات', icon: Megaphone },
  { id: 'settings', name: 'الإعدادات', icon: Settings }
]

const promoteForm = ref({
  identifier: '',
  newRole: '',
  specialization: ''
})

const newAnnouncement = ref({
  title: '',
  content: ''
})

const warningForm = ref({
  title: '',
  message: '',
  severity: 'warning'
})

const mockUsers = ref([
  {
    id: 1,
    name: 'أحمد محمد',
    email: 'student1@example.com',
    phone: '01234567890',
    role: 'student'
  },
  {
    id: 2,
    name: 'فاطمة علي',
    email: 'student2@example.com',
    phone: '01234567891',
    role: 'student'
  },
  {
    id: 3,
    name: 'د. محمد أحمد',
    email: 'trainer1@example.com',
    phone: '01111111111',
    role: 'trainer'
  }
])

// Computed properties
const totalStudents = computed(() => {
  return mockUsers.value.filter(user => user.role === 'student').length
})

const totalTrainers = computed(() => {
  return mockUsers.value.filter(user => user.role === 'trainer').length
})

const totalUsers = computed(() => {
  return mockUsers.value.length
})

const totalVideos = computed(() => {
  return platformStore.videos.length
})

const totalContent = computed(() => {
  return platformStore.videos.length + platformStore.files.length
})

const pendingReports = computed(() => {
  return reportsStore.getPendingReportsCount()
})

const pendingReportsList = computed(() => {
  return reportsStore.getReportsByStatus('pending')
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

const promoteUser = () => {
  if (!promoteForm.value.identifier || !promoteForm.value.newRole) {
    alert('يرجى ملء جميع الحقول المطلوبة')
    return
  }

  const additionalData = {}
  if (promoteForm.value.newRole === 'trainer' && promoteForm.value.specialization) {
    additionalData.specialization = promoteForm.value.specialization
  }

  const result = authStore.promoteUser(
    promoteForm.value.identifier,
    promoteForm.value.newRole,
    additionalData
  )

  if (result.success) {
    alert(result.message)
    promoteForm.value = { identifier: '', newRole: '', specialization: '' }
  } else {
    alert(result.message)
  }
}

const sendWarningToUser = (user) => {
  selectedUser.value = user
  showWarningModal.value = true
}

const sendWarning = () => {
  if (!selectedUser.value) return

  const warningData = {
    userId: selectedUser.value.id,
    userType: selectedUser.value.role,
    title: warningForm.value.title,
    message: warningForm.value.message,
    severity: warningForm.value.severity,
    createdBy: authStore.user.email || authStore.user.username
  }

  warningsStore.addWarning(warningData)
  
  showWarningModal.value = false
  warningForm.value = { title: '', message: '', severity: 'warning' }
  selectedUser.value = null
  
  alert('تم إرسال التحذير بنجاح!')
}

const reviewReport = (reportId, status) => {
  const adminNotes = status === 'resolved' ? 'تم حل المشكلة' : 'تمت مراجعة التبليغ'
  reportsStore.updateReportStatus(
    reportId, 
    status, 
    adminNotes, 
    authStore.user.email || authStore.user.username
  )
  alert(`تم ${status === 'resolved' ? 'حل' : 'مراجعة'} التبليغ بنجاح!`)
}

const addAnnouncement = () => {
  if (!newAnnouncement.value.title || !newAnnouncement.value.content) {
    alert('يرجى ملء جميع الحقول')
    return
  }

  const announcementData = {
    title: newAnnouncement.value.title,
    content: newAnnouncement.value.content,
    author: authStore.user.name
  }

  platformStore.addAnnouncement(announcementData)
  
  newAnnouncement.value = { title: '', content: '' }
  alert('تم نشر الإعلان بنجاح!')
}

const deleteAnnouncement = (announcementId) => {
  if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
    platformStore.deleteAnnouncement(announcementId)
    alert('تم حذف الإعلان بنجاح!')
  }
}

const getRoleClass = (role) => {
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

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'قيد المراجعة',
    reviewed: 'تمت المراجعة',
    resolved: 'تم الحل'
  }
  return texts[status] || 'غير محدد'
}
</script>