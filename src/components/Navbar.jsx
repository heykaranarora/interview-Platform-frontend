import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, User2, Menu, X, Moon, Sun } from "lucide-react";
import { setUser } from "../redux/authSlice";
import { toast } from "react-toastify";
import { BookOpen } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  const logoutHandler = async () => {
    try {
      const res = await fetch("https://interview-platform-backend-xp3r.onrender.com/api/v1/user/logout", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUser(null));
        navigate("/");
      } else {
        throw new Error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md py-4 transition-colors duration-200">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-gray-800 dark:text-white" />
          <Link to='/' className="flex items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white cursor-pointer" >InterviewPro</h1>
          </Link>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-purple-600 dark:text-purple-400"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <ul className="hidden lg:flex space-x-6 text-gray-700 dark:text-gray-300 font-medium">
          <li>
            <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-400">Home</Link>
          </li>
          <li>
            <Link to="/test" className="hover:text-gray-600 dark:hover:text-gray-400">Test</Link>
          </li>
          <li>
            <Link to="/scorecards" className="hover:text-gray-600 dark:hover:text-gray-400">scorecards</Link>
          </li>
          <li>
            <Link to="/schedule-interview" className="hover:text-gray-600 dark:hover:text-gray-400">Interviews</Link>
          </li>
        </ul>
        {!user ? (
          <div className="hidden lg:flex space-x-4">
            <Link to="/login">
              <button className="border border-gray-800 dark:border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900 dark:hover:bg-gray-600">
                Sign Up
              </button>
            </Link>
          </div>
        ) : (
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/profile" className="flex items-center text-purple-600 dark:text-purple-400 hover:underline">
              <User2 className="h-5 w-5 mr-1" />
              {user?.name}
            </Link>
            <button
              onClick={logoutHandler}
              className="flex items-center text-red-600 dark:text-red-400 hover:underline"
            >
              <LogOut className="h-5 w-5 mr-1" />
              Logout
            </button>
          </div>
        )}
      </div>
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-800 shadow-md py-4">
          <ul className="flex flex-col items-center space-y-4 text-gray-700 dark:text-gray-300 font-medium">
            <li>
              <Link to="/" className="hover:text-purple-600 dark:hover:text-purple-400">Home</Link>
            </li>
            <li>
              <Link to="/test" className="hover:text-purple-600 dark:hover:text-purple-400">Test</Link>
            </li>
            <li>
              <Link to="/scorecards" className="hover:text-purple-600 dark:hover:text-purple-400">scorecards</Link>
            </li>
          </ul>
          {!user ? (
            <div className="flex flex-col items-center space-y-4 mt-4">
              <Link to="/login">
                <button className="border border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-purple-600 dark:bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-700 dark:hover:bg-purple-600">
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 mt-4">
              <Link to="/profile" className="flex items-center text-purple-600 dark:text-purple-400 hover:underline">
                <User2 className="h-5 w-5 mr-1" />
                Profile
              </Link>
              <button
                onClick={logoutHandler}
                className="flex items-center text-red-600 dark:text-red-400 hover:underline"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
