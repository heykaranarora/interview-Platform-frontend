import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-2xl font-bold">InterviewPro</span>
            <p className="text-sm mt-2 text-gray-300 dark:text-gray-400">© 2025 InterviewPro. All rights reserved.</p>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  )
}

export default Footer
