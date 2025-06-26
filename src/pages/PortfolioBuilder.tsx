import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Briefcase, GraduationCap, Award, Eye, Download, Save, Plus, Trash2, Edit3, Globe, Palette, Layout, Settings, Upload, FileText, Mail, Phone, MapPin, Linkedin, Github, Twitter, Target, Zap, Crown, Star, CheckCircle, Sparkles, Users, TrendingUp } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { portfolioGenerator, PortfolioData, defaultPortfolioData } from '../lib/portfolioGenerator';
import { netlifyIntegration } from '../lib/netlifyIntegration';

const PortfolioBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'setup' | 'design' | 'content' | 'preview' | 'deploy'>('setup');
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultPortfolioData);
  const [selectedTemplate, setSelectedTemplate] = useState('modern-professional');
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('personal');

  // Load saved portfolio data on mount
  useEffect(() => {
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

  // Auto-save portfolio data
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [portfolioData]);

  const updatePortfolioData = (updates: Partial<PortfolioData>) => {
    setPortfolioData(prev => ({
      ...prev,
      ...updates,
      lastModified: new Date().toISOString()
    }));
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateSections = (section: string, value: any) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: value
      }
    }));
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    
    setPortfolioData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        experience: [...prev.sections.experience, newExperience]
      }
    }));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        experience: prev.sections.experience.map((exp, i) => 
          i === index ? { ...exp, [field]: value } : exp
        )
      }
    }));
  };

  const removeExperience = (index: number) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        experience: prev.sections.experience.filter((_, i) => i !== index)
      }
    }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: [],
      liveUrl: '',
      githubUrl: '',
      imageUrl: ''
    };
    
    setPortfolioData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        projects: [...(prev.sections.projects || []), newProject]
      }
    }));
  };

  const updateProject = (index: number, field: string, value: any) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        projects: (prev.sections.projects || []).map((project, i) => 
          i === index ? { ...project, [field]: value } : project
        )
      }
    }));
  };

  const removeProject = (index: number) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        projects: (prev.sections.projects || []).filter((_, i) => i !== index)
      }
    }));
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      graduationYear: '',
      gpa: ''
    };
    
    setPortfolioData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        education: [...prev.sections.education, newEducation]
      }
    }));
  };

  const updateEducation = (index: number, field: string, value: any) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        education: prev.sections.education.map((edu, i) => 
          i === index ? { ...edu, [field]: value } : edu
        )
      }
    }));
  };

  const removeEducation = (index: number) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        education: prev.sections.education.filter((_, i) => i !== index)
      }
    }));
  };

  const handleDeploy = async () => {
    if (!portfolioData.personalInfo.name || !portfolioData.sections.about) {
      toast.error('Please fill in your name and about section before deploying');
      return;
    }

    setIsDeploying(true);
    try {
      // Generate slug if not exists
      if (!portfolioData.slug) {
        const slug = portfolioGenerator.generateSlug(portfolioData.personalInfo.name);
        updatePortfolioData({ slug });
      }

      // Deploy to Netlify
      const deployment = await portfolioGenerator.deployToNetlify(portfolioData);
      setDeploymentUrl(deployment.url);
      updatePortfolioData({ 
        isPublished: true, 
        publishedUrl: deployment.url 
      });
      
      toast.success('Portfolio deployed successfully!');
      setCurrentStep('deploy');
    } catch (error) {
      console.error('Deployment error:', error);
      toast.error('Failed to deploy portfolio. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  const templates = portfolioGenerator.getTemplates();
  const themes = portfolioGenerator.getThemes();

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
                <User className="h-8 w-8 text-purple-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Portfolio Builder</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isDeploying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deploying...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Deploy Portfolio
                  </>
                )}
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
            {['setup', 'design', 'content', 'preview', 'deploy'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep === step 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : index < ['setup', 'design', 'content', 'preview', 'deploy'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < 4 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    index < ['setup', 'design', 'content', 'preview', 'deploy'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <span className="text-sm text-gray-600 capitalize">
              Step {['setup', 'design', 'content', 'preview', 'deploy'].indexOf(currentStep) + 1}: {
                currentStep === 'setup' ? 'Basic Setup' : 
                currentStep === 'design' ? 'Choose Design' : 
                currentStep === 'content' ? 'Add Content' :
                currentStep === 'preview' ? 'Preview Portfolio' :
                'Deploy & Share'
              }
            </span>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'setup' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-medium mb-4 animate-fade-in">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                Professional Portfolio Builder
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-[1.15] animate-fade-in-up">
                Create Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 animate-gradient-x">
                  Professional Portfolio
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-[1.15] animate-fade-in-up delay-200">
                Build a stunning portfolio website that showcases your skills, experience, and projects
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={portfolioData.personalInfo.name}
                    onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={portfolioData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={portfolioData.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={portfolioData.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="San Francisco, CA"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website/Portfolio</label>
                  <input
                    type="url"
                    value={portfolioData.personalInfo.website}
                    onChange={(e) => updatePersonalInfo('website', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://johndoe.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={portfolioData.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">About Me *</label>
                <textarea
                  rows={4}
                  value={portfolioData.sections.about}
                  onChange={(e) => updateSections('about', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Write a brief introduction about yourself, your skills, and what you're passionate about..."
                  required
                />
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setCurrentStep('design')}
                  disabled={!portfolioData.personalInfo.name || !portfolioData.personalInfo.email || !portfolioData.sections.about}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Continue to Design
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'design' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Design</h2>
              <p className="text-lg text-gray-600">Select a template and theme that represents your style</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Templates */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Layout className="h-5 w-5 mr-2 text-purple-600" />
                  Templates
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        updatePortfolioData({ template: template.id });
                      }}
                      className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                        {selectedTemplate === template.id && (
                          <CheckCircle className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Themes */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-purple-600" />
                  Color Themes
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => {
                        setSelectedTheme(theme.id);
                        updatePortfolioData({ theme: theme.id });
                      }}
                      className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 ${
                        selectedTheme === theme.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{theme.name}</h4>
                          <p className="text-sm text-gray-600">{theme.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded-full border border-gray-200"
                            style={{ backgroundColor: theme.colors.background }}
                          ></div>
                          <div 
                            className="w-6 h-6 rounded-full border border-gray-200"
                            style={{ backgroundColor: theme.colors.surface }}
                          ></div>
                          {selectedTheme === theme.id && (
                            <CheckCircle className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep('setup')}
                className="px-6 py-3 text-gray-700 hover:text-purple-600 transition-colors duration-200"
              >
                ← Back to Setup
              </button>
              
              <button
                onClick={() => setCurrentStep('content')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                Continue to Content
              </button>
            </div>
          </div>
        )}

        {currentStep === 'content' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Add Your Content</h2>
              <p className="text-lg text-gray-600">Fill in your professional information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sections</h3>
                  
                  <div className="space-y-2">
                    {[
                      { id: 'experience', label: 'Experience', icon: Briefcase },
                      { id: 'projects', label: 'Projects', icon: Target },
                      { id: 'education', label: 'Education', icon: GraduationCap },
                      { id: 'skills', label: 'Skills', icon: Zap },
                    ].map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                          activeSection === section.id
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <section.icon className="h-5 w-5 mr-3" />
                        {section.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                  {activeSection === 'experience' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                          <Briefcase className="h-6 w-6 mr-2 text-purple-600" />
                          Work Experience
                        </h3>
                        <button
                          onClick={addExperience}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Experience
                        </button>
                      </div>

                      <div className="space-y-6">
                        {portfolioData.sections.experience.map((exp, index) => (
                          <div key={exp.id || index} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-semibold text-gray-900">Experience #{index + 1}</h4>
                              <button
                                onClick={() => removeExperience(index)}
                                className="text-red-600 hover:text-red-700 transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                                <input
                                  type="text"
                                  value={exp.title || ''}
                                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="Software Engineer"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                                <input
                                  type="text"
                                  value={exp.company || ''}
                                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="Tech Company Inc."
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                <input
                                  type="text"
                                  value={exp.startDate || ''}
                                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="January 2022"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                <input
                                  type="text"
                                  value={exp.endDate || ''}
                                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="Present"
                                />
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                              <textarea
                                rows={4}
                                value={exp.description || ''}
                                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Describe your key responsibilities and achievements..."
                              />
                            </div>
                          </div>
                        ))}

                        {portfolioData.sections.experience.length === 0 && (
                          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-gray-900 mb-2">No experience added yet</h4>
                            <p className="text-gray-600 mb-4">Add your work experience to showcase your professional background</p>
                            <button
                              onClick={addExperience}
                              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                            >
                              Add Your First Experience
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeSection === 'projects' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                          <Target className="h-6 w-6 mr-2 text-purple-600" />
                          Projects
                        </h3>
                        <button
                          onClick={addProject}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Project
                        </button>
                      </div>

                      <div className="space-y-6">
                        {(portfolioData.sections.projects || []).map((project, index) => (
                          <div key={project.id || index} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-semibold text-gray-900">Project #{index + 1}</h4>
                              <button
                                onClick={() => removeProject(index)}
                                className="text-red-600 hover:text-red-700 transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                                <input
                                  type="text"
                                  value={project.title || ''}
                                  onChange={(e) => updateProject(index, 'title', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="My Awesome Project"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
                                <input
                                  type="text"
                                  value={Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || ''}
                                  onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="React, Node.js, MongoDB"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
                                <input
                                  type="url"
                                  value={project.liveUrl || ''}
                                  onChange={(e) => updateProject(index, 'liveUrl', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="https://myproject.com"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                                <input
                                  type="url"
                                  value={project.githubUrl || ''}
                                  onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="https://github.com/username/project"
                                />
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                              <textarea
                                rows={4}
                                value={project.description || ''}
                                onChange={(e) => updateProject(index, 'description', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Describe your project, its features, and your role..."
                              />
                            </div>
                          </div>
                        ))}

                        {(!portfolioData.sections.projects || portfolioData.sections.projects.length === 0) && (
                          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-gray-900 mb-2">No projects added yet</h4>
                            <p className="text-gray-600 mb-4">Showcase your best work and projects</p>
                            <button
                              onClick={addProject}
                              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                            >
                              Add Your First Project
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeSection === 'education' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                          <GraduationCap className="h-6 w-6 mr-2 text-purple-600" />
                          Education
                        </h3>
                        <button
                          onClick={addEducation}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Education
                        </button>
                      </div>

                      <div className="space-y-6">
                        {portfolioData.sections.education.map((edu, index) => (
                          <div key={edu.id || index} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-semibold text-gray-900">Education #{index + 1}</h4>
                              <button
                                onClick={() => removeEducation(index)}
                                className="text-red-600 hover:text-red-700 transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                                <input
                                  type="text"
                                  value={edu.degree || ''}
                                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="Bachelor of Science in Computer Science"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">School/University</label>
                                <input
                                  type="text"
                                  value={edu.school || ''}
                                  onChange={(e) => updateEducation(index, 'school', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="University of Technology"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                                <input
                                  type="text"
                                  value={edu.graduationYear || ''}
                                  onChange={(e) => updateEducation(index, 'graduationYear', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="2023"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">GPA (Optional)</label>
                                <input
                                  type="text"
                                  value={edu.gpa || ''}
                                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="3.8/4.0"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        {portfolioData.sections.education.length === 0 && (
                          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-gray-900 mb-2">No education added yet</h4>
                            <p className="text-gray-600 mb-4">Add your educational background</p>
                            <button
                              onClick={addEducation}
                              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                            >
                              Add Your Education
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeSection === 'skills' && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Zap className="h-6 w-6 mr-2 text-purple-600" />
                        Skills & Expertise
                      </h3>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                          <input
                            type="text"
                            value={portfolioData.sections.skills.technical.join(', ')}
                            onChange={(e) => updateSections('skills', {
                              ...portfolioData.sections.skills,
                              technical: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill)
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="JavaScript, React, Node.js, Python, SQL..."
                          />
                          <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
                          <input
                            type="text"
                            value={portfolioData.sections.skills.soft.join(', ')}
                            onChange={(e) => updateSections('skills', {
                              ...portfolioData.sections.skills,
                              soft: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill)
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Leadership, Communication, Problem Solving, Teamwork..."
                          />
                          <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep('design')}
                className="px-6 py-3 text-gray-700 hover:text-purple-600 transition-colors duration-200"
              >
                ← Back to Design
              </button>
              
              <button
                onClick={() => setCurrentStep('preview')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                Preview Portfolio
              </button>
            </div>
          </div>
        )}

        {currentStep === 'preview' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Preview Your Portfolio</h2>
              <p className="text-lg text-gray-600">See how your portfolio will look to visitors</p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 mb-8">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: portfolioGenerator.generatePortfolioHTML(portfolioData) 
                }} />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('content')}
                className="px-6 py-3 text-gray-700 hover:text-purple-600 transition-colors duration-200"
              >
                ← Back to Content
              </button>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep('content')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Edit Content
                </button>
                <button
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeploying ? 'Deploying...' : 'Deploy Portfolio'}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'deploy' && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Portfolio Deployed Successfully!</h2>
              <p className="text-lg text-gray-600 mb-8">
                Your portfolio is now live and accessible to the world
              </p>
              
              {deploymentUrl && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <p className="text-sm text-gray-600 mb-2">Your portfolio is live at:</p>
                  <a 
                    href={deploymentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 font-medium text-lg break-all"
                  >
                    {deploymentUrl}
                  </a>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                {deploymentUrl && (
                  <a
                    href={deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    View Portfolio
                  </a>
                )}
                <button
                  onClick={() => setCurrentStep('content')}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Edit Portfolio
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