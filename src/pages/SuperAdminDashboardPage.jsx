import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Shield, 
  Users, 
  BookOpen, 
  Building, 
  TrendingUp, 
  Award, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Activity,
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Globe,
  DollarSign,
  Zap,
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { mockAPI, mockData } from '../services/mockData'
import useAuthStore from '../store/useAuthStore'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Progress from '../components/ui/Progress'

const SuperAdminDashboardPage = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItems, setSelectedItems] = useState([])
  const [showCollegeModal, setShowCollegeModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [filter, setFilter] = useState('all')
  
  // Data states
  const [colleges, setColleges] = useState([])
  const [admins, setAdmins] = useState([])
  const [instructors, setInstructors] = useState([])
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [systemAnalytics, setSystemAnalytics] = useState(null)

  useEffect(() => {
    fetchSuperAdminData()
  }, [])

  const fetchSuperAdminData = async () => {
    try {
      setLoading(true)
      
      // Get all system data
      const [
        collegesData,
        adminsData,
        instructorsData,
        studentsData,
        analyticsData
      ] = await Promise.all([
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
      setCourses(mockData.courses)
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
        case 'edit':
          const college = colleges.find(c => c.id === collegeId)
          setSelectedCollege(college)
          setShowCollegeModal(true)
          break
        case 'view':
          const collegeToView = colleges.find(c => c.id === collegeId)
          setSelectedCollege(collegeToView)
          setShowCollegeModal(true)
          break
        case 'delete':
          if (window.confirm('Are you sure you want to delete this college?')) {
            await mockAPI.deleteCollege(collegeId)
            toast.success('College deleted successfully')
            await fetchSuperAdminData()
          }
          break
        default:
          break
      }
    } catch (error) {
      toast.error(`Failed to ${action} college`)
    }
  }

  const handleUserAction = async (userId, action) => {
    try {
      switch (action) {
        case 'activate':
          await mockAPI.bulkUpdateUsers([userId], { isActive: true })
          toast.success('User activated successfully')
          break
        case 'deactivate':
          await mockAPI.bulkUpdateUsers([userId], { isActive: false })
          toast.success('User deactivated successfully')
          break
        case 'delete':
          if (window.confirm('Are you sure you want to delete this user?')) {
            await mockAPI.deleteUser(userId)
            toast.success('User deleted successfully')
          }
          break
        case 'edit':
          const userToEdit = [...admins, ...instructors, ...students].find(u => u.id === userId)
          setSelectedUser(userToEdit)
          setShowUserModal(true)
          break
        case 'view':
          const userToView = [...admins, ...instructors, ...students].find(u => u.id === userId)
          setSelectedUser(userToView)
          setShowUserModal(true)
          break
        default:
          break
      }
      
      if (action !== 'edit' && action !== 'view') {
        await fetchSuperAdminData()
      }
    } catch (error) {
      toast.error(`Failed to ${action} user`)
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) {
      toast.error('Please select items first')
      return
    }
    
    try {
      switch (action) {
        case 'activate':
          await mockAPI.bulkUpdateUsers(selectedItems, { isActive: true })
          toast.success(`${selectedItems.length} users activated`)
          break
        case 'deactivate':
          await mockAPI.bulkUpdateUsers(selectedItems, { isActive: false })
          toast.success(`${selectedItems.length} users deactivated`)
          break
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
            for (const itemId of selectedItems) {
              if (activeTab === 'colleges') {
                await mockAPI.deleteCollege(itemId)
              } else {
                await mockAPI.deleteUser(itemId)
              }
            }
            toast.success(`${selectedItems.length} items deleted`)
          }
          break
        default:
          break
      }
      
      setSelectedItems([])
      await fetchSuperAdminData()
    } catch (error) {
      toast.error(`Failed to ${action} items`)
    }
  }

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const createNewCollege = async (collegeData) => {
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

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && college.status === 'active') ||
                         (filter === 'inactive' && college.status === 'inactive')
    return matchesSearch && matchesFilter
  })

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && admin.isActive) ||
                         (filter === 'inactive' && !admin.isActive)
    return matchesSearch && matchesFilter
  })

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && instructor.isActive) ||
                         (filter === 'inactive' && !instructor.isActive)
    return matchesSearch && matchesFilter
  })

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && student.isActive) ||
                         (filter === 'inactive' && !student.isActive)
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading super admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield size={24} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600">System-wide management and analytics</p>
            </div>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Colleges</p>
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.totalColleges}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield size={24} className="text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.totalAdmins}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Instructors</p>
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.totalInstructors}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.totalStudents}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Courses</p>
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.totalCourses}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${systemAnalytics?.overview.totalRevenue?.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* System Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <Activity size={20} className="mr-2 text-green-500" />
                System Performance
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">CPU Usage</span>
                    <span className="font-medium">{systemAnalytics?.performanceMetrics.cpuUsage}%</span>
                  </div>
                  <Progress value={systemAnalytics?.performanceMetrics.cpuUsage} size="sm" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Memory Usage</span>
                    <span className="font-medium">{systemAnalytics?.performanceMetrics.memoryUsage}%</span>
                  </div>
                  <Progress value={systemAnalytics?.performanceMetrics.memoryUsage} size="sm" variant="warning" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Disk Usage</span>
                    <span className="font-medium">{systemAnalytics?.performanceMetrics.diskUsage}%</span>
                  </div>
                  <Progress value={systemAnalytics?.performanceMetrics.diskUsage} size="sm" variant="accent" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Network Latency</span>
                    <span className="font-medium">{systemAnalytics?.performanceMetrics.networkLatency}ms</span>
                  </div>
                  <Progress value={systemAnalytics?.performanceMetrics.networkLatency} max={100} size="sm" variant="danger" />
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <BarChart3 size={20} className="mr-2 text-blue-500" />
                System Statistics
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{systemAnalytics?.overview.systemUptime}</div>
                  <div className="text-sm text-blue-800">System Uptime</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{systemAnalytics?.overview.activeUsers}</div>
                  <div className="text-sm text-green-800">Active Users</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{systemAnalytics?.overview.avgCourseCompletion}%</div>
                  <div className="text-sm text-purple-800">Avg Completion</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{systemAnalytics?.performanceMetrics.errorRate}%</div>
                  <div className="text-sm text-yellow-800">Error Rate</div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'colleges', name: 'Colleges', icon: Building },
                { id: 'admins', name: 'Admins', icon: Shield },
                { id: 'instructors', name: 'Instructors', icon: Users },
                { id: 'students', name: 'Students', icon: Users },
                { id: 'system', name: 'System', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <Card.Header>
                <Card.Title>College Performance</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {Object.entries(systemAnalytics?.collegeBreakdown || {}).map(([collegeId, data]) => {
                    const college = colleges.find(c => c.id === collegeId)
                    return (
                      <div key={collegeId} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-900">{college?.name || collegeId}</h4>
                          <span className="text-sm text-gray-600">${data.revenue?.toLocaleString()}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                          <div>{data.students} students</div>
                          <div>{data.instructors} instructors</div>
                          <div>{data.courses} courses</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Recent System Events</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">System backup completed</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">New college registered</p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertCircle size={16} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">High CPU usage detected</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        )}

        {activeTab === 'colleges' && (
          <div>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search colleges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                {selectedItems.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete ({selectedItems.length})
                  </Button>
                )}
                <Button 
                  size="sm"
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

            {/* Colleges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college) => (
                <Card key={college.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Card.Content className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(college.id)}
                        onChange={() => toggleItemSelection(college.id)}
                        className="rounded border-gray-300"
                      />
                      <Badge variant={college.status === 'active' ? 'success' : 'danger'} size="sm">
                        {college.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <img 
                          src={college.logo} 
                          alt={college.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{college.name}</h3>
                        <p className="text-sm text-gray-600">{college.code}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                      <div>
                        <div className="font-medium text-gray-900">{college.totalStudents}</div>
                        <div className="text-gray-500">Students</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{college.totalInstructors}</div>
                        <div className="text-gray-500">Instructors</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{college.totalCourses}</div>
                        <div className="text-gray-500">Courses</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCollegeAction(college.id, 'view')}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCollegeAction(college.id, 'edit')}
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCollegeAction(college.id, 'delete')}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'admins' && (
          <div>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search admins..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                {selectedItems.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('activate')}
                    >
                      <UserCheck size={16} className="mr-1" />
                      Activate ({selectedItems.length})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('deactivate')}
                    >
                      <UserX size={16} className="mr-1" />
                      Deactivate
                    </Button>
                  </>
                )}
                <Button size="sm">
                  <Plus size={16} className="mr-2" />
                  Add Admin
                </Button>
              </div>
            </div>

            {/* Admins Table */}
            <Card>
              <Card.Content className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems(filteredAdmins.map(u => u.id))
                              } else {
                                setSelectedItems([])
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Admin
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          College
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAdmins.map((admin) => {
                        const college = colleges.find(c => c.id === admin.collegeId)
                        return (
                          <tr key={admin.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(admin.id)}
                                onChange={() => toggleItemSelection(admin.id)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <img
                                  src={admin.avatar}
                                  alt={admin.name}
                                  className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {admin.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {admin.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {college?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                              <Badge 
                                variant={admin.isActive ? 'success' : 'danger'} 
                                size="sm"
                              >
                                {admin.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(admin.lastLogin).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUserAction(admin.id, 'view')}
                                >
                                  <Eye size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUserAction(admin.id, 'edit')}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUserAction(admin.id, admin.isActive ? 'deactivate' : 'activate')}
                                >
                                  {admin.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
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
          </div>
        )}

        {activeTab === 'system' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Server size={20} className="mr-2 text-blue-500" />
                  Server Status
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle size={20} className="text-green-600" />
                      <span className="font-medium text-green-900">Database Server</span>
                    </div>
                    <Badge variant="success" size="sm">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle size={20} className="text-green-600" />
                      <span className="font-medium text-green-900">Web Server</span>
                    </div>
                    <Badge variant="success" size="sm">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle size={20} className="text-green-600" />
                      <span className="font-medium text-green-900">File Storage</span>
                    </div>
                    <Badge variant="success" size="sm">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle size={20} className="text-yellow-600" />
                      <span className="font-medium text-yellow-900">Backup Service</span>
                    </div>
                    <Badge variant="warning" size="sm">Warning</Badge>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Settings size={20} className="mr-2 text-gray-500" />
                  System Actions
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Database size={16} className="mr-2" />
                    Backup Database
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download size={16} className="mr-2" />
                    Export System Logs
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Upload size={16} className="mr-2" />
                    Import Configuration
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Zap size={16} className="mr-2" />
                    Clear Cache
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Activity size={16} className="mr-2" />
                    System Health Check
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        )}
      </div>

      {/* College Modal */}
      <Modal
        isOpen={showCollegeModal}
        onClose={() => setShowCollegeModal(false)}
        title={selectedCollege ? 'Edit College' : 'Add New College'}
        size="lg"
      >
        <CollegeForm
          college={selectedCollege}
          onSave={selectedCollege ? updateCollege : createNewCollege}
          onCancel={() => setShowCollegeModal(false)}
        />
      </Modal>

      {/* User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={selectedUser?.name}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                <p className="text-gray-600">{selectedUser.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="info" size="sm">{selectedUser.role}</Badge>
                  <Badge variant={selectedUser.isActive ? 'success' : 'danger'} size="sm">
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                <p className="text-sm text-gray-900">
                  {colleges.find(c => c.id === selectedUser.collegeId)?.name || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joined Date</label>
                <p className="text-sm text-gray-900">{new Date(selectedUser.joinedDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                <p className="text-sm text-gray-900">{new Date(selectedUser.lastLogin).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verified</label>
                <p className="text-sm text-gray-900">{selectedUser.isVerified ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => handleUserAction(selectedUser.id, selectedUser.isActive ? 'deactivate' : 'activate')}
                variant={selectedUser.isActive ? 'danger' : 'accent'}
              >
                {selectedUser.isActive ? 'Deactivate User' : 'Activate User'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowUserModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// College Form Component
const CollegeForm = ({ college, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: college?.name || '',
    code: college?.code || '',
    address: college?.address || '',
    phone: college?.phone || '',
    email: college?.email || '',
    website: college?.website || '',
    establishedYear: college?.establishedYear || new Date().getFullYear()
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (college) {
      onSave(college.id, formData)
    } else {
      onSave(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="College Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="College Code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
      </div>
      
      <Input
        label="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Website"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
        <Input
          label="Established Year"
          type="number"
          value={formData.establishedYear}
          onChange={(e) => setFormData({ ...formData, establishedYear: parseInt(e.target.value) })}
          required
        />
      </div>
      
      <div className="flex space-x-3 pt-4">
        <Button type="submit">
          {college ? 'Update College' : 'Create College'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default SuperAdminDashboardPage