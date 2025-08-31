// Mock data service for development
export const mockData = {
  // Users data
  users: [
    {
      id: '1',
      name: 'John Student',
      email: 'student@demo.com',
      role: 'student',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-15',
      lastLogin: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      name: 'Sarah Instructor',
      email: 'instructor@demo.com',
      role: 'instructor',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-10',
      lastLogin: '2024-01-20T09:15:00Z'
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@demo.com',
      role: 'admin',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-01',
      lastLogin: '2024-01-20T08:00:00Z'
    },
    {
      id: '4',
      name: 'Emily Johnson',
      email: 'emily@example.com',
      role: 'student',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-18',
      lastLogin: '2024-01-19T16:45:00Z'
    },
    {
      id: '5',
      name: 'Michael Brown',
      email: 'michael@example.com',
      role: 'instructor',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: false,
      joinedDate: '2024-01-16',
      lastLogin: '2024-01-19T14:20:00Z'
    }
  ],

  // Courses data
  courses: [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn web development from scratch with this comprehensive bootcamp covering HTML, CSS, JavaScript, and modern frameworks.',
      instructor: {
        id: '2',
        name: 'Sarah Instructor',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 99.99,
      originalPrice: 149.99,
      category: 'programming',
      level: 'beginner',
      duration: '40 hours',
      lessonsCount: 45,
      studentsCount: 234,
      rating: 4.8,
      reviewsCount: 89,
      status: 'published',
      isFeatured: true,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-19'
    },
    {
      id: '2',
      title: 'Advanced JavaScript Concepts',
      description: 'Deep dive into advanced JavaScript concepts including closures, prototypes, async programming, and design patterns.',
      instructor: {
        id: '2',
        name: 'Sarah Instructor',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 79.99,
      originalPrice: 99.99,
      category: 'programming',
      level: 'advanced',
      duration: '25 hours',
      lessonsCount: 28,
      studentsCount: 156,
      rating: 4.9,
      reviewsCount: 67,
      status: 'published',
      isFeatured: false,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-18'
    },
    {
      id: '3',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the principles of user interface and user experience design with hands-on projects.',
      instructor: {
        id: '5',
        name: 'Michael Brown',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 89.99,
      category: 'design',
      level: 'intermediate',
      duration: '30 hours',
      lessonsCount: 35,
      studentsCount: 189,
      rating: 4.7,
      reviewsCount: 45,
      status: 'published',
      isFeatured: true,
      createdAt: '2024-01-14',
      updatedAt: '2024-01-17'
    }
  ],

  // Enrollments data
  enrollments: [
    {
      id: '1',
      studentId: '1',
      courseId: '1',
      progress: 65,
      enrolledAt: '2024-01-16',
      lastAccessed: '2024-01-19',
      status: 'active',
      completedLessons: 29,
      totalLessons: 45,
      timeSpent: 1200, // minutes
      grade: 87
    },
    {
      id: '2',
      studentId: '1',
      courseId: '3',
      progress: 40,
      enrolledAt: '2024-01-18',
      lastAccessed: '2024-01-19',
      status: 'active',
      completedLessons: 14,
      totalLessons: 35,
      timeSpent: 800,
      grade: 92
    },
    {
      id: '3',
      studentId: '4',
      courseId: '1',
      progress: 85,
      enrolledAt: '2024-01-15',
      lastAccessed: '2024-01-19',
      status: 'active',
      completedLessons: 38,
      totalLessons: 45,
      timeSpent: 1800,
      grade: 94
    }
  ],

  // Assignments data
  assignments: [
    {
      id: '1',
      title: 'Build a Portfolio Website',
      courseId: '1',
      dueDate: '2024-01-25',
      points: 100,
      submissions: 15,
      status: 'active',
      type: 'project'
    },
    {
      id: '2',
      title: 'JavaScript Functions Quiz',
      courseId: '2',
      dueDate: '2024-01-23',
      points: 50,
      submissions: 8,
      status: 'active',
      type: 'quiz'
    },
    {
      id: '3',
      title: 'Design System Creation',
      courseId: '3',
      dueDate: '2024-01-28',
      points: 150,
      submissions: 12,
      status: 'active',
      type: 'project'
    }
  ],

  // Payments data
  payments: [
    {
      id: '1',
      userId: '1',
      courseId: '1',
      amount: 99.99,
      currency: 'USD',
      status: 'completed',
      method: 'stripe',
      transactionId: 'txn_1234567890',
      createdAt: '2024-01-16',
      processedAt: '2024-01-16'
    },
    {
      id: '2',
      userId: '1',
      courseId: '3',
      amount: 89.99,
      currency: 'USD',
      status: 'completed',
      method: 'paypal',
      transactionId: 'txn_0987654321',
      createdAt: '2024-01-18',
      processedAt: '2024-01-18'
    }
  ],

  // Analytics data
  analytics: {
    userGrowth: [
      { date: '2024-01-01', users: 100 },
      { date: '2024-01-08', users: 125 },
      { date: '2024-01-15', users: 150 },
      { date: '2024-01-22', users: 180 }
    ],
    courseCreation: [
      { date: '2024-01-01', courses: 10 },
      { date: '2024-01-08', courses: 12 },
      { date: '2024-01-15', courses: 15 },
      { date: '2024-01-22', courses: 18 }
    ],
    revenue: [
      { date: '2024-01-01', amount: 1000 },
      { date: '2024-01-08', amount: 1500 },
      { date: '2024-01-15', amount: 2200 },
      { date: '2024-01-22', amount: 3100 }
    ]
  },

  // Notifications/Activity data
  activities: [
    {
      id: '1',
      type: 'enrollment',
      message: 'New student enrolled in Complete Web Development Bootcamp',
      courseId: '1',
      userId: '4',
      timestamp: '2024-01-19T14:30:00Z'
    },
    {
      id: '2',
      type: 'assignment',
      message: 'Assignment submitted by Emily Johnson',
      courseId: '1',
      userId: '4',
      assignmentId: '1',
      timestamp: '2024-01-19T12:15:00Z'
    },
    {
      id: '3',
      type: 'review',
      message: 'New 5-star review received for Advanced JavaScript Concepts',
      courseId: '2',
      userId: '1',
      timestamp: '2024-01-19T10:45:00Z'
    },
    {
      id: '4',
      type: 'completion',
      message: 'Student completed UI/UX Design Fundamentals',
      courseId: '3',
      userId: '4',
      timestamp: '2024-01-18T16:20:00Z'
    }
  ],

  // System alerts
  systemAlerts: [
    {
      id: '1',
      type: 'warning',
      title: 'High Server Load',
      message: 'Server response time is above normal. Monitoring closely.',
      timestamp: '2024-01-19T15:30:00Z',
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Course Review Pending',
      message: 'New course submission requires admin approval.',
      timestamp: '2024-01-19T12:00:00Z',
      resolved: false
    },
    {
      id: '3',
      type: 'success',
      title: 'Backup Completed',
      message: 'Daily system backup completed successfully.',
      timestamp: '2024-01-19T02:00:00Z',
      resolved: true
    }
  ]
}

// API simulation functions
export const mockAPI = {
  // Simulate API delay
  delay: (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms)),

  // Get user data
  getUser: async (id) => {
    await mockAPI.delay(500)
    return mockData.users.find(user => user.id === id)
  },

  // Get courses by instructor
  getCoursesByInstructor: async (instructorId) => {
    await mockAPI.delay(800)
    return mockData.courses.filter(course => course.instructor.id === instructorId)
  },

  // Get student enrollments
  getStudentEnrollments: async (studentId) => {
    await mockAPI.delay(800)
    const enrollments = mockData.enrollments.filter(enrollment => enrollment.studentId === studentId)
    return enrollments.map(enrollment => {
      const course = mockData.courses.find(course => course.id === enrollment.courseId)
      return {
        ...enrollment,
        course
      }
    })
  },

  // Get course enrollments (for instructors)
  getCourseEnrollments: async (courseId) => {
    await mockAPI.delay(600)
    const enrollments = mockData.enrollments.filter(enrollment => enrollment.courseId === courseId)
    return enrollments.map(enrollment => {
      const student = mockData.users.find(user => user.id === enrollment.studentId)
      return {
        ...enrollment,
        student
      }
    })
  },

  // Get assignments by course
  getAssignmentsByCourse: async (courseId) => {
    await mockAPI.delay(600)
    return mockData.assignments.filter(assignment => assignment.courseId === courseId)
  },

  // Get recent activities
  getRecentActivities: async (userId = null, limit = 10) => {
    await mockAPI.delay(500)
    let activities = mockData.activities
    
    if (userId) {
      activities = activities.filter(activity => activity.userId === userId)
    }
    
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
      .map(activity => {
        const course = mockData.courses.find(course => course.id === activity.courseId)
        const user = mockData.users.find(user => user.id === activity.userId)
        return {
          ...activity,
          course: course?.title,
          user: user?.name
        }
      })
  },

  // Get system stats
  getSystemStats: async () => {
    await mockAPI.delay(800)
    return {
      totalUsers: mockData.users.length,
      activeUsers: mockData.users.filter(user => user.isActive).length,
      totalCourses: mockData.courses.length,
      publishedCourses: mockData.courses.filter(course => course.status === 'published').length,
      totalEnrollments: mockData.enrollments.length,
      totalRevenue: mockData.payments
        .filter(payment => payment.status === 'completed')
        .reduce((sum, payment) => sum + payment.amount, 0),
      averageRating: mockData.courses.reduce((sum, course) => sum + course.rating, 0) / mockData.courses.length
    }
  },

  // Get instructor stats
  getInstructorStats: async (instructorId) => {
    await mockAPI.delay(600)
    const instructorCourses = mockData.courses.filter(course => course.instructor.id === instructorId)
    const totalStudents = instructorCourses.reduce((sum, course) => sum + course.studentsCount, 0)
    const totalRevenue = mockData.payments
      .filter(payment => 
        payment.status === 'completed' && 
        instructorCourses.some(course => course.id === payment.courseId)
      )
      .reduce((sum, payment) => sum + payment.amount, 0)
    
    return {
      totalCourses: instructorCourses.length,
      totalStudents,
      totalRevenue,
      averageRating: instructorCourses.reduce((sum, course) => sum + course.rating, 0) / instructorCourses.length || 0,
      publishedCourses: instructorCourses.filter(course => course.status === 'published').length
    }
  },

  // Get student stats
  getStudentStats: async (studentId) => {
    await mockAPI.delay(600)
    const studentEnrollments = mockData.enrollments.filter(enrollment => enrollment.studentId === studentId)
    const totalLessons = studentEnrollments.reduce((sum, enrollment) => sum + enrollment.totalLessons, 0)
    const completedLessons = studentEnrollments.reduce((sum, enrollment) => sum + enrollment.completedLessons, 0)
    
    return {
      totalCourses: studentEnrollments.length,
      completedLessons,
      totalLessons,
      averageGrade: studentEnrollments.reduce((sum, enrollment) => sum + enrollment.grade, 0) / studentEnrollments.length || 0,
      certificates: studentEnrollments.filter(enrollment => enrollment.progress === 100).length,
      totalTimeSpent: studentEnrollments.reduce((sum, enrollment) => sum + enrollment.timeSpent, 0)
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    await mockAPI.delay(500)
    const userIndex = mockData.users.findIndex(user => user.id === id)
    if (userIndex !== -1) {
      mockData.users[userIndex] = { ...mockData.users[userIndex], ...userData }
      return mockData.users[userIndex]
    }
    throw new Error('User not found')
  },

  // Delete user
  deleteUser: async (id) => {
    await mockAPI.delay(500)
    const userIndex = mockData.users.findIndex(user => user.id === id)
    if (userIndex !== -1) {
      mockData.users.splice(userIndex, 1)
      return true
    }
    throw new Error('User not found')
  },

  // Create course
  createCourse: async (courseData) => {
    await mockAPI.delay(1000)
    const newCourse = {
      id: String(mockData.courses.length + 1),
      ...courseData,
      studentsCount: 0,
      rating: 0,
      reviewsCount: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockData.courses.push(newCourse)
    return newCourse
  },

  // Update course
  updateCourse: async (id, courseData) => {
    await mockAPI.delay(500)
    const courseIndex = mockData.courses.findIndex(course => course.id === id)
    if (courseIndex !== -1) {
      mockData.courses[courseIndex] = { 
        ...mockData.courses[courseIndex], 
        ...courseData,
        updatedAt: new Date().toISOString()
      }
      return mockData.courses[courseIndex]
    }
    throw new Error('Course not found')
  },

  // Delete course
  deleteCourse: async (id) => {
    await mockAPI.delay(500)
    const courseIndex = mockData.courses.findIndex(course => course.id === id)
    if (courseIndex !== -1) {
      mockData.courses.splice(courseIndex, 1)
      return true
    }
    throw new Error('Course not found')
  }
}