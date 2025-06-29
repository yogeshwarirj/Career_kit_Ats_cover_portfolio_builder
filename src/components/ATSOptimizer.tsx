import React, { useState, useEffect } from 'react';
import { Upload, FileText, Target, Zap, Shield, TrendingUp, CheckCircle, AlertTriangle, XCircle, Download, Copy, Eye, EyeOff, RefreshCw, Star, Award, Users, Lightbulb, ArrowRight, BarChart3, PieChart, Activity, Sparkles, Edit3, Save, Plus, Mail, AlertCircle } from 'lucide-react';
import { ResumeData } from '../lib/localStorage';
import { ATSAnalyzer, ATSAnalysisResult } from '../lib/atsAnalyzer';
import { geminiATSAnalyzer, GeminiATSAnalysisResult } from '../lib/geminiATSAnalyzer';
import { ResumeUploader } from './ResumeUploader';
import { ParsedResume } from '../lib/resumeParser';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ATSOptimizerProps {
  onClose?: () => void;
  initialResumeData?: ResumeData;
  className?: string;
}

interface OptimizedResumeResult extends ATSAnalysisResult {
  optimizedResume?: ResumeData;
  geminiAnalysis?: GeminiATSAnalysisResult;
  atsLetter?: string;
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
  const [showATSLetter, setShowATSLetter] = useState(false);
  const [editingOptimized, setEditingOptimized] = useState(false);
  const [useGeminiAI, setUseGeminiAI] = useState(true);
  const [geminiStatus, setGeminiStatus] = useState<{ configured: boolean; message: string }>({ configured: false, message: '' });

  const atsAnalyzer = ATSAnalyzer.getInstance();

  useEffect(() => {
    if (initialResumeData) {
      setCurrentStep('analyze');
    }
    
    // Check Gemini configuration status
    const status = geminiATSAnalyzer.getConfigurationStatus();
    setGeminiStatus(status);
    setUseGeminiAI(status.configured);
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
      let result: ATSAnalysisResult;
      
      if (useGeminiAI && geminiATSAnalyzer.isConfigured()) {
        try {
          console.log('Using Gemini AI for analysis...');
          const geminiResult = await geminiATSAnalyzer.analyzeResumeWithGemini(resumeData, finalJobDescription);
          
          // Convert Gemini result to standard format
          result = {
            overallScore: geminiResult.overallScore,
            keywordScore: geminiResult.keywordScore,
            formatScore: geminiResult.formatScore,
            contentScore: geminiResult.contentScore,
            keywords: geminiResult.keywords,
            formatting: {
              issues: geminiResult.weaknesses,
              recommendations: geminiResult.recommendations.slice(0, 3)
            },
            content: {
              strengths: geminiResult.strengths,
              improvements: geminiResult.weaknesses
            },
            recommendations: geminiResult.recommendations,
            detailedAnalysis: {
              sections: [
                {
                  name: 'AI Analysis',
                  score: geminiResult.overallScore,
                  issues: geminiResult.weaknesses,
                  suggestions: geminiResult.recommendations.slice(0, 3)
                }
              ],
              readabilityScore: geminiResult.readabilityScore,
              lengthAnalysis: {
                wordCount: finalJobDescription.split(' ').length,
                optimal: true,
                recommendation: 'Resume length is appropriate for ATS processing'
              }
            }
          };
          
          toast.success('AI-powered ATS analysis completed!');
        } catch (error) {
          console.error('Gemini analysis failed:', error);
          
          // Handle specific error types
          if (error instanceof Error) {
            if (error.message === 'GEMINI_NOT_CONFIGURED') {
              toast.error('Gemini AI not configured. Using standard analysis.');
            } else if (error.message === 'INVALID_API_KEY') {
              toast.error('Invalid Gemini API key. Using standard analysis.');
            } else if (error.message === 'QUOTA_EXCEEDED') {
              toast.error('Gemini API quota exceeded. Using standard analysis.');
            } else if (error.message === 'NETWORK_ERROR') {
              toast.error('Network error. Using standard analysis.');
            } else {
              toast.error('AI analysis failed. Using standard analysis.');
            }
          }
          
          // Fallback to standard analysis
          result = await atsAnalyzer.analyzeResume(resumeData, finalJobDescription);
        }
      } else {
        console.log('Using standard analysis...');
        result = await atsAnalyzer.analyzeResume(resumeData, finalJobDescription);
        if (!geminiStatus.configured) {
          toast.error('AI analysis unavailable, using standard analysis', { duration: 4000 });
        }
      }
      
      setAnalysisResult(result);
      setCurrentStep('results');
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimizeResume = async () => {
    if (!resumeData || !jobDescription) {
      toast.error('Resume data and job description are required');
      return;
    }

    setIsOptimizing(true);

    try {
      let result: OptimizedResumeResult;
      
      if (useGeminiAI && geminiATSAnalyzer.isConfigured()) {
        try {
          console.log('Using Gemini AI for optimization...');
          const geminiResult = await geminiATSAnalyzer.analyzeResumeWithGemini(resumeData, jobDescription);
          
          // Create optimized resume from Gemini suggestions
          const optimizedResume = { ...resumeData };
          
          if (geminiResult.optimizedContent.summary) {
            optimizedResume.summary = geminiResult.optimizedContent.summary;
          }
          
          if (geminiResult.optimizedContent.skills.length > 0) {
            optimizedResume.skills = {
              ...optimizedResume.skills,
              technical: [...new Set([...optimizedResume.skills.technical, ...geminiResult.optimizedContent.skills])]
            };
          }
          
          if (geminiResult.optimizedContent.additionalKeywords.length > 0) {
            (optimizedResume as any).additionalKeywords = geminiResult.optimizedContent.additionalKeywords;
          }
          
          // Convert to expected format
          result = {
            overallScore: geminiResult.overallScore,
            keywordScore: geminiResult.keywordScore,
            formatScore: geminiResult.formatScore,
            contentScore: geminiResult.contentScore,
            keywords: geminiResult.keywords,
            formatting: {
              issues: geminiResult.weaknesses,
              recommendations: geminiResult.recommendations.slice(0, 3)
            },
            content: {
              strengths: geminiResult.strengths,
              improvements: geminiResult.weaknesses
            },
            recommendations: geminiResult.recommendations,
            detailedAnalysis: {
              sections: [
                {
                  name: 'AI Optimization',
                  score: geminiResult.overallScore,
                  issues: geminiResult.weaknesses,
                  suggestions: geminiResult.recommendations.slice(0, 3)
                }
              ],
              readabilityScore: geminiResult.readabilityScore,
              lengthAnalysis: {
                wordCount: jobDescription.split(' ').length,
                optimal: true,
                recommendation: 'Resume length is optimized for ATS processing'
              }
            },
            optimizedResume
          };
          
          toast.success('AI-powered optimized resume generated!');
        } catch (error) {
          console.error('Gemini optimization failed:', error);
          toast.error('AI optimization failed. Using standard optimization.');
          result = await atsAnalyzer.generateOptimizedResume(resumeData, jobDescription);
        }
      } else {
        result = await atsAnalyzer.generateOptimizedResume(resumeData, jobDescription);
        if (!geminiStatus.configured) {
          toast.error('AI optimization unavailable, using standard optimization', { duration: 4000 });
        }
      }
      
      setOptimizedResult(result);
      setCurrentStep('optimize');
    } catch (error) {
      toast.error('Failed to generate optimized resume. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const createOptimizedResumeFromGemini = (originalResume: ResumeData, geminiAnalysis: GeminiATSAnalysisResult): ResumeData => {
    return {
      ...originalResume,
      summary: geminiAnalysis.optimizedContent.summary,
      experience: originalResume.experience.map((exp, index) => {
        const optimizedExp = geminiAnalysis.optimizedContent.experience[index];
        return optimizedExp ? {
          ...exp,
          description: optimizedExp.description
        } : exp;
      }),
      skills: {
        technical: [...new Set([...(originalResume.skills?.technical || []), ...geminiAnalysis.optimizedContent.skills])],
        soft: originalResume.skills?.soft || []
      },
      additionalKeywords: geminiAnalysis.optimizedContent.additionalKeywords
    };
  };

  const extractResumeText = (resumeData: ResumeData): string => {
    const sections = [
      resumeData.personalInfo?.name || '',
      resumeData.summary || '',
      resumeData.experience?.map(exp => 
        `${exp.title} ${exp.company} ${exp.description}`
      ).join(' ') || '',
      resumeData.education?.map(edu => 
        `${edu.degree} ${edu.school}`
      ).join(' ') || '',
      resumeData.skills?.technical?.join(' ') || '',
      resumeData.skills?.soft?.join(' ') || ''
    ];
    
    return sections.filter(section => section.trim()).join(' ');
  };

  const handleDownloadOptimized = () => {
    if (!optimizedResult?.optimizedResume) return;

    // Extract first name from the resume data
    const fullName = optimizedResult.optimizedResume.personalInfo?.name || '';
    const firstName = fullName.split(' ')[0] || 'resume';
    // Clean the first name to be filename-safe
    const cleanFirstName = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const element = document.getElementById('optimized-resume-content');
    if (!element) {
      toast.error('Resume content not found. Please try again.');
      return;
    }

    toast.loading('Generating PDF...', { id: 'pdf-generation' });

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      try {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;
        
        // Calculate if content needs multiple pages
        const scaledHeight = imgHeight * ratio;
        
        if (scaledHeight <= pdfHeight) {
          // Single page
          pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, scaledHeight);
        } else {
          // Multiple pages
          let position = 0;
          const pageHeight = pdfHeight;
          
          while (position < scaledHeight) {
            const remainingHeight = scaledHeight - position;
            const currentPageHeight = Math.min(pageHeight, remainingHeight);
            
            // Create a temporary canvas for this page section
            const pageCanvas = document.createElement('canvas');
            const pageCtx = pageCanvas.getContext('2d');
            const sourceY = (position / ratio);
            const sourceHeight = (currentPageHeight / ratio);
            
            pageCanvas.width = imgWidth;
            pageCanvas.height = sourceHeight;
            
            if (pageCtx) {
              pageCtx.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);
              const pageImgData = pageCanvas.toDataURL('image/png');
              
              if (position > 0) {
                pdf.addPage();
              }
              
              pdf.addImage(pageImgData, 'PNG', imgX, 0, imgWidth * ratio, currentPageHeight);
            }
            
            position += pageHeight;
          }
        }
        
        const fileName = `${cleanFirstName}_ats_resume.pdf`;
        pdf.save(fileName);
        
        toast.success('Optimized resume downloaded as PDF!', { id: 'pdf-generation' });
      } catch (error) {
        console.error('PDF generation error:', error);
        toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-generation' });
      }
    }).catch(error => {
      console.error('Canvas generation error:', error);
      toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-generation' });
    });
  };

  const generateResumeText = (resume: ResumeData): string => {
    let text = `${resume.personalInfo.name}\n`;
    text += `${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.location}\n\n`;
    
    if (resume.summary) {
      text += `PROFESSIONAL SUMMARY\n${resume.summary}\n\n`;
    }
    
    if (resume.experience.length > 0) {
      text += `EXPERIENCE\n`;
      resume.experience.forEach(exp => {
        text += `${exp.title} | ${exp.company} | ${exp.startDate} - ${exp.endDate}\n`;
        text += `${exp.description}\n\n`;
      });
    }
    
    if (resume.skills.technical.length > 0 || resume.skills.soft.length > 0) {
      text += `SKILLS\n`;
      if (resume.skills.technical.length > 0) {
        text += `Technical: ${resume.skills.technical.join(', ')}\n`;
      }
      if (resume.skills.soft.length > 0) {
        text += `Soft Skills: ${resume.skills.soft.join(', ')}\n`;
      }
      text += '\n';
    }
    
    if (resume.education.length > 0) {
      text += `EDUCATION\n`;
      resume.education.forEach(edu => {
        text += `${edu.degree} | ${edu.school} | ${edu.graduationYear}\n`;
      });
    }
    
    return text;
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
    if (!resumeData || !optimizedResult?.optimizedResume) return null;

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
              <h4 className="font-medium text-gray-900">{optimizedResult.optimizedResume.personalInfo.name}</h4>
              <p className="text-gray-600">{optimizedResult.optimizedResume.personalInfo.email}</p>
            </div>
            {optimizedResult.optimizedResume.summary && (
              <div>
                <h5 className="font-medium text-gray-900">Enhanced Summary</h5>
                <p className="text-gray-600">{optimizedResult.optimizedResume.summary.substring(0, 150)}...</p>
              </div>
            )}
            <div>
              <h5 className="font-medium text-gray-900">Optimized Skills</h5>
              <p className="text-gray-600">{optimizedResult.optimizedResume.skills.technical.slice(0, 5).join(', ')}</p>
            </div>
            {optimizedResult.optimizedResume.additionalKeywords && (
              <div>
                <h5 className="font-medium text-green-900">Added Keywords</h5>
                <div className="flex flex-wrap gap-1 mt-1">
                  {optimizedResult.optimizedResume.additionalKeywords.slice(0, 6).map((keyword, index) => (
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
              <p className="text-gray-600">Generate ATS-optimized resumes tailored to job descriptions</p>
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
              AI-Powered ATS Resume Builder
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-[1.15] animate-fade-in-up">
              Build Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">
                ATS-Optimized Resume
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.15] animate-fade-in-up delay-200">
              Upload your existing resume and we'll generate a tailored, ATS-optimized version based on any job description
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            {/* Gemini AI Status */}
            <div className="mb-6 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${geminiStatus.configured ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <h3 className="font-medium text-gray-900">Google Gemini AI Status</h3>
                    <p className="text-sm text-gray-600">{geminiStatus.message}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useGeminiAI && geminiStatus.configured}
                      onChange={(e) => setUseGeminiAI(e.target.checked)}
                      disabled={!geminiStatus.configured}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {geminiStatus.configured ? 'Use AI Analysis' : 'AI Unavailable'}
                    </span>
                  </label>
                </div>
              </div>
              
              {!geminiStatus.configured && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" />
                    <div className="text-sm">
                      <p className="text-yellow-800 font-medium mb-1">Setup Required</p>
                      <p className="text-yellow-700 mb-2">
                        To enable AI-powered analysis, please configure your Gemini API key:
                      </p>
                      <ol className="text-yellow-700 text-xs space-y-1 ml-4 list-decimal">
                        <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                        <li>Create a new API key</li>
                        <li>Add it to your .env file as VITE_GEMINI_API_KEY</li>
                        <li>Restart your development server</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                <h3 className="font-semibold text-gray-900 mb-2">Job-Specific Optimization</h3>
                <p className="text-sm text-gray-600">Tailor your resume to match specific job requirements and keywords</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-Time Feedback</h3>
                <p className="text-sm text-gray-600">Get instant suggestions and improvements as you build</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Multiple Formats</h3>
                <p className="text-sm text-gray-600">Export your optimized resume in TEXT ATS-friendly formats</p>
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
                  Paste the job description to generate an ATS-optimized resume based on your uploaded resume
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
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Resume
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
              Analysis Complete
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-[1.15]">
              Your ATS{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
                Analysis Results
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Review your current ATS score and generate an optimized version
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            <button
              onClick={handleOptimizeResume}
              disabled={isOptimizing}
              className={`text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center ${
                useGeminiAI && geminiStatus.configured 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                  : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
              }`}
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Generating Optimized Resume...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {useGeminiAI && geminiStatus.configured ? 'Generate AI-Optimized Resume' : 'Generate ATS-Optimized Resume'}
                </>
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useGeminiAI"
                checked={useGeminiAI}
                onChange={(e) => setUseGeminiAI(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="useGeminiAI" className="text-sm text-gray-700 flex items-center">
                <Sparkles className="h-4 w-4 text-blue-500 mr-1" />
                Use Gemini AI
              </label>
            </div>
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
              {/* Gemini AI Analysis Results */}
              {optimizedResult?.geminiAnalysis && (
                <div className="lg:col-span-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg border border-blue-200 p-6 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
                    Gemini AI Enhanced Analysis
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-green-900 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        Strengths
                      </h5>
                      <ul className="space-y-1">
                        {optimizedResult.geminiAnalysis.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-green-800 flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-orange-900 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mr-1" />
                        Areas for Improvement
                      </h5>
                      <ul className="space-y-1">
                        {optimizedResult.geminiAnalysis.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm text-orange-800 flex items-start">
                            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-blue-900 mb-2">AI Recommendations</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {optimizedResult.geminiAnalysis.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start text-sm text-blue-800">
                          <Lightbulb className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
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
                      {analysisResult.keywords.found.map((keyword, index) => (
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
                      {analysisResult.keywords.missing.map((keyword, index) => (
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
                  Optimization Recommendations
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
              Optimization Complete
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-[1.15]">
              Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-600 to-blue-600">
                ATS-Optimized Resume
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Review and download your tailored, ATS-optimized resume
            </p>
          </div>

          {/* Score Improvement */}
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">ATS Score Improvement</h3>
                <p className="text-green-800">Your optimized resume is projected to score significantly higher</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  {analysisResult ? analysisResult.overallScore : 0}% → 85%+
                </div>
                <div className="text-sm text-green-700">Estimated improvement</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            {optimizedResult.atsLetter && (
              <button
                onClick={() => setShowATSLetter(!showATSLetter)}
                className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                <Mail className="mr-2 h-5 w-5" />
                {showATSLetter ? 'Hide' : 'View'} ATS Cover Letter
              </button>
            )}
            
            <button
              onClick={handleDownloadOptimized}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Optimized Resume
            </button>
          </div>

          {/* ATS Cover Letter Section */}
          {showATSLetter && optimizedResult.atsLetter && (
            <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Mail className="h-6 w-6 text-purple-600 mr-2" />
                  ATS-Optimized Cover Letter
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(optimizedResult.atsLetter || '')}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="whitespace-pre-wrap font-serif text-gray-900 leading-relaxed">
                  {optimizedResult.atsLetter}
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1" />
                  AI-Generated Features
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-800">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>ATS-optimized keywords</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Job-specific content</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Professional formatting</span>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  onClick={() => setEditingOptimized(!editingOptimized)}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  {editingOptimized ? <Eye className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                  {editingOptimized ? 'Preview' : 'Edit'}
                </button>
                <button
                  onClick={handleDownloadOptimized}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>
            </div>

            {optimizedResult.optimizedResume && (
              <div className="prose max-w-none">
                <div id="optimized-resume-content" className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {optimizedResult.optimizedResume.personalInfo.name}
                    </h1>
                    <div className="text-gray-600">
                      {optimizedResult.optimizedResume.personalInfo.email} | {optimizedResult.optimizedResume.personalInfo.phone} | {optimizedResult.optimizedResume.personalInfo.location}
                    </div>
                  </div>

                  {optimizedResult.optimizedResume.summary && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">
                        PROFESSIONAL SUMMARY
                      </h2>
                      <p className="text-gray-700">{optimizedResult.optimizedResume.summary}</p>
                    </div>
                  )}

                  {optimizedResult.optimizedResume.experience.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                        EXPERIENCE
                      </h2>
                      {optimizedResult.optimizedResume.experience.map((exp, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                            <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
                          </div>
                          <p className="text-gray-700 font-medium mb-2">{exp.company}</p>
                          <p className="text-gray-600 text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {(optimizedResult.optimizedResume.skills.technical.length > 0 || optimizedResult.optimizedResume.skills.soft.length > 0) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                        SKILLS
                      </h2>
                      {optimizedResult.optimizedResume.skills.technical.length > 0 && (
                        <div className="mb-2">
                          <strong className="text-gray-900">Technical:</strong>
                          <span className="text-gray-700 ml-2">{optimizedResult.optimizedResume.skills.technical.join(', ')}</span>
                        </div>
                      )}
                      {optimizedResult.optimizedResume.skills.soft.length > 0 && (
                        <div>
                          <strong className="text-gray-900">Soft Skills:</strong>
                          <span className="text-gray-700 ml-2">{optimizedResult.optimizedResume.skills.soft.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {optimizedResult.optimizedResume.education.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                        EDUCATION
                      </h2>
                      {optimizedResult.optimizedResume.education.map((edu, index) => (
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

                  {optimizedResult.optimizedResume.additionalKeywords && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-medium text-green-900 mb-2 flex items-center">
                        <Plus className="h-4 w-4 mr-1" />
                        Additional Keywords Added
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {optimizedResult.optimizedResume.additionalKeywords.map((keyword, index) => (
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
              className="px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              ← Back to Analysis
            </button>
            
            <div className="flex space-x-4">
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