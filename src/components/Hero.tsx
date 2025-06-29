import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Pause, Volume2, VolumeX, Sparkles, Star, Award, Users, CheckCircle, X } from 'lucide-react';
import { elevenLabsService, playText, stopAudio, isAudioPlaying } from '../lib/elevenLabsService';
import toast from 'react-hot-toast';

const Hero: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAICharacter, setShowAICharacter] = useState(true);

  const messages = [
    {
      text: "Welcome to CareerKit! I'm your AI career assistant, here to help you succeed in your professional journey.",
      duration: 6000
    },
    {
      text: "Generate personalized, professional cover letters using Google Gemini AI that perfectly match any job description.",
      duration: 7000
    },
    {
      text: "Optimize your resume for ATS systems with detailed scoring and AI-powered recommendations to get more interviews.",
      duration: 7000
    },
    {
      text: "Practice interviews with our AI coach featuring professional voice feedback and real-time performance analysis.",
      duration: 7000
    },
    {
      text: "Create stunning portfolio websites with AI-generated content and deploy them instantly to showcase your work.",
      duration: 7000
    },
    {
      text: "Let's accelerate your career success together with our comprehensive AI-powered toolkit!",
      duration: 6000
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && !isMuted) {
      const currentMessageData = messages[currentMessage];
      
      // Start speaking the current message
      speakMessage(currentMessageData.text);
      
      interval = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentMessage((prev) => (prev + 1) % messages.length);
          setIsAnimating(false);
        }, 300);
      }, currentMessageData.duration);
    }
    
    return () => {
      clearInterval(interval);
      if (isSpeaking) {
        stopAudio();
        setIsSpeaking(false);
      }
    };
  }, [isPlaying, isMuted, currentMessage]);

  const speakMessage = async (text: string) => {
    if (isMuted || !elevenLabsService.isConfigured()) {
      return;
    }

    try {
      setIsSpeaking(true);
      
      // Use professional female voice settings optimized for clear speech
      await playText(text, {
        voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella - professional, clear female voice
        voiceSettings: {
          stability: 0.75, // Higher stability for clear, consistent delivery
          similarity_boost: 0.6, // Natural sound
          style: 0.0, // Neutral, professional tone
          use_speaker_boost: true // Enhanced clarity
        }
      });
      
      setIsSpeaking(false);
    } catch (error) {
      console.error('Voice synthesis error:', error);
      setIsSpeaking(false);
      
      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('ELEVENLABS_NOT_CONFIGURED')) {
          toast.error('Voice features require Eleven Labs API key. The AI character will display text only.');
        } else {
          toast.error('Voice playback failed. Continuing with text display.');
        }
      }
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      // Stop playing
      setIsPlaying(false);
      stopAudio();
      setIsSpeaking(false);
    } else {
      // Start playing
      setIsPlaying(true);
      setCurrentMessage(0);
      
      // Check if Eleven Labs is configured
      const configStatus = elevenLabsService.getConfigurationStatus();
      if (!configStatus.configured) {
        toast.error('🎤 Voice features need setup! Get your free API key from ElevenLabs.io and add it to your .env file.', {
          duration: 5000,
          style: {
            background: '#3B82F6',
            color: 'white',
            fontWeight: '500'
          }
        });
      }
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (newMutedState && isSpeaking) {
      stopAudio();
      setIsSpeaking(false);
    }
    
    toast.success(newMutedState ? 'Voice muted' : 'Voice enabled');
  };

  const closeAICharacter = () => {
    // Stop any playing audio
    if (isPlaying) {
      setIsPlaying(false);
      stopAudio();
      setIsSpeaking(false);
    }
    setShowAICharacter(false);
    toast.success('AI Assistant closed');
  };

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-teal-100 to-orange-100 text-teal-800 text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              AI-Powered Career Toolkit
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] animate-fade-in-up">
              Your Career Journey{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-orange-600">
                Simplified
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl leading-[1.15] animate-fade-in-up delay-200">
              Build, Optimize, and Achieve with our comprehensive AI-powered career toolkit
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8 animate-fade-in-up delay-300">
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
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up delay-400">
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

          {/* Right Side - AI Character */}
          {showAICharacter && (
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* AI Character Container */}
                <div className="relative w-80 h-96 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                  {/* Close Button */}
                  <button
                    onClick={closeAICharacter}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 group"
                    title="Close AI Assistant"
                  >
                    <X className="h-4 w-4 text-gray-600 group-hover:text-red-500 transition-colors duration-200" />
                  </button>

                  {/* Character Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-100/30 to-orange-100/30"></div>
                  
                  {/* AI Character Avatar */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
                    {/* Avatar */}
                    <div className={`relative w-32 h-32 rounded-full mb-6 transition-all duration-500 ${
                      isSpeaking ? 'animate-pulse scale-110' : isPlaying ? 'animate-pulse' : ''
                    }`}>
                      {/* Avatar Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-orange-400 rounded-full"></div>
                      
                      {/* Avatar Face */}
                      <div className="absolute inset-2 bg-gradient-to-br from-teal-300 to-orange-300 rounded-full flex items-center justify-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                          {/* Professional AI Woman Face */}
                          <div className="relative">
                            {/* Eyes */}
                            <div className="flex space-x-3 mb-2">
                              <div className={`w-3 h-3 bg-teal-600 rounded-full transition-all duration-300 ${
                                isSpeaking ? 'animate-pulse scale-110' : isPlaying ? 'animate-pulse' : ''
                              }`}></div>
                              <div className={`w-3 h-3 bg-teal-600 rounded-full transition-all duration-300 ${
                                isSpeaking ? 'animate-pulse scale-110' : isPlaying ? 'animate-pulse' : ''
                              }`}></div>
                            </div>
                            {/* Mouth - animated when speaking */}
                            <div className={`w-4 h-2 bg-orange-500 rounded-full mx-auto transition-all duration-200 ${
                              isSpeaking ? 'animate-bounce scale-125' : isPlaying ? 'animate-pulse' : ''
                            }`}></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Speaking Animation Ring */}
                      {isSpeaking && (
                        <>
                          <div className="absolute inset-0 border-4 border-teal-400 rounded-full animate-ping opacity-75"></div>
                          <div className="absolute inset-0 border-2 border-orange-400 rounded-full animate-pulse opacity-50"></div>
                        </>
                      )}
                      
                      {/* Playing Animation Ring */}
                      {isPlaying && !isSpeaking && (
                        <div className="absolute inset-0 border-2 border-teal-300 rounded-full animate-pulse opacity-60"></div>
                      )}
                    </div>

                    {/* Speech Bubble */}
                    <div className="relative bg-white rounded-2xl p-4 shadow-lg border border-gray-200 max-w-xs">
                      <div className={`text-sm text-gray-800 text-center transition-all duration-300 ${
                        isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
                      }`}>
                        {messages[currentMessage].text}
                      </div>
                      
                      {/* Speech Bubble Arrow */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
                      
                      {/* Speaking Indicator */}
                      {isSpeaking && (
                        <div className="absolute -bottom-1 right-2 flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-75"></div>
                          <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-150"></div>
                        </div>
                      )}
                      
                      {/* Listening/Processing Indicator when not speaking but playing */}
                      {isPlaying && !isSpeaking && (
                        <div className="absolute -bottom-1 right-2 flex space-x-1">
                          <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                          <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse delay-200"></div>
                          <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse delay-400"></div>
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center space-x-3 mt-6">
                      <button
                        onClick={togglePlay}
                        className={`p-3 rounded-full transition-all duration-200 shadow-lg transform hover:scale-105 ${
                          isPlaying 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-teal-500 hover:bg-teal-600 text-white'
                        }`}
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                      </button>
                      
                      <button
                        onClick={toggleMute}
                        className={`p-3 rounded-full transition-all duration-200 shadow-lg transform hover:scale-105 ${
                          isMuted 
                            ? 'bg-gray-400 hover:bg-gray-500 text-white' 
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Status Indicator */}
                    <div className="mt-4 text-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        isSpeaking
                          ? 'bg-blue-100 text-blue-800'
                          : isPlaying 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 transition-all duration-300 ${
                          isSpeaking
                            ? 'bg-blue-500 animate-pulse'
                            : isPlaying 
                            ? 'bg-green-500 animate-pulse' 
                            : 'bg-gray-400'
                        }`}></div>
                        {isSpeaking 
                          ? 'AI Assistant Speaking' 
                          : isPlaying 
                          ? 'AI Assistant Active' 
                          : 'Click Play to Start'
                        }
                      </div>
                    </div>

                    {/* Voice Configuration Notice */}
                    {isPlaying && !elevenLabsService.isConfigured() && (
                      <div className="mt-2 text-center">
                        <div className="inline-flex items-center px-3 py-2 rounded-lg text-xs bg-amber-50 text-amber-800 border border-amber-200">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
                          <span>🔧 Add API key for voice</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Floating Particles */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute top-4 right-4 w-2 h-2 bg-teal-400 rounded-full opacity-60 ${
                      isSpeaking ? 'animate-ping' : 'animate-pulse'
                    }`}></div>
                    <div className={`absolute bottom-8 left-6 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-60 ${
                      isSpeaking ? 'animate-bounce' : 'animate-bounce delay-1000'
                    }`}></div>
                    <div className={`absolute top-1/3 right-8 w-1 h-1 bg-teal-300 rounded-full opacity-60 ${
                      isSpeaking ? 'animate-pulse' : 'animate-pulse delay-500'
                    }`}></div>
                    <div className={`absolute bottom-1/4 left-4 w-2.5 h-2.5 bg-orange-300 rounded-full opacity-60 ${
                      isSpeaking ? 'animate-bounce delay-300' : 'animate-bounce delay-700'
                    }`}></div>
                  </div>
                </div>

                {/* Enhanced Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br rounded-3xl blur-xl -z-10 transition-all duration-500 ${
                  isSpeaking 
                    ? 'from-teal-400/40 to-orange-400/40 animate-pulse' 
                    : 'from-teal-400/20 to-orange-400/20 animate-pulse'
                }`}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;