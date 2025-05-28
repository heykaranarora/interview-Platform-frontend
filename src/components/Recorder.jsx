import { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import { toast } from "react-toastify";

const Recorder = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [assessmentStarted, setAssessmentStarted] = useState(false);

  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [shouldStartRecording, setShouldStartRecording] = useState(false);

  const videoRef = useRef(null);
  const chunks = useRef([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && shouldStartRecording) {
      initiateRecording();
      setShouldStartRecording(false);
    }
  }, [countdown, shouldStartRecording]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/video/random-questions",{
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      const fiveQuestions = data.questions.slice(0, 5);
      setQuestions(fiveQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const initiateRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        setVideoBlob(blob);
        setVideoUrl(URL.createObjectURL(blob));
        chunks.current = [];
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }

    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setRecording(false);
    setMediaRecorder(null);
  };

  const discardVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
      setVideoBlob(null);
      setUploadedUrl(null);
    }
  };

  const saveVideo = async () => {
    if (!videoBlob) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("video", videoBlob);

    try {
      const response = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/video/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setUploadedUrl(data.url);
      setVideoUrl(null);
      setVideoBlob(null);
      setUploadedUrl(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        toast.success("All questions answered! Assessment completed.");
        setAssessmentStarted(false);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
    <Navbar/>
    <div className="flex flex-col items-center p-6 max-w-3xl mx-auto my-10 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md mb-6 p-6">
        <h1 className="text-xl font-bold text-center text-gray-800 mb-4">
          Video Interview Recorder
        </h1>

        {!assessmentStarted ? (
          questions.length > 0 && currentQuestionIndex >= questions.length ? (
            <div className="text-green-600 font-semibold text-xl mt-10 text-center">
              🎉 You have answered all the questions!
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-gray-700 text-center">
                Do you want to start the assessment?
              </p>
              <button
                onClick={() => {
                  setAssessmentStarted(true);
                  setCurrentQuestionIndex(0);
                }}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Start Assessment
              </button>
            </div>
          )
        ) : (
          <>
            <div className="aspect-video bg-black w-full relative mb-4">
              {recording && (
                <div className="absolute top-3 right-3 text-white bg-red-600 text-xs px-2 py-1 rounded-full animate-pulse">
                  REC
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full ${recording ? "block" : "hidden"}`}
              />
              {!recording && videoUrl && (
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              )}
              {!recording && !videoUrl && (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  Camera preview will appear here
                </div>
              )}
            </div>

            <div className="flex flex-col items-center space-y-3 mb-4">
              {recording ? (
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700"
                >
                  Stop Recording
                </button>
              ) : countdown > 0 ? (
                <p className="text-3xl text-gray-700 font-bold">{countdown}</p>
              ) : videoUrl ? (
                <div className="flex space-x-3">
                  <button
                    onClick={discardVideo}
                    className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                  >
                    Discard
                  </button>
                  <button
                    onClick={() => {
                      setCountdown(3);
                      setShouldStartRecording(true);
                    }}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                  >
                    Record Again
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setCountdown(3);
                    setShouldStartRecording(true);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
                >
                  Start Recording
                </button>
              )}
            </div>

            {videoUrl && !recording && (
              <div className="w-full">
                <button
                  onClick={saveVideo}
                  disabled={isUploading}
                  className={`w-full px-4 py-2 text-white font-medium rounded ${
                    isUploading
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isUploading ? "Uploading..." : "Upload Answer"}
                </button>
              </div>
            )}

            {questions.length > 0 && currentQuestionIndex < questions.length && (
              <div className="w-full mt-6 bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h2>
                <p className="text-gray-700">
                  {questions[currentQuestionIndex].question}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default Recorder;
