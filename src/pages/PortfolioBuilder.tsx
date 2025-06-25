import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, User, Briefcase, Palette, Eye, Download, Share2, Settings, Crown, Zap, Shield, CheckCircle, Star, Award, Users, Target, Edit3, Layout, BookOpen, Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Sparkles, ArrowRight, Play, Code, Monitor, Smartphone } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { ResumeUploader } from '../components/ResumeUploader';
import { ParsedResume } from '../lib/resumeParser';
import { portfolioGenerator, PortfolioData, PortfolioTemplate, PortfolioTheme } from '../lib/portfolioGenerator';
import { netlifyIntegration, NetlifyDeployment } from '../lib/netlifyIntegration';
import { portfolioExporter } from '../lib/portfolioExporter';

interface UserSubscription {
  isSubscribed: boolean;
  editsUsed: number;
  maxFreeEdits: number;
  subscriptionType: string | null;
  expiresAt: string | null;
}

const PortfolioBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'template' | 'customize' | 'preview' | 'publish'>('upload');
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-professional');
  const [selectedTheme, setSelectedTheme] = useState<string>('light');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [subscription, setSubscription] = useState<UserSubscription>({
    isSubscribed: false,
    editsUsed: 0,
    maxFreeEdits: 10,
    subscriptionType: null,
    expiresAt: null
  });

  const generator = portfolioGenerator;
  const netlify = netlifyIntegration;
  const exporter = portfolioExporter;

  // Load saved data on component mount
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = () => {
    try {
      const savedSubscription = localStorage.getItem('portfolioSubscription');
      if (savedSubscription) {
        setSubscription(JSON.parse(savedSubscription));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const handleResumeUpload = (parsedResume: ParsedResume) => {
    setResumeData(parsedResume);
    toast.success('Resume uploaded successfully! Ready to create your portfolio.');
  };

  const handleStartPortfolioCreation = () => {
    if (!resumeData) {
      toast.error('Please upload a resume first');
      return;
    }
    setCurrentStep('template');
  };

  const generatePortfolioFromResume = async () => {
    if (!resumeData) {
      toast.error('No resume data available');
      return;
    }

    setIsGenerating(true);

    try {
      // Convert resume data to portfolio format
      const portfolioId = Date.now().toString();
      const slug = generator.generateSlug(resumeData.personalInfo.name);

      const newPortfolioData: PortfolioData = {
        id: portfolioId,
        title: `${resumeData.personalInfo.name} - Portfolio`,
        slug,
        template: selectedTemplate,
        theme: selectedTheme,
        personalInfo: {
          name: resumeData.personalInfo.name,
          email: resumeData.personalInfo.email,
          phone: resumeData.personalInfo.phone || '',
          location: resumeData.personalInfo.location || '',
          website: resumeData.personalInfo.website || '',
          linkedin: resumeData.personalInfo.linkedin || '',
          github: '',
          twitter: ''
        },
        sections: {
          about: resumeData.summary || `I'm ${resumeData.personalInfo.name}, a passionate professional with expertise in ${resumeData.skills.technical.slice(0, 3).join(', ')}.`,
          experience: resumeData.experience.map(exp => ({
            ...exp,
            technologies: []
          })),
          projects: [],
          skills: resumeData.skills,
          education: resumeData.education,
          certifications: resumeData.certifications,
          testimonials: [],
          contact: {
            email: resumeData.personalInfo.email,
            phone: resumeData.personalInfo.phone,
            location: resumeData.personalInfo.location
          }
        },
        customizations: {
          colors: {
            primary: '#2563eb',
            secondary: '#64748b',
            accent: '#0ea5e9'
          },
          fonts: {
            heading: 'Inter',
            body: 'Inter'
          },
          layout: 'modern',
          animations: true,
          darkMode: selectedTheme === 'dark'
        },
        seo: {
          title: `${resumeData.personalInfo.name} - Professional Portfolio`,
          description: resumeData.summary || `Professional portfolio of ${resumeData.personalInfo.name}`,
          keywords: [resumeData.personalInfo.name, ...resumeData.skills.technical.slice(0, 5)]
        },
        analytics: {},
        isPublished: false,
        editCount: 0,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      setPortfolioData(newPortfolioData);
      setCurrentStep('customize');
      toast.success('Portfolio generated successfully!');

    } catch (error) {
      toast.error('Failed to generate portfolio. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const canMakeEdits = () => {
    return subscription.isSubscribed || subscription.editsUsed < subscription.maxFreeEdits;
  };

  const handlePublish = async () => {
    if (!portfolioData) {
      toast.error('No portfolio data to publish');
      return;
    }

    if (!canMakeEdits()) {
      toast.error('You have reached your free edit limit. Please subscribe to continue.');
      return;
    }

    setIsPublishing(true);

    try {
      // Generate portfolio files
      const files = netlify.generatePortfolioFiles(portfolioData);
      
      // Deploy to Netlify (simulated)
      const deployment = await netlify.deployPortfolio(portfolioData, files);
      
      // Update portfolio data
      const updatedPortfolio = {
        ...portfolioData,
        isPublished: true,
        publishedUrl: deployment.url,
        lastModified: new Date().toISOString()
      };

      setPortfolioData(updatedPortfolio);
      setPublishedUrl(deployment.url);
      
      // Update subscription
      const updatedSubscription = {
        ...subscription,
        editsUsed: subscription.isSubscribed ? subscription.editsUsed : subscription.editsUsed + 1
      };
      setSubscription(updatedSubscription);
      localStorage.setItem('portfolioSubscription', JSON.stringify(updatedSubscription));

      setCurrentStep('publish');
      toast.success('Portfolio published successfully!');

    } catch (error) {
      toast.error('Failed to publish portfolio. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    if (!portfolioData) {
      toast.error('No portfolio data to export');
      return;
    }

    try {
      if (format === 'pdf') {
        await exporter.exportToPDF(portfolioData);
      } else {
        await exporter.exportToWord(portfolioData);
      }
      toast.success(`Portfolio exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      toast.error(`Failed to export portfolio as ${format.toUpperCase()}`);
    }
  };

  const templates = generator.getTemplates();
  const themes = generator.getThemes();

  // Live Portfolio Preview Component
  const LivePortfolioPreview: React.FC<{ data: PortfolioData; mode: 'desktop' | 'tablet' | 'mobile' }> = ({ data, mode }) => {
    const getPreviewSize = () => {
      switch (mode) {
        case 'desktop': return 'w-full h-96';
        case 'tablet': return 'w-3/4 h-96 mx-auto';
        case 'mobile': return 'w-1/3 h-96 mx-auto';
        default: return 'w-full h-96';
      }
    };

    return (
      <div className={`${getPreviewSize()} bg-white rounded-lg shadow-lg overflow-hidden border`}>
        <div className="h-full overflow-auto">
          {/* Hero Section */}
          <div 
            className="text-center py-16 text-white"
            style={{ 
              background: `linear-gradient(135deg, ${data.customizations.colors.primary}, ${data.customizations.colors.accent})` 
            }}
          >
            <h1 className="text-4xl font-bold mb-2">{data.personalInfo.name}</h1>
            <p className="text-xl opacity-90">{data.personalInfo.email}</p>
            <div className="flex justify-center space-x-4 mt-4">
              {data.personalInfo.linkedin && (
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Linkedin className="h-4 w-4" />
                </div>
              )}
              {data.personalInfo.github && (
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Github className="h-4 w-4" />
                </div>
              )}
              {data.personalInfo.website && (
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Globe className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>

          {/* About Section */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: data.customizations.colors.primary }}>
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.sections.about}</p>
          </div>

          {/* Skills Section */}
          <div className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold mb-4" style={{ color: data.customizations.colors.primary }}>
              Skills
            </h2>
            <div className="space-y-4">
              {data.sections.skills.technical.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.sections.skills.technical.slice(0, 8).map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-sm rounded-full text-white"
                        style={{ backgroundColor: data.customizations.colors.primary }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.sections.skills.soft.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.sections.skills.soft.slice(0, 6).map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-sm rounded-full text-white"
                        style={{ backgroundColor: data.customizations.colors.secondary }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Experience Section */}
          {data.sections.experience.length > 0 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6" style={{ color: data.customizations.colors.primary }}>
                Experience
              </h2>
              <div className="space-y-6">
                {data.sections.experience.slice(0, 3).map((exp, index) => (
                  <div key={index} className="border-l-4 pl-4" style={{ borderColor: data.customizations.colors.accent }}>
                    <h3 className="font-bold text-lg">{exp.title}</h3>
                    <p className="text-gray-600 font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-500 mb-2">{exp.startDate} - {exp.endDate}</p>
                    <p className="text-gray-700 text-sm">{exp.description?.substring(0, 150)}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          <div className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold mb-4" style={{ color: data.customizations.colors.primary }}>
              Get In Touch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" style={{ color: data.customizations.colors.primary }} />
                <span>{data.personalInfo.email}</span>
              </div>
              {data.personalInfo.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" style={{ color: data.customizations.colors.primary }} />
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" style={{ color: data.customizations.colors.primary }} />
                  <span>{data.personalInfo.location}</span>
                </div>
              )}
              {data.personalInfo.website && (
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" style={{ color: data.customizations.colors.primary }} />
                  <span>{data.personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-100/30 to-blue-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-pink-100/30 to-orange-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-teal-100/30 to-green-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <ArrowLeft className="h-5 w-5 text-gray-600 mr-3 group-hover:text-purple-600 transition-colors duration-200" />
                <Briefcase className="h-8 w-8 text-purple-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Portfolio Builder</span>
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
                    <span className="text-sm text-gray-600">
                      {subscription.editsUsed}/{subscription.maxFreeEdits} free edits used
                    </span>
                  </>
                )}
              </div>
              
              <button className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                {subscription.isSubscribed ? 'Manage Subscription' : 'Upgrade to Premium'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['upload', 'template', 'customize', 'preview', 'publish'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep === step 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : index < ['upload', 'template', 'customize', 'preview', 'publish'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < 4 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    index < ['upload', 'template', 'customize', 'preview', 'publish'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <span className="text-sm text-gray-600 capitalize">
              Step {['upload', 'template', 'customize', 'preview', 'publish'].indexOf(currentStep) + 1}: {
                currentStep === 'upload' ? 'Upload Resume' : 
                currentStep === 'template' ? 'Choose Template' : 
                currentStep === 'customize' ? 'Customize Portfolio' : 
                currentStep === 'preview' ? 'Preview & Edit' :
                'Publish Portfolio'
              }
            </span>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-medium mb-4 animate-fade-in">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                Professional Portfolio Builder
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-[1.15] animate-fade-in-up">
                Create Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 animate-gradient-x">
                  Professional Portfolio
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.15] animate-fade-in-up delay-200">
                Transform your resume into a stunning portfolio website. Upload your resume and we'll automatically generate a professional portfolio for you.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <ResumeUploader 
                onResumeUploaded={handleResumeUpload}
                className="mb-6"
              />

              {/* Start Button - Only show when resume is uploaded */}
              {resumeData && (
                <div className="mt-8 text-center animate-fade-in-up">
                  <div className="p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200 mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                      <h3 className="text-xl font-semibold text-green-900">Resume Successfully Uploaded!</h3>
                    </div>
                    <p className="text-green-800 mb-4">
                      We've extracted your information from <strong>{resumeData.personalInfo.name}</strong>'s resume. 
                      Ready to create your professional portfolio?
                    </p>
                    
                    {/* Resume Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700 mb-6">
                      <div className="flex items-center justify-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>{resumeData.personalInfo.name}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        <span>{resumeData.experience.length} positions</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <Target className="h-4 w-4 mr-2" />
                        <span>{resumeData.skills.technical.length + resumeData.skills.soft.length} skills</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleStartPortfolioCreation}
                    className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-xl text-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center mx-auto"
                  >
                    <Play className="mr-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                    Start Creating Portfolio
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                  
                  <p className="text-sm text-gray-600 mt-4">
                    This will take you through template selection and customization
                  </p>
                </div>
              )}

              {/* Features Preview */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Layout className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Professional Templates</h3>
                  <p className="text-sm text-gray-600">Choose from multiple professionally designed templates</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
                  <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Custom Themes</h3>
                  <p className="text-sm text-gray-600">Personalize colors and styling to match your brand</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Share2 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Instant Publishing</h3>
                  <p className="text-sm text-gray-600">Get a live URL to share with employers and clients</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'template' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium mb-4 animate-fade-in">
                <Layout className="w-4 h-4 mr-2 animate-pulse" />
                Choose Your Style
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-[1.15]">
                Select a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                  Portfolio Template
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                Choose the design that best represents your professional brand
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`group cursor-pointer bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
                    selectedTemplate === template.id
                      ? 'border-purple-500 ring-2 ring-purple-200'
                      : 'border-white/20 hover:border-gray-300'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: template.colors.primary }}
                      >
                        <Briefcase className="h-6 w-6 text-white" />
                      </div>
                      {selectedTemplate === template.id && (
                        <CheckCircle className="h-6 w-6 text-purple-600" />
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{template.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 2).map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Color Scheme</span>
                      <div className="flex space-x-1">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: template.colors.primary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: template.colors.secondary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: template.colors.accent }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Theme Selection */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Choose Color Theme</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedTheme === theme.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div 
                        className="w-8 h-8 rounded-full border border-gray-200"
                        style={{ backgroundColor: theme.colors.background }}
                      ></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{theme.name}</h4>
                        <p className="text-sm text-gray-600">{theme.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-200"
                        style={{ backgroundColor: theme.colors.background }}
                      ></div>
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-200"
                        style={{ backgroundColor: theme.colors.surface }}
                      ></div>
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-200"
                        style={{ backgroundColor: theme.colors.text }}
                      ></div>
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-200"
                        style={{ backgroundColor: theme.colors.muted }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('upload')}
                className="px-6 py-3 text-gray-700 hover:text-purple-600 transition-colors duration-200"
              >
                ← Back to Upload
              </button>
              
              <button
                onClick={generatePortfolioFromResume}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
              >
                {isGenerating ? (
                  <>
                    <Zap className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Portfolio
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {currentStep === 'customize' && portfolioData && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-800 text-sm font-medium mb-4 animate-fade-in">
                <Edit3 className="w-4 h-4 mr-2 animate-pulse" />
                Customize Your Portfolio
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-[1.15]">
                Make It{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-600 to-blue-600">
                  Uniquely Yours
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                Customize your portfolio content and styling
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customization Panel */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Portfolio Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Title</label>
                    <input
                      type="text"
                      value={portfolioData.title}
                      onChange={(e) => setPortfolioData({...portfolioData, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">About Section</label>
                    <textarea
                      rows={4}
                      value={portfolioData.sections.about}
                      onChange={(e) => setPortfolioData({
                        ...portfolioData,
                        sections: {...portfolioData.sections, about: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <input
                      type="color"
                      value={portfolioData.customizations.colors.primary}
                      onChange={(e) => setPortfolioData({
                        ...portfolioData,
                        customizations: {
                          ...portfolioData.customizations,
                          colors: {...portfolioData.customizations.colors, primary: e.target.value}
                        }
                      })}
                      className="w-full h-12 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                    <input
                      type="color"
                      value={portfolioData.customizations.colors.secondary}
                      onChange={(e) => setPortfolioData({
                        ...portfolioData,
                        customizations: {
                          ...portfolioData.customizations,
                          colors: {...portfolioData.customizations.colors, secondary: e.target.value}
                        }
                      })}
                      className="w-full h-12 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                    <input
                      type="color"
                      value={portfolioData.customizations.colors.accent}
                      onChange={(e) => setPortfolioData({
                        ...portfolioData,
                        customizations: {
                          ...portfolioData.customizations,
                          colors: {...portfolioData.customizations.colors, accent: e.target.value}
                        }
                      })}
                      className="w-full h-12 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Panel */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Live Preview</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                    >
                      <Monitor className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPreviewMode('tablet')}
                      className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                    >
                      <Smartphone className="h-4 w-4 rotate-90" />
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                    >
                      <Smartphone className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <LivePortfolioPreview data={portfolioData} mode={previewMode} />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep('template')}
                className="px-6 py-3 text-gray-700 hover:text-purple-600 transition-colors duration-200"
              >
                ← Back to Templates
              </button>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep('preview')}
                  className="border-2 border-purple-300 text-purple-700 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 flex items-center"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Full Preview
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isPublishing || !canMakeEdits()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                >
                  {isPublishing ? (
                    <>
                      <Zap className="h-5 w-5 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      Publish Portfolio
                      <Share2 className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'preview' && portfolioData && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Portfolio Preview</h2>
              <p className="text-lg text-gray-600">Review your portfolio before publishing</p>
              
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`flex items-center px-4 py-2 rounded-lg ${previewMode === 'desktop' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`flex items-center px-4 py-2 rounded-lg ${previewMode === 'tablet' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <Smartphone className="h-4 w-4 mr-2 rotate-90" />
                  Tablet
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`flex items-center px-4 py-2 rounded-lg ${previewMode === 'mobile' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile
                </button>
              </div>
            </div>

            <div className="mb-8">
              <LivePortfolioPreview data={portfolioData} mode={previewMode} />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('customize')}
                className="px-6 py-3 text-gray-700 hover:text-purple-600 transition-colors duration-200"
              >
                ← Back to Customize
              </button>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => handleExport('pdf')}
                  className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Export PDF
                </button>
                <button
                  onClick={() => handleExport('docx')}
                  className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Export Word
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isPublishing || !canMakeEdits()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                >
                  {isPublishing ? (
                    <>
                      <Zap className="h-5 w-5 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      Publish Portfolio
                      <Share2 className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'publish' && portfolioData && publishedUrl && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Portfolio Published Successfully!</h2>
              <p className="text-xl text-gray-600 mb-8">
                Your professional portfolio is now live and accessible worldwide
              </p>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Your Portfolio URL:</h3>
                <div className="flex items-center justify-center space-x-4">
                  <code className="bg-white px-4 py-2 rounded-lg border text-purple-600 font-medium">
                    {publishedUrl}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(publishedUrl);
                      toast.success('URL copied to clipboard!');
                    }}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Share this URL with employers, clients, and your professional network
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900">Worldwide Access</h4>
                  <p className="text-sm text-blue-700">Your portfolio is accessible from anywhere in the world</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-900">Secure Hosting</h4>
                  <p className="text-sm text-green-700">Hosted on reliable, secure infrastructure</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-900">Fast Loading</h4>
                  <p className="text-sm text-purple-700">Optimized for speed and performance</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href={publishedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  View Live Portfolio
                </a>
                <button
                  onClick={() => handleExport('pdf')}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    setCurrentStep('upload');
                    setResumeData(null);
                    setPortfolioData(null);
                    setPublishedUrl('');
                  }}
                  className="border-2 border-purple-300 text-purple-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-50 transition-all duration-300 flex items-center justify-center"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioBuilder;