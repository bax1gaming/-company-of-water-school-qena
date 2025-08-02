<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <div class="flex items-center space-x-3 rtl:space-x-reverse mb-6">
      <component :is="icon" class="w-6 h-6 text-blue-600" />
      <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
    </div>
    
    <div class="space-y-4">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  icon: Object
})
</script>