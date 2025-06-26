import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Briefcase, GraduationCap, Award, Code, Palette, Eye, Download, Save, Globe, Github, Linkedin, Mail, Phone, MapPin, Plus, Trash2, Edit3, Layout, Sparkles, Crown, Zap, Shield, Star, CheckCircle, Target, TrendingUp } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  bio: string;
  profileImage?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured: boolean;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface Education {
  id: string;
  degree: string;
  school: string;
  graduationYear: string;
  gpa?: string;
  honors?: string;
}

interface Skill {
  name: string;
  level: number; // 1-5
  category: 'technical' | 'soft' | 'language';
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
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
  customColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const PortfolioBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'personal' | 'projects' | 'experience' | 'education' | 'skills' | 'certifications' | 'design' | 'preview'>('personal');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      bio: ''
    },
    projects: [],
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    theme: 'modern',
    layout: 'single-page',
    customColors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#0ea5e9'
    }
  });

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeExperience, setActiveExperience] = useState<Experience | null>(null);

  // Auto-save functionality
  useEffect(() => {
    const saveData = () => {
      try {
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
      } catch (error) {
        console.error('Failed to save portfolio data:', error);
      }
    };

    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [portfolioData]);

  // Load saved data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolioData');
      if (saved) {
        setPortfolioData(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
    }
  }, []);

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
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
      featured: false
    };
    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
    setActiveProject(newProject);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, ...updates } : project
      )
    }));
  };

  const deleteProject = (id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
    setActiveProject(null);
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    };
    setPortfolioData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
    setActiveExperience(newExperience);
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, ...updates } : exp
      )
    }));
  };

  const deleteExperience = (id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
    setActiveExperience(null);
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      graduationYear: ''
    };
    setPortfolioData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    setPortfolioData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, ...updates } : edu
      )
    }));
  };

  const deleteEducation = (id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = (category: 'technical' | 'soft' | 'language') => {
    const newSkill: Skill = {
      name: '',
      level: 3,
      category
    };
    setPortfolioData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (index: number, updates: Partial<Skill>) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, ...updates } : skill
      )
    }));
  };

  const deleteSkill = (index: number) => {
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
      date: ''
    };
    setPortfolioData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCertification]
    }));
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    setPortfolioData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, ...updates } : cert
      )
    }));
  };

  const deleteCertification = (id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  const exportPortfolio = () => {
    const portfolioHtml = generatePortfolioHTML();
    const blob = new Blob([portfolioHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portfolioData.personalInfo.name.replace(/\s+/g, '_')}_Portfolio.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Portfolio exported successfully!');
  };

  const generatePortfolioHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolioData.personalInfo.name} - Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .hero { background: linear-gradient(135deg, ${portfolioData.customColors.primary}, ${portfolioData.customColors.accent}); color: white; padding: 100px 0; text-align: center; }
        .section { padding: 80px 0; }
        .section:nth-child(even) { background: #f8f9fa; }
        h1 { font-size: 3rem; margin-bottom: 1rem; }
        h2 { font-size: 2.5rem; margin-bottom: 2rem; color: ${portfolioData.customColors.primary}; }
        .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .project-card { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .btn { background: ${portfolioData.customColors.primary}; color: white; padding: 12px 24px; border: none; border-radius: 5px; text-decoration: none; display: inline-block; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
        .skill-bar { background: #e9ecef; height: 10px; border-radius: 5px; overflow: hidden; }
        .skill-fill { background: ${portfolioData.customColors.primary}; height: 100%; transition: width 0.3s ease; }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <h1>${portfolioData.personalInfo.name}</h1>
            <p style="font-size: 1.5rem; margin-bottom: 2rem;">${portfolioData.personalInfo.title}</p>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">${portfolioData.personalInfo.bio}</p>
            <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                ${portfolioData.personalInfo.email ? `<a href="mailto:${portfolioData.personalInfo.email}" class="btn">Contact Me</a>` : ''}
                ${portfolioData.personalInfo.linkedin ? `<a href="${portfolioData.personalInfo.linkedin}" class="btn" target="_blank">LinkedIn</a>` : ''}
                ${portfolioData.personalInfo.github ? `<a href="${portfolioData.personalInfo.github}" class="btn" target="_blank">GitHub</a>` : ''}
            </div>
        </div>
    </section>

    ${portfolioData.projects.length > 0 ? `
    <section class="section">
        <div class="container">
            <h2>Projects</h2>
            <div class="project-grid">
                ${portfolioData.projects.map(project => `
                <div class="project-card">
                    <h3 style="color: ${portfolioData.customColors.primary}; margin-bottom: 1rem;">${project.title}</h3>
                    <p style="margin-bottom: 1rem;">${project.description}</p>
                    <div style="margin-bottom: 1rem;">
                        ${project.technologies.map(tech => `<span style="background: ${portfolioData.customColors.accent}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 0.5rem;">${tech}</span>`).join('')}
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        ${project.liveUrl ? `<a href="${project.liveUrl}" class="btn" target="_blank">Live Demo</a>` : ''}
                        ${project.githubUrl ? `<a href="${project.githubUrl}" class="btn" target="_blank">GitHub</a>` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${portfolioData.experience.length > 0 ? `
    <section class="section">
        <div class="container">
            <h2>Experience</h2>
            ${portfolioData.experience.map(exp => `
            <div style="margin-bottom: 2rem; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="color: ${portfolioData.customColors.primary};">${exp.title}</h3>
                <p style="font-weight: bold; margin-bottom: 0.5rem;">${exp.company}</p>
                <p style="color: #666; margin-bottom: 1rem;">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
                <p>${exp.description}</p>
                ${exp.achievements.length > 0 ? `
                <ul style="margin-top: 1rem; padding-left: 1.5rem;">
                    ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
                ` : ''}
            </div>
            `).join('')}
        </div>
    </section>
    ` : ''}

    ${portfolioData.skills.length > 0 ? `
    <section class="section">
        <div class="container">
            <h2>Skills</h2>
            <div class="skills-grid">
                ${portfolioData.skills.map(skill => `
                <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>${skill.name}</span>
                        <span>${skill.level}/5</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-fill" style="width: ${(skill.level / 5) * 100}%;"></div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <section class="section">
        <div class="container" style="text-align: center;">
            <h2>Get In Touch</h2>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">Let's work together on your next project!</p>
            <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
                ${portfolioData.personalInfo.email ? `
                <div>
                    <h4>Email</h4>
                    <p><a href="mailto:${portfolioData.personalInfo.email}" style="color: ${portfolioData.customColors.primary};">${portfolioData.personalInfo.email}</a></p>
                </div>
                ` : ''}
                ${portfolioData.personalInfo.phone ? `
                <div>
                    <h4>Phone</h4>
                    <p><a href="tel:${portfolioData.personalInfo.phone}" style="color: ${portfolioData.customColors.primary};">${portfolioData.personalInfo.phone}</a></p>
                </div>
                ` : ''}
                ${portfolioData.personalInfo.location ? `
                <div>
                    <h4>Location</h4>
                    <p>${portfolioData.personalInfo.location}</p>
                </div>
                ` : ''}
            </div>
        </div>
    </section>
</body>
</html>`;
  };

  const steps = [
    { id: 'personal', label: 'Personal Info', icon: User, color: 'from-blue-500 to-blue-600' },
    { id: 'projects', label: 'Projects', icon: Code, color: 'from-green-500 to-green-600' },
    { id: 'experience', label: 'Experience', icon: Briefcase, color: 'from-teal-500 to-teal-600' },
    { id: 'education', label: 'Education', icon: GraduationCap, color: 'from-purple-500 to-purple-600' },
    { id: 'skills', label: 'Skills', icon: Target, color: 'from-orange-500 to-orange-600' },
    { id: 'certifications', label: 'Certifications', icon: Award, color: 'from-red-500 to-red-600' },
    { id: 'design', label: 'Design', icon: Palette, color: 'from-pink-500 to-pink-600' },
    { id: 'preview', label: 'Preview', icon: Eye, color: 'from-indigo-500 to-indigo-600' }
  ];

  const themes = [
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
    { id: 'creative', name: 'Creative', description: 'Bold and artistic layout' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
    { id: 'professional', name: 'Professional', description: 'Corporate and formal' }
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
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                {isPreviewMode ? <Edit3 className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {isPreviewMode ? 'Edit' : 'Preview'}
              </button>
              
              <button
                onClick={exportPortfolio}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
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
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                Professional Portfolio Builder
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] animate-fade-in-up">
                Build Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">
                  Dream Portfolio
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-up delay-200">
                Create a stunning, professional portfolio that showcases your work and attracts opportunities
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => setCurrentStep(step.id as any)}
                      className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        currentStep === step.id
                          ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                          : 'bg-white/80 text-gray-700 hover:bg-gray-100 shadow-md'
                      }`}
                    >
                      <step.icon className="h-5 w-5 mr-2" />
                      <span className="font-medium whitespace-nowrap">{step.label}</span>
                      
                      {currentStep === step.id && (
                        <div className="ml-2">
                          <Zap className="h-4 w-4 animate-pulse" />
                        </div>
                      )}
                    </button>
                    {index < steps.length - 1 && (
                      <div className="w-8 h-1 mx-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            steps.findIndex(s => s.id === currentStep) > index ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                          style={{ width: steps.findIndex(s => s.id === currentStep) > index ? '100%' : '0%' }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              {currentStep === 'personal' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <User className="h-6 w-6 mr-2 text-blue-600" />
                    Personal Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={portfolioData.personalInfo.name}
                        onChange={(e) => updatePersonalInfo('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title *</label>
                      <input
                        type="text"
                        value={portfolioData.personalInfo.title}
                        onChange={(e) => updatePersonalInfo('title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Full Stack Developer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={portfolioData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={portfolioData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={portfolioData.personalInfo.location}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={portfolioData.personalInfo.website}
                        onChange={(e) => updatePersonalInfo('website', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://johndoe.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                      <input
                        type="url"
                        value={portfolioData.personalInfo.linkedin}
                        onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://linkedin.com/in/johndoe"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                      <input
                        type="url"
                        value={portfolioData.personalInfo.github}
                        onChange={(e) => updatePersonalInfo('github', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://github.com/johndoe"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio *</label>
                    <textarea
                      rows={4}
                      value={portfolioData.personalInfo.bio}
                      onChange={(e) => updatePersonalInfo('bio', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Write a compelling bio that describes your expertise and passion..."
                    />
                  </div>
                </div>
              )}

              {currentStep === 'projects' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Code className="h-6 w-6 mr-2 text-green-600" />
                      Projects
                    </h2>
                    <button
                      onClick={addProject}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </button>
                  </div>

                  {portfolioData.projects.length === 0 ? (
                    <div className="text-center py-12">
                      <Code className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                      <p className="text-gray-600 mb-4">Add your first project to showcase your work</p>
                      <button
                        onClick={addProject}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        Add Your First Project
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {portfolioData.projects.map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{project.title || 'Untitled Project'}</h3>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setActiveProject(project)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteProject(project.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{project.description || 'No description'}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Project Edit Modal */}
                  {activeProject && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-gray-900">Edit Project</h3>
                          <button
                            onClick={() => setActiveProject(null)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                          >
                            <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
                            <input
                              type="text"
                              value={activeProject.title}
                              onChange={(e) => updateProject(activeProject.id, { title: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="My Awesome Project"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                            <textarea
                              rows={4}
                              value={activeProject.description}
                              onChange={(e) => updateProject(activeProject.id, { description: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Describe your project, its purpose, and key features..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
                            <input
                              type="text"
                              value={activeProject.technologies.join(', ')}
                              onChange={(e) => updateProject(activeProject.id, { 
                                technologies: e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech) 
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="React, Node.js, MongoDB, etc."
                            />
                            <p className="text-sm text-gray-500 mt-1">Separate technologies with commas</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Live Demo URL</label>
                              <input
                                type="url"
                                value={activeProject.liveUrl || ''}
                                onChange={(e) => updateProject(activeProject.id, { liveUrl: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="https://myproject.com"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                              <input
                                type="url"
                                value={activeProject.githubUrl || ''}
                                onChange={(e) => updateProject(activeProject.id, { githubUrl: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="https://github.com/username/project"
                              />
                            </div>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="featured"
                              checked={activeProject.featured}
                              onChange={(e) => updateProject(activeProject.id, { featured: e.target.checked })}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                              Featured Project (highlight this project)
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                          <button
                            onClick={() => setActiveProject(null)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setActiveProject(null)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'experience' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Briefcase className="h-6 w-6 mr-2 text-teal-600" />
                      Work Experience
                    </h2>
                    <button
                      onClick={addExperience}
                      className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </button>
                  </div>

                  {portfolioData.experience.length === 0 ? (
                    <div className="text-center py-12">
                      <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No experience added yet</h3>
                      <p className="text-gray-600 mb-4">Add your work experience to showcase your career journey</p>
                      <button
                        onClick={addExperience}
                        className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
                      >
                        Add Your First Experience
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {portfolioData.experience.map((exp) => (
                        <div key={exp.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{exp.title || 'Job Title'}</h3>
                              <p className="text-teal-600 font-medium">{exp.company || 'Company Name'}</p>
                              <p className="text-gray-500 text-sm">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setActiveExperience(exp)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteExperience(exp.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{exp.description || 'No description'}</p>
                          {exp.achievements.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Key Achievements:</h4>
                              <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {exp.achievements.map((achievement, index) => (
                                  <li key={index}>{achievement}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Experience Edit Modal */}
                  {activeExperience && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-gray-900">Edit Experience</h3>
                          <button
                            onClick={() => setActiveExperience(null)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                          >
                            <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                              <input
                                type="text"
                                value={activeExperience.title}
                                onChange={(e) => updateExperience(activeExperience.id, { title: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                placeholder="Software Engineer"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                              <input
                                type="text"
                                value={activeExperience.company}
                                onChange={(e) => updateExperience(activeExperience.id, { company: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                placeholder="Tech Company Inc."
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                              <input
                                type="text"
                                value={activeExperience.startDate}
                                onChange={(e) => updateExperience(activeExperience.id, { startDate: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                placeholder="January 2022"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                              <input
                                type="text"
                                value={activeExperience.endDate}
                                onChange={(e) => updateExperience(activeExperience.id, { endDate: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                placeholder="December 2023"
                                disabled={activeExperience.current}
                              />
                            </div>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="current"
                              checked={activeExperience.current}
                              onChange={(e) => updateExperience(activeExperience.id, { 
                                current: e.target.checked,
                                endDate: e.target.checked ? '' : activeExperience.endDate
                              })}
                              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                            />
                            <label htmlFor="current" className="ml-2 block text-sm text-gray-900">
                              I currently work here
                            </label>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
                            <textarea
                              rows={4}
                              value={activeExperience.description}
                              onChange={(e) => updateExperience(activeExperience.id, { description: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              placeholder="Describe your role, responsibilities, and key contributions..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Key Achievements</label>
                            <textarea
                              rows={3}
                              value={activeExperience.achievements.join('\n')}
                              onChange={(e) => updateExperience(activeExperience.id, { 
                                achievements: e.target.value.split('\n').filter(achievement => achievement.trim()) 
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              placeholder="Each achievement on a new line..."
                            />
                            <p className="text-sm text-gray-500 mt-1">Enter each achievement on a new line</p>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                          <button
                            onClick={() => setActiveExperience(null)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setActiveExperience(null)}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'education' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <GraduationCap className="h-6 w-6 mr-2 text-purple-600" />
                      Education
                    </h2>
                    <button
                      onClick={addEducation}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </button>
                  </div>

                  {portfolioData.education.length === 0 ? (
                    <div className="text-center py-12">
                      <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No education added yet</h3>
                      <p className="text-gray-600 mb-4">Add your educational background</p>
                      <button
                        onClick={addEducation}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                      >
                        Add Education
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {portfolioData.education.map((edu) => (
                        <div key={edu.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Bachelor of Science in Computer Science"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">School/University *</label>
                              <input
                                type="text"
                                value={edu.school}
                                onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="University of Technology"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year *</label>
                              <input
                                type="text"
                                value={edu.graduationYear}
                                onChange={(e) => updateEducation(edu.id, { graduationYear: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="2023"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">GPA (Optional)</label>
                              <input
                                type="text"
                                value={edu.gpa || ''}
                                onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="3.8/4.0"
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Honors/Awards (Optional)</label>
                            <input
                              type="text"
                              value={edu.honors || ''}
                              onChange={(e) => updateEducation(edu.id, { honors: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Magna Cum Laude, Dean's List"
                            />
                          </div>

                          <div className="flex justify-end">
                            <button
                              onClick={() => deleteEducation(edu.id)}
                              className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'skills' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Target className="h-6 w-6 mr-2 text-orange-600" />
                    Skills & Expertise
                  </h2>

                  <div className="space-y-8">
                    {/* Technical Skills */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Technical Skills</h3>
                        <button
                          onClick={() => addSkill('technical')}
                          className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {portfolioData.skills.filter(skill => skill.category === 'technical').map((skill, index) => {
                          const skillIndex = portfolioData.skills.findIndex(s => s === skill);
                          return (
                            <div key={skillIndex} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <input
                                  type="text"
                                  value={skill.name}
                                  onChange={(e) => updateSkill(skillIndex, { name: e.target.value })}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mr-2"
                                  placeholder="Skill name"
                                />
                                <button
                                  onClick={() => deleteSkill(skillIndex)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-600">Proficiency Level</span>
                                  <span className="text-sm font-medium text-orange-600">{skill.level}/5</span>
                                </div>
                                <input
                                  type="range"
                                  min="1"
                                  max="5"
                                  value={skill.level}
                                  onChange={(e) => updateSkill(skillIndex, { level: parseInt(e.target.value) })}
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {portfolioData.skills.filter(skill => skill.category === 'technical').length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                          <p className="text-gray-500">No technical skills added yet</p>
                        </div>
                      )}
                    </div>

                    {/* Soft Skills */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Soft Skills</h3>
                        <button
                          onClick={() => addSkill('soft')}
                          className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {portfolioData.skills.filter(skill => skill.category === 'soft').map((skill, index) => {
                          const skillIndex = portfolioData.skills.findIndex(s => s === skill);
                          return (
                            <div key={skillIndex} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <input
                                  type="text"
                                  value={skill.name}
                                  onChange={(e) => updateSkill(skillIndex, { name: e.target.value })}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mr-2"
                                  placeholder="Skill name"
                                />
                                <button
                                  onClick={() => deleteSkill(skillIndex)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-600">Proficiency Level</span>
                                  <span className="text-sm font-medium text-orange-600">{skill.level}/5</span>
                                </div>
                                <input
                                  type="range"
                                  min="1"
                                  max="5"
                                  value={skill.level}
                                  onChange={(e) => updateSkill(skillIndex, { level: parseInt(e.target.value) })}
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {portfolioData.skills.filter(skill => skill.category === 'soft').length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                          <p className="text-gray-500">No soft skills added yet</p>
                        </div>
                      )}
                    </div>

                    {/* Languages */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
                        <button
                          onClick={() => addSkill('language')}
                          className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {portfolioData.skills.filter(skill => skill.category === 'language').map((skill, index) => {
                          const skillIndex = portfolioData.skills.findIndex(s => s === skill);
                          return (
                            <div key={skillIndex} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <input
                                  type="text"
                                  value={skill.name}
                                  onChange={(e) => updateSkill(skillIndex, { name: e.target.value })}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mr-2"
                                  placeholder="Language name"
                                />
                                <button
                                  onClick={() => deleteSkill(skillIndex)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-600">Proficiency Level</span>
                                  <span className="text-sm font-medium text-orange-600">
                                    {skill.level === 1 ? 'Beginner' : 
                                     skill.level === 2 ? 'Elementary' :
                                     skill.level === 3 ? 'Intermediate' :
                                     skill.level === 4 ? 'Advanced' : 'Native'}
                                  </span>
                                </div>
                                <input
                                  type="range"
                                  min="1"
                                  max="5"
                                  value={skill.level}
                                  onChange={(e) => updateSkill(skillIndex, { level: parseInt(e.target.value) })}
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {portfolioData.skills.filter(skill => skill.category === 'language').length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                          <p className="text-gray-500">No languages added yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'certifications' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Award className="h-6 w-6 mr-2 text-red-600" />
                      Certifications & Awards
                    </h2>
                    <button
                      onClick={addCertification}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Certification
                    </button>
                  </div>

                  {portfolioData.certifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No certifications added yet</h3>
                      <p className="text-gray-600 mb-4">Add your professional certifications and awards</p>
                      <button
                        onClick={addCertification}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        Add Certification
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {portfolioData.certifications.map((cert) => (
                        <div key={cert.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name *</label>
                              <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="AWS Certified Solutions Architect"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization *</label>
                              <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Amazon Web Services"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Date Obtained *</label>
                              <input
                                type="text"
                                value={cert.date}
                                onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="March 2023"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Credential URL (Optional)</label>
                              <input
                                type="url"
                                value={cert.credentialUrl || ''}
                                onChange={(e) => updateCertification(cert.id, { credentialUrl: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="https://credentials.example.com/cert/123"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button
                              onClick={() => deleteCertification(cert.id)}
                              className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'design' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Palette className="h-6 w-6 mr-2 text-pink-600" />
                    Design & Customization
                  </h2>

                  <div className="space-y-8">
                    {/* Theme Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Theme</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {themes.map((theme) => (
                          <div
                            key={theme.id}
                            onClick={() => setPortfolioData(prev => ({ ...prev, theme: theme.id }))}
                            className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 ${
                              portfolioData.theme === theme.id
                                ? 'border-pink-500 bg-pink-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <h4 className="font-semibold text-gray-900 mb-1">{theme.name}</h4>
                            <p className="text-sm text-gray-600">{theme.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Color Customization */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Colors</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="color"
                              value={portfolioData.customColors.primary}
                              onChange={(e) => setPortfolioData(prev => ({
                                ...prev,
                                customColors: { ...prev.customColors, primary: e.target.value }
                              }))}
                              className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                            />
                            <input
                              type="text"
                              value={portfolioData.customColors.primary}
                              onChange={(e) => setPortfolioData(prev => ({
                                ...prev,
                                customColors: { ...prev.customColors, primary: e.target.value }
                              }))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="color"
                              value={portfolioData.customColors.secondary}
                              onChange={(e) => setPortfolioData(prev => ({
                                ...prev,
                                customColors: { ...prev.customColors, secondary: e.target.value }
                              }))}
                              className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                            />
                            <input
                              type="text"
                              value={portfolioData.customColors.secondary}
                              onChange={(e) => setPortfolioData(prev => ({
                                ...prev,
                                customColors: { ...prev.customColors, secondary: e.target.value }
                              }))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="color"
                              value={portfolioData.customColors.accent}
                              onChange={(e) => setPortfolioData(prev => ({
                                ...prev,
                                customColors: { ...prev.customColors, accent: e.target.value }
                              }))}
                              className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                            />
                            <input
                              type="text"
                              value={portfolioData.customColors.accent}
                              onChange={(e) => setPortfolioData(prev => ({
                                ...prev,
                                customColors: { ...prev.customColors, accent: e.target.value }
                              }))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Layout Options */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Layout Style</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          onClick={() => setPortfolioData(prev => ({ ...prev, layout: 'single-page' }))}
                          className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 ${
                            portfolioData.layout === 'single-page'
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <Layout className="h-5 w-5 text-pink-600 mr-2" />
                            <h4 className="font-semibold text-gray-900">Single Page</h4>
                          </div>
                          <p className="text-sm text-gray-600">All content on one scrollable page</p>
                        </div>

                        <div
                          onClick={() => setPortfolioData(prev => ({ ...prev, layout: 'multi-page' }))}
                          className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 ${
                            portfolioData.layout === 'multi-page'
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <Layout className="h-5 w-5 text-pink-600 mr-2" />
                            <h4 className="font-semibold text-gray-900">Multi Page</h4>
                          </div>
                          <p className="text-sm text-gray-600">Separate pages for each section</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'preview' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Eye className="h-6 w-6 mr-2 text-indigo-600" />
                      Portfolio Preview
                    </h2>
                    <div className="flex space-x-3">
                      <button
                        onClick={exportPortfolio}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export HTML
                      </button>
                      <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                        <Globe className="h-4 w-4 mr-2" />
                        Publish Online
                      </button>
                    </div>
                  </div>

                  {/* Portfolio Preview */}
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    <div 
                      className="text-white text-center py-16"
                      style={{ background: `linear-gradient(135deg, ${portfolioData.customColors.primary}, ${portfolioData.customColors.accent})` }}
                    >
                      <h1 className="text-4xl font-bold mb-2">{portfolioData.personalInfo.name || 'Your Name'}</h1>
                      <p className="text-xl mb-4">{portfolioData.personalInfo.title || 'Your Title'}</p>
                      <p className="text-lg max-w-2xl mx-auto px-4">{portfolioData.personalInfo.bio || 'Your professional bio will appear here'}</p>
                      
                      <div className="flex justify-center space-x-4 mt-6">
                        {portfolioData.personalInfo.email && (
                          <div className="flex items-center text-white/90">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>{portfolioData.personalInfo.email}</span>
                          </div>
                        )}
                        {portfolioData.personalInfo.phone && (
                          <div className="flex items-center text-white/90">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{portfolioData.personalInfo.phone}</span>
                          </div>
                        )}
                        {portfolioData.personalInfo.location && (
                          <div className="flex items-center text-white/90">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{portfolioData.personalInfo.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-8">
                      {/* Projects Preview */}
                      {portfolioData.projects.length > 0 && (
                        <div className="mb-12">
                          <h2 className="text-2xl font-bold mb-6" style={{ color: portfolioData.customColors.primary }}>
                            Featured Projects
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {portfolioData.projects.slice(0, 4).map((project) => (
                              <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                                <h3 className="text-lg font-semibold mb-2" style={{ color: portfolioData.customColors.primary }}>
                                  {project.title || 'Project Title'}
                                </h3>
                                <p className="text-gray-600 mb-3">{project.description || 'Project description'}</p>
                                <div className="flex flex-wrap gap-2">
                                  {project.technologies.map((tech, index) => (
                                    <span 
                                      key={index} 
                                      className="px-2 py-1 text-white text-sm rounded-full"
                                      style={{ backgroundColor: portfolioData.customColors.accent }}
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills Preview */}
                      {portfolioData.skills.length > 0 && (
                        <div className="mb-12">
                          <h2 className="text-2xl font-bold mb-6" style={{ color: portfolioData.customColors.primary }}>
                            Skills & Expertise
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {portfolioData.skills.slice(0, 9).map((skill, index) => (
                              <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium">{skill.name}</span>
                                  <span className="text-sm text-gray-600">{skill.level}/5</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{ 
                                      width: `${(skill.level / 5) * 100}%`,
                                      backgroundColor: portfolioData.customColors.primary
                                    }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Experience Preview */}
                      {portfolioData.experience.length > 0 && (
                        <div className="mb-12">
                          <h2 className="text-2xl font-bold mb-6" style={{ color: portfolioData.customColors.primary }}>
                            Work Experience
                          </h2>
                          <div className="space-y-6">
                            {portfolioData.experience.slice(0, 3).map((exp) => (
                              <div key={exp.id} className="border-l-4 pl-6" style={{ borderColor: portfolioData.customColors.accent }}>
                                <h3 className="text-lg font-semibold" style={{ color: portfolioData.customColors.primary }}>
                                  {exp.title || 'Job Title'}
                                </h3>
                                <p className="font-medium text-gray-700">{exp.company || 'Company Name'}</p>
                                <p className="text-gray-500 text-sm mb-2">
                                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                </p>
                                <p className="text-gray-600">{exp.description || 'Job description'}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => {
                  const currentIndex = steps.findIndex(step => step.id === currentStep);
                  if (currentIndex > 0) {
                    setCurrentStep(steps[currentIndex - 1].id as any);
                  }
                }}
                disabled={currentStep === 'personal'}
                className="px-6 py-3 text-gray-700 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              
              <button
                onClick={() => {
                  const currentIndex = steps.findIndex(step => step.id === currentStep);
                  if (currentIndex < steps.length - 1) {
                    setCurrentStep(steps[currentIndex + 1].id as any);
                  }
                }}
                disabled={currentStep === 'preview'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {currentStep === 'preview' ? 'Complete' : 'Next →'}
              </button>
            </div>
          </>
        ) : (
          /* Preview Mode */
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div 
              className="text-white text-center py-20"
              style={{ background: `linear-gradient(135deg, ${portfolioData.customColors.primary}, ${portfolioData.customColors.accent})` }}
            >
              <h1 className="text-5xl font-bold mb-4">{portfolioData.personalInfo.name || 'Your Name'}</h1>
              <p className="text-2xl mb-6">{portfolioData.personalInfo.title || 'Your Title'}</p>
              <p className="text-lg max-w-3xl mx-auto px-4 mb-8">{portfolioData.personalInfo.bio || 'Your professional bio will appear here'}</p>
              
              <div className="flex justify-center space-x-6 flex-wrap">
                {portfolioData.personalInfo.email && (
                  <a href={`mailto:${portfolioData.personalInfo.email}`} className="flex items-center text-white/90 hover:text-white transition-colors duration-200">
                    <Mail className="h-5 w-5 mr-2" />
                    <span>{portfolioData.personalInfo.email}</span>
                  </a>
                )}
                {portfolioData.personalInfo.linkedin && (
                  <a href={portfolioData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-white/90 hover:text-white transition-colors duration-200">
                    <Linkedin className="h-5 w-5 mr-2" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {portfolioData.personalInfo.github && (
                  <a href={portfolioData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-white/90 hover:text-white transition-colors duration-200">
                    <Github className="h-5 w-5 mr-2" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>

            <div className="p-12">
              {/* Full Portfolio Content */}
              {portfolioData.projects.length > 0 && (
                <section className="mb-16">
                  <h2 className="text-3xl font-bold mb-8" style={{ color: portfolioData.customColors.primary }}>
                    Featured Projects
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolioData.projects.map((project) => (
                      <div key={project.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                        <h3 className="text-xl font-semibold mb-3" style={{ color: portfolioData.customColors.primary }}>
                          {project.title || 'Project Title'}
                        </h3>
                        <p className="text-gray-600 mb-4">{project.description || 'Project description'}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 text-white text-sm rounded-full"
                              style={{ backgroundColor: portfolioData.customColors.accent }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-3">
                          {project.liveUrl && (
                            <a 
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
                              style={{ backgroundColor: portfolioData.customColors.primary }}
                            >
                              Live Demo
                            </a>
                          )}
                          {project.githubUrl && (
                            <a 
                              href={project.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-4 py-2 border-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                              style={{ borderColor: portfolioData.customColors.primary, color: portfolioData.customColors.primary }}
                            >
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {portfolioData.experience.length > 0 && (
                <section className="mb-16">
                  <h2 className="text-3xl font-bold mb-8" style={{ color: portfolioData.customColors.primary }}>
                    Work Experience
                  </h2>
                  <div className="space-y-8">
                    {portfolioData.experience.map((exp) => (
                      <div key={exp.id} className="border-l-4 pl-8" style={{ borderColor: portfolioData.customColors.accent }}>
                        <h3 className="text-xl font-semibold" style={{ color: portfolioData.customColors.primary }}>
                          {exp.title || 'Job Title'}
                        </h3>
                        <p className="text-lg font-medium text-gray-700 mb-1">{exp.company || 'Company Name'}</p>
                        <p className="text-gray-500 mb-3">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                        <p className="text-gray-600 mb-4">{exp.description || 'Job description'}</p>
                        {exp.achievements.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Key Achievements:</h4>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              {exp.achievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {portfolioData.skills.length > 0 && (
                <section className="mb-16">
                  <h2 className="text-3xl font-bold mb-8" style={{ color: portfolioData.customColors.primary }}>
                    Skills & Expertise
                  </h2>
                  
                  {/* Technical Skills */}
                  {portfolioData.skills.filter(skill => skill.category === 'technical').length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4 text-gray-900">Technical Skills</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {portfolioData.skills.filter(skill => skill.category === 'technical').map((skill, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{skill.name}</span>
                              <span className="text-sm text-gray-600">{skill.level}/5</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="h-3 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${(skill.level / 5) * 100}%`,
                                  backgroundColor: portfolioData.customColors.primary
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Soft Skills */}
                  {portfolioData.skills.filter(skill => skill.category === 'soft').length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4 text-gray-900">Soft Skills</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {portfolioData.skills.filter(skill => skill.category === 'soft').map((skill, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{skill.name}</span>
                              <span className="text-sm text-gray-600">{skill.level}/5</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="h-3 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${(skill.level / 5) * 100}%`,
                                  backgroundColor: portfolioData.customColors.secondary
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {portfolioData.skills.filter(skill => skill.category === 'language').length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-900">Languages</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {portfolioData.skills.filter(skill => skill.category === 'language').map((skill, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{skill.name}</span>
                              <span className="text-sm text-gray-600">
                                {skill.level === 1 ? 'Beginner' : 
                                 skill.level === 2 ? 'Elementary' :
                                 skill.level === 3 ? 'Intermediate' :
                                 skill.level === 4 ? 'Advanced' : 'Native'}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="h-3 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${(skill.level / 5) * 100}%`,
                                  backgroundColor: portfolioData.customColors.accent
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {portfolioData.education.length > 0 && (
                <section className="mb-16">
                  <h2 className="text-3xl font-bold mb-8" style={{ color: portfolioData.customColors.primary }}>
                    Education
                  </h2>
                  <div className="space-y-6">
                    {portfolioData.education.map((edu) => (
                      <div key={edu.id} className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-xl font-semibold" style={{ color: portfolioData.customColors.primary }}>
                          {edu.degree || 'Degree'}
                        </h3>
                        <p className="text-lg font-medium text-gray-700">{edu.school || 'School/University'}</p>
                        <p className="text-gray-500">{edu.graduationYear}</p>
                        {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                        {edu.honors && <p className="text-gray-600">{edu.honors}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {portfolioData.certifications.length > 0 && (
                <section className="mb-16">
                  <h2 className="text-3xl font-bold mb-8" style={{ color: portfolioData.customColors.primary }}>
                    Certifications & Awards
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portfolioData.certifications.map((cert) => (
                      <div key={cert.id} className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold" style={{ color: portfolioData.customColors.primary }}>
                          {cert.name || 'Certification Name'}
                        </h3>
                        <p className="font-medium text-gray-700">{cert.issuer || 'Issuing Organization'}</p>
                        <p className="text-gray-500">{cert.date}</p>
                        {cert.credentialUrl && (
                          <a 
                            href={cert.credentialUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center mt-2 text-sm hover:underline"
                            style={{ color: portfolioData.customColors.primary }}
                          >
                            View Credential
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Contact Section */}
              <section className="text-center">
                <h2 className="text-3xl font-bold mb-8" style={{ color: portfolioData.customColors.primary }}>
                  Get In Touch
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Let's work together on your next project!
                </p>
                <div className="flex justify-center space-x-8 flex-wrap">
                  {portfolioData.personalInfo.email && (
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                      <a 
                        href={`mailto:${portfolioData.personalInfo.email}`}
                        className="hover:underline"
                        style={{ color: portfolioData.customColors.primary }}
                      >
                        {portfolioData.personalInfo.email}
                      </a>
                    </div>
                  )}
                  {portfolioData.personalInfo.phone && (
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-2">Phone</h4>
                      <a 
                        href={`tel:${portfolioData.personalInfo.phone}`}
                        className="hover:underline"
                        style={{ color: portfolioData.customColors.primary }}
                      >
                        {portfolioData.personalInfo.phone}
                      </a>
                    </div>
                  )}
                  {portfolioData.personalInfo.location && (
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                      <p className="text-gray-600">{portfolioData.personalInfo.location}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioBuilder;