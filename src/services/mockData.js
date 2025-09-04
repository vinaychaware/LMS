// src/services/mockData.jsx

// --- Mock datasets -------------------------------------------------
const colleges = [
  {
    id: "col-1",
    name: "Creative Arts Institute",
    code: "CAI-001",
    logo: "https://picsum.photos/seed/cai/200/200",
    status: "active",
    address: "12 Museum Road, Bengaluru",
    phone: "+91 98765 43210",
    email: "admin@cai.edu",
    establishedYear: 2004,
    totalStudents: 420,
    totalInstructors: 18,
  },
  {
    id: "col-2",
    name: "Tech University",
    code: "TU-314",
    logo: "https://picsum.photos/seed/tu/200/200",
    status: "active",
    address: "88 Tech Park, Pune",
    phone: "+91 99888 77665",
    email: "contact@tu.edu",
    establishedYear: 1998,
    totalStudents: 980,
    totalInstructors: 42,
  },
];

const admins = [
  {
    id: "adm-1",
    name: "Prof. Michael Chen",
    email: "m.chen@cai.edu",
    avatar: "https://i.pravatar.cc/150?img=12",
    collegeId: "col-1",
    role: "admin",
    permissions: { canCreateCourses: true, canCreateTests: true, canManageTests: true },
    isActive: true,
  },
  {
    id: "adm-2",
    name: "Dr. Asha Rao",
    email: "asha.rao@tu.edu",
    avatar: "https://i.pravatar.cc/150?img=32",
    collegeId: "col-2",
    role: "admin",
    permissions: { canCreateCourses: true, canCreateTests: true, canManageTests: false },
    isActive: true,
  },
];

const instructors = [
  {
    id: "ins-1",
    name: "Rahul Mehta",
    email: "rahul.mehta@cai.edu",
    avatar: "https://i.pravatar.cc/150?img=21",
    collegeId: "col-1",
    role: "instructor",
    assignedCourses: ["course-1"],
    permissions: { canCreateCourses: false, canCreateTests: true, canManageTests: true, canManageStudents: true, canViewAnalytics: true },
    isActive: true,
  },
  {
    id: "ins-2",
    name: "Sara Khan",
    email: "sara.khan@tu.edu",
    avatar: "https://i.pravatar.cc/150?img=26",
    collegeId: "col-2",
    role: "instructor",
    assignedCourses: ["course-2", "course-3"],
    permissions: { canCreateCourses: true, canCreateTests: true, canManageTests: false, canManageStudents: true, canViewAnalytics: true },
    isActive: true,
  },
];

const students = [
  {
    id: "stu-1",
    name: "Ankit Sharma",
    email: "ankit@cai.edu",
    avatar: "https://i.pravatar.cc/150?img=5",
    assignedCourses: ["course-1"],
    isActive: true,
  },
  {
    id: "stu-2",
    name: "Priya Singh",
    email: "priya@tu.edu",
    avatar: "https://i.pravatar.cc/150?img=7",
    assignedCourses: ["course-2", "course-3"],
    isActive: true,
  },
  {
    id: "stu-3",
    name: "John Lee",
    email: "john@tu.edu",
    avatar: "https://i.pravatar.cc/150?img=8",
    assignedCourses: ["course-2"],
    isActive: true,
  },
];

const courses = [
  {
    id: "course-1",
    title: "Digital Art Mastery",
    collegeId: "col-1",
    assignedInstructors: ["ins-1"],
    status: "published",
    thumbnail: "https://picsum.photos/seed/da/320/240",
  },
  {
    id: "course-2",
    title: "Intro to Data Structures",
    collegeId: "col-2",
    assignedInstructors: ["ins-2"],
    status: "draft",
    thumbnail: "https://picsum.photos/seed/ds/320/240",
  },
  {
    id: "course-3",
    title: "Web Development 101",
    collegeId: "col-2",
    assignedInstructors: ["ins-2"],
    status: "published",
    thumbnail: "https://picsum.photos/seed/web/320/240",
  },
];

const systemAnalytics = {
  overview: {
    totalColleges: colleges.length,
    totalAdmins: admins.length,
    totalInstructors: instructors.length,
    totalStudents: students.length,
    totalCourses: courses.length,
    systemUptime: "99.9%",
    activeUsers: students.length + instructors.length + admins.length,
    avgCourseCompletion: 72,
    totalRevenue: 184200,
  },
  collegeBreakdown: {
    "col-1": { students: 420, instructors: 18, revenue: 56200, courses: courses.filter(c => c.collegeId === "col-1").length },
    "col-2": { students: 980, instructors: 42, revenue: 128000, courses: courses.filter(c => c.collegeId === "col-2").length },
  },
  performanceMetrics: {
    apiUsage: 43,
    errorRate: 2,
    averageResponseTime: 180, // ms
    storageUtilization: 58,
  },
};

// Bundle raw data you access directly in the UI
export const mockData = {
  colleges,
  admins,
  instructors,
  students,
  courses,
  systemAnalytics,
};

// --- Mock API ------------------------------------------------------
const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export const mockAPI = {
  async getAllColleges() {
    await delay(); 
    return [...colleges];
  },
  async getAllAdmins() {
    await delay(); 
    return [...admins];
  },
  async getAllInstructors() {
    await delay(); 
    return [...instructors];
  },
  async getAllStudents() {
    await delay(); 
    return [...students];
  },
  async getSystemAnalytics() {
    await delay(); 
    return { ...systemAnalytics };
  },

  async updateUserPermissions(userId, newPerms) {
    await delay();
    const inAdmins = admins.find(a => a.id === userId);
    if (inAdmins) {
      inAdmins.permissions = { ...inAdmins.permissions, ...newPerms };
      return { ok: true };
    }
    const inInstructors = instructors.find(i => i.id === userId);
    if (inInstructors) {
      inInstructors.permissions = { ...inInstructors.permissions, ...newPerms };
      return { ok: true };
    }
    throw new Error("User not found");
  },

  async deleteCollege(collegeId) {
    await delay();
    const idx = colleges.findIndex(c => c.id === collegeId);
    if (idx >= 0) {
      colleges.splice(idx, 1);
      return { ok: true };
    }
    throw new Error("College not found");
  },

  async bulkUpdateUsers(userIds, patch) {
    await delay();
    [admins, instructors, students].forEach(group => {
      group.forEach(u => {
        if (userIds.includes(u.id)) Object.assign(u, patch);
      });
    });
    return { ok: true };
  },

  async deleteUser(userId) {
    await delay();
    for (const group of [admins, instructors, students]) {
      const i = group.findIndex(u => u.id === userId);
      if (i >= 0) {
        group.splice(i, 1);
        return { ok: true };
      }
    }
    throw new Error("User not found");
  },
};

// Optional default (not required by your current imports)
export default { mockAPI, mockData };
