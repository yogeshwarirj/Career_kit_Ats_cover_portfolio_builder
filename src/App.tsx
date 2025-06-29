import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Features from './components/Features';
import CallToAction from './components/CallToAction';
import ResumeBuilder from './pages/ResumeBuilder';
import CoverLetterGenerator from './pages/CoverLetterGenerator';
import ATSOptimization from './pages/ATSOptimization';
import PortfolioBuilder from './pages/PortfolioBuilder';
import MockInterviewGenerator from './pages/MockInterviewGenerator';
import TavusAgentExplainer from './components/TavusAgentExplainer';
import { FileText, User } from 'lucide-react';
import { Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-['Montserrat',sans-serif]">
        <Routes>
          <Route path="/" element={
            <>
              <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16 relative">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                      <FileText className="h-8 w-8 text-teal-600" />
                      <span className="text-xl font-bold text-gray-900">CareerKit</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                      <Link 
                        to="/" 
                        className="text-gray-700 hover:text-teal-600 transition-colors duration-200"
                      >
                        Home
                      </Link>
                      <Link 
                        to="/resume-builder" 
                        className="text-gray-700 hover:text-teal-600 transition-colors duration-200"
                      >
                        Resume Builder
                      </Link>
                      <Link 
                        to="/cover-letter" 
                        className="text-gray-700 hover:text-teal-600 transition-colors duration-200"
                      >
                        Cover Letter
                      </Link>
                      <Link 
                        to="/ats-optimizer" 
                        className="text-gray-700 hover:text-teal-600 transition-colors duration-200"
                      >
                        ATS Optimizer
                      </Link>
                      <Link 
                        to="/mock-interview" 
                        className="text-gray-700 hover:text-teal-600 transition-colors duration-200"
                      >
                        Mock Interview
                      </Link>
                      <Link 
                        to="/portfolio-builder" 
                        className="text-gray-700 hover:text-teal-600 transition-colors duration-200"
                      >
                        Portfolio Builder
                      </Link>
                      <button className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200">
                        <User className="h-4 w-4" />
                        <span>Log In</span>
                      </button>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                      <button className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200">
                        <User className="h-4 w-4" />
                        <span>Log In</span>
                      </button>
                    </div>

                    {/* Bolt.new Badge - Top Right */}
                    <div className="absolute top-2 right-2 z-50">
                      <a 
                        href="https://bolt.new/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block transition-transform duration-200 hover:scale-110"
                        aria-label="Built with Bolt.new"
                      >
                        <img 
                          src="/white_circle_360x360.png" 
                          alt="Built with Bolt.new" 
                          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </header>
              
              <main>
                <Features />
                <CallToAction />
              </main>
            </>
          } />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/cover-letter" element={<CoverLetterGenerator />} />
          <Route path="/ats-optimizer" element={<ATSOptimization />} />
          <Route path="/portfolio-builder" element={<PortfolioBuilder />} />
          <Route path="/mock-interview" element={<MockInterviewGenerator />} />
        </Routes>
        
        {/* Tavus AI Agent Explainer - appears on all pages */}
        <TavusAgentExplainer />
      </div>
    </Router>
  );
}

export default App;