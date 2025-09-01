// Enhanced mock data service for LMS with Course → Module → Chapter hierarchy
export const mockData = {
  // Users data with proper hierarchy
  users: [
    {
      id: '1',
      name: 'System Admin',
      email: 'admin@demo.com',
      role: 'admin',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-01',
      lastLogin: '2024-01-20T08:00:00Z',
      permissions: {
        canCreateCourses: true,
        canManageUsers: true,
        canManageSystem: true
      }
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
      lastLogin: '2024-01-20T09:15:00Z',
      assignedBy: '1', // Admin ID
      permissions: {
        canCreateCourses: true, // Admin-controlled
        canManageStudents: true,
        canViewAnalytics: true
      },
      assignedCourses: ['1', '2'], // Course IDs
      students: ['3', '4', '5'] // Student IDs under this instructor
    },
    {
      id: '3',
      name: 'John Student',
      email: 'student@demo.com',
      role: 'student',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-15',
      lastLogin: '2024-01-20T10:30:00Z',
      instructorId: '2', // Assigned under instructor
      assignedCourses: ['1'], // Courses assigned by instructor
      progress: {
        '1': { // Course ID
          currentModule: '1',
          currentChapter: '2',
          completedChapters: ['1-1', '1-2'],
          completedModules: [],
          moduleTestResults: {},
          courseTestResult: null,
          aiInterviewResult: null,
          overallProgress: 25
        }
      }
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
      lastLogin: '2024-01-19T16:45:00Z',
      instructorId: '2',
      assignedCourses: ['1', '2'],
      progress: {
        '1': {
          currentModule: '2',
          currentChapter: '1',
          completedChapters: ['1-1', '1-2', '1-3'],
          completedModules: ['1'],
          moduleTestResults: { '1': { score: 85, passed: true, attemptedAt: '2024-01-19' } },
          courseTestResult: null,
          aiInterviewResult: null,
          overallProgress: 60
        }
      }
    },
    {
      id: '5',
      name: 'Michael Brown',
      email: 'michael@example.com',
      role: 'student',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-16',
      lastLogin: '2024-01-19T14:20:00Z',
      instructorId: '2',
      assignedCourses: ['2'],
      progress: {
        '2': {
          currentModule: '1',
          currentChapter: '1',
          completedChapters: [],
          completedModules: [],
          moduleTestResults: {},
          courseTestResult: null,
          aiInterviewResult: null,
          overallProgress: 5
        }
      }
    }
  ],

  // Courses with proper hierarchy
  courses: [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Master web development from frontend to backend with hands-on projects and real-world applications.',
      instructor: {
        id: '2',
        name: 'Sarah Instructor',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Programming',
      level: 'beginner',
      status: 'published',
      isActive: true,
      createdBy: '1', // Admin
      assignedInstructors: ['2'],
      enrolledStudents: ['3', '4'],
      totalModules: 3,
      totalChapters: 9,
      estimatedDuration: '40 hours',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-19',
      courseTest: {
        id: 'ct-1',
        title: 'Web Development Final Assessment',
        questions: 50,
        duration: 120, // minutes
        passingScore: 70,
        maxAttempts: 2
      }
    },
    {
      id: '2',
      title: 'Advanced JavaScript Concepts',
      description: 'Deep dive into advanced JavaScript concepts, design patterns, and modern ES6+ features.',
      instructor: {
        id: '2',
        name: 'Sarah Instructor',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Programming',
      level: 'advanced',
      status: 'published',
      isActive: true,
      createdBy: '1',
      assignedInstructors: ['2'],
      enrolledStudents: ['4', '5'],
      totalModules: 2,
      totalChapters: 6,
      estimatedDuration: '25 hours',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-18',
      courseTest: {
        id: 'ct-2',
        title: 'Advanced JavaScript Final Test',
        questions: 40,
        duration: 90,
        passingScore: 75,
        maxAttempts: 2
      }
    }
  ],

  // Modules within courses
  modules: [
    // Course 1 Modules
    {
      id: '1',
      courseId: '1',
      title: 'Frontend Fundamentals',
      description: 'Learn HTML, CSS, and basic JavaScript',
      order: 1,
      estimatedDuration: '15 hours',
      totalChapters: 3,
      isActive: true,
      moduleTest: {
        id: 'mt-1',
        title: 'Frontend Fundamentals Test',
        questions: 20,
        duration: 45,
        passingScore: 70,
        maxAttempts: 3
      }
    },
    {
      id: '2',
      courseId: '1',
      title: 'Backend Development',
      description: 'Server-side programming with Node.js and databases',
      order: 2,
      estimatedDuration: '20 hours',
      totalChapters: 4,
      isActive: true,
      moduleTest: {
        id: 'mt-2',
        title: 'Backend Development Test',
        questions: 25,
        duration: 60,
        passingScore: 70,
        maxAttempts: 3
      }
    },
    {
      id: '3',
      courseId: '1',
      title: 'Full Stack Integration',
      description: 'Connecting frontend and backend, deployment',
      order: 3,
      estimatedDuration: '5 hours',
      totalChapters: 2,
      isActive: true,
      moduleTest: {
        id: 'mt-3',
        title: 'Full Stack Integration Test',
        questions: 15,
        duration: 30,
        passingScore: 70,
        maxAttempts: 3
      }
    },
    // Course 2 Modules
    {
      id: '4',
      courseId: '2',
      title: 'Advanced JavaScript Features',
      description: 'ES6+, async programming, and modern JavaScript',
      order: 1,
      estimatedDuration: '15 hours',
      totalChapters: 3,
      isActive: true,
      moduleTest: {
        id: 'mt-4',
        title: 'Advanced JavaScript Features Test',
        questions: 30,
        duration: 60,
        passingScore: 75,
        maxAttempts: 2
      }
    },
    {
      id: '5',
      courseId: '2',
      title: 'JavaScript Design Patterns',
      description: 'Common design patterns and best practices',
      order: 2,
      estimatedDuration: '10 hours',
      totalChapters: 3,
      isActive: true,
      moduleTest: {
        id: 'mt-5',
        title: 'Design Patterns Test',
        questions: 25,
        duration: 45,
        passingScore: 75,
        maxAttempts: 2
      }
    }
  ],

  // Chapters within modules
  chapters: [
    // Module 1 Chapters (Frontend Fundamentals)
    {
      id: '1-1',
      moduleId: '1',
      courseId: '1',
      title: 'HTML Fundamentals',
      description: 'Learn HTML structure, semantic elements, and best practices',
      content: 'HTML (HyperText Markup Language) is the standard markup language...',
      order: 1,
      estimatedDuration: '5 hours',
      videoUrl: 'https://example.com/videos/html-fundamentals.mp4',
      resources: [
        { type: 'pdf', title: 'HTML Reference Guide', url: '/resources/html-guide.pdf' },
        { type: 'link', title: 'MDN HTML Documentation', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' }
      ],
      isActive: true
    },
    {
      id: '1-2',
      moduleId: '1',
      courseId: '1',
      title: 'CSS Styling and Layout',
      description: 'Master CSS for styling and responsive layouts',
      content: 'CSS (Cascading Style Sheets) is used for styling HTML elements...',
      order: 2,
      estimatedDuration: '6 hours',
      videoUrl: 'https://example.com/videos/css-fundamentals.mp4',
      resources: [
        { type: 'pdf', title: 'CSS Flexbox Guide', url: '/resources/flexbox-guide.pdf' },
        { type: 'codepen', title: 'CSS Examples', url: 'https://codepen.io/examples' }
      ],
      isActive: true
    },
    {
      id: '1-3',
      moduleId: '1',
      courseId: '1',
      title: 'JavaScript Basics',
      description: 'Introduction to JavaScript programming',
      content: 'JavaScript is a high-level programming language...',
      order: 3,
      estimatedDuration: '4 hours',
      videoUrl: 'https://example.com/videos/js-basics.mp4',
      resources: [
        { type: 'pdf', title: 'JavaScript Cheat Sheet', url: '/resources/js-cheatsheet.pdf' }
      ],
      isActive: true
    },
    // Module 2 Chapters (Backend Development)
    {
      id: '2-1',
      moduleId: '2',
      courseId: '1',
      title: 'Node.js Introduction',
      description: 'Server-side JavaScript with Node.js',
      content: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine...',
      order: 1,
      estimatedDuration: '5 hours',
      videoUrl: 'https://example.com/videos/nodejs-intro.mp4',
      resources: [],
      isActive: true
    },
    {
      id: '2-2',
      moduleId: '2',
      courseId: '1',
      title: 'Express.js Framework',
      description: 'Building web applications with Express.js',
      content: 'Express.js is a minimal and flexible Node.js web application framework...',
      order: 2,
      estimatedDuration: '6 hours',
      videoUrl: 'https://example.com/videos/express-intro.mp4',
      resources: [],
      isActive: true
    },
    {
      id: '2-3',
      moduleId: '2',
      courseId: '1',
      title: 'Database Integration',
      description: 'Working with databases in Node.js applications',
      content: 'Learn how to integrate databases with your Node.js applications...',
      order: 3,
      estimatedDuration: '6 hours',
      videoUrl: 'https://example.com/videos/database-integration.mp4',
      resources: [],
      isActive: true
    },
    {
      id: '2-4',
      moduleId: '2',
      courseId: '1',
      title: 'API Development',
      description: 'Creating RESTful APIs with Express.js',
      content: 'REST APIs are the backbone of modern web applications...',
      order: 4,
      estimatedDuration: '3 hours',
      videoUrl: 'https://example.com/videos/api-development.mp4',
      resources: [],
      isActive: true
    }
  ],

  // Module Tests
  moduleTests: [
    {
      id: 'mt-1',
      moduleId: '1',
      courseId: '1',
      title: 'Frontend Fundamentals Test',
      description: 'Test your knowledge of HTML, CSS, and basic JavaScript',
      questions: 20,
      duration: 45, // minutes
      passingScore: 70,
      maxAttempts: 3,
      isActive: true,
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'What does HTML stand for?',
          options: [
            'HyperText Markup Language',
            'High Tech Modern Language',
            'Home Tool Markup Language',
            'Hyperlink and Text Markup Language'
          ],
          correctAnswer: 0,
          points: 5
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: 'Which CSS property is used for changing text color?',
          options: ['color', 'text-color', 'font-color', 'text-style'],
          correctAnswer: 0,
          points: 5
        }
        // More questions would be added here
      ]
    },
    {
      id: 'mt-2',
      moduleId: '2',
      courseId: '1',
      title: 'Backend Development Test',
      description: 'Assess your backend development skills',
      questions: 25,
      duration: 60,
      passingScore: 70,
      maxAttempts: 3,
      isActive: true
    }
  ],

  // Course Tests
  courseTests: [
    {
      id: 'ct-1',
      courseId: '1',
      title: 'Web Development Final Assessment',
      description: 'Comprehensive test covering all course modules',
      questions: 50,
      duration: 120,
      passingScore: 70,
      maxAttempts: 2,
      isActive: true,
      prerequisite: 'all-modules-completed'
    }
  ],

  // Test Results
  testResults: [
    {
      id: 'tr-1',
      studentId: '4',
      testId: 'mt-1',
      testType: 'module',
      moduleId: '1',
      courseId: '1',
      score: 85,
      totalQuestions: 20,
      correctAnswers: 17,
      passed: true,
      attemptNumber: 1,
      timeSpent: 35, // minutes
      submittedAt: '2024-01-19T14:30:00Z',
      answers: [
        { questionId: 'q1', selectedAnswer: 0, isCorrect: true },
        { questionId: 'q2', selectedAnswer: 0, isCorrect: true }
      ]
    }
  ],

  // AI Interview Results
  aiInterviewResults: [
    {
      id: 'ai-1',
      studentId: '4',
      courseId: '1',
      overallScore: 88,
      technicalScore: 85,
      communicationScore: 90,
      problemSolvingScore: 87,
      feedback: 'Excellent understanding of web development concepts. Strong communication skills.',
      interviewDuration: 45, // minutes
      completedAt: '2024-01-20T10:00:00Z',
      questions: [
        {
          question: 'Explain the difference between let, const, and var in JavaScript',
          answer: 'Student provided comprehensive answer...',
          score: 9
        }
      ],
      recommendation: 'Ready for junior developer positions'
    }
  ],

  // System settings and permissions
  systemSettings: {
    instructorPermissions: {
      '2': {
        canCreateCourses: true,
        canEditCourses: true,
        canDeleteCourses: false,
        canManageTests: true,
        canViewAllStudents: false,
        assignedCourses: ['1', '2']
      }
    },
    courseVisibility: {
      '1': { instructors: ['2'], students: ['3', '4'] },
      '2': { instructors: ['2'], students: ['4', '5'] }
    },
    aiInterviewSettings: {
      enabled: true,
      apiEndpoint: 'https://api.ai-interview.com/v1',
      defaultDuration: 45,
      questionTypes: ['technical', 'behavioral', 'problem-solving']
    }
  },

  // Analytics data
  analytics: {
    systemOverview: {
      totalUsers: 5,
      totalCourses: 2,
      totalModules: 5,
      totalChapters: 7,
      activeStudents: 3,
      activeInstructors: 1,
      completionRate: 65,
      averageTestScore: 82
    },
    instructorAnalytics: {
      '2': {
        totalStudents: 3,
        activeCourses: 2,
        averageStudentProgress: 43,
        totalTestsGraded: 5,
        studentSatisfaction: 4.8
      }
    },
    studentAnalytics: {
      '3': {
        coursesEnrolled: 1,
        chaptersCompleted: 2,
        modulesCompleted: 0,
        averageTestScore: 0,
        timeSpent: 120, // minutes
        lastActivity: '2024-01-20T10:30:00Z'
      },
      '4': {
        coursesEnrolled: 2,
        chaptersCompleted: 3,
        modulesCompleted: 1,
        averageTestScore: 85,
        timeSpent: 300,
        lastActivity: '2024-01-19T16:45:00Z'
      }
    }
  }
}

// Enhanced API simulation functions
export const mockAPI = {
  delay: (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms)),

  // Course Management
  getCoursesByInstructor: async (instructorId) => {
    await mockAPI.delay(800)
    return mockData.courses.filter(course => 
      course.assignedInstructors.includes(instructorId)
    )
  },

  getCourseModules: async (courseId) => {
    await mockAPI.delay(600)
    return mockData.modules.filter(module => module.courseId === courseId)
      .sort((a, b) => a.order - b.order)
  },

  getModuleChapters: async (moduleId) => {
    await mockAPI.delay(500)
    return mockData.chapters.filter(chapter => chapter.moduleId === moduleId)
      .sort((a, b) => a.order - b.order)
  },

  // Student Progress Management
  getStudentProgress: async (studentId, courseId = null) => {
    await mockAPI.delay(600)
    const student = mockData.users.find(user => user.id === studentId)
    if (!student) throw new Error('Student not found')
    
    if (courseId) {
      return student.progress[courseId] || null
    }
    return student.progress
  },

  updateChapterProgress: async (studentId, courseId, moduleId, chapterId) => {
    await mockAPI.delay(500)
    const student = mockData.users.find(user => user.id === studentId)
    if (!student.progress[courseId]) {
      student.progress[courseId] = {
        currentModule: moduleId,
        currentChapter: chapterId,
        completedChapters: [],
        completedModules: [],
        moduleTestResults: {},
        courseTestResult: null,
        aiInterviewResult: null,
        overallProgress: 0
      }
    }
    
    const progress = student.progress[courseId]
    if (!progress.completedChapters.includes(chapterId)) {
      progress.completedChapters.push(chapterId)
    }
    
    // Check if module is completed
    const module = mockData.modules.find(m => m.id === moduleId)
    const moduleChapters = mockData.chapters.filter(c => c.moduleId === moduleId)
    const completedModuleChapters = progress.completedChapters.filter(chId => 
      moduleChapters.some(ch => ch.id === chId)
    )
    
    if (completedModuleChapters.length === moduleChapters.length && 
        !progress.completedModules.includes(moduleId)) {
      // Module completed, unlock test
      progress.moduleTestUnlocked = moduleId
    }
    
    return progress
  },

  // Test Management
  getModuleTest: async (moduleId) => {
    await mockAPI.delay(500)
    return mockData.moduleTests.find(test => test.moduleId === moduleId)
  },

  getCourseTest: async (courseId) => {
    await mockAPI.delay(500)
    return mockData.courseTests.find(test => test.courseId === courseId)
  },

  submitModuleTest: async (studentId, testId, answers) => {
    await mockAPI.delay(1000)
    const test = mockData.moduleTests.find(t => t.id === testId)
    if (!test) throw new Error('Test not found')
    
    // Calculate score
    let correctAnswers = 0
    const totalQuestions = test.questions.length || test.questions
    
    if (Array.isArray(test.questions)) {
      answers.forEach(answer => {
        const question = test.questions.find(q => q.id === answer.questionId)
        if (question && question.correctAnswer === answer.selectedAnswer) {
          correctAnswers++
        }
      })
    } else {
      // Mock scoring for simplified tests
      correctAnswers = Math.floor(Math.random() * totalQuestions * 0.3) + Math.floor(totalQuestions * 0.7)
    }
    
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const passed = score >= test.passingScore
    
    const result = {
      id: `tr-${Date.now()}`,
      studentId,
      testId,
      testType: 'module',
      moduleId: test.moduleId,
      courseId: test.courseId,
      score,
      totalQuestions,
      correctAnswers,
      passed,
      attemptNumber: 1,
      timeSpent: Math.floor(Math.random() * test.duration),
      submittedAt: new Date().toISOString(),
      answers
    }
    
    mockData.testResults.push(result)
    
    // Update student progress
    const student = mockData.users.find(user => user.id === studentId)
    if (student.progress[test.courseId]) {
      student.progress[test.courseId].moduleTestResults[test.moduleId] = {
        score,
        passed,
        attemptedAt: new Date().toISOString()
      }
      
      if (passed && !student.progress[test.courseId].completedModules.includes(test.moduleId)) {
        student.progress[test.courseId].completedModules.push(test.moduleId)
      }
    }
    
    return result
  },

  submitCourseTest: async (studentId, testId, answers) => {
    await mockAPI.delay(1500)
    const test = mockData.courseTests.find(t => t.id === testId)
    if (!test) throw new Error('Test not found')
    
    const totalQuestions = test.questions
    const correctAnswers = Math.floor(Math.random() * totalQuestions * 0.3) + Math.floor(totalQuestions * 0.7)
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const passed = score >= test.passingScore
    
    const result = {
      id: `ctr-${Date.now()}`,
      studentId,
      testId,
      testType: 'course',
      courseId: test.courseId,
      score,
      totalQuestions,
      correctAnswers,
      passed,
      attemptNumber: 1,
      timeSpent: Math.floor(Math.random() * test.duration),
      submittedAt: new Date().toISOString(),
      answers
    }
    
    mockData.testResults.push(result)
    
    // Update student progress
    const student = mockData.users.find(user => user.id === studentId)
    if (student.progress[test.courseId]) {
      student.progress[test.courseId].courseTestResult = {
        score,
        passed,
        attemptedAt: new Date().toISOString()
      }
      
      if (passed) {
        student.progress[test.courseId].overallProgress = 100
        student.progress[test.courseId].aiInterviewUnlocked = true
      }
    }
    
    return result
  },

  // AI Interview Integration
  startAIInterview: async (studentId, courseId) => {
    await mockAPI.delay(2000)
    // Simulate AI interview session start
    return {
      sessionId: `ai-session-${Date.now()}`,
      studentId,
      courseId,
      startedAt: new Date().toISOString(),
      estimatedDuration: 45,
      status: 'in-progress'
    }
  },

  completeAIInterview: async (sessionId, responses) => {
    await mockAPI.delay(3000)
    // Simulate AI interview completion and scoring
    const overallScore = Math.floor(Math.random() * 20) + 80 // 80-100
    const technicalScore = Math.floor(Math.random() * 25) + 75
    const communicationScore = Math.floor(Math.random() * 30) + 70
    const problemSolvingScore = Math.floor(Math.random() * 20) + 80
    
    const result = {
      id: `ai-${Date.now()}`,
      sessionId,
      overallScore,
      technicalScore,
      communicationScore,
      problemSolvingScore,
      feedback: 'Great performance! Shows strong understanding of concepts and good communication skills.',
      interviewDuration: 42,
      completedAt: new Date().toISOString(),
      recommendation: overallScore >= 85 ? 'Ready for intermediate positions' : 'Continue practicing fundamentals',
      certificateEligible: overallScore >= 70
    }
    
    mockData.aiInterviewResults.push(result)
    return result
  },

  // Admin Functions
  createUser: async (userData) => {
    await mockAPI.delay(800)
    const newUser = {
      id: String(mockData.users.length + 1),
      ...userData,
      isActive: true,
      isVerified: false,
      joinedDate: new Date().toISOString(),
      lastLogin: null,
      progress: {}
    }
    mockData.users.push(newUser)
    return newUser
  },

  updateUserPermissions: async (userId, permissions) => {
    await mockAPI.delay(500)
    const user = mockData.users.find(u => u.id === userId)
    if (user) {
      user.permissions = { ...user.permissions, ...permissions }
      return user
    }
    throw new Error('User not found')
  },

  assignStudentToInstructor: async (studentId, instructorId) => {
    await mockAPI.delay(500)
    const student = mockData.users.find(u => u.id === studentId)
    const instructor = mockData.users.find(u => u.id === instructorId)
    
    if (student && instructor) {
      student.instructorId = instructorId
      if (!instructor.students.includes(studentId)) {
        instructor.students.push(studentId)
      }
      return { student, instructor }
    }
    throw new Error('User not found')
  },

  assignCourseToStudent: async (studentId, courseId) => {
    await mockAPI.delay(500)
    const student = mockData.users.find(u => u.id === studentId)
    if (student) {
      if (!student.assignedCourses.includes(courseId)) {
        student.assignedCourses.push(courseId)
      }
      return student
    }
    throw new Error('Student not found')
  },

  // Course Management
  createCourse: async (courseData) => {
    await mockAPI.delay(1200)
    const newCourse = {
      id: String(mockData.courses.length + 1),
      ...courseData,
      totalModules: 0,
      totalChapters: 0,
      enrolledStudents: [],
      status: 'draft',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockData.courses.push(newCourse)
    return newCourse
  },

  createModule: async (moduleData) => {
    await mockAPI.delay(800)
    const newModule = {
      id: String(mockData.modules.length + 1),
      ...moduleData,
      totalChapters: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockData.modules.push(newModule)
    return newModule
  },

  createChapter: async (chapterData) => {
    await mockAPI.delay(600)
    const newChapter = {
      id: `${chapterData.moduleId}-${mockData.chapters.filter(c => c.moduleId === chapterData.moduleId).length + 1}`,
      ...chapterData,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockData.chapters.push(newChapter)
    return newChapter
  },

  // Analytics
  getSystemAnalytics: async () => {
    await mockAPI.delay(1000)
    return mockData.analytics.systemOverview
  },

  getInstructorAnalytics: async (instructorId) => {
    await mockAPI.delay(800)
    return mockData.analytics.instructorAnalytics[instructorId] || {}
  },

  getStudentAnalytics: async (studentId) => {
    await mockAPI.delay(600)
    return mockData.analytics.studentAnalytics[studentId] || {}
  },

  // Utility functions
  checkModuleTestEligibility: (studentId, moduleId) => {
    const student = mockData.users.find(u => u.id === studentId)
    if (!student) return false
    
    const module = mockData.modules.find(m => m.id === moduleId)
    if (!module) return false
    
    const moduleChapters = mockData.chapters.filter(c => c.moduleId === moduleId)
    const studentProgress = student.progress[module.courseId]
    
    if (!studentProgress) return false
    
    // Check if all chapters in module are completed
    const completedModuleChapters = studentProgress.completedChapters.filter(chId => 
      moduleChapters.some(ch => ch.id === chId)
    )
    
    return completedModuleChapters.length === moduleChapters.length
  },

  checkCourseTestEligibility: (studentId, courseId) => {
    const student = mockData.users.find(u => u.id === studentId)
    if (!student) return false
    
    const courseModules = mockData.modules.filter(m => m.courseId === courseId)
    const studentProgress = student.progress[courseId]
    
    if (!studentProgress) return false
    
    // Check if all modules are completed and tests passed
    return courseModules.every(module => 
      studentProgress.completedModules.includes(module.id) &&
      studentProgress.moduleTestResults[module.id]?.passed
    )
  },

  checkAIInterviewEligibility: (studentId, courseId) => {
    const student = mockData.users.find(u => u.id === studentId)
    if (!student) return false
    
    const studentProgress = student.progress[courseId]
    if (!studentProgress) return false
    
    return studentProgress.courseTestResult?.passed === true
  }
}