import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReportsStore = defineStore('reports', () => {
  const reports = ref([
    {
      id: 1,
      studentId: 1,
      studentName: 'أحمد محمد',
      studentCode: 'ST001',
      reportedBy: 'trainer1@example.com',
      trainerName: 'د. محمد أحمد',
      reportType: 'behavior', // behavior, attendance, academic
      severity: 'warning', // info, warning, critical
      title: 'سلوك غير مناسب في المحاضرة',
      description: 'الطالب يتحدث بصوت عالي ويقاطع المحاضرة بشكل متكرر',
      actionTaken: 'تم التنبيه شفهياً',
      status: 'pending', // pending, reviewed, resolved
      createdAt: new Date('2024-01-20'),
      reviewedAt: null,
      reviewedBy: null,
      adminNotes: ''
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'فاطمة علي',
      studentCode: 'ST002',
      reportedBy: 'trainer1@example.com',
      trainerName: 'د. محمد أحمد',
      reportType: 'attendance',
      severity: 'info',
      title: 'غياب متكرر',
      description: 'الطالبة غائبة لثلاث محاضرات متتالية بدون عذر',
      actionTaken: 'تم التواصل مع ولي الأمر',
      status: 'reviewed',
      createdAt: new Date('2024-01-18'),
      reviewedAt: new Date('2024-01-19'),
      reviewedBy: 'admin@example.com',
      adminNotes: 'تم التواصل مع الطالبة وحل المشكلة'
    }
  ])

  const addReport = (reportData) => {
    const newReport = {
      id: Date.now(),
      ...reportData,
      status: 'pending',
      createdAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
      adminNotes: ''
    }
    reports.value.push(newReport)
    return newReport
  }

  const updateReportStatus = (reportId, status, adminNotes = '', reviewedBy = '') => {
    const report = reports.value.find(r => r.id === reportId)
    if (report) {
      report.status = status
      report.adminNotes = adminNotes
      report.reviewedBy = reviewedBy
      report.reviewedAt = new Date()
    }
  }

  const deleteReport = (reportId) => {
    const index = reports.value.findIndex(r => r.id === reportId)
    if (index !== -1) {
      reports.value.splice(index, 1)
    }
  }

  const getReportsByTrainer = (trainerEmail) => {
    return reports.value.filter(r => r.reportedBy === trainerEmail)
  }

  const getReportsByStudent = (studentId) => {
    return reports.value.filter(r => r.studentId === studentId)
  }

  const getPendingReportsCount = () => {
    return reports.value.filter(r => r.status === 'pending').length
  }

  const getReportsByStatus = (status) => {
    return reports.value.filter(r => r.status === status)
  }

  return {
    reports,
    addReport,
    updateReportStatus,
    deleteReport,
    getReportsByTrainer,
    getReportsByStudent,
    getPendingReportsCount,
    getReportsByStatus
  }
})