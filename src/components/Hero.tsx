import React from 'react';
import { ArrowRight, Sparkles, Star, Award, Users, CheckCircle } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden -mt-16 pt-16">
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
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-teal-100 to-orange-100 text-teal-800 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            AI-Powered Career Toolkit
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] animate-fade-in-up">
            Your Career Journey{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-orange-600">
              Simplified
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-[1.15] animate-fade-in-up delay-200">
            Build, Optimize, and Achieve with our comprehensive AI-powered career toolkit
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 animate-fade-in-up delay-300">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">10,000+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">4.8 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Industry Leading</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up delay-400">
            <a 
              href="#features"
              className="group bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
            >
              Get Started with CareerKit
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Free to start</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;