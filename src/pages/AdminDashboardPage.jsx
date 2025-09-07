import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Award, 
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
  Shield,
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
  Globe
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

const AdminDashboardPage = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showUserModal, setShowUserModal] = useState(false)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [userFilter, setUserFilter] = useState('all')
  const [courseFilter, setCourseFilter] = useState('all')
  
  // Data states
  const [college, setCollege] = useState(null)
  const [instructors, setInstructors] = useState([])
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [stats, setStats] = useState({
    totalInstructors: 0,
    totalStudents: 0,
    totalCourses: 0,
    activeUsers: 0,
    completionRate: 0,
    averageGrade: 0
  })

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      
   
      const adminUser = mockData.users.find(u => u.id === user.id)
      const collegeData = mockData.colleges.find(c => c.id === adminUser?.collegeId)
      setCollege(collegeData)
   
      const collegeInstructors = mockData.users.filter(u => 
        u.role === 'instructor' && u.collegeId === adminUser?.collegeId
      )
      setInstructors(collegeInstructors)
      
      const collegeStudents = mockData.users.filter(u => 
        u.role === 'student' && u.collegeId === adminUser?.collegeId
      )
      setStudents(collegeStudents)
      
      const collegeCourses = mockData.courses.filter(c => 
        c.collegeId === adminUser?.collegeId
      )
      setCourses(collegeCourses)
      
   
      const activeUsers = [...collegeInstructors, ...collegeStudents].filter(u => u.isActive).length
      const totalUsers = collegeInstructors.length + collegeStudents.length
      const completionRate = Math.floor(Math.random() * 30) + 70 
      const averageGrade = Math.floor(Math.random() * 20) + 75 
      
      setStats({
        totalInstructors: collegeInstructors.length,
        totalStudents: collegeStudents.length,
        totalCourses: collegeCourses.length,
        activeUsers,
        completionRate,
        averageGrade
      })
      
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
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
          const userToEdit = [...instructors, ...students].find(u => u.id === userId)
          setSelectedUser(userToEdit)
          setShowUserModal(true)
          break
        case 'view':
          const userToView = [...instructors, ...students].find(u => u.id === userId)
          setSelectedUser(userToView)
          setShowUserModal(true)
          break
        default:
          break
      }
      
      if (action !== 'edit' && action !== 'view') {
        await fetchAdminData() 
      }
    } catch (error) {
      toast.error(`Failed to ${action} user`)
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
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
            for (const userId of selectedUsers) {
              await mockAPI.deleteUser(userId)
            }
            toast.success(`${selectedUsers.length} users deleted`)
          }
          break
        default:
          break
      }
      
      setSelectedUsers([])
      await fetchAdminData()
    } catch (error) {
      toast.error(`Failed to ${action} users`)
    }
  }

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = userFilter === 'all' || 
                         (userFilter === 'active' && instructor.isActive) ||
                         (userFilter === 'inactive' && !instructor.isActive)
    return matchesSearch && matchesFilter
  })

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = userFilter === 'all' || 
                         (userFilter === 'active' && student.isActive) ||
                         (userFilter === 'inactive' && !student.isActive)
    return matchesSearch && matchesFilter
  })

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = courseFilter === 'all' || 
                         (courseFilter === 'published' && course.status === 'published') ||
                         (courseFilter === 'draft' && course.status === 'draft')
    return matchesSearch && matchesFilter
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
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Shield size={24} className="text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">
                {college ? `Managing ${college.name}` : 'College Administration'}
              </p>
            </div>
          </div>
        </div>

        {/* College Info Card */}
        {college && (
          <Card className="mb-8">
            <Card.Content className="p-6">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img 
                    src={college.logo} 
                    alt={college.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{college.name}</h2>
                  <p className="text-gray-600 mb-2">Code: {college.code}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-gray-600">{college.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone size={14} className="text-gray-400" />
                      <span className="text-gray-600">{college.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-gray-600">{college.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe size={14} className="text-gray-400" />
                      <span className="text-gray-600">{college.website}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="success" size="sm">
                  {college.status}
                </Badge>
              </div>
            </Card.Content>
          </Card>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Instructors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInstructors}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Activity size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Target size={24} className="text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Award size={24} className="text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Grade</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageGrade}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'instructors', name: 'Instructors', icon: Users },
                { id: 'students', name: 'Students', icon: GraduationCap },
                { id: 'courses', name: 'Courses', icon: BookOpen }
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

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <Card.Header>
                <Card.Title>Recent Activity</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <UserCheck size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">New student enrolled</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Course published</p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Award size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Certificate issued</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Performance Metrics</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Course Completion Rate</span>
                      <span className="font-medium">{stats.completionRate}%</span>
                    </div>
                    <Progress value={stats.completionRate} size="sm" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Student Satisfaction</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} size="sm" variant="success" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Instructor Rating</span>
                      <span className="font-medium">88%</span>
                    </div>
                    <Progress value={88} size="sm" variant="accent" />
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        )}

        {activeTab === 'instructors' && (
          <div>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search instructors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                {selectedUsers.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('activate')}
                    >
                      <UserCheck size={16} className="mr-1" />
                      Activate ({selectedUsers.length})
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
                  Add Instructor
                </Button>
              </div>
            </div>

            {/* Instructors Table */}
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
                                setSelectedUsers(filteredInstructors.map(u => u.id))
                              } else {
                                setSelectedUsers([])
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Instructor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Courses
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Students
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
                      {filteredInstructors.map((instructor) => (
                        <tr key={instructor.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(instructor.id)}
                              onChange={() => toggleUserSelection(instructor.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img
                                src={instructor.avatar}
                                alt={instructor.name}
                                className="w-10 h-10 rounded-full mr-3"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {instructor.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {instructor.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {instructor.assignedCourses?.length || 0}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {instructor.students?.length || 0}
                          </td>
                          <td className="px-6 py-4">
                            <Badge 
                              variant={instructor.isActive ? 'success' : 'danger'} 
                              size="sm"
                            >
                              {instructor.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(instructor.lastLogin).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUserAction(instructor.id, 'view')}
                              >
                                <Eye size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUserAction(instructor.id, 'edit')}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUserAction(instructor.id, instructor.isActive ? 'deactivate' : 'activate')}
                              >
                                {instructor.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Content>
            </Card>
          </div>
        )}

        {activeTab === 'students' && (
          <div>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                {selectedUsers.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('activate')}
                    >
                      <UserCheck size={16} className="mr-1" />
                      Activate ({selectedUsers.length})
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
                  Add Student
                </Button>
              </div>
            </div>

            {/* Students Table */}
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
                                setSelectedUsers(filteredStudents.map(u => u.id))
                              } else {
                                setSelectedUsers([])
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Courses
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
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
                      {filteredStudents.map((student) => {
                        const avgProgress = student.progress ? 
                          Object.values(student.progress).reduce((sum, p) => sum + (p.overallProgress || 0), 0) / Object.keys(student.progress).length : 0
                        
                        return (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(student.id)}
                                onChange={() => toggleUserSelection(student.id)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <img
                                  src={student.avatar}
                                  alt={student.name}
                                  className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {student.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {student.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {student.assignedCourses?.length || 0}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-primary-600 h-2 rounded-full" 
                                    style={{ width: `${avgProgress}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600">{Math.round(avgProgress)}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge 
                                variant={student.isActive ? 'success' : 'danger'} 
                                size="sm"
                              >
                                {student.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(student.lastLogin).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUserAction(student.id, 'view')}
                                >
                                  <Eye size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUserAction(student.id, 'edit')}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUserAction(student.id, student.isActive ? 'deactivate' : 'activate')}
                                >
                                  {student.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
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

        {activeTab === 'courses' && (
          <div>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
                <Link to="/courses/create">
                  <Button size="sm">
                    <Plus size={16} className="mr-2" />
                    Create Course
                  </Button>
                </Link>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Card.Content className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={course.status === 'published' ? 'success' : 'warning'} size="sm">
                        {course.status}
                      </Badge>
                      <Badge variant="info" size="sm">
                        {course.level}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{course.totalModules} modules</span>
                      <span>{course.totalChapters} chapters</span>
                      <span>{course.enrolledStudents?.length || 0} students</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCourse(course)
                          setShowCourseModal(true)
                        }}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info('Course editor coming soon!')}
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.info('Analytics coming soon!')}
                      >
                        <BarChart3 size={16} />
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Joined Date</label>
                <p className="text-sm text-gray-900">{new Date(selectedUser.joinedDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                <p className="text-sm text-gray-900">{new Date(selectedUser.lastLogin).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Courses</label>
                <p className="text-sm text-gray-900">{selectedUser.assignedCourses?.length || 0}</p>
              </div>
              {selectedUser.role === 'instructor' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Students</label>
                  <p className="text-sm text-gray-900">{selectedUser.students?.length || 0}</p>
                </div>
              )}
            </div>

            {selectedUser.role === 'student' && selectedUser.progress && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Course Progress</h4>
                <div className="space-y-3">
                  {Object.entries(selectedUser.progress).map(([courseId, progress]) => {
                    const course = courses.find(c => c.id === courseId)
                    return (
                      <div key={courseId} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-gray-900">{course?.title || courseId}</h5>
                          <span className="text-sm text-gray-600">{progress.overallProgress}%</span>
                        </div>
                        <Progress value={progress.overallProgress} size="sm" />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

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

      {/* Course Modal */}
      <Modal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        title={selectedCourse?.title}
        size="lg"
      >
        {selectedCourse && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={selectedCourse.thumbnail}
                alt={selectedCourse.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedCourse.title}</h3>
                <p className="text-gray-600">by {selectedCourse.instructor.name}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="info" size="sm">{selectedCourse.level}</Badge>
                  <Badge variant="default" size="sm">{selectedCourse.category}</Badge>
                  <Badge variant={selectedCourse.status === 'published' ? 'success' : 'warning'} size="sm">
                    {selectedCourse.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600">{selectedCourse.description}</p>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{selectedCourse.totalModules}</div>
                <div className="text-sm text-blue-800">Modules</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{selectedCourse.totalChapters}</div>
                <div className="text-sm text-green-800">Chapters</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">{selectedCourse.enrolledStudents?.length || 0}</div>
                <div className="text-sm text-purple-800">Students</div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={() => toast.info('Course editor coming soon!')}>
                <Edit size={16} className="mr-2" />
                Edit Course
              </Button>
              <Button variant="outline" onClick={() => toast.info('Analytics coming soon!')}>
                <BarChart3 size={16} className="mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" onClick={() => setShowCourseModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AdminDashboardPage