import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award, 
  Calendar, 
  Bell, 
  Plus,
  Edit,
  Eye,
  BarChart3,
  MessageSquare,
  FileText,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Target,
  Trash2
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { mockAPI } from '../services/mockData'
import useAuthStore from '../store/useAuthStore'
import Progress from '../components/ui/Progress'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'

const InstructorDashboardPage = () => {
  const { user } = useAuthStore()
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [showStudentsModal, setShowStudentsModal] = useState(false)
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    publishedCourses: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch instructor data
      const [instructorCourses, activities, instructorStats] = await Promise.all([
        mockAPI.getCoursesByInstructor(user.id),
        mockAPI.getRecentActivities(null, 10),
        mockAPI.getInstructorStats(user.id)
      ])
      
      setCourses(instructorCourses)
      setRecentActivity(activities.filter(activity => 
        instructorCourses.some(course => course.id === activity.courseId)
      ))
      setStats(instructorStats)
      
      // Get students from all courses
      const allStudents = []
      for (const course of instructorCourses) {
        const courseEnrollments = await mockAPI.getCourseEnrollments(course.id)
        allStudents.push(...courseEnrollments)
      }
      setStudents(allStudents)
      
      // Get assignments for instructor courses
      const allAssignments = []
      for (const course of instructorCourses) {
        const courseAssignments = await mockAPI.getAssignmentsByCourse(course.id)
        allAssignments.push(...courseAssignments.map(assignment => ({
          ...assignment,
          courseName: course.title
        })))
      }
      setAssignments(allAssignments)
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleCourseAction = async (courseId, action) => {
    try {
      switch (action) {
        case 'edit':
          toast('Course editor coming soon!')
          break
        case 'view':
          toast('Course viewer coming soon!')
          break
        case 'analytics':
          const course = courses.find(c => c.id === courseId)
          setSelectedCourse(course)
          setShowCourseModal(true)
          break
        case 'delete':
          if (window.confirm('Are you sure you want to delete this course?')) {
            await mockAPI.deleteCourse(courseId)
            setCourses(prev => prev.filter(course => course.id !== courseId))
            toast.success('Course deleted successfully')
          }
          break
        default:
          break
      }
    } catch (error) {
      toast.error('Action failed. Please try again.')
    }
  }

  const handlePublishCourse = async (courseId) => {
    try {
      await mockAPI.updateCourse(courseId, { status: 'published' })
      setCourses(prev => prev.map(course => 
        course.id === courseId ? { ...course, status: 'published' } : course
      ))
      toast.success('Course published successfully!')
    } catch (error) {
      toast.error('Failed to publish course')
    }
  }

  const viewStudentDetails = (student) => {
    setSelectedCourse(student)
    setShowStudentsModal(true)
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'enrollment':
        return <Users size={16} className="text-green-600" />
      case 'assignment':
        return <FileText size={16} className="text-blue-600" />
      case 'review':
        return <Star size={16} className="text-yellow-600" />
      case 'completion':
        return <CheckCircle size={16} className="text-green-600" />
      default:
        return <Bell size={16} className="text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success'
      case 'draft':
        return 'warning'
      case 'archived':
        return 'default'
      default:
        return 'default'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">
                Manage your courses, track student progress, and grow your teaching business.
              </p>
            </div>
            <Link to="/courses/create">
              <Button>
                <Plus size={16} className="mr-2" />
                Create Course
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
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
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Target size={24} className="text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedCourses}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header className="flex items-center justify-between">
                <Card.Title>My Courses</Card.Title>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toast('Course analytics coming soon!')}
                  >
                    <BarChart3 size={16} className="mr-1" />
                    Analytics
                  </Button>
                  <Link to="/courses/create">
                    <Button size="sm">
                      <Plus size={16} className="mr-2" />
                      Create Course
                    </Button>
                  </Link>
                </div>
              </Card.Header>
              <Card.Content>
                {courses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses created yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start sharing your knowledge by creating your first course.
                    </p>
                    <Link to="/courses/create">
                      <Button>Create Your First Course</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                <img 
                                  src={course.thumbnail} 
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                                  <Badge variant={getStatusColor(course.status)} size="sm">
                                    {course.status}
                                  </Badge>
                                  {course.isFeatured && (
                                    <Badge variant="accent" size="sm">Featured</Badge>
                                  )}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center space-x-1">
                                    <Users size={14} />
                                    <span>{course.studentsCount} students</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Star size={14} className="text-yellow-500" />
                                    <span>{course.rating} ({course.reviewsCount})</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <DollarSign size={14} />
                                    <span>{formatCurrency(course.price * course.studentsCount)}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="ml-15 space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Course Completion Rate</span>
                                <span className="font-medium text-gray-900">
                                  {Math.round(Math.random() * 30 + 60)}%
                                </span>
                              </div>
                              <Progress value={Math.round(Math.random() * 30 + 60)} size="sm" />
                              
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock size={14} />
                                  <span>Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <FileText size={14} />
                                  <span>{course.lessonsCount} lessons</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCourseAction(course.id, 'edit')}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCourseAction(course.id, 'view')}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCourseAction(course.id, 'analytics')}
                            >
                              <BarChart3 size={16} />
                            </Button>
                            {course.status === 'draft' && (
                              <Button 
                                size="sm"
                                onClick={() => handlePublishCourse(course.id)}
                              >
                                Publish
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Bell size={20} className="mr-2 text-blue-500" />
                  Recent Activity
                </Card.Title>
              </Card.Header>
              <Card.Content>
                {recentActivity.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.course}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Quick Actions */}
            <Card>
              <Card.Header>
                <Card.Title>Quick Actions</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-3">
                <Link to="/courses/create" className="block">
                  <Button className="w-full justify-start">
                    <Plus size={16} className="mr-2" />
                    Create New Course
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowStudentsModal(true)}
                >
                  <Users size={16} className="mr-2" />
                  Manage Students
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast('Analytics page coming soon!')}
                >
                  <BarChart3 size={16} className="mr-2" />
                  View Analytics
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast('Messages page coming soon!')}
                >
                  <MessageSquare size={16} className="mr-2" />
                  Check Messages
                </Button>
              </Card.Content>
            </Card>

            {/* Recent Students */}
            <Card>
              <Card.Header className="flex items-center justify-between">
                <Card.Title>Recent Students</Card.Title>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowStudentsModal(true)}
                >
                  View All
                </Button>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {students.slice(0, 5).map((enrollment) => (
                    <div 
                      key={enrollment.id} 
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => viewStudentDetails(enrollment)}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                        <img 
                          src={enrollment.student.avatar} 
                          alt={enrollment.student.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {enrollment.student.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {enrollment.course?.title}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">{enrollment.progress}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-primary-600 h-1.5 rounded-full" 
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Pending Assignments */}
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <FileText size={20} className="mr-2 text-orange-500" />
                  Pending Reviews
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {assignments.slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{assignment.title}</h4>
                        <Badge variant="warning" size="sm">{assignment.submissions} submissions</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{assignment.courseName}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>

      {/* Course Analytics Modal */}
      <Modal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        title={`${selectedCourse?.title} - Analytics`}
        size="lg"
      >
        {selectedCourse && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedCourse.studentsCount}</div>
                <div className="text-sm text-blue-800">Total Students</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{selectedCourse.rating}</div>
                <div className="text-sm text-green-800">Average Rating</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(selectedCourse.price * selectedCourse.studentsCount)}</div>
                <div className="text-sm text-purple-800">Total Revenue</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{selectedCourse.reviewsCount}</div>
                <div className="text-sm text-yellow-800">Total Reviews</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Course Performance</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion Rate</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} size="sm" variant="success" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Student Satisfaction</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} size="sm" variant="accent" />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Students Management Modal */}
      <Modal
        isOpen={showStudentsModal}
        onClose={() => setShowStudentsModal(false)}
        title="Student Management"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">All Students ({students.length})</h4>
            <Button 
              size="sm"
              onClick={() => toast('Export functionality coming soon!')}
            >
              Export Data
            </Button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {students.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                    <img 
                      src={enrollment.student.avatar} 
                      alt={enrollment.student.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{enrollment.student.name}</h4>
                    <p className="text-sm text-gray-600">{enrollment.student.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="info" size="sm">{enrollment.course?.title}</Badge>
                      <span className="text-xs text-gray-500">
                        Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{enrollment.progress}%</div>
                  <div className="text-xs text-gray-500">Grade: {enrollment.grade}%</div>
                  <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-primary-600 h-1.5 rounded-full" 
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default InstructorDashboardPage