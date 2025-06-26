import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, User, FileText, Briefcase, GraduationCap, Award, 
  Code, Trophy, BookOpen, MessageSquare, Mail, Palette, 
  Search, Globe, Plus, Edit3, Trash2, Save, Eye, Download,
  Sparkles, Target, Shield, Zap, CheckCircle, Star, Users,
  Camera, Link as LinkIcon, Calendar, Tag, ExternalLink
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { portfolioGenerator, PortfolioData } from '../lib/portfolioGenerator';
import { netlifyIntegration } from '../lib/netlifyIntegration';

const PortfolioBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'customize' | 'preview' | 'deploy'>('customize');
  const [activeTab, setActiveTab] = useState('personal');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);

  // Initialize empty portfolio data
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    id: Date.now().toString(),
    title: 'My Portfolio',
    slug: '',
    template: 'modern-professional',
    theme: 'light',
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      twitter: ''
    },
    sections: {
      about: '',
      experience: [],
      projects: [],
      skills: {
        technical: [],
        soft: []
      },
      education: [],
      certifications: [],
      testimonials: [],
      blogPosts: [],
      achievements: [],
      contact: {}
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
      darkMode: false
    },
    seo: {
      title: '',
      description: '',
      keywords: []
    },
    analytics: {
      googleAnalytics: '',
      facebookPixel: ''
    },
    isPublished: false,
    editCount: 0,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  });

  // Tab configuration
  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'about', name: 'About', icon: FileText },
    { id: 'skills', name: 'Skills', icon: Code },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'certifications', name: 'Certifications', icon: Award },
    { id: 'projects', name: 'Projects', icon: Trophy },
    { id: 'achievements', name: 'Achievements', icon: Star },
    { id: 'blog', name: 'Blog Posts', icon: BookOpen },
    { id: 'testimonials', name: 'Testimonials', icon: MessageSquare },
    { id: 'contact', name: 'Contact', icon: Mail },
    { id: 'customization', name: 'Design', icon: Palette },
    { id: 'seo', name: 'SEO & Analytics', icon: Search }
  ];

  // Helper functions for array management
  const addArrayItem = (section: keyof PortfolioData['sections'], newItem: any) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: [...(prev.sections[section] as any[]), { ...newItem, id: Date.now().toString() }]
      },
      lastModified: new Date().toISOString()
    }));
  };

  const updateArrayItem = (section: keyof PortfolioData['sections'], index: number, updatedItem: any) => {
    setPortfolioData(prev => {
      const sectionArray = [...(prev.sections[section] as any[])];
      sectionArray[index] = { ...sectionArray[index], ...updatedItem };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [section]: sectionArray
        },
        lastModified: new Date().toISOString()
      };
    });
  };

  const removeArrayItem = (section: keyof PortfolioData['sections'], index: number) => {
    setPortfolioData(prev => {
      const sectionArray = [...(prev.sections[section] as any[])];
      sectionArray.splice(index, 1);
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [section]: sectionArray
        },
        lastModified: new Date().toISOString()
      };
    });
  };

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
      },
      lastModified: new Date().toISOString()
    }));
  };

  const updateSections = (section: keyof PortfolioData['sections'], value: any) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: value
      },
      lastModified: new Date().toISOString()
    }));
  };

  const updateCustomizations = (field: string, value: any) => {
    setPortfolioData(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        [field]: value
      },
      lastModified: new Date().toISOString()
    }));
  };

  const updateSEO = (field: string, value: any) => {
    setPortfolioData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value
      },
      lastModified: new Date().toISOString()
    }));
  };

  const updateAnalytics = (field: string, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        [field]: value
      },
      lastModified: new Date().toISOString()
    }));
  };

  // Generate slug from name
  useEffect(() => {
    if (portfolioData.personalInfo.name && !portfolioData.slug) {
      const slug = portfolioGenerator.generateSlug(portfolioData.personalInfo.name);
      setPortfolioData(prev => ({ ...prev, slug }));
    }
  }, [portfolioData.personalInfo.name]);

  const handleDeploy = async () => {
    if (!portfolioData.personalInfo.name || !portfolioData.personalInfo.email) {
      toast.error('Please fill in your name and email before deploying');
      return;
    }

    setIsDeploying(true);
    try {
      const deployment = await portfolioGenerator.deployToNetlify(portfolioData);
      setDeploymentUrl(deployment.url);
      setCurrentStep('deploy');
      toast.success('Portfolio deployed successfully!');
    } catch (error) {
      toast.error('Failed to deploy portfolio');
    } finally {
      setIsDeploying(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={portfolioData.personalInfo.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={portfolioData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={portfolioData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={portfolioData.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={portfolioData.personalInfo.website}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://johndoe.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={portfolioData.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                <input
                  type="url"
                  value={portfolioData.personalInfo.github}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://github.com/johndoe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="url"
                  value={portfolioData.personalInfo.twitter}
                  onChange={(e) => updatePersonalInfo('twitter', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://twitter.com/johndoe"
                />
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">About Me</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Description</label>
              <textarea
                rows={8}
                value={portfolioData.sections.about}
                onChange={(e) => updateSections('about', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Write a compelling description about yourself, your background, and what you're passionate about..."
              />
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Skills & Expertise</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                <input
                  type="text"
                  value={portfolioData.sections.skills.technical.join(', ')}
                  onChange={(e) => updateSections('skills', {
                    ...portfolioData.sections.skills,
                    technical: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="JavaScript, React, Node.js, Python..."
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
                    soft: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Leadership, Communication, Problem Solving..."
                />
                <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Work Experience</h3>
              <button
                onClick={() => addArrayItem('experience', {
                  title: '',
                  company: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                  current: false
                })}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </button>
            </div>
            
            {portfolioData.sections.experience.map((exp, index) => (
              <div key={exp.id || index} className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={exp.title || ''}
                    onChange={(e) => updateArrayItem('experience', index, { title: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Job Title"
                  />
                  <input
                    type="text"
                    value={exp.company || ''}
                    onChange={(e) => updateArrayItem('experience', index, { company: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Company Name"
                  />
                  <input
                    type="text"
                    value={exp.startDate || ''}
                    onChange={(e) => updateArrayItem('experience', index, { startDate: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Start Date (e.g., Jan 2020)"
                  />
                  <input
                    type="text"
                    value={exp.endDate || ''}
                    onChange={(e) => updateArrayItem('experience', index, { endDate: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="End Date (or Present)"
                  />
                </div>
                <textarea
                  rows={4}
                  value={exp.description || ''}
                  onChange={(e) => updateArrayItem('experience', index, { description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-4"
                  placeholder="Describe your key responsibilities and achievements..."
                />
                <button
                  onClick={() => removeArrayItem('experience', index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </button>
              </div>
            ))}
            
            {portfolioData.sections.experience.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No work experience added yet. Click "Add Experience" to get started.</p>
              </div>
            )}
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Education</h3>
              <button
                onClick={() => addArrayItem('education', {
                  degree: '',
                  school: '',
                  graduationYear: '',
                  gpa: ''
                })}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </button>
            </div>
            
            {portfolioData.sections.education.map((edu, index) => (
              <div key={edu.id || index} className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => updateArrayItem('education', index, { degree: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Degree (e.g., Bachelor of Science)"
                  />
                  <input
                    type="text"
                    value={edu.school || ''}
                    onChange={(e) => updateArrayItem('education', index, { school: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="School/University"
                  />
                  <input
                    type="text"
                    value={edu.graduationYear || ''}
                    onChange={(e) => updateArrayItem('education', index, { graduationYear: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Graduation Year"
                  />
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => updateArrayItem('education', index, { gpa: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="GPA (Optional)"
                  />
                </div>
                <button
                  onClick={() => removeArrayItem('education', index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </button>
              </div>
            ))}
            
            {portfolioData.sections.education.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No education added yet. Click "Add Education" to get started.</p>
              </div>
            )}
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Certifications</h3>
              <button
                onClick={() => addArrayItem('certifications', {
                  name: '',
                  issuer: '',
                  date: ''
                })}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </button>
            </div>
            
            {portfolioData.sections.certifications.map((cert, index) => (
              <div key={cert.id || index} className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    value={cert.name || ''}
                    onChange={(e) => updateArrayItem('certifications', index, { name: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Certification Name"
                  />
                  <input
                    type="text"
                    value={cert.issuer || ''}
                    onChange={(e) => updateArrayItem('certifications', index, { issuer: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Issuing Organization"
                  />
                  <input
                    type="text"
                    value={cert.date || ''}
                    onChange={(e) => updateArrayItem('certifications', index, { date: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Date Obtained"
                  />
                </div>
                <button
                  onClick={() => removeArrayItem('certifications', index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </button>
              </div>
            ))}
            
            {portfolioData.sections.certifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No certifications added yet. Click "Add Certification" to get started.</p>
              </div>
            )}
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Projects</h3>
              <button
                onClick={() => addArrayItem('projects', {
                  title: '',
                  description: '',
                  technologies: '',
                  liveUrl: '',
                  githubUrl: '',
                  imageUrl: ''
                })}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </button>
            </div>
            
            {portfolioData.sections.projects.map((project, index) => (
              <div key={project.id || index} className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={project.title || ''}
                    onChange={(e) => updateArrayItem('projects', index, { title: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Project Title"
                  />
                  <input
                    type="text"
                    value={project.technologies || ''}
                    onChange={(e) => updateArrayItem('projects', index, { technologies: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Technologies (e.g., React, Node.js, MongoDB)"
                  />
                  <input
                    type="url"
                    value={project.liveUrl || ''}
                    onChange={(e) => updateArrayItem('projects', index, { liveUrl: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Live Demo URL"
                  />
                  <input
                    type="url"
                    value={project.githubUrl || ''}
                    onChange={(e) => updateArrayItem('projects', index, { githubUrl: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="GitHub Repository URL"
                  />
                </div>
                <input
                  type="url"
                  value={project.imageUrl || ''}
                  onChange={(e) => updateArrayItem('projects', index, { imageUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-4"
                  placeholder="Project Image URL"
                />
                <textarea
                  rows={4}
                  value={project.description || ''}
                  onChange={(e) => updateArrayItem('projects', index, { description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-4"
                  placeholder="Project description and key features..."
                />
                <button
                  onClick={() => removeArrayItem('projects', index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </button>
              </div>
            ))}
            
            {portfolioData.sections.projects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No projects added yet. Click "Add Project" to get started.</p>
              </div>
            )}
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Achievements & Awards</h3>
              <button
                onClick={() => addArrayItem('achievements', {
                  title: '',
                  organization: '',
                  date: '',
                  description: ''
                })}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Achievement
              </button>
            </div>
            
            {portfolioData.sections.achievements.map((achievement, index) => (
              <div key={achievement.id || index} className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    value={achievement.title || ''}
                    onChange={(e) => updateArrayItem('achievements', index, { title: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Achievement Title"
                  />
                  <input
                    type="text"
                    value={achievement.organization || ''}
                    onChange={(e) => updateArrayItem('achievements', index, { organization: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Organization/Issuer"
                  />
                  <input
                    type="text"
                    value={achievement.date || ''}
                    onChange={(e) => updateArrayItem('achievements', index, { date: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Date Received"
                  />
                </div>
                <textarea
                  rows={3}
                  value={achievement.description || ''}
                  onChange={(e) => updateArrayItem('achievements', index, { description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-4"
                  placeholder="Description of the achievement..."
                />
                <button
                  onClick={() => removeArrayItem('achievements', index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </button>
              </div>
            ))}
            
            {portfolioData.sections.achievements.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No achievements added yet. Click "Add Achievement" to get started.</p>
              </div>
            )}
          </div>
        );

      case 'blog':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Blog Posts</h3>
              <button
                onClick={() => addArrayItem('blogPosts', {
                  title: '',
                  content: '',
                  excerpt: '',
                  tags: '',
                  date: '',
                  imageUrl: '',
                  url: ''
                })}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Blog Post
              </button>
            </div>
            
            {portfolioData.sections.blogPosts.map((post, index) => (
              <div key={post.id || index} className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={post.title || ''}
                    onChange={(e) => updateArrayItem('blogPosts', index, { title: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Blog Post Title"
                  />
                  <input
                    type="text"
                    value={post.date || ''}
                    onChange={(e) => updateArrayItem('blogPosts', index, { date: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Publication Date"
                  />
                  <input
                    type="text"
                    value={post.tags || ''}
                    onChange={(e) => updateArrayItem('blogPosts', index, { tags: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Tags (comma-separated)"
                  />
                  <input
                    type="url"
                    value={post.url || ''}
                    onChange={(e) => updateArrayItem('blogPosts', index, { url: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Blog Post URL"
                  />
                </div>
                <input
                  type="url"
                  value={post.imageUrl || ''}
                  onChange={(e) => updateArrayItem('blogPosts', index, { imageUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-4"
                  placeholder="Featured Image URL"
                />
                <textarea
                  rows={3}
                  value={post.excerpt || ''}
                  onChange={(e) => updateArrayItem('blogPosts', index, { excerpt: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-4"
                  placeholder="Brief excerpt or summary..."
                />
                <textarea
                  rows={6}
                  value={post.content || ''}
                  onChange={(e) => updateArrayItem('blogPosts', index, { content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-4"
                  placeholder="Full blog post content..."
                />
                <button
                  onClick={() => removeArrayItem('blogPosts', index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </button>
              </div>
            ))}
            
            {portfolioData.sections.blogPosts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No blog posts added yet. Click "Add Blog Post" to get started.</p>
              </div>
            )}
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Testimonials</h3>
              <button
                onClick={() => addArrayItem('testimonials', {
                  quote: '',
                  author: '',
                  title: ''
                })}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </button>
            </div>
            
            {portfolioData.sections.testimonials.map((testimonial, index) => (
              <div key={testimonial.id || index} className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={testimonial.author || ''}
                    onChange={(e) => updateArrayItem('testimonials', index, { author: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Author Name"
                  />
                  <input
                    type="text"
                    value={testimonial.title || ''}
                    onChange={(e) => updateArrayItem('testimonials', index, { title: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Author Title/Position"
                  />
                </div>
                <textarea
                  rows={4}
                  value={testimonial.quote || ''}
                  onChange={(e) => updateArrayItem('testimonials', index, { quote: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-4"
                  placeholder="Testimonial quote..."
                />
                <button
                  onClick={() => removeArrayItem('testimonials', index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </button>
              </div>
            ))}
            
            {portfolioData.sections.testimonials.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No testimonials added yet. Click "Add Testimonial" to get started.</p>
              </div>
            )}
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Contact information is automatically pulled from your Personal Info. 
                You can update it in the Personal Info tab.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Mail className="h-5 w-5 text-teal-600 mr-2" />
                  <span className="font-medium">Email</span>
                </div>
                <p className="text-gray-700">{portfolioData.personalInfo.email || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <User className="h-5 w-5 text-teal-600 mr-2" />
                  <span className="font-medium">Phone</span>
                </div>
                <p className="text-gray-700">{portfolioData.personalInfo.phone || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Globe className="h-5 w-5 text-teal-600 mr-2" />
                  <span className="font-medium">Website</span>
                </div>
                <p className="text-gray-700">{portfolioData.personalInfo.website || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <LinkIcon className="h-5 w-5 text-teal-600 mr-2" />
                  <span className="font-medium">LinkedIn</span>
                </div>
                <p className="text-gray-700">{portfolioData.personalInfo.linkedin || 'Not provided'}</p>
              </div>
            </div>
          </div>
        );

      case 'customization':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Design Customization</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <input
                  type="color"
                  value={portfolioData.customizations.colors.primary}
                  onChange={(e) => updateCustomizations('colors', {
                    ...portfolioData.customizations.colors,
                    primary: e.target.value
                  })}
                  className="w-full h-12 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <input
                  type="color"
                  value={portfolioData.customizations.colors.secondary}
                  onChange={(e) => updateCustomizations('colors', {
                    ...portfolioData.customizations.colors,
                    secondary: e.target.value
                  })}
                  className="w-full h-12 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                <input
                  type="color"
                  value={portfolioData.customizations.colors.accent}
                  onChange={(e) => updateCustomizations('colors', {
                    ...portfolioData.customizations.colors,
                    accent: e.target.value
                  })}
                  className="w-full h-12 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Layout Style</label>
                <select
                  value={portfolioData.customizations.layout}
                  onChange={(e) => updateCustomizations('layout', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="modern">Modern</option>
                  <option value="creative">Creative</option>
                  <option value="minimal">Minimal</option>
                  <option value="technical">Technical</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Enable Animations</label>
                  <p className="text-sm text-gray-500">Add smooth transitions and hover effects</p>
                </div>
                <input
                  type="checkbox"
                  checked={portfolioData.customizations.animations}
                  onChange={(e) => updateCustomizations('animations', e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Dark Mode</label>
                  <p className="text-sm text-gray-500">Enable dark theme option</p>
                </div>
                <input
                  type="checkbox"
                  checked={portfolioData.customizations.darkMode}
                  onChange={(e) => updateCustomizations('darkMode', e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );

      case 'seo':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">SEO & Analytics</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
                <input
                  type="text"
                  value={portfolioData.seo.title}
                  onChange={(e) => updateSEO('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Your Name - Professional Portfolio"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
                <textarea
                  rows={3}
                  value={portfolioData.seo.description}
                  onChange={(e) => updateSEO('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Brief description of your portfolio and expertise..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                <input
                  type="text"
                  value={portfolioData.seo.keywords.join(', ')}
                  onChange={(e) => updateSEO('keywords', e.target.value.split(',').map(k => k.trim()).filter(k => k))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="web developer, designer, portfolio, react..."
                />
                <p className="text-sm text-gray-500 mt-1">Separate keywords with commas</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                <input
                  type="text"
                  value={portfolioData.analytics.googleAnalytics || ''}
                  onChange={(e) => updateAnalytics('googleAnalytics', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Pixel ID</label>
                <input
                  type="text"
                  value={portfolioData.analytics.facebookPixel || ''}
                  onChange={(e) => updateAnalytics('facebookPixel', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="123456789012345"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
                <Trophy className="h-8 w-8 text-teal-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Portfolio Builder</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentStep === 'customize' && (
                <button
                  onClick={() => setCurrentStep('preview')}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </button>
              )}
              {currentStep === 'preview' && (
                <button
                  onClick={() => setCurrentStep('customize')}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </button>
              )}
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 flex items-center"
              >
                {isDeploying ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Deploy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'customize' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Tab Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Sections</h3>
                
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 text-left ${
                          activeTab === tab.id
                            ? 'bg-teal-600 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Progress Indicator */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium text-green-600">
                      {Math.round(((portfolioData.personalInfo.name ? 1 : 0) + 
                                  (portfolioData.sections.about ? 1 : 0) + 
                                  (portfolioData.sections.skills.technical.length > 0 ? 1 : 0) + 
                                  (portfolioData.sections.experience.length > 0 ? 1 : 0)) / 4 * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.round(((portfolioData.personalInfo.name ? 1 : 0) + 
                                            (portfolioData.sections.about ? 1 : 0) + 
                                            (portfolioData.sections.skills.technical.length > 0 ? 1 : 0) + 
                                            (portfolioData.sections.experience.length > 0 ? 1 : 0)) / 4 * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                {renderTabContent()}
              </div>
            </div>
          </div>
        )}

        {currentStep === 'preview' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Portfolio Preview</h2>
              <p className="text-lg text-gray-600">See how your portfolio will look to visitors</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div 
                className="p-8"
                dangerouslySetInnerHTML={{ 
                  __html: portfolioGenerator.generatePortfolioHTML(portfolioData) 
                }}
              />
            </div>
          </div>
        )}

        {currentStep === 'deploy' && deploymentUrl && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Portfolio Deployed Successfully!</h2>
              <p className="text-lg text-gray-600 mb-8">
                Your portfolio is now live and accessible to the world.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-600 mb-2">Your portfolio URL:</p>
                <a 
                  href={deploymentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 font-medium text-lg break-all"
                >
                  {deploymentUrl}
                </a>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  View Live Portfolio
                </a>
                <button
                  onClick={() => setCurrentStep('customize')}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
                >
                  <Edit3 className="mr-2 h-5 w-5" />
                  Continue Editing
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