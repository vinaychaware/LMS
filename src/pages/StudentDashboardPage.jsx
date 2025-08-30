import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar, 
  Bell, 
  Play,
  CheckCircle,
  Circle,
  ArrowRight
} from 'lucide-react'
import { courseAPI } from '../services/api'
import Progress from '../components/ui/Progress'
import Button from '../components/ui/Button'

const StudentDashboardPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [recentAnnouncements, setRecentAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedLessons: 0,
    totalLessons: 0,
    averageGrade: 0,
    certificates: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [coursesResponse] = await Promise.all([
        courseAPI.getEnrolled()
      ])
      
      setEnrolledCourses(coursesResponse.data)
      
      // Calculate stats
      const totalLessons = coursesResponse.data.reduce((sum, course) => sum + course.lessons?.length || 0, 0)
      const completedLessons = coursesResponse.data.reduce((sum, course) => 
        sum + (course.lessons?.filter(lesson => lesson.completed).length || 0), 0
      )
      
      setStats({
        totalCourses: coursesResponse.data.length,
        completedLessons,
        totalLessons,
        averageGrade: 85, // Mock data
        certificates: 2 // Mock data
      })
      
      // Mock announcements
      setRecentAnnouncements([
        {
          id: 1,
          course: 'Advanced React Development',
          message: 'New assignment posted: Build a full-stack application',
          timestamp: '2 hours ago',
          type: 'assignment'
        },
        {
          id: 2,
          course: 'Data Science Fundamentals',
          message: 'Quiz 3 is now available. Due by Friday.',
          timestamp: '1 day ago',
          type: 'quiz'
        },
        {
          id: 3,
          course: 'UI/UX Design Principles',
          message: 'New lesson added: Prototyping with Figma',
          timestamp: '2 days ago',
          type: 'lesson'
        }
      ])
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAnnouncementIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <BookOpen size={16} className="text-blue-600" />
      case 'quiz':
        return <Award size={16} className="text-yellow-600" />
      case 'lesson':
        return <Play size={16} className="text-green-600" />
      default:
        return <Bell size={16} className="text-gray-600" />
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
            Welcome back, Student!
          </h1>
          <p className="text-gray-600">
            Continue your learning journey and track your progress across all enrolled courses.
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
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedLessons}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalLessons > 0 ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageGrade}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Award size={24} className="text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.certificates}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
              </div>
              <div className="p-6">
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start your learning journey by enrolling in a course.
                    </p>
                    <Link to="/courses">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                <BookOpen size={20} className="text-primary-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{course.title}</h3>
                                <p className="text-sm text-gray-600">{course.instructor.name}</p>
                              </div>
                            </div>
                            
                            <div className="ml-13">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Progress</span>
                                <span className="text-sm font-medium text-gray-900">
                                  {course.progress || 0}%
                                </span>
                              </div>
                              <Progress value={course.progress || 0} size="sm" />
                              
                              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock size={14} />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span>{course.lessons?.length || 0} lessons</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <Link to={`/courses/${course.id}`}>
                            <Button variant="outline" size="sm">
                              Continue
                              <ArrowRight size={16} className="ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity & Announcements */}
          <div className="space-y-6">
            {/* Recent Announcements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Announcements</h2>
              </div>
              <div className="p-6">
                {recentAnnouncements.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent announcements</p>
                ) : (
                  <div className="space-y-4">
                    {recentAnnouncements.map((announcement) => (
                      <div key={announcement.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getAnnouncementIcon(announcement.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {announcement.course}
                          </p>
                          <p className="text-sm text-gray-600">
                            {announcement.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {announcement.timestamp}
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
                <Link to="/courses" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen size={16} className="mr-2" />
                    Browse New Courses
                  </Button>
                </Link>
                <Link to="/assignments" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen size={16} className="mr-2" />
                    View Assignments
                  </Button>
                </Link>
                <Link to="/grades" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Award size={16} className="mr-2" />
                    Check Grades
                  </Button>
                </Link>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">React Assignment</p>
                      <p className="text-xs text-gray-500">Due in 2 days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Data Science Quiz</p>
                      <p className="text-xs text-gray-500">Due in 5 days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Design Project</p>
                      <p className="text-xs text-gray-500">Due in 1 week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboardPage
