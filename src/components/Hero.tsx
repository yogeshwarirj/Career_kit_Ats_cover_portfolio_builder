import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden -mt-16 pt-16">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-orange-50">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 via-transparent to-orange-600/10 animate-pulse"></div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-teal-600 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-500 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-teal-400 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-40 right-40 w-8 h-8 bg-orange-400 rounded-full animate-bounce delay-700"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-[1.15] animate-fade-in-up">
            Your Career Journey{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-orange-600">
              Simplified
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-[1.15] animate-fade-in-up delay-200">
            Build, Optimize, and Achieve with our comprehensive career toolkit
          </p>

          {/* CTA Button */}
          <div className="flex justify-center animate-fade-in-up delay-400">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <a 
                href="/resume-builder"
                className="group bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
              >
                Get Started with CareerKit
              </a>
              <button 
                onClick={() => {
                  const authEvent = new CustomEvent('openAuth');
                  window.dispatchEvent(authEvent);
                }}
                className="group border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-600 hover:text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;