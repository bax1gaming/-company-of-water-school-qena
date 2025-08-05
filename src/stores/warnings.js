import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWarningsStore = defineStore('warnings', () => {
  const warnings = ref([
    {
      id: 1,
      userId: 1,
      userType: 'student',
      title: 'تحذير بخصوص الحضور',
      message: 'لقد تم رصد غيابات متكررة في المحاضرات. يرجى الالتزام بالحضور.',
      severity: 'warning', // info, warning, error
      isRead: false,
      createdAt: new Date('2024-01-20'),
      createdBy: 'admin@example.com'
    },
    {
      id: 2,
      userId: 2,
      userType: 'student',
      title: 'إشعار هام',
      message: 'يرجى مراجعة الإدارة لاستكمال الأوراق المطلوبة.',
      severity: 'info',
      isRead: true,
      createdAt: new Date('2024-01-18'),
      createdBy: 'admin@example.com'
    }
  ])

  const addWarning = (warningData) => {
    const newWarning = {
      id: Date.now(),
      ...warningData,
      isRead: false,
      createdAt: new Date()
    }
    warnings.value.push(newWarning)
    return newWarning
  }

  const markAsRead = (warningId) => {
    const warning = warnings.value.find(w => w.id === warningId)
    if (warning) {
      warning.isRead = true
    }
  }

  const deleteWarning = (warningId) => {
    const index = warnings.value.findIndex(w => w.id === warningId)
    if (index !== -1) {
      warnings.value.splice(index, 1)
    }
  }

  const getWarningsByUser = (userId, userType) => {
    return warnings.value.filter(w => w.userId === userId && w.userType === userType)
  }

  const getUnreadWarningsCount = (userId, userType) => {
    return warnings.value.filter(w => 
      w.userId === userId && 
      w.userType === userType && 
      !w.isRead
    ).length
  }

  return {
    warnings,
    addWarning,
    markAsRead,
    deleteWarning,
    getWarningsByUser,
    getUnreadWarningsCount
  }
})