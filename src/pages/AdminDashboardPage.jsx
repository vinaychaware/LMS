// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Users,
  GraduationCap,
  BookOpen,
  Target,
  Activity,
  Award,
  BarChart3,
  Search,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Plus,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import Progress from "../components/ui/Progress";

import api, { FALLBACK_THUMB } from "../services/api";
import useAuthStore from "../store/useAuthStore";

const uiAvatar = (name = "User") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random`;

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "—";
  }
};

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [overview, setOverview] = useState({
    courses: 0,
    students: 0,
    instructors: 0,
  });
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  // Build an index of instructor -> course count/titles from the courses list
  const instructorCourseIndex = useMemo(() => {
    const map = {};
    for (const c of courses || []) {
      // Support different backend shapes
      const ids =
        c.instructorIds ||
        (Array.isArray(c.instructors) ? c.instructors.map((x) => x.id) : []) ||
        [];
      ids.forEach((id) => {
        if (!id) return;
        if (!map[id]) map[id] = { count: 0, titles: [] };
        map[id].count += 1;
        if (c.title) map[id].titles.push(c.title);
      });
    }
    return map;
  }, [courses]);

  // Top cards stats with robust fallbacks
  const stats = useMemo(() => {
    const ov = overview?.totals ?? overview ?? {};
    const totalInstructors =
      (typeof ov.instructors === "number" ? ov.instructors : undefined) ??
      instructors.length;
    const totalStudents =
      (typeof ov.students === "number" ? ov.students : undefined) ??
      students.length;
    const totalCourses =
      (typeof ov.courses === "number" ? ov.courses : undefined) ??
      courses.length;

    const activeUsers =
      [...instructors, ...students].filter((u) => u.isActive).length || 0;

    // Keep your playful placeholder numbers
    const completionRate = Math.floor(Math.random() * 30) + 70;
    const averageGrade = Math.floor(Math.random() * 20) + 75;

    return {
      totalInstructors,
      totalStudents,
      totalCourses,
      activeUsers,
      completionRate,
      averageGrade,
    };
  }, [overview, instructors, students, courses]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // 1) Overview (be tolerant of shape)
        const ov = await api.get("/admin/overview");
        setOverview(
          ov?.data?.totals ?? ov?.data ?? {
            courses: 0,
            students: 0,
            instructors: 0,
          }
        );

        // 2) Instructors + Students (allow fallback=all)
        const [ins, stu] = await Promise.all([
          api.get("/admin/instructors", { params: { fallback: "all" } }),
          api.get("/admin/students", { params: { fallback: "all" } }),
        ]);

        const normInstructors =
          (ins?.data || []).map((i) => ({
            id: i.id,
            fullName: i.fullName || i.name || "Instructor",
            email: i.email,
            isActive: !!i.isActive,
            lastLogin: i.lastLogin,
            avatar: uiAvatar(i.fullName || i.name),
            // some backends may not provide this; we will derive from courses
            assignedCourses: i.assignedCourses || null,
          })) || [];

        const normStudents =
          (stu?.data || []).map((s) => ({
            id: s.id,
            fullName: s.fullName || s.name || "Student",
            email: s.email,
            isActive: !!s.isActive,
            lastLogin: s.lastLogin,
            avatar: uiAvatar(s.fullName || s.name),
            assignedCourses: s.assignedCourses || [],
            progress: {},
          })) || [];

        setInstructors(normInstructors);
        setStudents(normStudents);

        // 3) Courses (scoped to admin)
        const cr = await api.get("/admin/courses");
        const normCourses = (cr?.data || []).map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description || "",
          thumbnail: c.thumbnail || FALLBACK_THUMB,
          status: c.status || "draft",
          level: c.level ?? null,
          totalModules: c.totalModules ?? 0,
          totalChapters: c.totalChapters ?? 0,
          studentCount: c.studentCount || 0,
          instructorNames: c.instructorNames || [],
          instructorIds:
            c.instructorIds ||
            (Array.isArray(c.instructors) ? c.instructors.map((x) => x.id) : []),
        }));
        setCourses(normCourses);
      } catch (e) {
        console.error("Admin dashboard load error:", e);
        toast.error("Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filters
  const filteredInstructors = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    return instructors.filter((i) => {
      const matchesSearch =
        (i.fullName || "").toLowerCase().includes(q) ||
        (i.email || "").toLowerCase().includes(q);
      const matchesFilter =
        userFilter === "all" ||
        (userFilter === "active" && i.isActive) ||
        (userFilter === "inactive" && !i.isActive);
      return matchesSearch && matchesFilter;
    });
  }, [instructors, searchTerm, userFilter]);

  const filteredStudents = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    return students.filter((s) => {
      const matchesSearch =
        (s.fullName || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q);
      const matchesFilter =
        userFilter === "all" ||
        (userFilter === "active" && s.isActive) ||
        (userFilter === "inactive" && !s.isActive);
      return matchesSearch && matchesFilter;
    });
  }, [students, searchTerm, userFilter]);

  const filteredCourses = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    return courses.filter((c) => {
      const matchesSearch =
        (c.title || "").toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q);
      const matchesFilter =
        courseFilter === "all" ||
        (courseFilter === "published" && c.status === "published") ||
        (courseFilter === "draft" && c.status === "draft");
      return matchesSearch && matchesFilter;
    });
  }, [courses, searchTerm, courseFilter]);

  // Bulk select helpers
  const toggleUserSelection = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleUserAction = async (userId, action) => {
    try {
      if (action === "activate" || action === "deactivate") {
        const active = action === "activate";
        setInstructors((arr) =>
          arr.map((u) => (u.id === userId ? { ...u, isActive: active } : u))
        );
        setStudents((arr) =>
          arr.map((u) => (u.id === userId ? { ...u, isActive: active } : u))
        );
        toast.success(`User ${active ? "activated" : "deactivated"}`);
      } else if (action === "view" || action === "edit") {
        const u =
          [...instructors, ...students].find((x) => x.id === userId) || null;
        setSelectedUser(u);
        setShowUserModal(true);
      }
    } catch (e) {
      toast.error(`Failed to ${action} user`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome{user?.fullName ? `, ${user.fullName}` : ""}.
                </p>
              </div>
            </div>

            <Link to="/register" state={{ allowWhenLoggedIn: true }}>
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                Add User
              </Button>
            </Link>
          </div>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Instructors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalInstructors}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalStudents}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Courses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCourses}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Activity size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeUsers}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Target size={24} className="text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completionRate}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Award size={24} className="text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Grade</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageGrade}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", name: "Overview", icon: BarChart3 },
                { id: "instructors", name: "Instructors", icon: Users },
                { id: "students", name: "Students", icon: GraduationCap },
                { id: "courses", name: "Courses", icon: BookOpen },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedUsers([]);
                  }}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <Card.Header>
                <Card.Title>Recent Activity</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <UserCheck size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        New student enrolled
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Course published
                      </p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Award size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Certificate issued
                      </p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Performance Metrics</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Course Completion Rate</span>
                      <span className="font-medium">
                        {stats.completionRate}%
                      </span>
                    </div>
                    <Progress value={stats.completionRate} size="sm" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Student Satisfaction</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} size="sm" variant="success" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Instructor Rating</span>
                      <span className="font-medium">88%</span>
                    </div>
                    <Progress value={88} size="sm" variant="accent" />
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        )}

        {/* Instructors */}
        {activeTab === "instructors" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search instructors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                {selectedUsers.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        selectedUsers.forEach((id) =>
                          handleUserAction(id, "activate")
                        )
                      }
                    >
                      <UserCheck size={16} className="mr-1" />
                      Activate ({selectedUsers.length})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        selectedUsers.forEach((id) =>
                          handleUserAction(id, "deactivate")
                        )
                      }
                    >
                      <UserX size={16} className="mr-1" />
                      Deactivate
                    </Button>
                  </>
                )}
              </div>
            </div>

            <Card>
              <Card.Content className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              setSelectedUsers(
                                e.target.checked
                                  ? filteredInstructors.map((u) => u.id)
                                  : []
                              )
                            }
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Instructor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Courses
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredInstructors.map((i) => (
                        <tr key={i.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(i.id)}
                              onChange={() => toggleUserSelection(i.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img
                                src={i.avatar}
                                alt={i.fullName}
                                className="w-10 h-10 rounded-full mr-3"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {i.fullName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {i.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {/* Prefer backend value if present; otherwise derive */}
                            {i.assignedCourses?.length ??
                              instructorCourseIndex[i.id]?.count ??
                              0}
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={i.isActive ? "success" : "danger"}
                              size="sm"
                            >
                              {i.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {fmtDate(i.lastLogin)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUserAction(i.id, "view")}
                              >
                                <Eye size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUserAction(i.id, "edit")}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleUserAction(
                                    i.id,
                                    i.isActive ? "deactivate" : "activate"
                                  )
                                }
                              >
                                {i.isActive ? (
                                  <UserX size={16} />
                                ) : (
                                  <UserCheck size={16} />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Content>
            </Card>
          </div>
        )}

        {/* Students */}
        {activeTab === "students" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                {selectedUsers.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        selectedUsers.forEach((id) =>
                          handleUserAction(id, "activate")
                        )
                      }
                    >
                      <UserCheck size={16} className="mr-1" />
                      Activate ({selectedUsers.length})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        selectedUsers.forEach((id) =>
                          handleUserAction(id, "deactivate")
                        )
                      }
                    >
                      <UserX size={16} className="mr-1" />
                      Deactivate
                    </Button>
                  </>
                )}
              </div>
            </div>

            <Card>
              <Card.Content className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              setSelectedUsers(
                                e.target.checked
                                  ? filteredStudents.map((u) => u.id)
                                  : []
                              )
                            }
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Courses
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((s) => {
                        const avgProgress = 0; // placeholder
                        return (
                          <tr key={s.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(s.id)}
                                onChange={() => toggleUserSelection(s.id)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <img
                                  src={s.avatar}
                                  alt={s.fullName}
                                  className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {s.fullName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {s.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {s.assignedCourses?.length || 0}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-primary-600 h-2 rounded-full"
                                    style={{ width: `${avgProgress}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600">
                                  {Math.round(avgProgress)}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                variant={s.isActive ? "success" : "danger"}
                                size="sm"
                              >
                                {s.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {fmtDate(s.lastLogin)}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUserAction(s.id, "view")}
                                >
                                  <Eye size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUserAction(s.id, "edit")}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleUserAction(
                                      s.id,
                                      s.isActive ? "deactivate" : "activate"
                                    )
                                  }
                                >
                                  {s.isActive ? (
                                    <UserX size={16} />
                                  ) : (
                                    <UserCheck size={16} />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card.Content>
            </Card>
          </div>
        )}

        {/* Courses */}
        {activeTab === "courses" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast("Export coming soon!")}
                >
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
                <Link to="/courses/create">
                  <Button size="sm">
                    <Plus size={16} className="mr-2" />
                    Create Course
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={course.thumbnail || FALLBACK_THUMB}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = FALLBACK_THUMB)}
                    />
                  </div>
                  <Card.Content className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={
                          course.status === "published" ? "success" : "warning"
                        }
                        size="sm"
                      >
                        {course.status}
                      </Badge>
                      <Badge variant="info" size="sm">
                        {course.level ?? "—"}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{course.totalModules} modules</span>
                      <span>{course.totalChapters} chapters</span>
                      <span>{course.studentCount} students</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowCourseModal(true);
                        }}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info("Course editor coming soon!")}
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.info("Analytics coming soon!")}
                      >
                        <BarChart3 size={16} />
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={selectedUser?.fullName}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.fullName}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedUser.fullName}
                </h3>
                <p className="text-gray-600">{selectedUser.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="info" size="sm">
                    {instructors.some((i) => i.id === selectedUser.id)
                      ? "instructor"
                      : "student"}
                  </Badge>
                  <Badge
                    variant={selectedUser.isActive ? "success" : "danger"}
                    size="sm"
                  >
                    {selectedUser.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Login
                </label>
                <p className="text-sm text-gray-900">
                  {fmtDate(selectedUser.lastLogin)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Courses
                </label>
                <p className="text-sm text-gray-900">
                  {selectedUser.assignedCourses?.length ??
                    instructorCourseIndex[selectedUser.id]?.count ??
                    0}
                </p>
                {/* Optional list of titles:
                <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                  {(instructorCourseIndex[selectedUser.id]?.titles || []).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                */}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() =>
                  handleUserAction(
                    selectedUser.id,
                    selectedUser.isActive ? "deactivate" : "activate"
                  )
                }
                variant={selectedUser.isActive ? "danger" : "accent"}
              >
                {selectedUser.isActive ? "Deactivate User" : "Activate User"}
              </Button>
              <Button variant="outline" onClick={() => setShowUserModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Course Modal */}
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
                src={selectedCourse.thumbnail || FALLBACK_THUMB}
                alt={selectedCourse.title}
                className="w-20 h-20 rounded-lg object-cover"
                onError={(e) => (e.currentTarget.src = FALLBACK_THUMB)}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedCourse.title}
                </h3>
                <p className="text-gray-600">
                  {selectedCourse.instructorNames?.join(", ") || "—"}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="info" size="sm">
                    {selectedCourse.level ?? "—"}
                  </Badge>
                  <Badge
                    variant={
                      selectedCourse.status === "published"
                        ? "success"
                        : "warning"
                    }
                    size="sm"
                  >
                    {selectedCourse.status}
                  </Badge>
                </div>
              </div>
            </div>

            <p className="text-gray-600">
              {selectedCourse.description || "—"}
            </p>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {selectedCourse.totalModules}
                </div>
                <div className="text-sm text-blue-800">Modules</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {selectedCourse.totalChapters}
                </div>
                <div className="text-sm text-green-800">Chapters</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">
                  {selectedCourse.studentCount}
                </div>
                <div className="text-sm text-purple-800">Students</div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={() => toast.info("Course editor coming soon!")}>
                <Edit size={16} className="mr-2" />
                Edit Course
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info("Analytics coming soon!")}
              >
                <BarChart3 size={16} className="mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" onClick={() => setShowCourseModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
