import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import HeroPage from "./components/HeroPage";
import Profile from "./components/Profile";
import QuestionGenerator from "./components/QuestionGenerator";
import TestHistory from "./components/TestHistory";
import ResumeForm from "./components/ResumeForm";
import TestResults from "./components/TestResults";
import InterviewForm from "./components/InterviewForm";
import Recorder from "./components/Recorder";
import MCQTest from "./components/MCQTest";
import ForumPostForm from "./components/ForumPostForm";
import ForumPosts from "./components/ForumPosts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroPage />} />x  
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/test" element={<QuestionGenerator/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/scorecards" element={<TestHistory/>} />
        <Route path="/edit/resume" element={<ResumeForm />} />
        <Route path="/test-results" element={<TestResults/>} />
        <Route path="/schedule-interview" element={<InterviewForm/>} />
        <Route path="/record" element={<Recorder/>} />
        <Route path="/mcq" element={<MCQTest/>} />
        <Route path="/forum" element={<ForumPosts/>} />
        <Route path="/forum/create" element={<ForumPostForm/>} />
      </Routes>
    </BrowserRouter>
    
    
  );
}

export default App;
