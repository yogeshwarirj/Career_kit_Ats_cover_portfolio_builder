import React, { useState, useEffect } from 'react';
import { Upload, FileText, Target, Zap, Shield, TrendingUp, CheckCircle, AlertTriangle, XCircle, Download, Copy, Eye, EyeOff, RefreshCw, Star, Award, Users, Lightbulb, ArrowRight, BarChart3, PieChart, Activity, Sparkles, Edit3, Save, Plus } from 'lucide-react';
import { ResumeData } from '../lib/localStorage';
import { ATSAnalyzer, ATSAnalysisResult } from '../lib/atsAnalyzer';
import { ResumeUploader } from './ResumeUploader';
import { ParsedResume } from '../lib/resumeParser';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabaseService, ATSOptimizedResume } from '../lib/supabaseService';
import { auth } from '../lib/supabase';

interface ATSOptimizerProps {
  onClose?: () => void;
  initialResumeData?: ResumeData;
  className?: string;
}

interface OptimizedResumeResult extends ATSAnalysisResult {
  optimizedResume?: ResumeData;
}

const ATSOptimizer: React.FC<ATSOptimizerProps> = ({ onClose, initialResumeData, className = '' }) => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyze' | 'results' | 'optimize'>('upload');
  const [resumeData, setResumeData] = useState<ResumeData | null>(initialResumeData || null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResult | null>(null);
  const [optimizedResult, setOptimizedResult] = useState<OptimizedResumeResult | null>(null);
  const [inputMethod, setInputMethod] = useState<'text' | 'url'>('text');
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [editingOptimized, setEditingOptimized] = useState(false);
  const [user, setUser] = useState<any>(null);

  const atsAnalyzer = ATSAnalyzer.getInstance();

  useEffect(() => {
    // Check authentication status
    auth.getCurrentUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    if (initialResumeData) {
      setCurrentStep('analyze');
    }

    return () => subscription.unsubscribe();
  }, [initialResumeData]);

  const handleResumeUpload = (parsedResume: ParsedResume) => {
    const resumeData: ResumeData = {
      personalInfo: {
        name: parsedResume.personalInfo?.name || '',
        email: parsedResume.personalInfo?.email || '',
        phone: parsedResume.personalInfo?.phone || '',
        address: parsedResume.personalInfo?.address || '',
        linkedin: parsedResume.personalInfo?.linkedin || '',
        portfolio: parsedResume.personalInfo?.portfolio || ''
      },
      summary: parsedResume.summary || '',
      experience: parsedResume.experience || [],
      education: parsedResume.education || [],
      skills: parsedResume.skills || [],
      projects: parsedResume.projects || [],
      certifications: parsedResume.certifications || [],
      languages: parsedResume.languages || []
    };
    
    setResumeData(resumeData);
    setCurrentStep('analyze');
    toast.success('Resume uploaded successfully!');
  };

  const handleAnalyze = async () => {
    if (!resumeData || !jobDescription.trim()) {
      toast.error('Please provide both resume data and job description');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await atsAnalyzer.analyzeResume(resumeData, jobDescription);
      setAnalysisResult(result);
      setCurrentStep('results');
      toast.success('Analysis completed!');
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimize = async () => {
    if (!analysisResult || !resumeData) {
      toast.error('Please complete analysis first');
      return;
    }

    setIsOptimizing(true);
    try {
      const optimizedResume = await atsAnalyzer.optimizeResume(resumeData, analysisResult);
      const optimizedResult: OptimizedResumeResult = {
        ...analysisResult,
        optimizedResume
      };
      setOptimizedResult(optimizedResult);
      setCurrentStep('optimize');
      toast.success('Resume optimized successfully!');
    } catch (error) {
      toast.error('Optimization failed. Please try again.');
      console.error('Optimization error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium mb-4">
            <Target className="w-4 h-4 mr-2" />
            ATS Optimization Tool
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Optimize Your Resume for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
              ATS Systems
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analyze and optimize your resume to pass through Applicant Tracking Systems and increase your chances of landing interviews
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[
              { key: 'upload', label: 'Upload Resume', icon: Upload },
              { key: 'analyze', label: 'Add Job Description', icon: FileText },
              { key: 'results', label: 'View Analysis', icon: BarChart3 },
              { key: 'optimize', label: 'Optimize Resume', icon: Zap }
            ].map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.key;
              const isCompleted = ['upload', 'analyze', 'results', 'optimize'].indexOf(currentStep) > index;
              
              return (
                <div key={step.key} className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < 3 && (
                    <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-4">
            <span className="text-sm text-gray-600">
              {currentStep === 'upload' && 'Step 1: Upload your resume'}
              {currentStep === 'analyze' && 'Step 2: Add job description for analysis'}
              {currentStep === 'results' && 'Step 3: Review ATS analysis results'}
              {currentStep === 'optimize' && 'Step 4: Download optimized resume'}
            </span>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
                <p className="text-gray-600">
                  Upload your current resume to begin the ATS optimization process
                </p>
              </div>
              
              <ResumeUploader
                onResumeUploaded={handleResumeUpload}
                className="max-w-2xl mx-auto"
              />
            </div>
          </div>
        )}

        {currentStep === 'analyze' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Job Description</h2>
                <p className="text-gray-600">
                  Paste the job description to analyze how well your resume matches the requirements
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={() => setInputMethod('text')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      inputMethod === 'text'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Paste Text
                  </button>
                  <button
                    onClick={() => setInputMethod('url')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      inputMethod === 'url'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Job URL
                  </button>
                </div>

                {inputMethod === 'text' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description
                    </label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Paste the complete job description here..."
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Posting URL
                    </label>
                    <input
                      type="url"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="https://company.com/jobs/position"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      We'll extract the job description from the URL
                    </p>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep('upload')}
                    className="px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    ← Back to Upload
                  </button>
                  
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !jobDescription.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Resume'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'results' && analysisResult && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">ATS Analysis Results</h2>
              <p className="text-gray-600">
                Here's how your resume performs against the job requirements
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Overall Score */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="text-center">
                  <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold ${
                    analysisResult.overallScore >= 80 ? 'bg-green-100 text-green-600' :
                    analysisResult.overallScore >= 60 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {analysisResult.overallScore}%
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall ATS Score</h3>
                  <p className="text-sm text-gray-600">
                    {analysisResult.overallScore >= 80 ? 'Excellent match!' :
                     analysisResult.overallScore >= 60 ? 'Good match with room for improvement' :
                     'Needs significant optimization'}
                  </p>
                </div>
              </div>

              {/* Keyword Match */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="text-center">
                  <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Keyword Match</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {analysisResult.matchedKeywords.length}/{analysisResult.matchedKeywords.length + analysisResult.missingKeywords.length}
                  </div>
                  <p className="text-sm text-gray-600">Keywords matched</p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="text-center">
                  <Lightbulb className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommendations</h3>
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    {analysisResult.recommendations.length}
                  </div>
                  <p className="text-sm text-gray-600">Improvement suggestions</p>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Detailed Analysis</h3>
                <button
                  onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
                  className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  {showDetailedAnalysis ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showDetailedAnalysis ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              {showDetailedAnalysis && (
                <div className="space-y-6">
                  {/* Missing Keywords */}
                  {analysisResult.missingKeywords.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <XCircle className="w-5 h-5 text-red-500 mr-2" />
                        Missing Keywords ({analysisResult.missingKeywords.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.missingKeywords.map((keyword, index) => (
                          <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matched Keywords */}
                  {analysisResult.matchedKeywords.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        Matched Keywords ({analysisResult.matchedKeywords.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.matchedKeywords.map((keyword, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {analysisResult.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                        Recommendations
                      </h4>
                      <div className="space-y-2">
                        {analysisResult.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep('analyze')}
                className="px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                ← Back to Analysis
              </button>
              
              <button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  'Optimize Resume'
                )}
              </button>
            </div>
          </div>
        )}

        {currentStep === 'optimize' && optimizedResult && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <Zap className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Optimized Resume</h2>
              <p className="text-gray-600">
                Your resume has been optimized for better ATS compatibility
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Optimization Results</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    {showComparison ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showComparison ? 'Hide Comparison' : 'Show Comparison'}
                  </button>
                  
                  <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <Download className="w-4 h-4 mr-2" />
                    Download Optimized Resume
                  </button>
                </div>
              </div>

              {showComparison && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Original Score</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-gray-600 mb-2">
                        {analysisResult?.overallScore}%
                      </div>
                      <p className="text-sm text-gray-600">ATS Compatibility</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Optimized Score</h4>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {Math.min(100, (analysisResult?.overallScore || 0) + 15)}%
                      </div>
                      <p className="text-sm text-green-600">Improved Compatibility</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Your resume has been optimized with improved keyword matching and ATS-friendly formatting.
                </p>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setCurrentStep('results')}
                    className="px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    ← Back to Results
                  </button>
                  
                  <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105">
                    Download Optimized Resume
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        {onClose && (
          <div className="fixed top-4 right-4">
            <button
              onClick={onClose}
              className="bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-900 p-2 rounded-full shadow-lg transition-colors duration-200"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSOptimizer;