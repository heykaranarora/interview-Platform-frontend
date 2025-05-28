import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"

const ForumPosts = () => {
  const [posts, setPosts] = useState([])
  const [commentText, setCommentText] = useState("")
  const [commentingPostId, setCommentingPostId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { user } = useSelector((store) => store.auth)

  // Fetch all posts
  const fetchPosts = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/forum/", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) {
        throw new Error("Failed to fetch posts")
      }
      const data = await res.json()
      setPosts(data)
    } catch (err) {
      setError(err.message || "An error occurred while fetching posts.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return

    try {
      const res = await fetch(`https://interview-platform-backend-xp3r.onrender.com/api/v1/forum/${postId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: commentText }),
      })
      if (!res.ok) {
        throw new Error("Failed to post comment")
      }
      setCommentText("")
      setCommentingPostId(null)
      fetchPosts() 
    } catch (err) {
      console.error("Failed to post comment", err)
    }
  }

  const toggleCommentInput = (postId) => {
    if (commentingPostId === postId) {
      setCommentingPostId(null)
    } else {
      setCommentingPostId(postId)
      setCommentText("")
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/forum/create"
          className="inline-flex items-center justify-center px-5 py-2.5 mb-6 font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
    
          Create New Post
        </Link>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Forum Discussions</h2>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No posts available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between p-5 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
                      {post.user?.name?.charAt(0) || "A"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{post.user?.name || "Anonymous"}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{post.comments?.length || 0} Comments</span>
                  </div>
                </div>

                <div className="p-5 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                      {post.tags?.join(", ") || "No tags"}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
                </div>

                <div className="bg-gray-50 p-5 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-700">Comments ({post.comments?.length || 0})</h4>
                    <button
                      onClick={() => toggleCommentInput(post._id)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {commentingPostId === post._id ? "Cancel" : "Add Comment"}
                    </button>
                  </div>

                  {commentingPostId === post._id && (
                    <div className="mb-4 transition-all duration-300 ease-in-out">
                      <div className="flex items-start space-x-2">
                        <div className="flex-grow">
                          <textarea
                            placeholder="Write your comment..."
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="2"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => handleAddComment(post._id)}
                          disabled={!commentText.trim()}
                          className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            commentText.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 cursor-not-allowed"
                          }`}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}

                  {post.comments?.length > 0 ? (
                    <div className="space-y-3 mt-3">
                      {post.comments.map((comment, i) => (
                        <div key={i} className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
                                {comment.user?.name?.charAt(0) || "A"}
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-800">{comment.user?.name || "Anonymous"}</p>
                              <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No comments yet. Be the first to comment!</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  )
}

export default ForumPosts
