// Enhanced mock data service for LMS with proper hierarchy and Super Admin support
export const mockData = {
  // Colleges/Organizations
  colleges: [
    {
      id: '1',
      name: 'Tech University',
      code: 'TECH001',
      address: '123 Innovation Drive, Tech City, TC 12345',
      phone: '+1-555-0123',
      email: 'admin@techuniversity.edu',
      website: 'https://techuniversity.edu',
      establishedYear: 2010,
      totalStudents: 1250,
      totalInstructors: 45,
      totalCourses: 120,
      status: 'active',
      logo: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=150',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      name: 'Business Academy',
      code: 'BIZ002',
      address: '456 Commerce Street, Business City, BC 67890',
      phone: '+1-555-0456',
      email: 'contact@businessacademy.edu',
      website: 'https://businessacademy.edu',
      establishedYear: 2015,
      totalStudents: 890,
      totalInstructors: 32,
      totalCourses: 85,
      status: 'active',
      logo: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=150',
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-18T15:30:00Z'
    },
    {
      id: '3',
      name: 'Creative Arts Institute',
      code: 'ART003',
      address: '789 Artist Lane, Creative City, CC 13579',
      phone: '+1-555-0789',
      email: 'info@creativearts.edu',
      website: 'https://creativearts.edu',
      establishedYear: 2018,
      totalStudents: 650,
      totalInstructors: 28,
      totalCourses: 95,
      status: 'active',
      logo: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=150',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-19T09:45:00Z'
    }
  ],

  // Users with proper hierarchy and college assignments
  users: [
    // Super Admin
    {
      id: '0',
      name: 'Super Administrator',
      email: 'superadmin@edusphere.com',
      role: 'superadmin',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-01T00:00:00Z',
      lastLogin: '2024-01-20T08:00:00Z',
      collegeId: null, // Super admin oversees all colleges
      permissions: {
        canManageColleges: true,
        canManageAllUsers: true,
        canManageSystem: true,
        canViewAllData: true,
        canCreateAdmins: true,
        canCreateCourses: true,
        canCreateTests: true,
        canManageTests: true
      }
    },
    // College Admins
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'admin@demo.com',
      role: 'admin',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-01T00:00:00Z',
      lastLogin: '2024-01-20T08:00:00Z',
      collegeId: '1',
      assignedBy: '0', // Super Admin
      permissions: {
        canCreateCourses: true,
        canManageUsers: true,
        canManageCollegeCourses: true,
        canAssignInstructors: true,
        canViewCollegeAnalytics: true,
        canCreateTests: true,
        canManageTests: true
      }
    },
    {
      id: '11',
      name: 'Prof. Michael Chen',
      email: 'admin@businessacademy.edu',
      role: 'admin',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-05T00:00:00Z',
      lastLogin: '2024-01-19T16:30:00Z',
      collegeId: '2',
      assignedBy: '0',
      permissions: {
        canCreateCourses: true,
        canManageUsers: true,
        canManageCollegeCourses: true,
        canAssignInstructors: true,
        canViewCollegeAnalytics: true,
        canCreateTests: true,
        canManageTests: true
      }
    },
    {
      id: '21',
      name: 'Dr. Emily Rodriguez',
      email: 'admin@creativearts.edu',
      role: 'admin',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-10T00:00:00Z',
      lastLogin: '2024-01-20T11:15:00Z',
      collegeId: '3',
      assignedBy: '0',
      permissions: {
        canCreateCourses: true,
        canManageUsers: true,
        canManageCollegeCourses: true,
        canAssignInstructors: true,
        canViewCollegeAnalytics: true,
        canCreateTests: true,
        canManageTests: true
      }
    },
    // Instructors
    {
      id: '2',
      name: 'Sarah Instructor',
      email: 'instructor@demo.com',
      role: 'instructor',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-10T00:00:00Z',
      lastLogin: '2024-01-20T09:15:00Z',
      collegeId: '1',
      assignedBy: '1', // College Admin
      permissions: {
        canCreateCourses: true,
        canManageStudents: true,
        canViewAnalytics: true,
        canCreateTests: true,
        canManageTests: true
      },
      assignedCourses: ['1', '2'],
      students: ['3', '4', '5']
    },
    {
      id: '12',
      name: 'Prof. David Wilson',
      email: 'dwilson@businessacademy.edu',
      role: 'instructor',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-12T00:00:00Z',
      lastLogin: '2024-01-19T14:20:00Z',
      collegeId: '2',
      assignedBy: '11',
      permissions: {
        canCreateCourses: true,
        canManageStudents: true,
        canViewAnalytics: true,
        canCreateTests: true,
        canManageTests: true
      },
      assignedCourses: ['3'],
      students: ['13', '14']
    },
    {
      id: '22',
      name: 'Ms. Lisa Thompson',
      email: 'lthompson@creativearts.edu',
      role: 'instructor',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-15T00:00:00Z',
      lastLogin: '2024-01-20T13:45:00Z',
      collegeId: '3',
      assignedBy: '21',
      permissions: {
        canCreateCourses: true,
        canManageStudents: true,
        canViewAnalytics: true,
        canCreateTests: true,
        canManageTests: true
      },
      assignedCourses: ['4'],
      students: ['23', '24']
    },
    // Students
    {
      id: '3',
      name: 'John Student',
      email: 'student@demo.com',
      role: 'student',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-15T00:00:00Z',
      lastLogin: '2024-01-20T10:30:00Z',
      collegeId: '1',
      instructorId: '2',
      assignedBy: '2', // Instructor
      assignedCourses: ['1'],
      progress: {
        '1': {
          currentModule: '1',
          currentChapter: '1-1',
          completedChapters: [],
          completedModules: [],
          moduleTestResults: {},
          courseTestResult: null,
          aiInterviewResult: null,
          overallProgress: 0,
          timeSpent: 0,
          lastAccessed: '2024-01-20T10:30:00Z'
        }
      }
    },
    {
      id: '4',
      name: 'Emily Johnson',
      email: 'emily@techuniversity.edu',
      role: 'student',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-18T00:00:00Z',
      lastLogin: '2024-01-19T16:45:00Z',
      collegeId: '1',
      instructorId: '2',
      assignedBy: '2',
      assignedCourses: ['1', '2'],
      progress: {
        '1': {
          currentModule: '2',
          currentChapter: '2-1',
          completedChapters: ['1-1', '1-2', '1-3'],
          completedModules: ['1'],
          moduleTestResults: { 
            '1': { score: 85, passed: true, attemptedAt: '2024-01-19T14:00:00Z', attempts: 1 }
          },
          courseTestResult: null,
          aiInterviewResult: null,
          overallProgress: 35,
          timeSpent: 180,
          lastAccessed: '2024-01-19T16:45:00Z'
        },
        '2': {
          currentModule: '4',
          currentChapter: '4-1',
          completedChapters: [],
          completedModules: [],
          moduleTestResults: {},
          courseTestResult: null,
          aiInterviewResult: null,
          overallProgress: 5,
          timeSpent: 30,
          lastAccessed: '2024-01-19T15:20:00Z'
        }
      }
    },
    {
      id: '5',
      name: 'Michael Brown',
      email: 'michael@techuniversity.edu',
      role: 'student',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-16T00:00:00Z',
      lastLogin: '2024-01-19T14:20:00Z',
      collegeId: '1',
      instructorId: '2',
      assignedBy: '2',
      assignedCourses: ['2'],
      progress: {
        '2': {
          currentModule: '4',
          currentChapter: '4-1',
          completedChapters: [],
          completedModules: [],
          moduleTestResults: {},
          courseTestResult: null,
          aiInterviewResult: null,
          overallProgress: 5,
          timeSpent: 45,
          lastAccessed: '2024-01-19T14:20:00Z'
        }
      }
    },
    // Business Academy Students
    {
      id: '13',
      name: 'Alex Martinez',
      email: 'alex@businessacademy.edu',
      role: 'student',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-12T00:00:00Z',
      lastLogin: '2024-01-20T09:30:00Z',
      collegeId: '2',
      instructorId: '12',
      assignedBy: '12',
      assignedCourses: ['3'],
      progress: {
        '3': {
          currentModule: '6',
          currentChapter: '6-1',
          completedChapters: [],
          completedModules: [],
          moduleTestResults: {},
          courseTestResult: null,
          aiInterviewResult: null,
          overallProgress: 10,
          timeSpent: 60,
          lastAccessed: '2024-01-20T09:30:00Z'
        }
      }
    },
    {
      id: '14',
      name: 'Jessica Lee',
      email: 'jessica@businessacademy.edu',
      role: 'student',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-14T00:00:00Z',
      lastLogin: '2024-01-19T11:15:00Z',
      collegeId: '2',
      instructorId: '12',
      assignedBy: '12',
      assignedCourses: ['3'],
      progress: {
        '3': {
          currentModule: '6',
          currentChapter: '6-2',
          completedChapters: ['6-1'],
          completedModules: [],
          moduleTestResults: {},
          courseTestResult: null,
          aiInterviewResult: null,
          overallProgress: 15,
          timeSpent: 90,
          lastAccessed: '2024-01-19T11:15:00Z'
        }
      }
    },
    // Creative Arts Students
    {
      id: '23',
      name: 'Ryan Cooper',
      email: 'ryan@creativearts.edu',
      role: 'student',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-16T00:00:00Z',
      lastLogin: '2024-01-20T14:00:00Z',
      collegeId: '3',
      instructorId: '22',
      assignedBy: '22',
      assignedCourses: ['4'],
      progress: {
        '4': {
          currentModule: '7',
          currentChapter: '7-1',
          completedChapters: [],
          completedModules: [],
          moduleTestResults: {},
          courseTestResult: null,
          aiInterviewResult: null,
          overallProgress: 8,
          timeSpent: 40,
          lastAccessed: '2024-01-20T14:00:00Z'
        }
      }
    },
    {
      id: '24',
      name: 'Sophia Davis',
      email: 'sophia@creativearts.edu',
      role: 'student',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      isActive: true,
      isVerified: true,
      joinedDate: '2024-01-17T00:00:00Z',
      lastLogin: '2024-01-20T12:30:00Z',
      collegeId: '3',
      instructorId: '22',
      assignedBy: '22',
      assignedCourses: ['4'],
      progress: {
        '4': {
          currentModule: '7',
          currentChapter: '7-2',
          completedChapters: ['7-1'],
          completedModules: [],
          moduleTestResults: {},
          courseTestResult: null,
          aiInterviewResult: null,
          overallProgress: 12,
          timeSpent: 75,
          lastAccessed: '2024-01-20T12:30:00Z'
        }
      }
    }
  ],

  // Courses with proper college assignments
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
      collegeId: '1',
      createdBy: '1',
      assignedInstructors: ['2'],
      enrolledStudents: ['3', '4'],
      totalModules: 3,
      totalChapters: 9,
      estimatedDuration: '40 hours',
      price: 299,
      rating: 4.8,
      reviewCount: 156,
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-19T00:00:00Z',
      courseTest: {
        id: 'ct-1',
        title: 'Web Development Final Assessment',
        questions: 50,
        duration: 120,
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
      collegeId: '1',
      createdBy: '1',
      assignedInstructors: ['2'],
      enrolledStudents: ['4', '5'],
      totalModules: 2,
      totalChapters: 6,
      estimatedDuration: '25 hours',
      price: 199,
      rating: 4.9,
      reviewCount: 89,
      createdAt: '2024-01-12T00:00:00Z',
      updatedAt: '2024-01-18T00:00:00Z',
      courseTest: {
        id: 'ct-2',
        title: 'Advanced JavaScript Final Test',
        questions: 40,
        duration: 90,
        passingScore: 75,
        maxAttempts: 2
      }
    },
    {
      id: '3',
      title: 'Business Strategy Fundamentals',
      description: 'Learn essential business strategy concepts and frameworks for modern organizations.',
      instructor: {
        id: '12',
        name: 'Prof. David Wilson',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Business',
      level: 'intermediate',
      status: 'published',
      isActive: true,
      collegeId: '2',
      createdBy: '11',
      assignedInstructors: ['12'],
      enrolledStudents: ['13', '14'],
      totalModules: 2,
      totalChapters: 8,
      estimatedDuration: '30 hours',
      price: 249,
      rating: 4.7,
      reviewCount: 67,
      createdAt: '2024-01-13T00:00:00Z',
      updatedAt: '2024-01-19T00:00:00Z',
      courseTest: {
        id: 'ct-3',
        title: 'Business Strategy Assessment',
        questions: 35,
        duration: 75,
        passingScore: 70,
        maxAttempts: 3
      }
    },
    {
      id: '4',
      title: 'Digital Art & Design Mastery',
      description: 'Comprehensive course covering digital art techniques, design principles, and creative workflows.',
      instructor: {
        id: '22',
        name: 'Ms. Lisa Thompson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Design',
      level: 'beginner',
      status: 'published',
      isActive: true,
      collegeId: '3',
      createdBy: '21',
      assignedInstructors: ['22'],
      enrolledStudents: ['23', '24'],
      totalModules: 3,
      totalChapters: 12,
      estimatedDuration: '35 hours',
      price: 179,
      rating: 4.6,
      reviewCount: 43,
      createdAt: '2024-01-16T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z',
      courseTest: {
        id: 'ct-4',
        title: 'Digital Art Portfolio Assessment',
        questions: 25,
        duration: 60,
        passingScore: 75,
        maxAttempts: 2
      }
    }
  ],

  // Modules with proper course assignments
  modules: [
    // Course 1 Modules (Web Development)
    {
      id: '1',
      courseId: '1',
      title: 'Frontend Fundamentals',
      description: 'Learn HTML, CSS, and basic JavaScript',
      order: 1,
      estimatedDuration: '15 hours',
      totalChapters: 3,
      isActive: true,
      createdBy: '1',
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
      createdBy: '1',
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
      createdBy: '1',
      moduleTest: {
        id: 'mt-3',
        title: 'Full Stack Integration Test',
        questions: 15,
        duration: 30,
        passingScore: 70,
        maxAttempts: 3
      }
    },
    // Course 2 Modules (Advanced JavaScript)
    {
      id: '4',
      courseId: '2',
      title: 'Advanced JavaScript Features',
      description: 'ES6+, async programming, and modern JavaScript',
      order: 1,
      estimatedDuration: '15 hours',
      totalChapters: 3,
      isActive: true,
      createdBy: '1',
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
      createdBy: '1',
      moduleTest: {
        id: 'mt-5',
        title: 'Design Patterns Test',
        questions: 25,
        duration: 45,
        passingScore: 75,
        maxAttempts: 2
      }
    },
    // Course 3 Modules (Business Strategy)
    {
      id: '6',
      courseId: '3',
      title: 'Strategic Planning Fundamentals',
      description: 'Core concepts of strategic planning and analysis',
      order: 1,
      estimatedDuration: '18 hours',
      totalChapters: 4,
      isActive: true,
      createdBy: '11',
      moduleTest: {
        id: 'mt-6',
        title: 'Strategic Planning Test',
        questions: 20,
        duration: 50,
        passingScore: 70,
        maxAttempts: 3
      }
    },
    {
      id: '8',
      courseId: '3',
      title: 'Market Analysis & Competitive Intelligence',
      description: 'Understanding markets and competitive landscapes',
      order: 2,
      estimatedDuration: '12 hours',
      totalChapters: 4,
      isActive: true,
      createdBy: '11',
      moduleTest: {
        id: 'mt-8',
        title: 'Market Analysis Test',
        questions: 18,
        duration: 40,
        passingScore: 70,
        maxAttempts: 3
      }
    },
    // Course 4 Modules (Digital Art)
    {
      id: '7',
      courseId: '4',
      title: 'Digital Art Basics',
      description: 'Introduction to digital art tools and techniques',
      order: 1,
      estimatedDuration: '12 hours',
      totalChapters: 4,
      isActive: true,
      createdBy: '21',
      moduleTest: {
        id: 'mt-7',
        title: 'Digital Art Basics Test',
        questions: 15,
        duration: 35,
        passingScore: 75,
        maxAttempts: 3
      }
    },
    {
      id: '9',
      courseId: '4',
      title: 'Advanced Design Techniques',
      description: 'Professional design workflows and advanced techniques',
      order: 2,
      estimatedDuration: '15 hours',
      totalChapters: 4,
      isActive: true,
      createdBy: '21',
      moduleTest: {
        id: 'mt-9',
        title: 'Advanced Design Test',
        questions: 20,
        duration: 45,
        passingScore: 75,
        maxAttempts: 2
      }
    },
    {
      id: '10',
      courseId: '4',
      title: 'Portfolio Development',
      description: 'Building a professional design portfolio',
      order: 3,
      estimatedDuration: '8 hours',
      totalChapters: 4,
      isActive: true,
      createdBy: '21',
      moduleTest: {
        id: 'mt-10',
        title: 'Portfolio Assessment',
        questions: 12,
        duration: 30,
        passingScore: 80,
        maxAttempts: 2
      }
    }
  ],

  // Chapters with proper module assignments
  chapters: [
    // Module 1 Chapters (Frontend Fundamentals)
    {
      id: '1-1',
      moduleId: '1',
      courseId: '1',
      title: 'HTML Fundamentals',
      description: 'Learn HTML structure, semantic elements, and best practices',
      content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. In this chapter, you will learn about HTML structure, semantic elements, forms, and accessibility best practices.',
      order: 1,
      estimatedDuration: '5 hours',
      videoUrl: 'https://example.com/videos/html-fundamentals.mp4',
      resources: [
        { type: 'pdf', title: 'HTML Reference Guide', url: '/resources/html-guide.pdf' },
        { type: 'link', title: 'MDN HTML Documentation', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' }
      ],
      isActive: true,
      isLocked: false
    },
    {
      id: '1-2',
      moduleId: '1',
      courseId: '1',
      title: 'CSS Styling and Layout',
      description: 'Master CSS for styling and responsive layouts',
      content: 'CSS (Cascading Style Sheets) is used for styling HTML elements. Learn about selectors, box model, flexbox, grid, and responsive design principles.',
      order: 2,
      estimatedDuration: '6 hours',
      videoUrl: 'https://example.com/videos/css-fundamentals.mp4',
      resources: [
        { type: 'pdf', title: 'CSS Flexbox Guide', url: '/resources/flexbox-guide.pdf' },
        { type: 'codepen', title: 'CSS Examples', url: 'https://codepen.io/examples' }
      ],
      isActive: true,
      isLocked: true
    },
    {
      id: '1-3',
      moduleId: '1',
      courseId: '1',
      title: 'JavaScript Basics',
      description: 'Introduction to JavaScript programming',
      content: 'JavaScript is a high-level programming language that enables interactive web pages. Learn variables, functions, DOM manipulation, and event handling.',
      order: 3,
      estimatedDuration: '4 hours',
      videoUrl: 'https://example.com/videos/js-basics.mp4',
      resources: [
        { type: 'pdf', title: 'JavaScript Cheat Sheet', url: '/resources/js-cheatsheet.pdf' }
      ],
      isActive: true,
      isLocked: true
    },
    // Module 2 Chapters (Backend Development)
    {
      id: '2-1',
      moduleId: '2',
      courseId: '1',
      title: 'Node.js Introduction',
      description: 'Server-side JavaScript with Node.js',
      content: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine. Learn about server-side JavaScript, npm, modules, and building your first server.',
      order: 1,
      estimatedDuration: '5 hours',
      videoUrl: 'https://example.com/videos/nodejs-intro.mp4',
      resources: [],
      isActive: true,
      isLocked: true
    },
    {
      id: '2-2',
      moduleId: '2',
      courseId: '1',
      title: 'Express.js Framework',
      description: 'Building web applications with Express.js',
      content: 'Express.js is a minimal and flexible Node.js web application framework. Learn routing, middleware, templating, and building RESTful APIs.',
      order: 2,
      estimatedDuration: '6 hours',
      videoUrl: 'https://example.com/videos/express-intro.mp4',
      resources: [],
      isActive: true,
      isLocked: true
    },
    {
      id: '2-3',
      moduleId: '2',
      courseId: '1',
      title: 'Database Integration',
      description: 'Working with databases in Node.js applications',
      content: 'Learn how to integrate databases with your Node.js applications using MongoDB and Mongoose ODM.',
      order: 3,
      estimatedDuration: '6 hours',
      videoUrl: 'https://example.com/videos/database-integration.mp4',
      resources: [],
      isActive: true,
      isLocked: true
    },
    {
      id: '2-4',
      moduleId: '2',
      courseId: '1',
      title: 'API Development',
      description: 'Creating RESTful APIs with Express.js',
      content: 'REST APIs are the backbone of modern web applications. Learn to design, build, and test RESTful APIs.',
      order: 4,
      estimatedDuration: '3 hours',
      videoUrl: 'https://example.com/videos/api-development.mp4',
      resources: [],
      isActive: true,
      isLocked: true
    },
    // Additional chapters for other courses...
    {
      id: '4-1',
      moduleId: '4',
      courseId: '2',
      title: 'ES6+ Features',
      description: 'Modern JavaScript syntax and features',
      content: 'Explore ES6+ features including arrow functions, destructuring, modules, promises, and async/await.',
      order: 1,
      estimatedDuration: '5 hours',
      videoUrl: 'https://example.com/videos/es6-features.mp4',
      resources: [],
      isActive: true,
      isLocked: false
    },
    {
      id: '6-1',
      moduleId: '6',
      courseId: '3',
      title: 'Strategic Analysis Framework',
      description: 'Understanding strategic analysis tools',
      content: 'Learn SWOT analysis, Porter\'s Five Forces, and other strategic analysis frameworks.',
      order: 1,
      estimatedDuration: '4 hours',
      videoUrl: 'https://example.com/videos/strategic-analysis.mp4',
      resources: [],
      isActive: true,
      isLocked: false
    },
    {
      id: '6-2',
      moduleId: '6',
      courseId: '3',
      title: 'Competitive Positioning',
      description: 'Developing competitive strategies',
      content: 'Learn how to position your organization competitively in the market.',
      order: 2,
      estimatedDuration: '5 hours',
      videoUrl: 'https://example.com/videos/competitive-positioning.mp4',
      resources: [],
      isActive: true,
      isLocked: true
    },
    {
      id: '7-1',
      moduleId: '7',
      courseId: '4',
      title: 'Digital Drawing Fundamentals',
      description: 'Basic digital drawing techniques',
      content: 'Learn the fundamentals of digital drawing using professional software tools.',
      order: 1,
      estimatedDuration: '3 hours',
      videoUrl: 'https://example.com/videos/digital-drawing.mp4',
      resources: [],
      isActive: true,
      isLocked: false
    },
    {
      id: '7-2',
      moduleId: '7',
      courseId: '4',
      title: 'Color Theory & Composition',
      description: 'Understanding color and composition in digital art',
      content: 'Master color theory, composition rules, and visual hierarchy in digital art.',
      order: 2,
      estimatedDuration: '4 hours',
      videoUrl: 'https://example.com/videos/color-theory.mp4',
      resources: [],
      isActive: true,
      isLocked: true
    }
  ],

  // Tests data
  tests: [
    {
      id: 'mt-1',
      type: 'module',
      moduleId: '1',
      courseId: '1',
      title: 'Frontend Fundamentals Test',
      description: 'Test your knowledge of HTML, CSS, and basic JavaScript',
      questions: 20,
      duration: 45,
      passingScore: 70,
      maxAttempts: 3,
      createdBy: '2',
      isActive: true,
      createdAt: '2024-01-10T00:00:00Z'
    },
    {
      id: 'ct-1',
      type: 'course',
      courseId: '1',
      title: 'Web Development Final Assessment',
      description: 'Comprehensive test covering all web development concepts',
      questions: 50,
      duration: 120,
      passingScore: 70,
      maxAttempts: 2,
      createdBy: '2',
      isActive: true,
      createdAt: '2024-01-10T00:00:00Z'
    }
  ],

  // Test results
  testResults: [
    {
      id: 'tr-1',
      studentId: '4',
      testId: 'mt-1',
      courseId: '1',
      moduleId: '1',
      testType: 'module',
      score: 85,
      passed: true,
      attemptedAt: '2024-01-19T14:00:00Z',
      submittedAt: '2024-01-19T14:45:00Z'
    }
  ],

  // System analytics and metrics
  systemAnalytics: {
    overview: {
      totalColleges: 3,
      totalAdmins: 3,
      totalInstructors: 3,
      totalStudents: 6,
      totalCourses: 4,
      totalModules: 7,
      totalChapters: 10,
      activeUsers: 12,
      systemUptime: '99.9%',
      avgCourseCompletion: 23,
      totalRevenue: 2847,
      monthlyActiveUsers: 11
    },
    collegeBreakdown: {
      '1': { students: 3, instructors: 1, courses: 2, revenue: 1494 },
      '2': { students: 2, instructors: 1, courses: 1, revenue: 498 },
      '3': { students: 2, instructors: 1, courses: 1, revenue: 358 }
    },
    performanceMetrics: {
      cpuUsage: 45,
      memoryUsage: 62,
      diskUsage: 38,
      networkLatency: 12,
      errorRate: 0.02,
      responseTime: 145
    }
  }
}

// Enhanced API simulation functions
export const mockAPI = {
  delay: (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms)),

  // Super Admin APIs
  getAllColleges: async () => {
    await mockAPI.delay(800)
    return mockData.colleges
  },

  getAllAdmins: async () => {
    await mockAPI.delay(600)
    return mockData.users.filter(user => user.role === 'admin')
  },

  getAllInstructors: async () => {
    await mockAPI.delay(700)
    return mockData.users.filter(user => user.role === 'instructor')
  },

  getAllStudents: async () => {
    await mockAPI.delay(900)
    return mockData.users.filter(user => user.role === 'student')
  },

  getSystemAnalytics: async () => {
    await mockAPI.delay(1200)
    return mockData.systemAnalytics
  },

  createCollege: async (collegeData) => {
    await mockAPI.delay(1000)
    const newCollege = {
      id: String(mockData.colleges.length + 1),
      ...collegeData,
      totalStudents: 0,
      totalInstructors: 0,
      totalCourses: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockData.colleges.push(newCollege)
    return newCollege
  },

  updateCollege: async (collegeId, updates) => {
    await mockAPI.delay(800)
    const college = mockData.colleges.find(c => c.id === collegeId)
    if (college) {
      Object.assign(college, updates, { updatedAt: new Date().toISOString() })
      return college
    }
    throw new Error('College not found')
  },

  deleteCollege: async (collegeId) => {
    await mockAPI.delay(600)
    const index = mockData.colleges.findIndex(c => c.id === collegeId)
    if (index !== -1) {
      mockData.colleges.splice(index, 1)
      return true
    }
    throw new Error('College not found')
  },

  // Admin APIs
  getCollegeUsers: async (collegeId) => {
    await mockAPI.delay(600)
    return mockData.users.filter(user => user.collegeId === collegeId)
  },

  getCollegeCourses: async (collegeId) => {
    await mockAPI.delay(700)
    return mockData.courses.filter(course => course.collegeId === collegeId)
  },

  createUser: async (userData) => {
    await mockAPI.delay(800)
    const newUser = {
      id: String(Date.now()),
      ...userData,
      isActive: true,
      isVerified: false,
      joinedDate: new Date().toISOString(),
      lastLogin: null,
      progress: {},
      assignedCourses: [],
      students: userData.role === 'instructor' ? [] : undefined
    }
    mockData.users.push(newUser)
    
    // Update college stats
    const college = mockData.colleges.find(c => c.id === userData.collegeId)
    if (college) {
      if (userData.role === 'student') college.totalStudents++
      if (userData.role === 'instructor') college.totalInstructors++
    }
    
    return newUser
  },

  updateUserPermissions: async (userId, permissions) => {
    await mockAPI.delay(500)
    const user = mockData.users.find(u => u.id === userId)
    if (user) {
      user.permissions = { ...user.permissions, ...permissions }
      user.updatedAt = new Date().toISOString()
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
      student.assignedBy = instructorId
      if (!instructor.students.includes(studentId)) {
        instructor.students.push(studentId)
      }
      return { student, instructor }
    }
    throw new Error('User not found')
  },

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

  getStudentEnrollments: async (studentId) => {
    await mockAPI.delay(600)
    const student = mockData.users.find(user => user.id === studentId)
    if (!student) return []
    
    return mockData.courses.filter(course => 
      student.assignedCourses.includes(course.id)
    )
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
        overallProgress: 0,
        timeSpent: 0,
        lastAccessed: new Date().toISOString()
      }
    }
    
    const progress = student.progress[courseId]
    if (!progress.completedChapters.includes(chapterId)) {
      progress.completedChapters.push(chapterId)
      progress.timeSpent += Math.floor(Math.random() * 60) + 30 // Add random time
    }
    
    // Update current position
    progress.currentChapter = chapterId
    progress.lastAccessed = new Date().toISOString()
    
    // Check if module is completed
    const moduleChapters = mockData.chapters.filter(c => c.moduleId === moduleId)
    const completedModuleChapters = progress.completedChapters.filter(chId => 
      moduleChapters.some(ch => ch.id === chId)
    )
    
    if (completedModuleChapters.length === moduleChapters.length) {
      // Module completed, unlock test
      progress.moduleTestUnlocked = moduleId
    }
    
    // Calculate overall progress
    const course = mockData.courses.find(c => c.id === courseId)
    const totalSteps = course.totalChapters + course.totalModules + 2 // +2 for course test and AI interview
    const completedSteps = progress.completedChapters.length + progress.completedModules.length + 
                          (progress.courseTestResult?.passed ? 1 : 0) + (progress.aiInterviewResult ? 1 : 0)
    progress.overallProgress = Math.round((completedSteps / totalSteps) * 100)
    
    return progress
  },

  // Test Management
  getAllTests: async () => {
    await mockAPI.delay(600)
    return mockData.tests
  },

  getTestsByCreator: async (creatorId) => {
    await mockAPI.delay(500)
    return mockData.tests.filter(test => test.createdBy === creatorId)
  },

  createTest: async (testData) => {
    await mockAPI.delay(800)
    const newTest = {
      id: `test-${Date.now()}`,
      ...testData,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockData.tests.push(newTest)
    return newTest
  },

  updateTest: async (testId, updates) => {
    await mockAPI.delay(600)
    const test = mockData.tests.find(t => t.id === testId)
    if (test) {
      Object.assign(test, updates, { updatedAt: new Date().toISOString() })
      return test
    }
    throw new Error('Test not found')
  },

  deleteTest: async (testId) => {
    await mockAPI.delay(500)
    const index = mockData.tests.findIndex(t => t.id === testId)
    if (index !== -1) {
      mockData.tests.splice(index, 1)
      return true
    }
    throw new Error('Test not found')
  },

  getModuleTest: async (moduleId) => {
    await mockAPI.delay(500)
    const module = mockData.modules.find(m => m.id === moduleId)
    return module?.moduleTest || null
  },

  getCourseTest: async (courseId) => {
    await mockAPI.delay(500)
    const course = mockData.courses.find(c => c.id === courseId)
    return course?.courseTest || null
  },

  submitModuleTest: async (studentId, testId, answers) => {
    await mockAPI.delay(1000)
    const module = mockData.modules.find(m => m.moduleTest?.id === testId)
    if (!module) throw new Error('Test not found')
    
    const test = module.moduleTest
    const totalQuestions = test.questions
    const correctAnswers = Math.floor(Math.random() * totalQuestions * 0.3) + Math.floor(totalQuestions * 0.7)
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const passed = score >= test.passingScore
    
    const result = {
      id: `tr-${Date.now()}`,
      studentId,
      testId,
      testType: 'module',
      moduleId: module.id,
      courseId: module.courseId,
      score,
      totalQuestions,
      correctAnswers,
      passed,
      attemptNumber: 1,
      timeSpent: Math.floor(Math.random() * test.duration),
      submittedAt: new Date().toISOString(),
      answers
    }
    
    // Update student progress
    const student = mockData.users.find(user => user.id === studentId)
    if (student.progress[module.courseId]) {
      student.progress[module.courseId].moduleTestResults[module.id] = {
        score,
        passed,
        attemptedAt: new Date().toISOString(),
        attempts: 1
      }
      
      if (passed && !student.progress[module.courseId].completedModules.includes(module.id)) {
        student.progress[module.courseId].completedModules.push(module.id)
        
        // Check if all modules are completed to unlock course test
        const courseModules = mockData.modules.filter(m => m.courseId === module.courseId)
        const completedModules = student.progress[module.courseId].completedModules
        if (completedModules.length === courseModules.length) {
          student.progress[module.courseId].courseTestUnlocked = true
        }
      }
    }
    
    mockData.testResults.push(result)
    return result
  },

  submitCourseTest: async (studentId, testId, answers) => {
    await mockAPI.delay(1500)
    const course = mockData.courses.find(c => c.courseTest?.id === testId)
    if (!course) throw new Error('Test not found')
    
    const test = course.courseTest
    const totalQuestions = test.questions
    const correctAnswers = Math.floor(Math.random() * totalQuestions * 0.3) + Math.floor(totalQuestions * 0.7)
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const passed = score >= test.passingScore
    
    const result = {
      id: `ctr-${Date.now()}`,
      studentId,
      testId,
      testType: 'course',
      courseId: course.id,
      score,
      totalQuestions,
      correctAnswers,
      passed,
      attemptNumber: 1,
      timeSpent: Math.floor(Math.random() * test.duration),
      submittedAt: new Date().toISOString(),
      answers
    }
    
    // Update student progress
    const student = mockData.users.find(user => user.id === studentId)
    if (student.progress[course.id]) {
      student.progress[course.id].courseTestResult = {
        score,
        passed,
        attemptedAt: new Date().toISOString(),
        attempts: 1
      }
      
      if (passed) {
        student.progress[course.id].overallProgress = 90 // 90% after course test, 100% after AI interview
        student.progress[course.id].aiInterviewUnlocked = true
      }
    }
    
    mockData.testResults.push(result)
    return result
  },

  // AI Interview Integration
  startAIInterview: async (studentId, courseId) => {
    await mockAPI.delay(2000)
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
    
    return result
  },

  // Course Management APIs
  createCourse: async (courseData) => {
    await mockAPI.delay(1000)
    const newCourse = {
      id: String(Date.now()),
      ...courseData,
      status: 'draft',
      isActive: true,
      enrolledStudents: [],
      totalModules: 0,
      totalChapters: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockData.courses.push(newCourse)
    return newCourse
  },

  updateCourse: async (courseId, updates) => {
    await mockAPI.delay(600)
    const course = mockData.courses.find(c => c.id === courseId)
    if (course) {
      Object.assign(course, updates, { updatedAt: new Date().toISOString() })
      return course
    }
    throw new Error('Course not found')
  },

  deleteCourse: async (courseId) => {
    await mockAPI.delay(500)
    const index = mockData.courses.findIndex(c => c.id === courseId)
    if (index !== -1) {
      mockData.courses.splice(index, 1)
      return true
    }
    throw new Error('Course not found')
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
  },

  // Bulk operations for admin
  bulkUpdateUsers: async (userIds, updates) => {
    await mockAPI.delay(1200)
    const updatedUsers = []
    userIds.forEach(userId => {
      const user = mockData.users.find(u => u.id === userId)
      if (user) {
        Object.assign(user, updates, { updatedAt: new Date().toISOString() })
        updatedUsers.push(user)
      }
    })
    return updatedUsers
  },

  deleteUser: async (userId) => {
    await mockAPI.delay(600)
    const userIndex = mockData.users.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      const user = mockData.users[userIndex]
      
      // Update college stats
      const college = mockData.colleges.find(c => c.id === user.collegeId)
      if (college) {
        if (user.role === 'student') college.totalStudents--
        if (user.role === 'instructor') college.totalInstructors--
      }
      
      mockData.users.splice(userIndex, 1)
      return true
    }
    throw new Error('User not found')
  }
}