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
  Shield, 
  Building2, 
  Users, 
  BookOpen, 
  Settings,
  Plus,
  Edit,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Award,
  Activity,
  TrendingUp,
  DollarSign,
  Clock,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  RotateCcw
} from 'lucide-react';

export default function SuperAdminDashboardPage() {
  const { user } = useAuthStore();
  const [colleges, setColleges] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);
  const [allInstructors, setAllInstructors] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [systemAnalytics, setSystemAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showCreateCollegeModal, setShowCreateCollegeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [editingPermissions, setEditingPermissions] = useState({});

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      
      const [collegesData, adminsData, instructorsData, studentsData, analyticsData] = await Promise.all([
        mockAPI.getAllColleges(),
        mockAPI.getAllAdmins(),
        mockAPI.getAllInstructors(),
        mockAPI.getAllStudents(),
        mockAPI.getSystemAnalytics()
      ]);
      
      setColleges(collegesData);
      setAllAdmins(adminsData);
      setAllInstructors(instructorsData);
      setAllStudents(studentsData);
      setAllCourses(mockData.courses);
      setSystemAnalytics(analyticsData);
      
    } catch (error) {
      console.error('Error fetching system data:', error);
      toast.error('Failed to load system data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserPermissions = (user) => {
    setSelectedUser(user);
    setEditingPermissions({ ...user.permissions });
    setShowPermissionsModal(true);
  };

  const savePermissions = async () => {
    try {
      await mockAPI.updateUserPermissions(selectedUser.id, editingPermissions);
      
      // Update local state
      if (selectedUser.role === 'admin') {
        setAllAdmins(prev => prev.map(admin => 
          admin.id === selectedUser.id 
            ? { ...admin, permissions: editingPermissions }
            : admin
        ));
      } else if (selectedUser.role === 'instructor') {
        setAllInstructors(prev => prev.map(instructor => 
          instructor.id === selectedUser.id 
            ? { ...instructor, permissions: editingPermissions }
            : instructor
        ));
      }
      
      toast.success('Permissions updated successfully');
      setShowPermissionsModal(false);
      setSelectedUser(null);
      setEditingPermissions({});
    } catch (error) {
      toast.error('Failed to update permissions');
    }
  };

  const togglePermission = (permission) => {
    setEditingPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  // const handleCollegeAction = async (collegeId, action) => {
  //   try {
  //     switch (action) {
  //       case 'view':
  //         const college = colleges.find(c => c.id === collegeId);
  //         setSelectedCollege(college);
  //         setShowCollegeModal(true);
  //         break;
  //       case 'edit':
  //         toast.info('College editing functionality coming soon!');
  //         break;
  //       case 'delete':
  //         if (window.confirm('Are you sure you want to delete this college?')) {
  //           await mockAPI.deleteCollege(collegeId);
  //           toast.success('College deleted successfully');
  //           fetchSystemData();
  //         }
  //         break;
  //       default:
  //         break;
  //     }
  //   } catch (error) {
  //     toast.error(`Failed to ${action} college`);
  //   }
  // };

  const handleUserAction = async (userId, action) => {
    try {
      switch (action) {
        case 'activate':
        case 'deactivate':
          await mockAPI.bulkUpdateUsers([userId], { isActive: action === 'activate' });
          toast.success(`User ${action}d successfully`);
          fetchSystemData();
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this user?')) {
            await mockAPI.deleteUser(userId);
            toast.success('User deleted successfully');
            fetchSystemData();
          }
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    }
  };

  const getCollegeAdmin = (collegeId) => {
    return allAdmins.find(admin => admin.collegeId === collegeId);
  };

  const getAdminCourses = (adminId) => {
    const admin = allAdmins.find(a => a.id === adminId);
    if (!admin) return [];
    return allCourses.filter(course => course.collegeId === admin.collegeId);
  };

  const getCourseInstructors = (courseId) => {
    const course = allCourses.find(c => c.id === courseId);
    if (!course) return [];
    return allInstructors.filter(instructor => 
      course.assignedInstructors.includes(instructor.id)
    );
  };

  const getCourseStudents = (courseId) => {
    const course = allCourses.find(c => c.id === courseId);
    if (!course) return [];
    return allStudents.filter(student => 
      student.assignedCourses && student.assignedCourses.includes(courseId)
    );
  };

  const getFilteredUsers = (users) => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading system dashboard...</p>
        </div>
      </div>
    );
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
              <p className="text-gray-600 mt-1">
                System-wide management and analytics across all institutions
              </p>
            </div>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Colleges</p>
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.totalColleges || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.totalAdmins || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Instructors</p>
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.totalInstructors || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.totalStudents || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.overview.totalCourses || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <Tabs.List className="mb-6">
            <Tabs.Trigger value="overview">System Overview</Tabs.Trigger>
            {/* <Tabs.Trigger value="colleges">Colleges</Tabs.Trigger> */}
            <Tabs.Trigger value="permissions">User Permissions</Tabs.Trigger>
            <Tabs.Trigger value="assignments">Course Assignments</Tabs.Trigger>
            <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Content value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">System Uptime</span>
                    <Badge variant="success">{systemAnalytics?.overview.systemUptime || '99.9%'}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="font-medium">{systemAnalytics?.overview.activeUsers || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Course Completion Rate</span>
                    <span className="font-medium">{systemAnalytics?.overview.avgCourseCompletion || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly Revenue</span>
                    <span className="font-medium">${systemAnalytics?.overview.totalRevenue || 0}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Building2 size={16} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">New college registered</p>
                      <p className="text-xs text-gray-500">Creative Arts Institute - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Users size={16} className="text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Admin permissions updated</p>
                      <p className="text-xs text-gray-500">Prof. Michael Chen - 4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <BookOpen size={16} className="text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Course published</p>
                      <p className="text-xs text-gray-500">Digital Art Mastery - 6 hours ago</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Tabs.Content>

          {/* Colleges Tab */}
          <Tabs.Content value="colleges">
            <Card className="p-6">
              {/* <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">College Management</h3>
                <Button onClick={() => setShowCreateCollegeModal(true)}>
                  <Plus size={16} className="mr-2" />
                  Add College
                </Button>
              </div> */}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colleges.map(college => {
                  const admin = getCollegeAdmin(college.id);
                  const adminCourses = admin ? getAdminCourses(admin.id) : [];
                  
                  return (
                    <div key={college.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                            <img 
                              src={college.logo} 
                              alt={college.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{college.name}</h4>
                            <p className="text-sm text-gray-600">{college.code}</p>
                          </div>
                        </div>
                        <Badge variant={college.status === 'active' ? 'success' : 'secondary'}>
                          {college.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Students</span>
                          <span className="font-medium">{college.totalStudents}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Instructors</span>
                          <span className="font-medium">{college.totalInstructors}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Courses</span>
                          <span className="font-medium">{adminCourses.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Admin</span>
                          <span className="font-medium">{admin?.name || 'Unassigned'}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCollegeAction(college.id, 'view')}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCollegeAction(college.id, 'edit')}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCollegeAction(college.id, 'delete')}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </Tabs.Content>

          {/* User Permissions Tab */}
          <Tabs.Content value="permissions">
            <div className="space-y-6">
              {/* Search and Filter */}
              <Card className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admins</option>
                    <option value="instructor">Instructors</option>
                  </select>
                </div>
              </Card>

              {/* Admins Permissions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Permissions</h3>
                <div className="space-y-4">
                  {getFilteredUsers(allAdmins).map(admin => {
                    const college = colleges.find(c => c.id === admin.collegeId);
                    const adminCourses = getAdminCourses(admin.id);
                    
                    return (
                      <div key={admin.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                              <img 
                                src={admin.avatar} 
                                alt={admin.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{admin.name}</h4>
                              <p className="text-sm text-gray-600">{admin.email}</p>
                              <p className="text-sm text-gray-500">{college?.name || 'No college assigned'}</p>
                              <p className="text-xs text-gray-500">{adminCourses.length} courses managed</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right text-sm">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-gray-600">Create Courses:</span>
                                <Badge variant={admin.permissions?.canCreateCourses ? 'success' : 'secondary'} size="sm">
                                  {admin.permissions?.canCreateCourses ? 'Enabled' : 'Disabled'}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-600">Manage Tests:</span>
                                <Badge variant={admin.permissions?.canManageTests ? 'success' : 'secondary'} size="sm">
                                  {admin.permissions?.canManageTests ? 'Enabled' : 'Disabled'}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserPermissions(admin)}
                            >
                              <Settings size={14} className="mr-1" />
                              Permissions
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Instructors Permissions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor Permissions</h3>
                <div className="space-y-4">
                  {getFilteredUsers(allInstructors).map(instructor => {
                    const college = colleges.find(c => c.id === instructor.collegeId);
                    const assignedCourses = instructor.assignedCourses || [];
                    
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
                              <p className="text-sm text-gray-500">{college?.name || 'No college assigned'}</p>
                              <p className="text-xs text-gray-500">{assignedCourses.length} courses assigned</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right text-sm">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-gray-600">Create Courses:</span>
                                <Badge variant={instructor.permissions?.canCreateCourses ? 'success' : 'secondary'} size="sm">
                                  {instructor.permissions?.canCreateCourses ? 'Enabled' : 'Disabled'}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-600">Create Tests:</span>
                                <Badge variant={instructor.permissions?.canCreateTests ? 'success' : 'secondary'} size="sm">
                                  {instructor.permissions?.canCreateTests ? 'Enabled' : 'Disabled'}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserPermissions(instructor)}
                            >
                              <Settings size={14} className="mr-1" />
                              Permissions
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </Tabs.Content>

          {/* Course Assignments Tab */}
          <Tabs.Content value="assignments">
            <div className="space-y-6">
              {/* Admin-Course Assignments */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin-Course Assignments</h3>
                <div className="space-y-4">
                  {allAdmins.map(admin => {
                    const college = colleges.find(c => c.id === admin.collegeId);
                    const adminCourses = getAdminCourses(admin.id);
                    
                    return (
                      <div key={admin.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                              <img 
                                src={admin.avatar} 
                                alt={admin.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{admin.name}</h4>
                              <p className="text-sm text-gray-600">{college?.name || 'No college'}</p>
                            </div>
                          </div>
                          <Badge variant="info" size="sm">
                            {adminCourses.length} courses
                          </Badge>
                        </div>
                        
                        {adminCourses.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {adminCourses.map(course => {
                              const instructors = getCourseInstructors(course.id);
                              const students = getCourseStudents(course.id);
                              
                              return (
                                <div key={course.id} className="p-3 bg-gray-50 rounded-lg">
                                  <h5 className="font-medium text-gray-900 mb-1">{course.title}</h5>
                                  <div className="text-xs text-gray-600 space-y-1">
                                    <div>Instructors: {instructors.map(i => i.name).join(', ') || 'None'}</div>
                                    <div>Students: {students.length}</div>
                                    <div>Status: {course.status}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No courses assigned</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Course-User Assignments */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course-User Assignments</h3>
                <div className="space-y-4">
                  {allCourses.map(course => {
                    const instructors = getCourseInstructors(course.id);
                    const students = getCourseStudents(course.id);
                    const college = colleges.find(c => c.id === course.collegeId);
                    const admin = getCollegeAdmin(course.collegeId);
                    
                    return (
                      <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
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
                              <p className="text-sm text-gray-600">{college?.name || 'No college'}</p>
                              <p className="text-xs text-gray-500">Managed by: {admin?.name || 'No admin'}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant="info" size="sm">
                              {instructors.length} instructors
                            </Badge>
                            <Badge variant="success" size="sm">
                              {students.length} students
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Assigned Instructors:</h5>
                            {instructors.length > 0 ? (
                              <div className="space-y-1">
                                {instructors.map(instructor => (
                                  <div key={instructor.id} className="flex items-center space-x-2 text-sm">
                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100">
                                      <img 
                                        src={instructor.avatar} 
                                        alt={instructor.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <span className="text-gray-900">{instructor.name}</span>
                                    <div className="flex space-x-1">
                                      {instructor.permissions?.canCreateCourses && (
                                        <Badge variant="success" size="sm">Course</Badge>
                                      )}
                                      {instructor.permissions?.canCreateTests && (
                                        <Badge variant="warning" size="sm">Test</Badge>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">No instructors assigned</p>
                            )}
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Enrolled Students:</h5>
                            {students.length > 0 ? (
                              <div className="space-y-1">
                                {students.slice(0, 3).map(student => (
                                  <div key={student.id} className="flex items-center space-x-2 text-sm">
                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100">
                                      <img 
                                        src={student.avatar} 
                                        alt={student.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <span className="text-gray-900">{student.name}</span>
                                  </div>
                                ))}
                                {students.length > 3 && (
                                  <p className="text-xs text-gray-500">+{students.length - 3} more students</p>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">No students enrolled</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </Tabs.Content>

          {/* Analytics Tab */}
          <Tabs.Content value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">College Performance</h3>
                <div className="space-y-4">
                  {colleges.map(college => {
                    const breakdown = systemAnalytics?.collegeBreakdown?.[college.id];
                    if (!breakdown) return null;
                    
                    return (
                      <div key={college.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{college.name}</h4>
                          <p className="text-sm text-gray-600">
                            {breakdown.students} students • {breakdown.instructors} instructors
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">${breakdown.revenue}</div>
                          <div className="text-sm text-gray-500">{breakdown.courses} courses</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
                <div className="space-y-4">
                  {systemAnalytics?.performanceMetrics && Object.entries(systemAnalytics.performanceMetrics).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              value > 80 ? 'bg-red-500' : value > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(value, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {typeof value === 'number' ? `${value}${key.includes('Usage') ? '%' : key.includes('Time') ? 'ms' : ''}` : value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Tabs.Content>
        </Tabs>

        {/* Permissions Modal */}
        <Modal
          isOpen={showPermissionsModal}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedUser(null);
            setEditingPermissions({});
          }}
          title={`Manage Permissions - ${selectedUser?.name}`}
          size="lg"
        >
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <img 
                    src={selectedUser.avatar} 
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  <Badge variant={selectedUser.role === 'admin' ? 'danger' : 'warning'}>
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Permission Settings</h4>
                <div className="space-y-4">
                  {selectedUser.role === 'admin' && (
                    <>
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">Create Courses</h5>
                          <p className="text-sm text-gray-600">Allow admin to create new courses</p>
                        </div>
                        <button
                          onClick={() => togglePermission('canCreateCourses')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            editingPermissions.canCreateCourses ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              editingPermissions.canCreateCourses ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">Create Tests</h5>
                          <p className="text-sm text-gray-600">Allow admin to create and manage tests</p>
                        </div>
                        <button
                          onClick={() => togglePermission('canCreateTests')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            editingPermissions.canCreateTests ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              editingPermissions.canCreateTests ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">Manage Tests</h5>
                          <p className="text-sm text-gray-600">Allow admin to edit and delete tests</p>
                        </div>
                        <button
                          onClick={() => togglePermission('canManageTests')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            editingPermissions.canManageTests ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              editingPermissions.canManageTests ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </>
                  )}

                  {selectedUser.role === 'instructor' && (
                    <>
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">Create Courses</h5>
                          <p className="text-sm text-gray-600">Allow instructor to create new courses</p>
                        </div>
                        <button
                          onClick={() => togglePermission('canCreateCourses')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            editingPermissions.canCreateCourses ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              editingPermissions.canCreateCourses ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">Create Tests</h5>
                          <p className="text-sm text-gray-600">Allow instructor to create tests for their courses</p>
                        </div>
                        <button
                          onClick={() => togglePermission('canCreateTests')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            editingPermissions.canCreateTests ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              editingPermissions.canCreateTests ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">Manage Tests</h5>
                          <p className="text-sm text-gray-600">Allow instructor to edit and delete their tests</p>
                        </div>
                        <button
                          onClick={() => togglePermission('canManageTests')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            editingPermissions.canManageTests ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              editingPermissions.canManageTests ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">Manage Students</h5>
                          <p className="text-sm text-gray-600">Allow instructor to manage their assigned students</p>
                        </div>
                        <button
                          onClick={() => togglePermission('canManageStudents')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            editingPermissions.canManageStudents ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              editingPermissions.canManageStudents ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">View Analytics</h5>
                          <p className="text-sm text-gray-600">Allow instructor to view course and student analytics</p>
                        </div>
                        <button
                          onClick={() => togglePermission('canViewAnalytics')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            editingPermissions.canViewAnalytics ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              editingPermissions.canViewAnalytics ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingPermissions({ ...selectedUser.permissions });
                  }}
                >
                  <RotateCcw size={16} className="mr-2" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPermissionsModal(false);
                    setSelectedUser(null);
                    setEditingPermissions({});
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={savePermissions}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* College Details Modal */}
        <Modal
          isOpen={showCollegeModal}
          onClose={() => {
            setShowCollegeModal(false);
            setSelectedCollege(null);
          }}
          title={selectedCollege?.name}
          size="lg"
        >
          {selectedCollege && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={selectedCollege.logo} 
                    alt={selectedCollege.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedCollege.name}</h3>
                  <p className="text-gray-600">{selectedCollege.code}</p>
                  <Badge variant={selectedCollege.status === 'active' ? 'success' : 'secondary'}>
                    {selectedCollege.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">{selectedCollege.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{selectedCollege.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{selectedCollege.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Established</label>
                  <p className="text-gray-900">{selectedCollege.establishedYear}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">{selectedCollege.totalStudents}</div>
                  <div className="text-sm text-blue-800">Students</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">{selectedCollege.totalInstructors}</div>
                  <div className="text-sm text-green-800">Instructors</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">{getAdminCourses(getCollegeAdmin(selectedCollege.id)?.id).length}</div>
                  <div className="text-sm text-purple-800">Courses</div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setShowCollegeModal(false);
                    toast.info('College editing functionality coming soon!');
                  }}
                >
                  <Edit size={16} className="mr-2" />
                  Edit College
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowCollegeModal(false);
                    toast.info('College analytics coming soon!');
                  }}
                >
                  <Activity size={16} className="mr-2" />
                  View Analytics
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Create College Modal */}
        <Modal
          isOpen={showCreateCollegeModal}
          onClose={() => setShowCreateCollegeModal(false)}
          title="Create New College"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Add a new educational institution to the platform.
            </p>
            <div className="text-center py-8">
              <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">College Registration</h3>
              <p className="text-gray-600 mb-4">
                Full college creation interface coming soon!
              </p>
              <Button onClick={() => toast('College creation functionality coming soon!')}>
                Create College
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}