import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Hero from './components/Hero';
import Features from './components/Features';
import CallToAction from './components/CallToAction';
import ResumeBuilder from './pages/ResumeBuilder';
import CoverLetterGenerator from './pages/CoverLetterGenerator';
import ATSOptimization from './pages/ATSOptimization';
import PortfolioBuilder from './pages/PortfolioBuilder';
import AuthPage from './pages/AuthPage';
import AuthForm from './components/AuthForm';
import UserProfile from './components/UserProfile';
import { FileText, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from './lib/supabase';

function App() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  useEffect(() => {
    // Check for existing session
    auth.getCurrentUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setIsLoading(false);
      
      if (event === 'SIGNED_IN') {
        setShowAuthForm(false);
      }
    });

    // Listen for custom auth events from Hero component
    const handleOpenAuth = () => {
      setShowAuthForm(true);
    };

    window.addEventListener('openAuth', handleOpenAuth);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('openAuth', handleOpenAuth);
    };
  }, []);

  const handleSignOut = () => {
    setUser(null);
    setShowUserProfile(false);
  };

  return (
    <Router>
      <Toaster position="top-right" />
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
                        to="/portfolio-builder" 
                        className="text-gray-700 hover:text-teal-600 transition-colors duration-200"
                      >
                        Portfolio Builder
                      </Link>
                      
                      {/* Auth/Profile Section */}
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : user ? (
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600 hidden sm:block">
                            Hi, {user.email?.split('@')[0] || 'User'}
                          </span>
                          <button 
                            onClick={() => setShowUserProfile(true)}
                            className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                          >
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setShowAuthForm(true)}
                          className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <User className="h-4 w-4" />
                          <span>Sign In</span>
                        </button>
                      )}
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : user ? (
                        <button 
                          onClick={() => setShowUserProfile(true)}
                          className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 shadow-md"
                        >
                          <User className="h-4 w-4" />
                          <span className="hidden sm:inline">Profile</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => setShowAuthForm(true)}
                          className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <User className="h-4 w-4" />
                          <span>Sign In</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </header>
              
              {/* Bolt.new Badge - Fixed Position */}
              <div className="fixed top-4 right-4 z-50">
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
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
                  />
                </a>
              </div>
              
              <main>
                <Hero />
                <Features />
                <CallToAction />
              </main>
              
              {/* Auth Modal */}
              {showAuthForm && (
                <AuthForm 
                  onSuccess={() => setShowAuthForm(false)}
                  onClose={() => setShowAuthForm(false)}
                />
              )}
              
              {/* User Profile Modal */}
              {showUserProfile && user && (
                <UserProfile 
                  user={user}
                  onClose={() => setShowUserProfile(false)}
                  onSignOut={handleSignOut}
                />
              )}
            </>
          } />
          <Route path="/auth" element={<AuthPage />} />
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