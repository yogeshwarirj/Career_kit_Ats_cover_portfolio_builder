import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Minimize, Maximize2, Minimize2, MessageCircle, Sparkles, FileText, Mail, Target, Briefcase, Brain, Shield, Award, Users, Star, CheckCircle, Zap, ArrowLeft, ArrowRight } from 'lucide-react';
import { elevenLabsService, playText, stopAudio } from '../lib/elevenLabsService';
import toast from 'react-hot-toast';

interface TavusAgentExplainerProps {
  className?: string;
}

interface FeatureExplanation {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
}

const TavusAgentExplainer: React.FC<TavusAgentExplainerProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const playbackRef = useRef<boolean>(false);
  const componentId = 'tavus-ai-explainer';
  const audioTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const features: FeatureExplanation[] = [
    {
      id: 'intro',
      title: 'Welcome to CareerKit',
      description: 'Your comprehensive career toolkit powered by AI. I\'m your virtual career coach, here to guide you through our professional-grade tools designed to accelerate your career success.',
      icon: <Sparkles className="h-6 w-6" />,
      benefits: ['AI-powered career tools', 'Professional-grade results', 'Comprehensive career support']
    },
    {
      id: 'cover-letter',
      title: 'AI Cover Letter Generator',
      description: 'Generate personalized, compelling cover letters using Google Gemini AI. Simply upload your resume and job description, and get a tailored cover letter that highlights your perfect fit.',
      icon: <Mail className="h-6 w-6" />,
      benefits: ['Gemini AI-powered', 'Personalized content', 'Job-specific tailoring', 'Professional templates']
    },
    {
      id: 'ats-optimizer',
      title: 'ATS Score Optimizer',
      description: 'Analyze and optimize your resume for Applicant Tracking Systems. Get detailed scoring, keyword analysis, and AI-generated optimized versions that pass ATS screening.',
      icon: <Target className="h-6 w-6" />,
      benefits: ['Comprehensive ATS analysis', 'Keyword optimization', 'AI-optimized versions', 'Detailed scoring']
    },
    {
      id: 'portfolio-builder',
      title: 'Portfolio Builder',
      description: 'Create stunning portfolio websites with AI-generated content and deploy them instantly to Netlify. Showcase your work with professional designs that impress employers.',
      icon: <Briefcase className="h-6 w-6" />,
      benefits: ['AI-generated content', 'Instant Netlify deployment', 'Professional designs', 'Custom domains']
    },
    {
      id: 'mock-interview',
      title: 'Mock Interview Generator',
      description: 'Practice with AI-generated interview questions tailored to your job description. Get real-time feedback from our professional voice coach and improve your interview performance.',
      icon: <Brain className="h-6 w-6" />,
      benefits: ['AI-generated questions', 'Professional voice coach', 'Real-time feedback', 'Performance analytics']
    },
    {
      id: 'conclusion',
      title: 'Your Career Success Awaits',
      description: 'With CareerKit\'s AI-powered tools, you have everything needed to land your dream job. Join thousands of professionals who have accelerated their careers with our platform.',
      icon: <Award className="h-6 w-6" />,
      benefits: ['Complete career toolkit', 'AI-powered optimization', 'Professional results', 'Career acceleration']
    }
  ];

  // Main playback effect - plays through all features sequentially
  useEffect(() => {
    const playSequentially = async () => {
      if (!isPlaying || isMuted || !hasStarted || isPaused || isProcessing) {
        return;
      }

      setIsProcessing(true);
      playbackRef.current = true;

      // Show toast when starting
      if (currentFeature === 0) {
        toast.success('🎤 AI Career Coach is now speaking!', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: 'white',
            fontWeight: '500'
          }
        });
      }

      // Play through all features
      for (let i = currentFeature; i < features.length && playbackRef.current && isPlaying; i++) {
        if (!playbackRef.current || !isPlaying || isPaused) break;

        setCurrentFeature(i);
        
        // Clear any existing timeouts
        if (audioTimeoutRef.current) {
          clearTimeout(audioTimeoutRef.current);
          audioTimeoutRef.current = null;
        }
        
        // CRITICAL: Aggressive audio stopping with longer delay
        const feature = features[i];

        // Check if Eleven Labs is configured
        if (!elevenLabsService.isConfigured()) {
          // Just wait a bit for text reading time if no voice
          await new Promise(resolve => setTimeout(resolve, 4000));
          continue;
        }

        try {
          setIsSpeaking(true);
          
          // CRITICAL: SUPER AGGRESSIVE audio stopping
          elevenLabsService.stopAllAudio();
          
          // Wait longer for complete cleanup
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Double-check that we should still be playing
          if (!playbackRef.current || !isPlaying || isPaused) break;
          
          // Show speaking status
          toast.loading(`Speaking: ${feature.title}`, {
            id: 'speaking-status',
            duration: 1000
          });

          // Use component-specific playback to prevent conflicts
          // Final check before playing
          if (!playbackRef.current || !isPlaying || isPaused) {
            break;
          }
          await elevenLabsService.playTextWithId(feature.description, componentId, {
            voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella - professional, clear female voice
            voiceSettings: {
              stability: 0.75,
              similarity_boost: 0.6,
              style: 0.1,
              use_speaker_boost: true
            }
          });

          setIsSpeaking(false);
          toast.dismiss('speaking-status');

        } catch (error) {
          console.error('Voice synthesis error:', error);
          setIsSpeaking(false);
          toast.dismiss('speaking-status');
          
          if (error instanceof Error && error.message.includes('ELEVENLABS_NOT_CONFIGURED')) {
            toast.error('Voice features require Eleven Labs API key. Please configure in settings.');
            // Continue with text-only display
            await new Promise(resolve => setTimeout(resolve, 4000));
          }
        }

        // Small pause between features
        if (i < features.length - 1 && playbackRef.current && isPlaying) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // End of presentation
      if (playbackRef.current && isPlaying) {
        setIsPlaying(false);
        setCurrentFeature(0);
        toast.success('🎉 AI Career Coach presentation complete!', {
          duration: 4000,
          style: {
            background: '#3B82F6',
            color: 'white',
            fontWeight: '500'
          }
        });
      }

      setIsProcessing(false);
    };

    if (isPlaying && !isPaused && !isProcessing) {
      playSequentially();
    }
    
    // Cleanup timeout on unmount or dependency change
    return () => {
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
        audioTimeoutRef.current = null;
      }
    };
  }, [isPlaying, isPaused, currentFeature, isProcessing]);

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
    if (isPlaying) {
      // Pause
      setIsPaused(true);
      setIsPlaying(false);
      setIsProcessing(false);
      elevenLabsService.stopAllAudio();
      setIsSpeaking(false);
      playbackRef.current = false;
      toast.success('⏸️ AI presentation paused');
    } else {
      // Play/Resume
      setIsPaused(false);
      setIsPlaying(true);
      setIsProcessing(false);
      
      // Check if Eleven Labs is configured when starting
      const configStatus = elevenLabsService.getConfigurationStatus();
      if (!configStatus.configured) {
        toast.error('🔧 Voice setup needed! Get your free API key from ElevenLabs.io', {
          duration: 5000,
          style: {
            background: '#F59E0B',
            color: 'white',
            fontWeight: '500'
          }
        });
      }
    }
    
    if (!hasStarted) {
      setHasStarted(true);
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // Stop any current audio when muting
    if (newMutedState && isSpeaking) {
      setIsProcessing(false);
      elevenLabsService.stopAllAudio();
      setIsSpeaking(false);
    }

    toast.success(newMutedState ? '🔇 Voice muted' : '🔊 Voice enabled');
  };

  const minimizeToButton = () => {
    // Stop any playing audio
    if (isPlaying) {
      setIsPlaying(false);
      elevenLabsService.stopAllAudio();
      setIsProcessing(false);
      setIsSpeaking(false);
      playbackRef.current = false;
    }
    setIsVisible(false);
    toast.success('📝 AI Career Coach minimized');
  };

  const goToFeature = (index: number) => {
    // Stop current playback
    playbackRef.current = false;
    setIsProcessing(false);
    elevenLabsService.stopAllAudio();
    setIsSpeaking(false);
    setIsPlaying(false);
    setIsPaused(false);
    
    setCurrentFeature(index);
    toast.success(`Jumped to: ${features[index].title}`);
  };

  const handlePrevious = () => {
    if (currentFeature > 0) {
      goToFeature(currentFeature - 1);
    }
  };

  const handleNext = () => {
    if (currentFeature < features.length - 1) {
      goToFeature(currentFeature + 1);
    }
  };

  if (!isVisible) {
    return (
      <div className={`fixed bottom-4 left-4 z-50 ${className}`}>
        <button
          onClick={toggleVisibility}
          className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-xs">AI Career Coach</div>
              <div className="text-xs opacity-90">Learn CareerKit</div>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed ${isExpanded ? 'inset-4' : 'bottom-4 left-4 w-80'} z-50 ${className}`}>
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Career Coach</h3>
                <p className="text-xs opacity-90">
                  {isSpeaking ? 'Speaking...' : isPlaying ? 'Active' : 'Ready'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleMute}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
                title={isMuted ? "Unmute voice" : "Mute voice"}
              >
                {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              </button>
              
              <button
                onClick={toggleExpanded}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
                title={isExpanded ? "Minimize view" : "Expand view"}
              >
                {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </button>
              
              <button
                onClick={minimizeToButton}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
                title="Minimize to button"
              >
                <Minimize className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Video/Avatar Area */}
        <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex-1 flex items-center justify-center">
          {/* Simulated Video Avatar */}
          <div className="relative">
            <div className={`w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 ${
              isSpeaking ? 'scale-110' : ''
            }`}>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                {features[currentFeature].icon}
              </div>
              
              {/* Speaking animation */}
              {isSpeaking && (
                <>
                  <div className="absolute inset-0 border-4 border-white/50 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-green-400 rounded-full"></div>
                </>
              )}
              
              {/* Playing but not speaking animation */}
              {isPlaying && !isSpeaking && (
                <div className="absolute inset-0 border-2 border-blue-400 rounded-full opacity-60"></div>
              )}
            </div>
            
            {/* Status indicator */}
            <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-colors duration-300 ${
              isSpeaking ? 'bg-green-500' : isPlaying ? 'bg-blue-500' : 'bg-gray-400'
            }`}>
              {isSpeaking ? (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              ) : isPlaying ? (
                <Play className="h-3 w-3 text-white" />
              ) : (
                <Pause className="h-3 w-3 text-white" />
              )}
            </div>
          </div>

          {/* Play/Pause overlay */}
          <button
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors duration-200 rounded-lg"
          >
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200">
              {isPlaying ? <Pause className="h-4 w-4 text-gray-700" /> : <Play className="h-4 w-4 text-gray-700 ml-1" />}
            </div>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 bg-white">
          {/* Feature Indicator */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">
                Feature {currentFeature + 1} of {features.length}
              </span>
              <div className={`text-xs px-2 py-1 rounded-full ${
                isSpeaking 
                  ? 'bg-green-100 text-green-800' 
                  : isPlaying 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {isSpeaking ? '🗣️ Speaking' : isPlaying ? '▶️ Active' : '⏹️ Stopped'}
              </div>
            </div>
          </div>

          {/* Current Feature */}
          <div className="mb-4">
            <h4 className="font-bold text-sm text-gray-900 mb-2 flex items-center">
              {features[currentFeature].icon}
              <span className="ml-2">{features[currentFeature].title}</span>
            </h4>
            
            <p className="text-gray-700 text-xs leading-relaxed mb-3">
              {features[currentFeature].description}
            </p>

            {/* Benefits */}
            <div className="space-y-1">
              {features[currentFeature].benefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="h-2 w-2 text-green-500 mr-2 flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Navigation Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevious}
                disabled={currentFeature === 0}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  currentFeature === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <ArrowLeft className="h-3 w-3" />
              </button>
              
              <button
                onClick={togglePlayPause}
                className={`flex items-center px-2 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                  isPlaying 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {isPlaying ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                <span className="text-xs">{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentFeature === features.length - 1}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  currentFeature === features.length - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Feature Dots */}
            <div className="flex items-center space-x-0.5">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToFeature(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    index === currentFeature 
                      ? 'bg-blue-500 w-4' 
                      : index < currentFeature 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Voice Configuration Notice */}
          {isPlaying && !elevenLabsService.isConfigured() && (
            <div className="mt-2 text-center">
              <div className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-amber-50 text-amber-800 border border-amber-200">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
                <div>
                  <div className="font-medium">🔧 Voice Setup Needed</div>
                  <div className="mt-1">Add your free Eleven Labs API key for voice features</div>
                </div>
              </div>
            </div>
          )}

          {/* Speaking Status */}
          {isSpeaking && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-xs text-green-800">
                <div className="flex space-x-0.5 mr-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <div className="font-medium">🎤 AI Coach Speaking</div>
                  <div className="mt-0.5">Wait for completion...</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Processing Status */}
          {isProcessing && !isSpeaking && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center text-xs text-yellow-800">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></div>
                <div>
                  <div className="font-medium">⚙️ Processing Audio</div>
                  <div className="mt-0.5">Preparing next feature...</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Navigation (Expanded View) */}
        {isExpanded && (
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <h5 className="font-semibold text-gray-900 mb-2 text-sm">Quick Navigation</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {features.map((feature, index) => (
                <button
                  key={feature.id}
                  onClick={() => goToFeature(index)}
                  className={`p-2 rounded-lg text-left transition-all duration-200 ${
                    index === currentFeature
                      ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center mb-0.5">
                    {feature.icon}
                    <span className="ml-1 font-medium text-xs">{feature.title}</span>
                  </div>
                  <p className="text-xs opacity-75 line-clamp-2">{feature.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TavusAgentExplainer;