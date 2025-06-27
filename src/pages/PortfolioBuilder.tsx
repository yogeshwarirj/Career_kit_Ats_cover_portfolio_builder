import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, User, Briefcase, Code, Eye, Globe, Save, 
  Plus, Trash2, Edit3, ExternalLink, Github, Linkedin, 
  Mail, Phone, MapPin, Award, BookOpen, Target, Sparkles,
  ChevronRight, ChevronLeft, Home, Download, Share2,
  Palette, Layout, Settings, CheckCircle, AlertCircle,
  Image as ImageIcon, Star, Calendar, Building
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  tagline: string;
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

interface Skill {
  id: string;
  name: string;
  level: number;
  category: 'technical' | 'soft';
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

interface PortfolioData {
  personalInfo: PersonalInfo;
  about: string;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  template: string;
  theme: string;
}

type Step = 'personal' | 'about' | 'skills' | 'projects' | 'experience' | 'education' | 'customize' | 'preview';

const PortfolioBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      tagline: ''
    },
    about: '',
    skills: [],
    projects: [],
    experience: [],
    education: [],
    template: 'modern',
    theme: 'light'
  });

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState('');

  const steps: { id: Step; title: string; icon: React.ReactNode }[] = [
    { id: 'personal', title: 'Personal Info', icon: <User className="h-5 w-5" /> },
    { id: 'about', title: 'About', icon: <Edit3 className="h-5 w-5" /> },
    { id: 'skills', title: 'Skills', icon: <Code className="h-5 w-5" /> },
    { id: 'projects', title: 'Projects', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'experience', title: 'Experience', icon: <Building className="h-5 w-5" /> },
    { id: 'education', title: 'Education', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'customize', title: 'Customize', icon: <Palette className="h-5 w-5" /> },
    { id: 'preview', title: 'Preview', icon: <Eye className="h-5 w-5" /> }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  // Auto-save functionality
  useEffect(() => {
    const saveData = () => {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    };
    
    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [portfolioData]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      try {
        setPortfolioData(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
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

  const addSkill = (category: 'technical' | 'soft') => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 50,
      category
    };
    setPortfolioData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
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

  const updateEducation = (id: string, field: keyof Education, value: any) => {
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

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const deployPortfolio = async () => {
    setIsDeploying(true);
    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockUrl = `https://${portfolioData.personalInfo.name.toLowerCase().replace(/\s+/g, '-')}-portfolio.netlify.app`;
      setDeploymentUrl(mockUrl);
      toast.success('Portfolio deployed successfully!');
    } catch (error) {
      toast.error('Deployment failed. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h2>
              <p className="text-gray-600">Let's start with your basic information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={portfolioData.personalInfo.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Tagline</label>
                <input
                  type="text"
                  value={portfolioData.personalInfo.tagline}
                  onChange={(e) => updatePersonalInfo('tagline', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full Stack Developer & UI/UX Designer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={portfolioData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={portfolioData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={portfolioData.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website/Portfolio</label>
                <input
                  type="url"
                  value={portfolioData.personalInfo.website}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://johndoe.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                <input
                  type="url"
                  value={portfolioData.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
                <input
                  type="url"
                  value={portfolioData.personalInfo.github}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://github.com/johndoe"
                />
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">About You</h2>
              <p className="text-gray-600">Tell visitors about yourself and your professional journey</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Section *</label>
              <textarea
                rows={8}
                value={portfolioData.about}
                onChange={(e) => setPortfolioData(prev => ({ ...prev, about: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write a compelling introduction about yourself, your background, expertise, and what drives you professionally..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Characters: {portfolioData.about.length} (Recommended: 300-500 characters)
              </p>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Skills & Expertise</h2>
              <p className="text-gray-600">Showcase your technical and soft skills</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Technical Skills */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Technical Skills</h3>
                  <button
                    onClick={() => addSkill('technical')}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Skill
                  </button>
                </div>

                <div className="space-y-4">
                  {portfolioData.skills.filter(skill => skill.category === 'technical').map((skill) => (
                    <div key={skill.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mr-3"
                          placeholder="Skill name (e.g., React, Python)"
                        />
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Proficiency Level: {skill.level}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.level}
                          onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Soft Skills</h3>
                  <button
                    onClick={() => addSkill('soft')}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Skill
                  </button>
                </div>

                <div className="space-y-4">
                  {portfolioData.skills.filter(skill => skill.category === 'soft').map((skill) => (
                    <div key={skill.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mr-3"
                          placeholder="Skill name (e.g., Leadership, Communication)"
                        />
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Proficiency Level: {skill.level}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.level}
                          onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Projects & Portfolio</h2>
              <p className="text-gray-600">Showcase your best work with images and descriptions</p>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Your Projects</h3>
              <button
                onClick={addProject}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </button>
            </div>

            <div className="space-y-6">
              {portfolioData.projects.map((project, index) => (
                <div key={project.id} className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Project {index + 1}</h4>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={project.featured}
                          onChange={(e) => updateProject(project.id, 'featured', e.target.checked)}
                          className="mr-2"
                        />
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        Featured
                      </label>
                      <button
                        onClick={() => removeProject(project.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Project Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
                      <ImageUploader
                        currentImage={project.imageUrl}
                        onImageUpload={(imageUrl) => updateProject(project.id, 'imageUrl', imageUrl)}
                        className="mb-4"
                      />
                    </div>

                    {/* Project Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="E-commerce Platform"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea
                          rows={3}
                          value={project.description}
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Brief description of the project, its purpose, and your role..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
                        <input
                          type="text"
                          value={project.technologies.join(', ')}
                          onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="React, Node.js, MongoDB, AWS"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate technologies with commas</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Live Demo URL</label>
                          <input
                            type="url"
                            value={project.liveUrl}
                            onChange={(e) => updateProject(project.id, 'liveUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://project-demo.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Repository</label>
                          <input
                            type="url"
                            value={project.githubUrl}
                            onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://github.com/username/project"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {portfolioData.projects.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-600 mb-4">Add your first project to showcase your work</p>
                  <button
                    onClick={addProject}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Project
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Work Experience</h2>
              <p className="text-gray-600">Add your professional experience and achievements</p>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Experience</h3>
              <button
                onClick={addExperience}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </button>
            </div>

            <div className="space-y-6">
              {portfolioData.experience.map((exp, index) => (
                <div key={exp.id} className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Experience {index + 1}</h4>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Senior Software Engineer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tech Company Inc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.current}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => {
                              updateExperience(exp.id, 'current', e.target.checked);
                              if (e.target.checked) {
                                updateExperience(exp.id, 'endDate', '');
                              }
                            }}
                            className="mr-2"
                          />
                          Current
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      rows={4}
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your responsibilities, achievements, and impact in this role..."
                    />
                  </div>
                </div>
              ))}

              {portfolioData.experience.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No experience added yet</h3>
                  <p className="text-gray-600 mb-4">Add your work experience to showcase your career journey</p>
                  <button
                    onClick={addExperience}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Experience
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Education</h2>
              <p className="text-gray-600">Add your educational background and qualifications</p>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Education</h3>
              <button
                onClick={addEducation}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </button>
            </div>

            <div className="space-y-6">
              {portfolioData.education.map((edu, index) => (
                <div key={edu.id} className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Education {index + 1}</h4>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Bachelor of Science in Computer Science"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">School/University *</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="University of Technology"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year *</label>
                      <input
                        type="number"
                        min="1950"
                        max="2030"
                        value={edu.graduationYear}
                        onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2023"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GPA (Optional)</label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="3.8/4.0"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {portfolioData.education.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No education added yet</h3>
                  <p className="text-gray-600 mb-4">Add your educational background and qualifications</p>
                  <button
                    onClick={addEducation}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Education
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'customize':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Customize Your Portfolio</h2>
              <p className="text-gray-600">Choose a template and theme that represents your style</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Template Selection */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Template</h3>
                <div className="grid grid-cols-1 gap-4">
                  {['modern', 'creative', 'minimal', 'professional'].map((template) => (
                    <div
                      key={template}
                      onClick={() => setPortfolioData(prev => ({ ...prev, template }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        portfolioData.template === template
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 capitalize">{template}</h4>
                          <p className="text-sm text-gray-600">
                            {template === 'modern' && 'Clean and contemporary design'}
                            {template === 'creative' && 'Bold and artistic layout'}
                            {template === 'minimal' && 'Simple and elegant style'}
                            {template === 'professional' && 'Traditional business look'}
                          </p>
                        </div>
                        {portfolioData.template === template && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Theme Selection */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Theme</h3>
                <div className="grid grid-cols-1 gap-4">
                  {['light', 'dark', 'colorful'].map((theme) => (
                    <div
                      key={theme}
                      onClick={() => setPortfolioData(prev => ({ ...prev, theme }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        portfolioData.theme === theme
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 capitalize">{theme}</h4>
                          <p className="text-sm text-gray-600">
                            {theme === 'light' && 'Clean white background with dark text'}
                            {theme === 'dark' && 'Dark background with light text'}
                            {theme === 'colorful' && 'Vibrant colors and gradients'}
                          </p>
                        </div>
                        {portfolioData.theme === theme && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Preview Your Portfolio</h2>
              <p className="text-gray-600">See how your portfolio will look to visitors</p>
            </div>

            {/* Portfolio Preview */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{portfolioData.personalInfo.name || 'Your Name'}</h1>
                {portfolioData.personalInfo.tagline && (
                  <p className="text-xl text-gray-600 mb-4">{portfolioData.personalInfo.tagline}</p>
                )}
                <div className="flex justify-center space-x-4 text-gray-600">
                  {portfolioData.personalInfo.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {portfolioData.personalInfo.email}
                    </div>
                  )}
                  {portfolioData.personalInfo.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {portfolioData.personalInfo.phone}
                    </div>
                  )}
                  {portfolioData.personalInfo.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {portfolioData.personalInfo.location}
                    </div>
                  )}
                </div>
              </div>

              {portfolioData.about && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                  <p className="text-gray-700 leading-relaxed">{portfolioData.about}</p>
                </div>
              )}

              {portfolioData.projects.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Projects</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portfolioData.projects.slice(0, 4).map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        {project.imageUrl && (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{project.title || 'Project Title'}</h3>
                          <p className="text-gray-600 text-sm mb-3">{project.description || 'Project description...'}</p>
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {project.technologies.map((tech, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex space-x-2">
                            {project.liveUrl && (
                              <a href={project.liveUrl} className="text-blue-600 hover:text-blue-700 text-sm flex items-center">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Live Demo
                              </a>
                            )}
                            {project.githubUrl && (
                              <a href={project.githubUrl} className="text-gray-600 hover:text-gray-700 text-sm flex items-center">
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

              {portfolioData.skills && portfolioData.skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portfolioData.skills.filter(skill => skill.category === 'technical').length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Skills</h3>
                        <div className="space-y-2">
                          {portfolioData.skills.filter(skill => skill.category === 'technical').map((skill) => (
                            <div key={skill.id}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-700">{skill.name}</span>
                                <span className="text-gray-500">{skill.level}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${skill.level}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {portfolioData.skills.filter(skill => skill.category === 'soft').length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Soft Skills</h3>
                        <div className="space-y-2">
                          {portfolioData.skills.filter(skill => skill.category === 'soft').map((skill) => (
                            <div key={skill.id}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-700">{skill.name}</span>
                                <span className="text-gray-500">{skill.level}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${skill.level}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Deployment Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Go Live?</h3>
              <p className="text-blue-100 mb-6">Deploy your portfolio to the web and share it with the world</p>
              
              {deploymentUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center text-green-200">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Portfolio deployed successfully!
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-sm text-blue-100 mb-2">Your portfolio is live at:</p>
                    <a
                      href={deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-medium hover:underline flex items-center justify-center"
                    >
                      {deploymentUrl}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Portfolio
                    </button>
                    <button
                      onClick={() => setDeploymentUrl('')}
                      className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                    >
                      Deploy New Version
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={deployPortfolio}
                  disabled={isDeploying}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
                >
                  {isDeploying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Globe className="h-5 w-5 mr-2" />
                      Deploy Portfolio
                    </>
                  )}
                </button>
              )}
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
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-orange-100/30 to-pink-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-purple-100/30 to-indigo-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group mr-6">
                <Home className="h-5 w-5 text-gray-600 mr-3 group-hover:text-blue-600 transition-colors duration-200" />
                <span className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200">Home</span>
              </Link>
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Portfolio Builder</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Save className="h-4 w-4 mr-1" />
                Auto-saved
              </div>
              {currentStep === 'preview' && (
                <button
                  onClick={deployPortfolio}
                  disabled={isDeploying}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                >
                  {isDeploying ? 'Deploying...' : 'Deploy Portfolio'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="relative z-10 bg-white/50 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentStep === step.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : index < currentStepIndex
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {step.icon}
                  <span className="ml-2 text-sm font-medium hidden sm:inline">{step.title}</span>
                </button>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="text-sm text-gray-500">
              Step {currentStepIndex + 1} of {steps.length}
            </div>

            <button
              onClick={nextStep}
              disabled={currentStepIndex === steps.length - 1}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilder;