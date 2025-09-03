import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  Trash2,
  Settings,
  UserCheck,
  BookMarked,
  Brain,
  PlayCircle,
  PieChart,
  TrendingDown,
  Activity,
  Filter,
  Search,
  Download
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { mockAPI, mockData } from '../services/mockData'
import useAuthStore from '../store/useAuthStore'
import Progress from '../components/ui/Progress'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'

const InstructorDashboardPage = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [assignedCourses, setAssignedCourses] = useState([])
  const [myStudents, setMyStudents] = useState([])
  const [courseModules, setCourseModules] = useState({})
  const [studentProgress, setStudentProgress] = useState({})
  const [testResults, setTestResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false)
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const [studentSearchTerm, setStudentSearchTerm] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    activeStudents: 0,
    averageProgress: 0,
    totalModules: 0,
    totalChapters: 0,
    testsGraded: 0,
    averageTestScore: 0
  })

  useEffect(() => {
    fetchInstructorData()
  }, [])

  const fetchInstructorData = async () => {
    try {
      setLoading(true)
      
      // Get instructor's assigned courses
      const courses = await mockAPI.getCoursesByInstructor(user.id)
      setAssignedCourses(courses)
      
      // Get modules for each course
      const modulesData = {}
      for (const course of courses) {
        const modules = await mockAPI.getCourseModules(course.id)
        modulesData[course.id] = modules
      }
      setCourseModules(modulesData)
      
      // Get instructor's students
      const instructor = mockData.users.find(u => u.id === user.id)
      const students = mockData.users.filter(u => 
        instructor.students.includes(u.id)
      )
      setMyStudents(students)
      
      // Get student progress data
      const progressData = {}
      for (const student of students) {
        for (const courseId of student.assignedCourses) {
          const progress = await mockAPI.getStudentProgress(student.id, courseId)
          if (!progressData[student.id]) progressData[student.id] = {}
          progressData[student.id][courseId] = progress
        }
      }
      setStudentProgress(progressData)
      
      // Get test results
      const allTestResults = mockData.testResults.filter(result => 
        students.some(student => student.id === result.studentId)
      )
      setTestResults(allTestResults)
      
      // Calculate instructor stats
      const totalModules = Object.values(modulesData).flat().length
      const totalChapters = courses.reduce((sum, course) => sum + course.totalChapters, 0)
      const activeStudents = students.filter(s => s.isActive).length
      const avgProgress = students.length > 0 ? 
        students.reduce((sum, student) => {
          const studentCourses = student.assignedCourses
          const studentAvg = studentCourses.reduce((courseSum, courseId) => {
            const progress = progressData[student.id]?.[courseId]
            return courseSum + (progress?.overallProgress || 0)
          }, 0) / studentCourses.length
          return sum + studentAvg
        }, 0) / students.length : 0
      
      const testScores = allTestResults.map(result => result.score)
      const avgTestScore = testScores.length > 0 ? testScores.reduce((a, b) => a + b, 0) / testScores.length : 0
      
      setStats({
        totalCourses: courses.length,
        totalStudents: students.length,
        activeStudents,
        averageProgress: Math.round(avgProgress),
        totalModules,
        totalChapters,
        testsGraded: allTestResults.length,
        averageTestScore: Math.round(avgTestScore)
      })
      
    } catch (error) {
      console.error('Error fetching instructor data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const viewCourseDetails = (course) => {
    setSelectedCourse(course)
    setShowCourseModal(true)
  }

  const viewStudentDetails = (student) => {
    setSelectedStudent(student)
    setShowStudentModal(true)
  }

  const createNewCourse = () => {
    const instructor = mockData.users.find(u => u.id === user.id)
    if (!instructor?.permissions?.canCreateCourses) {
      toast.error('You do not have permission to create courses. Contact admin.')
      return
    }
    navigate('/courses/create')
  }

  const handleCourseAction = async (courseId, action) => {
    try {
      switch (action) {
        case 'edit':
          toast.info('Course editor coming soon!')
          break
        case 'view':
          const course = assignedCourses.find(c => c.id === courseId)
          viewCourseDetails(course)
          break
        case 'analytics':
          setSelectedCourse(assignedCourses.find(c => c.id === courseId))
          setShowAnalyticsModal(true)
          break
        case 'students':
          const courseStudents = myStudents.filter(student => 
            student.assignedCourses.includes(courseId)
          )
          toast.info(`${courseStudents.length} students enrolled in this course`)
          break
        default:
          break
      }
    } catch (error) {
      toast.error('Action failed. Please try again.')
    }
  }

  const getStudentCourseProgress = (studentId, courseId) => {
    const progress = studentProgress[studentId]?.[courseId]
    if (!progress) return 0
    return progress.overallProgress || 0
  }

  const getStudentStatus = (student) => {
    const recentActivity = new Date(student.lastLogin)
    const daysSinceActivity = Math.floor((new Date() - recentActivity) / (1000 * 60 * 60 * 24))
    
    if (daysSinceActivity === 0) return { status: 'online', color: 'success' }
    if (daysSinceActivity <= 3) return { status: 'recent', color: 'warning' }
    return { status: 'inactive', color: 'danger' }
  }

  const filteredStudents = myStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(studentSearchTerm.toLowerCase())
    const matchesCourse = courseFilter === 'all' || student.assignedCourses.includes(courseFilter)
    return matchesSearch && matchesCourse
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading instructor dashboard...</p>
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
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <BookOpen size={24} className="text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Instructor Dashboard
                </h1>
                <p className="text-gray-600">
                  Manage your courses and track student progress.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => setShowAnalyticsModal(true)}
              >
                <BarChart3 size={16} className="mr-2" />
                Analytics
              </Button>
             <Link to="/courses/create"> <Button onClick={createNewCourse}>
                <Plus size={16} className="mr-2" />
                Create Course
              </Button></Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                <p className="text-xs text-gray-500">{stats.totalModules} modules, {stats.totalChapters} chapters</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                <p className="text-xs text-gray-500">{stats.activeStudents} active</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</p>
                <p className="text-xs text-gray-500">Across all students</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Test Average</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageTestScore}%</p>
                <p className="text-xs text-gray-500">{stats.testsGraded} tests graded</p>
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
                    onClick={() => setShowAnalyticsModal(true)}
                  >
                    <BarChart3 size={16} className="mr-1" />
                    Analytics
                  </Button>
                     <Link to="/courses/create">  <Button size="sm" onClick={createNewCourse}>
                    <Plus size={16} className="mr-2" />
                    Create Course
                  </Button></Link>
                </div>
              </Card.Header>
              <Card.Content>
                {assignedCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses assigned yet</h3>
                    <p className="text-gray-600 mb-4">
                      Contact admin to get courses assigned or create your own.
                    </p>
                       <Link to="/courses/create">  <Button onClick={createNewCourse}>
                      Create Your First Course
                    </Button></Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignedCourses.map((course) => {
                      const modules = courseModules[course.id] || []
                      const enrolledStudents = myStudents.filter(student => 
                        student.assignedCourses.includes(course.id)
                      )
                      const avgProgress = enrolledStudents.length > 0 ? 
                        enrolledStudents.reduce((sum, student) => 
                          sum + getStudentCourseProgress(student.id, course.id), 0
                        ) / enrolledStudents.length : 0
                      
                      return (
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
                                    <Badge variant={course.status === 'published' ? 'success' : 'warning'} size="sm">
                                      {course.status}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center space-x-1">
                                      <Users size={14} />
                                      <span>{enrolledStudents.length} students</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <BookMarked size={14} />
                                      <span>{modules.length} modules</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <Clock size={14} />
                                      <span>{course.estimatedDuration}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="ml-15 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Average Student Progress</span>
                                  <span className="font-medium text-gray-900">{Math.round(avgProgress)}%</span>
                                </div>
                                <Progress value={avgProgress} size="sm" />
                                
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Activity size={14} />
                                    <span>Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <FileText size={14} />
                                    <span>{course.totalChapters} chapters</span>
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
                                onClick={() => handleCourseAction(course.id, 'students')}
                              >
                                <Users size={16} />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCourseAction(course.id, 'analytics')}
                              >
                                <BarChart3 size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Student Progress Overview */}
            <Card>
              <Card.Header className="flex items-center justify-between">
                <Card.Title className="flex items-center">
                  <Users size={20} className="mr-2 text-green-500" />
                  Student Progress
                </Card.Title>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowStudentModal(true)}
                >
                  View All
                </Button>
              </Card.Header>
              <Card.Content>
                {myStudents.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No students assigned</p>
                ) : (
                  <div className="space-y-3">
                    {myStudents.slice(0, 5).map((student) => {
                      const studentStatus = getStudentStatus(student)
                      const avgProgress = student.assignedCourses.reduce((sum, courseId) => 
                        sum + getStudentCourseProgress(student.id, courseId), 0
                      ) / student.assignedCourses.length
                      
                      return (
                        <div 
                          key={student.id} 
                          className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() => viewStudentDetails(student)}
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 relative">
                            <img 
                              src={student.avatar} 
                              alt={student.name}
                              className="w-full h-full object-cover"
                            />
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              studentStatus.color === 'success' ? 'bg-green-500' : 
                              studentStatus.color === 'warning' ? 'bg-yellow-500' : 'bg-gray-400'
                            }`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {student.assignedCourses.length} courses assigned
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{Math.round(avgProgress)}%</div>
                            <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-primary-600 h-1.5 rounded-full" 
                                style={{ width: `${avgProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Recent Test Results */}
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <FileText size={20} className="mr-2 text-orange-500" />
                  Recent Test Results
                </Card.Title>
              </Card.Header>
              <Card.Content>
                {testResults.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No test results yet</p>
                ) : (
                  <div className="space-y-3">
                    {testResults.slice(0, 5).map((result) => {
                      const student = myStudents.find(s => s.id === result.studentId)
                      const course = assignedCourses.find(c => c.id === result.courseId)
                      
                      return (
                        <div key={result.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {student?.name}
                            </h4>
                            <Badge 
                              variant={result.passed ? 'success' : 'danger'} 
                              size="sm"
                            >
                              {result.score}%
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{course?.title}</p>
                          <p className="text-xs text-gray-500">
                            {result.testType === 'module' ? 'Module Test' : 'Course Test'} • 
                            {new Date(result.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )
                    })}
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
                   <Link to="/courses/create">  <Button 
                  className="w-full justify-start"
                  onClick={createNewCourse}
                >
                  <Plus size={16} className="mr-2" />
                  Create New Course
                </Button></Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowStudentModal(true)}
                >
                  <Users size={16} className="mr-2" />
                  Manage Students
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast('Test management coming soon!')}
                >
                  <FileText size={16} className="mr-2" />
                  Manage Tests
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowAnalyticsModal(true)}
                >
                  <BarChart3 size={16} className="mr-2" />
                  View Analytics
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast('Messages coming soon!')}
                >
                  <MessageSquare size={16} className="mr-2" />
                  Student Messages
                </Button>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>

      {/* Course Details Modal */}
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
                <p className="text-gray-600">{selectedCourse.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="info">{selectedCourse.level}</Badge>
                  <Badge variant="default">{selectedCourse.category}</Badge>
                  <Badge variant={selectedCourse.status === 'published' ? 'success' : 'warning'}>
                    {selectedCourse.status}
                  </Badge>
                </div>
              </div>
            </div>
            
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
                <div className="text-xl font-bold text-purple-600">
                  {myStudents.filter(s => s.assignedCourses.includes(selectedCourse.id)).length}
                </div>
                <div className="text-sm text-purple-800">Students</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Course Modules</h4>
              <div className="space-y-2">
                {(courseModules[selectedCourse.id] || []).map((module, index) => (
                  <div key={module.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{module.title}</h4>
                        <p className="text-xs text-gray-500">{module.totalChapters} chapters • {module.estimatedDuration}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                className="flex-1"
                onClick={() => {
                  setShowCourseModal(false)
                  toast.info('Course editor coming soon!')
                }}
              >
                <Edit size={16} className="mr-2" />
                Edit Course
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowCourseModal(false)
                  handleCourseAction(selectedCourse.id, 'analytics')
                }}
              >
                <BarChart3 size={16} className="mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Student Management Modal */}
      <Modal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        title="Student Management"
        size="xl"
      >
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search students..."
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Courses</option>
              {assignedCourses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
            <Button 
              variant="outline"
              onClick={() => toast('Export functionality coming soon!')}
            >
              <Download size={16} className="mr-1" />
              Export
            </Button>
          </div>

          {/* Students List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredStudents.map((student) => {
              const studentStatus = getStudentStatus(student)
              const avgProgress = student.assignedCourses.reduce((sum, courseId) => 
                sum + getStudentCourseProgress(student.id, courseId), 0
              ) / student.assignedCourses.length
              
              return (
                <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 relative">
                      <img 
                        src={student.avatar} 
                        alt={student.name}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        studentStatus.color === 'success' ? 'bg-green-500' : 
                        studentStatus.color === 'warning' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={studentStatus.color} size="sm">
                          {studentStatus.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {student.assignedCourses.length} courses
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{Math.round(avgProgress)}%</div>
                    <div className="text-xs text-gray-500">Average Progress</div>
                    <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-primary-600 h-1.5 rounded-full" 
                        style={{ width: `${avgProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Modal>

      {/* Analytics Modal */}
      <Modal
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
        title="Instructor Analytics"
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
              <div className="text-sm text-blue-800">Total Courses</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.totalStudents}</div>
              <div className="text-sm text-green-800">Total Students</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.averageProgress}%</div>
              <div className="text-sm text-purple-800">Avg Progress</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.averageTestScore}%</div>
              <div className="text-sm text-yellow-800">Test Average</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Course Performance</h4>
            <div className="space-y-3">
              {assignedCourses.map(course => {
                const enrolledStudents = myStudents.filter(student => 
                  student.assignedCourses.includes(course.id)
                )
                const avgProgress = enrolledStudents.length > 0 ? 
                  enrolledStudents.reduce((sum, student) => 
                    sum + getStudentCourseProgress(student.id, course.id), 0
                  ) / enrolledStudents.length : 0
                
                return (
                  <div key={course.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <span className="text-sm text-gray-600">{enrolledStudents.length} students</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Average Progress</span>
                      <span className="font-medium">{Math.round(avgProgress)}%</span>
                    </div>
                    <Progress value={avgProgress} size="sm" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Modal>

      {/* Create Course Modal */}
      <Modal
        isOpen={showCreateCourseModal}
        onClose={() => setShowCreateCourseModal(false)}
        title="Create New Course"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Create a new course with modules and chapters. You can add content after creation.
          </p>
          <div className="text-center py-8">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Course Builder</h3>
            <p className="text-gray-600 mb-4">
              Full course creation interface coming soon!
            </p>
            <Button onClick={() => navigate('/courses/create')}>
              Go to Course Builder
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default InstructorDashboardPage
