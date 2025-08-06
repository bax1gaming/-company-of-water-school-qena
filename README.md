# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## النشر على Vercel

### الخطوات المطلوبة:

1. **ربط المشروع بـ Vercel:**
   - قم بإنشاء حساب على [Vercel](https://vercel.com)
   - اربط مستودع GitHub الخاص بك
   - استورد المشروع إلى Vercel

2. **إعداد متغيرات البيئة:**
   في لوحة تحكم Vercel، أضف المتغيرات التالية:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **إعداد Supabase:**
   - قم بإنشاء مشروع جديد على [Supabase](https://supabase.com)
   - انسخ URL المشروع والمفتاح العام
   - قم بتشغيل الـ migrations الموجودة في مجلد `supabase/migrations`

4. **النشر:**
   - Vercel سيقوم بالنشر تلقائياً عند كل push إلى الفرع الرئيسي
   - يمكنك أيضاً النشر يدوياً من لوحة التحكم

### الميزات المدعومة:
- ✅ Single Page Application (SPA) routing
- ✅ Static asset optimization
- ✅ Environment variables
- ✅ Automatic deployments
- ✅ Preview deployments for pull requests