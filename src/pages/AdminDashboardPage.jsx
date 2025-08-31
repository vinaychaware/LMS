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
  Server
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { mockAPI, mockData } from '../services/mockData'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    publishedCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    averageRating: 0
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [recentCourses, setRecentCourses] = useState([])
  const [systemAlerts, setSystemAlerts] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUsersModal, setShowUsersModal] = useState(false)
  const [showCoursesModal, setShowCoursesModal] = useState(false)
  const [showSystemModal, setShowSystemModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('all')

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      
      // Fetch system stats
      const systemStats = await mockAPI.getSystemStats()
      setStats(systemStats)
      
      // Get recent users (last 5)
      const sortedUsers = [...mockData.users]
        .sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate))
        .slice(0, 5)
      setRecentUsers(sortedUsers)
      
      // Get recent courses (last 5)
      const sortedCourses = [...mockData.courses]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
      setRecentCourses(sortedCourses)
      
      // Set system alerts
      setSystemAlerts(mockData.systemAlerts)
      
      // Set all users for management
      setAllUsers(mockData.users)
      
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId, action) => {
    try {
      switch (action) {
        case 'activate':
          await mockAPI.updateUser(userId, { isActive: true })
          setAllUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, isActive: true } : user
          ))
          toast.success('User activated successfully')
          break
        case 'deactivate':
          await mockAPI.updateUser(userId, { isActive: false })
          setAllUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, isActive: false } : user
          ))
          toast.success('User deactivated successfully')
          break
        case 'verify':
          await mockAPI.updateUser(userId, { isVerified: true })
          setAllUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, isVerified: true } : user
          ))
          toast.success('User verified successfully')
          break
        case 'delete':
          if (window.confirm('Are you sure you want to delete this user?')) {
            await mockAPI.deleteUser(userId)
            setAllUsers(prev => prev.filter(user => user.id !== userId))
            toast.success('User deleted successfully')
          }
          break
        default:
          break
      }
    } catch (error) {
      toast.error('Action failed. Please try again.')
    }
  }

  const handleBulkAction = (action) => {
    toast.info(`Bulk ${action} functionality coming soon!`)
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'pending':
        return 'warning'
      case 'suspended':
        return 'danger'
      default:
        return 'default'
    }
  }

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter
    return matchesSearch && matchesRole
  })

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
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Monitor system performance, manage users, and oversee platform operations.
              </p>
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
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowUsersModal(true)}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600">+{stats.activeUsers} active</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                <p className="text-xs text-green-600">+{stats.publishedCourses} published</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.totalRevenue)}
                </p>
                <p className="text-xs text-green-600">+12% this month</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                <p className="text-xs text-green-600">+0.2 this week</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Users */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header className="flex items-center justify-between">
                <Card.Title>Recent Users</Card.Title>
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
                    onClick={() => toast.info('Add user functionality coming soon!')}
                  >
                    <UserPlus size={16} className="mr-2" />
                    Add User
                  </Button>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="info" size="sm">{user.role}</Badge>
                            <span className="text-xs text-gray-500">
                              Joined {new Date(user.joinedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.isActive ? 'success' : 'danger'} size="sm">
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant={user.isVerified ? 'success' : 'warning'} size="sm">
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowUsersModal(true)
                            }}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUserAction(user.id, user.isActive ? 'deactivate' : 'activate')}
                          >
                            {user.isActive ? <XCircle size={14} /> : <CheckCircle size={14} />}
                          </Button>
                        </div>
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

            {/* Quick Actions */}
            <Card>
              <Card.Header>
                <Card.Title>Quick Actions</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-3">
                <Button 
                  className="w-full justify-start"
                  onClick={() => toast.info('Create user functionality coming soon!')}
                >
                  <UserPlus size={16} className="mr-2" />
                  Create New User
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowCoursesModal(true)}
                >
                  <BookOpen size={16} className="mr-2" />
                  Review Courses
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info('Analytics page coming soon!')}
                >
                  <BarChart3 size={16} className="mr-2" />
                  View Analytics
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info('Settings page coming soon!')}
                >
                  <Settings size={16} className="mr-2" />
                  System Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info('Backup functionality coming soon!')}
                >
                  <Download size={16} className="mr-2" />
                  Export Data
                </Button>
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
                    <span className="text-sm text-gray-600">File Storage</span>
                    <Badge variant="success" size="sm">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Service</span>
                    <Badge variant="warning" size="sm">Slow</Badge>
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
              onClick={() => handleBulkAction('export')}
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
                      <Shield size={14} />
                    </Button>
                  )}
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

          {/* Bulk Actions */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Bulk Actions:</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleBulkAction('activate')}
              >
                Activate Selected
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleBulkAction('deactivate')}
              >
                Deactivate Selected
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleBulkAction('verify')}
              >
                Verify Selected
              </Button>
            </div>
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
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">All Courses ({mockData.courses.length})</h4>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => toast.info('Export functionality coming soon!')}
              >
                <Download size={16} className="mr-1" />
                Export
              </Button>
              <Button 
                size="sm"
                onClick={() => toast.info('Course approval system coming soon!')}
              >
                Review Pending
              </Button>
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mockData.courses.map((course) => (
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
                      <Badge variant={getStatusColor(course.status)} size="sm">
                        {course.status}
                      </Badge>
                      <Badge variant="info" size="sm">{course.category}</Badge>
                      <span className="text-xs text-gray-500">
                        {course.studentsCount} students
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(course.price)}
                  </span>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm">
                      <Eye size={14} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                    <div className="text-sm text-green-700">Healthy</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Server size={20} className="text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">API Server</div>
                    <div className="text-sm text-green-700">Online</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <Globe size={20} className="text-yellow-600" />
                  <div>
                    <div className="font-medium text-yellow-900">CDN</div>
                    <div className="text-sm text-yellow-700">Slow</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Shield size={20} className="text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">Security</div>
                    <div className="text-sm text-green-700">Protected</div>
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
                  <span>45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory Usage</span>
                  <span>67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Disk Usage</span>
                  <span>23%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Logs */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Recent System Logs</h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-40 overflow-y-auto">
              <div>[2024-01-20 10:30:15] INFO: User login successful - student@demo.com</div>
              <div>[2024-01-20 10:28:42] INFO: Course created - "Advanced JavaScript"</div>
              <div>[2024-01-20 10:25:33] WARN: High memory usage detected - 67%</div>
              <div>[2024-01-20 10:20:18] INFO: Payment processed - $99.99</div>
              <div>[2024-01-20 10:15:07] INFO: Database backup completed</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminDashboardPage