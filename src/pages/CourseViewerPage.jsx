// import React, { useState, useEffect, useMemo } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import {
//   ArrowLeft,
//   CheckCircle,
//   BookOpen,
//   Clock,
//   ChevronRight,
//   ChevronDown,
// } from 'lucide-react'
// import axios from 'axios'
// import { toast } from 'react-hot-toast'
// import useAuthStore from '../store/useAuthStore'
// import Button from '../components/ui/Button'
// import Progress from '../components/ui/Progress'
// import Badge from '../components/ui/Badge'

// import { coursesAPI, chaptersAPI, FALLBACK_THUMB } from '../services/api'


// const CourseViewerPage = () => {
//   const { courseId } = useParams()
//   const navigate = useNavigate()
//   const { token } = useAuthStore()

//   const [course, setCourse] = useState(null)
//   const [chapters, setChapters] = useState([])
//   const [currentChapter, setCurrentChapter] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [sidebarOpen, setSidebarOpen] = useState(true)
//   const [expanded, setExpanded] = useState(true)
//   const [completedChapterIds, setCompletedChapterIds] = useState([])

 
//   const [quizLoading, setQuizLoading] = useState(false)
//   const [quiz, setQuiz] = useState(null) 
//   const [quizAnswers, setQuizAnswers] = useState({})
//   const [quizSubmitted, setQuizSubmitted] = useState(false)
//   const [quizScore, setQuizScore] = useState(null)

 

//   useEffect(() => {
//     fetchData()

//   }, [courseId])

// async function fetchData() {
//   setLoading(true)
//   try {
//     // 1) Course
//     let courseRes
//     try {
//       courseRes = await coursesAPI.get(courseId)
//     } catch (e) {
//       if (e?.response?.status === 404) {
//         const all = await coursesAPI.list()
//         const found = (all.data || []).find((c) => c.id === courseId)
//         if (!found) throw e
//         courseRes = { data: found }
//       } else {
//         throw e
//       }
//     }

//     const c = courseRes.data
//     setCourse({
//       id: c.id,
//       title: c.title,
//       level: 'beginner',
//       instructorName: (c.instructorNames && c.instructorNames[0]) || 'Instructor',
//       thumbnail: c.thumbnail || FALLBACK_THUMB,
//       status: c.status,
//     })

//     // 2) Chapters
//     const chRes = await chaptersAPI.listByCourse(courseId)
//     const list = Array.isArray(chRes.data) ? chRes.data : []

//     const mappedChapters = list
//       .sort((a, b) => (a.order || 0) - (b.order || 0))
//       .map((ch) => ({
//         id: ch.id,
//         title: ch.title,
//         // keep “text-only” viewer; show minutes if you store it in settings
//         duration: ch?.settings?.estimatedMinutes ? `${ch.settings.estimatedMinutes} min` : '—',
//         type: Array.isArray(ch.assessments) && ch.assessments.length > 0 ? 'quiz' : 'text',
//         content: ch.content || ch.description || '',
//         order: ch.order || 0,
//         hasQuiz: Array.isArray(ch.assessments) && ch.assessments.length > 0,
//       }))

//     setChapters(mappedChapters)
//     if (mappedChapters.length) {
//       setCurrentChapter(mappedChapters[0])
//     }
//   } catch (err) {
//     console.error('Course load failed:', err)
//     toast.error('Failed to load course')
//     navigate('/courses')
//   } finally {
//     setLoading(false)
//   }
// }



//   useEffect(() => {
//     if (!currentChapter) {
//       setQuiz(null)
//       return
//     }
//     if (!currentChapter.hasQuiz) {
//       setQuiz(null)
//       return
//     }
//     loadQuizForChapter(currentChapter.id)
  
//   }, [currentChapter?.id])

//   async function loadQuizForChapter(chapterId) {
//     setQuizLoading(true)
//     setQuiz(null)
//     setQuizAnswers({})
//     setQuizSubmitted(false)
//     setQuizScore(null)

//     try {
 
//       const listRes = await axios.get(`${API_BASE}/api/assessments`, {
//         headers,
//         params: { chapterId },
//       })
//       const assessments = Array.isArray(listRes.data) ? listRes.data : []
//       if (!assessments.length) {
//         setQuiz(null)
//         return
//       }
//       const first = assessments[0]

 
//       let full = first
//       if (!first.questions) {
//         const fullRes = await axios.get(`${API_BASE}/api/assessments/${first.id}`, { headers })
//         full = fullRes.data
//       }

//       const questions = (full.questions || []).sort((a, b) => (a.order || 0) - (b.order || 0))
//       setQuiz({
//         id: full.id,
//         title: full.title || 'Quiz',
//         questions: questions.map((q) => ({
//           id: q.id,
//           prompt: q.prompt,
//           type: String(q.type || '').toLowerCase(), // 'mcq' | 'subjective' | 'match' etc.
//           options: Array.isArray(q.options) ? q.options : [],
//           correctOptionIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : null,
//           correctOptionIndexes: Array.isArray(q.correctOptionIndexes) ? q.correctOptionIndexes : null,
//           points: q.points ?? 1,
//           order: q.order ?? 1,
//         })),
//       })
//     } catch (e) {
//       console.error('Load quiz failed:', e)
//       toast.error('Failed to load quiz')
//       setQuiz(null)
//     } finally {
//       setQuizLoading(false)
//     }
//   }

//   const toggleSection = () => setExpanded((x) => !x)

//   const getCourseProgress = () => {
//     if (!chapters.length) return 0
//     const completed = chapters.filter((ch) => completedChapterIds.includes(ch.id)).length
//     return Math.round((completed / chapters.length) * 100)
//   }

//   const isChapterCompleted = (id) => completedChapterIds.includes(id)

//   const markChapterComplete = () => {
//     if (!currentChapter) return
//     if (!isChapterCompleted(currentChapter.id)) {
//       setCompletedChapterIds((prev) => [...prev, currentChapter.id])
//       toast.success('Chapter completed!')

//       const idx = chapters.findIndex((c) => c.id === currentChapter.id)
//       if (idx >= 0 && idx < chapters.length - 1) {
//         setCurrentChapter(chapters[idx + 1])
//       }
//     }
//   }

//   const handleAnswerChange = (qid, value) => {
//     setQuizAnswers((prev) => ({ ...prev, [qid]: value }))
//   }

//   function scoreLocally(quiz, answers) {
//     let score = 0
//     let max = 0
//     for (const q of quiz.questions) {
//       const pts = q.points ?? 1
//       max += pts

//       const ans = answers[q.id]

//       if (typeof q.correctOptionIndex === 'number') {
//         if (Number(ans) === q.correctOptionIndex) score += pts
//         continue
//       }
   
//       if (Array.isArray(q.correctOptionIndexes)) {
//         const normalized = Array.isArray(ans) ? ans.map(Number).sort() : []
//         const correct = [...q.correctOptionIndexes].sort()
//         if (normalized.length === correct.length && normalized.every((v, i) => v === correct[i])) {
//           score += pts
//         }
//         continue
//       }

//     }
//     return { score, max }
//   }

//   const submitQuiz = async () => {
//     if (!quiz) return
//     try {
//       setQuizSubmitted(true)

//       let serverScored = false
//       try {
//         const resp = await axios.post(
//           `${API_BASE}/api/assessments/${quiz.id}/attempts`,
//           { answers: quizAnswers },
//           { headers }
//         )
//         if (resp?.data?.score != null && resp?.data?.maxScore != null) {
//           setQuizScore({ score: resp.data.score, max: resp.data.maxScore })
//           serverScored = true
//         }
//       } catch (e) {
  
//       }

//       if (!serverScored) {
        
//         const { score, max } = scoreLocally(quiz, quizAnswers)
//         setQuizScore({ score, max })
//       }

//       toast.success('Quiz submitted!')
     
//       markChapterComplete()
//     } catch (e) {
//       console.error(e)
//       toast.error('Failed to submit quiz')
//       setQuizSubmitted(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading course...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!course) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
//           <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 flex">
//       {/* Sidebar */}
//       <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden flex flex-col`}>
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <Button variant="ghost" size="sm" onClick={() => navigate('/courses')}>
//               <ArrowLeft size={16} className="mr-2" />
//               Back to Courses
//             </Button>
//             <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>×</Button>
//           </div>

//           <div className="mb-4">
//             <h1 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h1>
//             <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
//               <span>by {course.instructorName}</span>
//               <Badge variant="info" size="sm">{course.level}</Badge>
//             </div>

//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Progress</span>
//                 <span className="font-medium">{getCourseProgress()}%</span>
//               </div>
//               <Progress value={getCourseProgress()} size="sm" />
//               <div className="text-xs text-gray-500">
//                 {completedChapterIds.length} of {chapters.length} chapters completed
//               </div>
//             </div>
//           </div>
//         </div>

     
//         <div className="flex-1 overflow-y-auto">
//           <div className="p-4 space-y-2">
//             <div className="border border-gray-200 rounded-lg">
//               <button
//                 onClick={() => setExpanded((x) => !x)}
//                 className="w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
//               >
//                 <div className="flex-1">
//                   <h3 className="font-medium text-gray-900">Course Content</h3>
//                   <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
//                     <span>{chapters.length} chapters</span>
//                     <span>{getCourseProgress()}% complete</span>
//                   </div>
//                 </div>
//                 {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//               </button>

//               {expanded && (
//                 <div className="border-t border-gray-200">
//                   {chapters.map((chapter) => (
//                     <button
//                       key={chapter.id}
//                       onClick={() => setCurrentChapter(chapter)}
//                       className={`w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
//                         currentChapter?.id === chapter.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''
//                       }`}
//                     >
//                       <div className="flex-shrink-0">
//                         {isChapterCompleted(chapter.id) ? (
//                           <CheckCircle size={16} className="text-green-500" />
//                         ) : (
//                           <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h4 className="text-sm font-medium text-gray-900 truncate">
//                           {chapter.title} {chapter.hasQuiz ? '(Quiz)' : ''}
//                         </h4>
//                         <div className="flex items-center space-x-2 text-xs text-gray-500">
//                           <Clock size={12} />
//                           <span>{chapter.duration}</span>
//                           <span>•</span>
//                           <span>{chapter.type}</span>
//                         </div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

    
//       <div className="flex-1 flex flex-col">

//         <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
//           {!sidebarOpen && (
//             <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
//               <BookOpen size={16} className="mr-2" />
//               Course Content
//             </Button>
//           )}

//           {currentChapter && (
//             <div className="flex-1 text-center">
//               <h2 className="text-lg font-semibold text-gray-900">{currentChapter.title}</h2>
//               <p className="text-sm text-gray-600">{course.title}</p>
//             </div>
//           )}

//           <div className="w-16" />
//         </div>

//         {/* Content */}
//         <div className="flex-1 bg-white">
//           {!currentChapter ? (
//             <div className="h-full flex items-center justify-center text-gray-600">
//               <div className="text-center">
//                 <BookOpen size={64} className="mx-auto mb-4 opacity-50" />
//                 <h3 className="text-xl font-semibold mb-2">Select a chapter to begin</h3>
//                 <p className="text-gray-500">Choose a chapter from the sidebar to start learning</p>
//               </div>
//             </div>
//           ) : currentChapter.hasQuiz ? (
//             <div className="max-w-3xl mx-auto p-6">
//               <h3 className="text-2xl font-bold mb-4">{currentChapter.title} — Quiz</h3>

//               {quizLoading && <p className="text-gray-600">Loading quiz…</p>}

//               {!quizLoading && !quiz && (
//                 <p className="text-gray-600">No quiz available for this chapter.</p>
//               )}

//               {!quizLoading && quiz && (
//                 <>
//                   <p className="text-gray-700 mb-4">{quiz.title}</p>

//                   <div className="space-y-6">
//                     {quiz.questions.map((q, idx) => (
//                       <QuestionBlock
//                         key={q.id}
//                         index={idx}
//                         q={q}
//                         value={quizAnswers[q.id]}
//                         onChange={(val) => handleAnswerChange(q.id, val)}
//                         disabled={quizSubmitted}
//                       />
//                     ))}
//                   </div>

//                   <div className="mt-8 flex items-center justify-between">
//                     {!quizSubmitted ? (
//                       <Button onClick={submitQuiz}>Submit Quiz</Button>
//                     ) : (
//                       <div className="text-green-700 font-medium">
//                         Submitted{quizScore ? ` • Score: ${quizScore.score}/${quizScore.max}` : ''}
//                       </div>
//                     )}

//                     {!isChapterCompleted(currentChapter.id) && (
//                       <Button variant="outline" onClick={markChapterComplete}>
//                         Mark Chapter Complete
//                       </Button>
//                     )}
//                   </div>
//                 </>
//               )}
//             </div>
//           ) : (
//             <div className="max-w-3xl mx-auto p-6">
//               <h3 className="text-2xl font-bold mb-4">{currentChapter.title}</h3>
//               <div className="prose max-w-none">
//                 <p className="whitespace-pre-line">{currentChapter.content || 'Chapter content goes here.'}</p>
//               </div>

//               {!isChapterCompleted(currentChapter.id) && (
//                 <div className="mt-8">
//                   <Button onClick={markChapterComplete}>
//                     <CheckCircle size={16} className="mr-2" />
//                     Mark as Complete
//                   </Button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// function QuestionBlock({ index, q, value, onChange, disabled }) {
//   const isMulti =
//     Array.isArray(q.correctOptionIndexes) && q.correctOptionIndexes.length > 0
//   const isSingle =
//     typeof q.correctOptionIndex === 'number' && q.options?.length

//   if (isSingle) {
//     return (
//       <div className="border rounded-lg p-4">
//         <div className="font-medium mb-3">
//           Q{index + 1}. {q.prompt}
//         </div>
//         <div className="space-y-2">
//           {q.options.map((opt, i) => (
//             <label key={i} className="flex items-center space-x-2">
//               <input
//                 type="radio"
//                 name={`q_${q.id}`}
//                 disabled={disabled}
//                 checked={Number(value) === i}
//                 onChange={() => onChange(i)}
//               />
//               <span>{opt}</span>
//             </label>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   if (isMulti) {
//     const arr = Array.isArray(value) ? value.map(Number) : []
//     const toggle = (i) => {
//       if (arr.includes(i)) onChange(arr.filter((x) => x !== i))
//       else onChange([...arr, i])
//     }
//     return (
//       <div className="border rounded-lg p-4">
//         <div className="font-medium mb-3">
//           Q{index + 1}. {q.prompt} <span className="text-xs text-gray-500">(Select all that apply)</span>
//         </div>
//         <div className="space-y-2">
//           {q.options.map((opt, i) => (
//             <label key={i} className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 disabled={disabled}
//                 checked={arr.includes(i)}
//                 onChange={() => toggle(i)}
//               />
//               <span>{opt}</span>
//             </label>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   // subjective or other
//   return (
//     <div className="border rounded-lg p-4">
//       <div className="font-medium mb-3">
//         Q{index + 1}. {q.prompt}
//       </div>
//       <textarea
//         rows={4}
//         className="w-full border rounded-lg p-2"
//         value={String(value || '')}
//         onChange={(e) => onChange(e.target.value)}
//         disabled={disabled}
//         placeholder="Type your answer…"
//       />
//     </div>
//   )
// }

// export default CourseViewerPage

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle,
  BookOpen,
  Clock,
  ChevronRight,
  ChevronDown,
  FileText, // ADDED: Icon for the PDF button
} from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import useAuthStore from '../store/useAuthStore'
import Button from '../components/ui/Button'
import Progress from '../components/ui/Progress'
import Badge from '../components/ui/Badge'
import { coursesAPI, chaptersAPI, FALLBACK_THUMB } from '../services/api'


const makeHeaders = () => {
  const token = useAuthStore.getState().token
  const h = { 'Content-Type': 'application/json' }
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

const CourseViewerPage = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [chapters, setChapters] = useState([])
  const [currentChapter, setCurrentChapter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expanded, setExpanded] = useState(true)
  const [completedChapterIds, setCompletedChapterIds] = useState([])

  const [quizLoading, setQuizLoading] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(null)

  useEffect(() => {
    fetchData()
  }, [courseId])

  async function fetchData() {
    setLoading(true)
    try {
      // 1) Course
      const courseRes = await coursesAPI.get(courseId)
      
      const c = courseRes.data
      setCourse({
        id: c.id,
        title: c.title,
        level: 'beginner',
        instructorName: (c.instructorNames && c.instructorNames[0]) || 'Instructor',
        thumbnail: c.thumbnail || FALLBACK_THUMB,
        status: c.status,
      })

      // 2) Chapters
      const chRes = await chaptersAPI.listByCourse(courseId)
      const list = Array.isArray(chRes.data) ? chRes.data : []
console.log('API Response for Chapters:', chRes.data);
      const mappedChapters = list
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((ch) => ({
          id: ch.id,
          title: ch.title,
          duration: ch?.settings?.estimatedMinutes ? `${ch.settings.estimatedMinutes} min` : '—',
          type: Array.isArray(ch.assessments) && ch.assessments.length > 0 ? 'quiz' : 'text',
          content: ch.content || ch.description || '',
          attachments: ch.attachments || [], // ADDED: Gets the attachments array
          order: ch.order || 0,
          hasQuiz: Array.isArray(ch.assessments) && ch.assessments.length > 0,
        }))

      setChapters(mappedChapters)
      if (mappedChapters.length) {
        setCurrentChapter(mappedChapters[0])
      }
    } catch (err) {
      console.error('Course load failed:', err)
      toast.error('Failed to load course')
      navigate('/courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!currentChapter?.hasQuiz) {
      setQuiz(null)
      return
    }
    loadQuizForChapter(currentChapter.id)
  }, [currentChapter?.id, currentChapter?.hasQuiz])

  async function loadQuizForChapter(chapterId) {
    setQuizLoading(true)
    setQuiz(null)
    setQuizAnswers({})
    setQuizSubmitted(false)
    setQuizScore(null)
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const listRes = await axios.get(`${API_BASE}/api/assessments`, {
        headers: makeHeaders(),
        params: { chapterId },
      })
      const assessments = Array.isArray(listRes.data) ? listRes.data : []
      if (!assessments.length) {
        setQuiz(null)
        return
      }
      const first = assessments[0]

      let full = first
      if (!first.questions) {
        const fullRes = await axios.get(`${API_BASE}/api/assessments/${first.id}`, { headers: makeHeaders() })
        full = fullRes.data
      }

      const questions = (full.questions || []).sort((a, b) => (a.order || 0) - (b.order || 0))
      setQuiz({
        id: full.id,
        title: full.title || 'Quiz',
        questions: questions.map((q) => ({
          id: q.id,
          prompt: q.prompt,
          type: String(q.type || '').toLowerCase(),
          options: Array.isArray(q.options) ? q.options : [],
          correctOptionIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : null,
          correctOptionIndexes: Array.isArray(q.correctOptionIndexes) ? q.correctOptionIndexes : null,
          points: q.points ?? 1,
          order: q.order ?? 1,
        })),
      })
    } catch (e) {
      console.error('Load quiz failed:', e)
      toast.error('Failed to load quiz')
      setQuiz(null)
    } finally {
      setQuizLoading(false)
    }
  }

  const getCourseProgress = () => {
    if (!chapters.length) return 0
    const completed = chapters.filter((ch) => completedChapterIds.includes(ch.id)).length
    return Math.round((completed / chapters.length) * 100)
  }

  const isChapterCompleted = (id) => completedChapterIds.includes(id)

  const markChapterComplete = () => {
    if (!currentChapter) return
    if (!isChapterCompleted(currentChapter.id)) {
      setCompletedChapterIds((prev) => [...prev, currentChapter.id])
      toast.success('Chapter completed!')
      const idx = chapters.findIndex((c) => c.id === currentChapter.id)
      if (idx >= 0 && idx < chapters.length - 1) {
        setCurrentChapter(chapters[idx + 1])
      }
    }
  }

  const handleAnswerChange = (qid, value) => {
    setQuizAnswers((prev) => ({ ...prev, [qid]: value }))
  }

  function scoreLocally(quiz, answers) {
    let score = 0
    let max = 0
    for (const q of quiz.questions) {
      const pts = q.points ?? 1
      max += pts
      const ans = answers[q.id]
      if (typeof q.correctOptionIndex === 'number') {
        if (Number(ans) === q.correctOptionIndex) score += pts
        continue
      }
      if (Array.isArray(q.correctOptionIndexes)) {
        const normalized = Array.isArray(ans) ? ans.map(Number).sort() : []
        const correct = [...q.correctOptionIndexes].sort()
        if (normalized.length === correct.length && normalized.every((v, i) => v === correct[i])) {
          score += pts
        }
        continue
      }
    }
    return { score, max }
  }

  const submitQuiz = async () => {
    if (!quiz) return
    try {
      setQuizSubmitted(true)
      const { score, max } = scoreLocally(quiz, quizAnswers)
      setQuizScore({ score, max })
      toast.success('Quiz submitted!')
      markChapterComplete()
    } catch (e) {
      console.error(e)
      toast.error('Failed to submit quiz')
      setQuizSubmitted(false)
    }
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
          <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
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
            <Button variant="ghost" size="sm" onClick={() => navigate('/courses')}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Courses
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>×</Button>
          </div>
          <div className="mb-4">
            <h1 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
              <span>by {course.instructorName}</span>
              <Badge variant="info" size="sm">{course.level}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{getCourseProgress()}%</span>
              </div>
              <Progress value={getCourseProgress()} size="sm" />
              <div className="text-xs text-gray-500">
                {completedChapterIds.length} of {chapters.length} chapters completed
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setExpanded((x) => !x)}
                className="w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Course Content</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>{chapters.length} chapters</span>
                    <span>{getCourseProgress()}% complete</span>
                  </div>
                </div>
                {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {expanded && (
                <div className="border-t border-gray-200">
                  {chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => setCurrentChapter(chapter)}
                      className={`w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 ${currentChapter?.id === chapter.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''}`}
                    >
                      <div className="flex-shrink-0">
                        {isChapterCompleted(chapter.id) ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {chapter.title} {chapter.hasQuiz ? '(Quiz)' : ''}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{chapter.duration}</span>
                          <span>•</span>
                          <span>{chapter.type}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          {!sidebarOpen && (
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
              <BookOpen size={16} className="mr-2" />
              Course Content
            </Button>
          )}
          {currentChapter && (
            <div className="flex-1 text-center">
              <h2 className="text-lg font-semibold text-gray-900">{currentChapter.title}</h2>
              <p className="text-sm text-gray-600">{course.title}</p>
            </div>
          )}
          <div className="w-16" />
        </div>
        <div className="flex-1 bg-white">
          {!currentChapter ? (
            <div className="h-full flex items-center justify-center text-gray-600">
              <div className="text-center">
                <BookOpen size={64} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Select a chapter to begin</h3>
                <p className="text-gray-500">Choose a chapter from the sidebar to start learning</p>
              </div>
            </div>
          ) : currentChapter.hasQuiz ? (
            <div className="max-w-3xl mx-auto p-6">
              <h3 className="text-2xl font-bold mb-4">{currentChapter.title} — Quiz</h3>
              {quizLoading && <p className="text-gray-600">Loading quiz…</p>}
              {!quizLoading && !quiz && (<p className="text-gray-600">No quiz available for this chapter.</p>)}
              {!quizLoading && quiz && (
                <>
                  <p className="text-gray-700 mb-4">{quiz.title}</p>
                  <div className="space-y-6">
                    {quiz.questions.map((q, idx) => (
                      <QuestionBlock
                        key={q.id}
                        index={idx}
                        q={q}
                        value={quizAnswers[q.id]}
                        onChange={(val) => handleAnswerChange(q.id, val)}
                        disabled={quizSubmitted}
                      />
                    ))}
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    {!quizSubmitted ? (
                      <Button onClick={submitQuiz}>Submit Quiz</Button>
                    ) : (
                      <div className="text-green-700 font-medium">
                        Submitted{quizScore ? ` • Score: ${quizScore.score}/${quizScore.max}` : ''}
                      </div>
                    )}
                    {!isChapterCompleted(currentChapter.id) && (
                      <Button variant="outline" onClick={markChapterComplete}>
                        Mark Chapter Complete
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-6">
              <h3 className="text-2xl font-bold mb-4">{currentChapter.title}</h3>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{currentChapter.content || 'Chapter content goes here.'}</p>
              </div>
              {/* ADDED: This block renders the PDF attachment link */}
              {currentChapter.attachments && currentChapter.attachments.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h4 className="text-lg font-semibold mb-3">Attachments</h4>
                  <div className="space-y-3">
                    {currentChapter.attachments.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FileText size={16} className="mr-2" />
                        View PDF Attachment {currentChapter.attachments.length > 1 ? index + 1 : ''}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {!isChapterCompleted(currentChapter.id) && (
                <div className="mt-8">
                  <Button onClick={markChapterComplete}>
                    <CheckCircle size={16} className="mr-2" />
                    Mark as Complete
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function QuestionBlock({ index, q, value, onChange, disabled }) {
  const isMulti = Array.isArray(q.correctOptionIndexes) && q.correctOptionIndexes.length > 0
  const isSingle = typeof q.correctOptionIndex === 'number' && q.options?.length

  if (isSingle) {
    return (
      <div className="border rounded-lg p-4">
        <div className="font-medium mb-3">
          Q{index + 1}. {q.prompt}
        </div>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <label key={i} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`q_${q.id}`}
                disabled={disabled}
                checked={Number(value) === i}
                onChange={() => onChange(i)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  if (isMulti) {
    const arr = Array.isArray(value) ? value.map(Number) : []
    const toggle = (i) => {
      if (arr.includes(i)) onChange(arr.filter((x) => x !== i))
      else onChange([...arr, i])
    }
    return (
      <div className="border rounded-lg p-4">
        <div className="font-medium mb-3">
          Q{index + 1}. {q.prompt} <span className="text-xs text-gray-500">(Select all that apply)</span>
        </div>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <label key={i} className="flex items-center space-x-2">
              <input
                type="checkbox"
                disabled={disabled}
                checked={arr.includes(i)}
                onChange={() => toggle(i)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  // subjective or other
  return (
    <div className="border rounded-lg p-4">
      <div className="font-medium mb-3">
        Q{index + 1}. {q.prompt}
      </div>
      <textarea
        rows={4}
        className="w-full border rounded-lg p-2"
        value={String(value || '')}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type your answer…"
      />
    </div>
  )
}

export default CourseViewerPage

