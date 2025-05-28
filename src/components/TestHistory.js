import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { toast } from "react-toastify";

const COLORS = ["#4CAF50", "#F44336"];

const TestHistory = () => {
  const { user } = useSelector((state) => state.auth);
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [validDates, setValidDates] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?._id) return;

      try {
        const res = await fetch(`https://interview-platform-backend-xp3r.onrender.com/api/v1/user/history/${user._id}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (data.success) {
          setHistory(data.testHistory);

          const testDates = [...new Set(data.testHistory.map((test) => new Date(test.date).toISOString().split("T")[0]))];
          setValidDates(testDates);

          if (testDates.length > 0) {
            setFromDate(testDates[0]); // Default to first available test date
            setToDate(testDates[testDates.length - 1]); // Default to last available test date
            filterHistoryByRange(data.testHistory, testDates[0], testDates[testDates.length - 1]);
          }
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, [user?._id]);

  const filterHistoryByRange = (historyData, from, to) => {
    const filteredData = historyData.filter((test) => {
      const testDate = new Date(test.date).toISOString().split("T")[0];
      return testDate >= from && testDate <= to;
    });
    setFilteredHistory(filteredData);
  };

  const handleFromDateChange = (e) => {
    const selected = e.target.value;
    if (selected > toDate) {
      toast.error("From date cannot be later than To date!");
      return;
    }
    setFromDate(selected);
    filterHistoryByRange(history, selected, toDate);
  };

  const handleToDateChange = (e) => {
    const selected = e.target.value;
    if (selected < fromDate) {
      toast.error("To date cannot be earlier than From date!");
      return;
    }
    setToDate(selected);
    filterHistoryByRange(history, fromDate, selected);
  };

  const toggleDetails = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Test History</h2>

        <div className="mb-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <div>
            <label className="font-semibold">From:</label>
            <select value={fromDate} onChange={handleFromDateChange} className="border rounded-md p-2 ml-2">
              {validDates.map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">To:</label>
            <select value={toDate} onChange={handleToDateChange} className="border rounded-md p-2 ml-2">
              {validDates.map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <p className="text-center text-gray-600">No test history available for the selected date range.</p>
        ) : (
          filteredHistory.map((test, index) => {
            const correctCount = test.questionsAttempted.filter(q => q.userAnswer === q.correctAnswer).length;
            const incorrectCount = test.questionsAttempted.length - correctCount;

            const data = [
              { name: "Correct", value: correctCount },
              { name: "Incorrect", value: incorrectCount },
            ];

            return (
              <div key={index} className="mb-5 p-5 border rounded-lg shadow-md bg-white">
                <p className="text-lg font-semibold">📅 Date: {new Date(test.date).toLocaleDateString()}</p>
                <p className="font-medium text-blue-600">🏆 Score: {test.score} / 50</p>

                <div className="flex justify-center cursor-pointer" onClick={() => toggleDetails(index)}>
                  <PieChart width={300} height={300}>
                    <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={100}>
                      {data.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>

                {expandedIndex === index && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <p className="text-lg font-semibold mb-3">📖 Questions & Answers</p>
                    <ul className="pl-4 space-y-3">
                      {test.questionsAttempted.map((question, qIndex) => (
                        <li key={qIndex} className="p-3 border rounded-md bg-white">
                          <p><strong>❓ Question:</strong> {question?.questionId?.question || "N/A"}</p>
                          <p className="text-green-600"><strong>✅ Correct Answer:</strong> {question.correctAnswer}</p>
                          <p className="text-red-600"><strong>✍️ Your Answer:</strong> {question.userAnswer}</p>
                          <p className="text-gray-700"><strong>🎯 Score:</strong> {question.score}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default TestHistory;
