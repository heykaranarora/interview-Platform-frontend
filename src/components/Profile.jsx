import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Contact, Mail, Pen } from "lucide-react"
import UpdateProfileDialog from "./UpdateProfileDialog"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import InterviewList from "./InterviewList"
import VideoList from "./VideoList"

const Profile = () => {
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      document.title = `${user.name} | Profile`
      fetchProfile(user._id)
      InterviewData()
    }
  }, [user])

  useEffect(() => {
    if (user && !open) {
      fetchProfile(user._id)
    }
  }, [user, open])

  const fetchProfile = async (userId) => {
    try {
      const response = await fetch(`https://interview-platform-backend-xp3r.onrender.com/api/v1/user/profile/${userId}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json();
      console.log("Profile data fetched successfully", data);
      if (response.ok) {
        setProfile(data.user)
      } else {
        setError(data.message || "Failed to load profile")
      }
    } catch (err) {
      setError("Error fetching profile")
      console.error("Error fetching profile", err)
    } finally {
      setLoading(false)
    }
  }

  const InterviewData = async () => {
    try {
      const response = await fetch(`https://interview-platform-backend-xp3r.onrender.com/api/v1/interview/get`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Interview data fetched successfully", data);
      } else {
        console.error("Failed to fetch interview data", data.message);
      }
    } catch (err) {
      console.error("Error fetching interview data", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading profile...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-800">Profile Error</h3>
            <p className="text-red-600">{error}</p>
            <button
              className="mt-4 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-32 bg-gray-700" />

            <div className="px-6 sm:px-8 pb-8 -mt-16">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6">
                <div className="flex items-end">
                  <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden">
                    {profile?.profile?.avatar ? (
                      <img
                        src={profile.profile.avatar || "/placeholder.svg"}
                        alt={profile.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-600 text-white text-lg font-bold">
                        {profile?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="ml-4 mb-1">
                    <h1 className="font-bold text-2xl text-white">{profile?.name}</h1>
                    <p className="text-white mt-1">{profile?.profile?.bio || "No bio added yet"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(true)}
                  className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50"
                >
                  <Pen className="h-4 w-4" /> Edit Profile
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profile?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Contact className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{profile?.phoneNumber || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-lg font-semibold">Resume</h2>
                  {profile?.resume?.filePath ? (
                    <div>

                    <a
                      href={`https://interview-platform-backend-xp3r.onrender.com${profile.resume.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium">
                        View Resume
                      </button>
                    </a>
                    <Link to="/edit/resume">
                      <button className="mt-2 text-gray-600 hover:text-gray-800 text-sm font-medium">
                        Edit Resume
                      </button>
                    </Link>
                    </div>
                    
                  ) : (
                    <Link to="/edit/resume">
                      <button className="mt-2 text-gray-600 hover:text-gray-800 text-sm font-medium">
                        Upload Resume
                      </button>
                    </Link>
                  )}
                </div>
              </div>

              {/* 🏅 Badges Section */}
              {profile?.badges?.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Badges Earned</h2>
                    <div className="flex flex-wrap gap-4">
                      {profile.badges.map((badge, index) => (
                        <div
                          key={index}
                          className="relative group p-4 w-36 h-36 rounded-xl flex flex-col items-center justify-center text-center border shadow-md hover:shadow-lg transition hover:scale-105"
                          style={{
                            borderColor: badge.color || "#6B7280",
                            backgroundColor: "#f9fafb",
                          }}
                        >
                          <div className="text-4xl mb-2">{"🏅"}</div>
                          <p className="font-semibold text-gray-700 text-sm"></p>
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs text-gray-600 transition duration-300 z-10 bg-white px-2 py-1 rounded shadow max-w-[10rem]">
                            {badge || "Special achievement"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <InterviewList />
          <VideoList />
        </div>
      </main>

      <Footer />
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default Profile
