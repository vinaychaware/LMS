import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, BookOpen, User, BookOpen as BookOpenIcon, Shield } from 'lucide-react'
import { toast } from 'react-hot-toast'
import useAuthStore from '../store/useAuthStore'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimer, setLockTimer] = useState(0) // countdown

  const { login } = useAuthStore()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  // Mock user database
  const mockUsers = [
    {
      email: 'superadmin@edusphere.com',
      password: 'SuperAdmin123',
      name: 'Super Administrator',
      role: 'superadmin'
    },
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

  const startLockTimer = () => {
    setIsLocked(true)
    setLockTimer(15 * 60) // 15 minutes in seconds

    const interval = setInterval(() => {
      setLockTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsLocked(false)
          setLoginAttempts(0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const onSubmit = async (data) => {
    if (isLocked) {
      toast.error('Account temporarily locked. Please try again later.')
      return
    }

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000)) // simulate API

    try {
      const user = mockUsers.find(
        u => u.email.toLowerCase() === data.email.toLowerCase() && u.password === data.password
      )
      
      if (user) {
        const token = `mock-token-${user.role}-${Date.now()}`
        login(user, token) // Zustand store
        setLoginAttempts(0)
        toast.success(`Welcome back, ${user.name}!`)
        
        // Redirect
        if (user.role === 'admin') navigate('/admin')
        else if (user.role === 'instructor') navigate('/instructor')
        else navigate('/dashboard')
      } else {
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)
        
        if (newAttempts >= 5) {
          toast.error('Too many failed attempts. Account locked for 15 minutes.')
          startLockTimer()
        } else {
          toast.error('Invalid email or password. Please try again.')
        }
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <BookOpen size={24} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" loading={isLoading} disabled={isLoading || isLocked}>
                {isLocked ? `Locked (${Math.floor(lockTimer / 60)}m ${lockTimer % 60}s)` : 'Sign in'}
              </Button>
              {loginAttempts > 0 && !isLocked && (
                <p className="text-sm text-red-600 text-center mt-2">
                  Failed attempts: {loginAttempts}/5
                </p>
              )}
            </div>
          </form>

          {/* Quick Demo Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Quick Demo Login</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  document.querySelector('input[name="email"]').value = 'superadmin@edusphere.com'
                  document.querySelector('input[name="password"]').value = 'SuperAdmin123'
                  toast.success('Super Admin credentials filled! Click Sign in.')
                }}
              >
                <Shield size={16} className="mr-2" />
                <span className="text-xs">Super Admin</span>
              </Button>
            </div>
            
            <div className="mt-3 grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  document.querySelector('input[name="email"]').value = 'student@demo.com'
                  document.querySelector('input[name="password"]').value = 'Student123'
                  toast.success('Demo student credentials filled! Click Sign in.')
                }}
              >
                <User size={16} className="mr-2" />
                <span className="text-xs">Student</span>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  document.querySelector('input[name="email"]').value = 'instructor@demo.com'
                  document.querySelector('input[name="password"]').value = 'Instructor123'
                  toast.success('Demo instructor credentials filled! Click Sign in.')
                }}
              >
                <BookOpenIcon size={16} className="mr-2" />
                <span className="text-xs">Instructor</span>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  document.querySelector('input[name="email"]').value = 'admin@demo.com'
                  document.querySelector('input[name="password"]').value = 'Admin123'
                  toast.success('Demo admin credentials filled! Click Sign in.')
                }}
              >
                <Shield size={16} className="mr-2" />
                <span className="text-xs">Admin</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
