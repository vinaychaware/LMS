import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Upload, 
  Save,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const CreateCoursePage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [courseImage, setCourseImage] = useState(null)
  const [lessons, setLessons] = useState([
    { id: 1, title: '', duration: '', type: 'video', content: '' }
  ])
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm()

  const watchedValues = watch()

  const addLesson = () => {
    const newLesson = {
      id: Date.now(),
      title: '',
      duration: '',
      type: 'video',
      content: ''
    }
    setLessons([...lessons, newLesson])
  }

  const removeLesson = (id) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter(lesson => lesson.id !== id))
    }
  }

  const updateLesson = (id, field, value) => {
    setLessons(lessons.map(lesson => 
      lesson.id === id ? { ...lesson, [field]: value } : lesson
    ))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB')
        return
      }
      setCourseImage(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data) => {
    if (lessons.some(lesson => !lesson.title || !lesson.duration)) {
      toast.error('Please fill in all lesson details')
      return
    }

    setIsLoading(true)
    try {
      const courseData = {
        ...data,
        lessons,
        image: courseImage,
        price: parseFloat(data.price),
        duration: lessons.reduce((total, lesson) => total + parseFloat(lesson.duration || 0), 0)
      }

      // Mock API call - replace with actual API
      console.log('Creating course:', courseData)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay
      
      toast.success('Course created successfully!')
      navigate('/instructor')
    } catch (error) {
      toast.error('Failed to create course. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const coursePreview = {
    title: watchedValues.title || 'Course Title',
    description: watchedValues.description || 'Course description will appear here...',
    instructor: 'You',
    price: watchedValues.price || 0,
    duration: lessons.reduce((total, lesson) => total + parseFloat(lesson.duration || 0), 0),
    lessons: lessons.filter(lesson => lesson.title && lesson.duration),
    image: courseImage || 'https://via.placeholder.com/400x250?text=Course+Image'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/instructor')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-gray-600">Share your knowledge and start earning</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button
              variant={!showPreview ? 'default' : 'outline'}
              onClick={() => setShowPreview(false)}
            >
              <BookOpen size={16} className="mr-2" />
              Edit Course
            </Button>
            <Button
              variant={showPreview ? 'default' : 'outline'}
              onClick={() => setShowPreview(true)}
            >
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
          </div>
        </div>

        {!showPreview ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="Course Title"
                    placeholder="Enter course title"
                    error={errors.title?.message}
                    {...register('title', {
                      required: 'Course title is required',
                      minLength: {
                        value: 10,
                        message: 'Title must be at least 10 characters'
                      }
                    })}
                  />
                </div>

                <div>
                  <Input
                    label="Category"
                    placeholder="e.g., Programming, Design, Business"
                    error={errors.category?.message}
                    {...register('category', {
                      required: 'Category is required'
                    })}
                  />
                </div>

                <div>
                  <Input
                    label="Price ($)"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    error={errors.price?.message}
                    {...register('price', {
                      required: 'Price is required',
                      min: {
                        value: 0,
                        message: 'Price must be non-negative'
                      }
                    })}
                  />
                </div>

                <div>
                  <Input
                    label="Difficulty Level"
                    placeholder="Beginner, Intermediate, Advanced"
                    error={errors.difficulty?.message}
                    {...register('difficulty', {
                      required: 'Difficulty level is required'
                    })}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe what students will learn in this course..."
                  {...register('description', {
                    required: 'Description is required',
                    minLength: {
                      value: 100,
                      message: 'Description must be at least 100 characters'
                    }
                  })}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {courseImage ? (
                      <img 
                        src={courseImage} 
                        alt="Course preview" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Upload size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="course-image"
                    />
                    <label htmlFor="course-image">
                      <Button variant="outline" type="button">
                        <Upload size={16} className="mr-2" />
                        Upload Image
                      </Button>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: 400x250px, max 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
                <Button type="button" onClick={addLesson} variant="outline">
                  <Plus size={16} className="mr-2" />
                  Add Lesson
                </Button>
              </div>

              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lesson Title
                        </label>
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Lesson title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          value={lesson.duration}
                          onChange={(e) => updateLesson(lesson.id, 'duration', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="30"
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={lesson.type}
                          onChange={(e) => updateLesson(lesson.id, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="video">Video</option>
                          <option value="text">Text</option>
                          <option value="quiz">Quiz</option>
                          <option value="assignment">Assignment</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeLesson(lesson.id)}
                          disabled={lessons.length === 1}
                          className="w-full"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lesson Content
                      </label>
                      <textarea
                        rows={3}
                        value={lesson.content}
                        onChange={(e) => updateLesson(lesson.id, 'content', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Describe what this lesson covers..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/instructor')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                <Save size={16} className="mr-2" />
                Create Course
              </Button>
            </div>
          </form>
        ) : (
          /* Course Preview */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
                <img 
                  src={coursePreview.image} 
                  alt={coursePreview.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {coursePreview.title}
                </h1>
                <p className="text-gray-600 text-lg mb-4">
                  {coursePreview.description}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>By {coursePreview.instructor}</span>
                  <span>•</span>
                  <span>{coursePreview.duration} minutes</span>
                  <span>•</span>
                  <span>{coursePreview.lessons.length} lessons</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Content</h2>
                <div className="space-y-3">
                  {coursePreview.lessons.map((lesson, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                        <p className="text-sm text-gray-500">{lesson.type} • {lesson.duration} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-6 bg-primary-50 rounded-lg">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary-900 mb-2">
                    ${coursePreview.price}
                  </h3>
                  <p className="text-primary-700 mb-4">One-time payment</p>
                  <Button className="w-full md:w-auto">
                    Enroll Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateCoursePage
