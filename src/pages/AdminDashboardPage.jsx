import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  Activity,
  Edit,
  Eye,
  UserCheck,
  UserX,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Settings,
  Award,
  Clock,
  TrendingUp,
  Shield,
  FileText,
  BarChart3,
  MessageSquare,
  Target,
  CheckCircle,
  AlertCircle,
  Brain,
  PlayCircle,
  UserPlus,
  BookMarked,
  GraduationCap,
  Star,
  Calendar,
  Bell,
  PieChart
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Tabs from '../components/ui/Tabs';
import Progress from '../components/ui/Progress';
import useAuthStore from '../store/useAuthStore';
import { mockAPI, mockData } from '../services/mockData';
import { toast } from 'react-hot-toast';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // State management
  const [dashboardData, setDashboardData] = useState({
    users: [],
    courses: [],
    payments: [],
    stats: {}
  });
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [courseModules, setCourseModules] = useState({});
  const [studentProgress, setStudentProgress] = useState({});
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  
  // Form states
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'student',
    password: 'TempPass123'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get admin dashboard data
      const data = await mockAPI.getAdminDashboardData(user.id);
      setDashboardData(data);
      
      // Separate users by role
      const instructorUsers = data.users.filter(u => u.role === 'instructor');
      const studentUsers = data.users.filter(u => u.role === 'student');
      setInstructors(instructorUsers);
      setStudents(studentUsers);
      
      // Get modules for each course
      const modulesData = {};
      for (const course of data.courses) {
        const modules = await mockAPI.getCourseModules(course.id);
        modulesData[course.id] = modules;
      }
      setCourseModules(modulesData);
      
      // Get student progress data
      const progressData = {};
      for (const student of studentUsers) {
        for (const courseId of student.assignedCourses) {
          const progress = await mockAPI.getStudentProgress(student.id, courseId);
          if (!progressData[student.id]) progressData[student.id] = {};
          progressData[student.id][courseId] = progress;
        }
      }
      setStudentProgress(progressData);
      
      // Get test results for college students
      const allTestResults = mockData.testResults.filter(result => 
        studentUsers.some(student => student.id === result.studentId)
      );
      setTestResults(allTestResults);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      if (!newUserData.name || !newUserData.email) {
        toast.error('Please fill in all required fields');
        return;
      }

      const userData = {
        ...newUserData,
        collegeId: user.collegeId,
        assignedBy: user.id,
        permissions: newUserData.role === 'instructor' ? {
          canCreateCourses: false,
          canManageStudents: true,
          canViewAnalytics: true,
          canCreateTests: false,
          canManageTests: false
        } : undefined
      };

      await mockAPI.createUser(userData);
      toast.success(`${newUserData.role} created successfully!`);
      setShowCreateUserModal(false);
      setNewUserData({ name: '', email: '', role: 'student', password: 'TempPass123' });
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const updateUserPermissions = async (userId, permissions) => {
    try {
      await mockAPI.updateUserPermissions(userId, permissions);
      toast.success('Permissions updated successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update permissions');
    }
  };

  const assignStudentToInstructor = async (studentId, instructorId) => {
    try {
      await mockAPI.assignStudentToInstructor(studentId, instructorId);
      toast.success('Student assigned successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to assign student');
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const updates = action === 'activate' ? { isActive: true } : { isActive: false };
      await mockAPI.bulkUpdateUsers([userId], updates);
      toast.success(`User ${action}d successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleCourseAction = async (courseId, action) => {
    try {
      const updates = action === 'publish' ? { status: 'published' } : { status: 'draft' };
      await mockAPI.updateCourse(courseId, updates);
      toast.success(`Course ${action}ed successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error(`Failed to ${action} course`);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await mockAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const getFilteredUsers = () => {
    let filtered = dashboardData.users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }
    
    return filtered;
  };

  const getInstructorCourses = (instructorId) => {
    return dashboardData.courses.filter(course => 
      course.assignedInstructors.includes(instructorId)
    );
  };

  const getCourseStudents = (courseId) => {
    return students.filter(student => 
      student.assignedCourses.includes(courseId)
    );
  };

  const getStudentCourseProgress = (studentId, courseId) => {
    const progress = studentProgress[studentId]?.[courseId];
    if (!progress) return 0;
    return progress.overallProgress || 0;
  };

  const getStudentStatus = (student) => {
    const recentActivity = new Date(student.lastLogin);
    const daysSinceActivity = Math.floor((new Date() - recentActivity) / (1000 * 60 * 60 * 24));
    
    if (daysSinceActivity === 0) return { status: 'online', color: 'success' };
    if (daysSinceActivity <= 3) return { status: 'recent', color: 'warning' };
    return { status: 'inactive', color: 'danger' };
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(studentSearchTerm.toLowerCase());
    const matchesCourse = courseFilter === 'all' || student.assignedCourses.includes(courseFilter);
    return matchesSearch && matchesCourse;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const college = mockData.colleges.find(c => c.id === user.collegeId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Shield size={24} className="text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-gray-600">
                  Managing {college?.name || 'Your College'} - {dashboardData.stats.totalUsers} users, {dashboardData.stats.totalCourses} courses
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
              <Button onClick={() => setShowCreateUserModal(true)}>
                <UserPlus size={16} className="mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalUsers}</p>
                <p className="text-xs text-gray-500">{dashboardData.stats.activeUsers} active</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalCourses}</p>
                <p className="text-xs text-gray-500">
                  {dashboardData.courses.filter(c => c.status === 'published').length} published
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Instructors</p>
                <p className="text-2xl font-bold text-gray-900">{instructors.length}</p>
                <p className="text-xs text-gray-500">{students.length} students</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${dashboardData.stats.totalRevenue || 0}
                </p>
                <p className="text-xs text-gray-500">Total earnings</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview">
          <Tabs.List className="mb-6">
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="instructors">Instructors ({instructors.length})</Tabs.Trigger>
            <Tabs.Trigger value="students">Students ({students.length})</Tabs.Trigger>
            <Tabs.Trigger value="courses">Courses ({dashboardData.courses.length})</Tabs.Trigger>
            <Tabs.Trigger value="permissions">Permissions</Tabs.Trigger>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Content value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card>
                  <Card.Header>
                    <Card.Title className="flex items-center">
                      <Activity size={20} className="mr-2 text-blue-500" />
                      Recent Activity & Course Performance
                    </Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-4">
                      {dashboardData.courses.map(course => {
                        const courseStudents = getCourseStudents(course.id);
                        const instructor = instructors.find(i => course.assignedInstructors.includes(i.id));
                        const avgProgress = courseStudents.length > 0 ? 
                          courseStudents.reduce((sum, student) => 
                            sum + getStudentCourseProgress(student.id, course.id), 0
                          ) / courseStudents.length : 0;

                        return (
                          <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
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
                                  <p className="text-sm text-gray-600">by {instructor?.name || 'Unassigned'}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant={course.status === 'published' ? 'success' : 'warning'} size="sm">
                                      {course.status}
                                    </Badge>
                                    <Badge variant="info" size="sm">{course.level}</Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-sm text-gray-600 mb-2">
                                  {courseStudents.length} students • {Math.round(avgProgress)}% avg progress
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCourse(course);
                                      setShowCourseModal(true);
                                    }}
                                  >
                                    <Eye size={14} />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCourseAction(course.id, course.status === 'published' ? 'unpublish' : 'publish')}
                                  >
                                    {course.status === 'published' ? 'Unpublish' : 'Publish'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-600">Student Progress</span>
                                <span className="font-medium text-gray-900">{Math.round(avgProgress)}%</span>
                              </div>
                              <Progress value={avgProgress} size="sm" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card.Content>
                </Card>
              </div>

              {/* Quick Stats & Actions */}
              <div className="space-y-6">
                <Card>
                  <Card.Header>
                    <Card.Title className="flex items-center">
                      <Target size={20} className="mr-2 text-green-500" />
                      Quick Actions
                    </Card.Title>
                  </Card.Header>
                  <Card.Content className="space-y-3">
                    <Button 
                      className="w-full justify-start"
                      onClick={() => setShowCreateUserModal(true)}
                    >
                      <UserPlus size={16} className="mr-2" />
                      Add New User
                    </Button>
                    <Link to="/courses/create">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          const currentUser = mockData.users.find(u => u.id === user.id);
                          if (!currentUser?.permissions?.canCreateCourses) {
                            toast.error('You do not have permission to create courses');
                            return;
                          }
                        }}
                      >
                        <Plus size={16} className="mr-2" />
                        Create Course
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setShowPermissionsModal(true)}
                    >
                      <Settings size={16} className="mr-2" />
                      Manage Permissions
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
                      onClick={() => toast('Bulk operations coming soon!')}
                    >
                      <Download size={16} className="mr-2" />
                      Export Data
                    </Button>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title className="flex items-center">
                      <Award size={20} className="mr-2 text-yellow-500" />
                      Recent Test Results
                    </Card.Title>
                  </Card.Header>
                  <Card.Content>
                    {testResults.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No test results yet</p>
                    ) : (
                      <div className="space-y-3">
                        {testResults.slice(0, 5).map((result) => {
                          const student = students.find(s => s.id === result.studentId);
                          const course = dashboardData.courses.find(c => c.id === result.courseId);
                          
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
                          );
                        })}
                      </div>
                    )}
                  </Card.Content>
                </Card>
              </div>
            </div>
          </Tabs.Content>

          {/* Instructors Tab */}
          <Tabs.Content value="instructors">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Instructor Management</h3>
                <Button onClick={() => {
                  setNewUserData({ ...newUserData, role: 'instructor' });
                  setShowCreateUserModal(true);
                }}>
                  <Plus size={16} className="mr-2" />
                  Add Instructor
                </Button>
              </div>
              
              <div className="space-y-4">
                {instructors.map(instructor => {
                  const assignedCourses = getInstructorCourses(instructor.id);
                  const totalStudents = instructor.students?.length || 0;
                  
                  return (
                    <div key={instructor.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                            <img 
                              src={instructor.avatar} 
                              alt={instructor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{instructor.name}</h4>
                            <p className="text-sm text-gray-600">{instructor.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={instructor.isActive ? 'success' : 'secondary'} size="sm">
                                {instructor.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              {instructor.isVerified && (
                                <Badge variant="info" size="sm">Verified</Badge>
                              )}
                              {instructor.permissions?.canCreateCourses && (
                                <Badge variant="warning" size="sm">Can Create Courses</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-2">
                            {assignedCourses.length} courses • {totalStudents} students
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(instructor);
                                setShowUserModal(true);
                              }}
                            >
                              <Eye size={14} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(instructor);
                                setShowPermissionsModal(true);
                              }}
                            >
                              <Settings size={14} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction(instructor.id, instructor.isActive ? 'deactivate' : 'activate')}
                            >
                              {instructor.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {assignedCourses.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Assigned Courses:</h5>
                          <div className="flex flex-wrap gap-2">
                            {assignedCourses.map(course => (
                              <Badge key={course.id} variant="outline" size="sm">
                                {course.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </Tabs.Content>

          {/* Students Tab */}
          <Tabs.Content value="students">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Student Management</h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search students..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Courses</option>
                    {dashboardData.courses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                  <Button onClick={() => {
                    setNewUserData({ ...newUserData, role: 'student' });
                    setShowCreateUserModal(true);
                  }}>
                    <Plus size={16} className="mr-2" />
                    Add Student
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredStudents.map((student) => {
                  const studentStatus = getStudentStatus(student);
                  const instructor = instructors.find(i => i.id === student.instructorId);
                  const avgProgress = student.assignedCourses.reduce((sum, courseId) => 
                    sum + getStudentCourseProgress(student.id, courseId), 0
                  ) / (student.assignedCourses.length || 1);
                  
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
                              Instructor: {instructor?.name || 'Unassigned'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
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
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowStudentModal(true);
                            }}
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserAction(student.id, student.isActive ? 'deactivate' : 'activate')}
                          >
                            {student.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </Tabs.Content>

          {/* Courses Tab */}
          <Tabs.Content value="courses">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Course Management</h3>
                <Link to="/courses/create">
                  <Button onClick={() => {
                    const currentUser = mockData.users.find(u => u.id === user.id);
                    if (!currentUser?.permissions?.canCreateCourses) {
                      toast.error('You do not have permission to create courses');
                      return;
                    }
                  }}>
                    <Plus size={16} className="mr-2" />
                    Create Course
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.courses.map(course => {
                  const instructor = instructors.find(i => course.assignedInstructors.includes(i.id));
                  const enrolledStudents = getCourseStudents(course.id);
                  const modules = courseModules[course.id] || [];
                  
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
                            <p className="text-xs text-gray-500 mt-1">{course.description}</p>
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
                            {enrolledStudents.length} students • {modules.length} modules
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            ${course.price} • {course.estimatedDuration}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCourse(course);
                                setShowCourseModal(true);
                              }}
                            >
                              <Eye size={14} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast('Course editing coming soon!')}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCourseAction(course.id, course.status === 'published' ? 'unpublish' : 'publish')}
                            >
                              {course.status === 'published' ? 'Unpublish' : 'Publish'}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {enrolledStudents.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Enrolled Students:</h5>
                          <div className="flex flex-wrap gap-2">
                            {enrolledStudents.slice(0, 5).map(student => (
                              <Badge key={student.id} variant="outline" size="sm">
                                {student.name}
                              </Badge>
                            ))}
                            {enrolledStudents.length > 5 && (
                              <Badge variant="secondary" size="sm">
                                +{enrolledStudents.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </Tabs.Content>

          {/* Permissions Tab */}
          <Tabs.Content value="permissions">
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Permission Management</h3>
                <p className="text-gray-600">Manage individual permissions for instructors in your college.</p>
              </div>
              
              <div className="space-y-4">
                {instructors.map(instructor => (
                  <div key={instructor.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                          <img 
                            src={instructor.avatar} 
                            alt={instructor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{instructor.name}</h4>
                          <p className="text-sm text-gray-600">{instructor.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-gray-900">Create Courses</span>
                          <p className="text-xs text-gray-500">Allow creating new courses</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={instructor.permissions?.canCreateCourses || false}
                            onChange={(e) => updateUserPermissions(instructor.id, {
                              canCreateCourses: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-gray-900">Create Tests</span>
                          <p className="text-xs text-gray-500">Allow creating new tests</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={instructor.permissions?.canCreateTests || false}
                            onChange={(e) => updateUserPermissions(instructor.id, {
                              canCreateTests: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-gray-900">Manage Tests</span>
                          <p className="text-xs text-gray-500">Allow editing existing tests</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={instructor.permissions?.canManageTests || false}
                            onChange={(e) => updateUserPermissions(instructor.id, {
                              canManageTests: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Tabs.Content>
        </Tabs>

        {/* User Details Modal */}
        <Modal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          title={`${selectedUser?.name} - Details`}
          size="lg"
        >
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                  <img 
                    src={selectedUser.avatar} 
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={selectedUser.role === 'instructor' ? 'warning' : 'info'}>
                      {selectedUser.role}
                    </Badge>
                    <Badge variant={selectedUser.isActive ? 'success' : 'secondary'}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Joined Date</label>
                  <p className="text-gray-900">{new Date(selectedUser.joinedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Login</label>
                  <p className="text-gray-900">
                    {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Assigned Courses</label>
                  <p className="text-gray-900">{selectedUser.assignedCourses?.length || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {selectedUser.role === 'instructor' ? 'Students' : 'Instructor'}
                  </label>
                  <p className="text-gray-900">
                    {selectedUser.role === 'instructor' 
                      ? selectedUser.students?.length || 0
                      : instructors.find(i => i.id === selectedUser.instructorId)?.name || 'Unassigned'
                    }
                  </p>
                </div>
              </div>

              {selectedUser.role === 'instructor' && selectedUser.permissions && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Current Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedUser.permissions).map(([key, value]) => (
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

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUserModal(false);
                    setSelectedUser(null);
                  }}
                >
                  Close
                </Button>
                {selectedUser.role === 'instructor' && (
                  <Button 
                    onClick={() => {
                      setShowUserModal(false);
                      setShowPermissionsModal(true);
                    }}
                  >
                    <Settings size={16} className="mr-2" />
                    Edit Permissions
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal>

        {/* Course Details Modal */}
        <Modal
          isOpen={showCourseModal}
          onClose={() => {
            setShowCourseModal(false);
            setSelectedCourse(null);
          }}
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
                    {getCourseStudents(selectedCourse.id).length}
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
                        <Eye size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setShowCourseModal(false);
                    toast.info('Course editor coming soon!');
                  }}
                >
                  <Edit size={16} className="mr-2" />
                  Edit Course
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowCourseModal(false);
                    toast.info('Course analytics coming soon!');
                  }}
                >
                  <BarChart3 size={16} className="mr-2" />
                  Analytics
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Student Details Modal */}
        <Modal
          isOpen={showStudentModal}
          onClose={() => {
            setShowStudentModal(false);
            setSelectedStudent(null);
          }}
          title={`${selectedStudent?.name} - Student Details`}
          size="lg"
        >
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                  <img 
                    src={selectedStudent.avatar} 
                    alt={selectedStudent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-gray-600">{selectedStudent.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="info">Student</Badge>
                    <Badge variant={selectedStudent.isActive ? 'success' : 'secondary'}>
                      {selectedStudent.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Instructor</label>
                  <p className="text-gray-900">
                    {instructors.find(i => i.id === selectedStudent.instructorId)?.name || 'Unassigned'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Enrolled Courses</label>
                  <p className="text-gray-900">{selectedStudent.assignedCourses?.length || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Joined Date</label>
                  <p className="text-gray-900">{new Date(selectedStudent.joinedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Login</label>
                  <p className="text-gray-900">
                    {selectedStudent.lastLogin ? new Date(selectedStudent.lastLogin).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>

              {selectedStudent.assignedCourses?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Course Progress</h4>
                  <div className="space-y-3">
                    {selectedStudent.assignedCourses.map(courseId => {
                      const course = dashboardData.courses.find(c => c.id === courseId);
                      const progress = getStudentCourseProgress(selectedStudent.id, courseId);
                      
                      return (
                        <div key={courseId} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-medium text-gray-900">{course?.title}</h5>
                            <span className="text-sm text-gray-600">{progress}%</span>
                          </div>
                          <Progress value={progress} size="sm" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowStudentModal(false);
                    setSelectedStudent(null);
                  }}
                >
                  Close
                </Button>
                <Button onClick={() => toast('Student management features coming soon!')}>
                  <Edit size={16} className="mr-2" />
                  Manage Student
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Create User Modal */}
        <Modal
          isOpen={showCreateUserModal}
          onClose={() => {
            setShowCreateUserModal(false);
            setNewUserData({ name: '', email: '', role: 'student', password: 'TempPass123' });
          }}
          title="Add New User"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={newUserData.role}
                onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            <Input
              label="Full Name"
              value={newUserData.name}
              onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              placeholder="Enter full name"
            />

            <Input
              label="Email Address"
              type="email"
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              placeholder="Enter email address"
            />

            <Input
              label="Temporary Password"
              value={newUserData.password}
              onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
              placeholder="Temporary password"
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                The user will receive login credentials and can change their password after first login.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateUserModal(false);
                  setNewUserData({ name: '', email: '', role: 'student', password: 'TempPass123' });
                }}
              >
                Cancel
              </Button>
              <Button onClick={createUser}>
                <UserPlus size={16} className="mr-2" />
                Create User
              </Button>
            </div>
          </div>
        </Modal>

        {/* Permissions Modal */}
        <Modal
          isOpen={showPermissionsModal}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedUser(null);
          }}
          title={`Manage Permissions - ${selectedUser?.name}`}
          size="md"
        >
          {selectedUser && selectedUser.role === 'instructor' && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Configure what {selectedUser.name} can do in the system.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">Create Courses</span>
                    <p className="text-sm text-gray-500">Allow creating new courses</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions?.canCreateCourses || false}
                      onChange={(e) => updateUserPermissions(selectedUser.id, {
                        canCreateCourses: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">Create Tests</span>
                    <p className="text-sm text-gray-500">Allow creating new tests</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions?.canCreateTests || false}
                      onChange={(e) => updateUserPermissions(selectedUser.id, {
                        canCreateTests: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">Manage Tests</span>
                    <p className="text-sm text-gray-500">Allow editing existing tests</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions?.canManageTests || false}
                      onChange={(e) => updateUserPermissions(selectedUser.id, {
                        canManageTests: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPermissionsModal(false);
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={() => {
                  setShowPermissionsModal(false);
                  setSelectedUser(null);
                  toast.success('Permissions updated successfully');
                }}>
                  <Settings size={16} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Analytics Modal */}
        <Modal
          isOpen={showAnalyticsModal}
          onClose={() => setShowAnalyticsModal(false)}
          title="College Analytics"
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{dashboardData.stats.totalCourses}</div>
                <div className="text-sm text-blue-800">Total Courses</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{dashboardData.stats.totalUsers}</div>
                <div className="text-sm text-green-800">Total Users</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{instructors.length}</div>
                <div className="text-sm text-purple-800">Instructors</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{students.length}</div>
                <div className="text-sm text-yellow-800">Students</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Course Performance</h4>
              <div className="space-y-3">
                {dashboardData.courses.map(course => {
                  const courseStudents = getCourseStudents(course.id);
                  const avgProgress = courseStudents.length > 0 ? 
                    courseStudents.reduce((sum, student) => 
                      sum + getStudentCourseProgress(student.id, course.id), 0
                    ) / courseStudents.length : 0;
                  
                  return (
                    <div key={course.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                        <span className="text-sm text-gray-600">{courseStudents.length} students</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Average Progress</span>
                        <span className="font-medium">{Math.round(avgProgress)}%</span>
                      </div>
                      <Progress value={avgProgress} size="sm" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}