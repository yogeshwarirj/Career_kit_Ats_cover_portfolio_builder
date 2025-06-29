import React from 'react';
import { FileText, Target, Briefcase, Search, Mail, ArrowRight, Sparkles, Brain } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Portfolio Builder",
      description: "Showcase your work with stunning portfolio websites that highlight your skills and achievements.",
      gradient: "from-blue-400 via-blue-500 to-blue-600",
      shadowColor: "shadow-blue-500/25",
      glowColor: "group-hover:shadow-blue-500/40"
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Cover Letter Generator",
      description: "Generate personalized, compelling cover letters that complement your resume perfectly.",
      gradient: "from-green-400 via-green-500 to-green-600",
      shadowColor: "shadow-green-500/25",
      glowColor: "group-hover:shadow-green-500/40"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "ATS Score Optimizer",
      description: "Analyze and optimize your resume for Applicant Tracking Systems to maximize your chances of getting noticed.",
      gradient: "from-orange-300 via-orange-400 to-orange-500",
      shadowColor: "shadow-orange-400/25",
      glowColor: "group-hover:shadow-orange-400/40"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Mock Interview Generator",
      description: "Generate AI-powered interview questions tailored to specific job descriptions and technologies.",
      gradient: "from-indigo-400 via-indigo-500 to-indigo-600",
      shadowColor: "shadow-indigo-500/25",
      glowColor: "group-hover:shadow-indigo-500/40"
    }
  ];

  return (
    <section className="py-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-100 to-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-teal-100 to-orange-100 text-teal-800 text-sm font-medium mb-3 animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            Professional Tools Suite
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 leading-[1.15] animate-fade-in-up">
            Everything You Need for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-blue-600 to-orange-600 animate-gradient-x">
              Career Success
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.15] animate-fade-in-up delay-200">
            Our comprehensive suite of tools helps you at every stage of your career journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl ${feature.shadowColor} hover:shadow-2xl ${feature.glowColor} transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 p-6 border border-white/20 animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10`}></div>
              
              {/* Floating Particles */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
                <div className="absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-white rounded-full opacity-50 animate-bounce delay-500"></div>
              </div>

              {/* Circular Icon Container */}
              <div className="relative mb-4">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white shadow-lg ${feature.shadowColor} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 mx-auto`}>
                  {feature.icon}
                  
                  {/* Rotating Ring */}
                  <div className={`absolute inset-0 rounded-full border-2 border-dashed border-white/30 animate-spin-slow group-hover:border-white/60 transition-colors duration-500`}></div>
                  
                  {/* Pulse Ring */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 animate-ping`}></div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-[1.15] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-600 group-hover:to-orange-600 transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-[1.15] group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* CTA Button */}
                {feature.title === "Cover Letter Generator" ? (
                  <a 
                    href="/cover-letter"
                    className={`group/btn relative overflow-hidden inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${feature.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                  >
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" />
                    
                    {/* Button Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  </a>
                ) : feature.title === "ATS Score Optimizer" ? (
                  <a 
                    href="/ats-optimizer"
                    className={`group/btn relative overflow-hidden inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${feature.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                  >
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" />
                    
                    {/* Button Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  </a>
                ) : feature.title === "Portfolio Builder" ? (
                  <a 
                    href="/portfolio-builder"
                    className={`group/btn relative overflow-hidden inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${feature.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                  >
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" />
                    
                    {/* Button Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  </a>
                ) : feature.title === "Mock Interview Generator" ? (
                  <a 
                    href="/mock-interview"
                    className={`group/btn relative overflow-hidden inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${feature.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                  >
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" />
                    
                    {/* Button Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  </a>
                ) : (
                  <button className={`group/btn relative overflow-hidden inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${feature.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" />
                    
                    {/* Button Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  </button>
                )}
              </div>

              {/* Corner Accent */}
              <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-3xl rounded-tr-3xl group-hover:opacity-20 transition-opacity duration-500`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;