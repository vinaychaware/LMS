import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, User, BookOpen, GraduationCap, Settings, LogOut, Shield } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import Button from '../ui/Button'
import logo from "../../assets/logo.png"; // adjust path based on where Navbar.jsx is

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, userRole, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const getRoleIcon = () => {
    switch (userRole) {
      case 'superadmin':
        return <Shield size={20} />
      case 'student':
        return <GraduationCap size={20} />
      case 'instructor':
        return <BookOpen size={20} />
      case 'admin':
        return <Settings size={20} />
      default:
        return <User size={20} />
    }
  }

  const getRoleLabel = () => {
    switch (userRole) {
      case 'superadmin':
        return 'Super Admin'
      case 'student':
        return 'Student'
      case 'instructor':
        return 'Instructor'
      case 'admin':
        return 'Admin'
      default:
        return 'User'
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center">
              <img
                src={logo}
                alt="Pugarch Logo"
                className="h-16 sm:h-20 md:h-28 lg:h-36 w-auto object-contain mx-auto"
              />

            </div>
            {/* <span className="text-2xl font-extrabold text-gray-900 tracking-wide">
              Pugarch
            </span> */}
          </Link>



          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                {userRole === 'superadmin' ? (
                  <Link
                    to="/superadmin"
                    className={`text-sm font-medium transition-colors ${isActive('/superadmin')
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                      }`}
                  >
                    Super Admin
                  </Link>
                ) : userRole === 'admin' ? (
                  <Link
                    to="/admin"
                    className={`text-sm font-medium transition-colors ${isActive('/admin')
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                      }`}
                  >
                    Admin Panel
                  </Link>
                ) : userRole === 'instructor' ? (
                  <Link
                    to="/instructor"
                    className={`text-sm font-medium transition-colors ${isActive('/instructor')
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                      }`}
                  >
                    My Courses
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className={`text-sm font-medium transition-colors ${isActive('/dashboard')
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                      }`}
                  >
                    My Learning
                  </Link>
                )}
                <Link
                  to="/courses"
                  className={`text-sm font-medium transition-colors ${isActive('/courses')
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                    }`}
                >
                  Browse Courses
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/courses"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Browse Courses
                </Link>
                <Link
                  to="/about"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  About
                </Link>
              </>
            )}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  {getRoleIcon()}
                  <span>{getRoleLabel()}</span>
                </div>
                <div className="text-sm text-gray-900 font-medium">
                  {user?.name}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {isAuthenticated ? (
              <>
                {userRole === 'superadmin' ? (
                  <Link
                    to="/superadmin"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/superadmin')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Super Admin
                  </Link>
                ) : userRole === 'admin' ? (
                  <Link
                    to="/admin"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                ) : userRole === 'instructor' ? (
                  <Link
                    to="/instructor"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/instructor')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Courses
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Learning
                  </Link>
                )}
                <Link
                  to="/courses"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/courses')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Browse Courses
                </Link>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    Signed in as {user?.name} ({getRoleLabel()})
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/courses"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Browse Courses
                </Link>
                <Link
                  to="/about"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar