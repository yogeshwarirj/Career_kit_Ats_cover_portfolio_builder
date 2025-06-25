import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle, Target, Zap, TrendingUp, FileText, Mail } from 'lucide-react';

interface ATSAnalysis {
  overallScore: number;
  resumeScore: number;
  coverLetterScore: number;
  keywords: {
    found: string[];
    missing: string[];
    suggestions: string[];
  };
  formatting: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  content: {
    score: number;
    strengths: string[];
    improvements: string[];
  };
  grammarIssues: [], // Array of grammar or spelling issues
}

interface ATSCheckerProps {
  resumeContent: string;
  coverLetterContent?: string;
  jobDescription: string;
  onClose: () => void;
}

const ATSChecker: React.FC<ATSCheckerProps> = ({ 
  resumeContent, 
  coverLetterContent, 
  jobDescription, 
  onClose 
}) => {
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    analyzeContent();
  }, [resumeContent, coverLetterContent, jobDescription]);

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const resumeAnalysis = analyzeDocument(resumeContent, jobDescription);
    const coverLetterAnalysis = coverLetterContent 
      ? analyzeDocument(coverLetterContent, jobDescription)
      : null;
    
    const overallScore = coverLetterAnalysis 
      ? Math.round((resumeAnalysis.score + coverLetterAnalysis.score) / 2)
      : resumeAnalysis.score;

    setAnalysis({
      overallScore,
      resumeScore: resumeAnalysis.score,
      coverLetterScore: coverLetterAnalysis?.score || 0,
      keywords: resumeAnalysis.keywords,
      formatting: resumeAnalysis.formatting,
      content: resumeAnalysis.content
    });
    
    setIsAnalyzing(false);
  };

const analyzeDocument = useCallback((content: string, jobDesc: string) => {
  const keywords = extractKeywords(jobDesc);
  const found = keywords.filter(k => content.toLowerCase().includes(k.toLowerCase()));
  const missing = keywords.filter(k => !content.toLowerCase().includes(k.toLowerCase()));
  const keywordScore = keywords.length ? Math.round((found.length / keywords.length) * 100) : 75;

  const formattingScore = analyzeFormatting(content);
  const contentScore = analyzeContentQuality(content);

  // Weighted score
  const score = Math.round((keywordScore * 0.4 + formattingScore * 0.3 + contentScore * 0.3));

  

    return {
      score,
      keywords: {
         found,
        missing: missingKeywords.slice(0, 5),
        suggestions: generateKeywordSuggestions(missingKeywords)
      },
      formatting: {
        score: formattingScore,
        issues: getFormattingIssues(content),
        recommendations: getFormattingRecommendations(content)
      },
      content: {
        score: contentScore,
        strengths: getContentStrengths(content),
        improvements: getContentImprovements(content)
      }
    };
  };

  const extractKeywords = (jobDesc: string): string[] => {
    const commonSkills = [
      'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git',
      'Leadership', 'Management', 'Communication', 'Problem Solving', 'Teamwork',
      'Project Management', 'Agile', 'Scrum', 'DevOps', 'Machine Learning'
    ];
    
    const words = jobDesc.split(/\s+/);
    const keywords = [];
    
    // Extract skill-related keywords
    for (const skill of commonSkills) {
      if (jobDesc.toLowerCase().includes(skill.toLowerCase())) {
        keywords.push(skill);
      }
    }
    
    // Extract other important keywords (3+ characters, appears multiple times)
    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
      if (cleanWord.length >= 3) {
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
      }
    });
    
    Object.entries(wordCount)
      .filter(([word, count]) => count >= 2 && !keywords.some(k => k.toLowerCase() === word))
      .slice(0, 10)
      .forEach(([word]) => keywords.push(word));
    
    return keywords.slice(0, 15);
  };

  const analyzeFormatting = (content: string): number => {
    let score = 100;
    
    // Check for common formatting issues
    if (content.includes('\t')) score -= 10; // Tabs can cause issues
    if (content.split('\n').some(line => line.length > 100)) score -= 5; // Long lines
    if (!/[A-Z]/.test(content)) score -= 15; // No capital letters
    if (content.split(' ').length < 50) score -= 20; // Too short
    
    return Math.max(60, score);
  };

  const analyzeContentQuality = (content: string): number => {
    let score = 75;
    
    const wordCount = content.split(' ').length;
    const sentenceCount = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = wordCount / sentenceCount;
    
    // Optimal range for readability
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 25) score += 10;
    if (wordCount >= 200 && wordCount <= 800) score += 10;
    if (content.includes('achieved') || content.includes('improved') || content.includes('increased')) score += 5;
    
    return Math.min(95, score);
  };

  const getFormattingIssues = (content: string): string[] => {
    const issues = [];
    if (content.includes('\t')) issues.push('Contains tab characters that may not display correctly');
    if (content.split('\n').some(line => line.length > 100)) issues.push('Some lines are too long');
    if (content.split(' ').length < 100) issues.push('Content may be too brief');
    return issues;
  };

  const getFormattingRecommendations = (content: string): string[] => {
    return [
      'Use consistent spacing and formatting',
      'Keep line lengths reasonable (under 80 characters)',
      'Use bullet points for lists and achievements',
      'Ensure proper capitalization throughout'
    ];
  };

  const getContentStrengths = (content: string): string[] => {
    const strengths = [];
    if (content.includes('achieved') || content.includes('improved')) {
      strengths.push('Contains action-oriented language');
    }
    if (/\d+%|\d+\$|\d+ years/.test(content)) {
      strengths.push('Includes quantifiable achievements');
    }
    if (content.split(' ').length > 200) {
      strengths.push('Comprehensive content coverage');
    }
    return strengths;
  };

  const getContentImprovements = (content: string): string[] => {
    const improvements = [];
    if (!/\d+%|\d+\$|\d+ years/.test(content)) {
      improvements.push('Add quantifiable achievements and metrics');
    }
    if (!content.includes('achieved') && !content.includes('improved')) {
      improvements.push('Use more action-oriented language');
    }
    if (content.split(' ').length < 150) {
      improvements.push('Expand content to provide more detail');
    }
    return improvements;
  };

  const generateKeywordSuggestions = (missing: string[]): string[] => {
    return missing.slice(0, 3).map(keyword => 
      `Consider adding "${keyword}" to better match job requirements`
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">ATS Compatibility Checker</h2>
                <p className="text-gray-600">Analyze your documents for Applicant Tracking Systems</p>
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
        </div>

        {/* Content */}
        <div className="p-6">
          {isAnalyzing ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Target className="h-8 w-8 text-white animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Your Documents</h3>
              <p className="text-gray-600">Checking ATS compatibility and keyword optimization...</p>
            </div>
          ) : analysis && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall ATS Score</h3>
                    <p className="text-gray-600">Combined analysis of your resume and cover letter</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}%
                    </div>
                    <div className="flex items-center justify-center mt-1">
                      {getScoreIcon(analysis.overallScore)}
                      <span className="ml-1 text-sm text-gray-600">
                        {analysis.overallScore >= 80 ? 'Excellent' : 
                         analysis.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-gray-900">Resume Score</h4>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.resumeScore)}`}>
                      {analysis.resumeScore}%
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.resumeScore}%` }}
                    ></div>
                  </div>
                </div>

                {coverLetterContent && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="font-semibold text-gray-900">Cover Letter Score</h4>
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(analysis.coverLetterScore)}`}>
                        {analysis.coverLetterScore}%
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${analysis.coverLetterScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Keywords Analysis */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 text-purple-600 mr-2" />
                  Keyword Analysis
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-green-900 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      Found Keywords ({analysis.keywords.found.length})
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.found.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-red-900 mb-2 flex items-center">
                      <XCircle className="h-4 w-4 text-red-600 mr-1" />
                      Missing Keywords ({analysis.keywords.missing.length})
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.missing.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {analysis.keywords.suggestions.length > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">Suggestions:</h5>
                    <ul className="space-y-1">
                      {analysis.keywords.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-yellow-800 text-sm">• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Detailed Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Formatting */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap className="h-5 w-5 text-orange-600 mr-2" />
                    Formatting ({analysis.formatting.score}%)
                  </h4>
                  
                  {analysis.formatting.issues.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-red-900 mb-2">Issues:</h5>
                      <ul className="space-y-1">
                        {analysis.formatting.issues.map((issue, index) => (
                          <li key={index} className="text-red-700 text-sm">• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h5 className="font-medium text-blue-900 mb-2">Recommendations:</h5>
                    <ul className="space-y-1">
                      {analysis.formatting.recommendations.map((rec, index) => (
                        <li key={index} className="text-blue-700 text-sm">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Content Quality */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 text-teal-600 mr-2" />
                    Content Quality ({analysis.content.score}%)
                  </h4>
                  
                  {analysis.content.strengths.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-green-900 mb-2">Strengths:</h5>
                      <ul className="space-y-1">
                        {analysis.content.strengths.map((strength, index) => (
                          <li key={index} className="text-green-700 text-sm">• {strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysis.content.improvements.length > 0 && (
                    <div>
                      <h5 className="font-medium text-orange-900 mb-2">Improvements:</h5>
                      <ul className="space-y-1">
                        {analysis.content.improvements.map((improvement, index) => (
                          <li key={index} className="text-orange-700 text-sm">• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Items */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Next Steps to Improve Your ATS Score</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium text-teal-900">High Priority:</h5>
                    <ul className="space-y-1 text-sm text-teal-800">
                      <li>• Add missing keywords from job description</li>
                      <li>• Include quantifiable achievements</li>
                      <li>• Use action-oriented language</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-blue-900">Medium Priority:</h5>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Optimize formatting for ATS parsing</li>
                      <li>• Ensure consistent terminology</li>
                      <li>• Review content length and structure</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATSChecker;