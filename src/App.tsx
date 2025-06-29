import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import Features from './components/Features';
import CallToAction from './components/CallToAction';
import ResumeBuilder from './pages/ResumeBuilder';
import CoverLetterGenerator from './pages/CoverLetterGenerator';
import ATSOptimization from './pages/ATSOptimization';
import PortfolioBuilder from './pages/PortfolioBuilder';
import MockInterviewGenerator from './pages/MockInterviewGenerator';
import TavusAgentExplainer from './components/TavusAgentExplainer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-['Montserrat',sans-serif]">
        {/* Global Header Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 relative">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2 mr-12">
                <img 
                  src="/image copy copy copy copy copy copy.png" 
                  alt="CareerKit Logo" 
                  className="h-8 w-8 object-contain"
                />
                <span className="text-xl font-bold text-gray-900">CareerKit</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6 flex-1">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-teal-600 transition-colors duration-200"
                >
                  Home
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
              </nav>

              {/* Mobile menu button */}
              <div className="md:hidden ml-auto">
                <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Bolt.new Badge - Top Right */}
              <div className="absolute top-3 right-3 z-50">
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
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
                  />
                </a>
              </div>
            </div>
          </div>
        </header>
        
        <Routes>
          <Route path="/" element={
            <>
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