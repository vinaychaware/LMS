import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, BookOpen as BookOpenIcon, User, Shield } from "lucide-react";
import { toast } from "react-hot-toast";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { authAPI } from "../services/api";

const ROLES = [
  {
    id: "student",
    title: "Student",
    // description: "Learn from expert instructors and track your progress",
    icon: <User size={24} />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "instructor",
    title: "Instructor",
    // description: "Create and manage courses, assignments, and assessments",
    icon: <BookOpenIcon size={24} />,
    color: "bg-green-100 text-green-600",
  },
  {
    id: "admin",
    title: "Admin",
    // description: "Manage users, courses, and platform settings",
    icon: <Shield size={24} />,
    color: "bg-purple-100 text-purple-600",
  },
];

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: String(selectedRole || "student").toUpperCase(), // STUDENT | INSTRUCTOR | ADMIN

      };

      await authAPI.register(payload);
      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-10 sm:w-12 h-10 sm:h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <BookOpenIcon size={24} className="text-white" />
          </div>
        </div>
        <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900">
        Add Users
        </h2>
        {/* <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
          Or{" "}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
          </Link>
        </p> */}
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-10 shadow sm:rounded-lg">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                I want to join as:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                      selectedRole === role.id
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${role.color}`}
                    >
                      {role.icon}
                    </div>
                    <div className="text-center">
                      <div className="text-sm sm:text-base font-medium text-gray-900">
                        {role.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 hidden sm:block">
                        {role.description}
                      </div>
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
                error={errors.fullName?.message}
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                  maxLength: { value: 100, message: "Name must be at most 100 characters" },
                })}
              />
            </div>

            <div>
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>

            <div>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                error={errors.password?.message}
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={() => setShowPasswordRequirements(false)}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                  },
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
                    <li className={`flex items-center space-x-2 ${password?.length >= 8 ? "text-green-600" : ""}`}>
                      <span>{password?.length >= 8 ? "✓" : "○"}</span>
                      <span>At least 8 characters</span>
                    </li>
                    <li className={`flex items-center space-x-2 ${/[a-z]/.test(password || "") ? "text-green-600" : ""}`}>
                      <span>{/[a-z]/.test(password || "") ? "✓" : "○"}</span>
                      <span>One lowercase letter</span>
                    </li>
                    <li className={`flex items-center space-x-2 ${/[A-Z]/.test(password || "") ? "text-green-600" : ""}`}>
                      <span>{/[A-Z]/.test(password || "") ? "✓" : "○"}</span>
                      <span>One uppercase letter</span>
                    </li>
                    <li className={`flex items-center space-x-2 ${/\d/.test(password || "") ? "text-green-600" : ""}`}>
                      <span>{/\d/.test(password || "") ? "✓" : "○"}</span>
                      <span>One number</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <Input
                label="Confirm password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
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
                {...register("agreeTerms", { required: "You must agree to the terms and conditions" })}
              />
              <label htmlFor="agree-terms" className="ml-2 block text-xs sm:text-sm text-gray-900">
                I agree to the{" "}
                <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="font-medium text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeTerms && <p className="text-sm text-red-600">{errors.agreeTerms.message}</p>}

            <div>
              <Button type="submit" className="w-full" size="lg" loading={isLoading} disabled={isLoading}>
                Add User
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
