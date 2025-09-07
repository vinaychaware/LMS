import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import Tabs, {
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/Tabs";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";
import {
  Shield,
  Building2,
  Users,
  BookOpen,
  Settings,
  Edit,
  Eye,
  Trash2,
  Award,
  Activity,
  Search,
  Save,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

// ✅ Backend base URL for superadmin routes

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SuperAdminDashboardPage() {
  const { token } = useAuthStore();
  const [colleges, setColleges] = useState([]); // Placeholder for future college API
  const [allAdmins, setAllAdmins] = useState([]);
  const [allInstructors, setAllInstructors] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [systemAnalytics, setSystemAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedCollege, setSelectedCollege] = useState(null); // Placeholder
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCollegeModal, setShowCollegeModal] = useState(false); // Placeholder
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showCreateCollegeModal, setShowCreateCollegeModal] = useState(false); // Placeholder

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [editingPermissions, setEditingPermissions] = useState({});

  useEffect(() => {
    fetchSystemData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------
  // Helpers: auth + requests
  // -------------------------
  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${
      token ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token") ||
      ""
    }`,
  });

  const fetchJSON = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: { ...authHeaders(), ...(options.headers || {}) },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(body?.message || body?.error || `HTTP ${res.status}`);
    }
    return body;
  };

  // -------------------------
  // Load data
  // -------------------------
  const fetchSystemData = async () => {
    try {
      setLoading(true);

      const [overviewData, admins, instructors, students, courses] =
        await Promise.all([
          fetchJSON(`${API_BASE}/api/superadmin/overview`),
          fetchJSON(`${API_BASE}/api/superadmin/admins`),
          fetchJSON(`${API_BASE}/api/superadmin/instructors`),
          fetchJSON(`${API_BASE}/api/superadmin/students`),
          fetchJSON(`${API_BASE}/api/courses`),
        ]);

      // Colleges not yet supported by backend
      setColleges([]);

      setAllAdmins(
        (admins || []).map((a) => ({
          ...a,
          avatar:
            a.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              a.name || "Admin"
            )}&background=random`,
        }))
      );

      setAllInstructors(
        (instructors || []).map((i) => ({
          ...i,
          avatar:
            i.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              i.name || "Instructor"
            )}&background=random`,
        }))
      );

      setAllStudents(
        (students || []).map((s) => ({
          ...s,
          avatar:
            s.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              s.name || "Student"
            )}&background=random`,
        }))
      );

      setAllCourses(
        (courses || []).map((c) => ({
          ...c,
          thumbnail: c.thumbnail || "https://picsum.photos/seed/course/300/200",
          status: c.status || "draft",
        }))
      );

      setSystemAnalytics({
        overview: overviewData.overview,
        performanceMetrics: overviewData.performanceMetrics,
        collegeBreakdown: overviewData.courseBreakdown, // reused safely
      });
    } catch (error) {
      console.error("Error fetching system data:", error);
      toast.error(error.message || "Failed to load system data");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Permissions
  // -------------------------
  const handleUserPermissions = (user) => {
    setSelectedUser(user);
    setEditingPermissions({ ...(user.permissions || {}) });
    setShowPermissionsModal(true);
  };

  const savePermissions = async () => {
    try {
      await fetchJSON(`${API_BASE}/users/${selectedUser.id}/permissions`, {
        method: "PATCH",
        body: JSON.stringify(editingPermissions),
      });

      if (
        selectedUser.role === "admin" ||
        selectedUser.role === "superadmin" ||
        String(selectedUser.role).toUpperCase() === "SUPER_ADMIN"
      ) {
        setAllAdmins((prev) =>
          prev.map((a) =>
            a.id === selectedUser.id
              ? { ...a, permissions: editingPermissions }
              : a
          )
        );
      } else if (String(selectedUser.role).toLowerCase() === "instructor") {
        setAllInstructors((prev) =>
          prev.map((i) =>
            i.id === selectedUser.id
              ? { ...i, permissions: editingPermissions }
              : i
          )
        );
      }

      toast.success("Permissions updated successfully");
      setShowPermissionsModal(false);
      setSelectedUser(null);
      setEditingPermissions({});
    } catch (err) {
      toast.error(err.message || "Failed to update permissions");
    }
  };

  // -------------------------
  // Relationship helpers
  // -------------------------
  const getAdminCourses = (adminId) =>
    allCourses.filter(
      (c) => c.creatorId === adminId || c.managerId === adminId
    );

  const getCourseInstructors = (courseId) =>
    allInstructors.filter(
      (i) =>
        Array.isArray(i.assignedCourses) && i.assignedCourses.includes(courseId)
    );

  const getCourseStudents = (courseId) =>
    allStudents.filter(
      (s) =>
        Array.isArray(s.assignedCourses) && s.assignedCourses.includes(courseId)
    );

  const getFilteredUsers = (users) => {
    let filtered = users;
    if (filterRole !== "all")
      filtered = filtered.filter(
        (u) => String(u.role).toLowerCase() === filterRole
      );
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          (u.name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q)
      );
    }
    return filtered;
  };

  // -------------------------
  // Placeholder college actions
  // -------------------------
  const handleCollegeAction = async (_collegeId, action) => {
    switch (action) {
      case "view":
        toast("College details coming soon.");
        break;
      case "edit":
        toast.info("College editing functionality coming soon!");
        break;
      case "delete":
        toast.error("No college API yet.");
        break;
      default:
        break;
    }
  };

  // -------------------------
  // UI
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading system dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center justify-between">
            {/* Left side: icon + title */}
            <div className="flex items-center sm:items-start sm:flex-row gap-4">
              <div className="w-12 h-12 flex-none bg-purple-100 rounded-full flex items-center justify-center">
                <Shield size={24} className="text-purple-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                  Super Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  System-wide management and analytics across all institutions
                </p>
              </div>
            </div>

            {/* Right side: actions */}
            <div className="flex gap-3">
              <Link to="/courses/create">
                <Button size="sm">
                  <Plus size={16} className="mr-2" />
                  Create Course
                </Button>
              </Link>

              <Link to="/register"  state={{ allowWhenLoggedIn: true }}>
                <Button size="sm">
                  <Plus size={16} className="mr-2" />
                  Add User
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 lg:mb-8">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-none">
                <Shield size={20} className="text-red-600 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Admins
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {systemAnalytics?.overview.totalAdmins || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-none">
                <Award size={20} className="text-green-600 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Instructors
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {systemAnalytics?.overview.totalInstructors || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-none">
                <Users size={20} className="text-purple-600 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Students
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {systemAnalytics?.overview.totalStudents || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-none">
                <BookOpen size={20} className="text-yellow-600 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Courses
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {systemAnalytics?.overview.totalCourses || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <div className="mb-4 sm:mb-6 sticky top-0 z-10 bg-gray-50 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="relative overflow-x-auto no-scrollbar">
              <TabsList
                className="flex gap-2 min-w-max snap-x snap-mandatory"
                aria-label="Dashboard sections"
              >
                <TabsTrigger
                  value="overview"
                  className="whitespace-nowrap snap-start px-3 sm:px-4 py-2 text-xs sm:text-sm"
                >
                  System Overview
                </TabsTrigger>
                <TabsTrigger
                  value="permissions"
                  className="whitespace-nowrap snap-start px-3 sm:px-4 py-2 text-xs sm:text-sm"
                >
                  User Permissions
                </TabsTrigger>
                <TabsTrigger
                  value="assignments"
                  className="whitespace-nowrap snap-start px-3 sm:px-4 py-2 text-xs sm:text-sm"
                >
                  Course Assignments
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="whitespace-nowrap snap-start px-3 sm:px-4 py-2 text-xs sm:text-sm"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  System Health
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">System Uptime</span>
                    <Badge variant="success">
                      {systemAnalytics?.overview.systemUptime || "99.9%"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="font-medium">
                      {systemAnalytics?.overview.activeUsers || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Course Completion Rate
                    </span>
                    <span className="font-medium">
                      {systemAnalytics?.overview.avgCourseCompletion || 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Monthly Revenue
                    </span>
                    <span className="font-medium">
                      ${systemAnalytics?.overview.totalRevenue || 0}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Building2 size={16} className="text-green-600 flex-none" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        System data loaded
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Overview & metrics fetched from API
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Users size={16} className="text-blue-600 flex-none" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Users synced
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Admins, Instructors, Students
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <BookOpen size={16} className="text-purple-600 flex-none" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Courses loaded
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Assignments & counts available
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Permissions */}
          <TabsContent value="permissions">
            <div className="space-y-6">
              <Card className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="sm:col-span-2">
                    <div className="relative">
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 w-full"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admins</option>
                    <option value="instructor">Instructors</option>
                  </select>
                </div>
              </Card>

              {/* Admins */}
              <Card className="p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Admin Permissions
                </h3>
                <div className="space-y-4">
                  {getFilteredUsers(allAdmins).map((admin) => {
                    const adminCourses = getAdminCourses(admin.id);
                    return (
                      <div
                        key={admin.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-none">
                              <img
                                src={admin.avatar}
                                alt={admin.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">
                                {admin.name}
                              </h4>
                              <p className="text-sm text-gray-600 truncate">
                                {admin.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                {adminCourses.length} courses managed
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            <div className="text-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-gray-600">
                                  Create Courses:
                                </span>
                                <Badge
                                  variant={
                                    admin.permissions?.canCreateCourses
                                      ? "success"
                                      : "secondary"
                                  }
                                  size="sm"
                                >
                                  {admin.permissions?.canCreateCourses
                                    ? "Enabled"
                                    : "Disabled"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">
                                  Manage Tests:
                                </span>
                                <Badge
                                  variant={
                                    admin.permissions?.canManageTests
                                      ? "success"
                                      : "secondary"
                                  }
                                  size="sm"
                                >
                                  {admin.permissions?.canManageTests
                                    ? "Enabled"
                                    : "Disabled"}
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

              {/* Instructors */}
              <Card className="p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Instructor Permissions
                </h3>
                <div className="space-y-4">
                  {getFilteredUsers(allInstructors).map((instructor) => {
                    const assignedCourses = instructor.assignedCourses || [];
                    return (
                      <div
                        key={instructor.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-none">
                              <img
                                src={instructor.avatar}
                                alt={instructor.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">
                                {instructor.name}
                              </h4>
                              <p className="text-sm text-gray-600 truncate">
                                {instructor.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                {assignedCourses.length} courses assigned
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            <div className="text-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-gray-600">
                                  Create Courses:
                                </span>
                                <Badge
                                  variant={
                                    instructor.permissions?.canCreateCourses
                                      ? "success"
                                      : "secondary"
                                  }
                                  size="sm"
                                >
                                  {instructor.permissions?.canCreateCourses
                                    ? "Enabled"
                                    : "Disabled"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">
                                  Create Tests:
                                </span>
                                <Badge
                                  variant={
                                    instructor.permissions?.canCreateTests
                                      ? "success"
                                      : "secondary"
                                  }
                                  size="sm"
                                >
                                  {instructor.permissions?.canCreateTests
                                    ? "Enabled"
                                    : "Disabled"}
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
          </TabsContent>

          {/* Assignments */}
          <TabsContent value="assignments">
            <div className="space-y-6">
              <Card className="p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Admin-Course Assignments
                </h3>
                <div className="space-y-4">
                  {allAdmins.map((admin) => {
                    const adminCourses = getAdminCourses(admin.id);
                    return (
                      <div
                        key={admin.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-none">
                              <img
                                src={admin.avatar}
                                alt={admin.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">
                                {admin.name}
                              </h4>
                              <p className="text-sm text-gray-600 truncate">
                                {admin.email}
                              </p>
                            </div>
                          </div>
                          <Badge variant="info" size="sm">
                            {adminCourses.length} courses
                          </Badge>
                        </div>

                        {adminCourses.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {adminCourses.map((course) => {
                              const instructors = getCourseInstructors(
                                course.id
                              );
                              const students = getCourseStudents(course.id);
                              return (
                                <div
                                  key={course.id}
                                  className="p-3 bg-gray-50 rounded-lg"
                                >
                                  <h5 className="font-medium text-gray-900 mb-1 truncate">
                                    {course.title}
                                  </h5>
                                  <div className="text-xs text-gray-600 space-y-1">
                                    <div className="truncate">
                                      Instructors:{" "}
                                      {instructors
                                        .map((i) => i.name)
                                        .join(", ") || "None"}
                                    </div>
                                    <div>Students: {students.length}</div>
                                    <div>Status: {course.status}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            No courses assigned
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Course-User Assignments
                </h3>
                <div className="space-y-4">
                  {allCourses.map((course) => {
                    const instructors = getCourseInstructors(course.id);
                    const students = getCourseStudents(course.id);
                    return (
                      <div
                        key={course.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-none">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">
                                {course.title}
                              </h4>
                              <p className="text-xs text-gray-500 truncate">
                                Managed by: {course.managerName || "—"}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
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
                            <h5 className="text-sm font-medium text-gray-700 mb-2">
                              Assigned Instructors:
                            </h5>
                            {instructors.length > 0 ? (
                              <div className="space-y-1">
                                {instructors.map((instructor) => (
                                  <div
                                    key={instructor.id}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 flex-none">
                                      <img
                                        src={instructor.avatar}
                                        alt={instructor.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <span className="text-gray-900 truncate">
                                      {instructor.name}
                                    </span>
                                    <div className="flex gap-1 flex-wrap">
                                      {instructor.permissions
                                        ?.canCreateCourses && (
                                        <Badge variant="success" size="sm">
                                          Course
                                        </Badge>
                                      )}
                                      {instructor.permissions
                                        ?.canCreateTests && (
                                        <Badge variant="warning" size="sm">
                                          Test
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">
                                No instructors assigned
                              </p>
                            )}
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">
                              Enrolled Students:
                            </h5>
                            {students.length > 0 ? (
                              <div className="space-y-1">
                                {students.slice(0, 3).map((student) => (
                                  <div
                                    key={student.id}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 flex-none">
                                      <img
                                        src={student.avatar}
                                        alt={student.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <span className="text-gray-900 truncate">
                                      {student.name}
                                    </span>
                                  </div>
                                ))}
                                {students.length > 3 && (
                                  <p className="text-xs text-gray-500">
                                    +{students.length - 3} more students
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">
                                No students enrolled
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Course Performance
                </h3>
                <div className="space-y-4">
                  {allCourses.map((c) => {
                    const breakdown = systemAnalytics?.collegeBreakdown?.[c.id];
                    if (!breakdown) return null;
                    return (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {breakdown.title || c.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {breakdown.students} students •{" "}
                            {breakdown.instructors} instructors
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            Status: {breakdown.status || c.status}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  System Performance
                </h3>
                <div className="space-y-4">
                  {systemAnalytics?.performanceMetrics &&
                    Object.entries(systemAnalytics.performanceMetrics).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="text-sm text-gray-600 capitalize truncate">
                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                          </span>
                          <div className="flex items-center gap-2 min-w-[140px]">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  (Number(value) || 0) > 80
                                    ? "bg-red-500"
                                    : (Number(value) || 0) > 60
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    Number(value) || 0,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {typeof value === "number"
                                ? `${value}${
                                    key.toLowerCase().includes("usage")
                                      ? "%"
                                      : key.toLowerCase().includes("time")
                                      ? "ms"
                                      : ""
                                  }`
                                : value}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Permissions Modal */}
        <Modal
          isOpen={showPermissionsModal}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedUser(null);
            setEditingPermissions({});
          }}
          title={`Manage Permissions - ${selectedUser?.name ?? ""}`}
          size="lg"
        >
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-none">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {selectedUser.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {selectedUser.email}
                  </p>
                  <Badge
                    variant={
                      String(selectedUser.role).toLowerCase() === "admin" ||
                      String(selectedUser.role).toUpperCase() === "SUPER_ADMIN"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {String(selectedUser.role).toLowerCase()}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">
                  Permission Settings
                </h4>
                <div className="space-y-4">
                  {(String(selectedUser.role).toLowerCase() === "admin" ||
                    String(selectedUser.role).toUpperCase() ===
                      "SUPER_ADMIN") && (
                    <>
                      {[
                        {
                          key: "canCreateCourses",
                          title: "Create Courses",
                          desc: "Allow user to create new courses",
                        },
                        {
                          key: "canCreateTests",
                          title: "Create Tests",
                          desc: "Allow user to create and manage tests",
                        },
                        {
                          key: "canManageTests",
                          title: "Manage Tests",
                          desc: "Allow user to edit and delete tests",
                        },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="pr-4">
                            <h5 className="font-medium text-gray-900">
                              {item.title}
                            </h5>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                          <button
                            onClick={() =>
                              setEditingPermissions((p) => ({
                                ...p,
                                [item.key]: !p[item.key],
                              }))
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              editingPermissions[item.key]
                                ? "bg-primary-600"
                                : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                editingPermissions[item.key]
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </>
                  )}

                  {String(selectedUser.role).toLowerCase() === "instructor" && (
                    <>
                      {[
                        {
                          key: "canCreateCourses",
                          title: "Create Courses",
                          desc: "Allow instructor to create new courses",
                        },
                        {
                          key: "canCreateTests",
                          title: "Create Tests",
                          desc: "Allow instructor to create tests",
                        },
                        {
                          key: "canManageTests",
                          title: "Manage Tests",
                          desc: "Allow instructor to edit and delete their tests",
                        },
                        {
                          key: "canManageStudents",
                          title: "Manage Students",
                          desc: "Allow instructor to manage assigned students",
                        },
                        {
                          key: "canViewAnalytics",
                          title: "View Analytics",
                          desc: "Allow instructor to view analytics",
                        },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="pr-4">
                            <h5 className="font-medium text-gray-900">
                              {item.title}
                            </h5>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                          <button
                            onClick={() =>
                              setEditingPermissions((p) => ({
                                ...p,
                                [item.key]: !p[item.key],
                              }))
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              editingPermissions[item.key]
                                ? "bg-primary-600"
                                : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                editingPermissions[item.key]
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    setEditingPermissions({
                      ...(selectedUser.permissions || {}),
                    })
                  }
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

        {/* College modals: placeholders until college API exists */}
        <Modal
          isOpen={showCollegeModal}
          onClose={() => {
            setShowCollegeModal(false);
            setSelectedCollege(null);
          }}
          title={selectedCollege?.name}
          size="lg"
        >
          <div className="space-y-6">
            <p className="text-gray-600">
              College details will appear here once the college API is
              available.
            </p>
          </div>
        </Modal>

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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                College Registration
              </h3>
              <p className="text-gray-600 mb-4">
                Full college creation interface coming soon!
              </p>
              <Button
                onClick={() =>
                  toast("College creation functionality coming soon!")
                }
              >
                Create College
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
