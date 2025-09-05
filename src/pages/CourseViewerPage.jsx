import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Lock, 
  BookOpen, 
  Clock, 
  FileText,
  Award,
  ChevronRight,
  ChevronDown,
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX,
  Maximize,
  Settings
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { mockAPI, mockData } from '../services/mockData'
import useAuthStore from '../store/useAuthStore'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Progress from '../components/ui/Progress'
import Badge from '../components/ui/Badge'

const CourseViewerPage = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [currentModule, setCurrentModule] = useState(null)
  const [currentChapter, setCurrentChapter] = useState(null)
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)

  useEffect(() => {
    fetchCourseData()
  }, [courseId])

  const fetchCourseData = async () => {
    try {
      setLoading(true)
      
      // Get course details
      const courseData = mockData.courses.find(c => c.id === courseId)
      if (!courseData) {
        toast.error('Course not found')
        navigate('/courses')
        return
      }
      
      // Check if user has access to this course
      const student = mockData.users.find(u => u.id === user.id)
      if (!student?.assignedCourses.includes(courseId)) {
        toast.error('You do not have access to this course')
        navigate('/dashboard')
        return
      }
      
      setCourse(courseData)
      
      // Get course modules with chapters
      const moduleData = await mockAPI.getCourseModules(courseId)
      const modulesWithChapters = moduleData.map(module => ({
        ...module,
        chapters: generateChapters(module.id, module.totalChapters)
      }))
      
      setModules(modulesWithChapters)
      
      // Get user progress
      const userProgress = await mockAPI.getStudentProgress(user.id, courseId)
      setProgress(userProgress)
      
      // Set initial module and chapter
      if (modulesWithChapters.length > 0) {
        const firstModule = modulesWithChapters[0]
        setCurrentModule(firstModule)
        setCurrentChapter(firstModule.chapters[0])
        setExpandedModules({ [firstModule.id]: true })
      }
      
    } catch (error) {
      console.error('Error fetching course data:', error)
      toast.error('Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const generateChapters = (moduleId, totalChapters) => {
    const chapters = []
    for (let i = 1; i <= totalChapters; i++) {
      chapters.push({
        id: `${moduleId}-ch-${i}`,
        moduleId,
        title: `Chapter ${i}: Introduction to Topic ${i}`,
        duration: `${Math.floor(Math.random() * 20) + 10} min`,
        type: 'video',
        content: `This is the content for chapter ${i}. In this chapter, you will learn about important concepts and practical applications.`,
        videoUrl: `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`,
        order: i
      })
    }
    return chapters
  }

  const toggleModuleExpansion = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  const selectChapter = (module, chapter) => {
    setCurrentModule(module)
    setCurrentChapter(chapter)
  }

  const markChapterComplete = async () => {
    if (!currentChapter || !currentModule) return
    
    try {
      await mockAPI.updateChapterProgress(
        user.id, 
        courseId, 
        currentModule.id, 
        currentChapter.id
      )
      
      // Refresh progress
      const updatedProgress = await mockAPI.getStudentProgress(user.id, courseId)
      setProgress(updatedProgress)
      
      toast.success('Chapter completed!')
      
      // Auto-advance to next chapter
      const currentModuleIndex = modules.findIndex(m => m.id === currentModule.id)
      const currentChapterIndex = currentModule.chapters.findIndex(c => c.id === currentChapter.id)
      
      if (currentChapterIndex < currentModule.chapters.length - 1) {
        // Next chapter in same module
        const nextChapter = currentModule.chapters[currentChapterIndex + 1]
        setCurrentChapter(nextChapter)
      } else if (currentModuleIndex < modules.length - 1) {
        // First chapter of next module
        const nextModule = modules[currentModuleIndex + 1]
        setCurrentModule(nextModule)
        setCurrentChapter(nextModule.chapters[0])
        setExpandedModules(prev => ({ ...prev, [nextModule.id]: true }))
      }
      
    } catch (error) {
      toast.error('Failed to update progress')
    }
  }

  const isChapterCompleted = (chapterId) => {
    return progress?.completedChapters?.includes(chapterId) || false
  }

  const getModuleProgress = (module) => {
    const completedChapters = module.chapters.filter(chapter => 
      isChapterCompleted(chapter.id)
    ).length
    return Math.round((completedChapters / module.chapters.length) * 100)
  }

  const getCourseProgress = () => {
    if (!progress || !course) return 0
    return Math.round((progress.completedChapters.length / course.totalChapters) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
          <Button onClick={() => navigate('/courses')}>
            Browse Courses
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden flex flex-col`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </Button>
          </div>
          
          <div className="mb-4">
            <h1 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
              <span>by {course.instructor.name}</span>
              <Badge variant="info" size="sm">{course.level}</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{getCourseProgress()}%</span>
              </div>
              <Progress value={getCourseProgress()} size="sm" />
              <div className="text-xs text-gray-500">
                {progress?.completedChapters?.length || 0} of {course.totalChapters} chapters completed
              </div>
            </div>
          </div>
        </div>

        {/* Module List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {modules.map((module) => (
              <div key={module.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleModuleExpansion(module.id)}
                  className="w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{module.title}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>{module.totalChapters} chapters</span>
                      <span>{getModuleProgress(module)}% complete</span>
                    </div>
                  </div>
                  {expandedModules[module.id] ? 
                    <ChevronDown size={16} /> : 
                    <ChevronRight size={16} />
                  }
                </button>
                
                {expandedModules[module.id] && (
                  <div className="border-t border-gray-200">
                    {module.chapters.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => selectChapter(module, chapter)}
                        className={`w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                          currentChapter?.id === chapter.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {isChapterCompleted(chapter.id) ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : currentChapter?.id === chapter.id ? (
                            <PlayCircle size={16} className="text-primary-500" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {chapter.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock size={12} />
                            <span>{chapter.duration}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <BookOpen size={16} className="mr-2" />
              Course Content
            </Button>
          )}
          
          {currentChapter && (
            <div className="flex-1 text-center">
              <h2 className="text-lg font-semibold text-gray-900">{currentChapter.title}</h2>
              <p className="text-sm text-gray-600">{currentModule?.title}</p>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVideoMuted(!videoMuted)}
            >
              {videoMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
            >
              <Settings size={16} />
            </Button>
          </div>
        </div>

        {/* Video/Content Area */}
        <div className="flex-1 bg-black flex items-center justify-center">
          {currentChapter ? (
            <div className="w-full max-w-4xl aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
              {currentChapter.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <PlayCircle size={64} className="mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">{currentChapter.title}</h3>
                    <p className="text-gray-300 mb-4">Video content would be displayed here</p>
                    <Button
                      onClick={() => setVideoPlaying(!videoPlaying)}
                      className="mb-4"
                    >
                      {videoPlaying ? (
                        <>
                          <PauseCircle size={16} className="mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <PlayCircle size={16} className="mr-2" />
                          Play Video
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full p-8 text-white overflow-y-auto">
                  <h3 className="text-2xl font-bold mb-4">{currentChapter.title}</h3>
                  <div className="prose prose-invert max-w-none">
                    <p>{currentChapter.content}</p>
                  </div>
                </div>
              )}
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setVideoPlaying(!videoPlaying)}
                      className="text-white hover:bg-white/20"
                    >
                      {videoPlaying ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
                    </Button>
                    <span className="text-sm">0:00 / {currentChapter.duration}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setVideoMuted(!videoMuted)}
                      className="text-white hover:bg-white/20"
                    >
                      {videoMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <Maximize size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-white">
              <BookOpen size={64} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Select a chapter to begin</h3>
              <p className="text-gray-400">Choose a chapter from the sidebar to start learning</p>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentChapter && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>{currentChapter.duration}</span>
                  <span>•</span>
                  <span>{currentChapter.type}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {currentChapter && !isChapterCompleted(currentChapter.id) && (
                <Button onClick={markChapterComplete}>
                  <CheckCircle size={16} className="mr-2" />
                  Mark as Complete
                </Button>
              )}
              
              {currentChapter && isChapterCompleted(currentChapter.id) && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseViewerPage