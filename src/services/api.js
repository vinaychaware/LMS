// src/services/api.js
import axios from 'axios'
import useAuthStore from '../store/useAuthStore'


const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'


export const FALLBACK_THUMB =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">
       <rect width="100%" height="100%" fill="#e5e7eb"/>
       <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
             font-family="Arial" font-size="28" fill="#6b7280">Course</text>
     </svg>`
  )


export const makeHeaders = () => {
  const token = useAuthStore.getState().token
  const h = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  }
  if (token) h.Authorization = `Bearer ${token}`
  return h
}


const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
})


api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`


  config.headers['Cache-Control'] = 'no-cache'
  config.headers['Pragma'] = 'no-cache'
  config.headers['Expires'] = '0'
  return config
})


api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      useAuthStore.getState().logout?.()

      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)


export async function fileToBase64(file) {
  if (!file) return ''
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file) 
  })
}


export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  profile: () => api.get('/auth/profile'),
}

export const coursesAPI = {
  list: () => api.get('/courses'),
  get: (id) => api.get(`/courses/${id}`),


  create: (payload) => api.post('/courses', payload),

 
  createFull: (payload) => api.post('/courses/full', payload),

  update: (id, payload) => api.patch(`/courses/${id}`, payload),
  setInstructors: (id, instructorIds) =>
    api.post(`/courses/${id}/instructors`, { instructorIds }),
}

export const chaptersAPI = {
  listByCourse: (courseId) => api.get('/chapters', { params: { courseId } }),
  create: (courseId, payload) => api.post(`/courses/${courseId}/chapters`, payload),
  update: (id, payload) => api.patch(`/chapters/${id}`, payload),
  remove: (id) => api.delete(`/chapters/${id}`),
}

export const assessmentsAPI = {
  listByChapter: (chapterId) => api.get('/assessments', { params: { chapterId } }),
  get: (id) => api.get(`/assessments/${id}`),
  createForChapter: (chapterId, payload) =>
    api.post(`/chapters/${chapterId}/assessments`, payload),
  update: (id, payload) => api.patch(`/assessments/${id}`, payload),
  remove: (id) => api.delete(`/assessments/${id}`),
}

export default api
