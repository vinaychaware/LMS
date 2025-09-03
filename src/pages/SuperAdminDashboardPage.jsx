import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Shield, 
  Users, 
  Building2, 
  BookOpen, 
  TrendingUp, 
  Activity,
  Plus,
  Edit,
  Eye,
  Trash2,
  Settings,
  UserCheck,
  UserX,
  Search,
  Filter,
  Download,
  BarChart3,
  Globe,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Award,
  Target,
  Bell,
  Calendar,
  FileText,
  ToggleLeft,
  ToggleRight,
  Lock,
  Unlock
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
  const [allUsers, setAllUsers] = useState([])
  const [allCourses, setAllCourses] = useState([])
  const [systemAnalytics, setSystemAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showCollegeModal, setShowCollegeModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showCreateCollegeModal, setShowCreateCollegeModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showSystemModal, setShowSystemModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterCollege, setFilterCollege] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')
  const [globalPermissions, setGlobalPermissions] = useState({
    adminsCanCreateCourses: true,
    adminsCanCreateTests: true,
    instructorsCanCreateCourses: true,
    instructorsCanCreateTests: true
  })

  useEffect(() => {
    fetchSuperAdminData()
  }, [])

  const fetchSuperAdminData = async () => {
    try {
      setLoading(true)
      
      const [collegesData, usersData, analyticsData] = await Promise.all([
        mockAPI.getAllColleges(),
        mockAPI.getAllStudents().then(students => [
          ...students,
          ...mockData.users.filter(u => ['admin', 'instructor', 'superadmin'].includes(u.role))
        ]),
        mockAPI.getSystemAnalytics()
      ])
      
      setColleges(collegesData)
      setAllUsers(usersData)
      setAllCourses(mockData.courses)
      setSystemAnalytics(analyticsData)
      
    } catch (error) {
      console.error('Error fetching super admin data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionToggle = async (permission) => {
    try {
      const newPermissions = {
        ...globalPermissions,
        [permission]: !globalPermissions[permission]
      }
      setGlobalPermissions(newPermissions)
      
      // Update all affected users
      const affectedUsers = allUsers.filter(user => {
        if (permission.startsWith('admins') && user.role === 'admin') return true
        if (permission.startsWith('instructors') && user.role === 'instructor') return true
        return false
      })
      
      const permissionKey = permission.includes('Courses') ? 'canCreateCourses' : 'canCreateTests'
      
      for (const affectedUser of affectedUsers) {
        await mockAPI.updateUserPermissions(affectedUser.id, {
          [permissionKey]: newPermissions[permission]
        })
      }
      
      toast.success(`Permission ${newPermissions[permission] ? 'granted' : 'revoked'} successfully`)
      await fetchSuperAdminData()
    } catch (error) {
      toast.error('Failed to update permissions')
    }
  }

  const createCollege = async (collegeData) => {
    try {
      await mockAPI.createCollege(collegeData)
      toast.success('College created successfully')
      setShowCreateCollegeModal(false)
      await fetchSuperAdminData()
    } catch (error) {
      toast.error('Failed to create college')
    }
  }

  const updateCollege = async (collegeId, updates) => {
    try {
      await mockAPI.updateCollege(collegeId, updates)
      toast.success('College updated successfully')
      await fetchSuperAdminData()
    } catch (error) {
      toast.error('Failed to update college')
    }
  }

  const deleteCollege = async (collegeId) => {
    if (window.confirm('Are you sure you want to delete this college? This action cannot be undone.')) {
      try {
        await mockAPI.deleteCollege(collegeId)
        toast.success('College deleted successfully')
        await fetchSuperAdminData()
      } catch (error) {
        toast.error('Failed to delete college')
      }
    }
  }

  const createUser = async (userData) => {
    try {
      await mockAPI.createUser(userData)
      toast.success('User created successfully')
      await fetchSuperAdminData()
    } catch (error) {
      toast.error('Failed to create user')
    }
  }

  const updateUserStatus = async (userId, isActive) => {
    try {
      await mockAPI.bulkUpdateUsers([userId], { isActive })
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`)
      await fetchSuperAdminData()
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await mockAPI.deleteUser(userId)
        toast.success('User deleted successfully')
        await fetchSuperAdminData()
      } catch (error) {
        toast.error('Failed to delete user')
      }
    }
  }

  const getFilteredUsers = () => {
    let filtered = allUsers.filter(u => u.role !== 'superadmin') // Don't show other super admins
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole)
    }
    
    if (filterCollege !== 'all') {
      filtered = filtered.filter(user => user.collegeId === filterCollege)
    }
    
    return filtered
  }

  const getCollegeStats = (collegeId) => {
    const collegeUsers = allUsers.filter(u => u.collegeId === collegeId)
    const collegeCourses = allCourses.filter(c => c.collegeId === collegeId)
    
    return {
      totalUsers: collegeUsers.length,
      admins: collegeUsers.filter(u => u.role === 'admin').length,
      instructors: collegeUsers.filter(u => u.role === 'instructor').length,
      students: collegeUsers.filter(u => u.role === 'student').length,
      courses: collegeCourses.length,
      activeUsers: collegeUsers.filter(u => u.isActive).length
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
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
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield size={24} className="text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-gray-600">
                  System-wide management and oversight • {colleges.length} colleges, {allUsers.length} users
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => setShowPermissionModal(true)}
              >
                <Settings size={16} className="mr-2" />
                Global Permissions
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowSystemModal(true)}
              >
                <Server size={16} className="mr-2" />
                System Health
              </Button>
              <Button onClick={() => setShowCreateCollegeModal(true)}>
                <Plus size={16} className="mr-2" />
                Add College
              </Button>
            </div>
          </div>
        </div>

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Colleges</p>
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.totalColleges || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
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
                <p className="text-xs text-gray-500">{systemAnalytics?.overview.activeUsers || 0} active</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.totalCourses || 0}</p>
                <p className="text-xs text-gray-500">{systemAnalytics?.overview.totalModules || 0} modules</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(systemAnalytics?.overview.totalRevenue || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">All colleges</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Activity size={24} className="text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.systemUptime || '99.9%'}</p>
                <p className="text-xs text-gray-500">Uptime</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview">
          <Tabs.List className="mb-6">
            <Tabs.Trigger value="overview">System Overview</Tabs.Trigger>
            <Tabs.Trigger value="colleges">Colleges</Tabs.Trigger>
            <Tabs.Trigger value="users">User Management</Tabs.Trigger>
            <Tabs.Trigger value="courses">Course Management</Tabs.Trigger>
            <Tabs.Trigger value="permissions">Global Permissions</Tabs.Trigger>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Content value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">College Performance</h3>
                <div className="space-y-4">
                  {colleges.map(college => {
                    const stats = getCollegeStats(college.id)
                    const performance = systemAnalytics?.collegeBreakdown?.[college.id]
                    
                    return (
                      <div key={college.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{college.name}</h4>
                          <Badge variant="info" size="sm">{college.code}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-medium text-gray-900">{stats.totalUsers}</div>
                            <div className="text-gray-500">Users</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-gray-900">{stats.courses}</div>
                            <div className="text-gray-500">Courses</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-gray-900">
                              ${(performance?.revenue || 0).toLocaleString()}
                            </div>
                            <div className="text-gray-500">Revenue</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle size={16} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">New college registered</p>
                      <p className="text-xs text-gray-500">Creative Arts Institute - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Users size={16} className="text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Admin permissions updated</p>
                      <p className="text-xs text-gray-500">Course creation enabled - 4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <BookOpen size={16} className="text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">System backup completed</p>
                      <p className="text-xs text-gray-500">All data secured - 6 hours ago</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Tabs.Content>

          {/* Colleges Tab */}
          <Tabs.Content value="colleges">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">College Management</h3>
                <Button onClick={() => setShowCreateCollegeModal(true)}>
                  <Plus size={16} className="mr-2" />
                  Add College
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colleges.map(college => {
                  const stats = getCollegeStats(college.id)
                  
                  return (
                    <div key={college.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
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
                            <h4 className="font-medium text-gray-900">{college.name}</h4>
                            <p className="text-sm text-gray-600">{college.code}</p>
                            <Badge variant={college.status === 'active' ? 'success' : 'secondary'} size="sm">
                              {college.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedCollege(college)
                              setShowCollegeModal(true)
                            }}
                          >
                            <Eye size={14} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast('Edit college functionality coming soon')}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteCollege(college.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="font-medium text-blue-900">{stats.totalUsers}</div>
                            <div className="text-blue-700">Total Users</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="font-medium text-green-900">{stats.courses}</div>
                            <div className="text-green-700">Courses</div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex justify-between">
                            <span>Admins:</span>
                            <span>{stats.admins}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Instructors:</span>
                            <span>{stats.instructors}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Students:</span>
                            <span>{stats.students}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Active Users:</span>
                            <span>{stats.activeUsers}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </Tabs.Content>

          {/* Users Tab */}
          <Tabs.Content value="users">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
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
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredUsers().map(user => {
                      const college = colleges.find(c => c.id === user.collegeId)
                      
                      return (
                        <tr key={user.id}>
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
                            {college?.name || 'Unassigned'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={user.isActive ? 'success' : 'secondary'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.joinedDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setShowUserModal(true)
                                }}
                              >
                                <Eye size={14} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateUserStatus(user.id, !user.isActive)}
                              >
                                {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteUser(user.id)}
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
            </Card>
          </Tabs.Content>

          {/* Courses Tab */}
          <Tabs.Content value="courses">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Course Management</h3>
                <Button onClick={() => toast('Super Admin course creation coming soon!')}>
                  <Plus size={16} className="mr-2" />
                  Create Course
                </Button>
              </div>
              
              <div className="space-y-4">
                {allCourses.map(course => {
                  const college = colleges.find(c => c.id === course.collegeId)
                  const instructor = allUsers.find(u => course.assignedInstructors.includes(u.id))
                  
                  return (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            <img 
                              src={course.thumbnail} 
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{course.title}</h4>
                            <p className="text-sm text-gray-600">by {instructor?.name || 'Unassigned'}</p>
                            <p className="text-sm text-gray-500">{college?.name || 'Unknown College'}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant={course.status === 'published' ? 'success' : 'warning'}>
                                {course.status}
                              </Badge>
                              <Badge variant="info" size="sm">{course.level}</Badge>
                              <Badge variant="default" size="sm">{course.category}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-2">
                            {course.enrolledStudents?.length || 0} students • ${course.price}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast('Course details coming soon')}
                            >
                              <Eye size={14} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast('Course editing coming soon')}
                            >
                              <Edit size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </Tabs.Content>

          {/* Global Permissions Tab */}
          <Tabs.Content value="permissions">
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Permission Management</h3>
                <p className="text-gray-600">
                  Control system-wide permissions for course and test creation across all colleges.
                </p>
              </div>
              
              <div className="space-y-6">
                {/* Admin Permissions */}
                <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="text-lg font-medium text-red-900 mb-4 flex items-center">
                    <Shield size={20} className="mr-2" />
                    College Admin Permissions
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">Course Creation</h5>
                        <p className="text-sm text-gray-600">Allow college admins to create new courses</p>
                      </div>
                      <button
                        onClick={() => handlePermissionToggle('adminsCanCreateCourses')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          globalPermissions.adminsCanCreateCourses ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            globalPermissions.adminsCanCreateCourses ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">Test Creation</h5>
                        <p className="text-sm text-gray-600">Allow college admins to create and manage tests</p>
                      </div>
                      <button
                        onClick={() => handlePermissionToggle('adminsCanCreateTests')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          globalPermissions.adminsCanCreateTests ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            globalPermissions.adminsCanCreateTests ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instructor Permissions */}
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="text-lg font-medium text-green-900 mb-4 flex items-center">
                    <BookOpen size={20} className="mr-2" />
                    Instructor Permissions
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">Course Creation</h5>
                        <p className="text-sm text-gray-600">Allow instructors to create new courses</p>
                      </div>
                      <button
                        onClick={() => handlePermissionToggle('instructorsCanCreateCourses')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          globalPermissions.instructorsCanCreateCourses ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            globalPermissions.instructorsCanCreateCourses ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">Test Creation</h5>
                        <p className="text-sm text-gray-600">Allow instructors to create and manage tests</p>
                      </div>
                      <button
                        onClick={() => handlePermissionToggle('instructorsCanCreateTests')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          globalPermissions.instructorsCanCreateTests ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            globalPermissions.instructorsCanCreateTests ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Permission Summary */}
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-lg font-medium text-blue-900 mb-4">Current Permission Status</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Admins Can:</h5>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center space-x-2">
                          {globalPermissions.adminsCanCreateCourses ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <X size={16} className="text-red-600" />
                          )}
                          <span>Create Courses</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          {globalPermissions.adminsCanCreateTests ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <X size={16} className="text-red-600" />
                          )}
                          <span>Create Tests</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Instructors Can:</h5>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center space-x-2">
                          {globalPermissions.instructorsCanCreateCourses ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <X size={16} className="text-red-600" />
                          )}
                          <span>Create Courses</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          {globalPermissions.instructorsCanCreateTests ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <X size={16} className="text-red-600" />
                          )}
                          <span>Create Tests</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Tabs.Content>
        </Tabs>
      </div>

      {/* College Details Modal */}
      <Modal
        isOpen={showCollegeModal}
        onClose={() => setShowCollegeModal(false)}
        title={selectedCollege?.name}
        size="lg"
      >
        {selectedCollege && (
          <CollegeDetailsView 
            college={selectedCollege} 
            stats={getCollegeStats(selectedCollege.id)}
            onClose={() => setShowCollegeModal(false)}
          />
        )}
      </Modal>

      {/* User Details Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={selectedUser?.name}
        size="lg"
      >
        {selectedUser && (
          <UserDetailsView 
            user={selectedUser} 
            college={colleges.find(c => c.id === selectedUser.collegeId)}
            courses={allCourses.filter(c => 
              selectedUser.role === 'instructor' ? c.assignedInstructors.includes(selectedUser.id) :
              selectedUser.role === 'student' ? selectedUser.assignedCourses?.includes(c.id) :
              c.collegeId === selectedUser.collegeId
            )}
            onClose={() => setShowUserModal(false)}
          />
        )}
      </Modal>

      {/* Global Permissions Modal */}
      <Modal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        title="Global Permission Management"
        size="lg"
      >
        <div className="space-y-6">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle size={16} className="text-yellow-600" />
              <span className="font-medium text-yellow-800">Important Notice</span>
            </div>
            <p className="text-sm text-yellow-700">
              These settings affect all colleges and users system-wide. Changes will be applied immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Admin Permissions */}
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-lg font-medium text-red-900 mb-4 flex items-center">
                <Shield size={20} className="mr-2" />
                College Admin Rights
              </h4>
              <div className="space-y-4">
                <PermissionToggle
                  title="Course Creation"
                  description="Allow college admins to create new courses"
                  enabled={globalPermissions.adminsCanCreateCourses}
                  onToggle={() => handlePermissionToggle('adminsCanCreateCourses')}
                />
                <PermissionToggle
                  title="Test Management"
                  description="Allow college admins to create and manage tests"
                  enabled={globalPermissions.adminsCanCreateTests}
                  onToggle={() => handlePermissionToggle('adminsCanCreateTests')}
                />
              </div>
            </div>

            {/* Instructor Permissions */}
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-lg font-medium text-green-900 mb-4 flex items-center">
                <BookOpen size={20} className="mr-2" />
                Instructor Rights
              </h4>
              <div className="space-y-4">
                <PermissionToggle
                  title="Course Creation"
                  description="Allow instructors to create new courses"
                  enabled={globalPermissions.instructorsCanCreateCourses}
                  onToggle={() => handlePermissionToggle('instructorsCanCreateCourses')}
                />
                <PermissionToggle
                  title="Test Management"
                  description="Allow instructors to create and manage tests"
                  enabled={globalPermissions.instructorsCanCreateTests}
                  onToggle={() => handlePermissionToggle('instructorsCanCreateTests')}
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">Affected Users</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-800">College Admins: </span>
                <span className="font-medium">{allUsers.filter(u => u.role === 'admin').length}</span>
              </div>
              <div>
                <span className="text-blue-800">Instructors: </span>
                <span className="font-medium">{allUsers.filter(u => u.role === 'instructor').length}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Create College Modal */}
      <Modal
        isOpen={showCreateCollegeModal}
        onClose={() => setShowCreateCollegeModal(false)}
        title="Create New College"
        size="lg"
      >
        <CreateCollegeForm 
          onSubmit={createCollege}
          onCancel={() => setShowCreateCollegeModal(false)}
        />
      </Modal>

      {/* System Health Modal */}
      <Modal
        isOpen={showSystemModal}
        onClose={() => setShowSystemModal(false)}
        title="System Health & Performance"
        size="lg"
      >
        <SystemHealthView analytics={systemAnalytics} />
      </Modal>
    </div>
  )
}

// Permission Toggle Component
const PermissionToggle = ({ title, description, enabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h5 className="font-medium text-gray-900">{title}</h5>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-green-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

// College Details Component
const CollegeDetailsView = ({ college, stats, onClose }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
          <img 
            src={college.logo} 
            alt={college.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{college.name}</h3>
          <p className="text-gray-600">{college.code}</p>
          <Badge variant={college.status === 'active' ? 'success' : 'secondary'}>
            {college.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Address</label>
          <p className="text-gray-900">{college.address}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Phone</label>
          <p className="text-gray-900">{college.phone}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <p className="text-gray-900">{college.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Website</label>
          <p className="text-gray-900">{college.website}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Established</label>
          <p className="text-gray-900">{college.establishedYear}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Created</label>
          <p className="text-gray-900">{new Date(college.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Current Statistics</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-sm text-blue-800">Total Users</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">{stats.courses}</div>
            <div className="text-sm text-green-800">Courses</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-xl font-bold text-purple-600">{stats.activeUsers}</div>
            <div className="text-sm text-purple-800">Active Users</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={() => toast('College editing functionality coming soon')}>
          <Edit size={16} className="mr-2" />
          Edit College
        </Button>
      </div>
    </div>
  )
}

// User Details Component
const UserDetailsView = ({ user, college, courses, onClose }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-full h-full object-cover"
          />
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
              <Badge variant="info">Verified</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">College</label>
          <p className="text-gray-900">{college?.name || 'Unassigned'}</p>
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
            {user.role === 'instructor' ? 'Students' : user.role === 'student' ? 'Courses' : 'Managed Users'}
          </label>
          <p className="text-gray-900">
            {user.role === 'instructor' 
              ? user.students?.length || 0
              : user.role === 'student' 
                ? user.assignedCourses?.length || 0
                : 'N/A'
            }
          </p>
        </div>
      </div>

      {user.permissions && (
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">Permissions</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(user.permissions).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {courses.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">
            {user.role === 'instructor' ? 'Teaching Courses' : user.role === 'student' ? 'Enrolled Courses' : 'College Courses'}
          </label>
          <div className="space-y-2">
            {courses.slice(0, 5).map(course => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
                  <p className="text-xs text-gray-500">{course.category} • {course.level}</p>
                </div>
                <Badge variant={course.status === 'published' ? 'success' : 'warning'} size="sm">
                  {course.status}
                </Badge>
              </div>
            ))}
            {courses.length > 5 && (
              <p className="text-sm text-gray-500 text-center">
                +{courses.length - 5} more courses
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={() => toast('User editing functionality coming soon')}>
          <Edit size={16} className="mr-2" />
          Edit User
        </Button>
      </div>
    </div>
  )
}

// Create College Form Component
const CreateCollegeForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    establishedYear: new Date().getFullYear()
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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="College Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter college name"
          required
        />
        <Input
          label="College Code"
          value={formData.code}
          onChange={(e) => handleChange('code', e.target.value)}
          placeholder="e.g., TECH001"
          required
        />
      </div>
      
      <Input
        label="Address"
        value={formData.address}
        onChange={(e) => handleChange('address', e.target.value)}
        placeholder="Enter full address"
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1-555-0123"
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="admin@college.edu"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Website"
          value={formData.website}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="https://college.edu"
        />
        <Input
          label="Established Year"
          type="number"
          value={formData.establishedYear}
          onChange={(e) => handleChange('establishedYear', parseInt(e.target.value))}
          min="1800"
          max={new Date().getFullYear()}
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Create College
        </Button>
      </div>
    </form>
  )
}

// System Health View Component
const SystemHealthView = ({ analytics }) => {
  const performanceMetrics = analytics?.performanceMetrics || {}
  
  const getHealthColor = (value, thresholds) => {
    if (value < thresholds.good) return 'success'
    if (value < thresholds.warning) return 'warning'
    return 'danger'
  }

  const metrics = [
    {
      name: 'CPU Usage',
      value: performanceMetrics.cpuUsage || 45,
      unit: '%',
      icon: <Cpu size={20} />,
      thresholds: { good: 70, warning: 85 }
    },
    {
      name: 'Memory Usage',
      value: performanceMetrics.memoryUsage || 62,
      unit: '%',
      icon: <Database size={20} />,
      thresholds: { good: 75, warning: 90 }
    },
    {
      name: 'Disk Usage',
      value: performanceMetrics.diskUsage || 38,
      unit: '%',
      icon: <HardDrive size={20} />,
      thresholds: { good: 80, warning: 95 }
    },
    {
      name: 'Network Latency',
      value: performanceMetrics.networkLatency || 12,
      unit: 'ms',
      icon: <Wifi size={20} />,
      thresholds: { good: 50, warning: 100 }
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {metrics.map(metric => {
          const healthColor = getHealthColor(metric.value, metric.thresholds)
          
          return (
            <div key={metric.name} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${
                    healthColor === 'success' ? 'bg-green-100 text-green-600' :
                    healthColor === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {metric.icon}
                  </div>
                  <span className="font-medium text-gray-900">{metric.name}</span>
                </div>
                <Badge variant={healthColor}>
                  {metric.value}{metric.unit}
                </Badge>
              </div>
              <Progress 
                value={metric.value} 
                max={metric.name === 'Network Latency' ? 200 : 100}
                variant={healthColor === 'success' ? 'success' : healthColor === 'warning' ? 'warning' : 'danger'}
                size="sm"
                showLabel={false}
              />
            </div>
          )
        })}
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">System Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Uptime:</span>
            <span className="ml-2 font-medium">{analytics?.overview.systemUptime || '99.9%'}</span>
          </div>
          <div>
            <span className="text-gray-600">Error Rate:</span>
            <span className="ml-2 font-medium">{performanceMetrics.errorRate || 0.02}%</span>
          </div>
          <div>
            <span className="text-gray-600">Response Time:</span>
            <span className="ml-2 font-medium">{performanceMetrics.responseTime || 145}ms</span>
          </div>
          <div>
            <span className="text-gray-600">Active Sessions:</span>
            <span className="ml-2 font-medium">{analytics?.overview.monthlyActiveUsers || 11}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboardPage