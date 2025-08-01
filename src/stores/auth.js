import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  // Mock users data
  const mockUsers = [
    {
      id: 1,
      username: 'student1',
      password: '123456',
      studentCode: 'ST001',
      phone: '01234567890',
      email: 'student1@example.com',
      role: 'student',
      name: 'أحمد محمد',
      class: 'first-general',
      className: 'الصف الأول - تخصص عام'
    },
    {
      id: 2,
      username: 'student2',
      password: '123456',
      studentCode: 'ST002',
      phone: '01234567891',
      email: 'student2@example.com',
      role: 'student',
      name: 'فاطمة علي',
      class: 'second-water',
      className: 'الصف الثاني - تخصص مياه شرب'
    },
    {
      id: 5,
      username: 'student3',
      password: '123456',
      studentCode: 'ST003',
      phone: '01234567892',
      email: 'student3@example.com',
      role: 'student',
      name: 'محمد حسن',
      class: 'second-sewage',
      className: 'الصف الثاني - تخصص صرف صحي'
    },
    {
      id: 6,
      username: 'student4',
      password: '123456',
      studentCode: 'ST004',
      phone: '01234567893',
      email: 'student4@example.com',
      role: 'student',
      name: 'سارة أحمد',
      class: 'third-water',
      className: 'الصف الثالث - تخصص مياه شرب'
    },
    {
      id: 7,
      username: 'student5',
      password: '123456',
      studentCode: 'ST005',
      phone: '01234567894',
      email: 'student5@example.com',
      role: 'student',
      name: 'عمر محمود',
      class: 'third-sewage',
      className: 'الصف الثالث - تخصص صرف صحي'
    },
    {
      id: 3,
      username: 'trainer1@example.com',
      phone: '01111111111',
      email: 'trainer1@example.com',
      password: '123456',
      role: 'trainer',
      name: 'د. محمد أحمد',
      specialization: 'مياه الشرب'
    },
    {
      id: 4,
      username: 'admin@example.com',
      phone: '01000000000',
      email: 'admin@example.com',
      password: '123456',
      role: 'admin',
      name: 'مدير المنصة'
    }
  ]

  const login = (identifier, password) => {
    const foundUser = mockUsers.find(u => 
      (u.username === identifier || 
       u.studentCode === identifier || 
       u.phone === identifier || 
       u.email === identifier) && 
      u.password === password
    )
    if (foundUser) {
      user.value = { ...foundUser }
      localStorage.setItem('user', JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const loginWithPhoneOrEmail = (identifier, password) => {
    const foundUser = mockUsers.find(u => 
      (u.phone === identifier || u.email === identifier) && 
      u.password === password
    )
    if (foundUser) {
      user.value = { ...foundUser }
      localStorage.setItem('user', JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const signup = (userData) => {
    // Check if user already exists
    const existingUser = mockUsers.find(u => 
      u.phone === userData.phone || 
      u.email === userData.email ||
      u.username === userData.username
    )
    
    if (existingUser) {
      return { success: false, message: 'رقم الهاتف أو البريد الإلكتروني أو اسم المستخدم مستخدم بالفعل' }
    }

    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      role: 'student',
      studentCode: `ST${Date.now().toString().slice(-6)}`
    }
    
    mockUsers.push(newUser)
    return { success: true, message: 'تم إنشاء الحساب بنجاح' }
  }

  const promoteUser = (identifier, newRole, additionalData = {}) => {
    const userIndex = mockUsers.findIndex(u => 
      u.phone === identifier || 
      u.email === identifier ||
      u.username === identifier
    )
    
    if (userIndex === -1) {
      return { success: false, message: 'المستخدم غير موجود' }
    }
    
    const user = mockUsers[userIndex]
    
    if (user.role === newRole) {
      return { success: false, message: `المستخدم لديه صلاحية ${newRole} بالفعل` }
    }
    
    // Update user role and additional data
    mockUsers[userIndex] = {
      ...user,
      role: newRole,
      ...additionalData
    }
    
    // Update current user if it's the same user
    if (user.value && user.value.id === user.id) {
      user.value = mockUsers[userIndex]
      localStorage.setItem('user', JSON.stringify(mockUsers[userIndex]))
    }
    
    return { success: true, message: `تم ترقية المستخدم إلى ${newRole} بنجاح` }
  }
  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  const initAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    loginWithPhoneOrEmail,
    signup,
    promoteUser,
    logout,
    initAuth
  }
})