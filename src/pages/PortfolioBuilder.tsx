import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, User, Target, Palette, Eye, Download, Globe, ExternalLink, CheckCircle, Sparkles, RefreshCw, Code, Zap, Award, Users, Star, Shield, ArrowRight, Copy, Settings, Lightbulb, Plus, X, Calendar, Building, GraduationCap, Trophy } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { geminiPortfolioGenerator, PortfolioGenerationParams, GeneratedPortfolio } from '../lib/geminiPortfolioGenerator';
import { netlifyIntegration, NetlifyDeployment } from '../lib/netlifyIntegration';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  liveUrl: string;
  githubUrl: string;
}

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  year: string;
}

interface Achievement {
  id: string;
  description: string;
}

interface FormData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
  };
  targetRole: string;
  experience: string;
  skills: string[];
  projects: string;
  achievements: string;
  preferences: {
    style: 'modern' | 'classic' | 'creative' | 'minimal';
    colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    includeTestimonials: boolean;
  };
  skillsInput: string;
  // Structured data arrays
  projectsList: Project[];
  experienceList: ExperienceEntry[];
  educationList: EducationEntry[];
  achievementsList: Achievement[];
  // New item forms
  newProject: Omit<Project, 'id'>;
  newExperience: Omit<ExperienceEntry, 'id'>;
  newEducation: Omit<EducationEntry, 'id'>;
  newAchievement: Omit<Achievement, 'id'>;
}

const PortfolioBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'input' | 'preview' | 'deploy' | 'success'>('input');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [generatedPortfolio, setGeneratedPortfolio] = useState<GeneratedPortfolio | null>(null);
  const [deploymentResult, setDeploymentResult] = useState<NetlifyDeployment | null>(null);
  const [deploymentError, setDeploymentError] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: ''
    },
    targetRole: '',
    experience: '',
    skills: [],
    projects: '',
    achievements: '',
    preferences: {
      style: 'modern',
      colorScheme: 'blue',
      includeTestimonials: false
    },
    skillsInput: '',
    // Initialize structured arrays
    projectsList: [],
    experienceList: [],
    educationList: [],
    achievementsList: [],
    // Initialize new item forms
    newProject: {
      title: '',
      description: '',
      technologies: '',
      liveUrl: '',
      githubUrl: ''
    },
    newExperience: {
      title: '',
      company: '',
      duration: '',
      description: ''
    },
    newEducation: {
      degree: '',
      school: '',
      year: ''
    },
    newAchievement: {
      description: ''
    }
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('personalInfo.')) {
      const personalField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [personalField]: value
        }
      }));
    } else if (field.startsWith('preferences.')) {
      const prefField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefField]: value
        }
      }));
    } else if (field.startsWith('newProject.')) {
      const projectField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        newProject: {
          ...prev.newProject,
          [projectField]: value
        }
      }));
    } else if (field.startsWith('newExperience.')) {
      const expField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        newExperience: {
          ...prev.newExperience,
          [expField]: value
        }
      }));
    } else if (field.startsWith('newEducation.')) {
      const eduField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        newEducation: {
          ...prev.newEducation,
          [eduField]: value
        }
      }));
    } else if (field.startsWith('newAchievement.')) {
      const achField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        newAchievement: {
          ...prev.newAchievement,
          [achField]: value
        }
      }));
    } else if (field === 'skillsInput') {
      const skills = (value as string).split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      setFormData(prev => ({
        ...prev,
        skillsInput: value as string,
        skills
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Add functions
  const handleAddProject = () => {
    if (!formData.newProject.title.trim() || !formData.newProject.description.trim()) {
      toast.error('Please fill in project title and description');
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      ...formData.newProject
    };

    setFormData(prev => ({
      ...prev,
      projectsList: [...prev.projectsList, newProject],
      newProject: {
        title: '',
        description: '',
        technologies: '',
        liveUrl: '',
        githubUrl: ''
      }
    }));

    toast.success('Project added successfully!');
  };

  const handleAddExperience = () => {
    if (!formData.newExperience.title.trim() || !formData.newExperience.company.trim()) {
      toast.error('Please fill in job title and company');
      return;
    }

    const newExperience: ExperienceEntry = {
      id: Date.now().toString(),
      ...formData.newExperience
    };

    setFormData(prev => ({
      ...prev,
      experienceList: [...prev.experienceList, newExperience],
      newExperience: {
        title: '',
        company: '',
        duration: '',
        description: ''
      }
    }));

    toast.success('Experience added successfully!');
  };

  const handleAddEducation = () => {
    if (!formData.newEducation.degree.trim() || !formData.newEducation.school.trim()) {
      toast.error('Please fill in degree and school');
      return;
    }

    const newEducation: EducationEntry = {
      id: Date.now().toString(),
      ...formData.newEducation
    };

    setFormData(prev => ({
      ...prev,
      educationList: [...prev.educationList, newEducation],
      newEducation: {
        degree: '',
        school: '',
        year: ''
      }
    }));

    toast.success('Education added successfully!');
  };

  const handleAddAchievement = () => {
    if (!formData.newAchievement.description.trim()) {
      toast.error('Please enter achievement description');
      return;
    }

    const newAchievement: Achievement = {
      id: Date.now().toString(),
      ...formData.newAchievement
    };

    setFormData(prev => ({
      ...prev,
      achievementsList: [...prev.achievementsList, newAchievement],
      newAchievement: {
        description: ''
      }
    }));

    toast.success('Achievement added successfully!');
  };

  // Delete functions
  const handleDeleteProject = (id: string) => {
    setFormData(prev => ({
      ...prev,
      projectsList: prev.projectsList.filter(project => project.id !== id)
    }));
    toast.success('Project removed');
  };

  const handleDeleteExperience = (id: string) => {
    setFormData(prev => ({
      ...prev,
      experienceList: prev.experienceList.filter(exp => exp.id !== id)
    }));
    toast.success('Experience removed');
  };

  const handleDeleteEducation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      educationList: prev.educationList.filter(edu => edu.id !== id)
    }));
    toast.success('Education removed');
  };

  const handleDeleteAchievement = (id: string) => {
    setFormData(prev => ({
      ...prev,
      achievementsList: prev.achievementsList.filter(ach => ach.id !== id)
    }));
    toast.success('Achievement removed');
  };

  const handleGeneratePortfolio = async () => {
    // Validate required fields
    if (!formData.personalInfo.name || !formData.personalInfo.email || !formData.targetRole || formData.skills.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);

    try {
      // Convert structured data to strings for the generator
      const projectsString = formData.projectsList.map(project => 
        `${project.title}: ${project.description}. Technologies: ${project.technologies}. ${project.liveUrl ? `Live: ${project.liveUrl}` : ''} ${project.githubUrl ? `GitHub: ${project.githubUrl}` : ''}`
      ).join('\n\n');

      const experienceString = formData.experienceList.map(exp => 
        `${exp.title} at ${exp.company} (${exp.duration}): ${exp.description}`
      ).join('\n\n');

      const achievementsString = formData.achievementsList.map(ach => ach.description).join('\n');

      const params: PortfolioGenerationParams = {
        personalInfo: formData.personalInfo,
        targetRole: formData.targetRole,
        experience: experienceString || formData.experience,
        skills: formData.skills,
        projects: projectsString || formData.projects,
        achievements: achievementsString || formData.achievements,
        preferences: formData.preferences
      };

      const result = await geminiPortfolioGenerator.generatePortfolio(params);

      if (result.success && result.portfolio) {
        setGeneratedPortfolio(result.portfolio);
        setCurrentStep('preview');
        toast.success('Portfolio generated successfully with Gemini AI!');
      } else {
        // Try fallback generation
        const fallbackPortfolio = geminiPortfolioGenerator.generateFallbackPortfolio(params);
        setGeneratedPortfolio(fallbackPortfolio);
        setCurrentStep('preview');
        toast.success('Portfolio generated with fallback content!');
      }
    } catch (error) {
      console.error('Portfolio generation error:', error);
      toast.error('Failed to generate portfolio. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeployPortfolio = async () => {
    if (!generatedPortfolio) {
      toast.error('No portfolio to deploy');
      return;
    }

    setIsDeploying(true);
    setDeploymentError('');

    try {
      // Generate portfolio files
      const portfolioFiles = netlifyIntegration.generatePortfolioFiles(generatedPortfolio);
      
      // Optimize for performance
      const optimizedFiles = netlifyIntegration.optimizeForPerformance(portfolioFiles);
      
      // Deploy to Netlify
      const deployment = await netlifyIntegration.deployPortfolio(
        generatedPortfolio,
        optimizedFiles,
        { production: true }
      );

      setDeploymentResult(deployment);
      setCurrentStep('success');
      toast.success('Portfolio deployed successfully to Netlify!');
    } catch (error) {
      console.error('Deployment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to deploy portfolio';
      setDeploymentError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeploying(false);
    }
  };

  const copyPortfolioUrl = () => {
    if (deploymentResult?.url) {
      navigator.clipboard.writeText(deploymentResult.url);
      toast.success('Portfolio URL copied to clipboard!');
    }
  };

  const features = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AI-Generated Content",
      description: "Gemini AI creates personalized, professional content tailored to your role",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Custom Design",
      description: "Choose from multiple styles and color schemes to match your personality",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Instant Deployment",
      description: "Deploy directly to Netlify with a custom URL and global CDN",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Performance Optimized",
      description: "Fast loading, SEO-friendly, and mobile-responsive portfolios",
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  const styleOptions = [
    { id: 'modern', name: 'Modern', description: 'Clean, contemporary design with bold typography' },
    { id: 'classic', name: 'Classic', description: 'Timeless, professional layout with elegant styling' },
    { id: 'creative', name: 'Creative', description: 'Artistic, unique design for creative professionals' },
    { id: 'minimal', name: 'Minimal', description: 'Simple, focused design that lets content shine' }
  ];

  const colorOptions = [
    { id: 'blue', name: 'Ocean Blue', color: '#2563eb' },
    { id: 'green', name: 'Forest Green', color: '#059669' },
    { id: 'purple', name: 'Royal Purple', color: '#7c3aed' },
    { id: 'orange', name: 'Sunset Orange', color: '#ea580c' },
    { id: 'red', name: 'Crimson Red', color: '#dc2626' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-green-100/30 to-teal-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-orange-100/30 to-red-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <ArrowLeft className="h-5 w-5 text-gray-600 mr-3 group-hover:text-blue-600 transition-colors duration-200" />
                <Briefcase className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Portfolio Builder</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['input', 'preview', 'deploy', 'success'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep === step 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : index < ['input', 'preview', 'deploy', 'success'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    index < ['input', 'preview', 'deploy', 'success'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <span className="text-sm text-gray-600 capitalize">
              Step {['input', 'preview', 'deploy', 'success'].indexOf(currentStep) + 1}: {
                currentStep === 'input' ? 'Portfolio Details' : 
                currentStep === 'preview' ? 'Review Portfolio' : 
                currentStep === 'deploy' ? 'Deploy to Netlify' :
                'Portfolio Live'
              }
            </span>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'input' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium mb-4 animate-fade-in">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                AI-Powered Portfolio Builder
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-[1.15] animate-fade-in-up">
                Create Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 animate-gradient-x">
                  Professional Portfolio
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.15] animate-fade-in-up delay-200">
                Generate a stunning portfolio website with AI and deploy it instantly to Netlify
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Information</h2>
              
              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={formData.personalInfo.name}
                        onChange={(e) => handleInputChange('personalInfo.name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.personalInfo.phone}
                        onChange={(e) => handleInputChange('personalInfo.phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={formData.personalInfo.location}
                        onChange={(e) => handleInputChange('personalInfo.location', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={formData.personalInfo.linkedin}
                        onChange={(e) => handleInputChange('personalInfo.linkedin', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://linkedin.com/in/johndoe"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
                      <input
                        type="url"
                        value={formData.personalInfo.github}
                        onChange={(e) => handleInputChange('personalInfo.github', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://github.com/johndoe"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-600" />
                    Professional Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Role/Title *</label>
                      <input
                        type="text"
                        value={formData.targetRole}
                        onChange={(e) => handleInputChange('targetRole', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Full Stack Developer"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skills & Technologies *</label>
                      <input
                        type="text"
                        value={formData.skillsInput}
                        onChange={(e) => handleInputChange('skillsInput', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="JavaScript, React, Node.js, Python, AWS, Docker, etc."
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                      {formData.skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formData.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Projects Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Code className="h-5 w-5 mr-2 text-blue-600" />
                    Projects
                  </h3>
                  
                  {/* Add New Project Form */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Add New Project</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
                        <input
                          type="text"
                          value={formData.newProject.title}
                          onChange={(e) => handleInputChange('newProject.title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="E-commerce Website"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                        <input
                          type="text"
                          value={formData.newProject.technologies}
                          onChange={(e) => handleInputChange('newProject.technologies', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
                        <input
                          type="url"
                          value={formData.newProject.liveUrl}
                          onChange={(e) => handleInputChange('newProject.liveUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://myproject.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                        <input
                          type="url"
                          value={formData.newProject.githubUrl}
                          onChange={(e) => handleInputChange('newProject.githubUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://github.com/user/project"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <textarea
                        rows={3}
                        value={formData.newProject.description}
                        onChange={(e) => handleInputChange('newProject.description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe your project, its features, and impact..."
                      />
                    </div>
                    <button
                      onClick={handleAddProject}
                      className="mt-3 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </button>
                  </div>

                  {/* Projects List */}
                  {formData.projectsList.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Added Projects ({formData.projectsList.length})</h4>
                      {formData.projectsList.map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{project.title}</h5>
                              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                              {project.technologies && (
                                <p className="text-sm text-blue-600 mt-1">Technologies: {project.technologies}</p>
                              )}
                              <div className="flex space-x-4 mt-2">
                                {project.liveUrl && (
                                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline">
                                    Live Demo
                                  </a>
                                )}
                                {project.githubUrl && (
                                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:underline">
                                    GitHub
                                  </a>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Experience Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-blue-600" />
                    Work Experience
                  </h3>
                  
                  {/* Add New Experience Form */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Add Work Experience</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                        <input
                          type="text"
                          value={formData.newExperience.title}
                          onChange={(e) => handleInputChange('newExperience.title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                        <input
                          type="text"
                          value={formData.newExperience.company}
                          onChange={(e) => handleInputChange('newExperience.company', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tech Company Inc."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          value={formData.newExperience.duration}
                          onChange={(e) => handleInputChange('newExperience.duration', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Jan 2022 - Present"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={formData.newExperience.description}
                        onChange={(e) => handleInputChange('newExperience.description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe your role, responsibilities, and achievements..."
                      />
                    </div>
                    <button
                      onClick={handleAddExperience}
                      className="mt-3 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </button>
                  </div>

                  {/* Experience List */}
                  {formData.experienceList.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Added Experience ({formData.experienceList.length})</h4>
                      {formData.experienceList.map((exp) => (
                        <div key={exp.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{exp.title}</h5>
                              <p className="text-sm text-blue-600">{exp.company}</p>
                              {exp.duration && <p className="text-sm text-gray-500">{exp.duration}</p>}
                              {exp.description && <p className="text-sm text-gray-600 mt-2">{exp.description}</p>}
                            </div>
                            <button
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Education Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                    Education
                  </h3>
                  
                  {/* Add New Education Form */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Add Education</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree *</label>
                        <input
                          type="text"
                          value={formData.newEducation.degree}
                          onChange={(e) => handleInputChange('newEducation.degree', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Bachelor of Science in Computer Science"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School/University *</label>
                        <input
                          type="text"
                          value={formData.newEducation.school}
                          onChange={(e) => handleInputChange('newEducation.school', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="University of Technology"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <input
                          type="text"
                          value={formData.newEducation.year}
                          onChange={(e) => handleInputChange('newEducation.year', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="2022"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleAddEducation}
                      className="mt-3 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </button>
                  </div>

                  {/* Education List */}
                  {formData.educationList.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Added Education ({formData.educationList.length})</h4>
                      {formData.educationList.map((edu) => (
                        <div key={edu.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{edu.degree}</h5>
                              <p className="text-sm text-blue-600">{edu.school}</p>
                              {edu.year && <p className="text-sm text-gray-500">{edu.year}</p>}
                            </div>
                            <button
                              onClick={() => handleDeleteEducation(edu.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Achievements Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-blue-600" />
                    Key Achievements
                  </h3>
                  
                  {/* Add New Achievement Form */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Add Achievement</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Achievement Description *</label>
                      <textarea
                        rows={2}
                        value={formData.newAchievement.description}
                        onChange={(e) => handleInputChange('newAchievement.description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Increased team productivity by 40% through implementation of automated testing..."
                      />
                    </div>
                    <button
                      onClick={handleAddAchievement}
                      className="mt-3 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Achievement
                    </button>
                  </div>

                  {/* Achievements List */}
                  {formData.achievementsList.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Added Achievements ({formData.achievementsList.length})</h4>
                      {formData.achievementsList.map((achievement) => (
                        <div key={achievement.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">{achievement.description}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteAchievement(achievement.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Design Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-blue-600" />
                    Design Preferences
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Style Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Portfolio Style</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {styleOptions.map((style) => (
                          <div
                            key={style.id}
                            onClick={() => handleInputChange('preferences.style', style.id)}
                            className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                              formData.preferences.style === style.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <h4 className="font-medium text-gray-900 mb-1">{style.name}</h4>
                            <p className="text-sm text-gray-600">{style.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Color Scheme */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Color Scheme</label>
                      <div className="flex flex-wrap gap-4">
                        {colorOptions.map((color) => (
                          <div
                            key={color.id}
                            onClick={() => handleInputChange('preferences.colorScheme', color.id)}
                            className={`cursor-pointer flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                              formData.preferences.colorScheme === color.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div 
                              className="w-6 h-6 rounded-full border border-gray-200"
                              style={{ backgroundColor: color.color }}
                            ></div>
                            <span className="text-sm font-medium text-gray-900">{color.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Options */}
                    <div>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.preferences.includeTestimonials}
                          onChange={(e) => handleInputChange('preferences.includeTestimonials', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Include testimonials section</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* AI Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Lightbulb className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800 mb-1">
                        Powered by Google Gemini AI
                      </h4>
                      <p className="text-sm text-blue-700">
                        Your portfolio content will be generated using advanced AI to create professional, 
                        engaging content tailored to your role and experience.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleGeneratePortfolio}
                    disabled={isGenerating || !formData.personalInfo.name || !formData.personalInfo.email || !formData.targetRole || formData.skills.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Generating Portfolio...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Generate Portfolio with AI
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'preview' && generatedPortfolio && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-800 text-sm font-medium mb-4 animate-fade-in">
                <CheckCircle className="w-4 h-4 mr-2 animate-pulse" />
                Portfolio Generated Successfully
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-[1.15]">
                Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-600 to-blue-600">
                  Portfolio Preview
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                Review your AI-generated portfolio before deploying to Netlify
              </p>
            </div>

            {/* Portfolio Preview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Portfolio Preview</h3>
                <div className="flex space-x-3">
                  <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    <Eye className="h-4 w-4 mr-2" />
                    Full Preview
                  </button>
                </div>
              </div>

              {/* Portfolio Content Preview */}
              <div className="space-y-8">
                {/* Header */}
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{generatedPortfolio.personalInfo.name}</h1>
                  <p className="text-xl text-gray-600 mb-4">{formData.targetRole}</p>
                  <div className="flex justify-center space-x-4 text-sm text-gray-600">
                    <span>{generatedPortfolio.personalInfo.email}</span>
                    {generatedPortfolio.personalInfo.phone && <span>{generatedPortfolio.personalInfo.phone}</span>}
                    {generatedPortfolio.personalInfo.location && <span>{generatedPortfolio.personalInfo.location}</span>}
                  </div>
                </div>

                {/* About Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-700">{generatedPortfolio.sections.about}</p>
                </div>

                {/* Projects Preview */}
                {generatedPortfolio.sections.projects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Projects ({generatedPortfolio.sections.projects.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedPortfolio.sections.projects.slice(0, 4).map((project, index) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">{project.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{project.description.substring(0, 100)}...</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {project.technologies.slice(0, 3).map((tech, techIndex) => (
                              <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            {project.liveUrl && (
                              <span className="text-xs text-green-600">Live Demo</span>
                            )}
                            {project.githubUrl && (
                              <span className="text-xs text-gray-600">GitHub</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience Preview */}
                {generatedPortfolio.sections.experience.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience ({generatedPortfolio.sections.experience.length})</h3>
                    <div className="space-y-4">
                      {generatedPortfolio.sections.experience.slice(0, 3).map((exp, index) => (
                        <div key={exp.id} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium text-gray-900">{exp.title}</h4>
                          <p className="text-sm text-blue-600">{exp.company}</p>
                          <p className="text-sm text-gray-500">{exp.duration}</p>
                          <p className="text-sm text-gray-600 mt-1">{exp.description.substring(0, 150)}...</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education Preview */}
                {generatedPortfolio.sections.education.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Education ({generatedPortfolio.sections.education.length})</h3>
                    <div className="space-y-3">
                      {generatedPortfolio.sections.education.map((edu, index) => (
                        <div key={edu.id} className="border border-gray-200 rounded-lg p-3">
                          <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                          <p className="text-sm text-blue-600">{edu.school}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                  <div className="space-y-3">
                    {generatedPortfolio.sections.skills.technical.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Technical Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {generatedPortfolio.sections.skills.technical.slice(0, 10).map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {generatedPortfolio.sections.skills.soft.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Soft Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {generatedPortfolio.sections.skills.soft.slice(0, 8).map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('input')}
                className="px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                ← Edit Portfolio
              </button>
              
              <button
                onClick={handleDeployPortfolio}
                disabled={isDeploying}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
              >
                {isDeploying ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Deploying to Netlify...
                  </>
                ) : (
                  <>
                    <Globe className="h-5 w-5 mr-2" />
                    Deploy to Netlify
                  </>
                )}
              </button>
            </div>

            {deploymentError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{deploymentError}</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 'success' && deploymentResult && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Portfolio Deployed Successfully!</h2>
              <p className="text-lg text-gray-600 mb-8">
                Your portfolio is now live on Netlify and accessible worldwide.
              </p>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center space-x-4">
                  <Globe className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Your Portfolio URL:</p>
                    <a 
                      href={deploymentResult.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    >
                      {deploymentResult.url}
                    </a>
                  </div>
                  <button
                    onClick={copyPortfolioUrl}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Fast Loading</h3>
                  <p className="text-sm text-gray-600">Optimized for performance</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Secure HTTPS</h3>
                  <p className="text-sm text-gray-600">SSL certificate included</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Global CDN</h3>
                  <p className="text-sm text-gray-600">Worldwide accessibility</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href={deploymentResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  View Live Portfolio
                </a>
                <button
                  onClick={() => {
                    setCurrentStep('input');
                    setGeneratedPortfolio(null);
                    setDeploymentResult(null);
                    setFormData({
                      personalInfo: {
                        name: '',
                        email: '',
                        phone: '',
                        location: '',
                        linkedin: '',
                        github: '',
                        website: ''
                      },
                      targetRole: '',
                      experience: '',
                      skills: [],
                      projects: '',
                      achievements: '',
                      preferences: {
                        style: 'modern',
                        colorScheme: 'blue',
                        includeTestimonials: false
                      },
                      skillsInput: '',
                      projectsList: [],
                      experienceList: [],
                      educationList: [],
                      achievementsList: [],
                      newProject: {
                        title: '',
                        description: '',
                        technologies: '',
                        liveUrl: '',
                        githubUrl: ''
                      },
                      newExperience: {
                        title: '',
                        company: '',
                        duration: '',
                        description: ''
                      },
                      newEducation: {
                        degree: '',
                        school: '',
                        year: ''
                      },
                      newAchievement: {
                        description: ''
                      }
                    });
                  }}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Create Another Portfolio
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