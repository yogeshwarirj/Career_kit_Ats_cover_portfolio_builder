import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, User, Briefcase, Palette, Eye, Download, Share2, Settings, Crown, Zap, Shield, CheckCircle, Star, Award, Users, Target, Edit3, Layout, BookOpen, Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Sparkles, ArrowRight, Play, Code, Monitor, Smartphone, Plus, Calendar, ExternalLink, Image, Tag, Trophy, Camera, Link as LinkIcon, Save, X, Search, BarChart, Copy } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { ResumeUploader } from '../components/ResumeUploader';
import { ParsedResume } from '../lib/resumeParser';

interface PersonalInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  bio: string;
  profileImage: string;
  website: string;
  linkedin: string;
  github: string;
  twitter: string;
  instagram: string;
  behance: string;
  dribbble: string;
}

interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'tool';
  proficiency: number; // 1-100
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  verificationUrl?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  duration: string;
  role: string;
  responsibilities: string[];
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishDate: string;
  featuredImage: string;
  readTime: number;
  published: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  organization: string;
  category: string;
  images: string[];
  verificationUrl?: string;
}

interface ContactPreferences {
  preferredMethod: 'email' | 'phone' | 'form';
  availability: string;
  responseTime: string;
  languages: string[];
}

interface TemplateSettings {
  templateId: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: 'small' | 'medium' | 'large';
  };
  layout: 'minimal' | 'creative' | 'corporate' | 'modern';
  animations: boolean;
  darkMode: boolean;
}

interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  customDomain: string;
  urlFormat: string;
}

interface PortfolioData {
  id: string;
  personalInfo: PersonalInfo;
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  blogPosts: BlogPost[];
  achievements: Achievement[];
  contactPreferences: ContactPreferences;
  templateSettings: TemplateSettings;
  seoSettings: SEOSettings;
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  isPublished: boolean;
  publishedUrl?: string;
  createdAt: string;
  lastModified: string;
}

const PortfolioBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'personal' | 'skills' | 'projects' | 'blog' | 'achievements' | 'template' | 'settings' | 'preview' | 'publish'>('upload');
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    id: Date.now().toString(),
    personalInfo: {
      fullName: '',
      professionalTitle: '',
      email: '',
      phone: '',
      location: '',
      timezone: '',
      bio: '',
      profileImage: '',
      website: '',
      linkedin: '',
      github: '',
      twitter: '',
      instagram: '',
      behance: '',
      dribbble: ''
    },
    skills: [],
    certifications: [],
    projects: [],
    blogPosts: [],
    achievements: [],
    contactPreferences: {
      preferredMethod: 'email',
      availability: 'Monday to Friday, 9 AM - 5 PM',
      responseTime: 'Within 24 hours',
      languages: ['English']
    },
    templateSettings: {
      templateId: 'modern-professional',
      colorScheme: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#0ea5e9',
        background: '#ffffff',
        text: '#1f2937'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: 'medium'
      },
      layout: 'modern',
      animations: true,
      darkMode: false
    },
    seoSettings: {
      title: '',
      description: '',
      keywords: [],
      ogImage: '',
      customDomain: '',
      urlFormat: ''
    },
    analytics: {},
    isPublished: false,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  });

  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handleResumeUpload = (parsedResume: ParsedResume) => {
    setResumeData(parsedResume);
    
    // Auto-populate portfolio data from resume
    setPortfolioData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        fullName: parsedResume.personalInfo.name,
        email: parsedResume.personalInfo.email,
        phone: parsedResume.personalInfo.phone,
        location: parsedResume.personalInfo.location,
        website: parsedResume.personalInfo.website || '',
        linkedin: parsedResume.personalInfo.linkedin || ''
      },
      skills: [
        ...parsedResume.skills.technical.map((skill, index) => ({
          id: `tech-${index}`,
          name: skill,
          category: 'technical' as const,
          proficiency: 80
        })),
        ...parsedResume.skills.soft.map((skill, index) => ({
          id: `soft-${index}`,
          name: skill,
          category: 'soft' as const,
          proficiency: 75
        }))
      ],
      certifications: parsedResume.certifications.map(cert => ({
        id: cert.id,
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date
      })),
      seoSettings: {
        ...prev.seoSettings,
        title: `${parsedResume.personalInfo.name} - Professional Portfolio`,
        description: `Professional portfolio of ${parsedResume.personalInfo.name}`,
        urlFormat: parsedResume.personalInfo.name.toLowerCase().replace(/\s+/g, '-') + '-portfolio'
      }
    }));
    
    toast.success('Resume uploaded and data extracted successfully!');
    setCurrentStep('personal');
  };

  const updatePortfolioData = (section: keyof PortfolioData, data: any) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: data,
      lastModified: new Date().toISOString()
    }));
  };

  const addItem = (section: 'skills' | 'projects' | 'blogPosts' | 'achievements' | 'certifications', item: any) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: [...prev[section], { ...item, id: Date.now().toString() }],
      lastModified: new Date().toISOString()
    }));
  };

  const removeItem = (section: 'skills' | 'projects' | 'blogPosts' | 'achievements' | 'certifications', id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: prev[section].filter((item: any) => item.id !== id),
      lastModified: new Date().toISOString()
    }));
  };

  const updateItem = (section: 'skills' | 'projects' | 'blogPosts' | 'achievements' | 'certifications', id: string, updates: any) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: prev[section].map((item: any) => 
        item.id === id ? { ...item, ...updates } : item
      ),
      lastModified: new Date().toISOString()
    }));
  };

  const steps = [
    { id: 'upload', label: 'Upload Resume', icon: Upload },
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'skills', label: 'Skills & Certs', icon: Award },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'blog', label: 'Blog Posts', icon: BookOpen },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'template', label: 'Template', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'publish', label: 'Publish', icon: Share2 }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

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
              <button 
                onClick={() => {
                  localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
                  toast.success('Portfolio saved locally!');
                }}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </button>
              <button className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 cursor-pointer ${
                    currentStep === step.id 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : index < currentStepIndex
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  onClick={() => setCurrentStep(step.id as any)}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-1 mx-1 transition-all duration-300 ${
                    index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex]?.label}
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
                Upload your resume to get started, or skip to create your portfolio from scratch
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <ResumeUploader 
                onResumeUploaded={handleResumeUpload}
                className="mb-6"
              />

              <div className="text-center mt-8">
                <div className="flex items-center justify-center space-x-4">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  <span className="text-gray-500 text-sm">OR</span>
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>
                
                <button
                  onClick={() => setCurrentStep('personal')}
                  className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                >
                  Start from Scratch
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'personal' && (
          <PersonalInfoStep 
            data={portfolioData.personalInfo}
            onChange={(data) => updatePortfolioData('personalInfo', data)}
            onNext={() => setCurrentStep('skills')}
            onBack={() => setCurrentStep('upload')}
          />
        )}

        {currentStep === 'skills' && (
          <SkillsStep 
            skills={portfolioData.skills}
            certifications={portfolioData.certifications}
            onUpdateSkills={(skills) => updatePortfolioData('skills', skills)}
            onUpdateCertifications={(certs) => updatePortfolioData('certifications', certs)}
            onNext={() => setCurrentStep('projects')}
            onBack={() => setCurrentStep('personal')}
          />
        )}

        {currentStep === 'projects' && (
          <ProjectsStep 
            projects={portfolioData.projects}
            onUpdateProjects={(projects) => updatePortfolioData('projects', projects)}
            onNext={() => setCurrentStep('blog')}
            onBack={() => setCurrentStep('skills')}
          />
        )}

        {currentStep === 'blog' && (
          <BlogStep 
            blogPosts={portfolioData.blogPosts}
            onUpdateBlogPosts={(posts) => updatePortfolioData('blogPosts', posts)}
            onNext={() => setCurrentStep('achievements')}
            onBack={() => setCurrentStep('projects')}
          />
        )}

        {currentStep === 'achievements' && (
          <AchievementsStep 
            achievements={portfolioData.achievements}
            onUpdateAchievements={(achievements) => updatePortfolioData('achievements', achievements)}
            onNext={() => setCurrentStep('template')}
            onBack={() => setCurrentStep('blog')}
          />
        )}

        {currentStep === 'template' && (
          <TemplateStep 
            settings={portfolioData.templateSettings}
            onUpdateSettings={(settings) => updatePortfolioData('templateSettings', settings)}
            onNext={() => setCurrentStep('settings')}
            onBack={() => setCurrentStep('achievements')}
          />
        )}

        {currentStep === 'settings' && (
          <SettingsStep 
            seoSettings={portfolioData.seoSettings}
            contactPreferences={portfolioData.contactPreferences}
            analytics={portfolioData.analytics}
            onUpdateSEO={(seo) => updatePortfolioData('seoSettings', seo)}
            onUpdateContact={(contact) => updatePortfolioData('contactPreferences', contact)}
            onUpdateAnalytics={(analytics) => updatePortfolioData('analytics', analytics)}
            onNext={() => setCurrentStep('preview')}
            onBack={() => setCurrentStep('template')}
          />
        )}

        {currentStep === 'preview' && (
          <PreviewStep 
            portfolioData={portfolioData}
            previewMode={previewMode}
            onChangePreviewMode={setPreviewMode}
            onNext={() => setCurrentStep('publish')}
            onBack={() => setCurrentStep('settings')}
          />
        )}

        {currentStep === 'publish' && (
          <PublishStep 
            portfolioData={portfolioData}
            onUpdatePortfolio={(data) => setPortfolioData(data)}
            onBack={() => setCurrentStep('preview')}
          />
        )}
      </div>
    </div>
  );
};

// Personal Information Step Component
const PersonalInfoStep: React.FC<{
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onChange, onNext, onBack }) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Personal Information</h2>
        <p className="text-lg text-gray-600">Tell us about yourself and your professional background</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2 text-purple-600" />
              Basic Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={data.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title *</label>
              <input
                type="text"
                value={data.professionalTitle}
                onChange={(e) => handleChange('professionalTitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Senior Software Engineer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Email *</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location/City</label>
              <input
                type="text"
                value={data.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={data.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Timezone</option>
                <option value="PST">Pacific Standard Time (PST)</option>
                <option value="MST">Mountain Standard Time (MST)</option>
                <option value="CST">Central Standard Time (CST)</option>
                <option value="EST">Eastern Standard Time (EST)</option>
                <option value="GMT">Greenwich Mean Time (GMT)</option>
                <option value="CET">Central European Time (CET)</option>
                <option value="JST">Japan Standard Time (JST)</option>
              </select>
            </div>
          </div>

          {/* Bio and Social Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-600" />
              Bio & Social Links
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Bio (200-300 words) *
              </label>
              <textarea
                rows={8}
                value={data.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Write a compelling bio highlighting your background, expertise, and career goals..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {data.bio.length}/300 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
              <input
                type="url"
                value={data.profileImage}
                onChange={(e) => handleChange('profileImage', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/profile.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={data.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://johndoe.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={data.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                <input
                  type="url"
                  value={data.github}
                  onChange={(e) => handleChange('github', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://github.com/johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="url"
                  value={data.twitter}
                  onChange={(e) => handleChange('twitter', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://twitter.com/johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  value={data.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://instagram.com/johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Behance</label>
                <input
                  type="url"
                  value={data.behance}
                  onChange={(e) => handleChange('behance', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://behance.net/johndoe"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 text-gray-700 hover:text-purple-600 transition-colors duration-200"
          >
            ← Back
          </button>
          
          <button
            onClick={onNext}
            disabled={!data.fullName || !data.professionalTitle || !data.email || !data.bio}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Continue to Skills
          </button>
        </div>
      </div>
    </div>
  );
};

// Skills Step Component
const SkillsStep: React.FC<{
  skills: Skill[];
  certifications: Certification[];
  onUpdateSkills: (skills: Skill[]) => void;
  onUpdateCertifications: (certs: Certification[]) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ skills, certifications, onUpdateSkills, onUpdateCertifications, onNext, onBack }) => {
  const [newSkill, setNewSkill] = useState({ name: '', category: 'technical' as const, proficiency: 80 });
  const [newCert, setNewCert] = useState({ name: '', issuer: '', date: '', credentialId: '', verificationUrl: '' });

  const addSkill = () => {
    if (newSkill.name.trim()) {
      onUpdateSkills([...skills, { ...newSkill, id: Date.now().toString() }]);
      setNewSkill({ name: '', category: 'technical', proficiency: 80 });
    }
  };

  const addCertification = () => {
    if (newCert.name.trim() && newCert.issuer.trim()) {
      onUpdateCertifications([...certifications, { ...newCert, id: Date.now().toString() }]);
      setNewCert({ name: '', issuer: '', date: '', credentialId: '', verificationUrl: '' });
    }
  };

  const removeSkill = (id: string) => {
    onUpdateSkills(skills.filter(skill => skill.id !== id));
  };

  const removeCertification = (id: string) => {
    onUpdateCertifications(certifications.filter(cert => cert.id !== id));
  };

  const updateSkillProficiency = (id: string, proficiency: number) => {
    onUpdateSkills(skills.map(skill => 
      skill.id === id ? { ...skill, proficiency } : skill
    ));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Skills & Certifications</h2>
        <p className="text-lg text-gray-600">Showcase your technical skills, soft skills, and professional certifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-purple-600" />
            Skills & Expertise
          </h3>

          {/* Add New Skill */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Add New Skill</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Skill name"
              />
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as any })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="technical">Technical</option>
                <option value="soft">Soft Skill</option>
                <option value="tool">Tool/Software</option>
              </select>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={newSkill.proficiency}
                  onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-12">{newSkill.proficiency}%</span>
              </div>
            </div>
            <button
              onClick={addSkill}
              className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Add Skill
            </button>
          </div>

          {/* Skills List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {skills.map((skill) => (
              <div key={skill.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className="font-medium text-gray-900">{skill.name}</h5>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      skill.category === 'technical' ? 'bg-blue-100 text-blue-800' :
                      skill.category === 'soft' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {skill.category}
                    </span>
                  </div>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={skill.proficiency}
                    onChange={(e) => updateSkillProficiency(skill.id, parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-12">{skill.proficiency}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Award className="h-5 w-5 mr-2 text-purple-600" />
            Certifications
          </h3>

          {/* Add New Certification */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Add New Certification</h4>
            <div className="space-y-3">
              <input
                type="text"
                value={newCert.name}
                onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Certification name"
              />
              <input
                type="text"
                value={newCert.issuer}
                onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Issuing organization"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="date"
                  value={newCert.date}
                  onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={newCert.credentialId}
                  onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Credential ID (optional)"
                />
              </div>
              <input
                type="url"
                value={newCert.verificationUrl}
                onChange={(e) => setNewCert({ ...newCert, verificationUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Verification URL (optional)"
              />
            </div>
            <button
              onClick={addCertification}
              className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Add Certification
            </button>
          </div>

          {/* Certifications List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {certifications.map((cert) => (
              <div key={cert.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{cert.name}</h5>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">{cert.date}</p>
                    {cert.credentialId && (
                      <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
                    )}
                    {cert.verificationUrl && (
                      <a 
                        href={cert.verificationUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-purple-600 hover:text-purple-700 flex items-center mt-1"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Verify
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => removeCertification(cert.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 hover:text-purple-600 transition-colors duration-200"
        >
          ← Back
        </button>
        
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
        >
          Continue to Projects
        </button>
      </div>
    </div>
  );
};

// Projects Step Component
const ProjectsStep: React.FC<{
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ projects, onUpdateProjects, onNext, onBack }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    technologies: [],
    duration: '',
    role: '',
    responsibilities: [],
    images: [],
    category: '',
    featured: false,
    status: 'completed'
  });

  const addProject = () => {
    if (newProject.title && newProject.description) {
      onUpdateProjects([...projects, { ...newProject, id: Date.now().toString() } as Project]);
      setNewProject({
        title: '',
        description: '',
        technologies: [],
        duration: '',
        role: '',
        responsibilities: [],
        images: [],
        category: '',
        featured: false,
        status: 'completed'
      });
      setShowAddForm(false);
    }
  };

  const removeProject = (id: string) => {
    onUpdateProjects(projects.filter(project => project.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Projects Portfolio</h2>
        <p className="text-lg text-gray-600">Showcase your best work and projects</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Code className="h-5 w-5 mr-2 text-purple-600" />
            Your Projects
          </h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </button>
        </div>

        {/* Add Project Form */}
        {showAddForm && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-4">Add New Project</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="E-commerce Platform"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Web Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
                <input
                  type="text"
                  value={newProject.role}
                  onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Full Stack Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={newProject.duration}
                  onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="3 months"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  rows={4}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe your project, its goals, and impact..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={newProject.technologies?.join(', ')}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value.split(',').map(t => t.trim()) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Live Demo URL</label>
                <input
                  type="url"
                  value={newProject.liveUrl}
                  onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://project-demo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Repository</label>
                <input
                  type="url"
                  value={newProject.githubUrl}
                  onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://github.com/username/project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="planned">Planned</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newProject.featured}
                  onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Featured Project</label>
              </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={addProject}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Add Project
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    {project.title}
                    {project.featured && <Star className="h-4 w-4 text-yellow-500 ml-2" />}
                  </h4>
                  <p className="text-sm text-gray-600">{project.category} • {project.duration}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <button
                  onClick={() => removeProject(project.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-700 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies.slice(0, 3).map((tech, index) => (
                  <span key={index} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-600 hover:text-purple-700 flex items-center"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-600 hover:text-gray-700 flex items-center"
                  >
                    <Github className="h-3 w-3 mr-1" />
                    Code
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-4">Add your first project to showcase your work</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Add Your First Project
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 hover:text-purple-600 transition-colors duration-200"
        >
          ← Back
        </button>
        
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
        >
          Continue to Blog
        </button>
      </div>
    </div>
  );
};

// Blog Step Component
const BlogStep: React.FC<{
  blogPosts: BlogPost[];
  onUpdateBlogPosts: (posts: BlogPost[]) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ blogPosts, onUpdateBlogPosts, onNext, onBack }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    publishDate: new Date().toISOString().split('T')[0],
    featuredImage: '',
    readTime: 5,
    published: true
  });

  const addPost = () => {
    if (newPost.title && newPost.content) {
      onUpdateBlogPosts([...blogPosts, { ...newPost, id: Date.now().toString() } as BlogPost]);
      setNewPost({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: [],
        publishDate: new Date().toISOString().split('T')[0],
        featuredImage: '',
        readTime: 5,
        published: true
      });
      setShowAddForm(false);
    }
  };

  const removePost = (id: string) => {
    onUpdateBlogPosts(blogPosts.filter(post => post.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Blog Posts</h2>
        <p className="text-lg text-gray-600">Share your thoughts, insights, and expertise through blog posts</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
            Your Blog Posts
          </h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Blog Post
          </button>
        </div>

        {/* Add Blog Post Form */}
        {showAddForm && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-4">Add New Blog Post</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="How to Build Better Web Applications"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Technology"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <textarea
                  rows={2}
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="A brief summary of your blog post..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  rows={8}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Write your blog post content here..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newPost.tags?.join(', ')}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value.split(',').map(t => t.trim()) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="react, javascript, web"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
                  <input
                    type="date"
                    value={newPost.publishDate}
                    onChange={(e) => setNewPost({ ...newPost, publishDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Read Time (minutes)</label>
                  <input
                    type="number"
                    value={newPost.readTime}
                    onChange={(e) => setNewPost({ ...newPost, readTime: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
                <input
                  type="url"
                  value={newPost.featuredImage}
                  onChange={(e) => setNewPost({ ...newPost, featuredImage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newPost.published}
                  onChange={(e) => setNewPost({ ...newPost, published: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Published</label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <button
                onClick={addPost}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Add Post
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Blog Posts List */}
        <div className="space-y-4">
          {blogPosts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{post.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{post.category}</span>
                    <span>{post.readTime} min read</span>
                    <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => removePost(post.id)}
                  className="text-red-600 hover:text-red-700 ml-4"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {blogPosts.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600 mb-4">Share your knowledge and insights with the world</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Write Your First Post
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 hover:text-purple-600 transition-colors duration-200"
        >
          ← Back
        </button>
        
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
        >
          Continue to Achievements
        </button>
      </div>
    </div>
  );
};

// Achievements Step Component
const AchievementsStep: React.FC<{
  achievements: Achievement[];
  onUpdateAchievements: (achievements: Achievement[]) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ achievements, onUpdateAchievements, onNext, onBack }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Partial<Achievement>>({
    title: '',
    description: '',
    date: '',
    organization: '',
    category: '',
    images: [],
    verificationUrl: ''
  });

  const addAchievement = () => {
    if (newAchievement.title && newAchievement.description) {
      onUpdateAchievements([...achievements, { ...newAchievement, id: Date.now().toString() } as Achievement]);
      setNewAchievement({
        title: '',
        description: '',
        date: '',
        organization: '',
        category: '',
        images: [],
        verificationUrl: ''
      });
      setShowAddForm(false);
    }
  };

  const removeAchievement = (id: string) => {
    onUpdateAchievements(achievements.filter(achievement => achievement.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Achievements & Recognition</h2>
        <p className="text-lg text-gray-600">Highlight your awards, recognitions, and notable accomplishments</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-purple-600" />
            Your Achievements
          </h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </button>
        </div>

        {/* Add Achievement Form */}
        {showAddForm && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-4">Add New Achievement</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Achievement Title *</label>
                  <input
                    type="text"
                    value={newAchievement.title}
                    onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Best Developer Award 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={newAchievement.category}
                    onChange={(e) => setNewAchievement({ ...newAchievement, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Professional Award"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  rows={4}
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe the achievement, its significance, and impact..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
                  <input
                    type="text"
                    value={newAchievement.organization}
                    onChange={(e) => setNewAchievement({ ...newAchievement, organization: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tech Company Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Received</label>
                  <input
                    type="date"
                    value={newAchievement.date}
                    onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification URL</label>
                <input
                  type="url"
                  value={newAchievement.verificationUrl}
                  onChange={(e) => setNewAchievement({ ...newAchievement, verificationUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/verification"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <button
                onClick={addAchievement}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Add Achievement
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Achievements List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.organization}</p>
                  <p className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                  {achievement.category && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full mt-1 inline-block">
                      {achievement.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeAchievement(achievement.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-700 mb-3">{achievement.description}</p>
              {achievement.verificationUrl && (
                <a
                  href={achievement.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-600 hover:text-purple-700 flex items-center"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Verify
                </a>
              )}
            </div>
          ))}
        </div>

        {achievements.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h3>
            <p className="text-gray-600 mb-4">Showcase your awards and recognitions</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Add Your First Achievement
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 hover:text-purple-600 transition-colors duration-200"
        >
          ← Back
        </button>
        
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
        >
          Continue to Template
        </button>
      </div>
    </div>
  );
};

// Template Step Component
const TemplateStep: React.FC<{
  settings: TemplateSettings;
  onUpdateSettings: (settings: TemplateSettings) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ settings, onUpdateSettings, onNext, onBack }) => {
  const templates = [
    { id: 'minimal', name: 'Minimal', description: 'Clean and simple design' },
    { id: 'creative', name: 'Creative', description: 'Bold and artistic layout' },
    { id: 'corporate', name: 'Corporate', description: 'Professional business style' },
    { id: 'modern', name: 'Modern', description: 'Contemporary and sleek' }
  ];

  const updateSettings = (updates: Partial<TemplateSettings>) => {
    onUpdateSettings({ ...settings, ...updates });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Template & Design</h2>
        <p className="text-lg text-gray-600">Choose your template and customize the design</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Template Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Layout className="h-5 w-5 mr-2 text-purple-600" />
            Template Selection
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => updateSettings({ templateId: template.id })}
                className={`cursor-pointer p-4 border-2 rounded-lg transition-all duration-200 ${
                  settings.templateId === template.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Layout Options</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.animations}
                  onChange={(e) => updateSettings({ animations: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Enable animations</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => updateSettings({ darkMode: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Dark mode support</span>
              </label>
            </div>
          </div>
        </div>

        {/* Color & Typography */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Palette className="h-5 w-5 mr-2 text-purple-600" />
            Colors & Typography
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Color Scheme</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Primary Color</label>
                  <input
                    type="color"
                    value={settings.colorScheme.primary}
                    onChange={(e) => updateSettings({
                      colorScheme: { ...settings.colorScheme, primary: e.target.value }
                    })}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Secondary Color</label>
                  <input
                    type="color"
                    value={settings.colorScheme.secondary}
                    onChange={(e) => updateSettings({
                      colorScheme: { ...settings.colorScheme, secondary: e.target.value }
                    })}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Accent Color</label>
                  <input
                    type="color"
                    value={settings.colorScheme.accent}
                    onChange={(e) => updateSettings({
                      colorScheme: { ...settings.colorScheme, accent: e.target.value }
                    })}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Background</label>
                  <input
                    type="color"
                    value={settings.colorScheme.background}
                    onChange={(e) => updateSettings({
                      colorScheme: { ...settings.colorScheme, background: e.target.value }
                    })}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Typography</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Heading Font</label>
                  <select
                    value={settings.typography.headingFont}
                    onChange={(e) => updateSettings({
                      typography: { ...settings.typography, headingFont: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Body Font</label>
                  <select
                    value={settings.typography.bodyFont}
                    onChange={(e) => updateSettings({
                      typography: { ...settings.typography, bodyFont: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Source Sans Pro">Source Sans Pro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Font Size</label>
                  <select
                    value={settings.typography.fontSize}
                    onChange={(e) => updateSettings({
                      typography: { ...settings.typography, fontSize: e.target.value as any }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 hover:text-purple-600 transition-colors duration-200"
        >
          ← Back
        </button>
        
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
        >
          Continue to Settings
        </button>
      </div>
    </div>
  );
};

// Settings Step Component
const SettingsStep: React.FC<{
  seoSettings: SEOSettings;
  contactPreferences: ContactPreferences;
  analytics: { googleAnalyticsId?: string; facebookPixelId?: string; };
  onUpdateSEO: (settings: SEOSettings) => void;
  onUpdateContact: (preferences: ContactPreferences) => void;
  onUpdateAnalytics: (analytics: { googleAnalyticsId?: string; facebookPixelId?: string; }) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ seoSettings, contactPreferences, analytics, onUpdateSEO, onUpdateContact, onUpdateAnalytics, onNext, onBack }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Website Settings</h2>
        <p className="text-lg text-gray-600">Configure SEO, contact preferences, and analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SEO Settings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Search className="h-5 w-5 mr-2 text-purple-600" />
            SEO Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website Title</label>
              <input
                type="text"
                value={seoSettings.title}
                onChange={(e) => onUpdateSEO({ ...seoSettings, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="John Doe - Web Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <textarea
                rows={3}
                value={seoSettings.description}
                onChange={(e) => onUpdateSEO({ ...seoSettings, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Professional portfolio of John Doe, a web developer specializing in React and Node.js"
              />
              <p className="text-xs text-gray-500 mt-1">
                {seoSettings.description.length}/160 characters (recommended)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (comma-separated)</label>
              <input
                type="text"
                value={seoSettings.keywords.join(', ')}
                onChange={(e) => onUpdateSEO({ ...seoSettings, keywords: e.target.value.split(',').map(k => k.trim()) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="web developer, react, javascript, portfolio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Domain</label>
              <input
                type="text"
                value={seoSettings.customDomain}
                onChange={(e) => onUpdateSEO({ ...seoSettings, customDomain: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="www.johndoe.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to use the default Netlify subdomain
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL Format</label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">https://</span>
                <input
                  type="text"
                  value={seoSettings.urlFormat}
                  onChange={(e) => onUpdateSEO({ ...seoSettings, urlFormat: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="john-doe-portfolio"
                />
                <span className="text-gray-500 ml-2">.netlify.app</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Analytics */}
        <div className="space-y-8">
          {/* Contact Preferences */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-purple-600" />
              Contact Preferences
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                <select
                  value={contactPreferences.preferredMethod}
                  onChange={(e) => onUpdateContact({ ...contactPreferences, preferredMethod: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="form">Contact Form</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <input
                  type="text"
                  value={contactPreferences.availability}
                  onChange={(e) => onUpdateContact({ ...contactPreferences, availability: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Monday to Friday, 9 AM - 5 PM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
                <input
                  type="text"
                  value={contactPreferences.responseTime}
                  onChange={(e) => onUpdateContact({ ...contactPreferences, responseTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Within 24 hours"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Languages (comma-separated)</label>
                <input
                  type="text"
                  value={contactPreferences.languages.join(', ')}
                  onChange={(e) => onUpdateContact({ ...contactPreferences, languages: e.target.value.split(',').map(l => l.trim()) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="English, Spanish"
                />
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-purple-600" />
              Analytics (Optional)
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                <input
                  type="text"
                  value={analytics.googleAnalyticsId || ''}
                  onChange={(e) => onUpdateAnalytics({ ...analytics, googleAnalyticsId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Pixel ID</label>
                <input
                  type="text"
                  value={analytics.facebookPixelId || ''}
                  onChange={(e) => onUpdateAnalytics({ ...analytics, facebookPixelId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="XXXXXXXXXXXXXXXXXX"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 hover:text-purple-600 transition-colors duration-200"
        >
          ← Back
        </button>
        
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
        >
          Continue to Preview
        </button>
      </div>
    </div>
  );
};

// Preview Step Component
const PreviewStep: React.FC<{
  portfolioData: PortfolioData;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  onChangePreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ portfolioData, previewMode, onChangePreviewMode, onNext, onBack }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Preview Your Portfolio</h2>
        <p className="text-lg text-gray-600">See how your portfolio will look to visitors</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Eye className="h-5 w-5 mr-2 text-purple-600" />
            Live Preview
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onChangePreviewMode('desktop')}
              className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => onChangePreviewMode('tablet')}
              className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <Smartphone className="h-4 w-4 rotate-90" />
            </button>
            <button
              onClick={() => onChangePreviewMode('mobile')}
              className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Preview Container */}
        <div className={`border border-gray-300 rounded-lg overflow-hidden mx-auto ${
          previewMode === 'desktop' ? 'w-full' :
          previewMode === 'tablet' ? 'w-3/4' :
          'w-1/3'
        }`}>
          <div className="bg-gray-200 p-2 flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="flex-1 bg-white rounded-md px-2 py-1 text-xs text-gray-500 text-center">
              {portfolioData.seoSettings.customDomain || `${portfolioData.seoSettings.urlFormat || 'your-portfolio'}.netlify.app`}
            </div>
          </div>

          <div className="h-[600px] overflow-y-auto" style={{ backgroundColor: portfolioData.templateSettings.colorScheme.background }}>
            {/* Hero Section */}
            <div 
              className="p-8 text-center"
              style={{ 
                backgroundColor: portfolioData.templateSettings.colorScheme.primary,
                color: '#ffffff'
              }}
            >
              {portfolioData.personalInfo.profileImage && (
                <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-white p-1">
                  <div 
                    className="w-full h-full rounded-full bg-center bg-cover"
                    style={{ backgroundImage: `url(${portfolioData.personalInfo.profileImage})` }}
                  ></div>
                </div>
              )}
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: portfolioData.templateSettings.typography.headingFont }}>
                {portfolioData.personalInfo.fullName || 'Your Name'}
              </h1>
              <p className="text-xl opacity-90 mb-4">{portfolioData.personalInfo.professionalTitle || 'Professional Title'}</p>
              
              <div className="flex justify-center space-x-4">
                {portfolioData.personalInfo.linkedin && (
                  <a href={portfolioData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-white">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {portfolioData.personalInfo.github && (
                  <a href={portfolioData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-white">
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {portfolioData.personalInfo.twitter && (
                  <a href={portfolioData.personalInfo.twitter} target="_blank" rel="noopener noreferrer" className="text-white">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>

            {/* About Section */}
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4" style={{ 
                fontFamily: portfolioData.templateSettings.typography.headingFont,
                color: portfolioData.templateSettings.colorScheme.primary
              }}>
                About Me
              </h2>
              <p className="text-gray-700" style={{ fontFamily: portfolioData.templateSettings.typography.bodyFont }}>
                {portfolioData.personalInfo.bio || 'Your professional bio will appear here.'}
              </p>
            </div>

            {/* Skills Section */}
            {portfolioData.skills.length > 0 && (
              <div className="p-8 bg-gray-50">
                <h2 className="text-2xl font-bold mb-4" style={{ 
                  fontFamily: portfolioData.templateSettings.typography.headingFont,
                  color: portfolioData.templateSettings.colorScheme.primary
                }}>
                  Skills
                </h2>
                <div className="space-y-4">
                  {/* Technical Skills */}
                  <div>
                    <h3 className="font-semibold mb-2">Technical Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {portfolioData.skills
                        .filter(skill => skill.category === 'technical')
                        .map((skill) => (
                          <div key={skill.id} className="relative w-full max-w-xs">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{skill.name}</span>
                              <span className="text-sm text-gray-500">{skill.proficiency}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full" 
                                style={{ 
                                  width: `${skill.proficiency}%`,
                                  backgroundColor: portfolioData.templateSettings.colorScheme.primary
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Soft Skills */}
                  <div>
                    <h3 className="font-semibold mb-2">Soft Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {portfolioData.skills
                        .filter(skill => skill.category === 'soft')
                        .map((skill) => (
                          <span 
                            key={skill.id} 
                            className="px-3 py-1 rounded-full text-white text-sm"
                            style={{ backgroundColor: portfolioData.templateSettings.colorScheme.secondary }}
                          >
                            {skill.name}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Projects Section */}
            {portfolioData.projects.length > 0 && (
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4" style={{ 
                  fontFamily: portfolioData.templateSettings.typography.headingFont,
                  color: portfolioData.templateSettings.colorScheme.primary
                }}>
                  Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolioData.projects.slice(0, 4).map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="h-40 bg-gray-200 flex items-center justify-center">
                        <Code className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technologies.slice(0, 3).map((tech, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
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
                              className="text-xs flex items-center"
                              style={{ color: portfolioData.templateSettings.colorScheme.primary }}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Live Demo
                            </a>
                          )}
                          {project.githubUrl && (
                            <a 
                              href={project.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs flex items-center text-gray-600"
                            >
                              <Github className="h-3 w-3 mr-1" />
                              Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Section */}
            <div className="p-8 bg-gray-50">
              <h2 className="text-2xl font-bold mb-4" style={{ 
                fontFamily: portfolioData.templateSettings.typography.headingFont,
                color: portfolioData.templateSettings.colorScheme.primary
              }}>
                Contact Me
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" style={{ color: portfolioData.templateSettings.colorScheme.primary }} />
                  <span>{portfolioData.personalInfo.email || 'your.email@example.com'}</span>
                </div>
                {portfolioData.personalInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2" style={{ color: portfolioData.templateSettings.colorScheme.primary }} />
                    <span>{portfolioData.personalInfo.phone}</span>
                  </div>
                )}
                {portfolioData.personalInfo.location && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" style={{ color: portfolioData.templateSettings.colorScheme.primary }} />
                    <span>{portfolioData.personalInfo.location}</span>
                  </div>
                )}
                {portfolioData.personalInfo.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" style={{ color: portfolioData.templateSettings.colorScheme.primary }} />
                    <span>{portfolioData.personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 hover:text-purple-600 transition-colors duration-200"
        >
          ← Back
        </button>
        
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
        >
          Continue to Publish
        </button>
      </div>
    </div>
  );
};

// Publish Step Component
const PublishStep: React.FC<{
  portfolioData: PortfolioData;
  onUpdatePortfolio: (data: PortfolioData) => void;
  onBack: () => void;
}> = ({ portfolioData, onUpdatePortfolio, onBack }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');

  const handlePublish = async () => {
    setIsPublishing(true);
    
    // Simulate publishing process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const url = portfolioData.seoSettings.customDomain || 
      `https://${portfolioData.seoSettings.urlFormat || portfolioData.personalInfo.fullName.toLowerCase().replace(/\s+/g, '-')}.netlify.app`;
    
    setPublishedUrl(url);
    onUpdatePortfolio({
      ...portfolioData,
      isPublished: true,
      publishedUrl: url,
      lastModified: new Date().toISOString()
    });
    
    setIsPublishing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Publish Your Portfolio</h2>
        <p className="text-lg text-gray-600">Make your portfolio live and accessible to the world</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        {!publishedUrl ? (
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Share2 className="h-12 w-12 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Go Live?</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Your portfolio is ready to be published. Once published, it will be accessible via a custom URL that you can share with potential employers, clients, and your network.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-xl mx-auto">
              <h4 className="font-semibold text-gray-900 mb-3">Publishing Details</h4>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Portfolio Name:</span>
                  <span className="font-medium">{portfolioData.personalInfo.fullName}'s Portfolio</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">URL:</span>
                  <span className="font-medium">
                    {portfolioData.seoSettings.customDomain || 
                      `${portfolioData.seoSettings.urlFormat || portfolioData.personalInfo.fullName.toLowerCase().replace(/\s+/g, '-')}.netlify.app`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sections:</span>
                  <span className="font-medium">
                    {[
                      'About',
                      portfolioData.skills.length > 0 ? 'Skills' : null,
                      portfolioData.projects.length > 0 ? 'Projects' : null,
                      portfolioData.blogPosts.length > 0 ? 'Blog' : null,
                      portfolioData.achievements.length > 0 ? 'Achievements' : null,
                      'Contact'
                    ].filter(Boolean).join(', ')}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:transform-none"
            >
              {isPublishing ? (
                <div className="flex items-center">
                  <Zap className="animate-spin h-5 w-5 mr-3" />
                  Publishing...
                </div>
              ) : (
                <div className="flex items-center">
                  <Share2 className="h-5 w-5 mr-3" />
                  Publish My Portfolio
                </div>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Published Successfully!</h3>
            <p className="text-lg text-gray-600 mb-8">
              Your professional portfolio is now live and accessible worldwide
            </p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Your Portfolio URL:</h4>
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
                  <Copy className="h-4 w-4" />
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
                onClick={() => {
                  // Reset the form to create a new portfolio
                  window.location.reload();
                }}
                className="border-2 border-purple-300 text-purple-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-50 transition-all duration-300 flex items-center justify-center"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Another
              </button>
            </div>
          </div>
        )}
      </div>

      {!publishedUrl && (
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 text-gray-700 hover:text-purple-600 transition-colors duration-200"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioBuilder;