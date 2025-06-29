import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, MessageCircle, Brain, Star, CheckCircle, AlertCircle, Lightbulb, Clock, Target } from 'lucide-react';
import { GeneratedQuestion } from '../lib/questionGenerator';
import { FeedbackResult } from '../lib/geminiInterviewFeedback';
import { playInterviewQuestion, stopAudio } from '../lib/elevenLabsService';

interface InterviewQuestionCardProps {
  question: GeneratedQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSubmit: (answer: string) => void;
  feedback?: FeedbackResult;
  isActive: boolean;
  className?: string;
}

const InterviewQuestionCard: React.FC<InterviewQuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSubmit,
  feedback,
  isActive,
  className = ''
}) => {
  const [answer, setAnswer] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !feedback) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, feedback]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playQuestion = async () => {
    if (isMuted) return;
    
    try {
      setIsPlaying(true);
      await playInterviewQuestion(question.question);
    } catch (error) {
      console.error('Audio playback error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const stopQuestion = () => {
    stopAudio();
    setIsPlaying(false);
  };

  const handleSubmit = () => {
    if (answer.trim()) {
      onAnswerSubmit(answer);
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
    <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 overflow-hidden transition-all duration-500 ${
      isActive ? 'ring-2 ring-blue-500 shadow-blue-500/25' : ''
    } ${className}`}>
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="font-bold text-lg">{questionNumber}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Question {questionNumber} of {totalQuestions}</h3>
              <p className="text-blue-100 text-sm">AI Interview Practice</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isActive && !feedback && (
              <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{formatTime(timeSpent)}</span>
              </div>
            )}
            {feedback && (
              <div className={`px-3 py-1 rounded-full font-bold ${getScoreColor(feedback.score)} bg-white`}>
        </div>

        {/* Question Metadata */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20 ${
            question.type === 'technical' ? 'text-blue-100' : 'text-purple-100'
          }`}>
            {question.type.toUpperCase()}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20 ${
            question.difficulty === 'easy' ? 'text-green-100' :
            question.difficulty === 'medium' ? 'text-yellow-100' : 'text-red-100'
          }`}>
            {question.difficulty.toUpperCase()}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-gray-100">
            {question.category}
          </span>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        {/* Question Text */}
        <div className="mb-6">
          <h4 className="text-xl font-bold text-gray-900 mb-4 leading-relaxed">
            {question.question}
          </h4>

          {/* Audio Controls */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={isPlaying ? stopQuestion : playQuestion}
                  disabled={isMuted}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isPlaying 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isPlaying ? 'Stop' : 'Listen'}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isMuted 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>

              <div className="text-sm text-gray-600">
                Professional Female Voice Coach
              </div>
            </div>

            {isPlaying && (
              <div className="mt-3 bg-white rounded-lg p-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm text-gray-700">Playing question...</span>
                </div>
              </div>
            )}
          </div>

          {/* Professional Guidance */}
          {question.professionalGuidance && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-blue-900 mb-1">Professional Guidance</h5>
                  <p className="text-blue-800 text-sm">{question.professionalGuidance}</p>
                </div>
              </div>
            </div>
          )}

          {/* Hints Toggle */}
          {question.hints && question.hints.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showHints ? 'Hide Hints' : 'Show Hints'} ({question.hints.length})
              </button>
              
              {showHints && (
                <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <ul className="space-y-1">
                    {question.hints.map((hint, index) => (
                      <li key={index} className="text-sm text-yellow-800 flex items-start">
                        <span className="w-4 h-4 text-yellow-600 mr-2 mt-0.5">💡</span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Answer Section */}
        {!feedback ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="font-semibold text-gray-900 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                Your Answer
              </h5>
              <span className="text-sm text-gray-500">
                {answer.length} characters
              </span>
            </div>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            />

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Brain className="h-4 w-4 mr-2" />
                Get AI Feedback
              </button>
            </div>
          </div>
        ) : (
          /* Feedback Display */
          <div className="space-y-6">
            {/* Score */}
            <div className={`p-4 rounded-xl border-2 ${getScoreBgColor(feedback.score)} text-center`}>
              <div className={`text-3xl font-bold ${getScoreColor(feedback.score)} mb-1`}>
                {feedback.score}%
              </div>
              <div className="text-sm font-medium text-gray-700">Overall Score</div>
            </div>

            {/* Overall Feedback */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h5 className="font-semibold text-blue-900 mb-2">AI Coach Feedback</h5>
              <p className="text-blue-800 text-sm leading-relaxed">{feedback.overallFeedback}</p>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(feedback.detailedAnalysis).map(([key, value]) => (
                <div key={key} className={`p-3 rounded-lg border ${getScoreBgColor(value)} text-center`}>
                  <div className={`text-lg font-bold ${getScoreColor(value)}`}>{value}%</div>
                  <div className="text-xs font-medium text-gray-700 capitalize">{key}</div>
                </div>
              ))}
            </div>

            {/* Strengths and Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-semibold text-green-900 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Strengths
                </h5>
                <ul className="space-y-1">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="text-green-800 text-sm flex items-start">
                      <Star className="h-3 w-3 mr-1 mt-0.5 text-green-600 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h5 className="font-semibold text-orange-900 mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  Improvements
                </h5>
                <ul className="space-y-1">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index} className="text-orange-800 text-sm flex items-start">
                      <AlertCircle className="h-3 w-3 mr-1 mt-0.5 text-orange-600 flex-shrink-0" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestionCard;