import { ArrowRight, BookOpen, Users, Calendar, Award, MessageSquare, Video, Trophy } from "lucide-react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Link } from "react-router-dom"

const HeroPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-6">Ace Your Next Interview</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Prepare for your dream job with our comprehensive resources, expert-led mock interviews, and AI-powered
            practice tools.
          </p>

        
        <div className="flex justify-center">
            <Link to='/test' className="text-lg px-8 py-6 flex items-center justify-center bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">Explore Our Platform</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Link to="/forum" className="group">
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-all hover:border-gray-300 dark:hover:border-gray-500 h-full flex flex-col items-center justify-center">
                  <MessageSquare className="h-12 w-12 text-gray-600 dark:text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Discussion Forum</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Connect with peers, share experiences, and learn from the community.
                  </p>
                  <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center group-hover:underline">
                    Join the conversation <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>

              <Link to="/record" className="group">
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-all hover:border-gray-300 dark:hover:border-gray-500 h-full flex flex-col items-center justify-center">
                  <Video className="h-12 w-12 text-gray-600 dark:text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Live Interview Practice</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Schedule real-time mock interviews with industry professionals.</p>
                  <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center group-hover:underline">
                    Practice now <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>

              <Link to="/mcq" className="group">
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-all hover:border-gray-300 dark:hover:border-gray-500 h-full flex flex-col items-center justify-center">
                  <Trophy className="h-12 w-12 text-gray-600 dark:text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Earn Badges</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Complete challenges and showcase your interview skills with achievement badges.
                  </p>
                  <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center group-hover:underline">
                    Earn Badges <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Why Choose InterviewPro?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<BookOpen className="h-12 w-12 text-gray-600 dark:text-gray-400" />}
                title="Comprehensive Resources"
                description="Access a vast library of interview questions, answers, and tips across various industries."
              />
              <FeatureCard
                icon={<Users className="h-12 w-12 text-gray-600 dark:text-gray-400" />}
                title="Expert-Led Mock Interviews"
                description="Practice with industry professionals and receive personalized feedback to improve your skills."
              />
              <FeatureCard
                icon={<Calendar className="h-12 w-12 text-gray-600 dark:text-gray-400" />}
                title="Flexible Scheduling"
                description="Book mock interviews at your convenience, 24/7, from anywhere in the world."
              />
            </div>
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-gray-900 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                quote="InterviewPro helped me land my dream job at a top tech company. The mock interviews were invaluable!"
                author="Sarah J., Software Engineer"
              />
              <TestimonialCard
                quote="The comprehensive resources and AI-powered practice tools gave me the confidence I needed to ace my interviews."
                author="Michael L., Marketing Manager"
              />
              <TestimonialCard
                quote="I was skeptical at first, but the expert feedback I received truly made a difference in my interview performance."
                author="Emily R., Data Scientist"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Ready to Land Your Dream Job?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of successful professionals who have boosted their careers with InterviewPro.
          </p>
          <div className="flex justify-center">
            <button className="text-lg px-8 py-6 flex items-center justify-center bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
              Start Your Journey <Award className="ml-2 h-5 w-5" />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

const TestimonialCard = ({ quote, author }) => {
  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
      <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{quote}"</p>
      <p className="text-gray-800 dark:text-white font-semibold">- {author}</p>
    </div>
  )
}

export default HeroPage
