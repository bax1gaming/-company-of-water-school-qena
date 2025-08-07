<template>
  <div id="app" class="font-arabic">
    <div v-if="authStore.loading" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div class="text-center">
        <div class="loading-spinner w-12 h-12 mx-auto mb-4"></div>
        <p class="text-gray-600">جاري التحميل...</p>
      </div>
    </div>
    <router-view v-else />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
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