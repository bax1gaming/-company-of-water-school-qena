import { defineStore } from 'pinia'

export const usePlatformStore = defineStore('platform', {
  state: () => ({
    classes: [
      { id: 1, name: 'الصف الأول الثانوي', description: 'مواد الصف الأول الثانوي' },
      { id: 2, name: 'الصف الثاني الثانوي', description: 'مواد الصف الثاني الثانوي' },
      { id: 3, name: 'الصف الثالث الثانوي', description: 'مواد الصف الثالث الثانوي' }
    ],
    videos: [
      {
        id: 1,
        title: 'مقدمة في الرياضيات',
        description: 'شرح أساسيات الرياضيات للصف الأول',
        url: 'https://example.com/video1.mp4',
        duration: '45:30',
        classId: 1,
        category: 'practical',
        uploadedBy: 'trainer1@example.com',
        uploadDate: new Date('2024-01-15')
      },
      {
        id: 2,
        title: 'مراجعة الجبر',
        description: 'مراجعة شاملة لوحدة الجبر',
        url: 'https://example.com/video2.mp4',
        duration: '30:15',
        classId: 1,
        category: 'review',
        uploadedBy: 'trainer1@example.com',
        uploadDate: new Date('2024-01-20')
      },
      {
        id: 3,
        title: 'الفيزياء التطبيقية',
        description: 'تطبيقات عملية في الفيزياء',
        url: 'https://example.com/video3.mp4',
        duration: '52:45',
        classId: 2,
        category: 'practical',
        uploadedBy: 'trainer1@example.com',
        uploadDate: new Date('2024-01-25')
      }
    ],
    files: [
      {
        id: 1,
        title: 'ملخص الرياضيات - الفصل الأول',
        description: 'ملخص شامل لمنهج الرياضيات',
        type: 'pdf',
        size: '2.5 MB',
        url: 'https://example.com/math-summary.pdf',
        classId: 1,
        uploadedBy: 'trainer1@example.com',
        uploadDate: new Date('2024-01-10')
      },
      {
        id: 2,
        title: 'تمارين الفيزياء',
        description: 'مجموعة تمارين محلولة في الفيزياء',
        type: 'docx',
        size: '1.8 MB',
        url: 'https://example.com/physics-exercises.docx',
        classId: 2,
        uploadedBy: 'trainer1@example.com',
        uploadDate: new Date('2024-01-18')
      }
    ],
    selectedClass: null,
    selectedVideo: null,
    announcements: [
      {
        id: 1,
        title: 'مرحباً بكم في المنصة التعليمية',
        content: 'نرحب بجميع الطلاب والمدربين في منصتنا التعليمية الجديدة. نتمنى لكم تجربة تعليمية مثمرة.',
        author: 'الإدارة',
        date: '2024-01-15'
      },
      {
        id: 2,
        title: 'تحديث جدول المحاضرات',
        content: 'تم تحديث جدول المحاضرات للفصل الدراسي الجديد. يرجى مراجعة الجدول الجديد.',
        author: 'الإدارة',
        date: '2024-01-20'
      }
    ]
  }),

  getters: {
    getClassById: (state) => (id) => {
      return state.classes.find(cls => cls.id === id)
    },
    getVideosByClass: (state) => (classId) => {
      return state.videos.filter(video => video.classId === classId)
    },
    getFilesByClass: (state) => (classId) => {
      return state.files.filter(file => file.classId === classId)
    },
    getPracticalVideosByClass: (state) => (classId) => {
      return state.videos.filter(video => 
        video.classId === classId && video.category === 'practical'
      )
    },
    getReviewVideosByClass: (state) => (classId) => {
      return state.videos.filter(video => 
        video.classId === classId && video.category === 'review'
      )
    },
    getTotalVideosCount: (state) => {
      return state.videos.length
    },
    getTotalFilesCount: (state) => {
      return state.files.length
    }
  },

  actions: {
    setSelectedClass(classData) {
      this.selectedClass = classData
    },

    setSelectedVideo(video) {
      this.selectedVideo = video
    },

    addVideo(videoData) {
      const newVideo = {
        id: Date.now(),
        ...videoData,
        uploadDate: new Date()
      }
      this.videos.push(newVideo)
    },

    addFile(fileData) {
      const newFile = {
        id: Date.now(),
        ...fileData,
        uploadDate: new Date()
      }
      this.files.push(newFile)
    },

    deleteVideo(videoId) {
      const index = this.videos.findIndex(video => video.id === videoId)
      if (index !== -1) {
        this.videos.splice(index, 1)
      }
    },

    deleteFile(fileId) {
      const index = this.files.findIndex(file => file.id === fileId)
      if (index !== -1) {
        this.files.splice(index, 1)
      }
    },

    updateVideo(videoId, updatedData) {
      const index = this.videos.findIndex(video => video.id === videoId)
      if (index !== -1) {
        this.videos[index] = { ...this.videos[index], ...updatedData }
      }
    },

    updateFile(fileId, updatedData) {
      const index = this.files.findIndex(file => file.id === fileId)
      if (index !== -1) {
        this.files[index] = { ...this.files[index], ...updatedData }
      }
    },

    addAnnouncement(announcementData) {
      const newAnnouncement = {
        id: Date.now(),
        ...announcementData,
        date: new Date().toLocaleDateString('ar-EG')
      }
      this.announcements.push(newAnnouncement)
    },

    deleteAnnouncement(announcementId) {
      const index = this.announcements.findIndex(announcement => announcement.id === announcementId)
      if (index !== -1) {
        this.announcements.splice(index, 1)
      }
    }
  }
})