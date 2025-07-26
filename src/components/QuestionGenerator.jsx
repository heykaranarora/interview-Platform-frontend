"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Navbar from "./Navbar"

const jobRoles = [
  "Software Engineer",
  "Data Analyst",
  "Cloud Engineer",
  "Network Engineer",
  "System Administrator",
  "MERN Stack Developer",
]

const difficultyLevels = [
  { value: "Easy", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
  { value: "Medium", color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" },
  { value: "Hard", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" },
]

const QuestionGenerator = () => {
  const [selectedRoles, setSelectedRoles] = useState([])
  const [difficulty, setDifficulty] = useState("Easy")
  const [questions, setQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: Setup, 2: Questions
  const navigate = useNavigate()

  const handleSelectRole = (role) => {
    setSelectedRoles((prev) => {
      if (prev.includes(role)) {
        return prev.filter((r) => r !== role)
      } else if (prev.length < 6) {
        return [...prev, role]
      } else {
        toast.warning("You can select up to 6 job roles only")
        return prev
      }
    })
  }

  const fetchQuestions = async () => {
    if (selectedRoles.length === 0) {
      toast.error("Please select at least one job role.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/question/get-question", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobRoles: selectedRoles, difficulty }),
      })

      const data = await res.json()

      if (data.success) {
        setQuestions(data.questions)
        setUserAnswers(Array(data.questions.length).fill(""))
        setCurrentStep(2)
        toast.success(`${data.questions.length} questions generated successfully!`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error("Error fetching questions. Please try again.")
    }
    setLoading(false)
  }

  const handleAnswerChange = (index, answer) => {
    setUserAnswers((prev) => {
      const updatedAnswers = [...prev]
      updatedAnswers[index] = answer
      return updatedAnswers
    })
  }

  const submitAnswers = async () => {
    const unansweredQuestions = userAnswers.filter((ans) => ans.trim() === "").length

    if (unansweredQuestions > 0) {
      toast.error(`Please answer all questions. ${unansweredQuestions} question(s) remaining.`)
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/question/evaluate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: questions.map((q, index) => ({
            questionId: q._id,
            userAnswer: userAnswers[index],
          })),
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Answers submitted successfully!")
        navigate("/test-results")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error("Error submitting answers.")
    }
    setSubmitting(false)
  }

  const resetTest = () => {
    setCurrentStep(1)
    setQuestions([])
    setUserAnswers([])
    setSelectedRoles([])
    setDifficulty("Easy")
  }

  const getAnsweredCount = () => {
    return userAnswers.filter((answer) => answer.trim() !== "").length
  }

  const getProgressPercentage = () => {
    if (questions.length === 0) return 0
    return (getAnsweredCount() / questions.length) * 100
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <Navbar />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
              <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Interview Question Generator</h1>
            <p className="text-gray-600">Create personalized interview questions based on your target roles</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${currentStep >= 1 ? "text-gray-600" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-gray-600 text-white" : "bg-gray-200"}`}
                >
                  1
                </div>
                <span className="ml-2 font-medium">Setup</span>
              </div>
              <div className={`w-16 h-1 ${currentStep >= 2 ? "bg-gray-600" : "bg-gray-200"} rounded`}></div>
              <div className={`flex items-center ${currentStep >= 2 ? "text-gray-600" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-gray-600 text-white" : "bg-gray-200"}`}
                >
                  2
                </div>
                <span className="ml-2 font-medium">Questions</span>
              </div>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-8">
              {/* Job Role Selection */}
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Select Job Roles</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {selectedRoles.length}/6 selected
                  </span>
                </div>
                <p className="text-gray-600 mb-6">Choose up to 6 job roles to generate relevant interview questions</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleSelectRole(role)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedRoles.includes(role)
                          ? "border-gray-500 bg-gray-50 text-gray-700"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{role}</span>
                        {selectedRoles.includes(role) && (
                          <svg
                            className="h-5 w-5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedRoles.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Selected Roles:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                        >
                          {role}
                          <button onClick={() => handleSelectRole(role)} className="ml-2 hover:text-gray-600">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Difficulty Selection */}
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Select Difficulty Level</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {difficultyLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setDifficulty(level.value)}
                      className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                        difficulty === level.value
                          ? `${level.borderColor} ${level.bgColor} ${level.color}`
                          : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <div className="text-center">
                        <div
                          className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                            difficulty === level.value ? level.bgColor : "bg-gray-100"
                          }`}
                        >
                          {level.value === "Easy" && (
                            <svg
                              className={`h-6 w-6 ${difficulty === level.value ? level.color : "text-gray-400"}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                          {level.value === "Medium" && (
                            <svg
                              className={`h-6 w-6 ${difficulty === level.value ? level.color : "text-gray-400"}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                          {level.value === "Hard" && (
                            <svg
                              className={`h-6 w-6 ${difficulty === level.value ? level.color : "text-gray-400"}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                          )}
                        </div>
                        <h4 className="font-bold text-lg mb-2">{level.value}</h4>
                        <p className="text-sm text-gray-600">
                          {level.value === "Easy" && "Basic concepts and fundamental questions"}
                          {level.value === "Medium" && "Intermediate topics with practical scenarios"}
                          {level.value === "Hard" && "Advanced concepts and complex problem-solving"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Questions Button */}
              <div className="text-center">
                <button
                  onClick={fetchQuestions}
                  disabled={loading || selectedRoles.length === 0}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {loading ? "Generating Questions..." : "Generate Questions"}
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && questions.length > 0 && (
            <div className="space-y-8">
              {/* Progress Header */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Answer All Questions</h3>
                    <p className="text-gray-600">Complete all {questions.length} questions to submit your test</p>
                  </div>
                  <button
                    onClick={resetTest}
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Start Over
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>
                      {getAnsweredCount()}/{questions.length} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>

                {/* Selected Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Selected Roles:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedRoles.map((role) => (
                        <span
                          key={role}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Difficulty:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs ${
                        difficulty === "Easy"
                          ? "bg-green-100 text-green-800"
                          : difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {questions.map((q, index) => (
                  <div key={q._id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold mr-3">
                            {index + 1}
                          </span>
                          Question {index + 1}
                        </h4>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            userAnswers[index]?.trim() ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {userAnswers[index]?.trim() ? "Answered" : "Pending"}
                        </div>
                      </div>

                      <p className="text-gray-800 mb-4 leading-relaxed">{q.question}</p>

                      <div className="relative">
                        <textarea
                          value={userAnswers[index]}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors resize-none"
                          rows="4"
                          placeholder="Type your answer here..."
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                          {userAnswers[index]?.length || 0} characters
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="text-center pt-8">
                <button
                  onClick={submitAnswers}
                  disabled={submitting || getAnsweredCount() < questions.length}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  {submitting && (
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {submitting ? "Submitting Answers..." : "Submit All Answers"}
                </button>

                {getAnsweredCount() < questions.length && (
                  <p className="mt-3 text-sm text-gray-600">
                    Please answer all questions before submitting ({questions.length - getAnsweredCount()} remaining)
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestionGenerator
