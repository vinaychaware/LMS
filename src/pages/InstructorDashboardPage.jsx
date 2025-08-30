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
  AlertCircle
} from 'lucide-react'
import Progress from '../components/ui/Progress'
import Button from '../components/ui/Button'

const InstructorDashboardPage = () => {
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    activeStudents: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockCourses = [
        {
          id: 1,
          title: 'Advanced React Development',
          students: 45,
          rating: 4.8,
          progress: 75,
          status: 'active',
          revenue: 2250,
          lastUpdated: '2 days ago'
        },
        {
          id: 2,
          title: 'Data Science Fundamentals',
          students: 32,
          rating: 4.6,
          progress: 60,
          status: 'active',
          revenue: 1600,
          lastUpdated: '1 week ago'
        },
        {
          id: 3,
          title: 'UI/UX Design Principles',
          students: 28,
          rating: 4.9,
          progress: 85,
          status: 'active',
          revenue: 1400,
          lastUpdated: '3 days ago'
        }
      ]

      const mockStudents = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          course: 'Advanced React Development',
          progress: 80,
          lastActive: '2 hours ago',
          status: 'active'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          course: 'Data Science Fundamentals',
          progress: 65,
          lastActive: '1 day ago',
          status: 'active'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          course: 'UI/UX Design Principles',
          progress: 90,
          lastActive: '5 hours ago',
          status: 'active'
        }
      ]

      const mockActivity = [
        {
          id: 1,
          type: 'enrollment',
          message: 'New student enrolled in Advanced React Development',
          timestamp: '2 hours ago',
          course: 'Advanced React Development'
        },
        {
          id: 2,
          type: 'assignment',
          message: 'Assignment submitted by John Doe',
          timestamp: '4 hours ago',
          course: 'Data Science Fundamentals'
        },
        {
          id: 3,
          type: 'review',
          message: 'New 5-star review received',
          timestamp: '1 day ago',
          course: 'UI/UX Design Principles'
        }
      ]

      setCourses(mockCourses)
      setStudents(mockStudents)
      setRecentActivity(mockActivity)

      // Calculate stats
      const totalRevenue = mockCourses.reduce((sum, course) => sum + course.revenue, 0)
      const totalStudents = mockCourses.reduce((sum, course) => sum + course.students, 0)
      const averageRating = mockCourses.reduce((sum, course) => sum + course.rating, 0) / mockCourses.length

      setStats({
        totalCourses: mockCourses.length,
        totalStudents,
        totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10,
        activeStudents: mockStudents.filter(s => s.status === 'active').length
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'enrollment':
        return <Users size={16} className="text-green-600" />
      case 'assignment':
        return <FileText size={16} className="text-blue-600" />
      case 'review':
        return <Star size={16} className="text-yellow-600" />
      default:
        return <Bell size={16} className="text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Instructor!
          </h1>
          <p className="text-gray-600">
            Manage your courses, track student progress, and grow your teaching business.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
                <Link to="/courses/create">
                  <Button size="sm">
                    <Plus size={16} className="mr-2" />
                    Create Course
                  </Button>
                </Link>
              </div>
              <div className="p-6">
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
                              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                <BookOpen size={20} className="text-primary-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                                    {course.status}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                  <span className="flex items-center space-x-1">
                                    <Users size={14} />
                                    <span>{course.students} students</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Star size={14} className="text-yellow-500" />
                                    <span>{course.rating}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <span>${course.revenue}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="ml-13">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Student Progress</span>
                                <span className="text-sm font-medium text-gray-900">
                                  {course.progress}%
                                </span>
                              </div>
                              <Progress value={course.progress} size="sm" />
                              
                              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock size={14} />
                                  <span>Updated {course.lastUpdated}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Link to={`/courses/${course.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit size={16} />
                              </Button>
                            </Link>
                            <Link to={`/courses/${course.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye size={16} />
                              </Button>
                            </Link>
                            <Link to={`/courses/${course.id}/analytics`}>
                              <Button variant="outline" size="sm">
                                <BarChart3 size={16} />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                {recentActivity.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
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
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <Link to="/courses/create" className="block">
                  <Button className="w-full justify-start">
                    <Plus size={16} className="mr-2" />
                    Create New Course
                  </Button>
                </Link>
                <Link to="/students" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users size={16} className="mr-2" />
                    Manage Students
                  </Button>
                </Link>
                <Link to="/analytics" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 size={16} className="mr-2" />
                    View Analytics
                  </Button>
                </Link>
                <Link to="/messages" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare size={16} className="mr-2" />
                    Check Messages
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recent Students */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Students</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {students.slice(0, 3).map((student) => (
                    <div key={student.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {student.course}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">{student.progress}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-primary-600 h-1.5 rounded-full" 
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link to="/students" className="text-sm text-primary-600 hover:text-primary-500">
                    View all students →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorDashboardPage
