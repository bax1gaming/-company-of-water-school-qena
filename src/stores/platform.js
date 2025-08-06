import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { database } from '../lib/supabase'

export const usePlatformStore = defineStore('platform', () => {
  const classes = ref([])
  const videos = ref([])
  const files = ref([])
  const announcements = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const getClassById = computed(() => (id) => {
    return classes.value.find(cls => cls.id === id)
  })

  const getVideosByClass = computed(() => (classId) => {
    return videos.value.filter(video => video.class_id === classId)
  })

  const getFilesByClass = computed(() => (classId) => {
    return files.value.filter(file => file.class_id === classId)
  })

  const getPracticalVideosByClass = computed(() => (classId) => {
    return videos.value.filter(video => 
      video.class_id === classId && video.category === 'practical'
    )
  })

  const getReviewVideosByClass = computed(() => (classId) => {
    return videos.value.filter(video => 
      video.class_id === classId && video.category === 'review'
    )
  })

  const getTotalVideosCount = computed(() => videos.value.length)
  const getTotalFilesCount = computed(() => files.value.length)

  // Actions
  const loadClasses = async () => {
    loading.value = true
    try {
      const result = await database.getClasses()
      if (result.error) {
        error.value = result.error.message
      } else {
        classes.value = result.data || []
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const loadVideos = async () => {
    loading.value = true
    try {
      const result = await database.getAllVideos()
      if (result.error) {
        error.value = result.error.message
      } else {
        videos.value = result.data || []
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const loadFiles = async () => {
    loading.value = true
    try {
      // نحتاج لتحميل الملفات من جميع الصفوف
      const classesResult = await database.getClasses()
      if (classesResult.data) {
        const allFiles = []
        for (const cls of classesResult.data) {
          const filesResult = await database.getFilesByClass(cls.id)
          if (filesResult.data) {
            allFiles.push(...filesResult.data)
          }
        }
        files.value = allFiles
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const loadAnnouncements = async () => {
    loading.value = true
    try {
      const result = await database.getAnnouncements()
      if (result.error) {
        error.value = result.error.message
      } else {
        announcements.value = result.data || []
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const addVideo = async (videoData) => {
    try {
      const result = await database.addVideo(videoData)
      if (result.error) {
        error.value = result.error.message
        return false
      } else {
        videos.value.unshift(result.data)
        return true
      }
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  const addFile = async (fileData) => {
    try {
      const result = await database.addFile(fileData)
      if (result.error) {
        error.value = result.error.message
        return false
      } else {
        files.value.unshift(result.data)
        return true
      }
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  const addAnnouncement = async (announcementData) => {
    try {
      const result = await database.addAnnouncement(announcementData)
      if (result.error) {
        error.value = result.error.message
        return false
      } else {
        announcements.value.unshift(result.data)
        return true
      }
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  const deleteAnnouncement = async (id) => {
    try {
      const result = await database.deleteAnnouncement(id)
      if (result.error) {
        error.value = result.error.message
        return false
      } else {
        announcements.value = announcements.value.filter(a => a.id !== id)
        return true
      }
    } catch (err) {
      error.value = err.message
      return false
    }
  }

  // تحميل جميع البيانات
  const loadAllData = async () => {
    await Promise.all([
      loadClasses(),
      loadVideos(),
      loadFiles(),
      loadAnnouncements()
    ])
  }

  return {
    classes,
    videos,
    files,
    announcements,
    loading,
    error,
    getClassById,
    getVideosByClass,
    getFilesByClass,
    getPracticalVideosByClass,
    getReviewVideosByClass,
    getTotalVideosCount,
    getTotalFilesCount,
    loadClasses,
    loadVideos,
    loadFiles,
    loadAnnouncements,
    loadAllData,
    addVideo,
    addFile,
    addAnnouncement,
    deleteAnnouncement
  }
})