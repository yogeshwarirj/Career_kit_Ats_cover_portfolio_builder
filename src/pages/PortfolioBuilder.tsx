import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, FileText, Briefcase, GraduationCap, Award, Code, Palette, Globe, Mail, Phone, MapPin, Github, Linkedin, Twitter, Plus, Trash2, Eye, Download, Save, Upload, Target, Sparkles, CheckCircle, Star, Users, Shield, Zap, BookOpen, Trophy, MessageSquare, Settings, Camera, Link as LinkIcon, Calendar, Tag, ExternalLink } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { ResumeUploader } from '../components/ResumeUploader';
import { ParsedResume } from '../lib/resumeParser';
import { portfolioGenerator, PortfolioData } from '../lib/portfolioGenerator';
import { netlifyIntegration } from '../lib/netlifyIntegration';

const PortfolioBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'customize' | 'preview' | 'deploy'>('upload');
  const [activeTab, setActiveTab] = useState('personal');
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'about', name: 'About', icon: FileText },
    { id: 'skills', name: 'Skills', icon: Code },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'certifications', name: 'Certifications', icon: Award },
    { id: 'projects', name: 'Projects', icon: Target },
    { id: 'achievements', name: 'Achievements', icon: Trophy },
    { id: 'blog', name: 'Blog Posts', icon: BookOpen },
    { id: 'contact', name: 'Contact', icon: Mail },
    { id: 'customization', name: 'Design', icon: Palette },
  ];

  const generatePortfolioFromResume = (parsedResume: ParsedResume): PortfolioData => {
    const slug = portfolioGenerator.generateSlug(parsedResume.personalInfo.name || 'portfolio');
    
    const newPortfolioData: PortfolioData = {
      id: Date.now().toString(),
      title: `${parsedResume.personalInfo.name || 'Professional'} Portfolio`,
      slug,
      template: 'modern-professional',
      theme: 'light',
      personalInfo: {
        name: parsedResume.personalInfo.name || '',
        email: parsedResume.personalInfo.email || '',
        phone: parsedResume.personalInfo.phone || '',
        location: parsedResume.personalInfo.location || '',
        website: parsedResume.personalInfo.website || '',
        linkedin: parsedResume.personalInfo.linkedin || '',
        github: '',
        twitter: '',
      },
      sections: {
        about: '',
        experience: parsedResume.experience.map(exp => ({
          id: exp.id,
          title: exp.title,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description,
          current: exp.current
        })),
        projects: [],
        skills: {
          technical: parsedResume.skills.technical || [],
          soft: parsedResume.skills.soft || []
        },
        education: parsedResume.education.map(edu => ({
          id: edu.id,
          degree: edu.degree,
          school: edu.school,
          graduationYear: edu.graduationYear,
          gpa: edu.gpa || ''
        })),
        certifications: parsedResume.certifications.map(cert => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          date: cert.date
        })),
        testimonials: [],
        blogPosts: [],
        achievements: [],
        contact: {
          email: parsedResume.personalInfo.email || '',
          phone: parsedResume.personalInfo.phone || '',
          location: parsedResume.personalInfo.location || '',
          website: parsedResume.personalInfo.website || '',
          linkedin: parsedResume.personalInfo.linkedin || '',
          github: '',
          twitter: ''
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
        darkMode: false
      },
      seo: {
        title: `${parsedResume.personalInfo.name || 'Professional'} - Portfolio`,
        description: `Professional portfolio of ${parsedResume.personalInfo.name || 'a skilled professional'}`,
        keywords: [...(parsedResume.skills.technical || []), ...(parsedResume.skills.soft || [])]
      },
      analytics: {
        googleAnalytics: '',
        facebookPixel: ''
      },
      isPublished: false,
      editCount: 0,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    return newPortfolioData;
  };

  const handleResumeUpload = (parsedResume: ParsedResume) => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const newPortfolioData = generatePortfolioFromResume(parsedResume);
      setPortfolioData(newPortfolioData);
      setCurrentStep('customize');
      setIsGenerating(false);
      toast.success('Portfolio generated from your resume!');
    }, 2000);
  };

  const updatePortfolioData = (updates: Partial<PortfolioData>) => {
    if (portfolioData) {
      setPortfolioData({
        ...portfolioData,
        ...updates,
        lastModified: new Date().toISOString(),
        editCount: portfolioData.editCount + 1
      });
    }
  };

  const updateSection = (sectionName: string, data: any) => {
    if (portfolioData) {
      updatePortfolioData({
        sections: {
          ...portfolioData.sections,
          [sectionName]: data
        }
      });
    }
  };

  const addArrayItem = (sectionName: string, newItem: any) => {
    if (portfolioData) {
      const currentArray = portfolioData.sections[sectionName as keyof typeof portfolioData.sections] as any[];
      updateSection(sectionName, [...currentArray, { ...newItem, id: Date.now().toString() }]);
    }
  };

  const removeArrayItem = (sectionName: string, index: number) => {
    if (portfolioData) {
      const currentArray = portfolioData.sections[sectionName as keyof typeof portfolioData.sections] as any[];
      updateSection(sectionName, currentArray.filter((_, i) => i !== index));
    }
  };

  const updateArrayItem = (sectionName: string, index: number, updates: any) => {
    if (portfolioData) {
      const currentArray = portfolioData.sections[sectionName as keyof typeof portfolioData.sections] as any[];
      const updatedArray = [...currentArray];
      updatedArray[index] = { ...updatedArray[index], ...updates };
      updateSection(sectionName, updatedArray);
    }
  };

  const handleDeploy = async () => {
    if (!portfolioData) return;

    setIsDeploying(true);
    try {
      const deployment = await netlifyIntegration.deployPortfolio(portfolioData);
      setDeploymentUrl(deployment.url);
      updatePortfolioData({ 
        isPublished: true, 
        publishedUrl: deployment.url 
      });
      setCurrentStep('deploy');
      toast.success('Portfolio deployed successfully!');
    } catch (error) {
      toast.error('Failed to deploy portfolio');
    } finally {
      setIsDeploying(false);
    }
  };

  const LivePortfolioPreview: React.FC = () => {
    if (!portfolioData) return null;

    const html = portfolioGenerator.generatePortfolioHTML(portfolioData);
    
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm text-gray-600">{portfolioData.publishedUrl || 'Preview'}</span>
        </div>
        <div className="h-96 overflow-auto">
          <iframe
            srcDoc={html}
            className="w-full h-full border-none"
            title="Portfolio Preview"
          />
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (!portfolioData) return null;

    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={portfolioData.personalInfo.name}
                  onChange={(e) => updatePortfolioData({
                    personalInfo: { ...portfolioData.personalInfo, name: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={portfolioData.personalInfo.email}
                  onChange={(e) => updatePortfolioData({
                    personalInfo: { ...portfolioData.personalInfo, email: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={portfolioData.personalInfo.phone}
                  onChange={(e) => updatePortfolioData({
                    personalInfo: { ...portfolioData.personalInfo, phone: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={portfolioData.personalInfo.location}
                  onChange={(e) => updatePortfolioData({
                    personalInfo: { ...portfolioData.personalInfo, location: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={portfolioData.personalInfo.website}
                  onChange={(e) => updatePortfolioData({
                    personalInfo: { ...portfolioData.personalInfo, website: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://johndoe.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={portfolioData.personalInfo.linkedin}
                  onChange={(e) => updatePortfolioData({
                    personalInfo: { ...portfolioData.personalInfo, linkedin: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                <input
                  type="url"
                  value={portfolioData.personalInfo.github}
                  onChange={(e) => updatePortfolioData({
                    personalInfo: { ...portfolioData.personalInfo, github: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://github.com/johndoe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="url"
                  value={portfolioData.personalInfo.twitter}
                  onChange={(e) => updatePortfolioData({
                    personalInfo: { ...portfolioData.personalInfo, twitter: e.target.value }
                  })}
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
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About Section</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
              <textarea
                rows={8}
                value={portfolioData.sections.about}
                onChange={(e) => updateSection('about', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Write a compelling description about yourself, your background, expertise, and career goals..."
              />
              <p className="text-sm text-gray-500 mt-2">
                {portfolioData.sections.about.length}/500 characters recommended
              </p>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                <textarea
                  rows={4}
                  value={portfolioData.sections.skills.technical.join(', ')}
                  onChange={(e) => updateSection('skills', {
                    ...portfolioData.sections.skills,
                    technical: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="JavaScript, React, Node.js, Python, SQL..."
                />
                <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
                <textarea
                  rows={4}
                  value={portfolioData.sections.skills.soft.join(', ')}
                  onChange={(e) => updateSection('skills', {
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
              <h3 className="text-xl font-semibold text-gray-900">Work Experience</h3>
              <button
                onClick={() => addArrayItem('experience', {
                  title: '',
                  company: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                  current: false
                })}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </button>
            </div>
            <div className="space-y-6">
              {portfolioData.sections.experience.map((exp, index) => (
                <div key={exp.id || index} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Experience {index + 1}</h4>
                    <button
                      onClick={() => removeArrayItem('experience', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateArrayItem('experience', index, { title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateArrayItem('experience', index, { company: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Tech Company Inc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateArrayItem('experience', index, { startDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="January 2020"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => updateArrayItem('experience', index, { endDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Present"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={4}
                      value={exp.description}
                      onChange={(e) => updateArrayItem('experience', index, { description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Describe your key responsibilities and achievements..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Education</h3>
              <button
                onClick={() => addArrayItem('education', {
                  degree: '',
                  school: '',
                  graduationYear: '',
                  gpa: ''
                })}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </button>
            </div>
            <div className="space-y-6">
              {portfolioData.sections.education.map((edu, index) => (
                <div key={edu.id || index} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Education {index + 1}</h4>
                    <button
                      onClick={() => removeArrayItem('education', index)}
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
                        onChange={(e) => updateArrayItem('education', index, { degree: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => updateArrayItem('education', index, { school: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="University of Technology"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                      <input
                        type="text"
                        value={edu.graduationYear}
                        onChange={(e) => updateArrayItem('education', index, { graduationYear: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="2020"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GPA (Optional)</label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => updateArrayItem('education', index, { gpa: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="3.8"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Certifications</h3>
              <button
                onClick={() => addArrayItem('certifications', {
                  name: '',
                  issuer: '',
                  date: ''
                })}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </button>
            </div>
            <div className="space-y-6">
              {portfolioData.sections.certifications.map((cert, index) => (
                <div key={cert.id || index} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Certification {index + 1}</h4>
                    <button
                      onClick={() => removeArrayItem('certifications', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name</label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateArrayItem('certifications', index, { name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="AWS Certified Solutions Architect"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => updateArrayItem('certifications', index, { issuer: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Amazon Web Services"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Obtained</label>
                      <input
                        type="text"
                        value={cert.date}
                        onChange={(e) => updateArrayItem('certifications', index, { date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="March 2023"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Projects Portfolio</h3>
              <button
                onClick={() => addArrayItem('projects', {
                  title: '',
                  description: '',
                  technologies: '',
                  liveUrl: '',
                  githubUrl: '',
                  imageUrl: '',
                  featured: false
                })}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </button>
            </div>
            <div className="space-y-6">
              {portfolioData.sections.projects.map((project, index) => (
                <div key={project.id || index} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Project {index + 1}</h4>
                    <button
                      onClick={() => removeArrayItem('projects', index)}
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
                        onChange={(e) => updateArrayItem('projects', index, { title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="E-commerce Platform"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
                      <input
                        type="text"
                        value={project.technologies}
                        onChange={(e) => updateArrayItem('projects', index, { technologies: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Live Demo URL</label>
                      <input
                        type="url"
                        value={project.liveUrl}
                        onChange={(e) => updateArrayItem('projects', index, { liveUrl: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="https://myproject.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Repository</label>
                      <input
                        type="url"
                        value={project.githubUrl}
                        onChange={(e) => updateArrayItem('projects', index, { githubUrl: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                    <textarea
                      rows={4}
                      value={project.description}
                      onChange={(e) => updateArrayItem('projects', index, { description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Describe your project, its features, and your role in developing it..."
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Image URL (Optional)</label>
                    <input
                      type="url"
                      value={project.imageUrl}
                      onChange={(e) => updateArrayItem('projects', index, { imageUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="https://example.com/project-screenshot.jpg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Achievements & Awards</h3>
              <button
                onClick={() => addArrayItem('achievements', {
                  title: '',
                  description: '',
                  date: '',
                  organization: ''
                })}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Achievement
              </button>
            </div>
            <div className="space-y-6">
              {portfolioData.sections.achievements.map((achievement, index) => (
                <div key={achievement.id || index} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Achievement {index + 1}</h4>
                    <button
                      onClick={() => removeArrayItem('achievements', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Achievement Title</label>
                      <input
                        type="text"
                        value={achievement.title}
                        onChange={(e) => updateArrayItem('achievements', index, { title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Employee of the Year"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                      <input
                        type="text"
                        value={achievement.organization}
                        onChange={(e) => updateArrayItem('achievements', index, { organization: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Tech Company Inc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Received</label>
                      <input
                        type="text"
                        value={achievement.date}
                        onChange={(e) => updateArrayItem('achievements', index, { date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="December 2023"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={3}
                      value={achievement.description}
                      onChange={(e) => updateArrayItem('achievements', index, { description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Describe the achievement and its significance..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Blog Posts</h3>
              <button
                onClick={() => addArrayItem('blogPosts', {
                  title: '',
                  content: '',
                  excerpt: '',
                  date: '',
                  tags: '',
                  url: '',
                  featured: false
                })}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Blog Post
              </button>
            </div>
            <div className="space-y-6">
              {portfolioData.sections.blogPosts.map((post, index) => (
                <div key={post.id || index} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Blog Post {index + 1}</h4>
                    <button
                      onClick={() => removeArrayItem('blogPosts', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
                      <input
                        type="text"
                        value={post.title}
                        onChange={(e) => updateArrayItem('blogPosts', index, { title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="How to Build Better React Apps"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Publication Date</label>
                      <input
                        type="text"
                        value={post.date}
                        onChange={(e) => updateArrayItem('blogPosts', index, { date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="January 15, 2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                      <input
                        type="text"
                        value={post.tags}
                        onChange={(e) => updateArrayItem('blogPosts', index, { tags: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="React, JavaScript, Web Development"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Blog URL</label>
                      <input
                        type="url"
                        value={post.url}
                        onChange={(e) => updateArrayItem('blogPosts', index, { url: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="https://myblog.com/react-tips"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                    <textarea
                      rows={3}
                      value={post.excerpt}
                      onChange={(e) => updateArrayItem('blogPosts', index, { excerpt: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="A brief summary of your blog post..."
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea
                      rows={6}
                      value={post.content}
                      onChange={(e) => updateArrayItem('blogPosts', index, { content: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Write your blog post content here..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={portfolioData.sections.contact.email}
                  onChange={(e) => updateSection('contact', {
                    ...portfolioData.sections.contact,
                    email: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={portfolioData.sections.contact.phone}
                  onChange={(e) => updateSection('contact', {
                    ...portfolioData.sections.contact,
                    phone: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={portfolioData.sections.contact.location}
                  onChange={(e) => updateSection('contact', {
                    ...portfolioData.sections.contact,
                    location: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={portfolioData.sections.contact.website}
                  onChange={(e) => updateSection('contact', {
                    ...portfolioData.sections.contact,
                    website: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://johndoe.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={portfolioData.sections.contact.linkedin}
                  onChange={(e) => updateSection('contact', {
                    ...portfolioData.sections.contact,
                    linkedin: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                <input
                  type="url"
                  value={portfolioData.sections.contact.github}
                  onChange={(e) => updateSection('contact', {
                    ...portfolioData.sections.contact,
                    github: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://github.com/johndoe"
                />
              </div>
            </div>
          </div>
        );

      case 'customization':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Design Customization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Title</label>
                <input
                  type="text"
                  value={portfolioData.title}
                  onChange={(e) => updatePortfolioData({ title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="My Professional Portfolio"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                <input
                  type="text"
                  value={portfolioData.slug}
                  onChange={(e) => updatePortfolioData({ slug: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="john-doe-portfolio"
                />
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Color Scheme</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <input
                    type="color"
                    value={portfolioData.customizations.colors.primary}
                    onChange={(e) => updatePortfolioData({
                      customizations: {
                        ...portfolioData.customizations,
                        colors: {
                          ...portfolioData.customizations.colors,
                          primary: e.target.value
                        }
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
                    onChange={(e) => updatePortfolioData({
                      customizations: {
                        ...portfolioData.customizations,
                        colors: {
                          ...portfolioData.customizations.colors,
                          secondary: e.target.value
                        }
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
                    onChange={(e) => updatePortfolioData({
                      customizations: {
                        ...portfolioData.customizations,
                        colors: {
                          ...portfolioData.customizations.colors,
                          accent: e.target.value
                        }
                      }
                    })}
                    className="w-full h-12 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
                  <input
                    type="text"
                    value={portfolioData.seo.title}
                    onChange={(e) => updatePortfolioData({
                      seo: { ...portfolioData.seo, title: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="John Doe - Professional Portfolio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
                  <textarea
                    rows={3}
                    value={portfolioData.seo.description}
                    onChange={(e) => updatePortfolioData({
                      seo: { ...portfolioData.seo, description: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Professional portfolio showcasing my work and experience..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                  <input
                    type="text"
                    value={portfolioData.seo.keywords.join(', ')}
                    onChange={(e) => updatePortfolioData({
                      seo: {
                        ...portfolioData.seo,
                        keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="web developer, react, javascript, portfolio"
                  />
                </div>
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
                <Globe className="h-8 w-8 text-teal-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Portfolio Builder</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {portfolioData && (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Auto-saved</span>
                </div>
              )}
              <button className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Sign In to Save
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
            {['upload', 'customize', 'preview', 'deploy'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep === step 
                    ? 'bg-teal-600 text-white shadow-lg' 
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
          <div className="flex justify-center mt-4">
            <span className="text-sm text-gray-600 capitalize">
              Step {['upload', 'customize', 'preview', 'deploy'].indexOf(currentStep) + 1}: {
                currentStep === 'upload' ? 'Upload Resume' : 
                currentStep === 'customize' ? 'Customize Portfolio' : 
                currentStep === 'preview' ? 'Preview & Edit' : 
                'Deploy Portfolio'
              }
            </span>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 text-sm font-medium mb-4 animate-fade-in">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                AI-Powered Portfolio Generator
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-[1.15] animate-fade-in-up">
                Create Your Professional{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 animate-gradient-x">
                  Portfolio Website
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.15] animate-fade-in-up delay-200">
                Upload your resume and we'll automatically generate a stunning portfolio website showcasing your skills, experience, and projects
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              {isGenerating ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Globe className="h-12 w-12 text-white animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Generating Your Portfolio</h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Our AI is analyzing your resume and creating a personalized portfolio website...
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4 max-w-md mx-auto">
                    <div className="bg-gradient-to-r from-teal-600 to-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                </div>
              ) : (
                <ResumeUploader 
                  onResumeUploaded={handleResumeUpload}
                  mode="portfolio-builder"
                  className="mb-6"
                />
              )}

              {/* Features Preview */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Professional Design</h3>
                  <p className="text-sm text-gray-600">Beautiful, responsive templates that showcase your work professionally</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">One-Click Deploy</h3>
                  <p className="text-sm text-gray-600">Deploy your portfolio to Netlify with a custom domain in seconds</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">SEO Optimized</h3>
                  <p className="text-sm text-gray-600">Built-in SEO optimization to help you get discovered online</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'customize' && portfolioData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Tab Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Sections</h3>
                
                <div className="space-y-2">
                  {tabs.map((tab, index) => {
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

                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="flex items-center text-sm text-gray-600">
                    <Save className="h-4 w-4 mr-2 text-green-500" />
                    Changes saved automatically
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                {renderTabContent()}
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setCurrentStep('upload')}
                  className="px-6 py-3 text-gray-700 hover:text-teal-600 transition-colors duration-200"
                >
                  ← Back to Upload
                </button>
                
                <button
                  onClick={() => setCurrentStep('preview')}
                  className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  Preview Portfolio
                  <Eye className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'preview' && portfolioData && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Preview Your Portfolio</h2>
              <p className="text-lg text-gray-600">
                Review your portfolio and make any final adjustments before deploying
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Preview */}
              <div className="lg:col-span-2">
                <LivePortfolioPreview />
              </div>

              {/* Actions Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions</h3>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => setCurrentStep('customize')}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Portfolio
                    </button>
                    
                    <button
                      onClick={handleDeploy}
                      disabled={isDeploying}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                    >
                      {isDeploying ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Deploying...
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 mr-2" />
                          Deploy to Web
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Portfolio Stats</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span>Sections:</span>
                        <span>{Object.keys(portfolioData.sections).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Projects:</span>
                        <span>{portfolioData.sections.projects.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Skills:</span>
                        <span>{portfolioData.sections.skills.technical.length + portfolioData.sections.skills.soft.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <span>{portfolioData.sections.experience.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'deploy' && portfolioData && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Portfolio Deployed Successfully!</h2>
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
                    className="text-teal-600 hover:text-teal-700 font-medium text-lg break-all"
                  >
                    {deploymentUrl}
                  </a>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  View Live Portfolio
                </a>
                <button
                  onClick={() => setCurrentStep('customize')}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center"
                >
                  <Settings className="mr-2 h-5 w-5" />
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