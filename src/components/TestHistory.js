"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { toast } from "react-toastify"

const COLORS = ["#10B981", "#EF4444", "#F59E0B"]

const TestHistory = () => {
  const { user } = useSelector((state) => state.auth)
  const [history, setHistory] = useState([])
  const [filteredHistory, setFilteredHistory] = useState([])
  const [validDates, setValidDates] = useState([])
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?._id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")
        const res = await fetch(
          `https://interview-platform-backend-xp3r.onrender.com/api/v1/user/history/${user._id}`,
          {
            method: "GET",
            credentials: "include",
          },
        )

        const data = await res.json()

        if (data.success) {
          setHistory(data.testHistory)
          const testDates = [
            ...new Set(data.testHistory.map((test) => new Date(test.date).toISOString().split("T")[0])),
          ].sort()

          setValidDates(testDates)

          if (testDates.length > 0) {
            setFromDate(testDates[0])
            setToDate(testDates[testDates.length - 1])
            filterHistoryByRange(data.testHistory, testDates[0], testDates[testDates.length - 1])
          }
        } else {
          setError(data.message)
          toast.error(data.message)
        }
      } catch (error) {
        console.error("Error fetching history:", error)
        setError("Failed to fetch test history")
        toast.error("Failed to fetch test history")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [user?._id])

  const filterHistoryByRange = (historyData, from, to) => {
    const filteredData = historyData.filter((test) => {
      const testDate = new Date(test.date).toISOString().split("T")[0]
      return testDate >= from && testDate <= to
    })
    setFilteredHistory(filteredData)
  }

  const handleFromDateChange = (e) => {
    const selected = e.target.value
    if (selected > toDate) {
      toast.error("From date cannot be later than To date!")
      return
    }
    setFromDate(selected)
    filterHistoryByRange(history, selected, toDate)
  }

  const handleToDateChange = (e) => {
    const selected = e.target.value
    if (selected < fromDate) {
      toast.error("To date cannot be earlier than From date!")
      return
    }
    setToDate(selected)
    filterHistoryByRange(history, fromDate, selected)
  }

  const toggleDetails = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const calculateStats = () => {
    if (filteredHistory.length === 0) return { totalTests: 0, averageScore: 0, totalQuestions: 0 }

    const totalTests = filteredHistory.length
    const totalScore = filteredHistory.reduce((sum, test) => sum + test.score, 0)
    const averageScore = (totalScore / totalTests).toFixed(1)
    const totalQuestions = filteredHistory.reduce((sum, test) => sum + test.questionsAttempted.length, 0)

    return { totalTests, averageScore, totalQuestions }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your test history...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Test History</h1>
            <p className="text-gray-600">Track your progress and review your performance</p>
          </div>

          {/* Stats Cards */}
          {filteredHistory.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Tests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageScore}/50</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Questions Answered</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Date Filter */}
          {validDates.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Date Range</h3>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <select
                    value={fromDate}
                    onChange={handleFromDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {validDates.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <select
                    value={toDate}
                    onChange={handleToDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {validDates.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredHistory.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No test history found</h3>
              <p className="text-gray-600 mb-6">
                {validDates.length === 0
                  ? "You haven't taken any tests yet. Start your first test to see your history here."
                  : "No tests found for the selected date range. Try adjusting your date filters."}
              </p>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                Take Your First Test
              </button>
            </div>
          )}

          {/* Test History Cards */}
          <div className="space-y-6">
            {filteredHistory.map((test, index) => {
              const correctCount = test.questionsAttempted.filter((q) => q.userAnswer === q.correctAnswer).length
              const incorrectCount = test.questionsAttempted.length - correctCount
              const skippedCount = test.questionsAttempted.filter((q) => !q.userAnswer).length

              const data = [
                { name: "Correct", value: correctCount },
                { name: "Incorrect", value: incorrectCount },
                ...(skippedCount > 0 ? [{ name: "Skipped", value: skippedCount }] : []),
              ]

              const scorePercentage = ((test.score / 50) * 100).toFixed(1)

              return (
                <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    {/* Test Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                      <div className="mb-4 sm:mb-0">
                        <div className="flex items-center mb-2">
                          <svg
                            className="h-5 w-5 text-gray-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm0 0v4m-4-4h8m-4-8a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(test.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(test.date).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{test.score}/50</p>
                          <p className="text-sm text-gray-500">{scorePercentage}%</p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            scorePercentage >= 80
                              ? "bg-green-100 text-green-800"
                              : scorePercentage >= 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {scorePercentage >= 80 ? "Excellent" : scorePercentage >= 60 ? "Good" : "Needs Improvement"}
                        </div>
                      </div>
                    </div>

                    {/* Chart and Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      {/* Pie Chart */}
                      <div className="flex justify-center">
                        <div className="w-full max-w-sm">
                          <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                              <Pie
                                data={data}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={40}
                                paddingAngle={2}
                              >
                                {data.map((entry, i) => (
                                  <Cell key={`cell-${i}`} fill={COLORS[i]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <span className="font-medium text-green-800">Correct Answers</span>
                          </div>
                          <span className="font-bold text-green-800">{correctCount}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                            <span className="font-medium text-red-800">Incorrect Answers</span>
                          </div>
                          <span className="font-bold text-red-800">{incorrectCount}</span>
                        </div>
                        {skippedCount > 0 && (
                          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                              <span className="font-medium text-yellow-800">Skipped Questions</span>
                            </div>
                            <span className="font-bold text-yellow-800">{skippedCount}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                            <span className="font-medium text-blue-800">Total Questions</span>
                          </div>
                          <span className="font-bold text-blue-800">{test.questionsAttempted.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Details Button */}
                    <button
                      onClick={() => toggleDetails(index)}
                      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <svg
                        className={`h-5 w-5 mr-2 transform transition-transform ${
                          expandedIndex === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      {expandedIndex === index ? "Hide Details" : "View Question Details"}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {expandedIndex === index && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Questions & Answers
                        </h4>
                        <div className="space-y-4">
                          {test.questionsAttempted.map((question, qIndex) => {
                            const isCorrect = question.userAnswer === question.correctAnswer
                            const isSkipped = !question.userAnswer

                            return (
                              <div
                                key={qIndex}
                                className={`p-4 rounded-lg border-l-4 ${
                                  isCorrect
                                    ? "bg-green-50 border-green-400"
                                    : isSkipped
                                      ? "bg-yellow-50 border-yellow-400"
                                      : "bg-red-50 border-red-400"
                                }`}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <h5 className="font-medium text-gray-900">Question {qIndex + 1}</h5>
                                  <div className="flex items-center space-x-2">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        isCorrect
                                          ? "bg-green-100 text-green-800"
                                          : isSkipped
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {isCorrect ? "Correct" : isSkipped ? "Skipped" : "Incorrect"}
                                    </span>
                                    <span className="text-sm font-medium text-gray-600">
                                      Score: {question.score || 0}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-gray-800 mb-3">{question?.questionId?.question || "N/A"}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-sm font-medium text-green-700 mb-1">Correct Answer:</p>
                                    <p className="text-green-800 bg-green-100 px-3 py-2 rounded">
                                      {question.correctAnswer}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Your Answer:</p>
                                    <p
                                      className={`px-3 py-2 rounded ${
                                        isSkipped
                                          ? "text-yellow-800 bg-yellow-100"
                                          : isCorrect
                                            ? "text-green-800 bg-green-100"
                                            : "text-red-800 bg-red-100"
                                      }`}
                                    >
                                      {question.userAnswer || "Not answered"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default TestHistory
