import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, User, Building, Briefcase, Sparkles, Download, Copy, Eye, EyeOff, Save, Clock, Crown, Shield, Zap, CheckCircle, Star, Award, Users, Target, Edit3, Palette, Layout, BookOpen, Mail, Phone, MapPin, Globe, Linkedin, XCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { geminiATSAnalyzer, ATSLetterParams } from '../lib/geminiATSAnalyzer';
import { ResumeData } from '../lib/localStorage';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CoverLetterData {
  id: string;
  jobTitle: string;
  companyName: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    portfolio: string;
  };
  skills: string[];
  jobDescription: string;
  generatedLetter: string;
  template: string;
  createdAt: string;
}

interface UserSubscription {
  isSubscribed: boolean;
  freeLettersUsed: number;
  maxFreeLetters: number;
  subscriptionType: string | null;
  expiresAt: string | null;
}

const CoverLetterGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'input' | 'template' | 'generate' | 'edit'>('input');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [savedLetters, setSavedLetters] = useState<CoverLetterData[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription>({
    isSubscribed: false,
    freeLettersUsed: 0,
    maxFreeLetters: 300,
    subscriptionType: null,
    expiresAt: null
  });

  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      portfolio: ''
    },
    skills: [] as string[],
    jobDescription: '',
    skillsInput: '',
    achievements: ''
  });

  const [currentLetter, setCurrentLetter] = useState<CoverLetterData | null>(null);

  // Load saved data on component mount
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem('coverLetters');
      const sub = localStorage.getItem('subscription');
      
      if (saved) {
        setSavedLetters(JSON.parse(saved));
      }
      
      if (sub) {
        setSubscription(JSON.parse(sub));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveToLocalStorage = (letters: CoverLetterData[], sub: UserSubscription) => {
    try {
      localStorage.setItem('coverLetters', JSON.stringify(letters));
      localStorage.setItem('subscription', JSON.stringify(sub));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('personalInfo.')) {
      const personalField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [personalField]: value
        }
      }));
    } else if (field === 'skillsInput') {
      setFormData(prev => ({
        ...prev,
        skillsInput: value,
        skills: value.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const canGenerateNewLetter = () => {
    return subscription.isSubscribed || subscription.freeLettersUsed < subscription.maxFreeLetters;
  };

  // Convert form data to ResumeData format for Gemini API
  const convertFormDataToResumeData = (): ResumeData => {
    return {
      id: Date.now().toString(),
      title: `Cover Letter Resume Data - ${new Date().toLocaleDateString()}`,
      personalInfo: formData.personalInfo,
      summary: '', // Not provided in cover letter form
      experience: [], // Not provided in cover letter form
      education: [], // Not provided in cover letter form
      skills: {
        technical: formData.skills,
        soft: []
      },
      certifications: [], // Not provided in cover letter form
      template: 'modern-professional',
      lastModified: new Date().toISOString(),
      version: 1
    };
  };

  const generateCoverLetter = async () => {
    if (!canGenerateNewLetter()) {
      toast.error('You have reached your free letter limit. Please subscribe to continue.');
      return;
    }

    // Check if Gemini is configured
    const configStatus = geminiATSAnalyzer.getConfigurationStatus();
    if (!configStatus.configured) {
      toast.error('Gemini AI is not configured. Please add your API key to generate AI-powered cover letters.');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Convert form data to ResumeData format
      const resumeData = convertFormDataToResumeData();
      
      // Create ATSLetterParams for Gemini API
      const letterParams: ATSLetterParams = {
        resumeData,
        jobDescription: formData.jobDescription,
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        applicantName: formData.personalInfo.name,
        achievements: formData.achievements
      };

      // Generate cover letter using Gemini AI
      console.log('Generating cover letter with Gemini AI...');
      const generatedContent = await geminiATSAnalyzer.generateATSLetter(letterParams);
      
      const newLetter: CoverLetterData = {
        id: Date.now().toString(),
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        personalInfo: formData.personalInfo,
        skills: formData.skills,
        jobDescription: formData.jobDescription,
        generatedLetter: generatedContent,
        template: selectedTemplate,
        createdAt: new Date().toISOString()
      };

      const updatedLetters = [...savedLetters, newLetter];
      const updatedSubscription = {
        ...subscription,
        freeLettersUsed: subscription.isSubscribed ? subscription.freeLettersUsed : subscription.freeLettersUsed + 1
      };

      setSavedLetters(updatedLetters);
      setSubscription(updatedSubscription);
      setCurrentLetter(newLetter);
      saveToLocalStorage(updatedLetters, updatedSubscription);
      
      setCurrentStep('edit');
      toast.success('AI-powered cover letter generated successfully!');
    } catch (error) {
      console.error('Cover letter generation error:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        switch (error.message) {
          case 'GEMINI_NOT_CONFIGURED':
            toast.error('Gemini AI is not configured. Please add your API key.');
            break;
          case 'LETTER_GENERATION_FAILED':
            toast.error('Failed to generate cover letter. Please try again.');
            break;
          case 'INVALID_API_KEY':
            toast.error('Invalid Gemini API key. Please check your configuration.');
            break;
          case 'QUOTA_EXCEEDED':
            toast.error('API quota exceeded. Please try again later.');
            break;
          case 'NETWORK_ERROR':
            toast.error('Network error. Please check your internet connection.');
            break;
          default:
            toast.error('Failed to generate cover letter. Please try again.');
        }
      } else {
        toast.error('Failed to generate cover letter. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLetterEdit = (newContent: string) => {
    if (currentLetter) {
      const updatedLetter = { ...currentLetter, generatedLetter: newContent };
      const updatedLetters = savedLetters.map(letter => 
        letter.id === currentLetter.id ? updatedLetter : letter
      );
      
      setSavedLetters(updatedLetters);
      setCurrentLetter(updatedLetter);
      saveToLocalStorage(updatedLetters, subscription);
    }
  };

  const downloadLetter = () => {
    if (!currentLetter) return;
    
    toast.loading('Generating PDF...', { id: 'pdf-generation' });
    
    // Create a temporary div for PDF generation
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '210mm'; // A4 width
    tempDiv.style.padding = '20mm';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.fontSize = '12pt';
    tempDiv.style.lineHeight = '1.6';
    tempDiv.style.color = '#000000';
    tempDiv.style.backgroundColor = '#ffffff';
    tempDiv.style.whiteSpace = 'pre-wrap';
    tempDiv.innerHTML = currentLetter.generatedLetter.replace(/\n/g, '<br>');
    
    document.body.appendChild(tempDiv);
    
    html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: tempDiv.offsetWidth,
      height: tempDiv.offsetHeight
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
        
        const fileName = `${currentLetter.companyName}_${currentLetter.jobTitle}_Cover_Letter.pdf`;
        pdf.save(fileName);
        
        // Clean up
        document.body.removeChild(tempDiv);
        
        toast.success('Cover letter downloaded as PDF!', { id: 'pdf-generation' });
      } catch (error) {
        console.error('PDF generation error:', error);
        document.body.removeChild(tempDiv);
        toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-generation' });
      }
    }).catch(error => {
      console.error('Canvas generation error:', error);
      document.body.removeChild(tempDiv);
      toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-generation' });
    });
  };

  const copyToClipboard = () => {
    if (!currentLetter) return;
    
    navigator.clipboard.writeText(currentLetter.generatedLetter);
    toast.success('Cover letter copied to clipboard!');
  };

  const handleDeleteLetter = (letterId: string) => {
    const updatedLetters = savedLetters.filter(letter => letter.id !== letterId);
    setSavedLetters(updatedLetters);
    saveToLocalStorage(updatedLetters, subscription);
    
    // If the deleted letter is currently being viewed, clear it
    if (currentLetter?.id === letterId) {
      setCurrentLetter(null);
      setCurrentStep('input');
    }
    
    toast.success('Cover letter deleted successfully!');
  };

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean, formal tone perfect for corporate environments',
      preview: 'Dear Hiring Manager,\n\nI am writing to express my strong interest...',
      color: '#2563eb'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Engaging and personable for creative industries',
      preview: 'Hello Team!\n\nI\'m thrilled to apply for this exciting opportunity...',
      color: '#7c3aed'
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary format with bullet points and clear structure',
      preview: 'Dear Hiring Team,\n\nKey highlights of my qualifications include:...',
      color: '#059669'
    },
    {
      id: 'traditional',
      name: 'Traditional',
      description: 'Classic business letter format for conservative industries',
      preview: 'Dear Sir/Madam,\n\nI am writing to apply for the position...',
      color: '#dc2626'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-teal-100/30 to-blue-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-orange-100/30 to-pink-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-purple-100/30 to-indigo-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <ArrowLeft className="h-5 w-5 text-gray-600 mr-3 group-hover:text-teal-600 transition-colors duration-200" />
                <Mail className="h-8 w-8 text-teal-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Cover Letter Generator</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Subscription Status */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-full">
                {subscription.isSubscribed ? (
                  <>
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-700 font-medium">Premium</span>
                  </>
                ) : (
                  <>
                  
                  </>
                )}
              </div>
              
            
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['input', 'template', 'generate', 'edit'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep === step 
                    ? 'bg-teal-600 text-white shadow-lg' 
                    : index < ['input', 'template', 'generate', 'edit'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    index < ['input', 'template', 'generate', 'edit'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <span className="text-sm text-gray-600 capitalize">
              Step {['input', 'template', 'generate', 'edit'].indexOf(currentStep) + 1}: {
                currentStep === 'input' ? 'Enter Details' : 
                currentStep === 'template' ? 'Choose Template' : 
                currentStep === 'generate' ? 'Generate Letter' : 
                'Edit & Download'
              }
            </span>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'input' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 text-sm font-medium mb-4 animate-fade-in">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                Gemini AI-Powered Cover Letter Generator
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-[1.15] animate-fade-in-up">
                Create Your Perfect{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 animate-gradient-x">
                  Cover Letter
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-[1.15] animate-fade-in-up delay-200">
                Generate personalized, professional cover letters using Google Gemini AI tailored to any job description
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <User className="h-5 w-5 mr-2 text-teal-600" />
                    Personal Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={formData.personalInfo.name}
                        onChange={(e) => handleInputChange('personalInfo.name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={formData.personalInfo.email}
                        onChange={(e) => handleInputChange('personalInfo.email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={formData.personalInfo.phone}
                        onChange={(e) => handleInputChange('personalInfo.phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <input
                        type="text"
                        value={formData.personalInfo.address}
                        onChange={(e) => handleInputChange('personalInfo.address', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="123 Main Street, City, State 12345"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Full address including street, city, state, and zip code
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={formData.personalInfo.linkedin}
                        onChange={(e) => handleInputChange('personalInfo.linkedin', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://linkedin.com/in/johndoe"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/Website</label>
                      <input
                        type="url"
                        value={formData.personalInfo.portfolio}
                        onChange={(e) => handleInputChange('personalInfo.portfolio', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://johndoe.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Job Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-teal-600" />
                    Job Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="Software Engineer"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="Tech Company Inc."
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Skills & Achievements *</label>
                      <input
                        type="text"
                        value={formData.skillsInput}
                        onChange={(e) => handleInputChange('skillsInput', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="JavaScript, React, Node.js, Team Leadership, Project Management"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Key Achievements & Impact *</label>
                      <textarea
                        rows={4}
                        value={formData.achievements}
                        onChange={(e) => handleInputChange('achievements', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="• Increased sales by 25% through implementation of new CRM system&#10;• Led team of 8 developers to deliver project 2 weeks ahead of schedule&#10;• Reduced processing time by 40% by automating manual workflows&#10;• Managed $2M budget and delivered all projects within budget constraints"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        List your key achievements, quantifiable results, and impact from previous roles. Use bullet points and include specific numbers/percentages when possible.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
                      <textarea
                        rows={8}
                        value={formData.jobDescription}
                        onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="Paste the job description here for AI-powered personalization..."
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">Required: Paste the job posting for AI-powered personalization</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gemini AI Notice */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">
                      Powered by Google Gemini AI
                    </h4>
                    <p className="text-sm text-blue-700">
                      Your cover letter will be generated using advanced AI to ensure it's perfectly tailored to the job description and showcases your skills effectively.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setCurrentStep('template')}
                  disabled={!formData.personalInfo.name || !formData.personalInfo.email || !formData.personalInfo.phone || !formData.personalInfo.address || !formData.jobTitle || !formData.companyName || formData.skills.length === 0 || !formData.jobDescription || !formData.achievements}
                  className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Continue to Templates
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'template' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-medium mb-4 animate-fade-in">
                <Palette className="w-4 h-4 mr-2 animate-pulse" />
                Choose Your Style
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-[1.15]">
                Select a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600">
                  Template Style
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                Choose the tone and format that best matches your industry and personal style
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`group cursor-pointer bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
                    selectedTemplate === template.id
                      ? 'border-teal-500 ring-2 ring-teal-200'
                      : 'border-white/20 hover:border-gray-300'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: template.color }}
                      >
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      {selectedTemplate === template.id && (
                        <CheckCircle className="h-6 w-6 text-teal-600" />
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{template.description}</p>
                    
                    <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-700 font-mono leading-relaxed">
                      {template.preview}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('input')}
                className="px-6 py-3 text-gray-700 hover:text-teal-600 transition-colors duration-200"
              >
                ← Back to Details
              </button>
              
              <button
                onClick={() => setCurrentStep('generate')}
                className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Generate with AI
              </button>
            </div>
          </div>
        )}

        {currentStep === 'generate' && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
              {!canGenerateNewLetter() ? (
                <div>
                  <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Crown className="h-12 w-12 text-white" />
                  </div>
                  
                
                  <p className="text-lg text-gray-600 mb-8">
                    You've used all {subscription.maxFreeLetters} free cover letters. Upgrade to premium for unlimited access!
                  </p>
                  
                  <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl p-8 text-white mb-8">
                    <h3 className="text-2xl font-bold mb-4">Premium Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>Unlimited AI cover letters</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>Advanced Gemini AI suggestions</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>Premium templates</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>Cloud storage & sync</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>Grammar & spell check</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>Export to multiple formats</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <button className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                      Upgrade for $3 (7 Letters)
                    </button>
                    <button 
                      onClick={() => setCurrentStep('input')}
                      className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {isGenerating ? (
                    <div>
                      <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Sparkles className="h-12 w-12 text-white animate-spin" />
                      </div>
                      
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Generating Your AI Cover Letter</h2>
                      <p className="text-lg text-gray-600 mb-8">
                        Google Gemini AI is crafting a personalized cover letter based on your information and the job description...
                      </p>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div className="bg-gradient-to-r from-teal-600 to-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                      </div>
                      
                      <p className="text-sm text-gray-500">This usually takes 10-20 seconds</p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Zap className="h-12 w-12 text-white" />
                      </div>
                      
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Generate with AI</h2>
                      <p className="text-lg text-gray-600 mb-8">
                        We'll create a personalized cover letter for the <strong>{formData.jobTitle}</strong> position at <strong>{formData.companyName}</strong> using Google Gemini AI
                      </p>
                      
                      <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                        <h3 className="font-semibold text-gray-900 mb-4">Letter Preview:</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><strong>Template:</strong> {templates.find(t => t.id === selectedTemplate)?.name}</p>
                          <p><strong>Applicant:</strong> {formData.personalInfo.name}</p>
                          <p><strong>Position:</strong> {formData.jobTitle}</p>
                          <p><strong>Company:</strong> {formData.companyName}</p>
                          <p><strong>Key Skills:</strong> {formData.skills.slice(0, 3).join(', ')}</p>
                          <p><strong>Achievements:</strong> {formData.achievements.substring(0, 100)}...</p>
                          <p><strong>AI Engine:</strong> Google Gemini AI</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                          onClick={generateCoverLetter}
                          className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                        >
                          Generate AI Cover Letter
                        </button>
                        <button 
                          onClick={() => setCurrentStep('template')}
                          className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300"
                        >
                          Change Template
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 'edit' && currentLetter && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-800 text-sm font-medium mb-4 animate-fade-in">
                <Edit3 className="w-4 h-4 mr-2 animate-pulse" />
                AI Cover Letter Ready
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-[1.15]">
                Your AI-Generated{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-600 to-blue-600">
                  Cover Letter
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                Review, edit, and download your personalized cover letter powered by Gemini AI
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      {isPreviewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
                    </button>
                    
                    <button
                      onClick={downloadLetter}
                      className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                    
                    <button
                      onClick={copyToClipboard}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Text
                    </button>
                  </div>

                  <div className="mt-6 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center text-sm text-green-800">
                      <Save className="h-4 w-4 mr-2" />
                      Auto-saved locally
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Letter Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Position:</strong> {currentLetter.jobTitle}</p>
                      <p><strong>Company:</strong> {currentLetter.companyName}</p>
                      <p><strong>Template:</strong> {templates.find(t => t.id === currentLetter.template)?.name}</p>
                      <p><strong>AI Engine:</strong> Gemini AI</p>
                      <p><strong>Created:</strong> {new Date(currentLetter.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                  {isPreviewMode ? (
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap font-serif text-gray-900 leading-relaxed">
                        {currentLetter.generatedLetter}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Your AI Cover Letter</h3>
                      <textarea
                        value={currentLetter.generatedLetter}
                        onChange={(e) => handleLetterEdit(e.target.value)}
                        className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 font-serif"
                        placeholder="Edit your AI-generated cover letter here..."
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Characters: {currentLetter.generatedLetter.length} | Generated by Gemini AI
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep('generate')}
                className="px-6 py-3 text-gray-700 hover:text-teal-600 transition-colors duration-200"
              >
                ← Generate New Letter
              </button>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep('template')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Change Template
                </button>
                <button
                  onClick={downloadLetter}
                  className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Download Letter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Letters Section */}
        {savedLetters.length > 0 && currentStep === 'input' && (
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-teal-600" />
                Your Saved Cover Letters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedLetters.slice(-6).map((letter) => (
                  <div key={letter.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{letter.jobTitle}</h4>
                        <p className="text-sm text-gray-600">{letter.companyName}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(letter.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {letter.generatedLetter.substring(0, 150)}...
                    </p>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setCurrentLetter(letter);
                          setCurrentStep('edit');
                        }}
                        className="flex-1 bg-teal-600 text-white py-2 px-3 rounded text-sm hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center"
                      >
                        View/Edit
                      </button>
                      <button
                        onClick={() => {
                          // Create temporary letter for download
                          const tempLetter = { ...letter };
                          setCurrentLetter(tempLetter);
                          setTimeout(() => downloadLetter(), 100);
                        }}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteLetter(letter.id)}
                        className="p-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors duration-200"
                        title="Delete cover letter"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterGenerator;