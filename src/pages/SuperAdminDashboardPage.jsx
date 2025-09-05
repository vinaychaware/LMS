import React, { useState, useEffect } from 'react'
import { 
  Building2, 
  Users, 
  Shield, 
  GraduationCap,
  TrendingUp,
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Settings,
  BarChart3,
  Globe,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  BookOpen,
  UserCheck,
  UserX,
  RefreshCw,
  FileText,
  ClipboardList,
  Video,
  Upload,
  Save,
  X,
  Clock,
  Award,
  Target
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { mockAPI, mockData } from '../services/mockData'
import useAuthStore from '../store/useAuthStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Tabs from '../components/ui/Tabs'
import Progress from '../components/ui/Progress'

const SuperAdminDashboardPage = () => {
  const { user } = useAuthStore()
  const [colleges, setColleges] = useState([])
  const [admins, setAdmins] = useState([])
  const [instructors, setInstructors] = useState([])
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [tests, setTests] = useState([])
  const [systemAnalytics, setSystemAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedTest, setSelectedTest] = useState(null)
  const [showCollegeModal, setShowCollegeModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showSystemModal, setShowSystemModal] = useState(false)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [showTestModal, setShowTestModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterCollege, setFilterCollege] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchSuperAdminData()
  }, [])

  const fetchSuperAdminData = async () => {
    try {
      setLoading(true)
      const [collegesData, adminsData, instructorsData, studentsData, coursesData, testsData, analyticsData] = await Promise.all([
        mockAPI.getAllColleges(),
        mockAPI.getAllAdmins(),
        mockAPI.getAllInstructors(),
        mockAPI.getAllStudents(),
        mockAPI.getAllCourses(),
        mockAPI.getAllTests(),
        mockAPI.getSystemAnalytics()
      ])
      
      setColleges(collegesData)
      setAdmins(adminsData)
      setInstructors(instructorsData)
      setStudents(studentsData)
      setCourses(coursesData || [])
      setTests(testsData || [])
      setSystemAnalytics(analyticsData)
    } catch (error) {
      console.error('Error fetching super admin data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleCollegeAction = async (collegeId, action) => {
    try {
      switch (action) {
        case 'view':
          const college = colleges.find(c => c.id === collegeId)
          setSelectedCollege(college)
          setShowCollegeModal(true)
          break
        case 'edit':
          const editCollege = colleges.find(c => c.id === collegeId)
          setSelectedCollege(editCollege)
          setShowCollegeModal(true)
          break
        case 'delete':
          if (window.confirm('Are you sure you want to delete this college? This action cannot be undone.')) {
            await mockAPI.deleteCollege(collegeId)
            toast.success('College deleted successfully')
            await fetchSuperAdminData()
          }
          break
        case 'deactivate':
          await mockAPI.updateCollege(collegeId, { status: 'inactive' })
          toast.success('College deactivated')
          await fetchSuperAdminData()
          break
        case 'activate':
          await mockAPI.updateCollege(collegeId, { status: 'active' })
          toast.success('College activated')
          await fetchSuperAdminData()
          break
        default:
          break
      }
    } catch (error) {
      toast.error('Action failed. Please try again.')
    }
  }

  const handleUserAction = async (userId, action) => {
    try {
      switch (action) {
        case 'view':
          const user = [...admins, ...instructors, ...students].find(u => u.id === userId)
          setSelectedUser(user)
          setShowUserModal(true)
          break
        case 'activate':
          await mockAPI.bulkUpdateUsers([userId], { isActive: true })
          toast.success('User activated')
          await fetchSuperAdminData()
          break
        case 'deactivate':
          await mockAPI.bulkUpdateUsers([userId], { isActive: false })
          toast.success('User deactivated')
          await fetchSuperAdminData()
          break
        case 'verify':
          await mockAPI.bulkUpdateUsers([userId], { isVerified: true })
          toast.success('User verified')
          await fetchSuperAdminData()
          break
        case 'delete':
          if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            await mockAPI.deleteUser(userId)
            toast.success('User deleted successfully')
            await fetchSuperAdminData()
          }
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
      switch (action) {
        case 'view':
          const course = courses.find(c => c.id === courseId)
          setSelectedCourse(course)
          setShowCourseModal(true)
          break
        case 'edit':
          const editCourse = courses.find(c => c.id === courseId)
          setSelectedCourse(editCourse)
          setShowCourseModal(true)
          break
        case 'delete':
          if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            await mockAPI.deleteCourse(courseId)
            toast.success('Course deleted successfully')
            await fetchSuperAdminData()
          }
          break
        case 'publish':
          await mockAPI.updateCourse(courseId, { status: 'published' })
          toast.success('Course published')
          await fetchSuperAdminData()
          break
        case 'unpublish':
          await mockAPI.updateCourse(courseId, { status: 'draft' })
          toast.success('Course unpublished')
          await fetchSuperAdminData()
          break
        default:
          break
      }
    } catch (error) {
      toast.error('Action failed. Please try again.')
    }
  }

  const handleTestAction = async (testId, action) => {
    try {
      switch (action) {
        case 'view':
          const test = tests.find(t => t.id === testId)
          setSelectedTest(test)
          setShowTestModal(true)
          break
        case 'edit':
          const editTest = tests.find(t => t.id === testId)
          setSelectedTest(editTest)
          setShowTestModal(true)
          break
        case 'delete':
          if (window.confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
            await mockAPI.deleteTest(testId)
            toast.success('Test deleted successfully')
            await fetchSuperAdminData()
          }
          break
        case 'activate':
          await mockAPI.updateTest(testId, { isActive: true })
          toast.success('Test activated')
          await fetchSuperAdminData()
          break
        case 'deactivate':
          await mockAPI.updateTest(testId, { isActive: false })
          toast.success('Test deactivated')
          await fetchSuperAdminData()
          break
        default:
          break
      }
    } catch (error) {
      toast.error('Action failed. Please try again.')
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first')
      return
    }

    try {
      switch (action) {
        case 'activate':
          await mockAPI.bulkUpdateUsers(selectedUsers, { isActive: true })
          toast.success(`${selectedUsers.length} users activated`)
          break
        case 'deactivate':
          await mockAPI.bulkUpdateUsers(selectedUsers, { isActive: false })
          toast.success(`${selectedUsers.length} users deactivated`)
          break
        case 'verify':
          await mockAPI.bulkUpdateUsers(selectedUsers, { isVerified: true })
          toast.success(`${selectedUsers.length} users verified`)
          break
        default:
          break
      }
      setSelectedUsers([])
      await fetchSuperAdminData()
    } catch (error) {
      toast.error('Bulk action failed')
    }
  }

  const createCollege = async (collegeData) => {
    try {
      await mockAPI.createCollege(collegeData)
      toast.success('College created successfully')
      setShowCollegeModal(false)
      setSelectedCollege(null)
      await fetchSuperAdminData()
    } catch (error) {
      toast.error('Failed to create college')
    }
  }

  const updateCollege = async (collegeId, updates) => {
    try {
      await mockAPI.updateCollege(collegeId, updates)
      toast.success('College updated successfully')
      setShowCollegeModal(false)
      setSelectedCollege(null)
      await fetchSuperAdminData()
    } catch (error) {
      toast.error('Failed to update college')
    }
  }

  const createCourse = async (courseData) => {
    try {
      await mockAPI.createCourse(courseData)
      toast.success('Course created successfully')
      setShowCourseModal(false)
      setSelectedCourse(null)
      await fetchSuperAdminData()
    } catch (error) {
      toast.error('Failed to create course')
    }
  }

  const updateCourse = async (courseId, updates) => {
    try {
      await mockAPI.updateCourse(courseId, updates)
      toast.success('Course updated successfully')
      setShowCourseModal(false)
      setSelectedCourse(null)
      await fetchSuperAdminData()
    } catch (error) {
      toast.error('Failed to update course')
    }
  }

  const createTest = async (testData) => {
    try {
      await mockAPI.createTest(testData)
      toast.success('Test created successfully')
      setShowTestModal(false)
      setSelectedTest(null)
      await fetchSuperAdminData()
    } catch (error) {
      toast.error('Failed to create test')
    }
  }

  const updateTest = async (testId, updates) => {
    try {
      await mockAPI.updateTest(testId, updates)
      toast.success('Test updated successfully')
      setShowTestModal(false)
      setSelectedTest(null)
      await fetchSuperAdminData()
    } catch (error) {
      toast.error('Failed to update test')
    }
  }

  const getAllUsers = () => [...admins, ...instructors, ...students]

  const getFilteredUsers = () => {
    let users = getAllUsers()
    
    if (searchTerm) {
      users = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (filterRole !== 'all') {
      users = users.filter(user => user.role === filterRole)
    }
    
    if (filterCollege !== 'all') {
      users = users.filter(user => user.collegeId === filterCollege)
    }
    
    return users
  }

  const formatUptime = (percentage) => {
    const days = Math.floor(percentage * 365 / 100)
    return `${days} days (${percentage}%)`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Super Admin dashboard...</p>
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
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-gray-600">Complete system oversight and management</p>
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
                onClick={() => {
                  setSelectedCourse(null)
                  setShowCourseModal(true)
                }}
              >
                <BookOpen size={16} className="mr-2" />
                Create Course
              </Button>
              <Button 
                onClick={() => {
                  setSelectedTest(null)
                  setShowTestModal(true)
                }}
              >
                <ClipboardList size={16} className="mr-2" />
                Create Test
              </Button>
              <Button 
                onClick={() => {
                  setSelectedCollege(null)
                  setShowCollegeModal(true)
                }}
              >
                <Plus size={16} className="mr-2" />
                Add College
              </Button>
            </div>
          </div>
        </div>

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('colleges')}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Colleges</p>
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.totalColleges}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('users')}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(systemAnalytics?.overview.totalAdmins || 0) + 
                   (systemAnalytics?.overview.totalInstructors || 0) + 
                   (systemAnalytics?.overview.totalStudents || 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('courses')}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('tests')}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ClipboardList size={24} className="text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tests</p>
                <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowSystemModal(true)}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Activity size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Health</p>
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.systemUptime}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <Tabs.List className="mb-6">
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="colleges">Colleges</Tabs.Trigger>
            <Tabs.Trigger value="users">Users</Tabs.Trigger>
            <Tabs.Trigger value="courses">Courses</Tabs.Trigger>
            <Tabs.Trigger value="tests">Tests</Tabs.Trigger>
            <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Content value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <Card>
                <Card.Header>
                  <Card.Title className="flex items-center">
                    <Activity size={20} className="mr-2 text-blue-500" />
                    Recent Activity
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle size={16} className="text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New college registered</p>
                        <p className="text-xs text-gray-500">Creative Arts Institute - 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Users size={16} className="text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">5 new students enrolled</p>
                        <p className="text-xs text-gray-500">Across multiple colleges - 4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <BookOpen size={16} className="text-purple-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">2 new courses published</p>
                        <p className="text-xs text-gray-500">Tech University - 6 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <ClipboardList size={16} className="text-orange-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">3 new tests created</p>
                        <p className="text-xs text-gray-500">Various courses - 8 hours ago</p>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              {/* System Performance */}
              <Card>
                <Card.Header>
                  <Card.Title className="flex items-center">
                    <Server size={20} className="mr-2 text-green-500" />
                    System Performance
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Cpu size={16} className="text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                        </div>
                        <span className="text-sm text-gray-900">{systemAnalytics?.performanceMetrics.cpuUsage}%</span>
                      </div>
                      <Progress value={systemAnalytics?.performanceMetrics.cpuUsage} size="sm" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Database size={16} className="text-green-500" />
                          <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                        </div>
                        <span className="text-sm text-gray-900">{systemAnalytics?.performanceMetrics.memoryUsage}%</span>
                      </div>
                      <Progress value={systemAnalytics?.performanceMetrics.memoryUsage} size="sm" variant="accent" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <HardDrive size={16} className="text-purple-500" />
                          <span className="text-sm font-medium text-gray-700">Disk Usage</span>
                        </div>
                        <span className="text-sm text-gray-900">{systemAnalytics?.performanceMetrics.diskUsage}%</span>
                      </div>
                      <Progress value={systemAnalytics?.performanceMetrics.diskUsage} size="sm" variant="secondary" />
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{systemAnalytics?.performanceMetrics.responseTime}ms</div>
                          <div className="text-gray-500">Avg Response</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{systemAnalytics?.performanceMetrics.errorRate}%</div>
                          <div className="text-gray-500">Error Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </Tabs.Content>

          {/* Colleges Tab */}
          <Tabs.Content value="colleges">
            <Card>
              <Card.Header className="flex items-center justify-between">
                <Card.Title>College Management</Card.Title>
                <Button onClick={() => {
                  setSelectedCollege(null)
                  setShowCollegeModal(true)
                }}>
                  <Plus size={16} className="mr-2" />
                  Add College
                </Button>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {colleges.map((college) => (
                    <div key={college.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                            <img 
                              src={college.logo} 
                              alt={college.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{college.name}</h3>
                            <p className="text-sm text-gray-600">{college.code}</p>
                            <Badge 
                              variant={college.status === 'active' ? 'success' : 'danger'} 
                              size="sm"
                            >
                              {college.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Students</span>
                          <span className="font-medium">{college.totalStudents}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Instructors</span>
                          <span className="font-medium">{college.totalInstructors}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Courses</span>
                          <span className="font-medium">{college.totalCourses}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
                        <Calendar size={12} />
                        <span>Est. {college.establishedYear}</span>
                        <span>•</span>
                        <Globe size={12} />
                        <span>{college.website?.replace('https://', '')}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCollegeAction(college.id, 'view')}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCollegeAction(college.id, 'edit')}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCollegeAction(college.id, college.status === 'active' ? 'deactivate' : 'activate')}
                        >
                          {college.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCollegeAction(college.id, 'delete')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Tabs.Content>

          {/* Users Tab - Previous implementation */}
          <Tabs.Content value="users">
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title>User Management</Card.Title>
                  <div className="flex space-x-2">
                    {selectedUsers.length > 0 && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleBulkAction('activate')}
                        >
                          <UserCheck size={14} className="mr-1" />
                          Activate ({selectedUsers.length})
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleBulkAction('deactivate')}
                        >
                          <UserX size={14} className="mr-1" />
                          Deactivate ({selectedUsers.length})
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleBulkAction('verify')}
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Verify ({selectedUsers.length})
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => toast('Export functionality coming soon!')}
                    >
                      <Download size={16} className="mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
                
                {/* Filters */}
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admins</option>
                    <option value="instructor">Instructors</option>
                    <option value="student">Students</option>
                  </select>
                  <select
                    value={filterCollege}
                    onChange={(e) => setFilterCollege(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Colleges</option>
                    {colleges.map(college => (
                      <option key={college.id} value={college.id}>{college.name}</option>
                    ))}
                  </select>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers(getFilteredUsers().map(u => u.id))
                              } else {
                                setSelectedUsers([])
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredUsers().map(user => {
                        const college = colleges.find(c => c.id === user.collegeId)
                        return (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUsers([...selectedUsers, user.id])
                                  } else {
                                    setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                  <img 
                                    src={user.avatar} 
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge 
                                variant={
                                  user.role === 'admin' ? 'danger' : 
                                  user.role === 'instructor' ? 'warning' : 'info'
                                }
                              >
                                {user.role}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {college?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <Badge variant={user.isActive ? 'success' : 'secondary'} size="sm">
                                  {user.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                {user.isVerified && (
                                  <CheckCircle size={14} className="text-green-500" />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUserAction(user.id, 'view')}
                                >
                                  <Eye size={14} />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUserAction(user.id, user.isActive ? 'deactivate' : 'activate')}
                                >
                                  {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                                </Button>
                                {!user.isVerified && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUserAction(user.id, 'verify')}
                                  >
                                    <CheckCircle size={14} />
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUserAction(user.id, 'delete')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Card.Content>
            </Card>
          </Tabs.Content>

          {/* Courses Tab */}
          <Tabs.Content value="courses">
            <Card>
              <Card.Header className="flex items-center justify-between">
                <Card.Title>Course Management</Card.Title>
                <Button onClick={() => {
                  setSelectedCourse(null)
                  setShowCourseModal(true)
                }}>
                  <Plus size={16} className="mr-2" />
                  Create Course
                </Button>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            <Badge 
                              variant={course.status === 'published' ? 'success' : 'secondary'} 
                              size="sm"
                            >
                              {course.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                          <p className="text-xs text-gray-500">
                            {colleges.find(c => c.id === course.collegeId)?.name || 'Global'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium">{course.duration} hours</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Difficulty</span>
                          <Badge variant="info" size="sm">{course.difficulty}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Enrolled</span>
                          <span className="font-medium">{course.enrolledStudents || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Price</span>
                          <span className="font-medium">${course.price}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
                        <Calendar size={12} />
                        <span>Created {new Date(course.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex space-x-2">
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
                          onClick={() => handleCourseAction(course.id, 'edit')}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCourseAction(course.id, course.status === 'published' ? 'unpublish' : 'publish')}
                        >
                          {course.status === 'published' ? <UserX size={14} /> : <CheckCircle size={14} />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCourseAction(course.id, 'delete')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Tabs.Content>

          {/* Tests Tab */}
          <Tabs.Content value="tests">
            <Card>
              <Card.Header className="flex items-center justify-between">
                <Card.Title>Test Management</Card.Title>
                <Button onClick={() => {
                  setSelectedTest(null)
                  setShowTestModal(true)
                }}>
                  <Plus size={16} className="mr-2" />
                  Create Test
                </Button>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tests.map((test) => (
                    <div key={test.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{test.title}</h3>
                            <Badge 
                              variant={test.isActive ? 'success' : 'secondary'} 
                              size="sm"
                            >
                              {test.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                          <p className="text-xs text-gray-500">
                            Course: {courses.find(c => c.id === test.courseId)?.title || 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Questions</span>
                          <span className="font-medium">{test.questions?.length || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium">{test.duration} min</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Pass Marks</span>
                          <span className="font-medium">{test.passingMarks}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Attempts</span>
                          <span className="font-medium">{test.attempts || 0}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
                        <Clock size={12} />
                        <span>Created {new Date(test.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTestAction(test.id, 'view')}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTestAction(test.id, 'edit')}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTestAction(test.id, test.isActive ? 'deactivate' : 'activate')}
                        >
                          {test.isActive ? <UserX size={14} /> : <CheckCircle size={14} />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTestAction(test.id, 'delete')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Tabs.Content>

          {/* Analytics Tab */}
          <Tabs.Content value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <Card.Header>
                  <Card.Title>College Performance</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    {colleges.map(college => {
                      const breakdown = systemAnalytics?.collegeBreakdown[college.id]
                      return (
                        <div key={college.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">{college.name}</h4>
                            <Badge variant="info" size="sm">${breakdown?.revenue || 0}</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="font-medium text-gray-900">{breakdown?.students || 0}</div>
                              <div className="text-gray-500">Students</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-gray-900">{breakdown?.instructors || 0}</div>
                              <div className="text-gray-500">Instructors</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-gray-900">{breakdown?.courses || 0}</div>
                              <div className="text-gray-500">Courses</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Revenue Analytics</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        ${systemAnalytics?.overview.totalRevenue?.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-800">Total Revenue</div>
                    </div>
                    
                    <div className="space-y-3">
                      {colleges.map(college => {
                        const breakdown = systemAnalytics?.collegeBreakdown[college.id]
                        const percentage = breakdown?.revenue ? 
                          (breakdown.revenue / systemAnalytics.overview.totalRevenue) * 100 : 0
                        
                        return (
                          <div key={college.id}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{college.name}</span>
                              <span className="text-sm text-gray-900">${breakdown?.revenue || 0}</span>
                            </div>
                            <Progress value={percentage} size="sm" variant="accent" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </Tabs.Content>
        </Tabs>
      </div>

      {/* Course Modal */}
      <Modal
        isOpen={showCourseModal}
        onClose={() => {
          setShowCourseModal(false)
          setSelectedCourse(null)
        }}
        title={selectedCourse ? 'Edit Course' : 'Create New Course'}
        size="xl"
      >
        <CourseForm 
          course={selectedCourse}
          colleges={colleges}
          onSubmit={selectedCourse ? 
            (data) => updateCourse(selectedCourse.id, data) : 
            createCourse
          }
          onCancel={() => {
            setShowCourseModal(false)
            setSelectedCourse(null)
          }}
        />
      </Modal>

      {/* Test Modal */}
      <Modal
        isOpen={showTestModal}
        onClose={() => {
          setShowTestModal(false)
          setSelectedTest(null)
        }}
        title={selectedTest ? 'Edit Test' : 'Create New Test'}
        size="xl"
      >
        <TestForm 
          test={selectedTest}
          courses={courses}
          onSubmit={selectedTest ? 
            (data) => updateTest(selectedTest.id, data) : 
            createTest
          }
          onCancel={() => {
            setShowTestModal(false)
            setSelectedTest(null)
          }}
        />
      </Modal>

      {/* College Modal */}
      <Modal
        isOpen={showCollegeModal}
        onClose={() => {
          setShowCollegeModal(false)
          setSelectedCollege(null)
        }}
        title={selectedCollege ? 'Edit College' : 'Add New College'}
        size="lg"
      >
        <CollegeForm 
          college={selectedCollege}
          onSubmit={selectedCollege ? 
            (data) => updateCollege(selectedCollege.id, data) : 
            createCollege
          }
          onCancel={() => {
            setShowCollegeModal(false)
            setSelectedCollege(null)
          }}
        />
      </Modal>

      {/* User Details Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false)
          setSelectedUser(null)
        }}
        title={selectedUser?.name}
        size="lg"
      >
        {selectedUser && (
          <UserDetailsView 
            user={selectedUser}
            college={colleges.find(c => c.id === selectedUser.collegeId)}
            onClose={() => {
              setShowUserModal(false)
              setSelectedUser(null)
            }}
          />
        )}
      </Modal>

      {/* System Health Modal */}
      <Modal
        isOpen={showSystemModal}
        onClose={() => setShowSystemModal(false)}
        title="System Health & Performance"
        size="xl"
      >
        <SystemHealthView 
          analytics={systemAnalytics}
          onRefresh={fetchSuperAdminData}
        />
      </Modal>
    </div>
  )
}

// Course Form Component
const CourseForm = ({ course, colleges, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    collegeId: course?.collegeId || '',
    duration: course?.duration || '',
    difficulty: course?.difficulty || 'beginner',
    price: course?.price || '',
    category: course?.category || '',
    prerequisites: course?.prerequisites || '',
    learningOutcomes: course?.learningOutcomes || [],
    modules: course?.modules || []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentModule, setCurrentModule] = useState({ title: '', description: '', duration: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        createdAt: course?.createdAt || new Date().toISOString(),
        status: course?.status || 'draft'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addModule = () => {
    if (currentModule.title && currentModule.description) {
      setFormData({
        ...formData,
        modules: [...formData.modules, { ...currentModule, id: Date.now() }]
      })
      setCurrentModule({ title: '', description: '', duration: '' })
    }
  }

  const removeModule = (moduleId) => {
    setFormData({
      ...formData,
      modules: formData.modules.filter(m => m.id !== moduleId)
    })
  }

  const addLearningOutcome = () => {
    const outcome = prompt('Enter learning outcome:')
    if (outcome) {
      setFormData({
        ...formData,
        learningOutcomes: [...formData.learningOutcomes, outcome]
      })
    }
  }

  const removeLearningOutcome = (index) => {
    setFormData({
      ...formData,
      learningOutcomes: formData.learningOutcomes.filter((_, i) => i !== index)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Course Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <select
          value={formData.collegeId}
          onChange={(e) => setFormData({...formData, collegeId: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select College (Optional)</option>
          {colleges.map(college => (
            <option key={college.id} value={college.id}>{college.name}</option>
          ))}
        </select>
        <Input
          label="Duration (hours)"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({...formData, duration: e.target.value})}
          required
        />
        <select
          value={formData.difficulty}
          onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <Input
          label="Price ($)"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required
        />
        <Input
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Prerequisites</label>
        <textarea
          value={formData.prerequisites}
          onChange={(e) => setFormData({...formData, prerequisites: e.target.value})}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          placeholder="List any prerequisites for this course..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Learning Outcomes</label>
          <Button type="button" variant="outline" size="sm" onClick={addLearningOutcome}>
            <Plus size={14} className="mr-1" />
            Add Outcome
          </Button>
        </div>
        <div className="space-y-2">
          {formData.learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <span className="flex-1 text-sm">{outcome}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeLearningOutcome(index)}
              >
                <X size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Course Modules</label>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Module</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            <Input
              placeholder="Module title"
              value={currentModule.title}
              onChange={(e) => setCurrentModule({...currentModule, title: e.target.value})}
            />
            <Input
              placeholder="Duration (hours)"
              type="number"
              value={currentModule.duration}
              onChange={(e) => setCurrentModule({...currentModule, duration: e.target.value})}
            />
            <Button type="button" onClick={addModule}>
              <Plus size={14} className="mr-1" />
              Add
            </Button>
          </div>
          <textarea
            placeholder="Module description"
            value={currentModule.description}
            onChange={(e) => setCurrentModule({...currentModule, description: e.target.value})}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="space-y-2">
          {formData.modules.map((module) => (
            <div key={module.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded">
              <div className="flex-1">
                <div className="font-medium text-sm">{module.title}</div>
                <div className="text-xs text-gray-600">{module.description}</div>
                <div className="text-xs text-gray-500">{module.duration} hours</div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeModule(module.id)}
              >
                <X size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>
          {course ? 'Update' : 'Create'} Course
        </Button>
      </div>
    </form>
  )
}

// Test Form Component
const TestForm = ({ test, courses, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: test?.title || '',
    description: test?.description || '',
    courseId: test?.courseId || '',
    duration: test?.duration || 60,
    passingMarks: test?.passingMarks || 70,
    totalMarks: test?.totalMarks || 100,
    instructions: test?.instructions || '',
    questions: test?.questions || []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: 0,
    marks: 1,
    explanation: ''
  })
  const [showQuestionForm, setShowQuestionForm] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        createdAt: test?.createdAt || new Date().toISOString(),
        isActive: test?.isActive ?? true
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addQuestion = () => {
    if (currentQuestion.question.trim()) {
      setFormData({
        ...formData,
        questions: [...formData.questions, { ...currentQuestion, id: Date.now() }]
      })
      setCurrentQuestion({
        question: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: 0,
        marks: 1,
        explanation: ''
      })
      setShowQuestionForm(false)
    }
  }

  const removeQuestion = (questionId) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q.id !== questionId)
    })
  }

  const updateQuestionOption = (index, value) => {
    const newOptions = [...currentQuestion.options]
    newOptions[index] = value
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Test Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <select
          value={formData.courseId}
          onChange={(e) => setFormData({...formData, courseId: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          required
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
        <Input
          label="Duration (minutes)"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
          required
        />
        <Input
          label="Passing Marks (%)"
          type="number"
          min="0"
          max="100"
          value={formData.passingMarks}
          onChange={(e) => setFormData({...formData, passingMarks: parseInt(e.target.value)})}
          required
        />
        <Input
          label="Total Marks"
          type="number"
          value={formData.totalMarks}
          onChange={(e) => setFormData({...formData, totalMarks: parseInt(e.target.value)})}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
        <textarea
          value={formData.instructions}
          onChange={(e) => setFormData({...formData, instructions: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          placeholder="Enter test instructions for students..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">Questions ({formData.questions.length})</label>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowQuestionForm(!showQuestionForm)}
          >
            <Plus size={14} className="mr-1" />
            Add Question
          </Button>
        </div>

        {showQuestionForm && (
          <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Question</h4>
            
            <div className="space-y-3">
              <textarea
                placeholder="Enter your question..."
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={currentQuestion.type}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, type: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                  <option value="short-answer">Short Answer</option>
                </select>
                <Input
                  placeholder="Marks"
                  type="number"
                  min="1"
                  value={currentQuestion.marks}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, marks: parseInt(e.target.value)})}
                />
              </div>

              {currentQuestion.type === 'multiple-choice' && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Options:</p>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === index}
                        onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: index})}
                        className="text-primary-600"
                      />
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateQuestionOption(index, e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'true-false' && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Correct Answer:</p>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="trueFalseAnswer"
                        value="true"
                        checked={currentQuestion.correctAnswer === 'true'}
                        onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: 'true'})}
                        className="mr-2"
                      />
                      True
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="trueFalseAnswer"
                        value="false"
                        checked={currentQuestion.correctAnswer === 'false'}
                        onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: 'false'})}
                        className="mr-2"
                      />
                      False
                    </label>
                  </div>
                </div>
              )}

              <textarea
                placeholder="Explanation (optional)"
                value={currentQuestion.explanation}
                onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />

              <div className="flex space-x-2">
                <Button type="button" onClick={addQuestion}>
                  <Save size={14} className="mr-1" />
                  Add Question
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowQuestionForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {formData.questions.map((question, index) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
                    <Badge variant="info" size="sm">{question.type}</Badge>
                    <Badge variant="secondary" size="sm">{question.marks} marks</Badge>
                  </div>
                  <p className="text-sm text-gray-900 mb-2">{question.question}</p>
                  
                  {question.type === 'multiple-choice' && (
                    <div className="space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-2 text-sm">
                          <span className={`w-2 h-2 rounded-full ${optIndex === question.correctAnswer ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                          <span className={optIndex === question.correctAnswer ? 'text-green-700 font-medium' : 'text-gray-600'}>
                            {option}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === 'true-false' && (
                    <p className="text-sm text-green-700 font-medium">
                      Correct Answer: {question.correctAnswer}
                    </p>
                  )}

                  {question.explanation && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>
          {test ? 'Update' : 'Create'} Test
        </Button>
      </div>
    </form>
  )
}

// College Form Component
const CollegeForm = ({ college, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: college?.name || '',
    code: college?.code || '',
    address: college?.address || '',
    phone: college?.phone || '',
    email: college?.email || '',
    website: college?.website || '',
    establishedYear: college?.establishedYear || new Date().getFullYear()
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="College Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <Input
          label="College Code"
          value={formData.code}
          onChange={(e) => setFormData({...formData, code: e.target.value})}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
        />
        <Input
          label="Website"
          value={formData.website}
          onChange={(e) => setFormData({...formData, website: e.target.value})}
        />
        <Input
          label="Established Year"
          type="number"
          value={formData.establishedYear}
          onChange={(e) => setFormData({...formData, establishedYear: parseInt(e.target.value)})}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>
          {college ? 'Update' : 'Create'} College
        </Button>
      </div>
    </form>
  )
}

// User Details Component
const UserDetailsView = ({ user, college, onClose }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant={
              user.role === 'admin' ? 'danger' : 
              user.role === 'instructor' ? 'warning' : 'info'
            }>
              {user.role}
            </Badge>
            <Badge variant={user.isActive ? 'success' : 'secondary'}>
              {user.isActive ? 'Active' : 'Inactive'}
            </Badge>
            {user.isVerified && (
              <Badge variant="success" size="sm">Verified</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">College</label>
          <p className="text-gray-900">{college?.name || 'N/A'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Joined Date</label>
          <p className="text-gray-900">{new Date(user.joinedDate).toLocaleDateString()}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Last Login</label>
          <p className="text-gray-900">
            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Assigned Courses</label>
          <p className="text-gray-900">{user.assignedCourses?.length || 0}</p>
        </div>
      </div>

      {user.role === 'instructor' && (
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">Permissions</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(user.permissions || {}).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <CheckCircle size={14} className={value ? 'text-green-500' : 'text-gray-300'} />
                <span className="text-sm text-gray-700">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button onClick={() => toast('User editing coming soon!')}>
          <Edit size={16} className="mr-2" />
          Edit User
        </Button>
      </div>
    </div>
  )
}

// System Health Component
const SystemHealthView = ({ analytics, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await onRefresh()
    setRefreshing(false)
    toast.success('System data refreshed')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          loading={refreshing}
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <CheckCircle size={32} className="mx-auto text-green-600 mb-2" />
          <div className="text-lg font-bold text-green-600">System Online</div>
          <div className="text-sm text-green-800">All services operational</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Activity size={32} className="mx-auto text-blue-600 mb-2" />
          <div className="text-lg font-bold text-blue-600">{analytics?.overview.systemUptime}</div>
          <div className="text-sm text-blue-800">Uptime</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Users size={32} className="mx-auto text-purple-600 mb-2" />
          <div className="text-lg font-bold text-purple-600">{analytics?.overview.activeUsers}</div>
          <div className="text-sm text-purple-800">Active Users</div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Performance Metrics</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Cpu size={16} className="text-blue-500" />
                <span className="text-sm font-medium text-gray-700">CPU Usage</span>
              </div>
              <span className="text-sm text-gray-900">{analytics?.performanceMetrics.cpuUsage}%</span>
            </div>
            <Progress value={analytics?.performanceMetrics.cpuUsage} size="sm" />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Database size={16} className="text-green-500" />
                <span className="text-sm font-medium text-gray-700">Memory Usage</span>
              </div>
              <span className="text-sm text-gray-900">{analytics?.performanceMetrics.memoryUsage}%</span>
            </div>
            <Progress value={analytics?.performanceMetrics.memoryUsage} size="sm" variant="accent" />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <HardDrive size={16} className="text-purple-500" />
                <span className="text-sm font-medium text-gray-700">Disk Usage</span>
              </div>
              <span className="text-sm text-gray-900">{analytics?.performanceMetrics.diskUsage}%</span>
            </div>
            <Progress value={analytics?.performanceMetrics.diskUsage} size="sm" variant="secondary" />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Wifi size={16} className="text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Network Latency</span>
              </div>
              <span className="text-sm text-gray-900">{analytics?.performanceMetrics.networkLatency}ms</span>
            </div>
            <Progress value={Math.min((analytics?.performanceMetrics.networkLatency / 100) * 100, 100)} size="sm" variant="warning" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboardPage