import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Tabs from '../components/ui/Tabs';
import useAuthStore from '../store/useAuthStore';
import { mockAPI, mockData } from '../services/mockData';
import toast from 'react-hot-toast';
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
  TrendingUp
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get college-specific data for this admin
      const collegeUsers = await mockAPI.getCollegeUsers(user.collegeId);
      const collegeCourses = await mockAPI.getCollegeCourses(user.collegeId);
      
      setUsers(collegeUsers);
      setCourses(collegeCourses);
      setInstructors(collegeUsers.filter(u => u.role === 'instructor'));
      setStudents(collegeUsers.filter(u => u.role === 'student'));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      await mockAPI.bulkUpdateUsers([userId], 
        action === 'activate' ? { isActive: true } : { isActive: false }
      );
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

  const getFilteredUsers = () => {
    let filtered = users;
    
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
    return courses.filter(course => course.assignedInstructors.includes(instructorId));
  };

  const getCourseStudents = (courseId) => {
    return students.filter(student => student.assignedCourses.includes(courseId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const college = mockData.colleges.find(c => c.id === user.collegeId);
  const stats = {
    totalUsers: users.length,
    totalCourses: courses.length,
    totalInstructors: instructors.length,
    totalStudents: students.length,
    activeUsers: users.filter(user => user.isActive).length,
    publishedCourses: courses.filter(course => course.status === 'published').length,
    totalRevenue: courses.reduce((sum, course) => sum + (course.price * course.enrolledStudents.length), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Settings size={24} className="text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">College Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Managing {college?.name || 'Your College'} - {stats.totalUsers} users, {stats.totalCourses} courses
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('students')}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500">{stats.activeUsers} active</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('courses')}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                <p className="text-xs text-gray-500">{stats.publishedCourses} published</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('instructors')}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Instructors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInstructors}</p>
                <p className="text-xs text-gray-500">{stats.totalStudents} students</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('overview')}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Total earnings</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="mb-6">
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="instructors">Instructors</Tabs.Trigger>
            <Tabs.Trigger value="students">Students</Tabs.Trigger>
            <Tabs.Trigger value="courses">Courses</Tabs.Trigger>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Content value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <UserCheck size={16} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">New instructor verified</p>
                      <p className="text-xs text-gray-500">Sarah Instructor - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <BookOpen size={16} className="text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Course published</p>
                      <p className="text-xs text-gray-500">Web Development Bootcamp - 4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Users size={16} className="text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Students enrolled</p>
                      <p className="text-xs text-gray-500">3 new enrollments - 6 hours ago</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h3>
                <div className="space-y-4">
                  {courses.slice(0, 3).map(course => {
                    const courseStudents = getCourseStudents(course.id);
                    const avgProgress = courseStudents.length > 0 ? 
                      courseStudents.reduce((sum, student) => {
                        const progress = student.progress?.[course.id]?.overallProgress || 0;
                        return sum + progress;
                      }, 0) / courseStudents.length : 0;

                    return (
                      <div key={course.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{course.title}</p>
                          <p className="text-sm text-gray-500">{courseStudents.length} students enrolled</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{Math.round(avgProgress)}%</div>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${avgProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </Tabs.Content>

          {/* Instructors Tab */}
          <Tabs.Content value="instructors">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Instructor Management</h3>
                <Button onClick={() => toast('Add instructor functionality coming soon')}>
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button onClick={() => toast('Add student functionality coming soon')}>
                    <Plus size={16} className="mr-2" />
                    Add Student
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredUsers().filter(u => u.role === 'student').map(student => {
                      const instructor = instructors.find(i => i.id === student.instructorId);
                      const studentCourses = student.assignedCourses || [];
                      const avgProgress = studentCourses.length > 0 ? 
                        studentCourses.reduce((sum, courseId) => {
                          return sum + (student.progress?.[courseId]?.overallProgress || 0);
                        }, 0) / studentCourses.length : 0;

                      return (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                <img 
                                  src={student.avatar} 
                                  alt={student.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                <div className="text-sm text-gray-500">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {instructor?.name || 'Unassigned'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {studentCourses.length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-primary-600 h-2 rounded-full" 
                                  style={{ width: `${avgProgress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">{Math.round(avgProgress)}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={student.isActive ? 'success' : 'secondary'}>
                              {student.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(student);
                                  setShowUserModal(true);
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
                          </td>
                        </tr>
                      );
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
                <Button onClick={() => toast('Create course functionality available in instructor panel')}>
                  <Plus size={16} className="mr-2" />
                  Create Course
                </Button>
              </div>
              
              <div className="space-y-4">
                {courses.map(course => {
                  const instructor = instructors.find(i => course.assignedInstructors.includes(i.id));
                  const enrolledStudents = getCourseStudents(course.id);
                  
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
                            {enrolledStudents.length} students • ${course.price}
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
        </Tabs>

        {/* User Details Modal */}
        <Modal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          title={selectedUser?.name}
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
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Permissions</label>
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
                <Button onClick={() => toast('User editing functionality coming soon')}>
                  <Edit size={16} className="mr-2" />
                  Edit User
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}