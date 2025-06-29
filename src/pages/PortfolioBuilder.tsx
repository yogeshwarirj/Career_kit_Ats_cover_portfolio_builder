import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, User, Briefcase, GraduationCap, Code, FileText, Trophy, Mail, Plus, Trash2, Eye, Download, Globe, Sparkles, CheckCircle, Star, Award, Users, Target, Layout, Palette, Save, Upload, Image as ImageIcon, Camera, Monitor, Smartphone } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';
import { netlifyIntegration } from '../lib/netlifyIntegration';
import TavusAgentExplainer from '../components/TavusAgentExplainer';

interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  profileImage: string;
}

interface AboutInfo {
  background: string;
  objectives: string;
  interests: string;
  uniqueValue: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  year: string;
  achievements: string;
}

interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'tools';
  proficiency: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  role: string;
  outcomes: string;
  liveUrl: string;
  repoUrl: string;
  image: string;
}

interface Blog {
  id: string;
  title: string;
  description: string;
  url: string;
  publishDate: string;
  tags: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

interface PortfolioData {
  personalInfo: PersonalInfo;
  about: AboutInfo;
  education: Education[];
  skills: Skill[];
  projects: Project[];
  blogs: Blog[];
  achievements: Achievement[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    layout: 'modern' | 'classic' | 'creative';
  };
}

const PortfolioBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    personalInfo: {
      name: '',
      title: '',
      tagline: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: '',
      profileImage: ''
    },
    about: {
      background: '',
      objectives: '',
      interests: '',
      uniqueValue: ''
    },
    education: [],
    skills: [],
    projects: [],
    blogs: [],
    achievements: [],
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      layout: 'modern'
    }
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPortfolio, setGeneratedPortfolio] = useState<string | null>(null);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const steps = [
    { id: 'personal', title: 'Personal Info', icon: User },
    { id: 'about', title: 'About Me', icon: FileText },
    { id: 'education', title: 'Education', icon: GraduationCap },
    { id: 'skills', title: 'Skills', icon: Code },
    { id: 'projects', title: 'Projects', icon: Briefcase },
    { id: 'blogs', title: 'Blogs', icon: FileText },
    { id: 'achievements', title: 'Achievements', icon: Trophy },
    { id: 'theme', title: 'Theme', icon: Palette },
    { id: 'preview', title: 'Preview', icon: Eye }
  ];

  const colorThemes = [
    { name: 'Blue Ocean', primary: '#3B82F6', secondary: '#10B981' },
    { name: 'Purple Haze', primary: '#8B5CF6', secondary: '#F59E0B' },
    { name: 'Green Nature', primary: '#10B981', secondary: '#3B82F6' },
    { name: 'Orange Sunset', primary: '#F97316', secondary: '#EF4444' },
    { name: 'Pink Flamingo', primary: '#EC4899', secondary: '#8B5CF6' },
    { name: 'Teal Professional', primary: '#0D9488', secondary: '#F59E0B' }
  ];

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('portfolioBuilder', JSON.stringify(portfolioData));
  }, [portfolioData]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('portfolioBuilder');
    if (saved) {
      try {
        setPortfolioData(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateAbout = (field: keyof AboutInfo, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      about: { ...prev.about, [field]: value }
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      year: '',
      achievements: ''
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

  const addSkill = (category: 'technical' | 'soft' | 'tools') => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      category,
      proficiency: 80
    };
    setPortfolioData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string | number) => {
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

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: [],
      role: '',
      outcomes: '',
      liveUrl: '',
      repoUrl: '',
      image: ''
    };
    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
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

  const addBlog = () => {
    const newBlog: Blog = {
      id: Date.now().toString(),
      title: '',
      description: '',
      url: '',
      publishDate: '',
      tags: []
    };
    setPortfolioData(prev => ({
      ...prev,
      blogs: [...prev.blogs, newBlog]
    }));
  };

  const updateBlog = (id: string, field: keyof Blog, value: string | string[]) => {
    setPortfolioData(prev => ({
      ...prev,
      blogs: prev.blogs.map(blog => 
        blog.id === id ? { ...blog, [field]: value } : blog
      )
    }));
  };

  const removeBlog = (id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      blogs: prev.blogs.filter(blog => blog.id !== id)
    }));
  };

  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: '',
      category: ''
    };
    setPortfolioData(prev => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement]
    }));
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement => 
        achievement.id === id ? { ...achievement, [field]: value } : achievement
      )
    }));
  };

  const removeAchievement = (id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(achievement => achievement.id !== id)
    }));
  };

  const generatePortfolioHTML = () => {
    const { personalInfo, about, education, skills, projects, blogs, achievements, theme } = portfolioData;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.name} - Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            overflow-x: hidden;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Navigation */
        nav {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            z-index: 1000;
            padding: 1rem 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .nav-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: ${theme.primaryColor};
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #333;
            transition: color 0.3s;
        }
        
        .nav-links a:hover, .nav-links a.active {
            color: ${theme.primaryColor};
        }
        
        /* Hero Section */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, ${theme.primaryColor}10 0%, ${theme.secondaryColor}10 100%);
            position: relative;
            overflow: hidden;
        }
        
        .hero-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
            z-index: 2;
        }
        
        .hero-text h1 {
            font-size: 3.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
            line-height: 1.2;
        }
        
        .hero-text h2 {
            font-size: 1.5rem;
            color: ${theme.primaryColor};
            margin-bottom: 1rem;
        }
        
        .hero-text p {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor});
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: transform 0.3s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .hero-image {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .profile-image {
            width: 300px;
            height: 300px;
            border-radius: 50%;
            object-fit: cover;
            border: 5px solid ${theme.primaryColor};
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .profile-placeholder {
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor});
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            color: white;
            font-weight: bold;
        }
        
        /* Section Styles */
        section {
            padding: 5rem 0;
        }
        
        .section-title {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 3rem;
            color: ${theme.primaryColor};
        }
        
        /* About Section */
        .about-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .about-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 1px solid ${theme.primaryColor}20;
        }
        
        /* Skills Section */
        .skills-category {
            margin-bottom: 3rem;
        }
        
        .skills-category h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: ${theme.primaryColor};
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }
        
        .skill-item {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .skill-name {
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .skill-bar {
            height: 8px;
            background: #f0f0f0;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .skill-progress {
            height: 100%;
            background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor});
            border-radius: 4px;
            transition: width 1s ease;
        }
        
        /* Projects Section */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }
        
        .project-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
        }
        
        .project-card:hover {
            transform: translateY(-5px);
        }
        
        .project-image {
            height: 200px;
            background: linear-gradient(135deg, ${theme.primaryColor}20, ${theme.secondaryColor}20);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: ${theme.primaryColor};
        }
        
        .project-content {
            padding: 1.5rem;
        }
        
        .project-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: ${theme.primaryColor};
        }
        
        .project-tech {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 1rem 0;
        }
        
        .tech-tag {
            background: ${theme.primaryColor}20;
            color: ${theme.primaryColor};
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
        }
        
        /* Education Section */
        .education-timeline {
            position: relative;
            padding-left: 2rem;
        }
        
        .education-timeline::before {
            content: '';
            position: absolute;
            left: 1rem;
            top: 0;
            bottom: 0;
            width: 2px;
            background: ${theme.primaryColor};
        }
        
        .education-item {
            position: relative;
            background: white;
            padding: 1.5rem;
            margin-bottom: 2rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .education-item::before {
            content: '';
            position: absolute;
            left: -1.75rem;
            top: 1.5rem;
            width: 12px;
            height: 12px;
            background: ${theme.primaryColor};
            border-radius: 50%;
            border: 3px solid white;
        }
        
        /* Contact Section */
        .contact {
            background: linear-gradient(135deg, ${theme.primaryColor}10 0%, ${theme.secondaryColor}10 100%);
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            text-align: center;
        }
        
        .contact-item {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .contact-icon {
            width: 60px;
            height: 60px;
            background: ${theme.primaryColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 1.5rem;
            color: white;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
            
            .hero-content {
                grid-template-columns: 1fr;
                text-align: center;
                gap: 2rem;
            }
            
            .hero-text h1 {
                font-size: 2.5rem;
            }
            
            .profile-image, .profile-placeholder {
                width: 200px;
                height: 200px;
            }
        }
        
        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in {
            animation: fadeInUp 0.6s ease forwards;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav>
        <div class="container">
            <div class="nav-content">
                <div class="logo">${personalInfo.name}</div>
                <ul class="nav-links">
                    <li><a href="#home" class="active">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#skills">Skills</a></li>
                    <li><a href="#projects">Projects</a></li>
                    ${blogs.length > 0 ? '<li><a href="#blogs">Blogs</a></li>' : ''}
                    ${achievements.length > 0 ? '<li><a href="#achievements">Achievements</a></li>' : ''}
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <h1>Hi! I'm ${personalInfo.name}</h1>
                    <h2>${personalInfo.title}</h2>
                    <p>${personalInfo.tagline}</p>
                    <a href="#about" class="cta-button">ABOUT ME</a>
                </div>
                <div class="hero-image">
                    ${personalInfo.profileImage 
                        ? `<img src="${personalInfo.profileImage}" alt="${personalInfo.name}" class="profile-image">`
                        : `<div class="profile-placeholder">${personalInfo.name.charAt(0)}</div>`
                    }
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-grid">
                <div class="about-card">
                    <h3>Professional Background</h3>
                    <p>${about.background}</p>
                </div>
                <div class="about-card">
                    <h3>Career Objectives</h3>
                    <p>${about.objectives}</p>
                </div>
                <div class="about-card">
                    <h3>Personal Interests</h3>
                    <p>${about.interests}</p>
                </div>
                <div class="about-card">
                    <h3>What Makes Me Unique</h3>
                    <p>${about.uniqueValue}</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Skills Section -->
    <section id="skills">
        <div class="container">
            <h2 class="section-title">Technical Proficiencies</h2>
            
            ${['technical', 'soft', 'tools'].map(category => {
                const categorySkills = skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return '';
                
                return `
                <div class="skills-category">
                    <h3>${category.charAt(0).toUpperCase() + category.slice(1)} Skills</h3>
                    <div class="skills-grid">
                        ${categorySkills.map(skill => `
                            <div class="skill-item">
                                <div class="skill-name">${skill.name}</div>
                                <div class="skill-bar">
                                    <div class="skill-progress" style="width: ${skill.proficiency}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                `;
            }).join('')}
        </div>
    </section>

    <!-- Projects Section -->
    ${projects.length > 0 ? `
    <section id="projects">
        <div class="container">
            <h2 class="section-title">Projects</h2>
            <div class="projects-grid">
                ${projects.map(project => `
                    <div class="project-card">
                        <div class="project-image">
                            ${project.image ? `<img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">` : '🚀'}
                        </div>
                        <div class="project-content">
                            <h3 class="project-title">${project.title}</h3>
                            <p>${project.description}</p>
                            <div class="project-tech">
                                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                            <p><strong>Role:</strong> ${project.role}</p>
                            <p><strong>Outcomes:</strong> ${project.outcomes}</p>
                            ${project.liveUrl ? `<p><a href="${project.liveUrl}" target="_blank">Live Demo</a></p>` : ''}
                            ${project.repoUrl ? `<p><a href="${project.repoUrl}" target="_blank">Repository</a></p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Education Section -->
    ${education.length > 0 ? `
    <section id="education">
        <div class="container">
            <h2 class="section-title">Education</h2>
            <div class="education-timeline">
                ${education.map(edu => `
                    <div class="education-item">
                        <h3>${edu.degree}</h3>
                        <h4>${edu.institution}, ${edu.location}</h4>
                        <p><strong>Year:</strong> ${edu.year}</p>
                        ${edu.achievements ? `<p><strong>Achievements:</strong> ${edu.achievements}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Blogs Section -->
    ${blogs.length > 0 ? `
    <section id="blogs">
        <div class="container">
            <h2 class="section-title">Blogs</h2>
            <div class="projects-grid">
                ${blogs.map(blog => `
                    <div class="project-card">
                        <div class="project-content">
                            <h3 class="project-title">${blog.title}</h3>
                            <p>${blog.description}</p>
                            <div class="project-tech">
                                ${blog.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                            </div>
                            <p><strong>Published:</strong> ${blog.publishDate}</p>
                            ${blog.url ? `<p><a href="${blog.url}" target="_blank">Read Article</a></p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Achievements Section -->
    ${achievements.length > 0 ? `
    <section id="achievements">
        <div class="container">
            <h2 class="section-title">Achievements</h2>
            <div class="education-timeline">
                ${achievements.map(achievement => `
                    <div class="education-item">
                        <h3>${achievement.title}</h3>
                        <p>${achievement.description}</p>
                        <p><strong>Category:</strong> ${achievement.category}</p>
                        <p><strong>Date:</strong> ${achievement.date}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Contact</h2>
            <div class="contact-grid">
                <div class="contact-item">
                    <div class="contact-icon">📧</div>
                    <h3>Email</h3>
                    <p><a href="mailto:${personalInfo.email}">${personalInfo.email}</a></p>
                </div>
                ${personalInfo.phone ? `
                <div class="contact-item">
                    <div class="contact-icon">📱</div>
                    <h3>Phone</h3>
                    <p><a href="tel:${personalInfo.phone}">${personalInfo.phone}</a></p>
                </div>
                ` : ''}
                ${personalInfo.linkedin ? `
                <div class="contact-item">
                    <div class="contact-icon">💼</div>
                    <h3>LinkedIn</h3>
                    <p><a href="${personalInfo.linkedin}" target="_blank">Connect with me</a></p>
                </div>
                ` : ''}
                ${personalInfo.github ? `
                <div class="contact-item">
                    <div class="contact-icon">💻</div>
                    <h3>GitHub</h3>
                    <p><a href="${personalInfo.github}" target="_blank">View my code</a></p>
                </div>
                ` : ''}
            </div>
        </div>
    </section>

    <script>
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Animate skill bars on scroll
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBars = entry.target.querySelectorAll('.skill-progress');
                    skillBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('.skills-category').forEach(section => {
            observer.observe(section);
        });

        // Active navigation highlighting
        window.addEventListener('scroll', () => {
            let current = '';
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    </script>
</body>
</html>`;
  };

  const generatePortfolio = async () => {
    if (!portfolioData.personalInfo.name || !portfolioData.personalInfo.title) {
      toast.error('Please fill in at least your name and title before generating');
      return;
    }

    setIsGenerating(true);
    
    try {
      const htmlContent = generatePortfolioHTML();
      setGeneratedPortfolio(htmlContent);
      setCurrentStep(8); // Move to preview step
      toast.success('Portfolio generated successfully!');
    } catch (error) {
      console.error('Portfolio generation error:', error);
      toast.error('Failed to generate portfolio. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const deployPortfolio = async () => {
    if (!generatedPortfolio) {
      toast.error('Please generate your portfolio first');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Create a blob with the HTML content
      const blob = new Blob([generatedPortfolio], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `${portfolioData.personalInfo.name.replace(/\s+/g, '-').toLowerCase()}-portfolio.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Portfolio downloaded successfully!');
      
      // Simulate deployment (in a real app, this would deploy to Netlify)
      setTimeout(() => {
        const deploymentUrl = `https://${portfolioData.personalInfo.name.replace(/\s+/g, '-').toLowerCase()}-portfolio.netlify.app`;
        setDeploymentUrl(deploymentUrl);
        toast.success('Portfolio deployed successfully!');
      }, 2000);
      
    } catch (error) {
      console.error('Deployment error:', error);
      toast.error('Failed to deploy portfolio. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title *</label>
                <input
                  type="text"
                  value={portfolioData.personalInfo.title}
                  onChange={(e) => updatePersonalInfo('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Data Analyst"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Tagline</label>
              <textarea
                rows={3}
                value={portfolioData.personalInfo.tagline}
                onChange={(e) => updatePersonalInfo('tagline', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bridging the gap between data and decisions. A passionate analyst who transforms complex datasets into actionable insights."
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={portfolioData.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="New York, NY"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Personal Website</label>
              <input
                type="url"
                value={portfolioData.personalInfo.website}
                onChange={(e) => updatePersonalInfo('website', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://johndoe.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
              <ImageUploader
                onImageUpload={(imageUrl) => updatePersonalInfo('profileImage', imageUrl)}
                currentImage={portfolioData.personalInfo.profileImage}
              />
            </div>
          </div>
        );

      case 1: // About Me
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">About Me</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Background</label>
              <textarea
                rows={4}
                value={portfolioData.about.background}
                onChange={(e) => updateAbout('background', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your professional journey, experience, and expertise..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Career Objectives</label>
              <textarea
                rows={4}
                value={portfolioData.about.objectives}
                onChange={(e) => updateAbout('objectives', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What are your career goals and aspirations?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Personal Interests & Hobbies</label>
              <textarea
                rows={4}
                value={portfolioData.about.interests}
                onChange={(e) => updateAbout('interests', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What do you enjoy doing outside of work?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What Makes You Unique</label>
              <textarea
                rows={4}
                value={portfolioData.about.uniqueValue}
                onChange={(e) => updateAbout('uniqueValue', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What sets you apart from others in your field?"
              />
            </div>
          </div>
        );

      case 2: // Education
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Education</h3>
              <button
                onClick={addEducation}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </button>
            </div>

            {portfolioData.education.map((edu, index) => (
              <div key={edu.id} className="bg-gray-50 rounded-lg p-6 relative">
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-100 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Degree/Certificate</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Bachelor of Science in Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="University of Technology"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2020"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Achievements/Honors</label>
                  <textarea
                    rows={3}
                    value={edu.achievements}
                    onChange={(e) => updateEducation(edu.id, 'achievements', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Magna Cum Laude, Dean's List, Relevant coursework..."
                  />
                </div>
              </div>
            ))}

            {portfolioData.education.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No education entries yet. Click "Add Education" to get started.</p>
              </div>
            )}
          </div>
        );

      case 3: // Skills
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Skills & Proficiencies</h3>

            {['technical', 'soft', 'tools'].map((category) => (
              <div key={category} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 capitalize">{category} Skills</h4>
                  <button
                    onClick={() => addSkill(category as 'technical' | 'soft' | 'tools')}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add {category}
                  </button>
                </div>

                <div className="space-y-4">
                  {portfolioData.skills.filter(skill => skill.category === category).map((skill) => (
                    <div key={skill.id} className="bg-white rounded-lg p-4 flex items-center space-x-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`${category} skill name`}
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.proficiency}
                          onChange={(e) => updateSkill(skill.id, 'proficiency', parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="text-center text-sm text-gray-600 mt-1">{skill.proficiency}%</div>
                      </div>
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {portfolioData.skills.filter(skill => skill.category === category).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No {category} skills added yet.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 4: // Projects
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Projects</h3>
              <button
                onClick={addProject}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </button>
            </div>

            {portfolioData.projects.map((project) => (
              <div key={project.id} className="bg-gray-50 rounded-lg p-6 relative">
                <button
                  onClick={() => removeProject(project.id)}
                  className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-100 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="My Awesome Project"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
                    <input
                      type="text"
                      value={project.role}
                      onChange={(e) => updateProject(project.id, 'role', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Full Stack Developer"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                  <textarea
                    rows={3}
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what this project does and its key features..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used (comma-separated)</label>
                  <input
                    type="text"
                    value={project.technologies.join(', ')}
                    onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="React, Node.js, MongoDB, Express"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Outcomes</label>
                  <textarea
                    rows={3}
                    value={project.outcomes}
                    onChange={(e) => updateProject(project.id, 'outcomes', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What were the results, impact, or achievements of this project?"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Live Demo URL</label>
                    <input
                      type="url"
                      value={project.liveUrl}
                      onChange={(e) => updateProject(project.id, 'liveUrl', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://myproject.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Repository URL</label>
                    <input
                      type="url"
                      value={project.repoUrl}
                      onChange={(e) => updateProject(project.id, 'repoUrl', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
                  <ImageUploader
                    onImageUpload={(imageUrl) => updateProject(project.id, 'image', imageUrl)}
                    currentImage={project.image}
                  />
                </div>
              </div>
            ))}

            {portfolioData.projects.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No projects added yet. Click "Add Project" to showcase your work.</p>
              </div>
            )}
          </div>
        );

      case 5: // Blogs
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Blogs & Articles</h3>
              <button
                onClick={addBlog}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Blog
              </button>
            </div>

            {portfolioData.blogs.map((blog) => (
              <div key={blog.id} className="bg-gray-50 rounded-lg p-6 relative">
                <button
                  onClick={() => removeBlog(blog.id)}
                  className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-100 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Article Title</label>
                    <input
                      type="text"
                      value={blog.title}
                      onChange={(e) => updateBlog(blog.id, 'title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Understanding Machine Learning"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
                    <input
                      type="date"
                      value={blog.publishDate}
                      onChange={(e) => updateBlog(blog.id, 'publishDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Article Description</label>
                  <textarea
                    rows={3}
                    value={blog.description}
                    onChange={(e) => updateBlog(blog.id, 'description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of what this article covers..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Article URL</label>
                  <input
                    type="url"
                    value={blog.url}
                    onChange={(e) => updateBlog(blog.id, 'url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://medium.com/@username/article"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={blog.tags.join(', ')}
                    onChange={(e) => updateBlog(blog.id, 'tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Data Science, Python, Machine Learning"
                  />
                </div>
              </div>
            ))}

            {portfolioData.blogs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No blog entries yet. Click "Add Blog" to showcase your writing.</p>
              </div>
            )}
          </div>
        );

      case 6: // Achievements
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Achievements & Awards</h3>
              <button
                onClick={addAchievement}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Achievement
              </button>
            </div>

            {portfolioData.achievements.map((achievement) => (
              <div key={achievement.id} className="bg-gray-50 rounded-lg p-6 relative">
                <button
                  onClick={() => removeAchievement(achievement.id)}
                  className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-100 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Achievement Title</label>
                    <input
                      type="text"
                      value={achievement.title}
                      onChange={(e) => updateAchievement(achievement.id, 'title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Employee of the Month"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input
                      type="text"
                      value={achievement.category}
                      onChange={(e) => updateAchievement(achievement.id, 'category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Professional, Academic, Personal"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={achievement.description}
                    onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe this achievement and its significance..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={achievement.date}
                    onChange={(e) => updateAchievement(achievement.id, 'date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}

            {portfolioData.achievements.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No achievements added yet. Click "Add Achievement" to highlight your accomplishments.</p>
              </div>
            )}
          </div>
        );

      case 7: // Theme
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Theme</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Color Scheme</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colorThemes.map((theme, index) => (
                  <div
                    key={index}
                    onClick={() => setPortfolioData(prev => ({
                      ...prev,
                      theme: { ...prev.theme, primaryColor: theme.primary, secondaryColor: theme.secondary }
                    }))}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      portfolioData.theme.primaryColor === theme.primary
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: theme.primary }}
                      ></div>
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: theme.secondary }}
                      ></div>
                    </div>
                    <h4 className="font-medium text-gray-900">{theme.name}</h4>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Layout Style</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
                  { id: 'classic', name: 'Classic', description: 'Traditional and professional' },
                  { id: 'creative', name: 'Creative', description: 'Bold and artistic' }
                ].map((layout) => (
                  <div
                    key={layout.id}
                    onClick={() => setPortfolioData(prev => ({
                      ...prev,
                      theme: { ...prev.theme, layout: layout.id as 'modern' | 'classic' | 'creative' }
                    }))}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      portfolioData.theme.layout === layout.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Layout className="h-8 w-8 mb-2 text-gray-600" />
                    <h4 className="font-medium text-gray-900">{layout.name}</h4>
                    <p className="text-sm text-gray-600">{layout.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Preview Colors</h4>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: portfolioData.theme.primaryColor }}
                  ></div>
                  <span className="text-sm text-gray-600">Primary: {portfolioData.theme.primaryColor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: portfolioData.theme.secondaryColor }}
                  ></div>
                  <span className="text-sm text-gray-600">Secondary: {portfolioData.theme.secondaryColor}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 8: // Preview
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Portfolio Preview</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-white shadow' : ''}`}
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('tablet')}
                    className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-white shadow' : ''}`}
                  >
                    <Layout className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-white shadow' : ''}`}
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                </div>
                
                <button
                  onClick={deployPortfolio}
                  disabled={!generatedPortfolio || isGenerating}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download & Deploy
                </button>
              </div>
            </div>

            {generatedPortfolio ? (
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={generatedPortfolio}
                  className={`w-full bg-white ${
                    previewMode === 'desktop' ? 'h-96' :
                    previewMode === 'tablet' ? 'h-80 max-w-2xl mx-auto' :
                    'h-96 max-w-sm mx-auto'
                  }`}
                  title="Portfolio Preview"
                />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Generate your portfolio to see the preview.</p>
              </div>
            )}

            {deploymentUrl && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="font-medium text-green-900">Portfolio Deployed Successfully!</p>
                    <p className="text-green-700">Your portfolio is now live at: <a href={deploymentUrl} target="_blank" rel="noopener noreferrer" className="underline">{deploymentUrl}</a></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const isStepComplete = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Personal Info
        return portfolioData.personalInfo.name && portfolioData.personalInfo.title;
      case 1: // About
        return portfolioData.about.background || portfolioData.about.objectives;
      case 2: // Education
        return true; // Optional
      case 3: // Skills
        return portfolioData.skills.length > 0;
      case 4: // Projects
        return true; // Optional
      case 5: // Blogs
        return true; // Optional
      case 6: // Achievements
        return true; // Optional
      case 7: // Theme
        return true; // Always complete
      case 8: // Preview
        return generatedPortfolio !== null;
      default:
        return false;
    }
  };

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
                onClick={() => {
                  localStorage.setItem('portfolioBuilder', JSON.stringify(portfolioData));
                  toast.success('Progress saved!');
                }}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            Professional Portfolio Builder
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-[1.1] animate-fade-in-up">
            Create Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 animate-gradient-x">
              Professional Portfolio
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-up delay-200">
            Build a stunning portfolio website that showcases your skills, projects, and achievements. Stand out from the crowd with a professional online presence.
          </p>

          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500 mb-8">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-blue-500 mr-1" />
              <span>10K+ Portfolios Created</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>4.9 User Rating</span>
            </div>
            <div className="flex items-center">
              <Award className="h-4 w-4 text-green-500 mr-1" />
              <span>Professional Quality</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  currentStep === index
                    ? 'bg-blue-600 text-white shadow-lg'
                    : isStepComplete(index)
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <step.icon className="h-4 w-4 mr-2" />
                {step.title}
                {isStepComplete(index) && currentStep !== index && (
                  <CheckCircle className="h-4 w-4 ml-2" />
                )}
              </button>
            ))}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          <div className="flex items-center space-x-4">
            {currentStep === 8 ? (
              <button
                onClick={generatePortfolio}
                disabled={isGenerating}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Generate Portfolio
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TavusAgentExplainer */}
      <TavusAgentExplainer />
    </div>
  );
};

export default PortfolioBuilder;