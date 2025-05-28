import { useState } from "react"
import { useSelector } from "react-redux"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { toast } from "react-toastify"

const MCQTest = () => {
  const [topic, setTopic] = useState("")
  const [questions, setQuestions] = useState([])
  const [correctAnswers, setCorrectAnswers] = useState([])
  const [userAnswers, setUserAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const userId = useSelector((state) => state.auth.userId)
  const predefinedTopics = ["JavaScript", "Python", "React.js", "Node.js", "MongoDB", "Data Structures"]

  const fetchQuestions = async () => {
    if (!topic) return toast.error("Please select a topic.")
    setLoading(true)
    try {
      const response = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/mcq/generate", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      })

      const data = await response.json()
      setQuestions(data.questions)
      setCorrectAnswers(data.questions.map((q) => q.correctAnswer))
      setUserAnswers(new Array(5).fill(null))
      setResult(null)
    } catch (error) {
      console.error("Error fetching questions:", error)
    }
    setLoading(false)
  }

  const handleAnswer = (index, answer) => {
    const updatedAnswers = [...userAnswers]
    updatedAnswers[index] = answer
    setUserAnswers(updatedAnswers)
  }

  const submitTest = async () => {
    if (userAnswers.includes(null)) return toast.error("Please answer all questions.")
    setLoading(true)
    try {
      const response = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/mcq/submit", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, topic, userAnswers, correctAnswers }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error submitting test:", error)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gray-800">
            Knowledge Challenge
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Test your skills and earn badges with our interactive quizzes
          </p>
        </div>

        {/* Topic Selection Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transform transition-all hover:shadow-xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Select Your Topic
          </h2>

          <div className="relative">
            <select
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option value="">-- Select a Topic --</option>
              {predefinedTopics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <button
            onClick={fetchQuestions}
            disabled={loading || !topic}
            className={`mt-4 w-full py-3 rounded-lg font-semibold text-white transition-all ${
              !topic
                ? "bg-gray-400 cursor-not-allowed"
                : loading
                  ? "bg-gray-400 cursor-wait"
                  : "bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75 bg-gray-800"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating Questions...
              </span>
            ) : (
              "Start Quiz"
            )}
          </button>
        </div>

        {/* Questions Section */}
        {questions.length > 0 && (
          <div className="space-y-6 mb-8">
            {questions.map((q, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transform transition-all hover:shadow-lg"
              >
                <div className="flex items-start mb-4">
                  <span className="flex-shrink-0 bg-purple-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{q.question}</h3>
                </div>

                <div className="ml-11 space-y-2">
                  {q.options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                        userAnswers[i] === option
                          ? "bg-purple-100 dark:bg-gray-900 border-2 border-gray-500 dark:border-gray-400"
                          : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 flex-shrink-0 rounded-full border ${
                          userAnswers[i] === option
                            ? "border-gray-500 bg-gray-500 dark:border-gray-400 dark:bg-gray-400"
                            : "border-gray-300 dark:border-gray-500"
                        } flex items-center justify-center mr-3`}
                      >
                        {userAnswers[i] === option && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                      <span className="text-gray-700 dark:text-gray-200">{option}</span>
                      <input
                        type="radio"
                        name={`q${i}`}
                        value={option}
                        onChange={() => handleAnswer(i, option)}
                        checked={userAnswers[i] === option}
                        className="sr-only"   
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={submitTest}
              disabled={loading || result !== null || userAnswers.includes(null)}
              className={`w-full py-4 rounded-xl text-white text-lg font-bold transition-all ${
                userAnswers.includes(null)
                  ? "bg-gray-400 cursor-not-allowed"
                  : loading
                    ? "bg-green-500 cursor-wait"
                    : result !== null
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
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
                  Submitting...
                </span>
              ) : userAnswers.includes(null) ? (
                "Answer All Questions to Submit"
              ) : result !== null ? (
                "Test Submitted"
              ) : (
                "Submit Answers"
              )}
            </button>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-yellow-300 dark:border-yellow-600 animate-fade-in">
            <div className="text-center">
              <div className="inline-block p-4 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Quiz Completed!</h2>

              <div className="text-5xl font-extrabold text-yellow-600 dark:text-yellow-400 my-4">
                {result.correctCount}/5
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {result.correctCount === 5
                  ? "Perfect score! Excellent work!"
                  : result.correctCount >= 3
                    ? "Good job! You're making progress."
                    : "Keep practicing to improve your score."}
              </p>

              {result.badgeEarned && (
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900 dark:to-amber-900 rounded-lg inline-block">
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-amber-600 dark:text-amber-400 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                    <span className="text-xl font-bold text-amber-800 dark:text-amber-300">
                      Badge Earned: {result.badgeEarned}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setQuestions([])
                  setUserAnswers([])
                  setResult(null)
                  setTopic("")
                }}
                className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white font-semibold rounded-lg transition-colors"
              >
                Take Another Quiz
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default MCQTest
