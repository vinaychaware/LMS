import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, BookOpen, User, BookOpen as BookOpenIcon, Settings } from 'lucide-react'
import { toast } from 'react-hot-toast'

import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState('student')
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  // Mock user database for demo purposes
  const mockUsers = [
    {
      email: 'student@demo.com',
      password: 'Student123',
      name: 'John Student',
      role: 'student'
    },
    {
      email: 'instructor@demo.com',
      password: 'Instructor123',
      name: 'Sarah Instructor',
      role: 'instructor'
    },
    {
      email: 'admin@demo.com',
      password: 'Admin123',
      name: 'Admin User',
      role: 'admin'
    }
  ]

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    try {
      // Check if user already exists (mock validation)
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase())
      if (existingUser) {
        toast.error('An account with this email already exists.')
        return
      }

      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: selectedRole
      }
      
      // Add to mock database
      mockUsers.push(userData)
      
      toast.success('Account created successfully! Please sign in.')
      navigate('/login')
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Learn from expert instructors and track your progress',
      icon: <User size={24} />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'instructor',
      title: 'Instructor',
      description: 'Create and manage courses, assignments, and assessments',
      icon: <BookOpenIcon size={24} />,
      color: 'bg-green-100 text-green-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-10 sm:w-12 h-10 sm:h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <BookOpen size={24} className="text-white" />
          </div>
        </div>
        <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-10 shadow sm:rounded-lg">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                I want to join as:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                      selectedRole === role.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${role.color}`}>
                      {role.icon}
                    </div>
                    <div className="text-center">
                      <div className="text-sm sm:text-base font-medium text-gray-900">{role.title}</div>
                      <div className="text-xs text-gray-500 mt-1 hidden sm:block">{role.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Input
                label="Full name"
                type="text"
                autoComplete="name"
                error={errors.name?.message}
                {...register('name', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
              />
            </div>

            <div>
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </div>

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                error={errors.password?.message}
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={() => setShowPasswordRequirements(false)}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                  }
                })}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
              />
              {showPasswordRequirements && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-2">Password Requirements:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li className={`flex items-center space-x-2 ${password?.length >= 8 ? 'text-green-600' : ''}`}>
                      <span>{password?.length >= 8 ? '✓' : '○'}</span>
                      <span>At least 8 characters</span>
                    </li>
                    <li className={`flex items-center space-x-2 ${/[a-z]/.test(password) ? 'text-green-600' : ''}`}>
                      <span>{/[a-z]/.test(password) ? '✓' : '○'}</span>
                      <span>One lowercase letter</span>
                    </li>
                    <li className={`flex items-center space-x-2 ${/[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
                      <span>{/[A-Z]/.test(password) ? '✓' : '○'}</span>
                      <span>One uppercase letter</span>
                    </li>
                    <li className={`flex items-center space-x-2 ${/\d/.test(password) ? 'text-green-600' : ''}`}>
                      <span>{/\d/.test(password) ? '✓' : '○'}</span>
                      <span>One number</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <Input
                label="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded flex-shrink-0"
                {...register('agreeTerms', {
                  required: 'You must agree to the terms and conditions'
                })}
              />
              <label htmlFor="agree-terms" className="ml-2 block text-xs sm:text-sm text-gray-900">
                I agree to the{' '}
                <Link
                  to="/terms"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-sm text-red-600">{errors.agreeTerms.message}</p>
            )}

            <div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                
                loading={isLoading}
                disabled={isLoading}
              >
                Create account
              </Button>
            </div>
          </form>

          <div className="mt-4 sm:mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full text-xs sm:text-sm"
                onClick={() => toast.error('Google registration not implemented yet')}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-1 sm:ml-2">Google</span>
              </Button>

              <Button
                variant="outline"
                className="w-full text-xs sm:text-sm"
                onClick={() => toast.error('GitHub registration not implemented yet')}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="ml-1 sm:ml-2">GitHub</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
