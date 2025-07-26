"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setLoading } from "../../redux/authSlice"
import { Loader2 } from "lucide-react"
import Navbar from "../Navbar"
import Footer from "../Footer"

const RegisterPage = () => {
    const dispatch = useDispatch()
    const loading = useSelector((state) => state.auth.loading)
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState({})

    const validateField = (name, value, allData = formData) => {
        let error = ""

        switch (name) {
            case "name":
                if (!value.trim()) {
                    error = "Name is required"
                } else if (value.trim().length < 2) {
                    error = "Name must be at least 2 characters"
                }
                break
            case "phoneNumber":
                if (!value.trim()) {
                    error = "Phone number is required"
                } else if (!/^\+?[\d\s-()]{10,}$/.test(value.trim())) {
                    error = "Please enter a valid phone number"
                }
                break
            case "email":
                if (!value.trim()) {
                    error = "Email is required"
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = "Please enter a valid email address"
                }
                break
            case "password":
                if (!value) {
                    error = "Password is required"
                } else if (value.length < 6) {
                    error = "Password must be at least 6 characters"
                } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    error = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                }
                break
            case "confirmPassword":
                if (!value) {
                    error = "Please confirm your password"
                } else if (value !== allData.password) {
                    error = "Passwords do not match"
                }
                break
            default:
                break
        }

        return error
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prevState) => {
            const updatedForm = { ...prevState, [name]: value }

            // Validate current field
            const fieldError = validateField(name, value, updatedForm)

            // Also validate confirm password if password changed
            let confirmPasswordError = ""
            if (name === "password" && updatedForm.confirmPassword) {
                confirmPasswordError = validateField("confirmPassword", updatedForm.confirmPassword, updatedForm)
            }

            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: fieldError,
                ...(name === "password" && { confirmPassword: confirmPasswordError }),
            }))

            return updatedForm
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate all fields
        const newErrors = {}
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key], formData)
            if (error) newErrors[key] = error
        })

        setErrors(newErrors)

        // If there are errors, don't submit
        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fix all errors before submitting")
            return
        }

        try {
            dispatch(setLoading(true))
            const res = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/user/register", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    phoneNumber: formData.phoneNumber,
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await res.json()

            if (data.success) {
                toast.success(data.message)
                navigate("/login")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Signup failed")
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <Navbar />

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full max-w-lg space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
                        <p className="mt-2 text-sm text-gray-600">Join us and start your interview journey</p>
                    </div>

                    {/* Form */}
                    <div className="bg-white py-8 px-6 sm:px-8 shadow-xl rounded-xl border border-gray-100">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-gray-500 focus:border-gray-500"} rounded-lg focus:outline-none focus:ring-2 transition-colors sm:text-sm`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Phone Number Field */}
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        autoComplete="tel"
                                        required
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-3 py-3 border ${errors.phoneNumber ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-gray-500 focus:border-gray-500"} rounded-lg focus:outline-none focus:ring-2 transition-colors sm:text-sm`}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-gray-500 focus:border-gray-500"} rounded-lg focus:outline-none focus:ring-2 transition-colors sm:text-sm`}
                                        placeholder="Enter your email address"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-gray-500 focus:border-gray-500"} rounded-lg focus:outline-none focus:ring-2 transition-colors sm:text-sm`}
                                        placeholder="Create a strong password"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                {!errors.password && formData.password && (
                                    <div className="mt-2">
                                        <div className="text-xs text-gray-500 mb-1">Password strength:</div>
                                        <div className="flex space-x-1">
                                            <div
                                                className={`h-1 w-1/4 rounded ${formData.password.length >= 6 ? "bg-green-400" : "bg-gray-200"}`}
                                            ></div>
                                            <div
                                                className={`h-1 w-1/4 rounded ${/[A-Z]/.test(formData.password) ? "bg-green-400" : "bg-gray-200"}`}
                                            ></div>
                                            <div
                                                className={`h-1 w-1/4 rounded ${/[a-z]/.test(formData.password) ? "bg-green-400" : "bg-gray-200"}`}
                                            ></div>
                                            <div
                                                className={`h-1 w-1/4 rounded ${/\d/.test(formData.password) ? "bg-green-400" : "bg-gray-200"}`}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-10 py-3 border ${errors.confirmPassword ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-gray-500 focus:border-gray-500"} rounded-lg focus:outline-none focus:ring-2 transition-colors sm:text-sm`}
                                        placeholder="Confirm your password"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                                {!errors.confirmPassword &&
                                    formData.confirmPassword &&
                                    formData.password === formData.confirmPassword && (
                                        <p className="mt-1 text-sm text-green-600 flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Passwords match
                                        </p>
                                    )}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        required
                                        className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded transition-colors"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="text-gray-700">
                                        I agree to the{" "}
                                        <Link to="#" className="font-medium text-gray-600 hover:text-gray-500 transition-colors">
                                            Terms and Conditions
                                        </Link>{" "}
                                        and{" "}
                                        <Link to="#" className="font-medium text-gray-600 hover:text-gray-500 transition-colors">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {loading && <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
                                    {loading ? "Creating Account..." : "Create Account"}
                                </button>
                            </div>

                            {/* Sign in link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{" "}
                                    <Link to="/login" className="font-medium text-gray-600 hover:text-gray-500 transition-colors">
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default RegisterPage
