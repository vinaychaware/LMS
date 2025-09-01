// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   BookOpen,
//   Play,
//   CheckCircle,
//   Lock,
//   Clock,
//   FileText,
//   Download,
//   ArrowLeft,
//   ArrowRight,
//   BarChart3,
//   Award,
//   Brain,
//   PlayCircle,
//   Pause,
//   Volume2,
//   VolumeX,
//   Maximize,
//   Settings,
// } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { mockAPI, mockData } from "../services/mockData";
// import useAuthStore from "../store/useAuthStore";
// import Button from "../components/ui/Button";
// import Card from "../components/ui/Card";
// import Badge from "../components/ui/Badge";
// import Progress from "../components/ui/Progress";
// import Modal from "../components/ui/Modal";

// const CourseViewerPage = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuthStore();
//   const { userRole } = useAuthStore();

//   const [course, setCourse] = useState(null);
//   const [modules, setModules] = useState([]);
//   const [currentModule, setCurrentModule] = useState(null);
//   const [currentChapter, setCurrentChapter] = useState(null);
//   const [chapters, setChapters] = useState([]);
//   const [studentProgress, setStudentProgress] = useState(null);
//   const [availableTests, setAvailableTests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showTestModal, setShowTestModal] = useState(false);
//   const [selectedTest, setSelectedTest] = useState(null);
//   const [videoProgress, setVideoProgress] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);

//   useEffect(() => {
//     fetchCourseData();
//   }, [courseId]);

//   const handleClick = () => {
//     if (userRole === "student") {
//       navigate("/dashboard");
//     } else if (userRole === "instructor") {
//       navigate("/instructor");
//     } else if (userRole === "admin") {
//       navigate("/admin");
//     } else {
//       navigate("/"); // fallback
//     }
//   };

//   const fetchCourseData = async () => {
//     try {
//       setLoading(true);

//       // Get course details
//       const courseData = mockData.courses.find((c) => c.id === courseId);
//       if (!courseData) {
//         toast.error("Course not found");
//         navigate("/dashboard");
//         return;
//       }
//       setCourse(courseData);

//       // Get course modules
//       const moduleData = await mockAPI.getCourseModules(courseId);
//       setModules(moduleData);

//       // Get student progress
//       const progress = await mockAPI.getStudentProgress(user.id, courseId);
//       setStudentProgress(progress);

//       // Set current module and chapter based on progress
//       if (progress && moduleData.length > 0) {
//         const currentMod =
//           moduleData.find((m) => m.id === progress.currentModule) ||
//           moduleData[0];
//         setCurrentModule(currentMod);

//         const chapterData = await mockAPI.getModuleChapters(currentMod.id);
//         setChapters(chapterData);

//         const currentChap =
//           chapterData.find((c) => c.id === progress.currentChapter) ||
//           chapterData[0];
//         setCurrentChapter(currentChap);
//       }

//       // Check for available tests
//       const tests = [];
//       for (const module of moduleData) {
//         const isEligible = mockAPI.checkModuleTestEligibility(
//           user.id,
//           module.id
//         );
//         const hasCompleted = progress?.moduleTestResults[module.id]?.passed;

//         if (isEligible && !hasCompleted) {
//           const test = await mockAPI.getModuleTest(module.id);
//           if (test) {
//             tests.push({ ...test, moduleTitle: module.title, type: "module" });
//           }
//         }
//       }

//       // Check course test
//       const courseTestEligible = mockAPI.checkCourseTestEligibility(
//         user.id,
//         courseId
//       );
//       if (courseTestEligible && !progress?.courseTestResult?.passed) {
//         const courseTest = await mockAPI.getCourseTest(courseId);
//         if (courseTest) {
//           tests.push({ ...courseTest, type: "course" });
//         }
//       }

//       setAvailableTests(tests);
//     } catch (error) {
//       console.error("Error fetching course data:", error);
//       toast.error("Failed to load course data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectModule = async (module) => {
//     setCurrentModule(module);
//     const chapterData = await mockAPI.getModuleChapters(module.id);
//     setChapters(chapterData);

//     // Set first chapter as current
//     if (chapterData.length > 0) {
//       setCurrentChapter(chapterData[0]);
//     }
//   };

//   const selectChapter = (chapter) => {
//     setCurrentChapter(chapter);
//     setVideoProgress(0);
//     setIsPlaying(false);
//   };

//   // const completeChapter = async () => {
//   //   if (!currentChapter || !currentModule) return

//   //   try {
//   //     await mockAPI.updateChapterProgress(user.id, courseId, currentModule.id, currentChapter.id)
//   //     await fetchCourseData() // Refresh progress
//   //     toast.success('Chapter completed!')

//   //     // Auto-advance to next chapter
//   //     const nextChapterIndex = chapters.findIndex(c => c.id === currentChapter.id) + 1
//   //     if (nextChapterIndex < chapters.length) {
//   //       setCurrentChapter(chapters[nextChapterIndex])
//   //     }
//   //   } catch (error) {
//   //     toast.error('Failed to complete chapter')
//   //   }
//   // }

//   const completeChapter = async () => {
//     if (!currentChapter || !currentModule || !user?.id) return;

//     try {
//       // Compute next chapter before async work
//       const currIdx = chapters.findIndex(
//         (c) => String(c.id) === String(currentChapter.id)
//       );
//       const hasNext = currIdx > -1 && currIdx < chapters.length - 1;
//       const nextChap = hasNext ? chapters[currIdx + 1] : null;

//       // Optimistic local update so UI reacts immediately
//       setStudentProgress((prev) => {
//         if (!prev) return prev;
//         const done = new Set(prev.completedChapters.map(String));
//         done.add(String(currentChapter.id));
//         return {
//           ...prev,
//           completedChapters: Array.from(done),
//           overallProgress: Math.min(100, (prev.overallProgress ?? 0) + 1), // or recompute properly
//         };
//       });

//       toast.success("Chapter completed!");

//       // Move to next chapter right away if exists
//       if (nextChap) setCurrentChapter(nextChap);

//       // Persist on backend and refresh canonical data
//       await mockAPI.updateChapterProgress(
//         user.id,
//         courseId,
//         currentModule.id,
//         currentChapter.id
//       );
//       await fetchCourseData();
//     } catch (e) {
//       toast.error("Failed to complete chapter");
//     }
//   };

//   const startTest = (test) => {
//     setSelectedTest(test);
//     setShowTestModal(true);
//   };

//   const submitTest = async (answers) => {
//     try {
//       let result;
//       if (selectedTest.type === "module") {
//         result = await mockAPI.submitModuleTest(
//           user.id,
//           selectedTest.id,
//           answers
//         );
//       } else {
//         result = await mockAPI.submitCourseTest(
//           user.id,
//           selectedTest.id,
//           answers
//         );
//       }

//       setShowTestModal(false);
//       setSelectedTest(null);

//       if (result.passed) {
//         toast.success(`Test passed with ${result.score}%!`);
//         if (selectedTest.type === "course") {
//           toast.success("🎉 Course completed! AI Interview unlocked!");
//         }
//       } else {
//         toast.error(`Test failed. Score: ${result.score}%. You can retake it.`);
//       }

//       await fetchCourseData();
//     } catch (error) {
//       toast.error("Failed to submit test");
//     }
//   };

//   // const isChapterUnlocked = (chapter) => {
//   //   if (!studentProgress) return false

//   //   const chapterIndex = chapters.findIndex(c => c.id === chapter.id)
//   //   if (chapterIndex === 0) return true // First chapter is always unlocked

//   //   // Check if previous chapter is completed
//   //   const previousChapter = chapters[chapterIndex - 1]
//   //   return studentProgress.completedChapters.includes(previousChapter.id)
//   // }

//   const isChapterUnlocked = (chapter) => {
//     if (!studentProgress) return false;
//     const idx = chapters.findIndex((c) => String(c.id) === String(chapter.id));
//     if (idx === -1) return false;
//     if (idx === 0) return true;
//     const prev = chapters[idx - 1];
//     return studentProgress.completedChapters
//       ?.map(String)
//       ?.includes(String(prev.id));
//   };



//   const isModuleTestUnlocked = (moduleId) => {
//     return mockAPI.checkModuleTestEligibility(user.id, moduleId);
//   };

//   const isCourseTestUnlocked = () => {
//     return mockAPI.checkCourseTestEligibility(user.id, courseId);
//   };

//   const isAIInterviewUnlocked = () => {
//     return mockAPI.checkAIInterviewEligibility(user.id, courseId);
//   };

//   {
//     isCompleted(currentChapter.id) ? (
//       <Badge variant="success" size="sm">
//         Completed
//       </Badge>
//     ) : null;
//   }

//   const isChapterCompleted = (chapterId) =>
//     studentProgress?.completedChapters?.some(
//       (cId) => String(cId) === String(chapterId)
//     );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading course...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">
//             Course not found
//           </h2>
//           <Button onClick={() => navigate("/dashboard")}>
//             Return to Dashboard
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex items-center space-x-4 mb-4">
//             <Button variant="outline" onClick={handleClick}>
//               <ArrowLeft size={16} className="mr-2" />
//               Back to Dashboard
//             </Button>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {course.title}
//               </h1>
//               <p className="text-gray-600">by {course.instructor.name}</p>
//             </div>
//           </div>

//           {studentProgress && (
//             <div className="bg-white rounded-lg p-4 border border-gray-200">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm font-medium text-gray-700">
//                   Course Progress
//                 </span>
//                 <span className="text-sm text-gray-600">
//                   {studentProgress.overallProgress}%
//                 </span>
//               </div>
//               <Progress value={studentProgress.overallProgress} size="md" />
//             </div>
//           )}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Course Navigation Sidebar */}
//           <div className="lg:col-span-1">
//             <Card>
//               <Card.Header>
//                 <Card.Title>Course Content</Card.Title>
//               </Card.Header>
//               <Card.Content className="p-0">
//                 <div className="space-y-2">
//                   {modules.map((module, moduleIndex) => {
//                     const isModuleCompleted =
//                       studentProgress?.completedModules.includes(module.id);
//                     const moduleTestResult =
//                       studentProgress?.moduleTestResults[module.id];

//                     return (
//                       <div
//                         key={module.id}
//                         className="border-b border-gray-100 last:border-b-0"
//                       >
//                         <button
//                           onClick={() => selectModule(module)}
//                           className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
//                             currentModule?.id === module.id
//                               ? "bg-primary-50 border-r-2 border-primary-500"
//                               : ""
//                           }`}
//                         >
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-3">
//                               <div
//                                 className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                                   isModuleCompleted
//                                     ? "bg-green-100 text-green-600"
//                                     : "bg-gray-100 text-gray-600"
//                                 }`}
//                               >
//                                 {isModuleCompleted ? (
//                                   <CheckCircle size={16} />
//                                 ) : (
//                                   <span className="text-sm font-medium">
//                                     {moduleIndex + 1}
//                                   </span>
//                                 )}
//                               </div>
//                               <div>
//                                 <h4 className="text-sm font-medium text-gray-900">
//                                   {module.title}
//                                 </h4>
//                                 <p className="text-xs text-gray-500">
//                                   {module.totalChapters} chapters
//                                 </p>
//                               </div>
//                             </div>
//                             {moduleTestResult && (
//                               <Badge
//                                 variant={
//                                   moduleTestResult.passed ? "success" : "danger"
//                                 }
//                                 size="sm"
//                               >
//                                 {moduleTestResult.score}%
//                               </Badge>
//                             )}
//                           </div>
//                         </button>

//                         {currentModule?.id === module.id && (
//                           <div className="bg-gray-50">
//                             {chapters.map((chapter, chapterIndex) => {
//                               const isCompleted =
//                                 studentProgress?.completedChapters.includes(
//                                   chapter.id
//                                 );
//                               const isUnlocked = isChapterUnlocked(chapter);

//                               return (
//                                 <button
//                                   key={chapter.id}
//                                   onClick={() =>
//                                     isUnlocked
//                                       ? selectChapter(chapter)
//                                       : toast.error(
//                                           "Complete previous chapter first"
//                                         )
//                                   }
//                                   disabled={!isUnlocked}
//                                   className={`w-full text-left p-3 pl-12 hover:bg-gray-100 transition-colors ${
//                                     currentChapter?.id === chapter.id
//                                       ? "bg-primary-100"
//                                       : ""
//                                   } ${
//                                     !isUnlocked
//                                       ? "opacity-50 cursor-not-allowed"
//                                       : ""
//                                   }`}
//                                 >
//                                   <div className="flex items-center justify-between">
//                                     <div className="flex items-center space-x-2">
//                                       {isCompleted ? (
//                                         <CheckCircle
//                                           size={14}
//                                           className="text-green-600"
//                                         />
//                                       ) : isUnlocked ? (
//                                         <PlayCircle
//                                           size={14}
//                                           className="text-primary-600"
//                                         />
//                                       ) : (
//                                         <Lock
//                                           size={14}
//                                           className="text-gray-400"
//                                         />
//                                       )}
//                                       <span className="text-sm text-gray-900">
//                                         {chapter.title}
//                                       </span>
//                                     </div>
//                                     <span className="text-xs text-gray-500">
//                                       {chapter.estimatedDuration}
//                                     </span>
//                                   </div>
//                                 </button>
//                               );
//                             })}

//                             {/* Module Test */}
//                             {isModuleTestUnlocked(module.id) &&
//                               !moduleTestResult?.passed && (
//                                 <div className="p-3 pl-12 bg-blue-50 border-t border-blue-200">
//                                   <Button
//                                     size="sm"
//                                     className="w-full"
//                                     onClick={() => {
//                                       const test = availableTests.find(
//                                         (t) => t.moduleId === module.id
//                                       );
//                                       if (test) startTest(test);
//                                     }}
//                                   >
//                                     <FileText size={14} className="mr-2" />
//                                     Take Module Test
//                                   </Button>
//                                 </div>
//                               )}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}

//                   {/* Course Test */}
//                   {isCourseTestUnlocked() &&
//                     !studentProgress?.courseTestResult?.passed && (
//                       <div className="p-4 bg-yellow-50 border-t border-yellow-200">
//                         <Button
//                           className="w-full"
//                           onClick={() => {
//                             const courseTest = availableTests.find(
//                               (t) => t.type === "course"
//                             );
//                             if (courseTest) startTest(courseTest);
//                           }}
//                         >
//                           <Award size={16} className="mr-2" />
//                           Take Final Test
//                         </Button>
//                       </div>
//                     )}

//                   {/* AI Interview */}
//                   {isAIInterviewUnlocked() &&
//                     !studentProgress?.aiInterviewResult && (
//                       <div className="p-4 bg-purple-50 border-t border-purple-200">
//                         <Button
//                           className="w-full"
//                           onClick={() =>
//                             toast("AI Interview portal coming soon!")
//                           }
//                         >
//                           <Brain size={16} className="mr-2" />
//                           AI Interview
//                         </Button>
//                       </div>
//                     )}
//                 </div>
//               </Card.Content>
//             </Card>
//           </div>

//           {/* Main Content Area */}
//           <div className="lg:col-span-3">
//             {currentChapter ? (
//               <Card>
//                 <Card.Header className="flex items-center justify-between">
//                   <div>
//                     <Card.Title>{currentChapter.title}</Card.Title>
//                     <p className="text-sm text-gray-600 mt-1">
//                       {currentChapter.description}
//                     </p>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Badge variant="info" size="sm">
//                       {currentChapter.estimatedDuration}
//                     </Badge>
//                     {studentProgress?.completedChapters.includes(
//                       currentChapter.id
//                     ) && (
//                       <Badge variant="success" size="sm">
//                         Completed
//                       </Badge>
//                     )}
//                   </div>
//                 </Card.Header>
//                 <Card.Content>
//                   {/* Video Player */}
//                   {currentChapter.videoUrl && (
//                     <div className="mb-6">
//                       <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
//                         <div className="absolute inset-0 flex items-center justify-center">
//                           <div className="text-center text-white">
//                             <PlayCircle
//                               size={64}
//                               className="mx-auto mb-4 opacity-80"
//                             />
//                             <p className="text-lg font-medium">Video Player</p>
//                             <p className="text-sm opacity-80">
//                               Click to play: {currentChapter.title}
//                             </p>
//                           </div>
//                         </div>

//                         {/* Video Controls */}
//                         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
//                           <div className="flex items-center space-x-4">
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               onClick={() => setIsPlaying(!isPlaying)}
//                               className="text-white hover:bg-white/20"
//                             >
//                               {isPlaying ? (
//                                 <Pause size={16} />
//                               ) : (
//                                 <Play size={16} />
//                               )}
//                             </Button>
//                             <div className="flex-1">
//                               <Progress
//                                 value={videoProgress}
//                                 size="sm"
//                                 className="bg-white/20"
//                               />
//                             </div>
//                             <span className="text-white text-sm">
//                               {Math.floor(
//                                 (videoProgress *
//                                   currentChapter.estimatedDuration) /
//                                   100
//                               )}{" "}
//                               / {currentChapter.estimatedDuration} min
//                             </span>
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               className="text-white hover:bg-white/20"
//                             >
//                               <Settings size={16} />
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Chapter Content */}
//                   <div className="prose max-w-none mb-6">
//                     <div className="bg-gray-50 rounded-lg p-6">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                         Chapter Content
//                       </h3>
//                       <p className="text-gray-700 leading-relaxed">
//                         {currentChapter.content}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Resources */}
//                   {currentChapter.resources &&
//                     currentChapter.resources.length > 0 && (
//                       <div className="mb-6">
//                         <h4 className="text-md font-semibold text-gray-900 mb-3">
//                           Additional Resources
//                         </h4>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                           {currentChapter.resources.map((resource, index) => (
//                             <div
//                               key={index}
//                               className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
//                             >
//                               <Download size={16} className="text-gray-600" />
//                               <div>
//                                 <p className="text-sm font-medium text-gray-900">
//                                   {resource.title}
//                                 </p>
//                                 <p className="text-xs text-gray-500">
//                                   {resource.type.toUpperCase()}
//                                 </p>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                   {/* Chapter Actions */}
//                   <div className="flex items-center justify-between pt-6 border-t border-gray-200">
//                     <div className="flex space-x-2">
//                       {chapters.findIndex((c) => c.id === currentChapter.id) >
//                         0 && (
//                         <Button
//                           variant="outline"
//                           onClick={() => {
//                             const prevIndex =
//                               chapters.findIndex(
//                                 (c) => c.id === currentChapter.id
//                               ) - 1;
//                             selectChapter(chapters[prevIndex]);
//                           }}
//                         >
//                           <ArrowLeft size={16} className="mr-2" />
//                           Previous
//                         </Button>
//                       )}
//                     </div>

//                     <div className="flex space-x-2">
//                       {!isChapterCompleted(currentChapter.id) && (
//                         <Button onClick={completeChapter}>
//                           <CheckCircle size={16} className="mr-2" />
//                           Mark Complete
//                         </Button>
//                       )}

//                       {chapters.findIndex((c) => c.id === currentChapter.id) <
//                         chapters.length - 1 && (
//                         <Button
//                           variant="outline"
//                           onClick={() => {
//                             const nextIndex =
//                               chapters.findIndex(
//                                 (c) => c.id === currentChapter.id
//                               ) + 1;
//                             const nextChapter = chapters[nextIndex];
//                             if (isChapterUnlocked(nextChapter)) {
//                               selectChapter(nextChapter);
//                             } else {
//                               toast.error("Complete current chapter first");
//                             }
//                           }}
//                         >
//                           Next
//                           <ArrowRight size={16} className="ml-2" />
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </Card.Content>
//               </Card>
//             ) : (
//               <Card>
//                 <Card.Content className="text-center py-12">
//                   <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">
//                     Select a module to start learning
//                   </h3>
//                   <p className="text-gray-600">
//                     Choose a module from the sidebar to begin your learning
//                     journey.
//                   </p>
//                 </Card.Content>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Test Modal */}
//       <Modal
//         isOpen={showTestModal}
//         onClose={() => setShowTestModal(false)}
//         title={selectedTest?.title}
//         size="lg"
//       >
//         {selectedTest && (
//           <div className="space-y-6">
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <div className="flex items-center space-x-2 mb-2">
//                 <FileText size={16} className="text-blue-600" />
//                 <span className="font-medium text-blue-800">
//                   Test Instructions
//                 </span>
//               </div>
//               <ul className="text-sm text-blue-700 space-y-1">
//                 <li>• Duration: {selectedTest.duration} minutes</li>
//                 <li>• Questions: {selectedTest.questions}</li>
//                 <li>• Passing Score: {selectedTest.passingScore}%</li>
//                 <li>• Attempts Allowed: {selectedTest.maxAttempts}</li>
//                 <li>• You cannot pause once started</li>
//               </ul>
//             </div>

//             <div className="text-center">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 Ready to begin?
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 Make sure you have enough time and a stable internet connection.
//               </p>
//               <div className="flex space-x-3 justify-center">
//                 <Button
//                   variant="outline"
//                   onClick={() => setShowTestModal(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     toast.success("Starting test...");
//                     setTimeout(() => {
//                       const mockAnswers = [];
//                       submitTest(mockAnswers);
//                     }, 3000);
//                   }}
//                 >
//                   <Play size={16} className="mr-2" />
//                   Start Test
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default CourseViewerPage;

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Play,
  CheckCircle,
  Lock,
  FileText,
  Download,
  ArrowLeft,
  ArrowRight,
  Award,
  Brain,
  PlayCircle,
  Pause,
  Settings,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { mockAPI, mockData } from "../services/mockData";
import useAuthStore from "../store/useAuthStore";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Progress from "../components/ui/Progress";
import Modal from "../components/ui/Modal";

const CourseViewerPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { userRole } = useAuthStore();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [studentProgress, setStudentProgress] = useState(null);
  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // central helper
  const roleToPath = (role) => {
    switch (role) {
      case "student":
        return "/dashboard";
      case "instructor":
        return "/instructor";
      case "admin":
        return "/admin";
      default:
        return "/";
    }
  };

  const backToDashboard = () => navigate(roleToPath(userRole));

  useEffect(() => {
    // if user missing, bounce
    if (!user?.id) {
      navigate("/login");
      return;
    }
    fetchCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user?.id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      // Get course
      const courseData = mockData.courses.find(
        (c) => String(c.id) === String(courseId)
      );
      if (!courseData) {
        toast.error("Course not found");
        navigate(roleToPath(userRole));
        return;
      }
      setCourse(courseData);

      // Modules
      const moduleData = await mockAPI.getCourseModules(courseId);
      setModules(moduleData);

      // Progress
      const progress = await mockAPI.getStudentProgress(user.id, courseId);
      setStudentProgress(progress);

      // Current module & chapter
      if (moduleData.length > 0) {
        const currentMod =
          moduleData.find(
            (m) => String(m.id) === String(progress?.currentModule)
          ) || moduleData[0];
        setCurrentModule(currentMod);

        const chapterData = await mockAPI.getModuleChapters(currentMod.id);
        setChapters(chapterData);

        const currentChap =
          chapterData.find(
            (c) => String(c.id) === String(progress?.currentChapter)
          ) || chapterData[0] || null;

        setCurrentChapter(currentChap);
      } else {
        setCurrentModule(null);
        setChapters([]);
        setCurrentChapter(null);
      }

      // Available tests
      const tests = [];
      for (const m of moduleData) {
        const isEligible = mockAPI.checkModuleTestEligibility(user.id, m.id);
        const hasCompleted = progress?.moduleTestResults?.[m.id]?.passed;

        if (isEligible && !hasCompleted) {
          const test = await mockAPI.getModuleTest(m.id);
          if (test) tests.push({ ...test, moduleTitle: m.title, type: "module" });
        }
      }

      const courseTestEligible = mockAPI.checkCourseTestEligibility(
        user.id,
        courseId
      );
      if (courseTestEligible && !progress?.courseTestResult?.passed) {
        const courseTest = await mockAPI.getCourseTest(courseId);
        if (courseTest) tests.push({ ...courseTest, type: "course" });
      }

      setAvailableTests(tests);
    } catch (err) {
      console.error("Error fetching course data:", err);
      toast.error("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const selectModule = async (module) => {
    setCurrentModule(module);
    const chapterData = await mockAPI.getModuleChapters(module.id);
    setChapters(chapterData);
    setCurrentChapter(chapterData.length ? chapterData[0] : null);
    setVideoProgress(0);
    setIsPlaying(false);
  };

  const selectChapter = (chapter) => {
    setCurrentChapter(chapter);
    setVideoProgress(0);
    setIsPlaying(false);
  };

  // helpers (type-safe)
  const isModuleCompleted = (moduleId) =>
    studentProgress?.completedModules?.some(
      (id) => String(id) === String(moduleId)
    );

  const isChapterCompleted = (chapterId) =>
    studentProgress?.completedChapters?.some(
      (id) => String(id) === String(chapterId)
    );

  const chapterIndexOf = (chapter) => {
    if (!chapter) return -1;
    return chapters.findIndex((c) => String(c.id) === String(chapter.id));
  };

  const isChapterUnlocked = (chapter) => {
    if (!studentProgress || !chapter) return false;
    const idx = chapterIndexOf(chapter);
    if (idx === -1) return false;
    if (idx === 0) return true;
    const prev = chapters[idx - 1];
    return isChapterCompleted(prev.id);
  };

  const completeChapter = async () => {
    if (!currentChapter || !currentModule || !user?.id) return;

    try {
      // compute next before async
      const idx = chapterIndexOf(currentChapter);
      const hasNext = idx > -1 && idx < chapters.length - 1;
      const nextChap = hasNext ? chapters[idx + 1] : null;

      // optimistic update
      setStudentProgress((prev) => {
        if (!prev) return prev;
        const done = new Set((prev.completedChapters || []).map(String));
        done.add(String(currentChapter.id));
        return {
          ...prev,
          completedChapters: Array.from(done),
          // optional light touch on overallProgress
          overallProgress: prev.overallProgress ?? 0,
        };
      });

      toast.success("Chapter completed!");

      if (nextChap) setCurrentChapter(nextChap);

      // persist + refresh
      await mockAPI.updateChapterProgress(
        user.id,
        courseId,
        currentModule.id,
        currentChapter.id
      );
      await fetchCourseData();
    } catch (e) {
      toast.error("Failed to complete chapter");
    }
  };

  const startTest = (test) => {
    setSelectedTest(test);
    setShowTestModal(true);
  };

  const submitTest = async (answers) => {
    try {
      let result;
      if (selectedTest.type === "module") {
        result = await mockAPI.submitModuleTest(
          user.id,
          selectedTest.id,
          answers
        );
      } else {
        result = await mockAPI.submitCourseTest(
          user.id,
          selectedTest.id,
          answers
        );
      }

      setShowTestModal(false);
      setSelectedTest(null);

      if (result.passed) {
        toast.success(`Test passed with ${result.score}%!`);
        if (selectedTest.type === "course") {
          toast.success("🎉 Course completed! AI Interview unlocked!");
        }
      } else {
        toast.error(`Test failed. Score: ${result.score}%. You can retake it.`);
      }

      await fetchCourseData();
    } catch {
      toast.error("Failed to submit test");
    }
  };

  // derived convenience
  const currentIndex = useMemo(() => chapterIndexOf(currentChapter), [currentChapter, chapters]);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex > -1 && currentIndex < chapters.length - 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Course not found
          </h2>
          <Button onClick={() => navigate(roleToPath(userRole))}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" onClick={backToDashboard}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600">by {course.instructor.name}</p>
            </div>
          </div>

          {studentProgress && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Course Progress
                </span>
                <span className="text-sm text-gray-600">
                  {studentProgress.overallProgress}%
                </span>
              </div>
              <Progress value={studentProgress.overallProgress} size="md" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <Card.Header>
                <Card.Title>Course Content</Card.Title>
              </Card.Header>
              <Card.Content className="p-0">
                <div className="space-y-2">
                  {modules.map((module, moduleIndex) => {
                    const moduleDone = isModuleCompleted(module.id);
                    const moduleTestResult =
                      studentProgress?.moduleTestResults?.[module.id];

                    return (
                      <div
                        key={module.id}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <button
                          onClick={() => selectModule(module)}
                          className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                            currentModule?.id === module.id
                              ? "bg-primary-50 border-r-2 border-primary-500"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  moduleDone
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {moduleDone ? (
                                  <CheckCircle size={16} />
                                ) : (
                                  <span className="text-sm font-medium">
                                    {moduleIndex + 1}
                                  </span>
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  {module.title}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  {module.totalChapters} chapters
                                </p>
                              </div>
                            </div>
                            {moduleTestResult && (
                              <Badge
                                variant={
                                  moduleTestResult.passed ? "success" : "danger"
                                }
                                size="sm"
                              >
                                {moduleTestResult.score}%
                              </Badge>
                            )}
                          </div>
                        </button>

                        {currentModule?.id === module.id && (
                          <div className="bg-gray-50">
                            {chapters.map((chapter) => {
                              const completed = isChapterCompleted(chapter.id);
                              const unlocked = isChapterUnlocked(chapter);

                              return (
                                <button
                                  key={chapter.id}
                                  onClick={() =>
                                    unlocked
                                      ? selectChapter(chapter)
                                      : toast.error(
                                          "Complete previous chapter first"
                                        )
                                  }
                                  disabled={!unlocked}
                                  className={`w-full text-left p-3 pl-12 hover:bg-gray-100 transition-colors ${
                                    currentChapter?.id === chapter.id
                                      ? "bg-primary-100"
                                      : ""
                                  } ${
                                    !unlocked
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      {completed ? (
                                        <CheckCircle
                                          size={14}
                                          className="text-green-600"
                                        />
                                      ) : unlocked ? (
                                        <PlayCircle
                                          size={14}
                                          className="text-primary-600"
                                        />
                                      ) : (
                                        <Lock
                                          size={14}
                                          className="text-gray-400"
                                        />
                                      )}
                                      <span className="text-sm text-gray-900">
                                        {chapter.title}
                                      </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {chapter.estimatedDuration}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}

                            {/* Module Test */}
                            {mockAPI.checkModuleTestEligibility(
                              user.id,
                              module.id
                            ) &&
                              !moduleTestResult?.passed && (
                                <div className="p-3 pl-12 bg-blue-50 border-t border-blue-200">
                                  <Button
                                    size="sm"
                                    className="w-full"
                                    onClick={() => {
                                      const test = availableTests.find(
                                        (t) => t.moduleId === module.id
                                      );
                                      if (test) startTest(test);
                                    }}
                                  >
                                    <FileText size={14} className="mr-2" />
                                    Take Module Test
                                  </Button>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Course Test */}
                  {mockAPI.checkCourseTestEligibility(user.id, courseId) &&
                    !studentProgress?.courseTestResult?.passed && (
                      <div className="p-4 bg-yellow-50 border-t border-yellow-200">
                        <Button
                          className="w-full"
                          onClick={() => {
                            const courseTest = availableTests.find(
                              (t) => t.type === "course"
                            );
                            if (courseTest) startTest(courseTest);
                          }}
                        >
                          <Award size={16} className="mr-2" />
                          Take Final Test
                        </Button>
                      </div>
                    )}

                  {/* AI Interview */}
                  {mockAPI.checkAIInterviewEligibility(user.id, courseId) &&
                    !studentProgress?.aiInterviewResult && (
                      <div className="p-4 bg-purple-50 border-t border-purple-200">
                        <Button
                          className="w-full"
                          onClick={() =>
                            toast("AI Interview portal coming soon!")
                          }
                        >
                          <Brain size={16} className="mr-2" />
                          AI Interview
                        </Button>
                      </div>
                    )}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Main */}
          <div className="lg:col-span-3">
            {currentChapter ? (
              <Card>
                <Card.Header className="flex items-center justify-between">
                  <div>
                    <Card.Title>{currentChapter.title}</Card.Title>
                    <p className="text-sm text-gray-600 mt-1">
                      {currentChapter.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="info" size="sm">
                      {currentChapter.estimatedDuration}
                    </Badge>
                    {isChapterCompleted(currentChapter.id) && (
                      <Badge variant="success" size="sm">
                        Completed
                      </Badge>
                    )}
                  </div>
                </Card.Header>
                <Card.Content>
                  {/* Video mock */}
                  {currentChapter.videoUrl && (
                    <div className="mb-6">
                      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <PlayCircle
                              size={64}
                              className="mx-auto mb-4 opacity-80"
                            />
                            <p className="text-lg font-medium">Video Player</p>
                            <p className="text-sm opacity-80">
                              Click to play: {currentChapter.title}
                            </p>
                          </div>
                        </div>

                        {/* Controls (mock) */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <div className="flex items-center space-x-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="text-white hover:bg-white/20"
                            >
                              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                            </Button>
                            <div className="flex-1">
                              <Progress
                                value={videoProgress}
                                size="sm"
                                className="bg-white/20"
                              />
                            </div>
                            <span className="text-white text-sm">
                              {Math.floor(
                                (videoProgress *
                                  Number(currentChapter.estimatedDuration || 0)) /
                                  100
                              )}{" "}
                              / {currentChapter.estimatedDuration} min
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white hover:bg-white/20"
                            >
                              <Settings size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose max-w-none mb-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Chapter Content
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {currentChapter.content}
                      </p>
                    </div>
                  </div>

                  {/* Resources */}
                  {currentChapter.resources?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">
                        Additional Resources
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentChapter.resources.map((resource, i) => (
                          <div
                            key={i}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <Download size={16} className="text-gray-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {resource.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {String(resource.type || "").toUpperCase()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex space-x-2">
                      {hasPrev && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            const prevIndex = currentIndex - 1;
                            if (prevIndex >= 0) selectChapter(chapters[prevIndex]);
                          }}
                        >
                          <ArrowLeft size={16} className="mr-2" />
                          Previous
                        </Button>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {!isChapterCompleted(currentChapter.id) && (
                        <Button onClick={completeChapter}>
                          <CheckCircle size={16} className="mr-2" />
                          Mark Complete
                        </Button>
                      )}

                      {hasNext && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            const nextIndex = currentIndex + 1;
                            const nextChapter = chapters[nextIndex];
                            if (isChapterUnlocked(nextChapter)) {
                              selectChapter(nextChapter);
                            } else {
                              toast.error("Complete current chapter first");
                            }
                          }}
                        >
                          Next
                          <ArrowRight size={16} className="ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ) : (
              <Card>
                <Card.Content className="text-center py-12">
                  <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a module to start learning
                  </h3>
                  <p className="text-gray-600">
                    Choose a module from the sidebar to begin your learning
                    journey.
                  </p>
                </Card.Content>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Test Modal */}
      <Modal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        title={selectedTest?.title}
        size="lg"
      >
        {selectedTest && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText size={16} className="text-blue-600" />
                <span className="font-medium text-blue-800">
                  Test Instructions
                </span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Duration: {selectedTest.duration} minutes</li>
                <li>• Questions: {selectedTest.questions}</li>
                <li>• Passing Score: {selectedTest.passingScore}%</li>
                <li>• Attempts Allowed: {selectedTest.maxAttempts}</li>
                <li>• You cannot pause once started</li>
              </ul>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to begin?
              </h3>
              <p className="text-gray-600 mb-6">
                Make sure you have enough time and a stable internet connection.
              </p>
              <div className="flex space-x-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowTestModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Starting test...");
                    setTimeout(() => {
                      const mockAnswers = [];
                      submitTest(mockAnswers);
                    }, 3000);
                  }}
                >
                  <Play size={16} className="mr-2" />
                  Start Test
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CourseViewerPage;
