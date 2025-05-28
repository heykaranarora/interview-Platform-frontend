import React, { useEffect, useState } from "react";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Fetch all videos from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/video/all", {
          credentials: "include",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  // Function to shorten the URL for display
  const getShortUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname.slice(0, 20) + "...";
    } catch {
      return "Invalid URL";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Saved Videos</h1>

      {videos.length === 0 ? (
        <p className="text-gray-500">No videos available.</p>
      ) : (
        <table className="w-full bg-white shadow-lg rounded-xl">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">#</th>
              <th className="p-3">Video Name</th>
              <th className="p-3">Uploaded At</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video, index) => (
              <tr key={video._id} className="border-b">
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3 text-blue-500 truncate max-w-xs">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {`Video ${index + 1}`} ({getShortUrl(video.url)})
                  </a>
                </td>
                <td className="p-3 text-center">
                  {new Date(video.uploadedAt).toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => setSelectedVideo(video.url)}
                    className="px-4 py-2 bg-gray-700 text-white rounded"
                  >
                    Play
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Video Popup Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">Playing Video</h2>
            <video src={selectedVideo} controls className="w-full rounded" />
            <button
              onClick={() => setSelectedVideo(null)}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoList;
