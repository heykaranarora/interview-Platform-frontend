import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Navbar from "./Navbar";
import { toast } from "react-toastify";

const COLORS = ["#4CAF50", "#F44336"]; // Green for correct, Red for incorrect

const TestResults = () => {
  const [results, setResults] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/question/get-test-results", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (data.success) {
          setResults(data.testHistory);
        } else {
          toast.erroe(data.message);
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };

    fetchResults();
  }, [navigate]);

  if (!results) return <div className="text-center mt-10 text-xl">Loading results...</div>;

  const correctCount = results.questionsAttempted.filter(q => q.userAnswer === q.correctAnswer).length;
  const incorrectCount = results.questionsAttempted.length - correctCount;

  const data = [
    { name: "Correct", value: correctCount },
    { name: "Incorrect", value: incorrectCount },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6 max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Test Results</h2>
        <PieChart width={300} height={300} className="mx-auto cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={100}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>

        {showDetails && results.questionsAttempted.map((q, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-md mt-4 text-left">
            <p className="text-gray-800 dark:text-white">{q.questionId.question}</p>
            <p className="text-gray-600 dark:text-gray-300">Your Answer: {q.userAnswer}</p>
            <p className="text-gray-600 dark:text-gray-300">Correct Answer: {q.correctAnswer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestResults;
