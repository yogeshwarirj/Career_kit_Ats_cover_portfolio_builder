import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, FileText, Download, Settings, Zap, Target, Users, Award, CheckCircle, Sparkles, Clock, BookOpen, TrendingUp, Star, Shield, Eye, Copy, RefreshCw, AlertCircle, Lightbulb, Play, Pause, Volume2, ChevronDown, ChevronUp, Mic } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { generateQuestions, QuestionGenerationParams, GeneratedQuestion } from '../lib/questionGenerator';
import { elevenLabsService, playText, stopAudio, isAudioPlaying, playInterviewQuestion } from '../lib/elevenLabsService';
import { geminiInterviewFeedback, FeedbackResult } from '../lib/geminiInterviewFeedback';
import jsPDF from 'jspdf';

interface FormData {
  jobDescription: string;
  technologies: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'technical' | 'hr';
  techInput: string;
}

const MockInterviewGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'input' | 'preview' | 'download'>('input');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [playingQuestionId, setPlayingQuestionId] = useState<string | null>(null);
  const [playingGuidanceId, setPlayingGuidanceId] = useState<string | null>(null);
  const [expandedGuidance, setExpandedGuidance] = useState<Set<string>>(new Set());
  const [elevenLabsConfigured, setElevenLabsConfigured] = useState(false);

  // New states for interactive interview
  const [interviewSessionActive, setInterviewSessionActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedbackResult, setFeedbackResult] = useState<FeedbackResult | null>(null);
  const [isAnalyzingAnswer, setIsAnalyzingAnswer] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState(''); // For captions
  const [isSpeaking, setIsSpeaking] = useState(false); // For visual agent indicator

  const [formData, setFormData] = useState<FormData>({
    jobDescription: '',
    technologies: [],
    difficulty: 'medium',
    type: 'technical',
    techInput: ''
  });

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    if (field === 'techInput') {
      const technologies = (value as string).split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
      setFormData(prev => ({
        ...prev,
        techInput: value as string,
        technologies
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Check Eleven Labs configuration on component mount
  React.useEffect(() => {
    const configStatus = elevenLabsService.getConfigurationStatus();
    setElevenLabsConfigured(configStatus.configured);
  }, []);

  const handlePlayQuestion = async (questionId: string, questionText: string) => {
    try {
      if (playingQuestionId === questionId && isAudioPlaying()) {
        stopAudio();
        setPlayingQuestionId(null);
        setIsSpeaking(false);
        setCurrentSpokenText('');
        return;
      }

      // Stop any currently playing audio
      stopAudio();
      setPlayingQuestionId(null);
      setPlayingGuidanceId(null);
      setIsSpeaking(false);
      setCurrentSpokenText('');

      setPlayingQuestionId(questionId);
      setCurrentSpokenText(questionText);
      setIsSpeaking(true);
      
      await playInterviewQuestion(questionText);
      
      setPlayingQuestionId(null);
      setIsSpeaking(false);
      setCurrentSpokenText(''); // Clear caption after speaking
    } catch (error) {
      console.error('Error playing question:', error);
      setPlayingQuestionId(null);
      setIsSpeaking(false);
      setCurrentSpokenText('');
      
      if (error instanceof Error) {
        switch (error.message) {
          case 'Eleven Labs is not configured. Please add your API key.':
            toast.error('Eleven Labs API key not configured. Please add VITE_ELEVENLABS_API_KEY to your .env file.');
            break;
          case 'Invalid Eleven Labs API key. Please check your configuration.':
            toast.error('Invalid Eleven Labs API key. Please check your configuration.');
            break;
          case 'Eleven Labs quota exceeded. Please try again later.':
            toast.error('Eleven Labs quota exceeded. Please try again later.');
            break;
          default:
            toast.error('Failed to play question audio. Please try again.');
        }
      } else {
        toast.error('Failed to play question audio. Please try again.');
      }
    }
  };

  const handlePlayGuidance = async (id: string, guidanceText: string) => {
    try {
      if (playingGuidanceId === id && isAudioPlaying()) {
        stopAudio();
        setPlayingGuidanceId(null);
        setIsSpeaking(false);
        setCurrentSpokenText('');
        return;
      }

      // Stop any currently playing audio
      stopAudio();
      setPlayingQuestionId(null);
      setPlayingGuidanceId(null);
      setIsSpeaking(false);
      setCurrentSpokenText('');

      setPlayingGuidanceId(id);
      setCurrentSpokenText(guidanceText);
      setIsSpeaking(true);
      
      await playInterviewQuestion(guidanceText);
      
      setPlayingGuidanceId(null);
      setIsSpeaking(false);
      setCurrentSpokenText(''); // Clear caption after speaking
    } catch (error) {
      console.error('Error playing guidance:', error);
      setPlayingGuidanceId(null);
      setIsSpeaking(false);
      setCurrentSpokenText('');
      toast.error('Failed to play guidance audio. Please try again.');
    }
  };

  const toggleGuidanceExpansion = (questionId: string) => {
    const newExpanded = new Set(expandedGuidance);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedGuidance(newExpanded);
  };

  const handleGenerateQuestions = async () => {
    if (!formData.jobDescription.trim()) {
      toast.error('Please provide a job description');
      return;
    }

    if (formData.technologies.length === 0) {
      toast.error('Please specify at least one technology or skill');
      return;
    }

    setIsGenerating(true);

    try {
      const params: QuestionGenerationParams = {
        jobDescription: formData.jobDescription,
        technologies: formData.technologies,
        difficulty: formData.difficulty,
        type: formData.type,
        count: 30
      };

      const result = await generateQuestions(params);

      if (result.success && result.questions.length > 0) {
        setGeneratedQuestions(result.questions);
        setCurrentStep('preview');
        toast.success(`Generated ${result.questions.length} ${formData.difficulty} ${formData.type} questions!`);
      } else {
        throw new Error(result.error || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('Question generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQuestionsAsPDF = () => {
    if (generatedQuestions.length === 0) {
      toast.error('No questions to download');
      return;
    }

    try {
      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.height;
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      const lineHeight = 7;
      let yPosition = margin;

      // Title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Mock Interview Questions', margin, yPosition);
      yPosition += lineHeight * 2;

      // Subtitle
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${formData.type.toUpperCase()} | ${formData.difficulty.toUpperCase()} Level | ${generatedQuestions.length} Questions`, margin, yPosition);
      yPosition += lineHeight * 2;

      // Technologies
      if (formData.technologies.length > 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Technologies/Skills:', margin, yPosition);
        yPosition += lineHeight;
        pdf.setFont('helvetica', 'normal');
        const techText = formData.technologies.join(', ');
        const techLines = pdf.splitTextToSize(techText, pageWidth - 2 * margin);
        pdf.text(techLines, margin, yPosition);
        yPosition += lineHeight * techLines.length + lineHeight;
      }

      // Questions
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Questions:', margin, yPosition);
      yPosition += lineHeight * 1.5;

      generatedQuestions.forEach((question, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = margin;
        }

        // Question number and category
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}. [${question.category}]`, margin, yPosition);
        yPosition += lineHeight;

        // Question text
        pdf.setFont('helvetica', 'normal');
        const questionLines = pdf.splitTextToSize(question.question, pageWidth - 2 * margin);
        pdf.text(questionLines, margin, yPosition);
        yPosition += lineHeight * questionLines.length;

        // Expected answer (if available)
        if (question.expectedAnswer && question.expectedAnswer !== 'No expected answer provided') {
          yPosition += lineHeight * 0.5;
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'italic');
          pdf.text('Expected Answer:', margin, yPosition);
          yPosition += lineHeight;
          const answerLines = pdf.splitTextToSize(question.expectedAnswer, pageWidth - 2 * margin);
          pdf.text(answerLines, margin, yPosition);
          yPosition += lineHeight * answerLines.length;
        }

        // Hints (if available)
        if (question.hints && question.hints.length > 0) {
          yPosition += lineHeight * 0.5;
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'italic');
          pdf.text('Hints:', margin, yPosition);
          yPosition += lineHeight;
          question.hints.forEach(hint => {
            const hintLines = pdf.splitTextToSize(`• ${hint}`, pageWidth - 2 * margin);
            pdf.text(hintLines, margin, yPosition);
            yPosition += lineHeight * hintLines.length;
          });
        }

        // Professional Guidance (if available)
        if (question.professionalGuidance) {
          yPosition += lineHeight * 0.5;
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'italic');
          pdf.text('Professional Guidance:', margin, yPosition);
          yPosition += lineHeight;
          const guidanceLines = pdf.splitTextToSize(question.professionalGuidance, pageWidth - 2 * margin);
          pdf.text(guidanceLines, margin, yPosition);
          yPosition += lineHeight * guidanceLines.length;
        }

        yPosition += lineHeight * 1.5; // Space between questions
      });

      // Footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generated by CareerKit with AI Voice Features | Page ${i} of ${totalPages}`, pageWidth - margin - 80, pageHeight - 10);
      }

      // Generate filename
      const techString = formData.technologies.slice(0, 2).join('_').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Mock_Interview_${formData.type}_${formData.difficulty}_${techString}.pdf`;
      
      pdf.save(filename);
      toast.success('Questions downloaded as PDF!');
      setCurrentStep('download');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const copyQuestionsToClipboard = () => {
    if (generatedQuestions.length === 0) {
      toast.error('No questions to copy');
      return;
    }

    const questionsText = generatedQuestions.map((q, index) => 
      `${index + 1}. [${q.category}] ${q.question}\n${q.expectedAnswer ? `Expected Answer: ${q.expectedAnswer}\n` : ''}${q.hints && q.hints.length > 0 ? `Hints: ${q.hints.join(', ')}\n` : ''}${q.professionalGuidance ? `Professional Guidance: ${q.professionalGuidance}\n` : ''}\n`
    ).join('');

    const fullText = `Mock Interview Questions\n${formData.type.toUpperCase()} | ${formData.difficulty.toUpperCase()} Level\nTechnologies: ${formData.technologies.join(', ')}\n\nGenerated with AI-powered professional guidance\n\n${questionsText}`;

    navigator.clipboard.writeText(fullText);
    toast.success('Questions copied to clipboard!');
  };

  const handleAnalyzeAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please type your answer before submitting for feedback.');
      return;
    }

    const currentQuestion = generatedQuestions[currentQuestionIndex];
    if (!currentQuestion) {
      toast.error('No question selected for feedback.');
      return;
    }

    // Check if Gemini is configured
    const configStatus = geminiInterviewFeedback.getConfigurationStatus();
    if (!configStatus.configured) {
      toast.error(configStatus.message);
      return;
    }

    setIsAnalyzingAnswer(true);
    setFeedbackResult(null);
    setShowFeedback(false);
    stopAudio(); // Stop any playing audio
    setIsSpeaking(false);
    setCurrentSpokenText('');

    try {
      const feedback = await geminiInterviewFeedback.analyzeAnswer(currentQuestion, userAnswer);
      setFeedbackResult(feedback);
      setShowFeedback(true);
      toast.success('Feedback generated successfully!');

      // Small pause before playing feedback
      setTimeout(() => {
        if (elevenLabsConfigured && feedback.overallFeedback) {
          handlePlayGuidance('feedback', feedback.overallFeedback);
        }
      }, 1000); // 1 second pause
      
    } catch (error) {
      console.error('Error getting feedback:', error);
      if (error instanceof Error) {
        switch (error.message) {
          case 'INVALID_API_KEY':
            toast.error('Invalid Gemini API key. Please check your configuration.');
            break;
          case 'QUOTA_EXCEEDED':
            toast.error('API quota exceeded. Please try again later.');
            break;
          case 'NETWORK_ERROR':
            toast.error('Network error. Please check your internet connection.');
            break;
          case 'GEMINI_NOT_CONFIGURED':
            toast.error('Gemini AI is not configured. Please add your API key.');
            break;
          default:
            toast.error('Failed to get feedback. Please try again.');
        }
      } else {
        toast.error('Failed to get feedback. Please try again.');
      }
    } finally {
      setIsAnalyzingAnswer(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < generatedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setFeedbackResult(null);
      setShowFeedback(false);
      stopAudio();
      setIsSpeaking(false);
      setCurrentSpokenText('');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setUserAnswer('');
      setFeedbackResult(null);
      setShowFeedback(false);
      stopAudio();
      setIsSpeaking(false);
      setCurrentSpokenText('');
    }
  };

  const handleEndInterview = () => {
    setInterviewSessionActive(false);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setFeedbackResult(null);
    setShowFeedback(false);
    stopAudio();
    setIsSpeaking(false);
    setCurrentSpokenText('');
  };

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Questions",
      description: "Generate unique, relevant questions using advanced AI technology",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Job-Specific Content",
      description: "Questions tailored to your specific job description and requirements",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Difficulty Levels",
      description: "Choose from easy, medium, or hard questions based on your experience",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Technical & HR",
      description: "Comprehensive coverage of both technical skills and behavioral questions",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      icon: <Volume2 className="h-8 w-8" />,
      title: "Professional Voice Coach",
      description: "Listen to questions and professional guidance with AI-powered text-to-speech",
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  const stats = [
    { number: "30", label: "Questions Generated", description: "Per session" },
    { number: "2", label: "Question Types", description: "Technical & HR" },
    { number: "3", label: "Difficulty Levels", description: "Easy, Medium, Hard" },
    { number: "AI", label: "Voice Coach", description: "Professional female voice" }
  ];

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
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Mock Interview Generator</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['input', 'preview', 'download'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep === step 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : index < ['input', 'preview', 'download'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    index < ['input', 'preview', 'download'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <span className="text-sm text-gray-600 capitalize">
              Step {['input', 'preview', 'download'].indexOf(currentStep) + 1}: {
                currentStep === 'input' ? 'Configure Questions' : 
                currentStep === 'preview' ? 'Review Questions' : 
                'Download & Share'
              }
            </span>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'input' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium mb-4 animate-fade-in">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                AI-Powered Mock Interview Generator
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-[1.15] animate-fade-in-up">
                Generate{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 animate-gradient-x">
                  Custom Interview
                </span>
                <br />
                Questions
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.15] animate-fade-in-up delay-200">
                Create personalized mock interview questions tailored to any job description and technology stack
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Configuration Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Configure Your Mock Interview</h2>
              
              <div className="space-y-6">
                {/* Job Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    rows={6}
                    value={formData.jobDescription}
                    onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Paste the complete job description here. Include responsibilities, requirements, and qualifications for the most relevant questions..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Provide a detailed job description for more targeted questions
                  </p>
                </div>

                {/* Technologies/Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technologies & Skills *
                  </label>
                  <input
                    type="text"
                    value={formData.techInput}
                    onChange={(e) => handleInputChange('techInput', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="JavaScript, React, Node.js, Python, AWS, Docker, etc."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separate technologies with commas. Include programming languages, frameworks, tools, and methodologies.
                  </p>
                  {formData.technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.technologies.map((tech, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Question Type and Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value as 'technical' | 'hr')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="technical">Technical Questions</option>
                      <option value="hr">HR/Behavioral Questions</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.type === 'technical' 
                        ? 'Focus on coding, system design, and technical knowledge'
                        : 'Focus on behavioral, situational, and soft skills'
                      }
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="easy">Easy (Entry Level)</option>
                      <option value="medium">Medium (Intermediate)</option>
                      <option value="hard">Hard (Senior Level)</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.difficulty === 'easy' && 'Basic concepts and simple scenarios'}
                      {formData.difficulty === 'medium' && 'Intermediate concepts and problem-solving'}
                      {formData.difficulty === 'hard' && 'Advanced concepts and complex scenarios'}
                    </p>
                  </div>
                </div>

                {/* API Key Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Lightbulb className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800 mb-1">
                        AI-Powered Generation & Professional Voice Coach
                      </h4>
                      <p className="text-sm text-blue-700">
                        Questions are generated using Google's Gemini AI for maximum relevance and quality.
                        {elevenLabsConfigured ? (
                          <span className="block mt-1 text-green-700 font-medium">
                            ✓ Professional female voice coach is enabled for realistic interview practice.
                          </span>
                        ) : (
                          <span className="block mt-1 text-orange-700">
                            Add VITE_ELEVENLABS_API_KEY to enable professional voice coach.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleGenerateQuestions}
                    disabled={isGenerating || !formData.jobDescription.trim() || formData.technologies.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Generating Questions...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Generate 30 Questions
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{stat.number}</div>
                  <div className="text-sm font-medium text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'preview' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-800 text-sm font-medium mb-4 animate-fade-in">
                <CheckCircle className="w-4 h-4 mr-2 animate-pulse" />
                Questions Generated Successfully
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-[1.15]">
                Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-600 to-blue-600">
                  Mock Interview Questions
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                Review your {generatedQuestions.length} {formData.difficulty} {formData.type} questions
              </p>
            </div>

            {/* Question Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{generatedQuestions.length}</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1 capitalize">{formData.type}</div>
                  <div className="text-sm text-gray-600">Question Type</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1 capitalize">{formData.difficulty}</div>
                  <div className="text-sm text-gray-600">Difficulty Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{formData.technologies.length}</div>
                  <div className="text-sm text-gray-600">Technologies</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Technologies:</span>
                {formData.technologies.map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  {showPreview ? <Eye className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
                
                <button
                  onClick={copyQuestionsToClipboard}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Questions
                </button>
                
                <button
                  onClick={downloadQuestionsAsPDF}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setInterviewSessionActive(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Interactive Interview
                </button>
              </div>
            </div>

            {/* Questions Preview */}
            {showPreview && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Questions Preview</h3>
                
                <div className="space-y-6 max-h-[600px] overflow-y-auto">
                  {generatedQuestions.slice(0, 10).map((question, index) => (
                    <div key={question.id} className="border-l-4 border-blue-500 pl-6 py-4 bg-gray-50 rounded-r-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900 flex-1 pr-4">
                          {index + 1}. {question.question}
                        </h4>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {elevenLabsConfigured && (
                            <button
                              onClick={() => handlePlayQuestion(question.id, question.question)}
                              disabled={playingQuestionId === question.id}
                              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                              title="Listen to question (Professional female voice)"
                            >
                              {playingQuestionId === question.id ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {question.category}
                          </span>
                        </div>
                      </div>
                      
                      {question.expectedAnswer && question.expectedAnswer !== 'No expected answer provided' && (
                        <div className="mt-3 text-sm text-gray-600">
                          <strong>Expected Answer:</strong> {question.expectedAnswer.substring(0, 150)}...
                        </div>
                      )}
                      
                      {question.hints && question.hints.length > 0 && (
                        <div className="mt-3 text-sm text-gray-500">
                          <strong>Hints:</strong> {question.hints.slice(0, 2).join(', ')}
                        </div>
                      )}
                      
                      {/* Professional Guidance Section */}
                      {question.professionalGuidance && (
                        <div className="mt-4 border-t border-gray-200 pt-3">
                          <button
                            onClick={() => toggleGuidanceExpansion(question.id)}
                            className="flex items-center justify-between w-full text-left"
                          >
                            <span className="text-sm font-medium text-purple-700 flex items-center">
                              <Mic className="h-4 w-4 mr-2" />
                              Professional Voice Guidance
                            </span>
                            {expandedGuidance.has(question.id) ? (
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                          
                          {expandedGuidance.has(question.id) && (
                            <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                              <div className="flex items-start justify-between">
                                <p className="text-sm text-purple-800 flex-1 pr-4">
                                  {question.professionalGuidance}
                                </p>
                                {elevenLabsConfigured && (
                                  <button
                                    onClick={() => handlePlayGuidance(question.id, question.professionalGuidance!)}
                                    disabled={playingGuidanceId === question.id}
                                    className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 flex-shrink-0"
                                    title="Listen to professional guidance"
                                  >
                                    {playingGuidanceId === question.id ? (
                                      <Pause className="h-3 w-3" />
                                    ) : (
                                      <Play className="h-3 w-3" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {generatedQuestions.length > 10 && (
                    <div className="text-center py-4 text-gray-500">
                      ... and {generatedQuestions.length - 10} more questions in the full PDF
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep('input')}
                className="px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                ← Generate New Questions
              </button>
              
              <button
                onClick={downloadQuestionsAsPDF}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
              >
                Download PDF
              </button>
            </div>
          </div>
        )}

        {interviewSessionActive && generatedQuestions.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium mb-4 animate-fade-in">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                Interactive Mock Interview
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-[1.15]">
                Question {currentQuestionIndex + 1} of {generatedQuestions.length}
              </h2>
              <p className="text-lg text-gray-600">
                Answer the question and get instant AI feedback.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              {/* Visual Agent Caption Area */}
              <div className={`mb-6 p-4 rounded-lg text-center text-lg font-semibold transition-all duration-300 ${isSpeaking ? 'bg-blue-100 border-2 border-blue-400 animate-pulse' : 'bg-gray-50 border border-gray-200'}`}>
                {currentSpokenText || (isSpeaking ? 'Speaking...' : 'Ready for interaction')}
              </div>

              {/* Current Question Card */}
              <div className="mb-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1 pr-4">
                    {generatedQuestions[currentQuestionIndex].question}
                  </h3>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {elevenLabsConfigured && (
                      <button
                        onClick={() => handlePlayQuestion(generatedQuestions[currentQuestionIndex].id, generatedQuestions[currentQuestionIndex].question)}
                        disabled={playingQuestionId === generatedQuestions[currentQuestionIndex].id}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                        title="Listen to question"
                      >
                        {playingQuestionId === generatedQuestions[currentQuestionIndex].id ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </button>
                    )}
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {generatedQuestions[currentQuestionIndex].category}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Difficulty: <span className="font-medium capitalize">{generatedQuestions[currentQuestionIndex].difficulty}</span>
                </p>
              </div>

              {/* User Answer Input Card */}
              <div className="mb-6 p-6 bg-gray-100 rounded-xl border border-gray-300">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer</label>
                <textarea
                  rows={8}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Type your answer here..."
                  disabled={isAnalyzingAnswer}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={handleAnalyzeAnswer}
                  disabled={isAnalyzingAnswer || !userAnswer.trim()}
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                >
                  {isAnalyzingAnswer ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Get Feedback
                    </>
                  )}
                </button>
              </div>

              {/* Feedback Display Card */}
              {showFeedback && feedbackResult && (
                <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">AI Feedback</h3>
                    <div className={`text-3xl font-bold ${feedbackResult.score >= 80 ? 'text-green-600' : feedbackResult.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {feedbackResult.score}%
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{feedbackResult.overallFeedback}</p>

                  {elevenLabsConfigured && (
                    <div className="mb-4">
                      <button
                        onClick={() => handlePlayGuidance('feedback', feedbackResult.overallFeedback)}
                        disabled={playingGuidanceId === 'feedback'}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
                      >
                        {playingGuidanceId === 'feedback' ? (
                          <Pause className="h-4 w-4 mr-2" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        Listen to Feedback
                      </button>
                    </div>
                  )}

                  {feedbackResult.strengths.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-semibold text-green-700 mb-2">Strengths:</h4>
                      <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                        {feedbackResult.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}

                  {feedbackResult.improvements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">Improvements:</h4>
                      <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                        {feedbackResult.improvements.map((i, idx) => <li key={idx}>{i}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0 || isAnalyzingAnswer}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous Question
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === generatedQuestions.length - 1 || isAnalyzingAnswer || !showFeedback}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Question →
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={handleEndInterview}
                  className="text-gray-700 hover:text-red-600 transition-colors duration-200 px-4 py-2"
                >
                  End Interview Session
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'download' && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Interview Questions Ready!</h2>
              <p className="text-lg text-gray-600 mb-8">
                Your {generatedQuestions.length} {formData.difficulty} {formData.type} questions with professional voice guidance are ready.
              </p>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Review each question thoroughly before your interview</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Practice your answers out loud or with a friend</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Use the professional voice coach to simulate real interview conditions</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Research the company and role for additional context</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Prepare specific examples from your experience</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => {
                    setCurrentStep('input');
                    setGeneratedQuestions([]);
                    setFormData({
                      jobDescription: '',
                      technologies: [],
                      difficulty: 'medium',
                      type: 'technical',
                      techInput: ''
                    });
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  Generate More Questions
                </button>
                <button
                  onClick={downloadQuestionsAsPDF}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Download Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterviewGenerator;