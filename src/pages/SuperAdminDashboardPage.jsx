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
  Users, 
  BookOpen, 
  Building2, 
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
  DollarSign,
  BarChart3,
  Globe,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle
} from 'lucide-react';

export default function SuperAdminDashboardPage() {
  const { user } = useAuthStore();
  const [colleges, setColleges] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [systemAnalytics, setSystemAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateCollegeModal, setShowCreateCollegeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      
      const [collegesData, usersData, coursesData, analyticsData] = await Promise.all([
        mockAPI.getAllColleges(),
        mockAPI.getAllStudents().then(students => [
          ...students,
          ...mockData.users.filter(u => ['admin', 'instructor', 'superadmin'].includes(u.role))
        ]),
        mockData.courses,
        mockAPI.getSystemAnalytics()
      ]);
      
      setColleges(collegesData);
      setAllUsers(usersData);
      setAllCourses(coursesData);
      setSystemAnalytics(analyticsData);
      
    } catch (error) {
      console.error('Error fetching system data:', error);
      toast.error('Failed to load system data');
    } finally {
      setLoading(false);
    }
  };

  const handleCollegeAction = async (collegeId, action) => {
    try {
      switch (action) {
        case 'view':
          const college = colleges.find(c => c.id === collegeId);
          setSelectedCollege(college);
          setShowCollegeModal(true);
          break;
        case 'edit':
          toast.info('College editing functionality coming soon');
          break;
        case 'deactivate':
        case 'activate':
          await mockAPI.updateCollege(collegeId, { 
            status: action === 'activate' ? 'active' : 'inactive' 
          });
          toast.success(`College ${action}d successfully`);
          fetchSystemData();
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error(`Failed to ${action} college`);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      switch (action) {
        case 'view':
          const user = allUsers.find(u => u.id === userId);
          setSelectedUser(user);
          setShowUserModal(true);
          break;
        case 'activate':
        case 'deactivate':
          await mockAPI.bulkUpdateUsers([userId], { 
            isActive: action === 'activate' 
          });
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

  const getFilteredUsers = () => {
    let filtered = allUsers;
    
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

  const getCollegeUsers = (collegeId) => {
    return allUsers.filter(user => user.collegeId === collegeId);
  };

  const getCollegeCourses = (collegeId) => {
    return allCourses.filter(course => course.collegeId === collegeId);
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

  const stats = systemAnalytics?.overview || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield size={24} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                System-wide management and analytics - {stats.totalColleges} colleges, {stats.totalUsers} users
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('colleges')}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Colleges</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalColleges}</p>
                <p className="text-xs text-gray-500">{colleges.filter(c => c.status === 'active').length} active</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('users')}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAdmins + stats.totalInstructors + stats.totalStudents}</p>
                <p className="text-xs text-gray-500">{stats.activeUsers} active</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('courses')}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                <p className="text-xs text-gray-500">{stats.totalModules} modules</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('analytics')}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue?.toLocaleString()}</p>
                <p className="text-xs text-gray-500">System-wide</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
-        <Tabs defaultValue="overview">
+        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
           <Tabs.List className="mb-6">
             <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
             <Tabs.Trigger value="colleges">Colleges</Tabs.Trigger>
             <Tabs.Trigger value="users">Users</Tabs.Trigger>
             <Tabs.Trigger value="courses">Courses</Tabs.Trigger>
             <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
           </Tabs.List>

           {/* Overview Tab */}
           <Tabs.Content value="overview">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <Card className="p-6">
                 <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                       <Server size={16} className="text-green-600" />
                       <span className="text-sm text-gray-700">System Uptime</span>
                     </div>
                     <Badge variant="success">{stats.systemUptime}</Badge>
                   </div>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                       <Activity size={16} className="text-blue-600" />
                       <span className="text-sm text-gray-700">Active Users</span>
                     </div>
                     <span className="text-sm font-medium">{stats.monthlyActiveUsers}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                       <TrendingUp size={16} className="text-purple-600" />
                       <span className="text-sm text-gray-700">Avg Course Completion</span>
                     </div>
                     <span className="text-sm font-medium">{stats.avgCourseCompletion}%</span>
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
                       <p className="text-xs text-gray-500">Creative Arts Institute - 5 days ago</p>
                     </div>
                   </div>
                   <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                     <Users size={16} className="text-blue-600" />
                     <div>
                       <p className="text-sm font-medium text-gray-900">Admin accounts created</p>
                       <p className="text-xs text-gray-500">3 new admins - 1 week ago</p>
                     </div>
                   </div>
                   <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                     <BookOpen size={16} className="text-purple-600" />
                     <div>
                       <p className="text-sm font-medium text-gray-900">Courses published</p>
                       <p className="text-xs text-gray-500">4 new courses - 2 weeks ago</p>
                     </div>
                   </div>
                 </div>
               </Card>
             </div>
           </Tabs.Content>

           {/* Colleges Tab */}
           <Tabs.Content value="colleges">
             <Card className="p-6">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-semibold text-gray-900">College Management</h3>
                 <Button onClick={() => setShowCreateCollegeModal(true)}>
                   <Plus size={16} className="mr-2" />
                   Add College
                 </Button>
               </div>
               
               <div className="space-y-4">
                 {colleges.map(college => {
                   const collegeUsers = getCollegeUsers(college.id);
                   const collegeCourses = getCollegeCourses(college.id);
                   const admins = collegeUsers.filter(u => u.role === 'admin');
                   const instructors = collegeUsers.filter(u => u.role === 'instructor');
                   const students = collegeUsers.filter(u => u.role === 'student');
                   
                   return (
                     <div key={college.id} className="border border-gray-200 rounded-lg p-6">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-4">
                           <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                             <img 
                               src={college.logo} 
                               alt={college.name}
                               className="w-full h-full object-cover"
                             />
                           </div>
                           <div>
                             <h4 className="text-lg font-semibold text-gray-900">{college.name}</h4>
                             <p className="text-sm text-gray-600">{college.code}</p>
                             <div className="flex items-center space-x-2 mt-1">
                               <Badge variant={college.status === 'active' ? 'success' : 'secondary'} size="sm">
                                 {college.status}
                               </Badge>
                               <span className="text-xs text-gray-500">Est. {college.establishedYear}</span>
                             </div>
                           </div>
                         </div>
                         
                         <div className="text-right">
                           <div className="grid grid-cols-3 gap-4 text-center mb-4">
                             <div>
                               <div className="text-lg font-bold text-gray-900">{students.length}</div>
                               <div className="text-xs text-gray-500">Students</div>
                             </div>
                             <div>
                               <div className="text-lg font-bold text-gray-900">{instructors.length}</div>
                               <div className="text-xs text-gray-500">Instructors</div>
                             </div>
                             <div>
                               <div className="text-lg font-bold text-gray-900">{collegeCourses.length}</div>
                               <div className="text-xs text-gray-500">Courses</div>
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
                               onClick={() => handleCollegeAction(college.id, college.status === 'active' ? 'deactivate' : 'activate')}
                             >
                               {college.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                             </Button>
                           </div>
                         </div>
                       </div>
                       
                       <div className="mt-4 pt-4 border-t border-gray-200">
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                           <div>
                             <span className="text-gray-600">Contact:</span>
                             <p className="font-medium text-gray-900">{college.email}</p>
                           </div>
                           <div>
                             <span className="text-gray-600">Phone:</span>
                             <p className="font-medium text-gray-900">{college.phone}</p>
                           </div>
                           <div>
                             <span className="text-gray-600">Admins:</span>
                             <p className="font-medium text-gray-900">{admins.length}</p>
                           </div>
                           <div>
                             <span className="text-gray-600">Revenue:</span>
                             <p className="font-medium text-gray-900">
                               ${systemAnalytics?.collegeBreakdown?.[college.id]?.revenue?.toLocaleString() || '0'}
                             </p>
                           </div>
                         </div>
                       </div>
                     </div>
                   );
                 })}
               </div>
             </Card>
           </Tabs.Content>

           {/* Users Tab */}
           <Tabs.Content value="users">
             <Card className="p-6">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                 <div className="flex space-x-2">
                   <Input
                     placeholder="Search users..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-64"
                   />
                   <select
                     value={filterRole}
                     onChange={(e) => setFilterRole(e.target.value)}
                     className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                   >
                     <option value="all">All Roles</option>
                     <option value="admin">Admins</option>
                     <option value="instructor">Instructors</option>
                     <option value="student">Students</option>
                   </select>
                   <Button onClick={() => toast('Add user functionality coming soon')}>
                     <Plus size={16} className="mr-2" />
                     Add User
                   </Button>
                 </div>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {getFilteredUsers().map(user => {
                       const college = colleges.find(c => c.id === user.collegeId);
                       
                       return (
                         <tr key={user.id}>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <div className="flex items-center">
                               <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                 <img 
                                   src={user.avatar} 
                                   alt={user.name}
                                   className="w-full h-full object-cover"
                                 />
                               </div>
                               <div className="ml-4">
                                 <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                 <div className="text-sm text-gray-500">{user.email}</div>
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <Badge variant={
                               user.role === 'superadmin' ? 'danger' :
                               user.role === 'admin' ? 'warning' :
                               user.role === 'instructor' ? 'info' : 'default'
                             }>
                               {user.role}
                             </Badge>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                             {college?.name || 'System-wide'}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                             <Badge variant={user.isActive ? 'success' : 'secondary'}>
                               {user.isActive ? 'Active' : 'Inactive'}
                             </Badge>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                             {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                             <div className="flex space-x-2">
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => handleUserAction(user.id, 'view')}
                               >
                                 <Eye size={14} />
                               </Button>
                               {user.role !== 'superadmin' && (
                                 <>
                                   <Button
                                     variant="outline"
                                     size="sm"
                                     onClick={() => handleUserAction(user.id, user.isActive ? 'deactivate' : 'activate')}
                                   >
                                     {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                                   </Button>
                                   <Button
                                     variant="outline"
                                     size="sm"
                                     onClick={() => handleUserAction(user.id, 'delete')}
                                     className="text-red-600 hover:text-red-700"
                                   >
                                     <Trash2 size={14} />
                                   </Button>
                                 </>
                               )}
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
                 <h3 className="text-lg font-semibold text-gray-900">Course Overview</h3>
                 <Button onClick={() => toast('Course creation available in college admin panels')}>
                   <Plus size={16} className="mr-2" />
                   View Course Creation
                 </Button>
               </div>
               
               <div className="space-y-4">
                 {allCourses.map(course => {
                   const college = colleges.find(c => c.id === course.collegeId);
                   const instructor = allUsers.find(u => course.assignedInstructors.includes(u.id));
                   const enrolledStudents = allUsers.filter(u => 
                     u.assignedCourses?.includes(course.id)
                   );
                   
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
                             <p className="text-sm text-gray-500">{college?.name}</p>
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
                           <div className="text-sm text-gray-600 mb-2">
                             {course.totalModules} modules • {course.totalChapters} chapters
                           </div>
                           <div className="flex space-x-2">
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => toast('Course analytics coming soon')}
                             >
                               <BarChart3 size={14} />
                             </Button>
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => toast('Course details coming soon')}
                             >
                               <Eye size={14} />
                             </Button>
                           </div>
                         </div>
                       </div>
                     </div>
                   );
                 })}
               </div>
             </Card>
           </Tabs.Content>

           {/* Analytics Tab */}
           <Tabs.Content value="analytics">
             <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <Card className="p-6">
                   <div className="flex items-center">
                     <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                       <Cpu size={24} className="text-blue-600" />
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-gray-600">CPU Usage</p>
                       <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.performanceMetrics?.cpuUsage}%</p>
                     </div>
                   </div>
                 </Card>

                 <Card className="p-6">
                   <div className="flex items-center">
                     <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                       <HardDrive size={24} className="text-green-600" />
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-gray-600">Memory Usage</p>
                       <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.performanceMetrics?.memoryUsage}%</p>
                     </div>
                   </div>
                 </Card>

                 <Card className="p-6">
                   <div className="flex items-center">
                     <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                       <Database size={24} className="text-purple-600" />
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-gray-600">Disk Usage</p>
                       <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.performanceMetrics?.diskUsage}%</p>
                     </div>
                   </div>
                 </Card>

                 <Card className="p-6">
                   <div className="flex items-center">
                     <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                       <Wifi size={24} className="text-yellow-600" />
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-gray-600">Network Latency</p>
                       <p className="text-2xl font-bold text-gray-900">{systemAnalytics?.performanceMetrics?.networkLatency}ms</p>
                     </div>
                   </div>
                 </Card>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card className="p-6">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">College Performance</h3>
                   <div className="space-y-4">
                     {colleges.map(college => {
                       const breakdown = systemAnalytics?.collegeBreakdown?.[college.id];
                       if (!breakdown) return null;
                       
                       return (
                         <div key={college.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                           <div className="flex items-center space-x-3">
                             <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                               <img 
                                 src={college.logo} 
                                 alt={college.name}
                                 className="w-full h-full object-cover"
                               />
                             </div>
                             <div>
                               <h4 className="font-medium text-gray-900">{college.name}</h4>
                               <p className="text-sm text-gray-500">
                                 {breakdown.students} students • {breakdown.instructors} instructors
                               </p>
                             </div>
                           </div>
                           <div className="text-right">
                             <div className="text-lg font-bold text-gray-900">
                               ${breakdown.revenue?.toLocaleString()}
                             </div>
                             <div className="text-sm text-gray-500">{breakdown.courses} courses</div>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </Card>

                 <Card className="p-6">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                   <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-gray-600">Error Rate</span>
                       <span className="text-sm font-medium text-gray-900">
                         {systemAnalytics?.performanceMetrics?.errorRate}%
                       </span>
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-gray-600">Response Time</span>
                       <span className="text-sm font-medium text-gray-900">
                         {systemAnalytics?.performanceMetrics?.responseTime}ms
                       </span>
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-gray-600">Monthly Active Users</span>
                       <span className="text-sm font-medium text-gray-900">
                         {stats.monthlyActiveUsers}
                       </span>
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-gray-600">System Uptime</span>
                       <Badge variant="success">{stats.systemUptime}</Badge>
                     </div>
                   </div>
                 </Card>
               </div>
             </div>
           </Tabs.Content>
        </Tabs>

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
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={selectedCollege.status === 'active' ? 'success' : 'secondary'}>
                      {selectedCollege.status}
                    </Badge>
                    <span className="text-sm text-gray-500">Est. {selectedCollege.establishedYear}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">{selectedCollege.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact</label>
                  <p className="text-gray-900">{selectedCollege.email}</p>
                  <p className="text-gray-900">{selectedCollege.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Website</label>
                  <a 
                    href={selectedCollege.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {selectedCollege.website}
                  </a>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Statistics</label>
                  <p className="text-gray-900">
                    {getCollegeUsers(selectedCollege.id).filter(u => u.role === 'student').length} Students
                  </p>
                  <p className="text-gray-900">
                    {getCollegeUsers(selectedCollege.id).filter(u => u.role === 'instructor').length} Instructors
                  </p>
                  <p className="text-gray-900">
                    {getCollegeCourses(selectedCollege.id).length} Courses
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCollegeModal(false);
                    setSelectedCollege(null);
                  }}
                >
                  Close
                </Button>
                <Button onClick={() => toast('College editing functionality coming soon')}>
                  <Edit size={16} className="mr-2" />
                  Edit College
                </Button>
              </div>
            </div>
          )}
        </Modal>

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
                    <Badge variant={
                      selectedUser.role === 'superadmin' ? 'danger' :
                      selectedUser.role === 'admin' ? 'warning' :
                      selectedUser.role === 'instructor' ? 'info' : 'default'
                    }>
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
                  <label className="text-sm font-medium text-gray-600">College</label>
                  <p className="text-gray-900">
                    {colleges.find(c => c.id === selectedUser.collegeId)?.name || 'System-wide'}
                  </p>
                </div>
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
                  <label className="text-sm font-medium text-gray-600">Assigned By</label>
                  <p className="text-gray-900">
                    {allUsers.find(u => u.id === selectedUser.assignedBy)?.name || 'System'}
                  </p>
                </div>
              </div>

              {selectedUser.permissions && (
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

        {/* Create College Modal */}
        <Modal
          isOpen={showCreateCollegeModal}
          onClose={() => setShowCreateCollegeModal(false)}
          title="Create New College"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Add a new college to the system. This will create a new organization that can have its own admins, instructors, and students.
            </p>
            <div className="text-center py-8">
              <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">College Registration</h3>
              <p className="text-gray-600 mb-4">
                Full college creation interface coming soon!
              </p>
              <Button onClick={() => toast('College creation form coming soon!')}>
                Create College Form
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}