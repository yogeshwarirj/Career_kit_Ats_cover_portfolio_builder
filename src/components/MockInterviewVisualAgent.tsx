import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Volume2, VolumeX, Mic, MicOff, MessageCircle, Brain, Star, Award, TrendingUp, CheckCircle, AlertCircle, Lightbulb, ArrowRight, Clock, Target } from 'lucide-react';
import { GeneratedQuestion } from '../lib/questionGenerator';
import { elevenLabsService, playInterviewQuestion, stopAudio, isAudioPlaying } from '../lib/elevenLabsService';
import { geminiInterviewFeedback, FeedbackResult } from '../lib/geminiInterviewFeedback';
import { Toaster, toast } from 'react-hot-toast';

interface MockInterviewVisualAgentProps {
  questions: GeneratedQuestion[];
  onComplete?: () => void;
  className?: string;
}

interface InterviewSession {
  currentQuestionIndex: number;
  answers: { [questionId: string]: string };
  feedback: { [questionId: string]: FeedbackResult };
  isRecording: boolean;
  isPaused: boolean;
  sessionStartTime: Date;
  questionStartTime: Date | null;
}

const MockInterviewVisualAgent: React.FC<MockInterviewVisualAgentProps> = ({
  questions,
  onComplete,
  className = ''
}) => {
  const [session, setSession] = useState<InterviewSession>({
    currentQuestionIndex: 0,
    answers: {},
    feedback: {},
    isRecording: false,
    isPaused: false,
    sessionStartTime: new Date(),
    questionStartTime: null
  });

  const [audioState, setAudioState] = useState({
    isPlaying: false,
    isMuted: false,
    currentText: '',
    progress: 0
  });

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [interviewMode, setInterviewMode] = useState<'practice' | 'timed' | 'guided'>('guided');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[session.currentQuestionIndex];
  const isLastQuestion = session.currentQuestionIndex === questions.length - 1;
  const completedQuestions = Object.keys(session.answers).length;
  const averageScore = Object.values(session.feedback).length > 0 
    ? Object.values(session.feedback).reduce((sum, f) => sum + f.score, 0) / Object.values(session.feedback).length 
    : 0;

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopAudio();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const playQuestionAudio = async (text: string) => {
    try {
      setAudioState(prev => ({ ...prev, isPlaying: true, currentText: text, progress: 0 }));
      
      // Start progress tracking
      progressInterval.current = setInterval(() => {
        setAudioState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 2, 100)
        }));
      }, 100);

      await playInterviewQuestion(text);
      
      setAudioState(prev => ({ ...prev, isPlaying: false, progress: 100 }));
      
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setAudioState(prev => ({ ...prev, isPlaying: false }));
      
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      
      if (error instanceof Error) {
        if (error.message.includes('ELEVENLABS_NOT_CONFIGURED')) {
          toast.error('Voice features require Eleven Labs API key. Please configure in settings.');
        } else {
          toast.error('Audio playback failed. Please try again.');
        }
      }
    }
  };

  const stopQuestionAudio = () => {
    stopAudio();
    setAudioState(prev => ({ ...prev, isPlaying: false, progress: 0 }));
    
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const toggleMute = () => {
    setAudioState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const startRecording = () => {
    setSession(prev => ({
      ...prev,
      isRecording: true,
      questionStartTime: new Date()
    }));
    toast.success('Recording started. Begin your answer.');
  };

  const stopRecording = () => {
    setSession(prev => ({
      ...prev,
      isRecording: false,
      questionStartTime: null
    }));
    toast.success('Recording stopped.');
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast.error('Please provide an answer before submitting.');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Save answer
      setSession(prev => ({
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestion.id]: currentAnswer
        }
      }));

      // Get AI feedback
      const feedback = await geminiInterviewFeedback.analyzeAnswer(currentQuestion, currentAnswer);
      
      setSession(prev => ({
        ...prev,
        feedback: {
          ...prev.feedback,
          [currentQuestion.id]: feedback
        }
      }));

      setShowFeedback(true);
      toast.success('Answer analyzed successfully!');
    } catch (error) {
      console.error('Feedback analysis error:', error);
      
      // Use fallback feedback
      const fallbackFeedback = geminiInterviewFeedback.generateFallbackFeedback(currentQuestion, currentAnswer);
      
      setSession(prev => ({
        ...prev,
        feedback: {
          ...prev.feedback,
          [currentQuestion.id]: fallbackFeedback
        }
      }));

      setShowFeedback(true);
      toast.success('Answer analyzed with fallback feedback.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      onComplete?.();
      return;
    }

    setSession(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1
    }));
    setCurrentAnswer('');
    setShowFeedback(false);
  };

  const previousQuestion = () => {
    if (session.currentQuestionIndex > 0) {
      setSession(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
      setCurrentAnswer(session.answers[questions[session.currentQuestionIndex - 1].id] || '');
      setShowFeedback(!!session.feedback[questions[session.currentQuestionIndex - 1].id]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      <Toaster position="top-right" />
      
      {/* Interview Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Interview Coach</h2>
              <p className="text-gray-600">Professional interview practice with real-time feedback</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{session.currentQuestionIndex + 1}</div>
              <div className="text-sm text-gray-500">of {questions.length}</div>
            </div>
            {averageScore > 0 && (
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                  {Math.round(averageScore)}%
                </div>
                <div className="text-sm text-gray-500">Avg Score</div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((session.currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentQuestion.type === 'technical' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {currentQuestion.type.toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentQuestion.difficulty === 'easy' 
                  ? 'bg-green-100 text-green-800'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                {currentQuestion.category}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-relaxed">
              {currentQuestion.question}
            </h3>
            
            {currentQuestion.professionalGuidance && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Professional Guidance</h4>
                    <p className="text-blue-800 text-sm">{currentQuestion.professionalGuidance}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Audio Controls */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Volume2 className="h-5 w-5 mr-2 text-blue-600" />
              AI Voice Coach
            </h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  audioState.isMuted 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {audioState.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => playQuestionAudio(currentQuestion.question)}
              disabled={audioState.isPlaying || audioState.isMuted}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="h-5 w-5 mr-2" />
              Play Question
            </button>

            {audioState.isPlaying && (
              <button
                onClick={stopQuestionAudio}
                className="flex items-center px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors duration-200"
              >
                <Square className="h-5 w-5 mr-2" />
                Stop
              </button>
            )}

            <div className="flex-1">
              {audioState.isPlaying && (
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Playing Question</span>
                    <span className="text-sm text-gray-500">{audioState.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-100"
                      style={{ width: `${audioState.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Answer Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
              Your Answer
            </h4>
            <div className="flex items-center space-x-2">
              {session.isRecording && (
                <div className="flex items-center text-red-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm font-medium">Recording</span>
                </div>
              )}
            </div>
          </div>

          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here or use voice recording..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            disabled={isAnalyzing}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={session.isRecording ? stopRecording : startRecording}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  session.isRecording
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {session.isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                {session.isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
              
              <span className="text-sm text-gray-500">
                {currentAnswer.length} characters
              </span>
            </div>

            <button
              onClick={submitAnswer}
              disabled={!currentAnswer.trim() || isAnalyzing}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Get AI Feedback
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      {showFeedback && session.feedback[currentQuestion.id] && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <Award className="h-6 w-6 mr-2 text-yellow-500" />
              AI Feedback & Analysis
            </h3>
            <div className={`text-3xl font-bold ${getScoreColor(session.feedback[currentQuestion.id].score)}`}>
              {session.feedback[currentQuestion.id].score}%
            </div>
          </div>

          {/* Overall Feedback */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Overall Feedback
            </h4>
            <p className="text-blue-800 leading-relaxed">
              {session.feedback[currentQuestion.id].overallFeedback}
            </p>
            
            {/* Play Feedback Button */}
            <button
              onClick={() => playQuestionAudio(session.feedback[currentQuestion.id].overallFeedback)}
              disabled={audioState.isPlaying}
              className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              <Play className="h-4 w-4 mr-2" />
              Listen to Feedback
            </button>
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(session.feedback[currentQuestion.id].detailedAnalysis).map(([key, value]) => (
              <div key={key} className={`p-4 rounded-xl border-2 ${getScoreBgColor(value)}`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(value)} mb-1`}>
                    {value}%
                  </div>
                  <div className="text-sm font-medium text-gray-700 capitalize">
                    {key}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Strengths and Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Strengths
              </h4>
              <ul className="space-y-2">
                {session.feedback[currentQuestion.id].strengths.map((strength, index) => (
                  <li key={index} className="flex items-start text-green-800">
                    <Star className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h4 className="font-semibold text-orange-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Areas for Improvement
              </h4>
              <ul className="space-y-2">
                {session.feedback[currentQuestion.id].improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start text-orange-800">
                    <Target className="h-4 w-4 mr-2 mt-0.5 text-orange-600 flex-shrink-0" />
                    <span className="text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Actionable Suggestions
            </h4>
            <ul className="space-y-2">
              {session.feedback[currentQuestion.id].suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start text-purple-800">
                  <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={previousQuestion}
          disabled={session.currentQuestionIndex === 0}
          className="flex items-center px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous Question
        </button>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSession(prev => ({ ...prev, currentQuestionIndex: 0 }))}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restart
          </button>

          <button
            onClick={nextQuestion}
            disabled={!session.answers[currentQuestion.id]}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLastQuestion ? 'Complete Interview' : 'Next Question'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockInterviewVisualAgent;