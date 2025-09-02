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
  RefreshCw
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
  const [systemAnalytics, setSystemAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showCollegeModal, setShowCollegeModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showSystemModal, setShowSystemModal] = useState(false)
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
      const [collegesData, adminsData, instructorsData, studentsData, analyticsData] = await Promise.all([
        mockAPI.getAllColleges(),
        mockAPI.getAllAdmins(),
        mockAPI.getAllInstructors(),
        mockAPI.getAllStudents(),
        mockAPI.getSystemAnalytics()
      ])
      
      setColleges(collegesData)
      setAdmins(adminsData)
      setInstructors(instructorsData)
      setStudents(studentsData)
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('colleges')}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Colleges</p>
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.totalColleges}</p>
                <p className="text-xs text-gray-500">Active institutions</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('users')}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(systemAnalytics?.overview.totalAdmins || 0) + 
                   (systemAnalytics?.overview.totalInstructors || 0) + 
                   (systemAnalytics?.overview.totalStudents || 0)}
                </p>
                <p className="text-xs text-gray-500">{systemAnalytics?.overview.activeUsers} active</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('courses')}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.totalCourses}</p>
                <p className="text-xs text-gray-500">{systemAnalytics?.overview.totalModules} modules</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowSystemModal(true)}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Activity size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.systemUptime}</p>
                <p className="text-xs text-gray-500">Uptime</p>
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
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle size={16} className="text-yellow-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">System maintenance scheduled</p>
                        <p className="text-xs text-gray-500">Tomorrow 2:00 AM - 4:00 AM</p>
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
                      
                      {/* College Admin Assignment */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">College Admin:</h5>
                        {(() => {
                          const collegeAdmin = admins.find(admin => admin.collegeId === college.id);
                          return collegeAdmin ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                                <img src={collegeAdmin.avatar} alt={collegeAdmin.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-sm text-gray-900">{collegeAdmin.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">No admin assigned</span>
                          );
                        })()}
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

          {/* Users Tab */}
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
                {/* Admin-Course Assignments Overview */}
                <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3">Admin-Course Assignments</h4>
                  <div className="space-y-2">
                    {admins.map(admin => {
                      const adminCourses = courses.filter(course => course.createdBy === admin.id);
                      const college = colleges.find(c => c.id === admin.collegeId);
                      return (
                        <div key={admin.id} className="flex items-center justify-between p-2 bg-white rounded">
                          <div className="flex items-center space-x-2">
                            <img src={admin.avatar} alt={admin.name} className="w-6 h-6 rounded-full" />
                            <span className="text-sm font-medium">{admin.name}</span>
                            <span className="text-xs text-gray-500">({college?.name})</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {adminCourses.length} courses managed
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Course-User Assignments Overview */}
                <div className="mb-8 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-3">Course Assignments</h4>
                  <div className="space-y-3">
                    {courses.map(course => {
                      const assignedStudents = students.filter(student => 
                        student.assignedCourses.includes(course.id)
                      );
                      const assignedInstructors = instructors.filter(instructor => 
                        course.assignedInstructors.includes(instructor.id)
                      );
                      const college = colleges.find(c => c.id === course.collegeId);
                      
                      return (
                        <div key={course.id} className="p-3 bg-white rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h5 className="font-medium text-gray-900">{course.title}</h5>
                              <p className="text-xs text-gray-500">{college?.name}</p>
                            </div>
                            <Badge variant={course.status === 'published' ? 'success' : 'warning'} size="sm">
                              {course.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Instructors: </span>
                              <span className="font-medium">
                                {assignedInstructors.map(i => i.name).join(', ') || 'None'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Students: </span>
                              <span className="font-medium">{assignedStudents.length}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignments</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredUsers().map(user => {
                        const college = colleges.find(c => c.id === user.collegeId)
                        const userAssignments = user.role === 'instructor' 
                          ? courses.filter(c => c.assignedInstructors.includes(user.id))
                          : user.role === 'student' 
                            ? courses.filter(c => user.assignedCourses?.includes(c.id))
                            : courses.filter(c => c.createdBy === user.id);
                        
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
                              <div className="text-sm text-gray-900">
                                {userAssignments.length} course{userAssignments.length !== 1 ? 's' : ''}
                              </div>
                              {userAssignments.length > 0 && (
                                <div className="text-xs text-gray-500">
                                  {userAssignments.slice(0, 2).map(c => c.title).join(', ')}
                                  {userAssignments.length > 2 && ` +${userAssignments.length - 2} more`}
                                </div>
                              )}
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
                      const collegeAdmin = admins.find(admin => admin.collegeId === college.id);
                      const collegeInstructors = instructors.filter(instructor => instructor.collegeId === college.id);
                      const collegeStudents = students.filter(student => student.collegeId === college.id);
                      const collegeCourses = courses.filter(course => course.collegeId === college.id);
                      
                      return (
                        <div key={college.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">{college.name}</h4>
                              <Badge variant="info" size="sm">{college.code}</Badge>
                              <img src={college.logo} alt={college.name} className="w-8 h-8 rounded object-cover" />
                            <Badge variant="info" size="sm">${breakdown?.revenue || 0}</Badge>
                          </div>
                          
                          <div className="mb-3 p-2 bg-gray-50 rounded">
                            <div className="text-xs text-gray-600 mb-1">Admin: {collegeAdmin?.name || 'Unassigned'}</div>
                            <div className="text-xs text-gray-500">
                              Manages {collegeCourses.length} courses with {collegeInstructors.length} instructors
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="font-medium text-gray-900">{collegeStudents.length}</div>
                              <div className="text-gray-500">Students</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-gray-900">{collegeInstructors.length}</div>
                              <div className="text-gray-500">Instructors</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-gray-900">{collegeCourses.length}</div>
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

// User Details Component
const UserDetailsView = ({ user, college, courses, onClose }) => {
  const userCourses = user.role === 'instructor' 
    ? courses.filter(c => c.assignedInstructors.includes(user.id))
    : user.role === 'student' 
      ? courses.filter(c => user.assignedCourses?.includes(c.id))
      : courses.filter(c => c.createdBy === user.id);

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
          <label className="text-sm font-medium text-gray-600">
            {user.role === 'instructor' ? 'Teaching Courses' : 
             user.role === 'student' ? 'Enrolled Courses' : 'Managed Courses'}
          </label>
          <p className="text-gray-900">{userCourses.length}</p>
        </div>
      </div>

      {userCourses.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">Course Assignments</label>
          <div className="space-y-2">
            {userCourses.map(course => (
              <div key={course.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-900">{course.title}</span>
                <Badge variant={course.status === 'published' ? 'success' : 'warning'} size="sm">
                  {course.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {user.role === 'instructor' && user.permissions && (
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">Permissions</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(user.permissions).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`}></div>
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