import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Features from './components/Features';
import CallToAction from './components/CallToAction';
import ResumeBuilder from './pages/ResumeBuilder';
import CoverLetterGenerator from './pages/CoverLetterGenerator';
import ATSOptimization from './pages/ATSOptimization';
import PortfolioBuilder from './pages/PortfolioBuilder';
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
                  <div className="flex justify-between items-center h-16">
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
                  </div>
                </div>
              </header>
              
              <main>
                <Hero />
                <Features />
                <CallToAction />
              </main>
            </>
          } />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/cover-letter" element={<CoverLetterGenerator />} />
          <Route path="/ats-optimizer" element={<ATSOptimization />} />
          <Route path="/portfolio-builder" element={<PortfolioBuilder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;