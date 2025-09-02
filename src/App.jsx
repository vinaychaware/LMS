import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/useAuthStore'
import Navbar from './components/layout/Navbar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import CourseCatalogPage from './pages/CourseCatalogPage'
import StudentDashboardPage from './pages/StudentDashboardPage'
import InstructorDashboardPage from './pages/InstructorDashboardPage'
import CreateCoursePage from './pages/CreateCoursePage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import SuperAdminDashboardPage from './pages/SuperAdminDashboardPage'
import CourseViewerPage from './pages/CourseViewerPage'
import RegisterPage from './pages/RegisterPage'

// ✅ Import Terms & Privacy pages
import Terms from './pages/TermsPage'
import Privacy from './pages/PrivacyPage'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, userRole } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

// Public Route Component (redirects authenticated users)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useAuthStore()
  
  if (isAuthenticated) {
    if (userRole === 'superadmin') {
      return <Navigate to="/superadmin" replace />
    } else if (userRole === 'admin') {
      return <Navigate to="/admin" replace />
    } else if (userRole === 'instructor') {
      return <Navigate to="/instructor" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }
  
  return children
}

const App = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="App">
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CourseCatalogPage />} />

        {/* Legal Pages */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />
      
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/instructor" 
          element={
            <ProtectedRoute allowedRoles={['instructor','admin']}>
              <InstructorDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/courses/:courseId" 
          element={
            <ProtectedRoute allowedRoles={['student','instructor','admin']}>
              <CourseViewerPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/courses/create" 
          element={
            <ProtectedRoute allowedRoles={['instructor','admin']}>
              <CreateCoursePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/superadmin" 
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
