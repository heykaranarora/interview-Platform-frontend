import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const InterviewForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobRole: "",
    date: "",
    duration: "",
    mentor: "",
  });

  const interviewers = ["Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Lee"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.jobRole || !formData.date || !formData.duration || !formData.mentor) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/interview/schedule", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Interview scheduled successfully.");
        navigate("/");
        setFormData({ jobRole: "", date: "", duration: "", mentor: "" });
      } else {
        toast.error(response.statusText);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Schedule an Interview</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="jobRole"
              placeholder="Job Role"
              value={formData.jobRole}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <input
              type="number"
              name="duration"
              placeholder="Duration (minutes)"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <select
              name="mentor"
              value={formData.mentor}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select an Interviewer</option>
              {interviewers.map((mentor, index) => (
                <option key={index} value={mentor}>{mentor}</option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-700"
            >
              Schedule Interview
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InterviewForm;
