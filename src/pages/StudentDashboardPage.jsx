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
  ArrowRight,
  Target,
  FileText,
  Star,
  User,
  AlertCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { mockAPI } from '../services/mockData'
import useAuthStore from '../store/useAuthStore'
import Progress from '../components/ui/Progress'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

const StudentDashboardPage = () => {
  const { user } = useAuthStore()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedLessons: 0,
    totalLessons: 0,
    averageGrade: 0,
    certificates: 0,
    totalTimeSpent: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch student data
      const [enrollments, activities, studentStats] = await Promise.all([
        mockAPI.getStudentEnrollments(user.id),
        mockAPI.getRecentActivities(user.id, 5),
        mockAPI.getStudentStats(user.id)
      ])
      
      setEnrolledCourses(enrollments)
      setRecentActivities(activities)
      setStats(studentStats)
      
      // Mock upcoming deadlines
      setUpcomingDeadlines([
        {
          id: '1',
          title: 'Portfolio Website Project',
          course: 'Complete Web Development Bootcamp',
          dueDate: '2024-01-25',
          type: 'assignment',
          priority: 'high'
        },
        {
          id: '2',
          title: 'JavaScript Functions Quiz',
          course: 'Advanced JavaScript Concepts',
          dueDate: '2024-01-27',
          type: 'quiz',
          priority: 'medium'
        },
        {
          id: '3',
          title: 'Design System Review',
          course: 'UI/UX Design Fundamentals',
          dueDate: '2024-01-30',
          type: 'review',
          priority: 'low'
        }
      ])
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const continueCourse = (courseId) => {
    toast.success('Redirecting to course...')
    // In a real app, this would navigate to the course page
  }

  const markDeadlineComplete = (deadlineId) => {
    setUpcomingDeadlines(prev => 
      prev.filter(deadline => deadline.id !== deadlineId)
    )
    toast.success('Deadline marked as complete!')
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'enrollment':
        return <BookOpen size={16} className="text-green-600" />
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeSpent = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getDaysUntilDeadline = (dueDate) => {
    const today = new Date()
    const deadline = new Date(dueDate)
    const diffTime = deadline - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">
                Continue your learning journey and achieve your goals.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedLessons}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalLessons > 0 ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(stats.averageGrade)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Award size={24} className="text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.certificates}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatTimeSpent(stats.totalTimeSpent)}</p>
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
                <Link to="/courses">
                  <Button size="sm" variant="outline">
                    Browse More
                  </Button>
                </Link>
              </Card.Header>
              <Card.Content>
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
                    {enrolledCourses.map((enrollment) => (
                      <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                <img 
                                  src={enrollment.course.thumbnail} 
                                  alt={enrollment.course.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{enrollment.course.title}</h3>
                                <p className="text-sm text-gray-600">{enrollment.course.instructor.name}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="info" size="sm">{enrollment.course.level}</Badge>
                                  <Badge variant="default" size="sm">{enrollment.course.category}</Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium text-gray-900">
                                  {enrollment.completedLessons}/{enrollment.totalLessons} lessons
                                </span>
                              </div>
                              <Progress value={enrollment.progress} size="sm" />
                              
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock size={14} />
                                  <span>Last accessed {new Date(enrollment.lastAccessed).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Award size={14} />
                                  <span>Grade: {enrollment.grade}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            <Button 
                              size="sm"
                              onClick={() => continueCourse(enrollment.courseId)}
                            >
                              <Play size={16} className="mr-1" />
                              Continue
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText size={16} className="mr-1" />
                              Assignments
                            </Button>
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
            {/* Upcoming Deadlines */}
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <AlertCircle size={20} className="mr-2 text-red-500" />
                  Upcoming Deadlines
                </Card.Title>
              </Card.Header>
              <Card.Content>
                {upcomingDeadlines.length === 0 ? (
                  <div className="text-center py-4">
                    <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
                    <p className="text-sm text-gray-600">No upcoming deadlines</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingDeadlines.map((deadline) => {
                      const daysLeft = getDaysUntilDeadline(deadline.dueDate)
                      return (
                        <div key={deadline.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900">{deadline.title}</h4>
                              <Badge 
                                variant={deadline.priority === 'high' ? 'danger' : deadline.priority === 'medium' ? 'warning' : 'success'} 
                                size="sm"
                              >
                                {deadline.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{deadline.course}</p>
                            <p className="text-xs text-gray-500">
                              {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : 'Overdue'}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => markDeadlineComplete(deadline.id)}
                          >
                            <CheckCircle size={14} />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Recent Activity */}
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Bell size={20} className="mr-2 text-blue-500" />
                  Recent Activity
                </Card.Title>
              </Card.Header>
              <Card.Content>
                {recentActivities.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                ) : (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
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
                <Link to="/courses" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen size={16} className="mr-2" />
                    Browse New Courses
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info('Assignments page coming soon!')}
                >
                  <FileText size={16} className="mr-2" />
                  View All Assignments
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info('Grades page coming soon!')}
                >
                  <Award size={16} className="mr-2" />
                  Check All Grades
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info('Calendar page coming soon!')}
                >
                  <Calendar size={16} className="mr-2" />
                  View Calendar
                </Button>
              </Card.Content>
            </Card>

            {/* Learning Goals */}
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Target size={20} className="mr-2 text-purple-500" />
                  Learning Goals
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Complete 3 courses this month</span>
                      <span className="text-sm text-gray-500">1/3</span>
                    </div>
                    <Progress value={33} size="sm" variant="accent" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Maintain 90%+ average</span>
                      <span className="text-sm text-gray-500">{Math.round(stats.averageGrade)}%</span>
                    </div>
                    <Progress 
                      value={Math.min((stats.averageGrade / 90) * 100, 100)} 
                      size="sm" 
                      variant={stats.averageGrade >= 90 ? 'success' : 'warning'} 
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Study 20 hours this week</span>
                      <span className="text-sm text-gray-500">{formatTimeSpent(stats.totalTimeSpent % (20 * 60))}/20h</span>
                    </div>
                    <Progress 
                      value={Math.min(((stats.totalTimeSpent % (20 * 60)) / (20 * 60)) * 100, 100)} 
                      size="sm" 
                    />
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboardPage