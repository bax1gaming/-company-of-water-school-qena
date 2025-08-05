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
                  ? 'border-blue-500 text-blue-600'
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

      <!-- Statistics -->
      <div v-if="activeTab === 'overview'" class="grid md:grid-cols-4 gap-6 mb-8">
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
        
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">تبليغات الطلاب المعلقة</p>
              <p class="text-2xl font-bold text-gray-900">{{ pendingReportsCount }}</p>
            </div>
            <FileText class="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      <!-- Student Reports Management -->
      <div v-if="activeTab === 'student-reports'">
        <AdminSection title="إدارة تبليغات الطلاب" :icon="FileText">
          <!-- Reports Statistics -->
          <div class="grid md:grid-cols-4 gap-4 mb-6">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-yellow-700">قيد المراجعة</p>
                  <p class="text-2xl font-bold text-yellow-900">{{ reportsStore.getReportsByStatus('pending').length }}</p>
                </div>
                <AlertTriangle class="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-blue-700">تمت المراجعة</p>
                  <p class="text-2xl font-bold text-blue-900">{{ reportsStore.getReportsByStatus('reviewed').length }}</p>
                </div>
                <Eye class="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-green-700">تم الحل</p>
                  <p class="text-2xl font-bold text-green-900">{{ reportsStore.getReportsByStatus('resolved').length }}</p>
                </div>
                <CheckCircle class="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-700">إجمالي التبليغات</p>
                  <p class="text-2xl font-bold text-gray-900">{{ reportsStore.reports.length }}</p>
                </div>
                <FileText class="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </div>

          <!-- Reports List -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">جميع التبليغات</h4>
            <div v-if="reportsStore.reports.length === 0" class="text-center py-12">
              <FileText class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">لا توجد تبليغات</h3>
              <p class="text-gray-600">لم يتم استلام أي تبليغات من المدربين بعد</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="report in reportsStore.reports"
                :key="report.id"
                class="border rounded-lg p-6"
                :class="['border-l-4', getSeverityColor(report.severity)]"
              >
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h5 class="font-bold text-gray-900 text-lg mb-2">{{ report.title }}</h5>
                    <div class="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><span class="font-medium">الطالب:</span> {{ report.studentName }} ({{ report.studentCode }})</p>
                        <p><span class="font-medium">المدرب:</span> {{ report.trainerName }}</p>
                      </div>
                      <div>
                        <p><span class="font-medium">نوع التبليغ:</span> 
                          {{ report.reportType === 'behavior' ? 'سلوك غير مناسب' : 
                             report.reportType === 'attendance' ? 'مشاكل الحضور' : 
                             report.reportType === 'academic' ? 'مشاكل أكاديمية' : 'أخرى' }}
                        </p>
                        <p><span class="font-medium">التاريخ:</span> {{ formatDate(report.createdAt) }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="text-xs px-3 py-1 rounded-full font-medium"
                          :class="[
                            report.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                            report.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          ]">
                      {{ report.status === 'resolved' ? 'تم الحل' : 
                         report.status === 'reviewed' ? 'تمت المراجعة' : 'قيد المراجعة' }}
                    </span>
                    <span class="text-xs px-3 py-1 rounded-full font-medium"
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

                <div class="mb-4">
                  <p class="font-medium text-gray-700 mb-2">وصف المشكلة:</p>
                  <p class="text-gray-600 leading-relaxed">{{ report.description }}</p>
                </div>

                <div v-if="report.actionTaken" class="mb-4">
                  <p class="font-medium text-gray-700 mb-2">الإجراء المتخذ من المدرب:</p>
                  <p class="text-gray-600 leading-relaxed">{{ report.actionTaken }}</p>
                </div>

                <div v-if="report.adminNotes && report.status !== 'pending'" class="mb-4 p-4 bg-gray-100 rounded-lg">
                  <p class="font-medium text-gray-700 mb-2">ملاحظات الإدارة:</p>
                  <p class="text-gray-600 leading-relaxed">{{ report.adminNotes }}</p>
                  <p class="text-sm text-gray-500 mt-2">
                    تمت المراجعة بواسطة: {{ report.reviewedBy }} في {{ formatDate(report.reviewedAt) }}
                  </p>
                </div>

                <!-- Admin Actions -->
                <div v-if="report.status === 'pending'" class="border-t pt-4">
                  <p class="font-medium text-gray-700 mb-3">إجراءات الإدارة:</p>
                  <div class="flex flex-wrap gap-3">
                    <button
                      @click="reviewReport(report.id, 'reviewed', 'تمت مراجعة التبليغ')"
                      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 rtl:space-x-reverse text-sm"
                    >
                      <Eye class="w-4 h-4" />
                      <span>مراجعة</span>
                    </button>
                    <button
                      @click="reviewReport(report.id, 'resolved', 'تم حل المشكلة')"
                      class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 rtl:space-x-reverse text-sm"
                    >
                      <CheckCircle class="w-4 h-4" />
                      <span>حل المشكلة</span>
                    </button>
                    <button
                      @click="deleteReport(report.id)"
                      class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 rtl:space-x-reverse text-sm"
                    >
                      <XCircle class="w-4 h-4" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>

                <div v-else-if="report.status === 'reviewed'" class="border-t pt-4">
                  <div class="flex gap-3">
                    <button
                      @click="reviewReport(report.id, 'resolved', 'تم حل المشكلة نهائياً')"
                      class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 rtl:space-x-reverse text-sm"
                    >
                      <CheckCircle class="w-4 h-4" />
                      <span>حل المشكلة</span>
                    </button>
                    <button
                      @click="deleteReport(report.id)"
                      class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 rtl:space-x-reverse text-sm"
                    >
                      <XCircle class="w-4 h-4" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AdminSection>
      </div>

      <!-- Announcements Management -->
      <div v-if="activeTab === 'announcements'">
        <AdminSection title="إدارة الإعلانات" :icon="Megaphone">
          <!-- Add Announcement -->
          <div class="border border-gray-200 rounded-lg p-6 mb-6">
            <h4 class="font-semibold text-gray-900 mb-4">إضافة إعلان جديد</h4>
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

          <!-- Announcements List -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">الإعلانات الحديثة</h4>
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
        </AdminSection>
      </div>

      <!-- Warnings Management -->
      <div v-if="activeTab === 'warnings'">
        <AdminSection title="إدارة التحذيرات" :icon="AlertTriangle">
          <!-- Send Warning Form -->
          <div class="border border-gray-200 rounded-lg p-6 mb-6">
            <h4 class="font-semibold text-gray-900 mb-4">إرسال تحذير جديد</h4>
            <form @submit.prevent="sendWarning" class="space-y-4">
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">المستخدم المستهدف</label>
                  <input
                    v-model="newWarning.targetUser"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="رقم الهاتف أو البريد الإلكتروني"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">نوع التحذير</label>
                  <select
                    v-model="newWarning.severity"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر نوع التحذير</option>
                    <option value="info">إشعار عادي</option>
                    <option value="warning">تحذير</option>
                    <option value="error">تحذير شديد</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">عنوان التحذير</label>
                <input
                  v-model="newWarning.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل عنوان التحذير"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">محتوى التحذير</label>
                <textarea
                  v-model="newWarning.message"
                  required
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل محتوى التحذير"
                ></textarea>
              </div>

              <button
                type="submit"
                class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                إرسال التحذير
              </button>
            </form>
          </div>

          <!-- Warnings History -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">سجل التحذيرات</h4>
            <div class="space-y-4">
              <div
                v-for="warning in warningsStore.warnings"
                :key="warning.id"
                class="border rounded-lg p-4"
                :class="[
                  warning.severity === 'error' ? 'border-l-4 border-l-red-500 bg-red-50' : 
                  warning.severity === 'warning' ? 'border-l-4 border-l-orange-500 bg-orange-50' : 
                  'border-l-4 border-l-blue-500 bg-blue-50'
                ]"
              >
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h5 class="font-semibold text-gray-900">{{ warning.title }}</h5>
                    <p class="text-sm text-gray-600">إلى: {{ getUserName(warning.userId, warning.userType) }}</p>
                  </div>
                  <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="text-xs px-2 py-1 rounded-full"
                          :class="[
                            warning.severity === 'error' ? 'bg-red-100 text-red-800' : 
                            warning.severity === 'warning' ? 'bg-orange-100 text-orange-800' : 
                            'bg-blue-100 text-blue-800'
                          ]">
                      {{ getSeverityText(warning.severity) }}
                    </span>
                    <button
                      @click="warningsStore.deleteWarning(warning.id)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p class="text-gray-700 mb-2">{{ warning.message }}</p>
                <div class="flex justify-between text-sm text-gray-500">
                  <span>{{ formatDate(warning.createdAt) }}</span>
                  <span>{{ warning.isRead ? 'تم القراءة' : 'لم يتم القراءة' }}</span>
                </div>
              </div>
            </div>
          </div>
        </AdminSection>
      </div>

      <!-- User Management -->
      <div v-if="activeTab === 'users'">
        <AdminSection title="إدارة المستخدمين" :icon="UserCog">
          <div class="grid md:grid-cols-2 gap-6">
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
          </div>
        </AdminSection>
      </div>

      <!-- Video Management -->
      <div v-if="activeTab === 'videos'">
        <AdminSection title="إدارة الفيديوهات" :icon="Upload">
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
        </AdminSection>
      </div>

      <!-- Classes Management -->
      <div v-if="activeTab === 'classes'">
        <AdminSection title="إدارة الصفوف الدراسية" :icon="BookOpen">
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePlatformStore } from '../stores/platform'
import { useWarningsStore } from '../stores/warnings'
import { useReportsStore } from '../stores/reports'
import AdminSection from '../components/AdminSection.vue'
import WarningsModal from '../components/WarningsModal.vue'
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
  AlertTriangle,
  BarChart3,
  Settings,
  FileText,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const platformStore = usePlatformStore()
const warningsStore = useWarningsStore()
const reportsStore = useReportsStore()

const activeTab = ref('overview')
const showWarnings = ref(false)

const tabs = [
  { id: 'overview', name: 'نظرة عامة', icon: BarChart3 },
  { id: 'announcements', name: 'الإعلانات', icon: Megaphone },
  { id: 'warnings', name: 'التحذيرات', icon: AlertTriangle },
  { id: 'users', name: 'المستخدمين', icon: UserCog },
  { id: 'videos', name: 'الفيديوهات', icon: Upload },
  { id: 'classes', name: 'الصفوف', icon: BookOpen },
  { id: 'student-reports', name: 'تبليغات الطلاب', icon: FileText }
]

const newAnnouncement = ref({
  title: '',
  content: ''
})

const newWarning = ref({
  targetUser: '',
  title: '',
  message: '',
  severity: ''
})

const promoteForm = ref({
  identifier: '',
  specialization: ''
})

const adminForm = ref({
  identifier: ''
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

const pendingReportsCount = computed(() => {
  return reportsStore.getPendingReportsCount()
})

const unreadWarningsCount = computed(() => {
  if (!authStore.user) return 0
  return warningsStore.getUnreadWarningsCount(authStore.user.id, authStore.user.role)
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

const sendWarning = () => {
  // Find target user
  const mockUsers = [
    { id: 1, phone: '01234567890', email: 'student1@example.com', role: 'student' },
    { id: 2, phone: '01234567891', email: 'student2@example.com', role: 'student' },
    { id: 3, phone: '01111111111', email: 'trainer1@example.com', role: 'trainer' }
  ]
  
  const targetUser = mockUsers.find(u => 
    u.phone === newWarning.value.targetUser || 
    u.email === newWarning.value.targetUser
  )
  
  if (!targetUser) {
    alert('المستخدم غير موجود')
    return
  }
  
  warningsStore.addWarning({
    userId: targetUser.id,
    userType: targetUser.role,
    title: newWarning.value.title,
    message: newWarning.value.message,
    severity: newWarning.value.severity,
    createdBy: authStore.user.email || authStore.user.username
  })
  
  // Reset form
  newWarning.value = {
    targetUser: '',
    title: '',
    message: '',
    severity: ''
  }
  
  alert('تم إرسال التحذير بنجاح!')
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

const getUserName = (userId, userType) => {
  // Mock function to get user name
  const mockUsers = {
    1: 'أحمد محمد',
    2: 'فاطمة علي',
    3: 'د. محمد أحمد'
  }
  return mockUsers[userId] || 'مستخدم غير معروف'
}

const getSeverityText = (severity) => {
  const severityTexts = {
    info: 'إشعار',
    warning: 'تحذير',
    error: 'تحذير شديد'
  }
  return severityTexts[severity] || severity
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const reviewReport = (reportId, status, notes = '') => {
  reportsStore.updateReportStatus(reportId, status, notes, authStore.user.email || authStore.user.username)
  alert(`تم ${status === 'reviewed' ? 'مراجعة' : 'حل'} التبليغ بنجاح!`)
}

const deleteReport = (reportId) => {
  if (confirm('هل أنت متأكد من حذف هذا التبليغ؟')) {
    reportsStore.deleteReport(reportId)
    alert('تم حذف التبليغ بنجاح!')
  }
}

const getSeverityColor = (severity) => {
  const colors = {
    critical: 'border-l-red-500 bg-red-50',
    warning: 'border-l-orange-500 bg-orange-50',
    info: 'border-l-blue-500 bg-blue-50'
  }
  return colors[severity] || colors.info
}
</script>