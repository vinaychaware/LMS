import React, { useState, useEffect } from 'react'
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Shield, 
  Settings, 
  UserPlus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  Activity,
  Globe,
  Database,
  Server,
  UserCheck,
  UserX,
  BookMarked,
  FileText,
  Brain,
  Award,
  Clock,
  Target,
  PieChart,
  TrendingDown,
  PlayCircle,
  Pause,
  Play,
  Square
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { mockAPI, mockData } from '../services/mockData'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Progress from '../components/ui/Progress'

const AdminDashboardPage = () => {
  const [systemStats, setSystemStats] = useState({})
  const [allUsers, setAllUsers] = useState([])
  const [allCourses, setAllCourses] = useState([])
  const [allModules, setAllModules] = useState([])
  const [systemAlerts, setSystemAlerts] = useState([])
  const [instructorPermissions, setInstructorPermissions] = useState({})
  const [loading, setLoading] = useState(true)
  const [showUsersModal, setShowUsersModal] = useState(false)
  const [showCoursesModal, setShowCoursesModal] = useState(false)
  const [showSystemModal, setShowSystemModal] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [courseSearchTerm, setCourseSearchTerm] = useState('')
  const [courseStatusFilter, setCourseStatusFilter] = useState('all')
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'student',
    instructorId: ''
  })

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      
      // Get system analytics
      const analytics = await mockAPI.getSystemAnalytics()
      setSystemStats(analytics)
      
      // Get all users
      setAllUsers(mockData.users)
      
      // Get all courses
      setAllCourses(mockData.courses)
      
      // Get all modules
      setAllModules(mockData.modules)
      
      // Get system alerts
      setSystemAlerts(mockData.systemAlerts || [])
      
      // Get instructor permissions
      setInstructorPermissions(mockData.systemSettings.instructorPermissions)
      
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId, action) => {
    try {
      const user = allUsers.find(u => u.id === userId)
      if (!user) throw new Error('User not found')
      
      switch (action) {
        case 'activate':
          await mockAPI.updateUser(userId, { isActive: true })
          setAllUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, isActive: true } : u
          ))
          toast.success(`${user.name} activated successfully`)
          break
        case 'deactivate':
          await mockAPI.updateUser(userId, { isActive: false })
          setAllUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, isActive: false } : u
          ))
          toast.success(`${user.name} deactivated successfully`)
          break
        case 'verify':
          await mockAPI.updateUser(userId, { isVerified: true })
          setAllUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, isVerified: true } : u
          ))
          toast.success(`${user.name} verified successfully`)
          break
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            await mockAPI.deleteUser(userId)
            setAllUsers(prev => prev.filter(u => u.id !== userId))
            toast.success(`${user.name} deleted successfully`)
          }
          break
        case 'reset-password':
          toast.success(`Password reset email sent to ${user.email}`)
          break
        default:
          break
      }
    } catch (error) {
      toast.error('Action failed. Please try again.')
    }
  }

  const handleCourseAction = async (courseId, action) => {
    try {
      const course = allCourses.find(c => c.id === courseId)
      if (!course) throw new Error('Course not found')
      
      switch (action) {
        case 'publish':
          await mockAPI.updateCourse(courseId, { status: 'published' })
          setAllCourses(prev => prev.map(c => 
            c.id === courseId ? { ...c, status: 'published' } : c
          ))
          toast.success(`${course.title} published successfully`)
          break
        case 'archive':
          await mockAPI.updateCourse(courseId, { status: 'archived' })
          setAllCourses(prev => prev.map(c => 
            c.id === courseId ? { ...c, status: 'archived' } : c
          ))
          toast.success(`${course.title} archived successfully`)
          break
        case 'feature':
          await mockAPI.updateCourse(courseId, { isFeatured: true })
          setAllCourses(prev => prev.map(c => 
            c.id === courseId ? { ...c, isFeatured: true } : c
          ))
          toast.success(`${course.title} featured successfully`)
          break
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${course.title}?`)) {
            await mockAPI.deleteCourse(courseId)
            setAllCourses(prev => prev.filter(c => c.id !== courseId))
            toast.success(`${course.title} deleted successfully`)
          }
          break
        default:
          break
      }
    } catch (error) {
      toast.error('Action failed. Please try again.')
    }
  }

  const updateInstructorPermissions = async (instructorId, permissions) => {
    try {
      await mockAPI.updateUserPermissions(instructorId, permissions)
      setInstructorPermissions(prev => ({
        ...prev,
        [instructorId]: { ...prev[instructorId], ...permissions }
      }))
      toast.success('Permissions updated successfully')
    } catch (error) {
      toast.error('Failed to update permissions')
    }
  }

  const assignStudentToInstructor = async (studentId, instructorId) => {
    try {
      await mockAPI.assignStudentToInstructor(studentId, instructorId)
      setAllUsers(prev => prev.map(user => {
        if (user.id === studentId) {
          return { ...user, instructorId }
        }
        if (user.id === instructorId) {
          return { 
            ...user, 
            students: [...(user.students || []), studentId].filter((id, index, arr) => arr.indexOf(id) === index)
          }
        }
        return user
      }))
      toast.success('Student assigned to instructor successfully')
    } catch (error) {
      toast.error('Failed to assign student')
    }
  }

  const assignCourseToStudent = async (studentId, courseId) => {
    try {
      await mockAPI.assignCourseToStudent(studentId, courseId)
      setAllUsers(prev => prev.map(user => 
        user.id === studentId 
          ? { ...user, assignedCourses: [...(user.assignedCourses || []), courseId] }
          : user
      ))
      toast.success('Course assigned to student successfully')
    } catch (error) {
      toast.error('Failed to assign course')
    }
  }

  const createUser = async () => {
    try {
      if (!newUserData.name || !newUserData.email) {
        toast.error('Name and email are required')
        return
      }
      
      const userData = {
        ...newUserData,
        password: 'TempPass123!', // Temporary password
        permissions: newUserData.role === 'instructor' ? {
          canCreateCourses: false,
          canManageStudents: true,
          canViewAnalytics: true
        } : {},
        assignedCourses: [],
        students: newUserData.role === 'instructor' ? [] : undefined
      }
      
      const newUser = await mockAPI.createUser(userData)
      setAllUsers(prev => [...prev, newUser])
      setNewUserData({ name: '', email: '', role: 'student', instructorId: '' })
      setShowCreateUserModal(false)
      toast.success(`${newUser.name} created successfully`)
    } catch (error) {
      toast.error('Failed to create user')
    }
  }

  const resolveAlert = (alertId) => {
    setSystemAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ))
    toast.success('Alert resolved')
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-600" />
      case 'info':
        return <BarChart3 size={16} className="text-blue-600" />
      case 'success':
        return <CheckCircle size={16} className="text-green-600" />
      case 'error':
        return <XCircle size={16} className="text-red-600" />
      default:
        return <AlertTriangle size={16} className="text-gray-600" />
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter
    return matchesSearch && matchesRole
  })

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(courseSearchTerm.toLowerCase())
    const matchesStatus = courseStatusFilter === 'all' || course.status === courseStatusFilter
    return matchesSearch && matchesStatus
  })

  const instructors = allUsers.filter(user => user.role === 'instructor')
  const students = allUsers.filter(user => user.role === 'student')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Shield size={24} className="text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Complete system control and management.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => setShowSystemModal(true)}
              >
                <Server size={16} className="mr-2" />
                System Health
              </Button>
              <Button 
                variant="outline"
                onClick={() => fetchAdminData()}
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setShowCreateUserModal(true)}>
                <UserPlus size={16} className="mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowUsersModal(true)}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
                <p className="text-xs text-green-600">{systemStats.activeUsers} active</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowCoursesModal(true)}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalCourses}</p>
                <p className="text-xs text-green-600">{allCourses.filter(c => c.status === 'published').length} published</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookMarked size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Modules</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalModules}</p>
                <p className="text-xs text-gray-500">Across all courses</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Chapters</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalChapters}</p>
                <p className="text-xs text-gray-500">Learning content</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.completionRate}%</p>
                <p className="text-xs text-green-600">+5% this month</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Award size={24} className="text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Test Average</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.averageTestScore}%</p>
                <p className="text-xs text-green-600">System-wide</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Management */}
            <Card>
              <Card.Header className="flex items-center justify-between">
                <Card.Title>User Management</Card.Title>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowUsersModal(true)}
                  >
                    <Eye size={16} className="mr-1" />
                    View All
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setShowCreateUserModal(true)}
                  >
                    <UserPlus size={16} className="mr-2" />
                    Add User
                  </Button>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{students.length}</div>
                    <div className="text-sm text-blue-800">Students</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{instructors.length}</div>
                    <div className="text-sm text-green-800">Instructors</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {allUsers.filter(u => u.isActive).length}
                    </div>
                    <div className="text-sm text-purple-800">Active Users</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {allUsers.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="info" size="sm">{user.role}</Badge>
                        <Badge variant={user.isActive ? 'success' : 'danger'} size="sm">
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Course Management */}
            <Card>
              <Card.Header className="flex items-center justify-between">
                <Card.Title>Course Management</Card.Title>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowCoursesModal(true)}
                  >
                    <Eye size={16} className="mr-1" />
                    View All
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => toast('Course builder coming soon!')}
                  >
                    <Plus size={16} className="mr-2" />
                    Create Course
                  </Button>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">
                      {allCourses.filter(c => c.status === 'published').length}
                    </div>
                    <div className="text-sm text-green-800">Published</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-xl font-bold text-yellow-600">
                      {allCourses.filter(c => c.status === 'draft').length}
                    </div>
                    <div className="text-sm text-yellow-800">Draft</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{allModules.length}</div>
                    <div className="text-sm text-blue-800">Total Modules</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {allCourses.slice(0, 5).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
                          <p className="text-xs text-gray-600">by {course.instructor.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={course.status === 'published' ? 'success' : 'warning'} size="sm">
                          {course.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{course.enrolledStudents.length} students</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* System Alerts */}
            <Card>
              <Card.Header className="flex items-center justify-between">
                <Card.Title className="flex items-center">
                  <AlertTriangle size={20} className="mr-2 text-yellow-500" />
                  System Alerts
                </Card.Title>
                <Badge variant="danger" size="sm">
                  {systemAlerts.filter(alert => !alert.resolved).length} active
                </Badge>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {systemAlerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)} ${alert.resolved ? 'opacity-50' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {alert.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {alert.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(alert.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {!alert.resolved && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Instructor Permissions */}
            <Card>
              <Card.Header className="flex items-center justify-between">
                <Card.Title className="flex items-center">
                  <Settings size={20} className="mr-2 text-purple-500" />
                  Instructor Control
                </Card.Title>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowPermissionsModal(true)}
                >
                  Manage
                </Button>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {instructors.map((instructor) => {
                    const permissions = instructorPermissions[instructor.id] || {}
                    const studentCount = instructor.students?.length || 0
                    
                    return (
                      <div key={instructor.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{instructor.name}</h4>
                          <div className="flex items-center space-x-1">
                            {permissions.canCreateCourses && (
                              <Badge variant="success" size="sm">Create</Badge>
                            )}
                            <Badge variant="info" size="sm">{studentCount} students</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {permissions.assignedCourses?.length || 0} courses assigned
                          </span>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(instructor)
                                setShowPermissionsModal(true)
                              }}
                            >
                              <Settings size={12} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant={instructor.isActive ? 'outline' : 'default'}
                              onClick={() => handleUserAction(instructor.id, instructor.isActive ? 'deactivate' : 'activate')}
                            >
                              {instructor.isActive ? <Pause size={12} /> : <Play size={12} />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card.Content>
            </Card>

            {/* System Health */}
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Activity size={20} className="mr-2 text-green-500" />
                  System Health
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <Badge variant="success" size="sm">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Server</span>
                    <Badge variant="success" size="sm">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">AI Interview Portal</span>
                    <Badge variant="success" size="sm">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">File Storage</span>
                    <Badge variant="warning" size="sm">75% Full</Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => setShowSystemModal(true)}
                  >
                    View Details
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>

      {/* Users Management Modal */}
      <Modal
        isOpen={showUsersModal}
        onClose={() => setShowUsersModal(false)}
        title="User Management"
        size="xl"
      >
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search users..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="instructor">Instructors</option>
              <option value="admin">Admins</option>
            </select>
            <Button 
              variant="outline"
              onClick={() => toast('Export functionality coming soon!')}
            >
              <Download size={16} className="mr-1" />
              Export
            </Button>
          </div>

          {/* Users List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="info" size="sm">{user.role}</Badge>
                      <Badge variant={user.isActive ? 'success' : 'danger'} size="sm">
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant={user.isVerified ? 'success' : 'warning'} size="sm">
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                      {user.role === 'student' && user.instructorId && (
                        <Badge variant="default" size="sm">
                          Under: {allUsers.find(u => u.id === user.instructorId)?.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUserAction(user.id, user.isActive ? 'deactivate' : 'activate')}
                  >
                    {user.isActive ? <XCircle size={14} /> : <CheckCircle size={14} />}
                  </Button>
                  {!user.isVerified && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUserAction(user.id, 'verify')}
                    >
                      <UserCheck size={14} />
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUserAction(user.id, 'reset-password')}
                  >
                    <Shield size={14} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUserAction(user.id, 'delete')}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Courses Management Modal */}
      <Modal
        isOpen={showCoursesModal}
        onClose={() => setShowCoursesModal(false)}
        title="Course Management"
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search courses..."
                value={courseSearchTerm}
                onChange={(e) => setCourseSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={courseStatusFilter}
              onChange={(e) => setCourseStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-600">by {course.instructor.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={course.status === 'published' ? 'success' : 'warning'} size="sm">
                        {course.status}
                      </Badge>
                      <Badge variant="info" size="sm">{course.category}</Badge>
                      <span className="text-xs text-gray-500">
                        {course.enrolledStudents.length} students
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCourseAction(course.id, 'view')}
                  >
                    <Eye size={14} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCourseAction(course.id, course.status === 'published' ? 'archive' : 'publish')}
                  >
                    {course.status === 'published' ? <Square size={14} /> : <PlayCircle size={14} />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCourseAction(course.id, 'feature')}
                  >
                    <Star size={14} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCourseAction(course.id, 'delete')}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        title="Create New User"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={newUserData.name}
            onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter full name"
          />
          
          <Input
            label="Email Address"
            type="email"
            value={newUserData.email}
            onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter email address"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={newUserData.role}
              onChange={(e) => setNewUserData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          {newUserData.role === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Instructor</label>
              <select
                value={newUserData.instructorId}
                onChange={(e) => setNewUserData(prev => ({ ...prev, instructorId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Instructor</option>
                {instructors.map(instructor => (
                  <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowCreateUserModal(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1"
              onClick={createUser}
            >
              Create User
            </Button>
          </div>
        </div>
      </Modal>

      {/* Permissions Management Modal */}
      <Modal
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        title="Instructor Permissions"
        size="lg"
      >
        <div className="space-y-6">
          {instructors.map((instructor) => {
            const permissions = instructorPermissions[instructor.id] || {}
            
            return (
              <div key={instructor.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={instructor.avatar} 
                    alt={instructor.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{instructor.name}</h4>
                    <p className="text-sm text-gray-600">{instructor.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={permissions.canCreateCourses || false}
                      onChange={(e) => updateInstructorPermissions(instructor.id, { 
                        canCreateCourses: e.target.checked 
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Can Create Courses</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={permissions.canEditCourses || false}
                      onChange={(e) => updateInstructorPermissions(instructor.id, { 
                        canEditCourses: e.target.checked 
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Can Edit Courses</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={permissions.canManageTests || false}
                      onChange={(e) => updateInstructorPermissions(instructor.id, { 
                        canManageTests: e.target.checked 
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Can Manage Tests</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={permissions.canViewAllStudents || false}
                      onChange={(e) => updateInstructorPermissions(instructor.id, { 
                        canViewAllStudents: e.target.checked 
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Can View All Students</span>
                  </label>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Courses</label>
                  <div className="flex flex-wrap gap-2">
                    {allCourses.map(course => (
                      <label key={course.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={permissions.assignedCourses?.includes(course.id) || false}
                          onChange={(e) => {
                            const currentCourses = permissions.assignedCourses || []
                            const newCourses = e.target.checked 
                              ? [...currentCourses, course.id]
                              : currentCourses.filter(id => id !== course.id)
                            updateInstructorPermissions(instructor.id, { assignedCourses: newCourses })
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{course.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </Modal>

      {/* System Health Modal */}
      <Modal
        isOpen={showSystemModal}
        onClose={() => setShowSystemModal(false)}
        title="System Health & Monitoring"
        size="lg"
      >
        <div className="space-y-6">
          {/* System Status */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">System Status</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Database size={20} className="text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">Database</div>
                    <div className="text-sm text-green-700">Healthy • 45ms avg response</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Server size={20} className="text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">API Server</div>
                    <div className="text-sm text-green-700">Online • 99.9% uptime</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Brain size={20} className="text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">AI Interview Portal</div>
                    <div className="text-sm text-green-700">Connected • 12 sessions today</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <Globe size={20} className="text-yellow-600" />
                  <div>
                    <div className="font-medium text-yellow-900">File Storage</div>
                    <div className="text-sm text-yellow-700">75% Full • 2.3GB used</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU Usage</span>
                  <span>35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory Usage</span>
                  <span>58%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Active Sessions</span>
                  <span>24 users</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent System Logs */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Recent System Logs</h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-40 overflow-y-auto">
              <div>[2024-01-20 10:30:15] INFO: Student completed module test - score: 85%</div>
              <div>[2024-01-20 10:28:42] INFO: New course created - "Advanced JavaScript"</div>
              <div>[2024-01-20 10:25:33] INFO: AI Interview session completed - student ID: 4</div>
              <div>[2024-01-20 10:20:18] INFO: Instructor permissions updated - instructor ID: 2</div>
              <div>[2024-01-20 10:15:07] INFO: Database backup completed successfully</div>
              <div>[2024-01-20 10:10:33] WARN: High memory usage detected - 75%</div>
              <div>[2024-01-20 10:05:12] INFO: Student assigned to course - course ID: 1</div>
            </div>
          </div>

          {/* System Controls */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">System Controls</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={() => toast('Backup initiated successfully!')}
              >
                <Download size={16} className="mr-2" />
                Backup System
              </Button>
              <Button 
                variant="outline"
                onClick={() => toast('Maintenance mode toggled!')}
              >
                <Settings size={16} className="mr-2" />
                Maintenance Mode
              </Button>
              <Button 
                variant="outline"
                onClick={() => toast('Cache cleared successfully!')}
              >
                <RefreshCw size={16} className="mr-2" />
                Clear Cache
              </Button>
              <Button 
                variant="outline"
                onClick={() => toast('System restart scheduled!')}
              >
                <Server size={16} className="mr-2" />
                Restart Services
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminDashboardPage