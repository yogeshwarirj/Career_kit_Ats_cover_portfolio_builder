import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Sparkles, Download, Copy, Eye, EyeOff, Loader, CheckCircle, Star, Award, Users, Target, Zap, FileText, Building, User, Briefcase, Send, Edit3, Save, RefreshCw } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { supabaseService, CoverLetterData } from '../lib/supabaseService';
import { auth } from '../lib/supabase';

const CoverLetterGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'generating' | 'result'>('form');
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    skills: [] as string[],
    jobDescription: '',
    template: 'professional'
  });
  const [skillInput, setSkillInput] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication status
    auth.getCurrentUser().then(({ user }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const validateForm = () => {
    const { jobTitle, companyName, personalInfo, skills } = formData;
    
    if (!jobTitle.trim()) {
      toast.error('Please enter the job title');
      return false;
    }
    
    if (!companyName.trim()) {
      toast.error('Please enter the company name');
      return false;
    }
    
    if (!personalInfo.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    
    if (!personalInfo.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    
    if (skills.length === 0) {
      toast.error('Please add at least one skill');
      return false;
    }
    
    return true;
  };

  const generateCoverLetter = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setCurrentStep('generating');

    try {
      // Simulate AI generation process
      await new Promise(resolve => setTimeout(resolve, 3000));

      const letter = generateLetterContent();
      setGeneratedLetter(letter);
      
      // Save to Supabase if user is authenticated
      if (user) {
        const coverLetterData: CoverLetterData = {
          job_title: formData.jobTitle,
          company_name: formData.companyName,
          personal_info: formData.personalInfo,
          skills: formData.skills,
          job_description: formData.jobDescription,
          generated_letter: letter,
          template: formData.template
        };
        
        await supabaseService.saveCoverLetter(coverLetterData);
        toast.success('Cover letter saved to your account!');
      }
      
      setCurrentStep('result');
      toast.success('Cover letter generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate cover letter. Please try again.');
      setCurrentStep('form');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLetterContent = () => {
    const { jobTitle, companyName, personalInfo, skills, jobDescription } = formData;
    
    return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background and skills, I am confident that I would be a valuable addition to your team.

My name is ${personalInfo.name}, and I bring a diverse set of skills including ${skills.slice(0, 5).join(', ')}. I am particularly excited about this opportunity because it aligns perfectly with my career goals and expertise.

${jobDescription ? `Based on the job description, I understand that you are looking for someone who can contribute to your team's success. My experience and skills make me well-suited for this role.` : ''}

Key qualifications I bring include:
${skills.map(skill => `• Proficiency in ${skill}`).join('\n')}

I am eager to discuss how my background and enthusiasm can contribute to ${companyName}'s continued success. Thank you for considering my application. I look forward to hearing from you soon.

Best regards,
${personalInfo.name}
${personalInfo.email}
${personalInfo.phone}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast.success('Cover letter copied to clipboard!');
  };

  const downloadAsText = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.personalInfo.name}_${formData.companyName}_cover_letter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Cover letter downloaded!');
  };

  const templates = [
    { id: 'professional', name: 'Professional', description: 'Clean and formal tone' },
    { id: 'creative', name: 'Creative', description: 'Engaging and dynamic style' },
    { id: 'modern', name: 'Modern', description: 'Contemporary and concise' },
    { id: 'executive', name: 'Executive', description: 'Senior-level positioning' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-green-100/30 to-teal-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-orange-100/30 to-pink-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <ArrowLeft className="h-5 w-5 text-gray-600 mr-3 group-hover:text-green-600 transition-colors duration-200" />
                <Mail className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Cover Letter Generator</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'form' && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-800 text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                AI-Powered Cover Letter Generator
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] animate-fade-in-up">
                Create Your Perfect{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 animate-gradient-x">
                  Cover Letter
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-up delay-200">
                Generate personalized, compelling cover letters that complement your experience and skills perfectly.
              </p>
            </div>

            {/* Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Job Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Briefcase className="h-5 w-5 text-green-600 mr-2" />
                      Job Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title *
                        </label>
                        <input
                          type="text"
                          value={formData.jobTitle}
                          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., Software Engineer"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., Google"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Description (Optional)
                        </label>
                        <textarea
                          rows={4}
                          value={formData.jobDescription}
                          onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="Paste the job description here for better personalization..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Template Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="h-5 w-5 text-green-600 mr-2" />
                      Template Style
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleInputChange('template', template.id)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                            formData.template === template.id
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-gray-600">{template.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Personal Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 text-green-600 mr-2" />
                      Personal Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.personalInfo.name}
                          onChange={(e) => handleInputChange('personalInfo.name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.personalInfo.email}
                          onChange={(e) => handleInputChange('personalInfo.email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.personalInfo.phone}
                          onChange={(e) => handleInputChange('personalInfo.phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          value={formData.personalInfo.address}
                          onChange={(e) => handleInputChange('personalInfo.address', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="City, State"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Star className="h-5 w-5 text-green-600 mr-2" />
                      Skills *
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="Add a skill..."
                        />
                        <button
                          onClick={addSkill}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          Add
                        </button>
                      </div>
                      
                      {formData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                            >
                              {skill}
                              <button
                                onClick={() => removeSkill(skill)}
                                className="ml-2 text-green-600 hover:text-green-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={generateCoverLetter}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center mx-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Cover Letter
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {currentStep === 'generating' && (
          <div className="text-center py-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-800 text-lg font-medium mb-8 animate-fade-in">
              <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
              Generating Your Cover Letter
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Creating Your Perfect{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                Cover Letter
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8">
              Our AI is analyzing your information and crafting a personalized cover letter...
            </p>

            <div className="max-w-md mx-auto">
              <div className="bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-500">This usually takes a few seconds</p>
            </div>
          </div>
        )}

        {currentStep === 'result' && (
          <div className="space-y-8">
            {/* Success Header */}
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-800 text-sm font-medium mb-6 animate-fade-in">
                <CheckCircle className="w-4 h-4 mr-2" />
                Cover Letter Generated Successfully
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Your Personalized{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                  Cover Letter
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Review and customize your cover letter before sending
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                {isEditing ? 'Save Changes' : 'Edit Letter'}
              </button>
              
              <button
                onClick={copyToClipboard}
                className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </button>
              
              <button
                onClick={downloadAsText}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>

            {/* Cover Letter Content */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              {isEditing ? (
                <textarea
                  value={generatedLetter}
                  onChange={(e) => setGeneratedLetter(e.target.value)}
                  className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
                />
              ) : (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                    {generatedLetter}
                  </pre>
                </div>
              )}
            </div>

            {/* Generate Another */}
            <div className="text-center">
              <button
                onClick={() => {
                  setCurrentStep('form');
                  setGeneratedLetter('');
                  setIsEditing(false);
                  setShowPreview(false);
                }}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
              >
                Generate Another Cover Letter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterGenerator;