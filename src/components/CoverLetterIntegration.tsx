import React, { useState, useEffect } from 'react';
import { Mail, FileText, Sparkles, Download, Copy, Eye, EyeOff, Save, Zap, CheckCircle, Edit3, ArrowRight, Upload, Target, Shield } from 'lucide-react';
import { ResumeData } from '../lib/localStorage';
import toast from 'react-hot-toast';

interface CoverLetterData {
  id: string;
  resumeId: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  generatedLetter: string;
  template: string;
  createdAt: string;
  atsScore?: number;
}

interface CoverLetterIntegrationProps {
  resumeData: ResumeData;
  onClose: () => void;
}

const CoverLetterIntegration: React.FC<CoverLetterIntegrationProps> = ({ resumeData, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'input' | 'generate' | 'edit'>('input');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<CoverLetterData | null>(null);

  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    customInstructions: ''
  });

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean, formal tone perfect for corporate environments',
      color: '#2563eb',
      preview: 'Dear Hiring Manager,\n\nI am writing to express my strong interest in the [Position] role at [Company]...'
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary format with clear structure and impact',
      color: '#059669',
      preview: 'Dear [Company] Team,\n\nYour [Position] opening immediately caught my attention...'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Engaging and personable for creative industries',
      color: '#7c3aed',
      preview: 'Hello [Company]!\n\nI\'m excited to apply for the [Position] role...'
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Sophisticated tone for senior-level positions',
      color: '#dc2626',
      preview: 'Dear Executive Team,\n\nI am pleased to submit my candidacy for the [Position] position...'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateCoverLetter = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation with resume and job description analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const generatedContent = generateLetterContent(resumeData, formData, selectedTemplate);
      const atsScore = calculateATSScore(generatedContent, formData.jobDescription);
      
      const newLetter: CoverLetterData = {
        id: Date.now().toString(),
        resumeId: resumeData.id,
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        jobDescription: formData.jobDescription,
        generatedLetter: generatedContent,
        template: selectedTemplate,
        createdAt: new Date().toISOString(),
        atsScore
      };

      setCurrentLetter(newLetter);
      setCurrentStep('edit');
      toast.success('Cover letter generated successfully!');
    } catch (error) {
      toast.error('Failed to generate cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLetterContent = (resume: ResumeData, jobData: typeof formData, template: string): string => {
    const { personalInfo, experience, skills, summary } = resume;
    const { jobTitle, companyName, jobDescription, customInstructions } = jobData;
    
    // Extract relevant skills from resume that match job description
    const relevantSkills = extractRelevantSkills(skills, jobDescription);
    const relevantExperience = extractRelevantExperience(experience, jobDescription);
    
    const templates = {
      professional: `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background in ${relevantSkills.slice(0, 3).join(', ')}, I am confident that I would be a valuable addition to your team.

${summary ? `As highlighted in my resume, ${summary.substring(0, 150)}...` : ''}

In my previous role as ${relevantExperience[0]?.title || 'a professional'} at ${relevantExperience[0]?.company || 'my previous company'}, I successfully ${relevantExperience[0]?.description?.substring(0, 100) || 'contributed to various projects'}. This experience has equipped me with the skills necessary to excel in the ${jobTitle} role.

Key qualifications that align with your requirements:
• Expertise in ${relevantSkills.slice(0, 2).join(' and ')}
• Proven track record in ${relevantSkills.slice(2, 4).join(' and ')}
• Strong foundation in ${relevantSkills.slice(4, 6).join(' and ')}

${jobDescription ? `Having reviewed your job posting, I am particularly excited about the opportunity to contribute to ${companyName}'s mission and work with ${relevantSkills.slice(0, 2).join(' and ')}.` : ''}

${customInstructions ? `\n${customInstructions}\n` : ''}

I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team's success. Thank you for considering my application.

Sincerely,
${personalInfo.name}`,

      modern: `Dear ${companyName} Hiring Team,

I am excited to submit my application for the ${jobTitle} role at ${companyName}. Your company's reputation for innovation and commitment to excellence makes this an ideal opportunity for someone with my background.

RELEVANT EXPERIENCE:
${relevantExperience.slice(0, 2).map(exp => 
  `• ${exp.title} at ${exp.company} - ${exp.description?.substring(0, 80)}...`
).join('\n')}

KEY SKILLS ALIGNMENT:
${relevantSkills.slice(0, 5).map(skill => `• ${skill}`).join('\n')}

WHAT I BRING TO ${companyName.toUpperCase()}:
${summary ? `${summary.substring(0, 200)}...` : `Proven expertise in ${relevantSkills.slice(0, 3).join(', ')} with a track record of delivering results.`}

${jobDescription ? `The requirements outlined in your job posting align perfectly with my experience, particularly in ${relevantSkills.slice(0, 2).join(' and ')}.` : ''}

${customInstructions ? `\n${customInstructions}\n` : ''}

I am eager to bring my skills and passion to ${companyName} and contribute to your team's continued success.

Best regards,
${personalInfo.name}`,

      creative: `Hello ${companyName} Team!

I'm thrilled to apply for the ${jobTitle} position at ${companyName}. As someone passionate about ${relevantSkills.slice(0, 2).join(' and ')}, I believe I could bring fresh perspectives and innovative solutions to your team.

🚀 MY JOURNEY:
${summary || `I've built my career around ${relevantSkills.slice(0, 3).join(', ')}, always looking for ways to push boundaries and create impact.`}

💡 WHAT EXCITES ME ABOUT THIS ROLE:
Your job posting resonated with me because it emphasizes ${relevantSkills.slice(0, 2).join(' and ')}, areas where I've consistently delivered exceptional results. At ${relevantExperience[0]?.company || 'my previous company'}, I ${relevantExperience[0]?.description?.substring(0, 100) || 'led innovative projects'}.

🎯 MY SUPERPOWERS:
${relevantSkills.slice(0, 4).map(skill => `• ${skill}`).join('\n')}

${customInstructions ? `\n✨ SPECIAL NOTE:\n${customInstructions}\n` : ''}

I'd love to discuss how my unique blend of skills and creative approach could contribute to ${companyName}'s continued innovation and success.

Looking forward to connecting!

${personalInfo.name}`,

      executive: `Dear Executive Leadership Team,

I am pleased to submit my candidacy for the ${jobTitle} position at ${companyName}. With ${experience.length}+ years of progressive leadership experience and a proven track record in ${relevantSkills.slice(0, 3).join(', ')}, I am well-positioned to drive strategic initiatives and deliver measurable results.

EXECUTIVE SUMMARY:
${summary || `Accomplished leader with expertise in ${relevantSkills.slice(0, 3).join(', ')} and a history of transforming organizations through strategic vision and operational excellence.`}

LEADERSHIP EXPERIENCE:
${relevantExperience.slice(0, 2).map(exp => 
  `• ${exp.title} | ${exp.company}\n  ${exp.description?.substring(0, 120)}...`
).join('\n\n')}

STRATEGIC COMPETENCIES:
${relevantSkills.slice(0, 6).map(skill => `• ${skill}`).join('\n')}

VALUE PROPOSITION:
My approach to leadership combines strategic thinking with hands-on execution. I have consistently delivered results by ${relevantExperience[0]?.description?.substring(0, 100) || 'building high-performing teams and driving innovation'}.

${jobDescription ? `The strategic challenges outlined in your position description align perfectly with my experience in ${relevantSkills.slice(0, 2).join(' and ')}.` : ''}

${customInstructions ? `\nADDITIONAL CONSIDERATIONS:\n${customInstructions}\n` : ''}

I would welcome the opportunity to discuss how my leadership experience and strategic vision can contribute to ${companyName}'s continued growth and market leadership.

Respectfully,
${personalInfo.name}`
    };

    return templates[template as keyof typeof templates] || templates.professional;
  };

  const extractRelevantSkills = (resumeSkills: any, jobDescription: string): string[] => {
    const allSkills = [...(resumeSkills.technical || []), ...(resumeSkills.soft || [])];
    
    if (!jobDescription) return allSkills.slice(0, 6);
    
    const jobWords = jobDescription.toLowerCase().split(/\s+/);
    const relevantSkills = allSkills.filter(skill => 
      jobWords.some(word => skill.toLowerCase().includes(word) || word.includes(skill.toLowerCase()))
    );
    
    return relevantSkills.length > 0 ? relevantSkills : allSkills.slice(0, 6);
  };

  const extractRelevantExperience = (experience: any[], jobDescription: string): any[] => {
    if (!jobDescription) return experience.slice(0, 2);
    
    const jobWords = jobDescription.toLowerCase().split(/\s+/);
    const relevantExp = experience.filter(exp => 
      jobWords.some(word => 
        exp.title?.toLowerCase().includes(word) || 
        exp.description?.toLowerCase().includes(word) ||
        exp.company?.toLowerCase().includes(word)
      )
    );
    
    return relevantExp.length > 0 ? relevantExp : experience.slice(0, 2);
  };

  const calculateATSScore = (letter: string, jobDescription: string): number => {
    if (!jobDescription) return 75;
    
    const jobWords = jobDescription.toLowerCase().split(/\s+/);
    const letterWords = letter.toLowerCase().split(/\s+/);
    
    const matchingWords = jobWords.filter(word => 
      word.length > 3 && letterWords.includes(word)
    );
    
    const score = Math.min(95, Math.max(60, (matchingWords.length / jobWords.length) * 100 + 20));
    return Math.round(score);
  };

  const handleLetterEdit = (newContent: string) => {
    if (currentLetter) {
      const updatedLetter = { 
        ...currentLetter, 
        generatedLetter: newContent,
        atsScore: calculateATSScore(newContent, currentLetter.jobDescription)
      };
      setCurrentLetter(updatedLetter);
    }
  };

  const downloadLetter = () => {
    if (!currentLetter) return;
    
    const element = document.createElement('a');
    const file = new Blob([currentLetter.generatedLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${currentLetter.companyName}_${currentLetter.jobTitle}_Cover_Letter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success('Cover letter downloaded successfully!');
  };

  const copyToClipboard = () => {
    if (!currentLetter) return;
    
    navigator.clipboard.writeText(currentLetter.generatedLetter);
    toast.success('Cover letter copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">AI Cover Letter Generator</h2>
                <p className="text-gray-600">Create a personalized cover letter from your resume</p>
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

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-4">
              {['input', 'generate', 'edit'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    currentStep === step 
                      ? 'bg-teal-600 text-white' 
                      : index < ['input', 'generate', 'edit'].indexOf(currentStep)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 2 && (
                    <div className={`w-12 h-1 mx-2 transition-all duration-300 ${
                      index < ['input', 'generate', 'edit'].indexOf(currentStep)
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 'input' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Sparkles className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium text-blue-900">AI-Powered Analysis</h3>
                    <p className="text-blue-800 text-sm mt-1">
                      Our AI will analyze your resume and match it with the job description to create a personalized cover letter.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resume Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-teal-600" />
                    Your Resume Summary
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <span className="ml-2 text-gray-600">{resumeData.personalInfo.name || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Experience:</span>
                      <span className="ml-2 text-gray-600">{resumeData.experience.length} positions</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Skills:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {[...(resumeData.skills.technical || []), ...(resumeData.skills.soft || [])].slice(0, 6).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-teal-600" />
                    Job Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="e.g., Senior Software Engineer"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="e.g., Tech Innovations Inc."
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                <textarea
                  rows={6}
                  value={formData.jobDescription}
                  onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Paste the job description here for better AI matching and personalization..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Optional: Adding the job description helps our AI create a more targeted cover letter
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Instructions</label>
                <textarea
                  rows={3}
                  value={formData.customInstructions}
                  onChange={(e) => handleInputChange('customInstructions', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Any specific points you want to highlight or mention in the cover letter..."
                />
              </div>

              {/* Template Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Template Style</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-full mb-3"
                        style={{ backgroundColor: template.color }}
                      ></div>
                      <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                        {template.preview.substring(0, 60)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep('generate')}
                  disabled={!formData.jobTitle || !formData.companyName}
                  className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                >
                  Generate Cover Letter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 'generate' && (
            <div className="text-center py-12">
              {isGenerating ? (
                <div>
                  <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Sparkles className="h-12 w-12 text-white animate-spin" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Generating Your Cover Letter</h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Our AI is analyzing your resume and matching it with the job requirements...
                  </p>
                  
                  <div className="max-w-md mx-auto">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-gradient-to-r from-teal-600 to-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                    </div>
                    <p className="text-sm text-gray-500">Analyzing resume content and job requirements...</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="h-12 w-12 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Generate</h3>
                  <p className="text-lg text-gray-600 mb-8">
                    We'll create a personalized cover letter using your resume data and job requirements
                  </p>
                  
                  <button
                    onClick={generateCoverLetter}
                    className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Generate Cover Letter
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 'edit' && currentLetter && (
            <div className="space-y-6">
              {/* ATS Score */}
              {currentLetter.atsScore && (
                <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-900">ATS Compatibility Score</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-green-600">{currentLetter.atsScore}%</span>
                      <span className="ml-2 text-sm text-green-700">
                        {currentLetter.atsScore >= 80 ? 'Excellent' : currentLetter.atsScore >= 70 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-gray-900">Actions</h4>
                    
                    <button
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className="w-full flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      {isPreviewMode ? <Edit3 className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {isPreviewMode ? 'Edit' : 'Preview'}
                    </button>
                    
                    <button
                      onClick={downloadLetter}
                      className="w-full flex items-center justify-center px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                    
                    <button
                      onClick={copyToClipboard}
                      className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </button>
                  </div>

                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Letter Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Position:</strong> {currentLetter.jobTitle}</p>
                      <p><strong>Company:</strong> {currentLetter.companyName}</p>
                      <p><strong>Template:</strong> {templates.find(t => t.id === currentLetter.template)?.name}</p>
                      <p><strong>Words:</strong> {currentLetter.generatedLetter.split(' ').length}</p>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    {isPreviewMode ? (
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap font-serif text-gray-900 leading-relaxed">
                          {currentLetter.generatedLetter}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Edit Your Cover Letter</h4>
                        <textarea
                          value={currentLetter.generatedLetter}
                          onChange={(e) => handleLetterEdit(e.target.value)}
                          className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-serif resize-none"
                          placeholder="Edit your cover letter here..."
                        />
                        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                          <span>Characters: {currentLetter.generatedLetter.length}</span>
                          <span>Words: {currentLetter.generatedLetter.split(' ').length}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('input')}
                  className="px-6 py-3 text-gray-700 hover:text-teal-600 transition-colors duration-200"
                >
                  ← Generate New Letter
                </button>
                
                <div className="flex space-x-4">
                  <button
                    onClick={downloadLetter}
                    className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Letter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterIntegration;