import React, { useState, useEffect } from 'react';
import { Upload, FileText, Target, Zap, Shield, TrendingUp, CheckCircle, AlertTriangle, XCircle, Download, Copy, Eye, EyeOff, RefreshCw, Star, Award, Users, Lightbulb, ArrowRight, BarChart3, PieChart, Activity, Sparkles, Edit3, Save, Plus } from 'lucide-react';
import { ResumeData } from '../lib/localStorage';
import { ATSAnalyzer, ATSAnalysisResult } from '../lib/atsAnalyzer';
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
}

const ATSOptimizer: React.FC<ATSOptimizerProps> = ({ onClose, initialResumeData, className = '' }) => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(initialResumeData || null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResult | null>(null);
  const [optimizedResult, setOptimizedResult] = useState<OptimizedResumeResult | null>(null);
  const [showOptimizedResume, setShowOptimizedResume] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'analyze' | 'optimize' | 'results'>('upload');

  const analyzer = new ATSAnalyzer();

  useEffect(() => {
    if (initialResumeData) {
      setActiveTab('analyze');
    }
  }, [initialResumeData]);

  const handleResumeUpload = (data: ParsedResume) => {
    const resumeData: ResumeData = {
      personalInfo: {
        fullName: data.personalInfo?.name || '',
        email: data.personalInfo?.email || '',
        phone: data.personalInfo?.phone || '',
        location: data.personalInfo?.location || '',
        linkedin: data.personalInfo?.linkedin || '',
        portfolio: data.personalInfo?.portfolio || ''
      },
      summary: data.summary || '',
      experience: data.experience || [],
      education: data.education || [],
      skills: {
        technical: data.skills?.technical || [],
        soft: data.skills?.soft || []
      },
      projects: data.projects || [],
      certifications: data.certifications || []
    };
    
    setResumeData(resumeData);
    setActiveTab('analyze');
    toast.success('Resume uploaded successfully!');
  };

  const handleAnalyze = async () => {
    if (!resumeData || !jobDescription.trim()) {
      toast.error('Please upload a resume and provide a job description');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzer.analyzeResume(resumeData, jobDescription);
      setAnalysisResult(result);
      setActiveTab('results');
      toast.success('Analysis completed!');
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimize = async () => {
    if (!resumeData || !jobDescription.trim()) {
      toast.error('Please complete the analysis first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const optimized = await analyzer.optimizeResume(resumeData, jobDescription);
      setOptimizedResult(optimized);
      setActiveTab('optimize');
      toast.success('Resume optimized successfully!');
    } catch (error) {
      toast.error('Optimization failed. Please try again.');
      console.error('Optimization error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadOptimizedResume = async () => {
    if (!optimizedResult?.optimizedResume) return;

    try {
      const element = document.getElementById('optimized-resume-preview');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('optimized-resume.pdf');
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      toast.error('Download failed. Please try again.');
      console.error('Download error:', error);
    }
  };

  const copyOptimizedText = () => {
    if (!optimizedResult?.optimizedResume) return;

    const resume = optimizedResult.optimizedResume;
    let text = `${resume.personalInfo.fullName}\n`;
    text += `${resume.personalInfo.email} | ${resume.personalInfo.phone}\n`;
    text += `${resume.personalInfo.location}\n\n`;
    
    if (resume.summary) {
      text += `PROFESSIONAL SUMMARY\n${resume.summary}\n\n`;
    }
    
    if (resume.skills.technical.length > 0 || resume.skills.soft.length > 0) {
      text += `SKILLS\n`;
      if (resume.skills.technical.length > 0) {
        text += `Technical: ${resume.skills.technical.join(', ')}\n`;
      }
      if (resume.skills.soft.length > 0) {
        text += `Professional: ${resume.skills.soft.join(', ')}\n`;
      }
      text += '\n';
    }
    
    if (resume.experience.length > 0) {
      text += `EXPERIENCE\n`;
      resume.experience.forEach(exp => {
        text += `${exp.title} | ${exp.company} | ${exp.startDate} - ${exp.endDate}\n`;
        text += `${exp.description}\n\n`;
      });
    }
    
    if (resume.education.length > 0) {
      text += `EDUCATION\n`;
      resume.education.forEach(edu => {
        text += `${edu.degree} | ${edu.school} | ${edu.graduationYear}\n`;
      });
    }

    navigator.clipboard.writeText(text);
    toast.success('Resume text copied to clipboard!');
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
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ATS Resume Optimizer</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Optimize your resume for Applicant Tracking Systems and increase your chances of landing interviews
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg border">
            <div className="flex space-x-1">
              {[
                { id: 'upload', label: 'Upload Resume', icon: Upload },
                { id: 'analyze', label: 'Analyze', icon: BarChart3 },
                { id: 'results', label: 'Results', icon: PieChart },
                { id: 'optimize', label: 'Optimize', icon: Sparkles }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
                <p className="text-gray-600">
                  Upload your current resume to get started with ATS optimization
                </p>
              </div>
              
              <ResumeUploader onResumeUploaded={handleResumeUpload} />
              
              {resumeData && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">Resume uploaded successfully!</span>
                  </div>
                  <p className="text-green-700 mt-1">
                    Ready to analyze: {resumeData.personalInfo.fullName}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Analyze Tab */}
          {activeTab === 'analyze' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyze Resume</h2>
                <p className="text-gray-600">
                  Provide a job description to analyze how well your resume matches
                </p>
              </div>

              {!resumeData && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-800 font-medium">No resume uploaded</span>
                  </div>
                  <p className="text-yellow-700 mt-1">
                    Please upload a resume first before analyzing
                  </p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={!resumeData}
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!resumeData || !jobDescription.trim() || isAnalyzing}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5" />
                      <span>Analyze Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && analysisResult && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${getScoreBgColor(analysisResult.overallScore)}`}>
                    <span className={`text-3xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                      {analysisResult.overallScore}%
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mt-4">ATS Compatibility Score</h2>
                  <p className="text-gray-600">
                    {analysisResult.overallScore >= 80 ? 'Excellent match!' : 
                     analysisResult.overallScore >= 60 ? 'Good match with room for improvement' : 
                     'Needs significant optimization'}
                  </p>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`text-2xl font-bold ${getScoreColor(analysisResult.keywordMatch)}`}>
                      {analysisResult.keywordMatch}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Keyword Match</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`text-2xl font-bold ${getScoreColor(analysisResult.skillsMatch)}`}>
                      {analysisResult.skillsMatch}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Skills Match</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`text-2xl font-bold ${getScoreColor(analysisResult.experienceMatch)}`}>
                      {analysisResult.experienceMatch}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Experience Match</div>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Missing Keywords */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Missing Keywords</h3>
                  </div>
                  <div className="space-y-2">
                    {analysisResult.missingKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Suggestions</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Optimize Button */}
              <div className="text-center">
                <button
                  onClick={handleOptimize}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2 mx-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Optimizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Optimize Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Optimize Tab */}
          {activeTab === 'optimize' && optimizedResult && (
            <div className="space-y-6">
              {/* Optimization Results */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full inline-block mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Optimization Complete!</h2>
                  <p className="text-gray-600">
                    Your resume has been optimized for better ATS compatibility
                  </p>
                </div>

                {/* Improvement Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      {optimizedResult.overallScore}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">New ATS Score</div>
                    <div className="text-xs text-green-600 mt-1">
                      +{optimizedResult.overallScore - (analysisResult?.overallScore || 0)}% improvement
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">
                      {optimizedResult.keywordMatch}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Keyword Match</div>
                    <div className="text-xs text-blue-600 mt-1">
                      +{optimizedResult.keywordMatch - (analysisResult?.keywordMatch || 0)}% improvement
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">
                      {optimizedResult.skillsMatch}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Skills Match</div>
                    <div className="text-xs text-purple-600 mt-1">
                      +{optimizedResult.skillsMatch - (analysisResult?.skillsMatch || 0)}% improvement
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setShowOptimizedResume(!showOptimizedResume)}
                    className="flex items-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    {showOptimizedResume ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    <span>{showOptimizedResume ? 'Hide' : 'Preview'} Optimized Resume</span>
                  </button>
                  
                  <button
                    onClick={downloadOptimizedResume}
                    className="flex items-center space-x-2 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                  </button>
                  
                  <button
                    onClick={copyOptimizedText}
                    className="flex items-center space-x-2 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                    <span>Copy Text</span>
                  </button>
                </div>
              </div>

              {/* Optimized Resume Preview */}
              {showOptimizedResume && optimizedResult.optimizedResume && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Optimized Resume Preview</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>ATS Optimized</span>
                    </div>
                  </div>
                  
                  <div id="optimized-resume-preview" className="bg-white p-8 border border-gray-200 rounded-lg">
                    {/* Header */}
                    <div className="text-center mb-6 border-b border-gray-300 pb-4">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {optimizedResult.optimizedResume.personalInfo.fullName}
                      </h1>
                      <div className="text-gray-600 space-y-1">
                        <p>{optimizedResult.optimizedResume.personalInfo.email} | {optimizedResult.optimizedResume.personalInfo.phone}</p>
                        <p>{optimizedResult.optimizedResume.personalInfo.location}</p>
                        {optimizedResult.optimizedResume.personalInfo.linkedin && (
                          <p>{optimizedResult.optimizedResume.personalInfo.linkedin}</p>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    {optimizedResult.optimizedResume.summary && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                          PROFESSIONAL SUMMARY
                        </h2>
                        <p className="text-gray-700">{optimizedResult.optimizedResume.summary}</p>
                      </div>
                    )}

                    {/* Skills */}
                    {(optimizedResult.optimizedResume.skills.technical.length > 0 || optimizedResult.optimizedResume.skills.soft.length > 0) && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">
                          CORE COMPETENCIES & SKILLS
                        </h2>
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-medium text-gray-900 mb-2">Technical Skills:</h3>
                              <p className="text-gray-700">{optimizedResult.optimizedResume.skills.technical.join(' • ')}</p>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 mb-2">Professional Skills:</h3>
                              <p className="text-gray-700">{optimizedResult.optimizedResume.skills.soft.join(' • ')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {optimizedResult.optimizedResume.experience.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                          PROFESSIONAL EXPERIENCE
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

                    {/* Education */}
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

                    {/* Additional Keywords */}
                    {optimizedResult.optimizedResume.additionalKeywords && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                          ADDITIONAL KEYWORDS
                        </h2>
                        <div className="text-gray-700 text-sm">
                          {optimizedResult.optimizedResume.additionalKeywords.join(' • ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Close Button */}
        {onClose && (
          <div className="text-center mt-8">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSOptimizer;