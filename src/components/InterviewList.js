import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/interview/get", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch interviews");
        }

        const data = await response.json();
        setInterviews(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="bg-gray-100">
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Scheduled Interviews</h2>

        {loading ? (
          <p>Loading...</p>
        ) : interviews.length === 0 ? (
          <p>No interviews found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Job Role</th>
                  <th className="border border-gray-300 p-2">Mentor</th>
                  <th className="border border-gray-300 p-2">Date & Time</th>
                  <th className="border border-gray-300 p-2">Duration (min)</th>
                  <th className="border border-gray-300 p-2">Meeting Link</th>
                  <th className="border border-gray-300 p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((interview) => (
                  <tr key={interview._id} className="text-center">
                    <td className="border border-gray-300 p-2">{interview.jobRole}</td>
                    <td className="border border-gray-300 p-2">{interview.mentor}</td>
                    <td className="border border-gray-300 p-2">
                      {new Date(interview.date).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 p-2">{interview.duration}</td>
                    <td className="border border-gray-300 p-2">
                      <a href={interview.meetingLink} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                        Join Meeting
                      </a>
                    </td>
                    <td className="border border-gray-300 p-2">{interview.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewList;
