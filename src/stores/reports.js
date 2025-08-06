import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { database } from '../lib/supabase'

export const useReportsStore = defineStore('reports', () => {
  const reports = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getPendingReportsCount = computed(() => {
    return reports.value.filter(r => r.status === 'pending').length
  })

  const getReportsByTrainer = computed(() => (trainerId) => {
    return reports.value.filter(r => r.reported_by === trainerId)
  })

  const getReportsByStudent = computed(() => (studentId) => {
    return reports.value.filter(r => r.student_id === studentId)
  })

  const getReportsByStatus = computed(() => (status) => {
    return reports.value.filter(r => r.status === status)
  })

  const loadReports = async () => {
    loading.value = true
    try {
      const result = await database.getReports()
      if (result.error) {
        error.value = result.error.message
      } else {
        reports.value = result.data || []
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const addReport = async (reportData) => {
    try {
      const result = await database.addReport(reportData)
      if (result.error) {
        error.value = result.error.message
        return null
      } else {
        reports.value.unshift(result.data)
        return result.data
      }
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  const updateReportStatus = async (reportId, status, adminNotes = '', reviewedBy = '') => {
    try {
      const result = await database.updateReportStatus(reportId, status, adminNotes, reviewedBy)
      if (result.error) {
        error.value = result.error.message
        return false
      } else {
        const index = reports.value.findIndex(r => r.id === reportId)
        if (index !== -1) {
          reports.value[index] = result.data
        }
        return true
      }
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  const deleteReport = (reportId) => {
    const index = reports.value.findIndex(r => r.id === reportId)
    if (index !== -1) {
      reports.value.splice(index, 1)
    }
  }

  return {
    reports,
    loading,
    error,
    getPendingReportsCount,
    getReportsByTrainer,
    getReportsByStudent,
    getReportsByStatus,
    loadReports,
    addReport,
    updateReportStatus,
    deleteReport
  }
})