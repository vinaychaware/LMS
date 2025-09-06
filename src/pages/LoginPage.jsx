import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { 
  Eye, 
  EyeOff, 
  BookOpen, 
  Shield,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import useAuthStore from '../store/useAuthStore'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { authAPI } from "../services/api";  


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimer, setLockTimer] = useState(0)
  const [rememberMe, setRememberMe] = useState(false)

  const { login } = useAuthStore()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    // setValue,
    formState: { errors },
  } = useForm()



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

  const formatLockTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }



const onSubmit = async (data) => {
  if (isLocked) {
    toast.error(`Account locked. Try again in ${formatLockTime(lockTimer)}`)
    return
  }

  setIsLoading(true)
  try {
    // ---- LOGIN CALL (Axios via authAPI) ----
    const res = await authAPI.login({
      email: data.email,
      password: data.password,
    })

    // Axios puts payload in res.data
    const payload = res?.data

    // Support both { success, data: { user, token } } and { user, token } shapes
    const envelope = payload?.data ?? payload ?? {}
    const user =
      envelope.user ??
      envelope.userInfo ??
      envelope.profile ??
      null
    const token =
      envelope.token ??
      envelope.accessToken ??
      envelope.jwt ??
      null

    // Optional strict success check if your API returns success boolean
    if (payload?.success === false) {
      throw new Error(payload?.message || "Login failed")
    }

    if (!user || !token) {
      throw new Error("No user after sign in")
    }

    // ---- NORMALIZE ROLE & NAME ----
    const apiRole = String(user.role || "").toUpperCase()
    const normalizedRole =
      apiRole === "SUPER_ADMIN" ? "superadmin" :
      apiRole === "ADMIN" ? "admin" :
      apiRole === "INSTRUCTOR" ? "instructor" :
      "student"

    const uiUser = {
      ...user,
      name: user.fullName || user.name || "User",
      role: normalizedRole,
    }

    // ---- PERSIST AUTH ----
    if (rememberMe) {
      localStorage.setItem("auth_token", token)
      localStorage.setItem("auth_user", JSON.stringify(uiUser))
    } else {
      sessionStorage.setItem("auth_token", token)
      sessionStorage.setItem("auth_user", JSON.stringify(uiUser))
    }

    // ---- SAVE TO STORE ----
    login(uiUser, token)
    setLoginAttempts(0)

    const roleGreeting = {
      superadmin: "Welcome back, Super Administrator!",
      admin: "Welcome back, Administrator!",
      instructor: "Welcome back, Instructor!",
      student: "Welcome back to your learning journey!",
    }
    toast.success(roleGreeting[normalizedRole] || `Welcome back, ${uiUser.name}!`)

    // ---- ROLE-BASED NAV ----
    switch (normalizedRole) {
      case "superadmin":
        navigate("/superadmin")
        break
      case "admin":
        navigate("/admin")
        break
      case "instructor":
        navigate("/instructor")
        break
      default:
        navigate("/dashboard")
    }
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Invalid credentials"

    const newAttempts = loginAttempts + 1
    setLoginAttempts(newAttempts)

    if (newAttempts >= 5) {
      toast.error("Too many failed attempts. Account locked for 15 minutes.")
      startLockTimer()
    } else {
      toast.error(`${message}. ${5 - newAttempts} attempts remaining.`)
    }
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and Header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen size={32} className="text-white" />
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Pugarch
          </h2>
          <p className="text-gray-600 mb-2">
            Sign in to access your learning dashboard
          </p>
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          {/* Security Status */}
          {isLocked && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Lock size={16} className="text-red-600" />
                <span className="text-sm font-medium text-red-800">Account Temporarily Locked</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Too many failed attempts. Try again in {formatLockTime(lockTimer)}
              </p>
            </div>
          )}

          {/* Login Attempts Warning */}
          {loginAttempts > 0 && !isLocked && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle size={16} className="text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  {loginAttempts} failed attempt{loginAttempts > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                {5 - loginAttempts} attempt{5 - loginAttempts !== 1 ? 's' : ''} remaining before account lock
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                leftElement={
                  <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                }
                className="pl-10"
              />
            </div>

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                leftElement={
                  <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                }
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
                className="pl-10 pr-10"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me for 30 days
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full relative" 
                loading={isLoading} 
                disabled={isLoading || isLocked}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Signing you in...
                  </>
                ) : isLocked ? (
                  <>
                    <Lock size={20} className="mr-2" />
                    Locked ({formatLockTime(lockTimer)})
                  </>
                ) : (
                  'Sign in to Pugarch'
                )}
              </Button>
            </div>
          </form>

          {/* Demo Accounts Section (commented out) */}
          {/*
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium">Try Demo Accounts</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => fillDemoCredentials(account.role)}
                  disabled={isLoading || isLocked}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${account.color} rounded-lg flex items-center justify-center text-white shadow-sm`} />
                    <div className="text-left">
                      <div className="font-medium text-gray-900 group-hover:text-gray-700">
                        {account.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {account.description}
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${account.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Fill credentials
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Demo Account Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-700">
                    <li>Click any demo account button above</li>
                    <li>Credentials will be automatically filled</li>
                    <li>Click "Sign in to Pugarch" to access the dashboard</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          */}

          {/* Social Login Options */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast('Google login will be available soon!')}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                Google
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast('Microsoft login will be available soon!')}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                </svg>
                Microsoft
              </Button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield size={14} className="text-gray-500" />
              <span className="text-xs text-gray-600">
                Your data is protected with enterprise-grade security
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <Link to="/help" className="hover:text-gray-700 transition-colors">Help Center</Link>
          <Link to="/privacy" className="hover:text-gray-700 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-gray-700 transition-colors">Terms</Link>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          © 2025 Pugarch. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default LoginPage
