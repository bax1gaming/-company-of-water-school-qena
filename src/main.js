import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

// تأكد من وجود العنصر قبل إنشاء التطبيق
const mountElement = document.getElementById('app')
if (!mountElement) {
  console.error('Could not find #app element')
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// إضافة معالج للأخطاء
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue error:', err, info)
}

app.mount('#app')