<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
      <div class="flex items-center justify-between p-6 border-b">
        <div class="flex items-center space-x-3 rtl:space-x-reverse">
          <AlertTriangle class="w-6 h-6 text-orange-600" />
          <h3 class="text-xl font-semibold text-gray-900">التحذيرات والإشعارات</h3>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <X class="w-6 h-6" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto max-h-96">
        <div v-if="userWarnings.length === 0" class="text-center py-8">
          <Bell class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">لا توجد تحذيرات أو إشعارات</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="warning in userWarnings"
            :key="warning.id"
            class="border rounded-lg p-4 transition-all"
            :class="[
              warning.isRead ? 'bg-gray-50 border-gray-200' : 'bg-white border-l-4',
              warning.severity === 'error' ? 'border-l-red-500' : 
              warning.severity === 'warning' ? 'border-l-orange-500' : 
              'border-l-blue-500'
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                  <component 
                    :is="getWarningIcon(warning.severity)"
                    class="w-5 h-5"
                    :class="[
                      warning.severity === 'error' ? 'text-red-600' : 
                      warning.severity === 'warning' ? 'text-orange-600' : 
                      'text-blue-600'
                    ]"
                  />
                  <h4 class="font-semibold text-gray-900">{{ warning.title }}</h4>
                  <span v-if="!warning.isRead" class="w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <p class="text-gray-700 mb-3">{{ warning.message }}</p>
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <span>{{ formatDate(warning.createdAt) }}</span>
                  <span>من: {{ warning.createdBy }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2 rtl:space-x-reverse mr-4">
                <button
                  v-if="!warning.isRead"
                  @click="markAsRead(warning.id)"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  تم القراءة
                </button>
                <button
                  @click="deleteWarning(warning.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end p-6 border-t bg-gray-50">
        <button
          @click="closeModal"
          class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          إغلاق
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useWarningsStore } from '../stores/warnings'
import { 
  AlertTriangle, 
  Bell, 
  X, 
  Trash2, 
  AlertCircle, 
  Info 
} from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const authStore = useAuthStore()
const warningsStore = useWarningsStore()

const userWarnings = computed(() => {
  if (!authStore.user) return []
  return warningsStore.getWarningsByUser(authStore.user.id, authStore.user.role)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const closeModal = () => {
  emit('close')
}

const markAsRead = (warningId) => {
  warningsStore.markAsRead(warningId)
}

const deleteWarning = (warningId) => {
  if (confirm('هل أنت متأكد من حذف هذا التحذير؟')) {
    warningsStore.deleteWarning(warningId)
  }
}

const getWarningIcon = (severity) => {
  switch (severity) {
    case 'error':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    default:
      return Info
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>