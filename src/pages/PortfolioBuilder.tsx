import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Briefcase, GraduationCap, Award, Palette, Eye, Download, Save, Plus, Trash2, Edit3, Globe, Linkedin, Github, Mail, Phone, MapPin, Star, Zap, Crown, Shield, Target, TrendingUp, Users, CheckCircle, Sparkles, Layout, BookOpen, Camera, Code, Paintbrush, Megaphone } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  twitter: string;
  bio: string;
  profileImage: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
  featured: boolean;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  graduationYear: string;
  gpa: string;
}

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl: string;
}

interface PortfolioData {
  personalInfo: PersonalInfo;
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  theme: string;
  layout: string;
  customizations: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
}

const PortfolioBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      twitter: '',
      bio: '',
      profileImage: ''
    },
    projects: [],
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    theme: 'modern',
    layout: 'grid',
    customizations: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#0ea5e9'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      }
    }
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      try {
        setPortfolioData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved portfolio data:', error);
      }
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [portfolioData]);

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: [],
      liveUrl: '',
      githubUrl: '',
      imageUrl: '',
      featured: false
    };
    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false
    };
    setPortfolioData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      graduationYear: '',
      gpa: ''
    };
    setPortfolioData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    const newSkill: Skill = {
      name: '',
      level: 50,
      category: 'Technical'
    };
    setPortfolioData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (index: number) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      credentialUrl: ''
    };
    setPortfolioData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCertification]
    }));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
      toast.success('Portfolio saved successfully!');
    } catch (error) {
      toast.error('Failed to save portfolio');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Portfolio data exported!');
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User, color: 'from-blue-500 to-blue-600' },
    { id: 'projects', label: 'Projects', icon: Code, color: 'from-green-500 to-green-600' },
    { id: 'experience', label: 'Experience', icon: Briefcase, color: 'from-purple-500 to-purple-600' },
    { id: 'education', label: 'Education', icon: GraduationCap, color: 'from-orange-500 to-orange-600' },
    { id: 'skills', label: 'Skills', icon: Zap, color: 'from-yellow-500 to-yellow-600' },
    { id: 'certifications', label: 'Certifications', icon: Award, color: 'from-red-500 to-red-600' },
    { id: 'design', label: 'Design', icon: Palette, color: 'from-pink-500 to-pink-600' }
  ];

  const themes = [
    { id: 'modern', name: 'Modern', preview: '#2563eb' },
    { id: 'creative', name: 'Creative', preview: '#7c3aed' },
    { id: 'minimal', name: 'Minimal', preview: '#059669' },
    { id: 'dark', name: 'Dark', preview: '#1f2937' },
    { id: 'professional', name: 'Professional', preview: '#dc2626' }
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
                <Layout className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Portfolio Builder</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                {isPreviewMode ? <Edit3 className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {isPreviewMode ? 'Edit' : 'Preview'}
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isPreviewMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Sections</h3>
                
                <div className="space-y-2">
                  {tabs.map((tab, index) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group w-full flex items-center p-3 rounded-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <tab.icon className="h-5 w-5 mr-3" />
                      <span className="font-medium">{tab.label}</span>
                      
                      {activeTab === tab.id && (
                        <div className="ml-auto">
                          <Zap className="h-4 w-4 animate-pulse" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Progress Indicator */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-2">Completion Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Personal Info</span>
                      <span className={portfolioData.personalInfo.name ? 'text-green-600' : 'text-gray-400'}>
                        {portfolioData.personalInfo.name ? '✓' : '○'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Projects</span>
                      <span className={portfolioData.projects.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                        {portfolioData.projects.length > 0 ? '✓' : '○'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Experience</span>
                      <span className={portfolioData.experience.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                        {portfolioData.experience.length > 0 ? '✓' : '○'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 animate-fade-in-up">
                {/* Personal Info Tab */}
                {activeTab === 'personal' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <User className="h-6 w-6 text-blue-600 mr-3" />
                      <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={portfolioData.personalInfo.name}
                          onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={portfolioData.personalInfo.email}
                          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="john@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={portfolioData.personalInfo.phone}
                          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={portfolioData.personalInfo.location}
                          onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                        <input
                          type="url"
                          value={portfolioData.personalInfo.website}
                          onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="https://johndoe.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                        <input
                          type="url"
                          value={portfolioData.personalInfo.linkedin}
                          onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="https://linkedin.com/in/johndoe"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                        <input
                          type="url"
                          value={portfolioData.personalInfo.github}
                          onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="https://github.com/johndoe"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                        <input
                          type="url"
                          value={portfolioData.personalInfo.twitter}
                          onChange={(e) => handlePersonalInfoChange('twitter', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="https://twitter.com/johndoe"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        rows={4}
                        value={portfolioData.personalInfo.bio}
                        onChange={(e) => handlePersonalInfoChange('bio', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <Code className="h-6 w-6 text-green-600 mr-3" />
                        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                      </div>
                      <button
                        onClick={addProject}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {portfolioData.projects.map((project, index) => (
                        <div key={project.id} className="p-6 border-2 border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Project {index + 1}</h3>
                            <button
                              onClick={() => removeProject(project.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                              <input
                                type="text"
                                value={project.title}
                                onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="My Awesome Project"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
                              <input
                                type="text"
                                value={project.technologies.join(', ')}
                                onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="React, Node.js, MongoDB"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
                              <input
                                type="url"
                                value={project.liveUrl}
                                onChange={(e) => updateProject(project.id, 'liveUrl', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="https://myproject.com"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                              <input
                                type="url"
                                value={project.githubUrl}
                                onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="https://github.com/user/project"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              rows={3}
                              value={project.description}
                              onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Describe your project..."
                            />
                          </div>
                          
                          <div className="mt-4 flex items-center">
                            <input
                              type="checkbox"
                              id={`featured-${project.id}`}
                              checked={project.featured}
                              onChange={(e) => updateProject(project.id, 'featured', e.target.checked)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`featured-${project.id}`} className="ml-2 block text-sm text-gray-900">
                              Featured Project
                            </label>
                          </div>
                        </div>
                      ))}
                      
                      {portfolioData.projects.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                          <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                          <p className="text-gray-600 mb-4">Add your first project to showcase your work</p>
                          <button
                            onClick={addProject}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                          >
                            Add Project
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === 'experience' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <Briefcase className="h-6 w-6 text-purple-600 mr-3" />
                        <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
                      </div>
                      <button
                        onClick={addExperience}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {portfolioData.experience.map((exp, index) => (
                        <div key={exp.id} className="p-6 border-2 border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Experience {index + 1}</h3>
                            <button
                              onClick={() => removeExperience(exp.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                              <input
                                type="text"
                                value={exp.title}
                                onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Software Engineer"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Tech Company Inc."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                              <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="January 2020"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                              <input
                                type="text"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Present"
                                disabled={exp.current}
                              />
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              rows={3}
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Describe your role and achievements..."
                            />
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`current-${exp.id}`}
                              checked={exp.current}
                              onChange={(e) => {
                                updateExperience(exp.id, 'current', e.target.checked);
                                if (e.target.checked) {
                                  updateExperience(exp.id, 'endDate', 'Present');
                                }
                              }}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`current-${exp.id}`} className="ml-2 block text-sm text-gray-900">
                              I currently work here
                            </label>
                          </div>
                        </div>
                      ))}
                      
                      {portfolioData.experience.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No experience yet</h3>
                          <p className="text-gray-600 mb-4">Add your work experience to build credibility</p>
                          <button
                            onClick={addExperience}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                          >
                            Add Experience
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Education Tab */}
                {activeTab === 'education' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <GraduationCap className="h-6 w-6 text-orange-600 mr-3" />
                        <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                      </div>
                      <button
                        onClick={addEducation}
                        className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {portfolioData.education.map((edu, index) => (
                        <div key={edu.id} className="p-6 border-2 border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Education {index + 1}</h3>
                            <button
                              onClick={() => removeEducation(edu.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Bachelor of Science in Computer Science"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                              <input
                                type="text"
                                value={edu.school}
                                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="University of Technology"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                              <input
                                type="text"
                                value={edu.graduationYear}
                                onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="2020"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">GPA (Optional)</label>
                              <input
                                type="text"
                                value={edu.gpa}
                                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="3.8"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {portfolioData.education.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No education yet</h3>
                          <p className="text-gray-600 mb-4">Add your educational background</p>
                          <button
                            onClick={addEducation}
                            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
                          >
                            Add Education
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <Zap className="h-6 w-6 text-yellow-600 mr-3" />
                        <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
                      </div>
                      <button
                        onClick={addSkill}
                        className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skill
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {portfolioData.skills.map((skill, index) => (
                        <div key={index} className="p-4 border-2 border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Skill {index + 1}</h3>
                            <button
                              onClick={() => removeSkill(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                              <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => updateSkill(index, 'name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                placeholder="JavaScript"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                              <select
                                value={skill.category}
                                onChange={(e) => updateSkill(index, 'category', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              >
                                <option value="Technical">Technical</option>
                                <option value="Design">Design</option>
                                <option value="Soft Skills">Soft Skills</option>
                                <option value="Languages">Languages</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Level ({skill.level}%)</label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={skill.level}
                                onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {portfolioData.skills.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                          <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No skills yet</h3>
                          <p className="text-gray-600 mb-4">Add your skills to showcase your expertise</p>
                          <button
                            onClick={addSkill}
                            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-200"
                          >
                            Add Skill
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Certifications Tab */}
                {activeTab === 'certifications' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <Award className="h-6 w-6 text-red-600 mr-3" />
                        <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
                      </div>
                      <button
                        onClick={addCertification}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Certification
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {portfolioData.certifications.map((cert, index) => (
                        <div key={cert.id} className="p-6 border-2 border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Certification {index + 1}</h3>
                            <button
                              onClick={() => removeCertification(cert.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name</label>
                              <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="AWS Certified Solutions Architect"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
                              <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Amazon Web Services"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Date Obtained</label>
                              <input
                                type="text"
                                value={cert.date}
                                onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="March 2023"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Credential URL</label>
                              <input
                                type="url"
                                value={cert.credentialUrl}
                                onChange={(e) => updateCertification(cert.id, 'credentialUrl', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="https://credential-url.com"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {portfolioData.certifications.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No certifications yet</h3>
                          <p className="text-gray-600 mb-4">Add your certifications to demonstrate expertise</p>
                          <button
                            onClick={addCertification}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                          >
                            Add Certification
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Design Tab */}
                {activeTab === 'design' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <Palette className="h-6 w-6 text-pink-600 mr-3" />
                      <h2 className="text-2xl font-bold text-gray-900">Design & Customization</h2>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Theme Selection */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Theme</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {themes.map((theme) => (
                            <button
                              key={theme.id}
                              onClick={() => setPortfolioData(prev => ({ ...prev, theme: theme.id }))}
                              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                portfolioData.theme === theme.id
                                  ? 'border-pink-500 bg-pink-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div 
                                className="w-full h-16 rounded mb-2"
                                style={{ backgroundColor: theme.preview }}
                              ></div>
                              <p className="text-sm font-medium text-gray-900">{theme.name}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color Customization */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Colors</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                            <input
                              type="color"
                              value={portfolioData.customizations.colors.primary}
                              onChange={(e) => setPortfolioData(prev => ({
                                ...prev,
                                customizations: {
                                  ...prev.customizations,
                                  colors: {
                                    ...prev.customizations.colors,
                                    primary: e.target.value
                                  }
                                }
                              }))}
                              className="w-full h-12 border border-gray-300 rounded-lg"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                            <input
                              type="color"
                              value={portfolioData.customizations.colors.secondary}
                              onChange={(e) => setPortfolioData(prev => ({
                                ...prev,
                                customizations: {
                                  ...prev.customizations,
                                  colors: {
                                    ...prev.customizations.colors,
                                    secondary: e.target.value
                                  }
                                }
                              }))}
                              className="w-full h-12 border border-gray-300 rounded-lg"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                            <input
                              type="color"
                              value={portfolioData.customizations.colors.accent}
                              onChange={(e) => setPortfolioData(prev => ({
                                ...prev,
                                customizations: {
                                  ...prev.customizations,
                                  colors: {
                                    ...prev.customizations.colors,
                                    accent: e.target.value
                                  }
                                }
                              }))}
                              className="w-full h-12 border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Layout Options */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Layout Style</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => setPortfolioData(prev => ({ ...prev, layout: 'grid' }))}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                              portfolioData.layout === 'grid'
                                ? 'border-pink-500 bg-pink-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="grid grid-cols-2 gap-1 mb-2">
                              <div className="bg-gray-300 h-4 rounded"></div>
                              <div className="bg-gray-300 h-4 rounded"></div>
                              <div className="bg-gray-300 h-4 rounded"></div>
                              <div className="bg-gray-300 h-4 rounded"></div>
                            </div>
                            <p className="text-sm font-medium text-gray-900">Grid Layout</p>
                          </button>
                          
                          <button
                            onClick={() => setPortfolioData(prev => ({ ...prev, layout: 'list' }))}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                              portfolioData.layout === 'list'
                                ? 'border-pink-500 bg-pink-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="space-y-1 mb-2">
                              <div className="bg-gray-300 h-2 rounded"></div>
                              <div className="bg-gray-300 h-2 rounded"></div>
                              <div className="bg-gray-300 h-2 rounded"></div>
                              <div className="bg-gray-300 h-2 rounded"></div>
                            </div>
                            <p className="text-sm font-medium text-gray-900">List Layout</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              {/* Portfolio Preview */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {portfolioData.personalInfo.name || 'Your Name'}
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  {portfolioData.personalInfo.bio || 'Your professional bio will appear here'}
                </p>
                <div className="flex justify-center space-x-4">
                  {portfolioData.personalInfo.email && (
                    <a href={`mailto:${portfolioData.personalInfo.email}`} className="text-blue-600 hover:text-blue-700">
                      <Mail className="h-5 w-5" />
                    </a>
                  )}
                  {portfolioData.personalInfo.linkedin && (
                    <a href={portfolioData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {portfolioData.personalInfo.github && (
                    <a href={portfolioData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Projects Section */}
              {portfolioData.projects.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
                  <div className={portfolioData.layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                    {portfolioData.projects.map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        {project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex space-x-4">
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                              Live Demo
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {portfolioData.experience.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
                  <div className="space-y-6">
                    {portfolioData.experience.map((exp) => (
                      <div key={exp.id} className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                        <p className="text-gray-500 text-sm mb-2">{exp.startDate} - {exp.endDate}</p>
                        <p className="text-gray-700">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Section */}
              {portfolioData.skills.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portfolioData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{skill.level}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education Section */}
              {portfolioData.education.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
                  <div className="space-y-4">
                    {portfolioData.education.map((edu) => (
                      <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-blue-600">{edu.school}</p>
                        <p className="text-gray-500 text-sm">{edu.graduationYear}</p>
                        {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications Section */}
              {portfolioData.certifications.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Certifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {portfolioData.certifications.map((cert) => (
                      <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                        <p className="text-blue-600">{cert.issuer}</p>
                        <p className="text-gray-500 text-sm">{cert.date}</p>
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm">
                            View Credential
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioBuilder;