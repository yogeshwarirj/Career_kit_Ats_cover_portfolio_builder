import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Menu, X, User } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
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
            <button className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200">
              <User className="h-4 w-4" />
              <span>Log In</span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-teal-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/resume-builder" 
                className="text-gray-700 hover:text-teal-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Resume Builder
              </Link>
              <button className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 w-fit">
                <User className="h-4 w-4" />
                <span>Log In</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;