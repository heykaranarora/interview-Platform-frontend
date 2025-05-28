import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const ResumeForm = () => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const userId = user?._id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    summary: "",
    skills: "",
    education: [{ degree: "", school: "", year: "" }],
    projects: [{ title: "", description: "" }],
    experience: [{ company: "", position: "", duration: "" }],
  });

  const [resumeUrl, setResumeUrl] = useState("");
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDynamicChange = (index, field, value, type) => {
    const updatedData = [...formData[type]];
    updatedData[index][field] = value;
    setFormData({ ...formData, [type]: updatedData });
  };


  const addField = (type) => {
    let newItem = {}

    if (type === "education") {
      newItem = { degree: "", school: "", year: "" }
    } else if (type === "projects") {
      newItem = { title: "", description: "" }
    } else if (type === "experience") {
      newItem = { company: "", position: "", duration: "" }
    }

    setFormData({ ...formData, [type]: [...formData[type], newItem] })
  }

  const removeField = (index, type) => {
    if (formData[type].length <= 1) return

    const updatedData = formData[type].filter((_, i) => i !== index)
    setFormData({ ...formData, [type]: updatedData })
  }


  const handleGenerateResume = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User  not found!");
      return;
    }

    try {
      const response = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/resume/generate-resume", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId, skills: formData.skills.split(",") }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Resume generated successfully!");
        setResumeUrl(`https://interview-platform-backend-xp3r.onrender.com${data.filePath}`);
      } else {
        console.error("Failed to generate resume", data);
      }
    } catch (error) {
      console.error("Error generating resume", error);
    }
  };

  useEffect(() => {
    const fetchResume = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`https://interview-platform-backend-xp3r.onrender.com/api/v1/resume/get-resume/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setResumeUrl(data.resumeUrl);
        }
      } catch (error) {
        console.error("No existing resume found");
      }
    };
    fetchResume();
  }, [userId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadResume = async () => {
    if (!file || !userId) {
      toast.error("Please select a file and ensure user is logged in!");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("resume", file);
    uploadFormData.append("userId", userId);

    try {
      const response = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/resume/upload-resume", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();
      if (response.ok) {
        setResumeUrl(`https://interview-platform-backend-xp3r.onrender.com/${data.filePath}`);
        toast.success("Resume uploaded successfully!");
        navigate("/profile")
      } else {
        toast.error("Failed to upload resume", data);
      }
    } catch (error) {
      console.error("Error uploading resume", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-800 text-white py-4 px-6">
            <h2 className="text-2xl font-bold">Create Your Professional Resume</h2>
            <p className="text-gray-300 text-sm mt-1">Fill in the details below to generate a polished resume</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleGenerateResume} className="space-y-8">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={user.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                        placeholder="(123) 456-7890"
                      value={user.phoneNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      name="linkedin"
                      placeholder="linkedin.com/in/johndoe"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                    <input
                      type="text"
                      name="github"
                      placeholder="github.com/johndoe"
                      value={formData.github}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                  Professional Summary
                </h3>
                <textarea
                  name="summary"
                  placeholder="Write a brief summary of your professional background and goals..."
                  value={formData.summary}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>

              {/* Skills Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Skills</h3>
                <input
                  type="text"
                  name="skills"
                  placeholder="JavaScript, React, Node.js, CSS, HTML, etc. (comma-separated)"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>

              {/* Education Section */}
              <div>
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-700">Education</h3>
                  <button
                    type="button"
                    onClick={() => addField("education")}
                    className="bg-gray-700 text-white py-1 px-3 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                  >
                    + Add Education
                  </button>
                </div>

                {formData.education.map((edu, index) => (
                  <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-700">Education #{index + 1}</h4>
                      {formData.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField(index, "education")}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                        <input
                          type="text"
                          placeholder="Bachelor of Science in Computer Science"
                          value={edu.degree}
                          onChange={(e) => handleDynamicChange(index, "degree", e.target.value, "education")}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School/University</label>
                        <input
                          type="text"
                          placeholder="University Name"
                          value={edu.school}
                          onChange={(e) => handleDynamicChange(index, "school", e.target.value, "education")}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <input
                          type="text"
                          placeholder="2018 - 2022"
                          value={edu.year}
                          onChange={(e) => handleDynamicChange(index, "year", e.target.value, "education")}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Projects Section */}
              <div>
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-700">Projects</h3>
                  <button
                    type="button"
                    onClick={() => addField("projects")}
                    className="bg-gray-700 text-white py-1 px-3 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                  >
                    + Add Project
                  </button>
                </div>

                {formData.projects.map((project, index) => (
                  <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-700">Project #{index + 1}</h4>
                      {formData.projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField(index, "projects")}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={project.title}
                          onChange={(e) => handleDynamicChange(index, "title", e.target.value, "projects")}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          placeholder="Describe your project, technologies used, and your role"
                          value={project.description}
                          onChange={(e) => handleDynamicChange(index, "description", e.target.value, "projects")}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Experience Section */}
              <div>
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-700">Work Experience</h3>
                  <button
                    type="button"
                    onClick={() => addField("experience")}
                    className="bg-gray-700 text-white py-1 px-3 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                  >
                    + Add Experience
                  </button>
                </div>

                {formData.experience.map((exp, index) => (
                  <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-700">Experience #{index + 1}</h4>
                      {formData.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField(index, "experience")}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={exp.company}
                          onChange={(e) => handleDynamicChange(index, "company", e.target.value, "experience")}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        <input
                          type="text"
                          placeholder="Job Title"
                          value={exp.position}
                          onChange={(e) => handleDynamicChange(index, "position", e.target.value, "experience")}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          placeholder="Jan 2020 - Present"
                          value={exp.duration}
                          onChange={(e) => handleDynamicChange(index, "duration", e.target.value, "experience")}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-3 px-6 rounded-lg text-white font-medium ${
                    isLoading ? "bg-gray-400" : "bg-gray-800 hover:bg-gray-700"
                  } transition-colors flex justify-center items-center`}
                >
                  {isLoading ? (
                    <>
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
                      Generating...
                    </>
                  ) : (
                    "Generate Resume"
                  )}
                </button>

                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    download
                    className="flex-1 py-3 px-6 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-500 transition-colors text-center"
                  >
                    Download Resume
                  </a>
                )}
              </div>
            </form>

            {/* Upload Existing Resume */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Upload Existing Resume</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleUploadResume}
                  disabled={isLoading || !file}
                  className={`md:self-end py-3 px-6 rounded-lg text-white font-medium ${
                    isLoading || !file ? "bg-gray-400" : "bg-gray-800 hover:bg-gray-700"
                  } transition-colors`}
                >
                  {isLoading ? "Uploading..." : "Upload Resume"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  )
}

export default ResumeForm
