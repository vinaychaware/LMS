import axios from 'axios'
import { mockAPI, mockData } from './mockData'
import useAuthStore from '../store/useAuthStore'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  profile: () => api.get('/auth/profile'),
}

// Course API calls
export const courseAPI = {
  getAll: async () => {
    // Use mock data for development
    await mockAPI.delay(800)
    return { data: mockData.courses }
  },
  getById: (id) => api.get(`/courses/${id}`),
  create: (courseData) => api.post('/courses', courseData),
  update: (id, courseData) => api.put(`/courses/${id}`, courseData),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (courseId) => api.post(`/courses/${courseId}/enroll`),
  getEnrolled: async () => {
    // Use mock data for development
    const userId = useAuthStore.getState().user?.id
    if (!userId) return { data: [] }
    
    const enrollments = await mockAPI.getStudentEnrollments(userId)
    return { data: enrollments }
  },
  getTeaching: () => api.get('/courses/teaching'),
}

// Lesson API calls
export const lessonAPI = {
  getByCourse: (courseId) => api.get(`/courses/${courseId}/lessons`),
  create: (courseId, lessonData) => api.post(`/courses/${courseId}/lessons`, lessonData),
  update: (id, lessonData) => api.put(`/lessons/${id}`, lessonData),
  delete: (id) => api.delete(`/lessons/${id}`),
  markComplete: (id) => api.post(`/lessons/${id}/complete`),
}

// Assignment API calls
export const assignmentAPI = {
  getByCourse: (courseId) => api.get(`/courses/${courseId}/assignments`),
  create: (courseId, assignmentData) => api.post(`/courses/${courseId}/assignments`, assignmentData),
  update: (id, assignmentData) => api.put(`/assignments/${id}`, assignmentData),
  delete: (id) => api.delete(`/assignments/${id}`),
  submit: (id, submissionData) => api.post(`/assignments/${id}/submit`, submissionData),
  getSubmissions: (id) => api.get(`/assignments/${id}/submissions`),
  grade: (id, submissionId, gradeData) => api.post(`/assignments/${id}/submissions/${submissionId}/grade`, gradeData),
}

// Quiz API calls
export const quizAPI = {
  getByCourse: (courseId) => api.get(`/courses/${courseId}/quizzes`),
  create: (courseId, quizData) => api.post(`/courses/${courseId}/quizzes`, quizData),
  update: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
  delete: (id) => api.delete(`/quizzes/${id}`),
  take: (id, answers) => api.post(`/quizzes/${id}/take`, answers),
  getResults: (id) => api.get(`/quizzes/${id}/results`),
}

// User API calls
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
}

export default api
