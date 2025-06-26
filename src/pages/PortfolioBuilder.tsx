import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Eye, Download, Save, Settings, Palette, Layout, Type, Image, Share2, ExternalLink, CheckCircle, Star, Users, Award, Sparkles, Crown, Zap, Target, Shield, TrendingUp, Code, Briefcase, GraduationCap, Mail, Phone, MapPin, Linkedin, Github, Twitter, Plus, Edit3, Trash2, Upload, FileText, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { portfolioGenerator, PortfolioData, PortfolioTemplate, PortfolioTheme, defaultPortfolioData } from '../lib/portfolioGenerator';
import { netlifyIntegration, NetlifyDeployment } from '../lib/netlifyIntegration';
import { ResumeUploader } from '../components/ResumeUploader';
import { ParsedResume } from '../lib/resumeParser';

const PortfolioBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'customize' | 'preview' | 'deploy'>('upload');
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultPortfolioData);
  const [selectedTemplate, setSelectedTemplate] = useState('modern-professional');
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployment, setDeployment] = useState<NetlifyDeployment | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeSection, setActiveSection] = useState('personal');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const templates = portfolioGenerator.getTemplates();
  const themes = portfolioGenerator.getThemes();

  useEffect(() => {
    // Load saved portfolio data from localStorage
    const saved = localStorage.getItem('portfolioData');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setPortfolioData({ ...defaultPortfolioData, ...parsedData });
      } catch (error) {
        console.error('Error loading saved portfolio data:', error);
      }
    }
  }, []);

  const savePortfolioData = (data: PortfolioData) => {
    setPortfolioData(data);
    localStorage.setItem('portfolioData', JSON.stringify(data));
  };

  const handleResumeUpload = (parsedResume: ParsedResume) => {
    const updatedData: PortfolioData = {
      ...portfolioData,
      personalInfo: {
        name: parsedResume.personalInfo.name || '',
        email: parsedResume.personalInfo.email || '',
        phone: parsedResume.personalInfo.phone || '',
        location: parsedResume.personalInfo.location || '',
        website: parsedResume.personalInfo.website || '',
        linkedin: parsedResume.personalInfo.linkedin || '',
        github: '',
        twitter: ''
      },
      sections: {
        ...portfolioData.sections,
        about: parsedResume.summary || '',
        experience: parsedResume.experience.map(exp => ({
          id: exp.id,
          title: exp.title,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description,
          current: exp.current
        })),
        education: parsedResume.education.map(edu => ({
          id: edu.id,
          degree: edu.degree,
          school: edu.school,
          graduationYear: edu.graduationYear,
          gpa: edu.gpa
        })),
        skills: {
          technical: parsedResume.skills.technical || [],
          soft: parsedResume.skills.soft || []
        },
        certifications: parsedResume.certifications.map(cert => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          date: cert.date
        }))
      },
      slug: portfolioGenerator.generateSlug(parsedResume.personalInfo.name || 'portfolio'),
      title: `${parsedResume.personalInfo.name || 'Portfolio'} - Professional Portfolio`,
      seo: {
        title: `${parsedResume.personalInfo.name || 'Portfolio'} - Professional Portfolio`,
        description: parsedResume.summary?.substring(0, 160) || 'Professional portfolio showcasing skills and experience',
        keywords: [...(parsedResume.skills.technical || []), ...(parsedResume.skills.soft || [])].slice(0, 10)
      },
      lastModified: new Date().toISOString()
    };

    savePortfolioData(updatedData);
    setCurrentStep('customize');
    toast.success('Resume uploaded successfully! Portfolio data populated.');
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const updatedData = {
      ...portfolioData,
      template: templateId,
      lastModified: new Date().toISOString()
    };
    savePortfolioData(updatedData);
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    const updatedData = {
      ...portfolioData,
      theme: themeId,
      lastModified: new Date().toISOString()
    };
    savePortfolioData(updatedData);
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    const updatedData = {
      ...portfolioData,
      personalInfo: {
        ...portfolioData.personalInfo,
        [field]: value
      },
      lastModified: new Date().toISOString()
    };
    savePortfolioData(updatedData);
  };

  const handleSectionChange = (section: string, value: any) => {
    const updatedData = {
      ...portfolioData,
      sections: {
        ...portfolioData.sections,
        [section]: value
      },
      lastModified: new Date().toISOString()
    };
    savePortfolioData(updatedData);
  };

  const handleDeploy = async () => {
    if (!portfolioData.personalInfo.name) {
      toast.error('Please add your name before deploying');
      return;
    }

    setIsDeploying(true);
    try {
      const optimizedData = portfolioGenerator.optimizeForSEO(portfolioData);
      const deploymentResult = await netlifyIntegration.deployPortfolio(optimizedData);
      
      setDeployment(deploymentResult);
      const updatedData = {
        ...optimizedData,
        isPublished: true,
        publishedUrl: deploymentResult.url,
        lastModified: new Date().toISOString()
      };
      savePortfolioData(updatedData);
      
      setCurrentStep('deploy');
      toast.success('Portfolio deployed successfully!');
    } catch (error) {
      toast.error('Deployment failed. Please try again.');
      console.error('Deployment error:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  const generatePreviewHTML = () => {
    try {
      return portfolioGenerator.generatePortfolioHTML(portfolioData);
    } catch (error) {
      console.error('Error generating preview:', error);
      return '<div style="padding: 20px; text-align: center;">Error generating preview. Please check your portfolio data.</div>';
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: <Mail className="h-5 w-5" /> },
    { id: 'about', label: 'About', icon: <FileText className="h-5 w-5" /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="h-5 w-5" /> },
    { id: 'skills', label: 'Skills', icon: <Code className="h-5 w-5" /> },
    { id: 'projects', label: 'Projects', icon: <Target className="h-5 w-5" /> },
    { id: 'certifications', label: 'Certifications', icon: <Award className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-100/30 to-pink-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-teal-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-green-100/30 to-yellow-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <ArrowLeft className="h-5 w-5 text-gray-600 mr-3 group-hover:text-purple-600 transition-colors duration-200" />
                <Globe className="h-8 w-8 text-purple-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Portfolio Builder</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentStep !== 'upload' && (
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </button>
              )}
              
              {currentStep === 'customize' && (
                <button
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isDeploying ? 'Deploying...' : 'Deploy Portfolio'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center space-x-4 mb-8">
          {['upload', 'customize', 'preview', 'deploy'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                currentStep === step 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : index < ['upload', 'customize', 'preview', 'deploy'].indexOf(currentStep)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              {index < 3 && (
                <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                  index < ['upload', 'customize', 'preview', 'deploy'].indexOf(currentStep)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Step 1: Upload Resume */}
        {currentStep === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-medium mb-4 animate-fade-in">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                AI-Powered Portfolio Builder
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-[1.15] animate-fade-in-up">
                Create Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 animate-gradient-x">
                  Professional Portfolio
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.15] animate-fade-in-up delay-200">
                Upload your resume and we'll automatically create a stunning portfolio website that showcases your skills and experience
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <ResumeUploader 
                onResumeUploaded={handleResumeUpload}
                mode="resume-builder"
                className="mb-6"
              />

              {/* Features Preview */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Professional Templates</h3>
                  <p className="text-sm text-gray-600">Choose from beautiful, responsive templates designed for impact</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
                  <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Instant Deployment</h3>
                  <p className="text-sm text-gray-600">Deploy your portfolio to the web with a single click</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">SEO Optimized</h3>
                  <p className="text-sm text-gray-600">Built-in SEO optimization to help you get discovered</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Customize */}
        {currentStep === 'customize' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Portfolio</h3>
                
                <div className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {section.icon}
                      <span className="ml-3 font-medium">{section.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Template & Theme</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                      <select
                        value={selectedTemplate}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                      <select
                        value={selectedTheme}
                        onChange={(e) => handleThemeChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {themes.map((theme) => (
                          <option key={theme.id} value={theme.id}>
                            {theme.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                {/* Personal Info Section */}
                {activeSection === 'personal' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={portfolioData.personalInfo.name}
                          onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={portfolioData.personalInfo.email}
                          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="john@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={portfolioData.personalInfo.phone}
                          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={portfolioData.personalInfo.location}
                          onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                        <input
                          type="url"
                          value={portfolioData.personalInfo.website}
                          onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="https://johndoe.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                        <input
                          type="url"
                          value={portfolioData.personalInfo.linkedin}
                          onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="https://linkedin.com/in/johndoe"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* About Section */}
                {activeSection === 'about' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">About Me</h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">About Description</label>
                      <textarea
                        rows={8}
                        value={portfolioData.sections.about}
                        onChange={(e) => handleSectionChange('about', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Write a compelling description about yourself, your background, and what makes you unique..."
                      />
                    </div>
                  </div>
                )}

                {/* Experience Section */}
                {activeSection === 'experience' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Experience</h2>
                    <div className="space-y-6">
                      {portfolioData.sections.experience.map((exp, index) => (
                        <div key={exp.id || index} className="p-6 border border-gray-200 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                              <input
                                type="text"
                                value={exp.title || ''}
                                onChange={(e) => {
                                  const updated = [...portfolioData.sections.experience];
                                  updated[index] = { ...updated[index], title: e.target.value };
                                  handleSectionChange('experience', updated);
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Software Engineer"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                              <input
                                type="text"
                                value={exp.company || ''}
                                onChange={(e) => {
                                  const updated = [...portfolioData.sections.experience];
                                  updated[index] = { ...updated[index], company: e.target.value };
                                  handleSectionChange('experience', updated);
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Tech Company Inc."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                              <input
                                type="text"
                                value={exp.startDate || ''}
                                onChange={(e) => {
                                  const updated = [...portfolioData.sections.experience];
                                  updated[index] = { ...updated[index], startDate: e.target.value };
                                  handleSectionChange('experience', updated);
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Jan 2020"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                              <input
                                type="text"
                                value={exp.endDate || ''}
                                onChange={(e) => {
                                  const updated = [...portfolioData.sections.experience];
                                  updated[index] = { ...updated[index], endDate: e.target.value };
                                  handleSectionChange('experience', updated);
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Present"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              rows={4}
                              value={exp.description || ''}
                              onChange={(e) => {
                                const updated = [...portfolioData.sections.experience];
                                updated[index] = { ...updated[index], description: e.target.value };
                                handleSectionChange('experience', updated);
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Describe your key responsibilities and achievements..."
                            />
                          </div>
                          
                          <button
                            onClick={() => {
                              const updated = portfolioData.sections.experience.filter((_, i) => i !== index);
                              handleSectionChange('experience', updated);
                            }}
                            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      ))}
                      
                      <button
                        onClick={() => {
                          const newExp = {
                            id: Date.now().toString(),
                            title: '',
                            company: '',
                            startDate: '',
                            endDate: '',
                            description: '',
                            current: false
                          };
                          handleSectionChange('experience', [...portfolioData.sections.experience, newExp]);
                        }}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-all duration-200 flex items-center justify-center"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Experience
                      </button>
                    </div>
                  </div>
                )}

                {/* Skills Section */}
                {activeSection === 'skills' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                        <input
                          type="text"
                          value={portfolioData.sections.skills.technical.join(', ')}
                          onChange={(e) => {
                            const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                            handleSectionChange('skills', {
                              ...portfolioData.sections.skills,
                              technical: skills
                            });
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="JavaScript, React, Node.js, Python..."
                        />
                        <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
                        <input
                          type="text"
                          value={portfolioData.sections.skills.soft.join(', ')}
                          onChange={(e) => {
                            const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                            handleSectionChange('skills', {
                              ...portfolioData.sections.skills,
                              soft: skills
                            });
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Leadership, Communication, Problem Solving..."
                        />
                        <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other sections would be implemented similarly */}
                {activeSection === 'education' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
                    <p className="text-gray-600">Education section content will be displayed here.</p>
                  </div>
                )}

                {activeSection === 'projects' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
                    <p className="text-gray-600">Projects section content will be displayed here.</p>
                  </div>
                )}

                {activeSection === 'certifications' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Certifications</h2>
                    <p className="text-gray-600">Certifications section content will be displayed here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Deploy Success */}
        {currentStep === 'deploy' && deployment && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Portfolio Deployed Successfully!</h2>
              <p className="text-xl text-gray-600 mb-8">
                Your portfolio is now live and accessible to the world
              </p>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-gray-600">Your portfolio URL:</span>
                  <a
                    href={deployment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
                  >
                    {deployment.url}
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href={deployment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  View Live Portfolio
                </a>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(deployment.url);
                    toast.success('URL copied to clipboard!');
                  }}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share Portfolio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-semibold text-gray-900">Portfolio Preview</h3>
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('tablet')}
                    className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Tablet className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 bg-gray-100 h-[calc(90vh-80px)] flex items-center justify-center">
              <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                previewMode === 'desktop' ? 'w-full h-full' :
                previewMode === 'tablet' ? 'w-3/4 h-5/6' :
                'w-80 h-5/6'
              }`}>
                <iframe
                  srcDoc={generatePreviewHTML()}
                  className="w-full h-full border-0"
                  title="Portfolio Preview"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioBuilder;