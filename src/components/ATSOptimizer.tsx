import React, { useState, useEffect } from 'react';
import { Upload, FileText, Target, Zap, Shield, TrendingUp, CheckCircle, AlertTriangle, XCircle, Download, Copy, Eye, EyeOff, RefreshCw, Star, Award, Users, Lightbulb, ArrowRight, BarChart3, PieChart, Activity, Sparkles, Edit3, Save, Plus } from 'lucide-react';
import { ResumeData } from '../lib/localStorage';
import { geminiATSAnalyzer, GeminiATSAnalysisResult } from '../lib/geminiATSAnalyzer';
import { ResumeUploader } from './ResumeUploader';
import { ParsedResume } from '../lib/resumeParser';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

interface ATSOptimizerProps {
  onClose?: () => void;
  initialResumeData?: ResumeData;
  className?: string;
}

const ATSOptimizer: React.FC<ATSOptimizerProps> = ({ onClose, initialResumeData, className = '' }) => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyze' | 'results' | 'optimize'>('upload');
  const [resumeData, setResumeData] = useState<ResumeData | null>(initialResumeData || null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GeminiATSAnalysisResult | null>(null);
  const [optimizedResult, setOptimizedResult] = useState<GeminiATSAnalysisResult | null>(null);
  const [inputMethod, setInputMethod] = useState<'text' | 'url'>('text');
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (initialResumeData) {
      setCurrentStep('analyze');
    }
  }, [initialResumeData]);

  const handleResumeUpload = (parsedResume: ParsedResume) => {
    const convertedData: ResumeData = {
      id: Date.now().toString(),
      title: `ATS Analysis - ${new Date().toLocaleDateString()}`,
      personalInfo: parsedResume.personalInfo,
      summary: parsedResume.summary,
      experience: parsedResume.experience,
      education: parsedResume.education,
      skills: parsedResume.skills,
      certifications: parsedResume.certifications,
      template: 'modern-professional',
      lastModified: new Date().toISOString(),
      version: 1
    };
    
    // Validate that we have sufficient data for analysis
    if (!convertedData.personalInfo.name && !convertedData.personalInfo.email && 
        convertedData.experience.length === 0 && convertedData.skills.technical.length === 0) {
      toast.error('Insufficient data extracted from resume. Please ensure your resume contains clear sections for experience, skills, and contact information.');
      return;
    }
    
    setResumeData(convertedData);
    setCurrentStep('analyze');
    toast.success(`Resume uploaded successfully! Extracted: ${convertedData.personalInfo.name || 'Contact info'}, ${convertedData.experience.length} positions, ${convertedData.skills.technical.length + convertedData.skills.soft.length} skills.`);
  };

  const fetchJobFromUrl = async (url: string): Promise<string> => {
    // Simulate job description extraction from URL
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock job description - in production, this would use a web scraping service
    return `We are seeking a talented Software Engineer to join our dynamic team. 

Key Responsibilities:
- Develop and maintain web applications using React, Node.js, and TypeScript
- Collaborate with cross-functional teams to define and implement new features
- Write clean, maintainable, and efficient code
- Participate in code reviews and maintain high coding standards
- Work with databases (PostgreSQL, MongoDB) and cloud services (AWS, Azure)

Required Skills:
- 3+ years of experience in software development
- Proficiency in JavaScript, TypeScript, React, and Node.js
- Experience with RESTful APIs and microservices architecture
- Knowledge of version control systems (Git)
- Strong problem-solving and communication skills
- Bachelor's degree in Computer Science or related field

Preferred Qualifications:
- Experience with cloud platforms (AWS, Azure, GCP)
- Knowledge of containerization (Docker, Kubernetes)
- Familiarity with CI/CD pipelines
- Experience with testing frameworks (Jest, Cypress)
- Understanding of agile development methodologies`;
  };

  const handleAnalyze = async () => {
    if (!resumeData) {
      toast.error('Please upload a resume first');
      return;
    }

    // Check if Gemini is configured
    const configStatus = geminiATSAnalyzer.getConfigurationStatus();
    if (!configStatus.configured) {
      toast.error(configStatus.message);
      return;
    }

    let finalJobDescription = jobDescription;

    if (inputMethod === 'url' && jobUrl) {
      setIsAnalyzing(true);
      try {
        finalJobDescription = await fetchJobFromUrl(jobUrl);
        setJobDescription(finalJobDescription);
      } catch (error) {
        toast.error('Failed to fetch job description from URL');
        setIsAnalyzing(false);
        return;
      }
    }

    if (!finalJobDescription.trim()) {
      toast.error('Please provide a job description');
      setIsAnalyzing(false);
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await geminiATSAnalyzer.analyzeResumeWithGemini(resumeData, finalJobDescription);
      setAnalysisResult(result);
      setCurrentStep('results');
      toast.success('ATS analysis completed with Gemini AI!');
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Handle specific error types
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
            toast.error('Analysis failed. Please try again.');
        }
      } else {
        toast.error('Analysis failed. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimizeResume = async () => {
    if (!analysisResult) {
      toast.error('Please run analysis first');
      return;
    }

    setIsOptimizing(true);

    try {
      // Since analyzeResumeWithGemini already returns optimized content,
      // we just need to set the optimized result
      setOptimizedResult(analysisResult);
      setCurrentStep('optimize');
      toast.success('ATS-optimized resume is ready!');
    } catch (error) {
      toast.error('Failed to prepare optimized content. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownloadOptimized = () => {
    if (!optimizedResult?.optimizedContent) {
      toast.error('No optimized resume available to download');
      return;
    }

    // Extract first name from the resume data
    const fullName = resumeData?.personalInfo?.name || '';
    const firstName = fullName.split(' ')[0] || 'resume';
    // Clean the first name to be filename-safe
    const cleanFirstName = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    toast.loading('Generating PDF...', { id: 'pdf-generation' });

    try {
      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.height;
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      const lineHeight = 7;
      let yPosition = margin;

      // Helper function to add text with word wrapping
      const addText = (text: string, fontSize: number = 12, fontStyle: 'normal' | 'bold' = 'normal') => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
        
        // Check if we need a new page
        if (yPosition + (lines.length * lineHeight) > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * lineHeight + 3;
      };

      // Header with name and contact info
      if (resumeData?.personalInfo) {
        addText(resumeData.personalInfo.name || 'Name', 20, 'bold');
        yPosition -= 3; // Reduce space after name
        
        const contactInfo = [
          resumeData.personalInfo.email,
          resumeData.personalInfo.phone,
          resumeData.personalInfo.location
        ].filter(Boolean).join(' | ');
        
        if (contactInfo) {
          addText(contactInfo, 10);
        }
        
        yPosition += 5; // Add space after header
      }

      // Professional Summary
      if (optimizedResult.optimizedContent.summary) {
        addText('PROFESSIONAL SUMMARY', 14, 'bold');
        addText(optimizedResult.optimizedContent.summary, 11);
        yPosition += 3;
      }

      // Experience
      if (optimizedResult.optimizedContent.experience.length > 0) {
        addText('EXPERIENCE', 14, 'bold');
        
        optimizedResult.optimizedContent.experience.forEach((exp) => {
          addText(`${exp.title} | ${exp.company}`, 12, 'bold');
          addText(exp.description, 11);
          yPosition += 2;
        });
        
        yPosition += 3;
      }

      // Skills
      if (optimizedResult.optimizedContent.skills.length > 0) {
        addText('SKILLS', 14, 'bold');
        const skillsText = optimizedResult.optimizedContent.skills.join(', ');
        addText(skillsText, 11);
        yPosition += 3;
      }

      // Education (from original resume)
      if (resumeData?.education && resumeData.education.length > 0) {
        addText('EDUCATION', 14, 'bold');
        
        resumeData.education.forEach((edu) => {
          const eduText = `${edu.degree} | ${edu.school} | ${edu.graduationYear}`;
          addText(eduText, 11);
        });
        
        yPosition += 3;
      }

      // Additional Keywords (if any)
      if (optimizedResult.optimizedContent.additionalKeywords && optimizedResult.optimizedContent.additionalKeywords.length > 0) {
        addText('ADDITIONAL KEYWORDS', 14, 'bold');
        const keywordsText = optimizedResult.optimizedContent.additionalKeywords.join(', ');
        addText(keywordsText, 10);
      }

      // Footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`ATS-Optimized Resume | Page ${i} of ${totalPages}`, pageWidth - margin - 60, pageHeight - 10);
      }

      const fileName = `${cleanFirstName}_ats_optimized_resume.pdf`;
      pdf.save(fileName);
      
      toast.success('ATS-optimized resume downloaded as PDF!', { id: 'pdf-generation' });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-generation' });
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

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    return <XCircle className="h-6 w-6 text-red-600" />;
  };

  const ScoreCard: React.FC<{ title: string; score: number; description: string; icon: React.ReactNode }> = ({ title, score, description, icon }) => (
    <div className={`p-6 rounded-xl border-2 ${getScoreBgColor(score)} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {icon}
          <h3 className="text-lg font-semibold text-gray-900 ml-2">{title}</h3>
        </div>
        <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
          {score}%
        </div>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );

  const ResumeComparison: React.FC = () => {
    if (!resumeData || !optimizedResult?.optimizedContent) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Original Resume */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 text-gray-600 mr-2" />
            Original Resume
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900">{resumeData.personalInfo.name}</h4>
              <p className="text-gray-600">{resumeData.personalInfo.email}</p>
            </div>
            {resumeData.summary && (
              <div>
                <h5 className="font-medium text-gray-900">Summary</h5>
                <p className="text-gray-600">{resumeData.summary.substring(0, 150)}...</p>
              </div>
            )}
            <div>
              <h5 className="font-medium text-gray-900">Skills</h5>
              <p className="text-gray-600">{resumeData.skills.technical.slice(0, 5).join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Optimized Resume */}
        <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Sparkles className="h-5 w-5 text-green-600 mr-2" />
            ATS-Optimized Resume
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900">{resumeData.personalInfo.name}</h4>
              <p className="text-gray-600">{resumeData.personalInfo.email}</p>
            </div>
            {optimizedResult.optimizedContent.summary && (
              <div>
                <h5 className="font-medium text-gray-900">Enhanced Summary</h5>
                <p className="text-gray-600">{optimizedResult.optimizedContent.summary.substring(0, 150)}...</p>
              </div>
            )}
            <div>
              <h5 className="font-medium text-gray-900">Optimized Skills</h5>
              <p className="text-gray-600">{optimizedResult.optimizedContent.skills.slice(0, 5).join(', ')}</p>
            </div>
            {optimizedResult.optimizedContent.additionalKeywords && (
              <div>
                <h5 className="font-medium text-green-900">Added Keywords</h5>
                <div className="flex flex-wrap gap-1 mt-1">
                  {optimizedResult.optimizedContent.additionalKeywords.slice(0, 6).map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {onClose && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">ATS Resume Builder</h2>
              <p className="text-gray-600">Generate ATS-optimized resumes with Gemini AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {['upload', 'analyze', 'results', 'optimize'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                currentStep === step 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : index < ['upload', 'analyze', 'results', 'optimize'].indexOf(currentStep)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              {index < 3 && (
                <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                  index < ['upload', 'analyze', 'results', 'optimize'].indexOf(currentStep)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <span className="text-sm text-gray-600 capitalize">
            Step {['upload', 'analyze', 'results', 'optimize'].indexOf(currentStep) + 1}: {
              currentStep === 'upload' ? 'Upload Resume' : 
              currentStep === 'analyze' ? 'Add Job Description' : 
              currentStep === 'results' ? 'View Analysis' :
              'Generate Optimized Resume'
            }
          </span>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 'upload' && (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium mb-4 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Gemini AI-Powered ATS Resume Builder
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-[1.15] animate-fade-in-up">
              Build Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">
                ATS-Optimized Resume
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.15] animate-fade-in-up delay-200">
              Upload your existing resume and we'll generate a tailored, ATS-optimized version using Google Gemini AI
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <ResumeUploader 
              onResumeUploaded={handleResumeUpload}
              mode="ats-analysis"
              className="mb-6"
            />

            {/* Features Preview */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
                <p className="text-sm text-gray-600">Advanced Gemini AI analyzes your resume against job requirements</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Optimization</h3>
                <p className="text-sm text-gray-600">Get intelligent suggestions and keyword optimization</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Optimized Resume</h3>
                <p className="text-sm text-gray-600">Generate ATS-friendly resume optimized for specific jobs</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 'analyze' && (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-800 text-sm font-medium mb-4 animate-fade-in">
              <Target className="w-4 h-4 mr-2 animate-pulse" />
              Job Description Analysis
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-[1.15]">
              Analyze Against{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-600 to-blue-600">
                Job Requirements
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Provide the job description to generate a tailored, ATS-optimized resume
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            {/* Resume Summary */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Resume Loaded
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-600">{resumeData?.personalInfo.name || 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Experience:</span>
                  <span className="ml-2 text-gray-600">{resumeData?.experience.length || 0} positions</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Skills:</span>
                  <span className="ml-2 text-gray-600">
                    {((resumeData?.skills.technical?.length || 0) + (resumeData?.skills.soft?.length || 0))} skills
                  </span>
                </div>
              </div>
            </div>

            {/* Input Method Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How would you like to provide the job description?</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => setInputMethod('text')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                    inputMethod === 'text'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <FileText className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Paste Text</div>
                  <div className="text-sm text-gray-600">Copy and paste the job description</div>
                </button>
              </div>
            </div>

            {/* Job Description Input */}
            {inputMethod === 'text' ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  rows={12}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Paste the complete job description here including requirements, responsibilities, and qualifications..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Paste the job description to generate an ATS-optimized resume using Gemini AI
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Posting URL *
                </label>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://company.com/careers/job-posting"
                />
                <p className="text-sm text-gray-500 mt-2">
                  We'll automatically extract the job description from the URL
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
                disabled={isAnalyzing || (!jobDescription.trim() && !jobUrl.trim())}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing with Gemini AI...
                  </>
                ) : (
                  <>
                    Analyze with Gemini AI
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {currentStep === 'results' && analysisResult && (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 text-green-800 text-sm font-medium mb-4 animate-fade-in">
              <Award className="w-4 h-4 mr-2 animate-pulse" />
              Gemini AI Analysis Complete
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-[1.15]">
              Your ATS{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
                Analysis Results
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Review your current ATS score and generate an optimized resume
            </p>
          </div>

          {/* Overall Score */}
          <div className="mb-8">
            <div className={`p-8 rounded-2xl border-2 ${getScoreBgColor(analysisResult.overallScore)} text-center`}>
              <div className="flex items-center justify-center mb-4">
                {getScoreIcon(analysisResult.overallScore)}
                <h3 className="text-2xl font-bold text-gray-900 ml-3">Current ATS Score</h3>
              </div>
              <div className={`text-6xl font-bold ${getScoreColor(analysisResult.overallScore)} mb-4`}>
                {analysisResult.overallScore}%
              </div>
              <p className="text-lg text-gray-700 mb-4">
                {analysisResult.overallScore >= 80 ? 'Excellent! Your resume is highly optimized for ATS systems.' :
                 analysisResult.overallScore >= 60 ? 'Good score with room for improvement.' :
                 'Significant optimization needed to pass ATS screening.'}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4 max-w-md mx-auto">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    analysisResult.overallScore >= 80 ? 'bg-green-500' : 
                    analysisResult.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${analysisResult.overallScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <ScoreCard
              title="Keyword Match"
              score={analysisResult.keywordScore}
              description="How well your resume matches job requirements"
              icon={<Target className="h-6 w-6 text-blue-600" />}
            />
            <ScoreCard
              title="Format Compliance"
              score={analysisResult.formatScore}
              description="ATS-friendly formatting and structure"
              icon={<Shield className="h-6 w-6 text-green-600" />}
            />
            <ScoreCard
              title="Content Quality"
              score={analysisResult.contentScore}
              description="Writing quality and impact of your content"
              icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
            />
            <ScoreCard
              title="Readability"
              score={analysisResult.readabilityScore}
              description="Clarity and professional presentation"
              icon={<Eye className="h-6 w-6 text-orange-600" />}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            <button
              onClick={handleOptimizeResume}
              disabled={isOptimizing}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Preparing Optimized Resume...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Optimized Resume
                </>
              )}
            </button>
          </div>

          {/* Detailed Analysis Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
              className="flex items-center justify-center w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <span className="font-medium text-gray-900 mr-2">
                {showDetailedAnalysis ? 'Hide' : 'Show'} Detailed Analysis
              </span>
              {showDetailedAnalysis ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Detailed Analysis */}
          {showDetailedAnalysis && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Keywords Analysis */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 text-purple-600 mr-2" />
                  Keyword Analysis
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-green-900 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      Found Keywords ({analysisResult.keywords.found.length})
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywords.found.slice(0, 10).map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          {keyword}
                        </span>
                      ))}
                      {analysisResult.keywords.found.length > 10 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          +{analysisResult.keywords.found.length - 10} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-red-900 mb-2 flex items-center">
                      <XCircle className="h-4 w-4 text-red-600 mr-1" />
                      Missing Keywords ({analysisResult.keywords.missing.length})
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywords.missing.slice(0, 8).map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                          {keyword}
                        </span>
                      ))}
                      {analysisResult.keywords.missing.length > 8 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          +{analysisResult.keywords.missing.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
                  AI Recommendations
                </h4>
                
                <div className="space-y-3">
                  {analysisResult.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep === 'optimize' && optimizedResult && (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-800 text-sm font-medium mb-4 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Optimized Resume Ready
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-[1.15]">
              Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-600 to-blue-600">
                ATS-Optimized Resume
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Review and download your AI-generated, ATS-optimized resume
            </p>
          </div>

          {/* Score Improvement */}
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">ATS-Optimized Resume Generated</h3>
                <p className="text-green-800">Your resume is now tailored to the job requirements with optimal keyword density</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  AI-Enhanced
                </div>
                <div className="text-sm text-green-700">Gemini AI Powered</div>
              </div>
            </div>
          </div>

          {/* Comparison Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center justify-center w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <span className="font-medium text-gray-900 mr-2">
                {showComparison ? 'Hide' : 'Show'} Before & After Comparison
              </span>
              {showComparison ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Resume Comparison */}
          {showComparison && (
            <div className="mb-8">
              <ResumeComparison />
            </div>
          )}

          {/* Optimized Resume Preview */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <FileText className="h-6 w-6 text-green-600 mr-2" />
                ATS-Optimized Resume Preview
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={handleDownloadOptimized}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>
            </div>

            {optimizedResult.optimizedContent && (
              <div className="prose max-w-none">
                <div id="optimized-resume-content" className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {resumeData?.personalInfo.name}
                    </h1>
                    <div className="text-gray-600">
                      {resumeData?.personalInfo.email} | {resumeData?.personalInfo.phone} | {resumeData?.personalInfo.location}
                    </div>
                  </div>

                  {optimizedResult.optimizedContent.summary && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">
                        PROFESSIONAL SUMMARY
                      </h2>
                      <p className="text-gray-700">{optimizedResult.optimizedContent.summary}</p>
                    </div>
                  )}

                  {optimizedResult.optimizedContent.experience.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                        EXPERIENCE
                      </h2>
                      {optimizedResult.optimizedContent.experience.map((exp, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                          </div>
                          <p className="text-gray-700 font-medium mb-2">{exp.company}</p>
                          <p className="text-gray-600 text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {optimizedResult.optimizedContent.skills.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                        SKILLS
                      </h2>
                      <div className="mb-2">
                        <span className="text-gray-700">{optimizedResult.optimizedContent.skills.join(', ')}</span>
                      </div>
                    </div>
                  )}

                  {resumeData?.education && resumeData.education.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                        EDUCATION
                      </h2>
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className="mb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                              <p className="text-gray-700">{edu.school}</p>
                            </div>
                            <span className="text-sm text-gray-600">{edu.graduationYear}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {optimizedResult.optimizedContent.additionalKeywords && optimizedResult.optimizedContent.additionalKeywords.length > 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-medium text-green-900 mb-2 flex items-center">
                        <Plus className="h-4 w-4 mr-1" />
                        Additional Keywords Added
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {optimizedResult.optimizedContent.additionalKeywords.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep('results')}
              className="px-6 py-3 text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              ← Back to Analysis
            </button>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentStep('analyze')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Analyze Different Job
              </button>
              <button
                onClick={handleDownloadOptimized}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Optimized Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSOptimizer;