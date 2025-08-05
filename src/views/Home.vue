<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-10 animate-pulse" style="animation-delay: 2s;"></div>
    </div>

    <!-- Header -->
    <header class="glass-morphism shadow-xl relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div class="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg glow-effect icon-bounce">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c1 0 2 1 2 2 0 1.5-1 3-2 4-1-1-2-2.5-2-4 0-1 1-2 2-2zm0 6c2 0 4 1.5 4 4 0 3-2 6-4 8-2-2-4-5-4-8 0-2.5 2-4 4-4z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gradient">المنصة الرسمية</h1>
              <p class="text-sm text-gray-700 font-medium">لطلاب مياه الشرب والصرف الصحي بقنا</p>
            </div>
          </div>
          <router-link
            to="/login"
            class="btn-gradient-primary hover-lift"
          >
            <span>تسجيل الدخول</span>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="py-20 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-5xl font-bold text-gradient mb-8 float-animation">
          منصة التعلم الإلكتروني المتطورة
        </h2>
        <p class="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
          منصة شاملة لتعليم طلاب مياه الشرب والصرف الصحي بأحدث الطرق التعليمية والتقنيات المتقدمة
        </p>
        <div class="grid md:grid-cols-3 gap-8 mt-16">
          <div class="card-enhanced p-8 hover-lift">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg glow-effect">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-800">تعليم متخصص</h3>
            <p class="text-gray-600 leading-relaxed">مناهج متخصصة في مياه الشرب والصرف الصحي بأحدث المعايير العالمية</p>
          </div>
          <div class="card-enhanced p-8 hover-lift" style="animation-delay: 0.2s;">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg glow-effect">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-800">محتوى مرئي</h3>
            <p class="text-gray-600 leading-relaxed">فيديوهات تعليمية عالية الجودة مع تقنيات تفاعلية حديثة</p>
          </div>
          <div class="card-enhanced p-8 hover-lift" style="animation-delay: 0.4s;">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg glow-effect">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2 1l-3 4v2h2l2.54-3.4L16.5 18H20zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 2h-2C3.57 8 2.5 9.57 2.5 11.5V22h2v-6h2v6h2v-6.5c0-1.93-1.07-3.5-2.5-3.5z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-800">تفاعل مباشر</h3>
            <p class="text-gray-600 leading-relaxed">تواصل مباشر مع المدربين والزملاء في بيئة تعليمية تفاعلية</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Classes Overview -->
    <section class="py-20 glass-morphism relative z-10 mx-4 rounded-3xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 class="text-4xl font-bold text-center text-gradient mb-16">الصفوف الدراسية</h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="card-enhanced p-8 bg-gradient-to-br from-blue-50 to-blue-100 hover-lift">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
              <span class="text-white font-bold text-lg">١</span>
            </div>
            <h4 class="text-xl font-bold text-blue-900 mb-3">الصف الأول</h4>
            <p class="text-blue-700 leading-relaxed">تخصص عام - المبادئ الأساسية والمفاهيم الجوهرية</p>
          </div>
          <div class="card-enhanced p-8 bg-gradient-to-br from-cyan-50 to-cyan-100 hover-lift" style="animation-delay: 0.2s;">
            <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg mb-4 flex items-center justify-center">
              <span class="text-white font-bold text-lg">٢</span>
            </div>
            <h4 class="text-xl font-bold text-cyan-900 mb-3">الصف الثاني</h4>
            <p class="text-cyan-700 leading-relaxed">تخصص مياه شرب وصرف صحي - التطبيقات العملية</p>
          </div>
          <div class="card-enhanced p-8 bg-gradient-to-br from-teal-50 to-teal-100 hover-lift" style="animation-delay: 0.4s;">
            <div class="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg mb-4 flex items-center justify-center">
              <span class="text-white font-bold text-lg">٣</span>
            </div>
            <h4 class="text-xl font-bold text-teal-900 mb-3">الصف الثالث</h4>
            <p class="text-teal-700 leading-relaxed">التخصص المتقدم - الخبرة والاحترافية</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white py-16 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center glow-effect">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2c1 0 2 1 2 2 0 1.5-1 3-2 4-1-1-2-2.5-2-4 0-1 1-2 2-2zm0 6c2 0 4 1.5 4 4 0 3-2 6-4 8-2-2-4-5-4-8 0-2.5 2-4 4-4z"/>
            </svg>
          </div>
          <h4 class="text-xl font-bold">المنصة الرسمية لطلاب مياه الشرب والصرف الصحي بقنا</h4>
        </div>
        <p class="text-gray-300 text-lg">جميع الحقوق محفوظة © 2025</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// تم إزالة استيراد الأيقونات واستبدالها بـ SVG مباشرة
</script>