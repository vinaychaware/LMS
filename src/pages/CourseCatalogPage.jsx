// import React, { useState, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { Search, Filter, Star, Clock, Users, BookOpen, Play, Award, TrendingUp, Heart, Share2, ChevronRight, Grid as Grid3X3, List, SlidersHorizontal, X } from 'lucide-react'
// import { courseAPI } from '../services/api'
// import { mockData } from '../services/mockData'
// import useAuthStore from '../store/useAuthStore'
// import Button from '../components/ui/Button'
// import Progress from '../components/ui/Progress'
// import Badge from '../components/ui/Badge'
// import Card from '../components/ui/Card'
// const CourseCatalogPage = () => {
//   const [courses, setCourses] = useState([])
//   const [filteredCourses, setFilteredCourses] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedCategory, setSelectedCategory] = useState('all')
//   const [selectedLevel, setSelectedLevel] = useState('all')
//   const [selectedCollege, setSelectedCollege] = useState('all')
//   const [priceRange, setPriceRange] = useState([0, 500])
//   const [sortBy, setSortBy] = useState('popular')
//   const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
//   const [showFilters, setShowFilters] = useState(false)
//   const [favorites, setFavorites] = useState([])

//   const { user, isAuthenticated } = useAuthStore()
//   const navigate = useNavigate()

//   const categories = [
//     { id: 'all', name: 'All Categories', count: 0 },
//     { id: 'programming', name: 'Programming', count: 0 },
//     { id: 'design', name: 'Design', count: 0 },
//     { id: 'business', name: 'Business', count: 0 },
//     { id: 'marketing', name: 'Marketing', count: 0 },
//     { id: 'data-science', name: 'Data Science', count: 0 },
//     { id: 'language', name: 'Language Learning', count: 0 },
//     { id: 'music', name: 'Music', count: 0 },
//     { id: 'photography', name: 'Photography', count: 0 }
//   ]

//   const levels = [
//     { id: 'all', name: 'All Levels' },
//     { id: 'beginner', name: 'Beginner' },
//     { id: 'intermediate', name: 'Intermediate' },
//     { id: 'advanced', name: 'Advanced' }
//   ]

//   const sortOptions = [
//     { id: 'popular', name: 'Most Popular' },
//     { id: 'newest', name: 'Newest First' },
//     { id: 'rating', name: 'Highest Rated' },
//     { id: 'price-low', name: 'Price: Low to High' },
//     { id: 'price-high', name: 'Price: High to Low' },
//     { id: 'duration', name: 'Duration' }
//   ]

//   useEffect(() => {
//     fetchCourses()
//   }, [])

//   useEffect(() => {
//     filterAndSortCourses()
//   }, [courses, searchTerm, selectedCategory, selectedLevel, selectedCollege, priceRange, sortBy])

//   const fetchCourses = async () => {
//     try {
//       // Use mock data with enhanced course information
//       const enhancedCourses = mockData.courses.map(course => ({
//         ...course,
//         enrolledStudents: course.enrolledStudents?.length || 0,
//         duration: course.estimatedDuration,
//         // Add user progress if authenticated
//         progress: isAuthenticated && user?.progress?.[course.id]?.overallProgress
//       }))

//       setCourses(enhancedCourses)

//       // Update category counts
//       categories.forEach(category => {
//         if (category.id === 'all') {
//           category.count = enhancedCourses.length
//         } else {
//           category.count = enhancedCourses.filter(course =>
//             course.category.toLowerCase() === category.id
//           ).length
//         }
//       })
//     } catch (error) {
//       console.error('Error fetching courses:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filterAndSortCourses = () => {
//     let filtered = courses

//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(course =>
//         course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     }

//     // Category filter
//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(course =>
//         course.category.toLowerCase() === selectedCategory
//       )
//     }

//     // Level filter
//     if (selectedLevel !== 'all') {
//       filtered = filtered.filter(course => course.level === selectedLevel)
//     }

//     // College filter
//     if (selectedCollege !== 'all') {
//       filtered = filtered.filter(course => course.collegeId === selectedCollege)
//     }

//     // Price filter
//     filtered = filtered.filter(course =>
//       course.price >= priceRange[0] && course.price <= priceRange[1]
//     )

//     // Sort
//     switch (sortBy) {
//       case 'newest':
//         filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         break
//       case 'rating':
//         filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
//         break
//       case 'price-low':
//         filtered.sort((a, b) => a.price - b.price)
//         break
//       case 'price-high':
//         filtered.sort((a, b) => b.price - a.price)
//         break
//       case 'duration':
//         filtered.sort((a, b) => {
//           const aDuration = parseInt(a.estimatedDuration) || 0
//           const bDuration = parseInt(b.estimatedDuration) || 0
//           return aDuration - bDuration
//         })
//         break
//       default: // popular
//         filtered.sort((a, b) => (b.enrolledStudents || 0) - (a.enrolledStudents || 0))
//         break
//     }

//     setFilteredCourses(filtered)
//   }

//   const getCategoryColor = (category) => {
//     const colors = {
//       programming: 'bg-blue-100 text-blue-800',
//       design: 'bg-purple-100 text-purple-800',
//       business: 'bg-green-100 text-green-800',
//       marketing: 'bg-yellow-100 text-yellow-800',
//       'data-science': 'bg-red-100 text-red-800',
//       language: 'bg-indigo-100 text-indigo-800',
//       music: 'bg-pink-100 text-pink-800',
//       photography: 'bg-orange-100 text-orange-800'
//     }
//     return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800'
//   }

//   const getLevelColor = (level) => {
//     const colors = {
//       beginner: 'bg-green-100 text-green-800',
//       intermediate: 'bg-yellow-100 text-yellow-800',
//       advanced: 'bg-red-100 text-red-800'
//     }
//     return colors[level] || 'bg-gray-100 text-gray-800'
//   }

//   const toggleFavorite = (courseId) => {
//     if (favorites.includes(courseId)) {
//       setFavorites(favorites.filter(id => id !== courseId))
//     } else {
//       setFavorites([...favorites, courseId])
//     }
//   }

//   const clearFilters = () => {
//     setSearchTerm('')
//     setSelectedCategory('all')
//     setSelectedLevel('all')
//     setSelectedCollege('all')
//     setPriceRange([0, 500])
//     setSortBy('popular')
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading courses...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
//           <div className="text-center">
//             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
//               Discover Your Next Learning Adventure
//             </h1>
//             <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
//               Explore thousands of courses from expert instructors across multiple institutions.
//               Transform your skills and advance your career.
//             </p>

//             {/* Enhanced Search Bar */}
//             <div className="max-w-2xl mx-auto px-4">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search for courses, instructors, or topics..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 sm:py-4 text-gray-900 bg-white rounded-xl shadow-lg focus:ring-4 focus:ring-white/20 focus:outline-none text-base sm:text-lg"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Filters and Controls */}
//         <div className="mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 sm:mb-6">
//             <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
//               <Button
//                 variant={showFilters ? 'primary' : 'outline'}
//                 className="w-full sm:w-auto"
//                 onClick={() => setShowFilters(!showFilters)}
//               >
//                 <SlidersHorizontal size={16} className="mr-2" />
//                 Filters
//               </Button>

//               <div className="flex items-center justify-between sm:justify-start space-x-2">
//                 <span className="text-sm text-gray-600">View:</span>
//                 <div className="flex border border-gray-300 rounded-lg overflow-hidden">
//                   <button
//                     onClick={() => setViewMode('grid')}
//                     className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
//                   >
//                     <Grid3X3 size={16} />
//                   </button>
//                   <button
//                     onClick={() => setViewMode('list')}
//                     className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
//                   >
//                     <List size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
//               <div className="flex items-center justify-between sm:justify-start space-x-2">
//                 <span className="text-sm text-gray-600">Sort by:</span>
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="px-2 sm:px-3 py-1 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                 >
//                   {sortOptions.map((option) => (
//                     <option key={option.id} value={option.id}>
//                       {option.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
//                 Showing {filteredCourses.length} of {courses.length} courses
//               </div>
//             </div>
//           </div>

//           {/* Expandable Filters */}
//           {showFilters && (
//             <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-4">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filter Courses</h3>
//                 <div className="flex space-x-2">
//                   <Button variant="outline" size="sm" onClick={clearFilters}>
//                     Clear All
//                   </Button>
//                   <Button variant="outline" size="sm" onClick={() => setShowFilters(false)}>
//                     <X size={16} />
//                   </Button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//                 {/* Category Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                   <select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="w-full px-2 sm:px-3 py-1 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
//                   >
//                     {categories.map((category) => (
//                       <option key={category.id} value={category.id}>
//                         {category.name} {category.count > 0 && `(${category.count})`}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Level Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
//                   <select
//                     value={selectedLevel}
//                     onChange={(e) => setSelectedLevel(e.target.value)}
//                     className="w-full px-2 sm:px-3 py-1 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
//                   >
//                     {levels.map((level) => (
//                       <option key={level.id} value={level.id}>
//                         {level.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* College Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
//                   <select
//                     value={selectedCollege}
//                     onChange={(e) => setSelectedCollege(e.target.value)}
//                     className="w-full px-2 sm:px-3 py-1 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
//                   >
//                     <option value="all">All Institutions</option>
//                     {mockData.colleges.map((college) => (
//                       <option key={college.id} value={college.id}>
//                         {college.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Price Range */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Price Range: ${priceRange[0]} - ${priceRange[1]}
//                   </label>
//                   <div className="space-y-2">
//                     <input
//                       type="range"
//                       min="0"
//                       max="500"
//                       value={priceRange[1]}
//                       onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//                       className="w-full"
//                     />
//                     <div className="flex justify-between text-xs text-gray-500">
//                       <span>Free</span>
//                       <span>$500+</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           )}
//         </div>

//         {/* Course Grid/List */}
//         {filteredCourses.length === 0 ? (
//           <div className="text-center py-16">
//             <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
//             <h3 className="text-xl font-medium text-gray-900 mb-2">No courses found</h3>
//             <p className="text-gray-600 mb-4">
//               Try adjusting your search terms or filters to find what you're looking for.
//             </p>
//             <Button onClick={clearFilters}>Clear Filters</Button>
//           </div>
//         ) : (
//           <div className={
//             viewMode === 'grid'
//               ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
//               : 'space-y-4 sm:space-y-6'
//           }>
//             {filteredCourses.map((course) => (
//               viewMode === 'grid' ? (
//                 <CourseCard
//                   key={course.id}
//                   course={course}
//                   isFavorite={favorites.includes(course.id)}
//                   onToggleFavorite={() => toggleFavorite(course.id)}
//                   getCategoryColor={getCategoryColor}
//                   getLevelColor={getLevelColor}
//                 />
//               ) : (
//                 <CourseListItem
//                   key={course.id}
//                   course={course}
//                   isFavorite={favorites.includes(course.id)}
//                   onToggleFavorite={() => toggleFavorite(course.id)}
//                   getCategoryColor={getCategoryColor}
//                   getLevelColor={getLevelColor}
//                 />
//               )
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
// const CourseCard = ({ course, isFavorite, onToggleFavorite, getCategoryColor, getLevelColor }) => {
//   const { isAuthenticated } = useAuthStore()
//   const college = mockData.colleges.find(c => c.id === course.collegeId)

//   return (
//     <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
//       {/* Course Image */}
//       <div className="relative aspect-video bg-gradient-to-br from-primary-100 to-primary-200">
//         <img
//           src={course.thumbnail}
//           alt={course.title}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//         />
//         <div className="absolute top-3 right-3 flex space-x-2">
//           <button
//             onClick={onToggleFavorite}
//             className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
//               isFavorite
//                 ? 'bg-red-500 text-white'
//                 : 'bg-white/80 text-gray-600 hover:bg-white'
//             }`}
//           >
//             <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
//           </button>
//           <button className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-colors">
//             <Share2 size={16} />
//           </button>
//         </div>
//         {course.progress !== undefined && (
//           <div className="absolute bottom-3 left-3 right-3">
//             <Progress value={course.progress} size="sm" className="bg-white/20" />
//           </div>
//         )}
//       </div>

//       {/* Course Content */}
//       <Card.Content className="p-6">
//         {/* Category and Level */}
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center space-x-2">
//             <Badge className={getCategoryColor(course.category)} size="sm">
//               {course.category}
//             </Badge>
//             <Badge className={getLevelColor(course.level)} size="sm">
//               {course.level}
//             </Badge>
//           </div>
//           <div className="flex items-center space-x-1">
//             <Star size={14} className="text-yellow-400 fill-current" />
//             <span className="text-sm font-medium text-gray-700">{course.rating}</span>
//             <span className="text-sm text-gray-500">({course.reviewCount})</span>
//           </div>
//         </div>

//         {/* Title */}
//         <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
//           {course.title}
//         </h3>

//         {/* Description */}
//         <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//           {course.description}
//         </p>

//         {/* Instructor */}
//         <div className="flex items-center space-x-2 mb-4">
//           <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
//             <img
//               src={course.instructor.avatar}
//               alt={course.instructor.name}
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div>
//             <span className="text-sm font-medium text-gray-700">{course.instructor.name}</span>
//             {college && (
//               <p className="text-xs text-gray-500">{college.name}</p>
//             )}
//           </div>
//         </div>

//         {/* Course Stats */}
//         <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//           <div className="flex items-center space-x-1">
//             <Clock size={14} />
//             <span>{course.duration}</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <Users size={14} />
//             <span>{course.enrolledStudents} students</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <BookOpen size={14} />
//             <span>{course.totalModules} modules</span>
//           </div>
//         </div>

//         {/* Progress Bar (if enrolled) */}
//         {course.progress !== undefined && (
//           <div className="mb-4">
//             <div className="flex justify-between text-sm text-gray-600 mb-1">
//               <span>Your Progress</span>
//               <span>{course.progress}%</span>
//             </div>
//             <Progress value={course.progress} size="sm" />
//           </div>
//         )}

//         {/* Price and Action */}
//         <div className="flex items-center justify-between">
//           <div className="text-xl font-bold text-gray-900">
//             {course.price === 0 ? (
//               <span className="text-green-600">Free</span>
//             ) : (
//               <span>${course.price}</span>
//             )}
//           </div>
//           <Link to={isAuthenticated ? `/courses/${course.id}` : '/login'}>
//             <Button size="sm" className="group">
//               {course.progress !== undefined ? (
//                 <>
//                   <Play size={16} className="mr-1" />
//                   Continue
//                 </>
//               ) : (
//                 <>
//                   Learn More
//                   <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
//                 </>
//               )}
//             </Button>
//           </Link>
//         </div>
//       </Card.Content>
//     </Card>
//   )
// }
// const CourseListItem = ({ course, isFavorite, onToggleFavorite, getCategoryColor, getLevelColor }) => {
//   const { isAuthenticated } = useAuthStore()
//   const college = mockData.colleges.find(c => c.id === course.collegeId)

//   return (
//     <Card className="overflow-hidden hover:shadow-md transition-shadow">
//       <div className="flex">
//         {/* Course Image */}
//         <div className="w-48 h-32 bg-gradient-to-br from-primary-100 to-primary-200 flex-shrink-0">
//           <img
//             src={course.thumbnail}
//             alt={course.title}
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Course Content */}
//         <div className="flex-1 p-6">
//           <div className="flex items-start justify-between">
//             <div className="flex-1">
//               {/* Category and Level */}
//               <div className="flex items-center space-x-2 mb-2">
//                 <Badge className={getCategoryColor(course.category)} size="sm">
//                   {course.category}
//                 </Badge>
//                 <Badge className={getLevelColor(course.level)} size="sm">
//                   {course.level}
//                 </Badge>
//                 <div className="flex items-center space-x-1">
//                   <Star size={14} className="text-yellow-400 fill-current" />
//                   <span className="text-sm font-medium text-gray-700">{course.rating}</span>
//                   <span className="text-sm text-gray-500">({course.reviewCount})</span>
//                 </div>
//               </div>

//               {/* Title */}
//               <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
//                 {course.title}
//               </h3>

//               {/* Description */}
//               <p className="text-gray-600 mb-3 line-clamp-2">
//                 {course.description}
//               </p>

//               {/* Instructor and College */}
//               <div className="flex items-center space-x-4 mb-3">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
//                     <img
//                       src={course.instructor.avatar}
//                       alt={course.instructor.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <span className="text-sm font-medium text-gray-700">{course.instructor.name}</span>
//                 </div>
//                 {college && (
//                   <span className="text-sm text-gray-500">• {college.name}</span>
//                 )}
//               </div>

//               {/* Course Stats */}
//               <div className="flex items-center space-x-6 text-sm text-gray-500">
//                 <div className="flex items-center space-x-1">
//                   <Clock size={14} />
//                   <span>{course.duration}</span>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <Users size={14} />
//                   <span>{course.enrolledStudents} students</span>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <BookOpen size={14} />
//                   <span>{course.totalModules} modules</span>
//                 </div>
//               </div>
//             </div>

//             {/* Right Side Actions */}
//             <div className="flex flex-col items-end space-y-3">
//               <div className="flex space-x-2">
//                 <button
//                   onClick={onToggleFavorite}
//                   className={`p-2 rounded-full transition-colors ${
//                     isFavorite
//                       ? 'bg-red-100 text-red-600'
//                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                   }`}
//                 >
//                   <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
//                 </button>
//                 <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
//                   <Share2 size={16} />
//                 </button>
//               </div>

//               <div className="text-right">
//                 <div className="text-2xl font-bold text-gray-900 mb-1">
//                   {course.price === 0 ? (
//                     <span className="text-green-600">Free</span>
//                   ) : (
//                     <span>${course.price}</span>
//                   )}
//                 </div>
//                 {course.progress !== undefined && (
//                   <div className="mb-2">
//                     <div className="text-xs text-gray-500 mb-1">{course.progress}% complete</div>
//                     <div className="w-24 bg-gray-200 rounded-full h-1.5">
//                       <div
//                         className="bg-primary-600 h-1.5 rounded-full"
//                         style={{ width: `${course.progress}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}
//                 <Link to={isAuthenticated ? `/courses/${course.id}` : '/login'}>
//                   <Button size="sm" className="group">
//                     {course.progress !== undefined ? (
//                       <>
//                         <Play size={16} className="mr-1" />
//                         Continue
//                       </>
//                     ) : (
//                       <>
//                         Learn More
//                         <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
//                       </>
//                     )}
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Card>
//   )
// }
// export default CourseCatalogPage

// src/pages/CourseCatalogPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  Clock,
  Users,
  BookOpen,
  Play,
  Heart,
  Share2,
  ChevronRight,
  Grid as Grid3X3,
  List,
  SlidersHorizontal,
  X,
} from "lucide-react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";
import Button from "../components/ui/Button";
import Progress from "../components/ui/Progress";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";

import { mockData } from "../services/mockData";
import { coursesAPI, FALLBACK_THUMB } from '../services/api'
const API_BASE = "http://localhost:5000";

const CourseCatalogPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const { user, isAuthenticated, token } = useAuthStore();
  const navigate = useNavigate();

  const categories = [
    { id: "all", name: "All Categories", count: 0 },
    { id: "programming", name: "Programming", count: 0 },
    { id: "design", name: "Design", count: 0 },
    { id: "business", name: "Business", count: 0 },
    { id: "marketing", name: "Marketing", count: 0 },
    { id: "data-science", name: "Data Science", count: 0 },
    { id: "language", name: "Language Learning", count: 0 },
    { id: "music", name: "Music", count: 0 },
    { id: "photography", name: "Photography", count: 0 },
  ];

  const levels = [
    { id: "all", name: "All Levels" },
    { id: "beginner", name: "Beginner" },
    { id: "intermediate", name: "Intermediate" },
    { id: "advanced", name: "Advanced" },
  ];

  const sortOptions = [
    { id: "popular", name: "Most Popular" },
    { id: "newest", name: "Newest First" },
    { id: "rating", name: "Highest Rated" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "duration", name: "Duration" },
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterAndSortCourses();
  }, [
    courses,
    searchTerm,
    selectedCategory,
    selectedLevel,
    selectedCollege,
    priceRange,
    sortBy,
  ]);

const fetchCourses = async () => {
  setLoading(true)
  try {
    // token is already handled by the api interceptor
    const res = await coursesAPI.list()
    const apiCourses = Array.isArray(res.data) ? res.data : []

    const mapped = apiCourses.map((c) => {
      const firstInstructor = c.instructorNames?.[0] || 'Unknown Instructor'
      return {
        id: c.id,
        title: c.title,
        description: c.description || '',                   // if you add it later
        thumbnail: c.thumbnail || FALLBACK_THUMB,           // safe inline SVG fallback
        category: (c.category || 'general').toLowerCase(),  // if not in API, default 'general'
        level: (c.level || 'beginner').toLowerCase(),       // if not in API, default 'beginner'
        rating: Number(c.rating ?? 0),
        reviewCount: Number(c.reviewCount ?? 0),
        price: Number(c.price ?? 0),
        estimatedDuration: c.estimatedDuration || '—',
        duration: c.estimatedDuration || '—',
        totalModules: Number(c.totalModules ?? 0),
        createdAt: c.createdAt || new Date().toISOString(),
        enrolledStudents: Number(c.studentCount ?? 0),

        instructor: {
          name: firstInstructor,
          // initials avatar to avoid hitting external random images
          avatar: `data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
              <rect width="100%" height="100%" fill="#e5e7eb"/>
              <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                    font-family="Arial" font-size="20" fill="#374151">
                ${firstInstructor.split(' ').map(p=>p[0] || '').join('').slice(0,2).toUpperCase()}
              </text>
            </svg>`
          )}`,
        },

     
        progress: undefined,

        collegeId: c.collegeId, 
      }
    })

 
    const counts = mapped.reduce((acc, course) => {
      const key = course.category || 'general'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})


    categories.forEach((cat) => {
      if (cat.id === 'all') {
        cat.count = mapped.length
      } else {
        cat.count = counts[cat.id] || 0
      }
    })

    setCourses(mapped)
  } catch (err) {
    console.error('Error fetching courses:', err)
    if (err?.response?.status === 401) {
      navigate('/login')
    } else {
   
    }
  } finally {
    setLoading(false)
  }
}


  const filterAndSortCourses = () => {
    let filtered = [...courses];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          (course.title || "").toLowerCase().includes(q) ||
          (course.description || "").toLowerCase().includes(q) ||
          (course.instructor?.name || "").toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (course) => (course.category || "").toLowerCase() === selectedCategory
      );
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter(
        (course) => (course.level || "") === selectedLevel
      );
    }

    if (selectedCollege !== "all") {
      filtered = filtered.filter(
        (course) => course.collegeId === selectedCollege
      );
    }

    filtered = filtered.filter((course) => {
      const price = Number(course.price || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "duration": {
        const toNum = (val) => {
          if (!val) return 0;
          const n = parseInt(val, 10);
          return Number.isNaN(n) ? 0 : n;
        };
        filtered.sort(
          (a, b) => toNum(a.estimatedDuration) - toNum(b.estimatedDuration)
        );
        break;
      }
      default:
        filtered.sort(
          (a, b) => (b.enrolledStudents || 0) - (a.enrolledStudents || 0)
        );
        break;
    }

    setFilteredCourses(filtered);
  };

  const getCategoryColor = (category) => {
    const colors = {
      programming: "bg-blue-100 text-blue-800",
      design: "bg-purple-100 text-purple-800",
      business: "bg-green-100 text-green-800",
      marketing: "bg-yellow-100 text-yellow-800",
      "data-science": "bg-red-100 text-red-800",
      language: "bg-indigo-100 text-indigo-800",
      music: "bg-pink-100 text-pink-800",
      photography: "bg-orange-100 text-orange-800",
      general: "bg-gray-100 text-gray-800",
    };
    return (
      colors[(category || "general").toLowerCase()] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const getLevelColor = (level) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  const toggleFavorite = (courseId) => {
    setFavorites((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSelectedCollege("all");
    setPriceRange([0, 500]);
    setSortBy("popular");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Discover Your Next Learning Adventure
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
              Explore courses from expert instructors. Transform your skills and
              advance your career.
            </p>
            <div className="max-w-2xl mx-auto px-4">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search for courses, instructors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 text-gray-900 bg-white rounded-xl shadow-lg focus:ring-4 focus:ring-white/20 focus:outline-none text-base sm:text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                variant={showFilters ? "primary" : "outline"}
                className="w-full sm:w-auto"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={16} className="mr-2" />
                Filters
              </Button>

              <div className="flex items-center justify-between sm:justify-start space-x-2">
                <span className="text-sm text-gray-600">View:</span>
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-primary-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-primary-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center justify-between sm:justify-start space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 sm:px-3 py-1 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                Showing {filteredCourses.length} of {courses.length} courses
              </div>
            </div>
          </div>

          {showFilters && (
            <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Filter Courses
                </h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}{" "}
                        {category.count > 0 && `(${category.count})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {levels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution
                  </label>
                  <select
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    className="w-full px-2 sm:px-3 py-1 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Institutions</option>
                    {mockData.colleges.map((college) => (
                      <option key={college.id} value={college.id}>
                        {college.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Free</span>
                      <span>$500+</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find what you're
              looking for.
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                : "space-y-4 sm:space-y-6"
            }
          >
            {filteredCourses.map((course) =>
              viewMode === "grid" ? (
                <CourseCard
                  key={course.id}
                  course={course}
                  isFavorite={favorites.includes(course.id)}
                  onToggleFavorite={() => toggleFavorite(course.id)}
                  getCategoryColor={getCategoryColor}
                  getLevelColor={getLevelColor}
                />
              ) : (
                <CourseListItem
                  key={course.id}
                  course={course}
                  isFavorite={favorites.includes(course.id)}
                  onToggleFavorite={() => toggleFavorite(course.id)}
                  getCategoryColor={getCategoryColor}
                  getLevelColor={getLevelColor}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CourseCard = ({
  course,
  isFavorite,
  onToggleFavorite,
  getCategoryColor,
  getLevelColor,
}) => {
  const { isAuthenticated } = useAuthStore();
  const college = course.collegeId
    ? mockData.colleges.find((c) => c.id === course.collegeId)
    : null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative aspect-video bg-gradient-to-br from-primary-100 to-primary-200">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-600 hover:bg-white"
            }`}
          >
            <Heart size={16} className={isFavorite ? "fill-current" : ""} />
          </button>
          <button className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-colors">
            <Share2 size={16} />
          </button>
        </div>
        {course.progress !== undefined && (
          <div className="absolute bottom-3 left-3 right-3">
            <Progress
              value={course.progress}
              size="sm"
              className="bg-white/20"
            />
          </div>
        )}
      </div>

      <Card.Content className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge className={getCategoryColor(course.category)} size="sm">
              {course.category}
            </Badge>
            <Badge className={getLevelColor(course.level)} size="sm">
              {course.level}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">
              {course.rating ?? 0}
            </span>
            <span className="text-sm text-gray-500">
              ({course.reviewCount ?? 0})
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {course.title}
        </h3>

        {course.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>
        )}

        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            <img
              src={course.instructor?.avatar}
              alt={course.instructor?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">
              {course.instructor?.name}
            </span>
            {college && <p className="text-xs text-gray-500">{college.name}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users size={14} />
            <span>{course.enrolledStudents} students</span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen size={14} />
            <span>{course.totalModules} modules</span>
          </div>
        </div>

        {course.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Your Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} size="sm" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">
            {course.price === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              <span>${course.price}</span>
            )}
          </div>
          <Link
            to={isAuthenticated ? `/courses/${course.id}` : "/login"}
            state={
              !isAuthenticated ? { next: `/courses/${course.id}` } : undefined
            }
          >
            <Button size="sm" className="group">
              {course.progress !== undefined ? (
                <>
                  <Play size={16} className="mr-1" />
                  Continue
                </>
              ) : (
                <>
                  Learn More
                  <ChevronRight
                    size={16}
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </Button>
          </Link>
        </div>
      </Card.Content>
    </Card>
  );
};

const CourseListItem = ({
  course,
  isFavorite,
  onToggleFavorite,
  getCategoryColor,
  getLevelColor,
}) => {
  const { isAuthenticated } = useAuthStore();
  const college = course.collegeId
    ? mockData.colleges.find((c) => c.id === course.collegeId)
    : null;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        <div className="w-48 h-32 bg-gradient-to-br from-primary-100 to-primary-200 flex-shrink-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={getCategoryColor(course.category)} size="sm">
                  {course.category}
                </Badge>
                <Badge className={getLevelColor(course.level)} size="sm">
                  {course.level}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star size={14} className="text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">
                    {course.rating ?? 0}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({course.reviewCount ?? 0})
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                {course.title}
              </h3>

              {course.description && (
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {course.description}
                </p>
              )}

              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={course.instructor?.avatar}
                      alt={course.instructor?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {course.instructor?.name}
                  </span>
                </div>
                {college && (
                  <span className="text-sm text-gray-500">
                    • {college.name}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={14} />
                  <span>{course.enrolledStudents} students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen size={14} />
                  <span>{course.totalModules} modules</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-3">
              <div className="flex space-x-2">
                <button
                  onClick={onToggleFavorite}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Heart
                    size={16}
                    className={isFavorite ? "fill-current" : ""}
                  />
                </button>
                <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <Share2 size={16} />
                </button>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {course.price === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <span>${course.price}</span>
                  )}
                </div>
                <Link
                  to={isAuthenticated ? `/courses/${course.id}` : "/login"}
                  state={
                    !isAuthenticated
                      ? { next: `/courses/${course.id}` }
                      : undefined
                  }
                >
                  <Button size="sm" className="group">
                    {course.progress !== undefined ? (
                      <>
                        <Play size={16} className="mr-1" />
                        Continue
                      </>
                    ) : (
                      <>
                        Learn More
                        <ChevronRight
                          size={16}
                          className="ml-1 group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCatalogPage;
