import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlatformStore = defineStore('platform', () => {
  const announcements = ref([
    {
      id: 1,
      title: 'إعلان هام: بداية الفصل الدراسي الجديد',
      content: 'يسعدنا أن نعلن عن بداية الفصل الدراسي الجديد. نتمنى لجميع الطلاب التوفيق والنجاح.',
      date: '2025-01-15',
      author: 'إدارة المنصة'
    },
    {
      id: 2,
      title: 'تحديث المناهج الدراسية',
      content: 'تم تحديث المناهج الدراسية لتواكب أحدث التطورات في مجال مياه الشرب والصرف الصحي.',
      date: '2025-01-10',
      author: 'إدارة المنصة'
    }
  ])

  const classes = ref([
    {
      id: 'first-general',
      name: 'الصف الأول - تخصص عام',
      description: 'المبادئ الأساسية في هندسة المياه والصرف الصحي',
      students: 45,
      sections: {
        practical: {
          name: 'فيديوهات عملي',
          videos: [
            {
              id: 1,
              title: 'مقدمة في هندسة المياه - عملي',
              duration: '45:30',
              uploadDate: '2025-01-10',
              trainer: 'د. محمد أحمد',
              section: 'practical'
            }
          ]
        },
        review: {
          name: 'فيديوهات مراجعة',
          videos: [
            {
              id: 2,
              title: 'مراجعة أساسيات الصرف الصحي',
              duration: '38:15',
              uploadDate: '2025-01-08',
              trainer: 'د. سارة محمود',
              section: 'review'
            }
          ]
        },
        files: {
          name: 'ملفات وملخصات',
          files: [
            {
              id: 1,
              title: 'ملخص المبادئ الأساسية',
              type: 'pdf',
              uploadDate: '2025-01-05',
              trainer: 'د. محمد أحمد'
            }
          ]
        }
      }
    },
    {
      id: 'second-water',
      name: 'الصف الثاني - تخصص مياه شرب',
      description: 'تقنيات معالجة وتوزيع مياه الشرب',
      students: 32,
      sections: {
        practical: {
          name: 'فيديوهات عملي',
          videos: [
            {
              id: 3,
              title: 'عمليات معالجة المياه - عملي',
              duration: '52:20',
              uploadDate: '2025-01-12',
              trainer: 'د. أحمد علي',
              section: 'practical'
            }
          ]
        },
        review: {
          name: 'فيديوهات مراجعة',
          videos: []
        },
        files: {
          name: 'ملفات وملخصات',
          files: []
        }
      }
    },
    {
      id: 'second-sewage',
      name: 'الصف الثاني - تخصص صرف صحي',
      description: 'أنظمة جمع ومعالجة مياه الصرف الصحي',
      students: 28,
      sections: {
        practical: {
          name: 'فيديوهات عملي',
          videos: [
            {
              id: 4,
              title: 'تصميم شبكات الصرف الصحي - عملي',
              duration: '41:45',
              uploadDate: '2025-01-11',
              trainer: 'د. فاطمة حسن',
              section: 'practical'
            }
          ]
        },
        review: {
          name: 'فيديوهات مراجعة',
          videos: []
        },
        files: {
          name: 'ملفات وملخصات',
          files: []
        }
      }
    },
    {
      id: 'third-water',
      name: 'الصف الثالث - تخصص مياه شرب',
      description: 'تخصص مياه شرب - المستوى المتقدم',
      students: 25,
      sections: {
        practical: {
          name: 'فيديوهات عملي',
          videos: []
        },
        review: {
          name: 'فيديوهات مراجعة',
          videos: []
        },
        files: {
          name: 'ملفات وملخصات',
          files: []
        }
      }
    },
    {
      id: 'third-sewage',
      name: 'الصف الثالث - تخصص صرف صحي',
      description: 'تخصص صرف صحي - المستوى المتقدم',
      students: 22,
      sections: {
        practical: {
          name: 'فيديوهات عملي',
          videos: []
        },
        review: {
          name: 'فيديوهات مراجعة',
          videos: []
        },
        files: {
          name: 'ملفات وملخصات',
          files: []
        }
      }
    }
  ])

  // Legacy support - get all videos from all sections
  const getAllVideosForClass = (classData) => {
    if (!classData.sections) return classData.videos || []
    
    const allVideos = []
    if (classData.sections.practical?.videos) {
      allVideos.push(...classData.sections.practical.videos)
    }
    if (classData.sections.review?.videos) {
      allVideos.push(...classData.sections.review.videos)
    }
    return allVideos
  }

  // Update classes to include legacy videos property for backward compatibility
  classes.value.forEach(cls => {
    if (!cls.videos) {
      cls.videos = getAllVideosForClass(cls)
    }
  })

  const addVideo = (classId, video) => {
    const classIndex = classes.value.findIndex(c => c.id === classId)
    if (classIndex !== -1) {
      const newVideo = {
        id: Date.now(),
        ...video,
        uploadDate: new Date().toISOString().split('T')[0]
      }
      
      // Add to appropriate section
      const section = video.section || 'practical'
      if (!classes.value[classIndex].sections[section]) {
        classes.value[classIndex].sections[section] = { videos: [] }
      }
      if (!classes.value[classIndex].sections[section].videos) {
        classes.value[classIndex].sections[section].videos = []
      }
      
      classes.value[classIndex].sections[section].videos.push(newVideo)
      
      // Update legacy videos array
      classes.value[classIndex].videos = getAllVideosForClass(classes.value[classIndex])
    }
  }

  const addFile = (classId, file) => {
    const classIndex = classes.value.findIndex(c => c.id === classId)
    if (classIndex !== -1) {
      const newFile = {
        id: Date.now(),
        ...file,
        uploadDate: new Date().toISOString().split('T')[0]
      }
      
      if (!classes.value[classIndex].sections.files) {
        classes.value[classIndex].sections.files = { files: [] }
      }
      if (!classes.value[classIndex].sections.files.files) {
        classes.value[classIndex].sections.files.files = []
      }
      
      classes.value[classIndex].sections.files.files.push(newFile)
    }
  }
  ])

  const addAnnouncement = (announcement) => {
    announcements.value.unshift({
      id: Date.now(),
      ...announcement,
      date: new Date().toISOString().split('T')[0]
    })
  }


  const getClassById = (id) => {
    return classes.value.find(c => c.id === id)
  }

  const getVideoById = (id) => {
    for (const cls of classes.value) {
      const video = cls.videos.find(v => v.id == id)
      if (video) return video
    }
    return null
  }

  return {
    announcements,
    classes,
    addAnnouncement,
    addVideo,
    addFile,
    getClassById,
    getVideoById
  }
})