import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { database } from '../lib/supabase'

export const useWarningsStore = defineStore('warnings', () => {
  const warnings = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getWarningsByUser = computed(() => (userId) => {
    return warnings.value.filter(w => w.user_id === userId)
  })

  const getUnreadWarningsCount = computed(() => (userId) => {
    return warnings.value.filter(w => 
      w.user_id === userId && !w.is_read
    ).length
  })

  const loadWarningsForUser = async (userId) => {
    loading.value = true
    try {
      const result = await database.getWarningsForUser(userId)
      if (result.error) {
        error.value = result.error.message
      } else {
        warnings.value = result.data || []
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const addWarning = async (warningData) => {
    try {
      const result = await database.addWarning(warningData)
      if (result.error) {
        error.value = result.error.message
        return null
      } else {
        warnings.value.unshift(result.data)
        return result.data
      }
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  const markAsRead = async (warningId) => {
    try {
      const result = await database.markWarningAsRead(warningId)
      if (result.error) {
        error.value = result.error.message
        return false
      } else {
        const index = warnings.value.findIndex(w => w.id === warningId)
        if (index !== -1) {
          warnings.value[index].is_read = true
        }
        return true
      }
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  const deleteWarning = (warningId) => {
    const index = warnings.value.findIndex(w => w.id === warningId)
    if (index !== -1) {
      warnings.value.splice(index, 1)
    }
  }

  return {
    warnings,
    loading,
    error,
    getWarningsByUser,
    getUnreadWarningsCount,
    loadWarningsForUser,
    addWarning,
    markAsRead,
    deleteWarning
  }
})