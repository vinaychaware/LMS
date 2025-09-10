import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  BookOpen,
  GraduationCap,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import Button from "../ui/Button";
import logo from "../../assets/logo.png"; // adjust path based on where Navbar.jsx is

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // <-- added
  const { user, isAuthenticated, userRole, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Final logout action
  const confirmLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
    setShowLogoutConfirm(false);
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case "superadmin":
        return <Shield size={20} />;
      case "student":
        return <GraduationCap size={20} />;
      case "instructor":
        return <BookOpen size={20} />;
      case "admin":
        return <Settings size={20} />;
      default:
        return <User size={20} />;
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case "superadmin":
        return "Super Admin";
      case "student":
        return "Student";
      case "instructor":
        return "Instructor";
      case "admin":
        return "Admin";
      default:
        return "User";
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center">
              <img
                src={logo}
                alt="Pugarch Logo"
                className=" h-12 sm:h-16 md:h-20 lg:h-24 xl:h-28
                  w-auto
                  object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {isAuthenticated ? (
              <>
                {userRole === "superadmin" ? (
                  <Link
                    to="/superadmin"
                    className={`text-sm font-medium transition-colors ${
                      isActive("/superadmin")
                        ? "text-primary-600"
                        : "text-gray-700 hover:text-primary-600"
                    }`}
                  >
                    Super Admin
                  </Link>
                ) : userRole === "admin" ? (
                  <Link
                    to="/admin"
                    className={`text-sm font-medium transition-colors ${
                      isActive("/admin")
                        ? "text-primary-600"
                        : "text-gray-700 hover:text-primary-600"
                    }`}
                  >
                    Admin Panel
                  </Link>
                ) : userRole === "instructor" ? (
                  <Link
                    to="/instructor"
                    className={`text-sm font-medium transition-colors ${
                      isActive("/instructor")
                        ? "text-primary-600"
                        : "text-gray-700 hover:text-primary-600"
                    }`}
                  >
                    My Courses
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className={`text-sm font-medium transition-colors ${
                      isActive("/dashboard")
                        ? "text-primary-600"
                        : "text-gray-700 hover:text-primary-600"
                    }`}
                  >
                    My Learning
                  </Link>
                )}
                <Link
                  to="/courses"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/courses")
                      ? "text-primary-600"
                      : "text-gray-700 hover:text-primary-600"
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
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 xl:space-x-3">
                <div className="hidden xl:flex items-center space-x-2 text-sm text-gray-700">
                  {getRoleIcon()}
                  <span>{getRoleLabel()}</span>
                </div>
                <div className="text-sm text-gray-900 font-medium max-w-32 truncate">
                  {user?.name}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLogoutConfirm(true)} // <-- changed
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
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
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
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {isAuthenticated ? (
              <>
                {/* role-based links ... */}

                <Link
                  to="/courses"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/courses")
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Browse Courses
                </Link>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon()}
                      <span>Signed in as {user?.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ({getRoleLabel()})
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLogoutConfirm(true)} // <-- changed
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* non-auth links */}
              </>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-900">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to log out?
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={confirmLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
