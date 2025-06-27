import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Target, TrendingUp, Users, Star, CheckCircle, Sparkles, BarChart3, Zap, Award, FileText, Upload, Search, Filter, Eye, Download } from 'lucide-react';
import ATSOptimizer from '../components/ATSOptimizer';
import { Toaster } from 'react-hot-toast';

const ATSOptimization: React.FC = () => {
  const [showOptimizer, setShowOptimizer] = useState(false);

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Comprehensive ATS Scoring",
      description: "Get detailed scores for keyword matching, formatting compliance, and content quality with actionable insights.",
      gradient: "from-blue-500 to-blue-600",
      shadowColor: "shadow-blue-500/25",
      glowColor: "group-hover:shadow-blue-500/40"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Smart Keyword Analysis",
      description: "Identify missing keywords and optimize your resume to match job descriptions perfectly.",
      gradient: "from-purple-500 to-purple-600",
      shadowColor: "shadow-purple-500/25",
      glowColor: "group-hover:shadow-purple-500/40"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Format Compliance Check",
      description: "Ensure your resume format is ATS-friendly with proper structure and readable formatting.",
      gradient: "from-green-500 to-green-600",
      shadowColor: "shadow-green-500/25",
      glowColor: "group-hover:shadow-green-500/40"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Content Quality Analysis",
      description: "Improve your resume content with suggestions for action verbs, achievements, and impact statements.",
      gradient: "from-orange-500 to-orange-600",
      shadowColor: "shadow-orange-500/25",
      glowColor: "group-hover:shadow-orange-500/40"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-time Optimization",
      description: "Get instant feedback and recommendations as you upload and analyze your resume.",
      gradient: "from-teal-500 to-teal-600",
      shadowColor: "shadow-teal-500/25",
      glowColor: "group-hover:shadow-teal-500/40"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Industry-Specific Insights",
      description: "Receive tailored recommendations based on your industry and target job requirements.",
      gradient: "from-red-500 to-red-600",
      shadowColor: "shadow-red-500/25",
      glowColor: "group-hover:shadow-red-500/40"
    }
  ];

  const stats = [
    { number: "95%", label: "Success Rate", description: "Users see improved ATS scores" },
    { number: "3x", label: "More Interviews", description: "Average increase in interview calls" },
    { number: "50K+", label: "Resumes Analyzed", description: "Trusted by professionals worldwide" },
    { number: "24/7", label: "Available", description: "Analyze your resume anytime" }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Upload Your Resume",
      description: "Upload your resume in PDF, DOCX, or TXT format for instant analysis",
      icon: <Upload className="h-6 w-6" />
    },
    {
      step: 2,
      title: "Add Job Description",
      description: "Paste the job description or URL to analyze against specific requirements",
      icon: <FileText className="h-6 w-6" />
    },
    {
      step: 3,
      title: "Get Detailed Analysis",
      description: "Receive comprehensive scoring and actionable recommendations",
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      step: 4,
      title: "Optimize & Download",
      description: "Apply suggestions and download your optimized resume",
      icon: <Download className="h-6 w-6" />
    }
  ];

  if (showOptimizer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Toaster position="top-right" />
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button 
                  onClick={() => setShowOptimizer(false)}
                  className="flex items-center group mr-4"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 mr-3 group-hover:text-blue-600 transition-colors duration-200" />
                </button>
                <Link to="/" className="flex items-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">ATS Optimizer</span>
                </Link>
              </div>
             
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ATSOptimizer onClose={() => setShowOptimizer(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-green-100/30 to-teal-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-orange-100/30 to-red-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <ArrowLeft className="h-5 w-5 text-gray-600 mr-3 group-hover:text-blue-600 transition-colors duration-200" />
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">ATS Optimizer</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            Professional ATS Analysis & Optimization
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] animate-fade-in-up">
            Beat the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 animate-gradient-x">
              ATS System
            </span>
            <br />
            Get More Interviews
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-up delay-200">
            Optimize your resume for Applicant Tracking Systems with our AI-powered analysis. 
            Get detailed scoring, keyword recommendations, and formatting suggestions to increase your chances of landing interviews.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up delay-400">
            <button
              onClick={() => setShowOptimizer(true)}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
            >
              Start Free Analysis
              <Target className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your ATS score in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 animate-ping"></div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-800 text-sm font-medium mb-4 animate-fade-in">
              <Award className="w-4 h-4 mr-2 animate-pulse" />
              Advanced Features
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-[1.15]">
              Everything You Need for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 animate-gradient-x">
                ATS Success
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.15]">
              Comprehensive analysis and optimization tools to maximize your resume's performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl ${feature.shadowColor} hover:shadow-2xl ${feature.glowColor} transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 p-8 border border-white/20 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10`}></div>
                
                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
                  <div className="absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse delay-1000"></div>
                  <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-white rounded-full opacity-50 animate-bounce delay-500"></div>
                </div>

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white shadow-lg ${feature.shadowColor} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 mx-auto`}>
                    {feature.icon}
                    
                    {/* Rotating Ring */}
                    <div className={`absolute inset-0 rounded-full border-2 border-dashed border-white/30 animate-spin-slow group-hover:border-white/60 transition-colors duration-500`}></div>
                    
                    {/* Pulse Ring */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 animate-ping`}></div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-[1.15] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-[1.15] group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Corner Accent */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-3xl rounded-tr-2xl group-hover:opacity-20 transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Optimize Your Resume?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get detailed ATS analysis and actionable recommendations in minutes
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setShowOptimizer(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
            >
              Start Free Analysis
              <Shield className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSOptimization;