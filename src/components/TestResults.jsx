"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import Navbar from "./Navbar"
import { toast } from "react-toastify"

const COLORS = ["#10B981", "#EF4444", "#F59E0B"] // Green for correct, Red for incorrect, Yellow for skipped

const TestResults = () => {
  const [results, setResults] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        setError("")
        const res = await fetch(
          "https://interview-platform-backend-xp3r.onrender.com/api/v1/question/get-test-results",
          {
            method: "GET",
            credentials: "include",
          },
        )

        const data = await res.json()

        if (data.success) {
          setResults(data.testHistory)
        } else {
          setError(data.message)
          toast.error(data.message)
          setTimeout(() => navigate("/"), 2000)
        }
      } catch (error) {
        console.error("Error fetching test results:", error)
        setError("Failed to fetch test results")
        toast.error("Failed to fetch test results")
        setTimeout(() => navigate("/"), 2000)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-blue-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculating Your Results...</h2>
            <p className="text-gray-600">Please wait while we process your test performance</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-white to-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 mb-6">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Results</h2>
            <p className="text-gray-600 mb-6">{error || "Something went wrong while fetching your test results."}</p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const correctCount = results.questionsAttempted.filter((q) => q.userAnswer === q.correctAnswer).length
  const incorrectCount = results.questionsAttempted.filter(
    (q) => q.userAnswer && q.userAnswer !== q.correctAnswer,
  ).length
  const skippedCount = results.questionsAttempted.filter((q) => !q.userAnswer).length

  const data = [
    { name: "Correct", value: correctCount },
    { name: "Incorrect", value: incorrectCount },
    ...(skippedCount > 0 ? [{ name: "Skipped", value: skippedCount }] : []),
  ]

  const totalQuestions = results.questionsAttempted.length
  const scorePercentage = ((results.score / 50) * 100).toFixed(1)
  const accuracy = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(1) : 0

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 80) return { level: "Excellent", color: "text-green-600", bgColor: "bg-green-100" }
    if (percentage >= 60) return { level: "Good", color: "text-blue-600", bgColor: "bg-blue-100" }
    if (percentage >= 40) return { level: "Average", color: "text-yellow-600", bgColor: "bg-yellow-100" }
    return { level: "Needs Improvement", color: "text-red-600", bgColor: "bg-red-100" }
  }

  const performance = getPerformanceLevel(scorePercentage)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Test Completed!</h1>
            <p className="text-gray-600">Here's how you performed on your test</p>
          </div>

          {/* Score Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white text-3xl font-bold mb-4">
                {results.score}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Score: {results.score}/50</h2>
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full ${performance.bgColor} ${performance.color} font-medium`}
              >
                {performance.level} ({scorePercentage}%)
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-green-700 font-medium">Correct</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
                <div className="text-sm text-red-700 font-medium">Incorrect</div>
              </div>
              {skippedCount > 0 && (
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{skippedCount}</div>
                  <div className="text-sm text-yellow-700 font-medium">Skipped</div>
                </div>
              )}
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
                <div className="text-sm text-blue-700 font-medium">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Performance Breakdown</h3>
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={50}
                      paddingAngle={2}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <svg
                className={`h-5 w-5 mr-2 transform transition-transform ${showDetails ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
              {showDetails ? "Hide" : "View"} Question Details
            </button>
            <button
              onClick={() => navigate("/test-history")}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              View Full History
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Take Another Test
            </button>
          </div>

          {/* Question Details */}
          {showDetails && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Question by Question Analysis
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {results.questionsAttempted.map((q, index) => {
                    const isCorrect = q.userAnswer === q.correctAnswer
                    const isSkipped = !q.userAnswer

                    return (
                      <div
                        key={index}
                        className={`p-4 sm:p-6 rounded-lg border-l-4 ${
                          isCorrect
                            ? "bg-green-50 border-green-400"
                            : isSkipped
                              ? "bg-yellow-50 border-yellow-400"
                              : "bg-red-50 border-red-400"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Question {index + 1}</h4>
                          <div className="flex items-center space-x-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                isCorrect
                                  ? "bg-green-100 text-green-800"
                                  : isSkipped
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {isCorrect ? "✓ Correct" : isSkipped ? "⊘ Skipped" : "✗ Incorrect"}
                            </span>
                            <span className="text-sm font-medium text-gray-600">Score: {q.score || 0}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-800 font-medium mb-3">
                            {q.questionId?.question || "Question not available"}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-green-700">Correct Answer:</p>
                            <div className="p-3 bg-green-100 rounded-lg">
                              <p className="text-green-800 font-medium">{q.correctAnswer}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Your Answer:</p>
                            <div
                              className={`p-3 rounded-lg ${
                                isSkipped ? "bg-yellow-100" : isCorrect ? "bg-green-100" : "bg-red-100"
                              }`}
                            >
                              <p
                                className={`font-medium ${
                                  isSkipped ? "text-yellow-800" : isCorrect ? "text-green-800" : "text-red-800"
                                }`}
                              >
                                {q.userAnswer || "Not answered"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Motivational Message */}
          <div className="text-center mt-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 sm:p-8 text-white">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                {scorePercentage >= 80
                  ? "Outstanding Performance! 🎉"
                  : scorePercentage >= 60
                    ? "Great Job! Keep it up! 👏"
                    : scorePercentage >= 40
                      ? "Good effort! Room for improvement! 💪"
                      : "Don't give up! Practice makes perfect! 🚀"}
              </h3>
              <p className="text-blue-100">
                {scorePercentage >= 80
                  ? "You've demonstrated excellent knowledge and skills. Keep up the fantastic work!"
                  : scorePercentage >= 60
                    ? "You're on the right track! A little more practice will help you reach excellence."
                    : scorePercentage >= 40
                      ? "You have a good foundation. Focus on your weak areas and you'll improve quickly."
                      : "Every expert was once a beginner. Keep practicing and you'll see improvement soon!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestResults
