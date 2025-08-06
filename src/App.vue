<template>
  <div id="app" class="font-arabic">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { usePlatformStore } from './stores/platform'

const authStore = useAuthStore()
const platformStore = usePlatformStore()

onMounted(() => {
  authStore.initAuth()
  // تحميل البيانات الأساسية
  platformStore.loadClasses()
})
</script>

<style>
.font-arabic {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
  text-align: right;
}

* {
  box-sizing: border-box;
}
</style>