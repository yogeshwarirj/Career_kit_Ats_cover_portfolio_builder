import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X, Maximize2, Minimize2, MessageCircle, Sparkles, FileText, Mail, Target, Briefcase, Brain, Shield, Award, Users, Star, CheckCircle, Zap } from 'lucide-react';

interface TavusAgentExplainerProps {
  className?: string;
}

interface FeatureExplanation {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  duration: number;
}

const TavusAgentExplainer: React.FC<TavusAgentExplainerProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const features: FeatureExplanation[] = [
    {
      id: 'intro',
      title: 'Welcome to CareerKit',
      description: 'Your comprehensive career toolkit powered by AI. I\'m your virtual career coach, here to guide you through our professional-grade tools designed to accelerate your career success.',
      icon: <Sparkles className="h-6 w-6" />,
      benefits: ['AI-powered career tools', 'Professional-grade results', 'Comprehensive career support'],
      duration: 8000
    },
    {
      id: 'resume-builder',
      title: 'Resume Builder',
      description: 'Create stunning, ATS-optimized resumes with our collection of 12+ professional templates. Choose from modern, executive, creative, and industry-specific designs that get you noticed.',
      icon: <FileText className="h-6 w-6" />,
      benefits: ['12+ professional templates', 'ATS-optimized formatting', 'Industry-specific designs', 'Real-time preview'],
      duration: 10000
    },
    {
      id: 'cover-letter',
      title: 'AI Cover Letter Generator',
      description: 'Generate personalized, compelling cover letters using Google Gemini AI. Simply upload your resume and job description, and get a tailored cover letter that highlights your perfect fit.',
      icon: <Mail className="h-6 w-6" />,
      benefits: ['Gemini AI-powered', 'Personalized content', 'Job-specific tailoring', 'Professional templates'],
      duration: 10000
    },
    {
      id: 'ats-optimizer',
      title: 'ATS Score Optimizer',
      description: 'Analyze and optimize your resume for Applicant Tracking Systems. Get detailed scoring, keyword analysis, and AI-generated optimized versions that pass ATS screening.',
      icon: <Target className="h-6 w-6" />,
      benefits: ['Comprehensive ATS analysis', 'Keyword optimization', 'AI-optimized versions', 'Detailed scoring'],
      duration: 12000
    },
    {
      id: 'portfolio-builder',
      title: 'Portfolio Builder',
      description: 'Create stunning portfolio websites with AI-generated content and deploy them instantly to Netlify. Showcase your work with professional designs that impress employers.',
      icon: <Briefcase className="h-6 w-6" />,
      benefits: ['AI-generated content', 'Instant Netlify deployment', 'Professional designs', 'Custom domains'],
      duration: 10000
    },
    {
      id: 'mock-interview',
      title: 'Mock Interview Generator',
      description: 'Practice with AI-generated interview questions tailored to your job description. Get real-time feedback from our professional voice coach and improve your interview performance.',
      icon: <Brain className="h-6 w-6" />,
      benefits: ['AI-generated questions', 'Professional voice coach', 'Real-time feedback', 'Performance analytics'],
      duration: 12000
    },
    {
      id: 'conclusion',
      title: 'Your Career Success Awaits',
      description: 'With CareerKit\'s AI-powered tools, you have everything needed to land your dream job. Join thousands of professionals who have accelerated their careers with our platform.',
      icon: <Award className="h-6 w-6" />,
      benefits: ['Complete career toolkit', 'AI-powered optimization', 'Professional results', 'Career acceleration'],
      duration: 8000
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && !isMuted) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 100;
          const currentDuration = features[currentFeature].duration;
          
          if (newProgress >= currentDuration) {
            // Move to next feature
            if (currentFeature < features.length - 1) {
              setCurrentFeature(prev => prev + 1);
              return 0;
            } else {
              // End of presentation
              setIsPlaying(false);
              setCurrentFeature(0);
              return 0;
            }
          }
          
          return newProgress;
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, isMuted, currentFeature, features]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    if (!hasStarted) {
      setHasStarted(true);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!hasStarted) {
      setHasStarted(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const goToFeature = (index: number) => {
    setCurrentFeature(index);
    setProgress(0);
  };

  const currentProgressPercent = features[currentFeature] 
    ? (progress / features[currentFeature].duration) * 100 
    : 0;

  if (!isVisible) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={toggleVisibility}
          className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 animate-pulse"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">AI Career Coach</div>
              <div className="text-xs opacity-90">Learn about CareerKit</div>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-300"></div>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed ${isExpanded ? 'inset-4' : 'bottom-6 right-6 w-96'} z-50 ${className}`}>
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">AI Career Coach</h3>
                <p className="text-xs opacity-90">Powered by Tavus AI</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              
              <button
                onClick={toggleExpanded}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              
              <button
                onClick={toggleVisibility}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Video/Avatar Area */}
        <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex-1 flex items-center justify-center">
          {/* Simulated Video Avatar */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                {features[currentFeature].icon}
              </div>
              
              {/* Speaking animation */}
              {isPlaying && !isMuted && (
                <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-ping"></div>
              )}
            </div>
            
            {/* Status indicator */}
            <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
              isPlaying ? 'bg-green-500' : 'bg-gray-400'
            }`}>
              {isPlaying ? <Play className="h-3 w-3 text-white" /> : <Pause className="h-3 w-3 text-white" />}
            </div>
          </div>

          {/* Play/Pause overlay */}
          <button
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors duration-200 rounded-lg"
          >
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200">
              {isPlaying ? <Pause className="h-6 w-6 text-gray-700" /> : <Play className="h-6 w-6 text-gray-700 ml-1" />}
            </div>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 bg-white">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {currentFeature + 1} of {features.length}
              </span>
              <span className="text-xs text-gray-500">
                {Math.round(currentProgressPercent)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${currentProgressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Current Feature */}
          <div className="mb-4">
            <h4 className="font-bold text-lg text-gray-900 mb-2 flex items-center">
              {features[currentFeature].icon}
              <span className="ml-2">{features[currentFeature].title}</span>
            </h4>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {features[currentFeature].description}
            </p>

            {/* Benefits */}
            <div className="space-y-1">
              {features[currentFeature].benefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={togglePlayPause}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isPlaying 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <div className="flex items-center space-x-1">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToFeature(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentFeature 
                      ? 'bg-blue-500 w-6' 
                      : index < currentFeature 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Feature Navigation (Expanded View) */}
        {isExpanded && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <h5 className="font-semibold text-gray-900 mb-3">Quick Navigation</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {features.map((feature, index) => (
                <button
                  key={feature.id}
                  onClick={() => goToFeature(index)}
                  className={`p-3 rounded-lg text-left transition-all duration-200 ${
                    index === currentFeature
                      ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {feature.icon}
                    <span className="ml-2 font-medium text-sm">{feature.title}</span>
                  </div>
                  <p className="text-xs opacity-75 line-clamp-2">{feature.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Captions (when playing) */}
        {isPlaying && !isMuted && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-3">
            <p className="text-sm text-center">
              {features[currentFeature].description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TavusAgentExplainer;