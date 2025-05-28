import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

const jobRoles = [
  "Software Engineer", "Data Analyst", "Cloud Engineer",
  "Network Engineer", "System Administrator", "MERN Stack Developer"
];

const difficultyLevels = ["Easy", "Medium", "Hard"];

const QuestionGenerator = () => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [difficulty, setDifficulty] = useState("Easy");
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Navigation Hook

  const handleSelectRole = (role) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : prev.length < 6 ? [...prev, role] : prev
    );
  };

  const fetchQuestions = async () => {
    if (selectedRoles.length === 0) {
      toast.error("Please select at least one job role.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/question/get-question", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobRoles: selectedRoles, difficulty }),
      });

      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions);
        setUserAnswers(Array(data.questions.length).fill(""));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching questions. Please try again.");
    }
    setLoading(false);
  };

  const handleAnswerChange = (index, answer) => {
    setUserAnswers(prev => {
      const updatedAnswers = [...prev];
      updatedAnswers[index] = answer;
      return updatedAnswers;
    });
  };

  const submitAnswers = async () => {
    if (userAnswers.some(ans => ans.trim() === "")) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

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
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Answers submitted successfully!");
        navigate("/test-results"); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error submitting answers.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Generate Interview Questions</h2>

        {/* Job Role Selection */}
        <div className="mb-6 bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Select up to 6 Job Roles</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {jobRoles.map(role => (
              <button 
                key={role}
                onClick={() => handleSelectRole(role)}
                className={`px-4 py-2 rounded-lg transition font-medium
                  ${selectedRoles.includes(role) ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-6 bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Select Difficulty</h3>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border p-3 rounded-lg w-full focus:ring focus:ring-blue-300"
          >
            {difficultyLevels.map(level => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Fetch Questions Button */}
        <button
          onClick={fetchQuestions}
          disabled={loading}
          className={`w-full px-6 py-3 font-semibold text-white rounded-lg transition ${loading ? "bg-gray-700" : " bg-gray-800 hover:bg-gray-700"}`}
        >
          {loading ? "Loading..." : "Get Questions"}
        </button>

        {/* Display Questions and Answer Fields */}
        {questions.length > 0 && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Answer all questions:</h3>
            {questions.map((q, index) => (
              <div key={q._id} className="mb-4 p-4 border rounded-md bg-gray-50">
                <p className="font-medium">{index + 1}. {q.question}</p>
                <input
                  type="text"
                  value={userAnswers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="border p-3 w-full mt-2 rounded-md focus:ring focus:ring-blue-200"
                />
              </div>
            ))}
            <button
              onClick={submitAnswers}
              className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg mt-3 hover:bg-gray-700 transition"
            >
              Submit All Answers
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionGenerator;
