<template>
  <div class="class-view">
    <div class="class-header">
      <button @click="goBack" class="back-btn">
        <i class="fas fa-arrow-right"></i>
        العودة
      </button>
      <h1>{{ selectedClass?.name }}</h1>
    </div>

    <!-- تبويبات الأقسام -->
    <div class="tabs">
      <button 
        v-for="section in sections" 
        :key="section.id"
        @click="activeSection = section.id"
        :class="['tab', { active: activeSection === section.id }]"
      >
        <i :class="section.icon"></i>
        {{ section.name }}
      </button>
    </div>

    <!-- محتوى القسم النشط -->
    <div class="section-content">
      <!-- قسم الفيديوهات العملي -->
      <div v-if="activeSection === 'practical'" class="videos-section">
        <h2>فيديوهات عملي</h2>
        <div v-if="practicalVideos.length === 0" class="no-content">
          <i class="fas fa-video"></i>
          <p>لا توجد فيديوهات عملي متاحة حالياً</p>
        </div>
        <div v-else class="videos-grid">
          <div 
            v-for="video in practicalVideos" 
            :key="video.id"
            @click="playVideo(video)"
            class="video-card"
          >
            <div class="video-thumbnail">
              <i class="fas fa-play"></i>
            </div>
            <div class="video-info">
              <h3>{{ video.title }}</h3>
              <p>{{ video.description }}</p>
              <span class="video-duration">{{ video.duration }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- قسم فيديوهات المراجعة -->
      <div v-if="activeSection === 'review'" class="videos-section">
        <h2>فيديوهات مراجعة</h2>
        <div v-if="reviewVideos.length === 0" class="no-content">
          <i class="fas fa-video"></i>
          <p>لا توجد فيديوهات مراجعة متاحة حالياً</p>
        </div>
        <div v-else class="videos-grid">
          <div 
            v-for="video in reviewVideos" 
            :key="video.id"
            @click="playVideo(video)"
            class="video-card"
          >
            <div class="video-thumbnail">
              <i class="fas fa-play"></i>
            </div>
            <div class="video-info">
              <h3>{{ video.title }}</h3>
              <p>{{ video.description }}</p>
              <span class="video-duration">{{ video.duration }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- قسم الملفات والملخصات -->
      <div v-if="activeSection === 'files'" class="files-section">
        <h2>ملفات وملخصات</h2>
        <div v-if="classFiles.length === 0" class="no-content">
          <i class="fas fa-file-alt"></i>
          <p>لا توجد ملفات أو ملخصات متاحة حالياً</p>
        </div>
        <div v-else class="files-grid">
          <div 
            v-for="file in classFiles" 
            :key="file.id"
            @click="downloadFile(file)"
            class="file-card"
          >
            <div class="file-icon">
              <i :class="getFileIcon(file.file_type)"></i>
            </div>
            <div class="file-info">
              <h3>{{ file.title }}</h3>
              <p>{{ file.description }}</p>
              <span class="file-size">{{ file.file_size }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlatformStore } from '../stores/platform'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const platformStore = usePlatformStore()
const authStore = useAuthStore()

const activeSection = ref('practical')
const sections = [
  { id: 'practical', name: 'فيديوهات عملي', icon: 'fas fa-laptop-code' },
  { id: 'review', name: 'فيديوهات مراجعة', icon: 'fas fa-redo' },
  { id: 'files', name: 'ملفات وملخصات', icon: 'fas fa-file-alt' }
]

const selectedClass = computed(() => {
  return platformStore.getClassById(route.params.classId)
})

const practicalVideos = computed(() => {
  return platformStore.videos.filter(video => 
    video.class_id === route.params.classId && 
    video.category === 'practical'
  )
})

const reviewVideos = computed(() => {
  return platformStore.videos.filter(video => 
    video.class_id === route.params.classId && 
    video.category === 'review'
  )
})

const classFiles = computed(() => {
  return platformStore.files.filter(file => 
    file.class_id === route.params.classId
  )
})

const goBack = () => {
  router.push('/student')
}

const playVideo = (video) => {
  router.push(`/video/${video.id}`)
}

const downloadFile = (file) => {
  // تنفيذ تحميل الملف
  console.log('تحميل الملف:', file.title)
  if (file.url) {
    window.open(file.url, '_blank')
  }
}

const getFileIcon = (fileType) => {
  const icons = {
    pdf: 'fas fa-file-pdf',
    doc: 'fas fa-file-word',
    docx: 'fas fa-file-word',
    ppt: 'fas fa-file-powerpoint',
    pptx: 'fas fa-file-powerpoint',
    txt: 'fas fa-file-alt',
    default: 'fas fa-file'
  }
  return icons[fileType] || icons.default
}

onMounted(async () => {
  // تحميل البيانات إذا لم تكن محملة
  if (platformStore.videos.length === 0) {
    await platformStore.loadVideos()
  }
  if (platformStore.files.length === 0) {
    await platformStore.loadFiles()
  }
})
</script>

<style scoped>
.class-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.class-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.back-btn {
  background: #6366f1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background: #5856eb;
}

.class-header h1 {
  color: #1f2937;
  margin: 0;
  font-size: 28px;
}

.tabs {
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 30px;
  gap: 10px;
}

.tab {
  background: none;
  border: none;
  padding: 15px 25px;
  cursor: pointer;
  font-size: 16px;
  color: #6b7280;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab:hover {
  color: #6366f1;
  background: #f8fafc;
}

.tab.active {
  color: #6366f1;
  border-bottom-color: #6366f1;
  background: #f8fafc;
}

.section-content {
  min-height: 400px;
}

.videos-section h2,
.files-section h2 {
  color: #1f2937;
  margin-bottom: 20px;
  font-size: 24px;
}

.no-content {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.no-content i {
  font-size: 48px;
  margin-bottom: 15px;
  display: block;
}

.videos-grid,
.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.video-card,
.file-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.video-card:hover,
.file-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.video-thumbnail {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  height: 120px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.video-thumbnail i {
  color: white;
  font-size: 32px;
}

.file-icon {
  background: linear-gradient(135deg, #10b981, #059669);
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.file-icon i {
  color: white;
  font-size: 28px;
}

.video-info h3,
.file-info h3 {
  color: #1f2937;
  margin: 0 0 8px 0;
  font-size: 18px;
}

.video-info p,
.file-info p {
  color: #6b7280;
  margin: 0 0 10px 0;
  font-size: 14px;
  line-height: 1.5;
}

.video-duration,
.file-size {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .class-view {
    padding: 15px;
  }
  
  .tabs {
    flex-direction: column;
    gap: 5px;
  }
  
  .tab {
    text-align: center;
    padding: 12px 20px;
  }
  
  .videos-grid,
  .files-grid {
    grid-template-columns: 1fr;
  }
}
</style>