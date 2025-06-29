import { GeneratedPortfolio, PortfolioGenerationParams, PortfolioGenerationResult } from './portfolioGenerator';

export interface GeneratedPortfolio {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  sections: {
    about: string;
    projects: Array<{
      id: string;
      title: string;
      description: string;
      technologies: string[];
      liveUrl?: string;
      githubUrl?: string;
      imageUrl?: string;
      features: string[];
    }>;
    experience: Array<{
      id: string;
      title: string;
      company: string;
      duration: string;
      description: string;
      achievements: string[];
    }>;
    education: Array<{
      id: string;
      degree: string;
      school: string;
      year: string;
      description?: string;
    }>;
    skills: {
      technical: string[];
      soft: string[];
      tools: string[];
    };
    testimonials?: Array<{
      id: string;
      name: string;
      role: string;
      company: string;
      content: string;
    }>;
  };
  customizations: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    font: string;
    layout: 'modern' | 'classic' | 'creative' | 'minimal';
    theme: 'light' | 'dark' | 'auto';
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  slug: string;
  publishedUrl?: string;
}

export interface PortfolioGenerationParams {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
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
}

export interface PortfolioGenerationResult {
  success: boolean;
  portfolio?: GeneratedPortfolio;
  error?: string;
}

class GeminiPortfolioGenerator {
  constructor() {
    // No longer initializing Gemini AI
    console.log('Portfolio generator initialized without AI dependency');
  }

  private initializeGemini() {
    // Gemini AI has been removed from portfolio generation
    // Portfolio generation now uses local, non-AI methods only
    console.log('Portfolio generation is now AI-free and uses local processing only');
  }

  async generatePortfolio(params: PortfolioGenerationParams): Promise<PortfolioGenerationResult> {
    try {
      // Direct generation without AI - use local processing only
      console.log('Generating portfolio using local processing (no AI)...');
      
      const portfolio = this.generateLocalPortfolio(params);
      
      console.log('Portfolio generated successfully using local processing');
      
      return {
        success: true,
        portfolio
      };
      
    } catch (error) {
      console.error('Error generating portfolio:', error);
      
      let errorMessage = 'Failed to generate portfolio. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Enhanced local generation method (formerly fallback)
  private generateLocalPortfolio(params: PortfolioGenerationParams): GeneratedPortfolio {
    const colorSchemes = {
      blue: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6', background: '#ffffff', text: '#1f2937' },
      green: { primary: '#059669', secondary: '#047857', accent: '#10b981', background: '#ffffff', text: '#1f2937' },
      purple: { primary: '#7c3aed', secondary: '#6d28d9', accent: '#8b5cf6', background: '#ffffff', text: '#1f2937' },
      orange: { primary: '#ea580c', secondary: '#c2410c', accent: '#f97316', background: '#ffffff', text: '#1f2937' },
      red: { primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444', background: '#ffffff', text: '#1f2937' }
    };

    const selectedColors = colorSchemes[params.preferences.colorScheme];

    // Parse projects from user input
    const projects = this.parseProjectsFromInput(params.projects, params.skills);
    
    // Parse experience from user input
    const experience = this.parseExperienceFromInput(params.experience);
    
    // Parse achievements and integrate them
    const achievements = this.parseAchievementsFromInput(params.achievements);

    return {
      personalInfo: params.personalInfo,
      sections: {
        about: this.generateAboutSection(params),
        projects: projects,
        experience: experience,
        education: this.generateEducationSection(params),
        skills: {
          technical: params.skills.filter(skill => this.isTechnicalSkill(skill)).slice(0, 12),
          soft: this.generateSoftSkills(params).slice(0, 8),
          tools: this.generateToolsSkills(params).slice(0, 10)
        },
        testimonials: params.preferences.includeTestimonials ? this.generateTestimonials(params) : []
      },
      customizations: {
        colors: selectedColors,
        font: 'Inter',
        layout: params.preferences.style,
        theme: 'light'
      },
      seo: {
        title: `${params.personalInfo.name} - ${params.targetRole}`,
        description: `Professional portfolio of ${params.personalInfo.name}, ${params.targetRole}`,
        keywords: [params.personalInfo.name, params.targetRole, ...params.skills.slice(0, 5)]
      },
      slug: params.personalInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    };
  }

  private generateAboutSection(params: PortfolioGenerationParams): string {
    const { personalInfo, targetRole, skills, experience } = params;
    
    const topSkills = skills.slice(0, 3).join(', ');
    const experienceYears = this.extractExperienceYears(experience);
    
    let about = `I am ${personalInfo.name}, a dedicated ${targetRole}`;
    
    if (experienceYears > 0) {
      about += ` with ${experienceYears}+ years of experience`;
    }
    
    if (topSkills) {
      about += ` specializing in ${topSkills}`;
    }
    
    about += `. I am passionate about creating innovative solutions and delivering high-quality results. My experience has equipped me with strong technical and problem-solving skills, allowing me to tackle complex challenges and contribute effectively to any team.`;
    
    return about;
  }

  private parseProjectsFromInput(projectsInput: string, skills: string[]): Array<any> {
    if (!projectsInput || projectsInput.trim().length === 0) {
      return [];
    }

    const projects = [];
    const projectSections = projectsInput.split(/\n\s*\n|\n-|\n•/).filter(section => section.trim().length > 0);
    
    projectSections.forEach((section, index) => {
      const lines = section.trim().split('\n');
      const title = lines[0]?.replace(/^[-•]\s*/, '').trim() || `Project ${index + 1}`;
      
      // Extract description (everything after first line)
      const description = lines.slice(1).join(' ').trim() || 'Professional project showcasing technical skills and expertise.';
      
      // Match skills mentioned in the project description
      const relevantTech = skills.filter(skill => 
        section.toLowerCase().includes(skill.toLowerCase())
      ).slice(0, 4);
      
      // If no specific tech mentioned, use general skills
      const technologies = relevantTech.length > 0 ? relevantTech : skills.slice(0, 3);
      
      projects.push({
        id: `project${index + 1}`,
        title: title,
        description: description,
        technologies: technologies,
        liveUrl: '',
        githubUrl: '',
        imageUrl: this.getProjectImage(index),
        features: this.generateProjectFeatures(title, technologies)
      });
    });

    return projects.length > 0 ? projects : this.generateDefaultProjects(skills);
  }

  private parseExperienceFromInput(experienceInput: string): Array<any> {
    if (!experienceInput || experienceInput.trim().length === 0) {
      return [];
    }

    const experience = [];
    const experienceSections = experienceInput.split(/\n\s*\n|\n-|\n•/).filter(section => section.trim().length > 0);
    
    experienceSections.forEach((section, index) => {
      const lines = section.trim().split('\n');
      const firstLine = lines[0]?.replace(/^[-•]\s*/, '').trim() || '';
      
      // Try to extract job title and company
      let title = 'Professional Role';
      let company = 'Company';
      let duration = 'Duration';
      
      if (firstLine.includes(' at ')) {
        const parts = firstLine.split(' at ');
        title = parts[0].trim();
        company = parts[1].trim();
      } else if (firstLine.includes(' - ')) {
        const parts = firstLine.split(' - ');
        title = parts[0].trim();
        if (parts[1]) company = parts[1].trim();
      } else {
        title = firstLine;
      }
      
      // Extract duration if mentioned
      const durationMatch = section.match(/(\d{4}[-\s]*(?:to|-)?\s*(?:\d{4}|present|current))/i);
      if (durationMatch) {
        duration = durationMatch[1];
      }
      
      const description = lines.slice(1).join(' ').trim() || 'Responsible for key responsibilities and delivering quality results.';
      
      experience.push({
        id: `exp${index + 1}`,
        title: title,
        company: company,
        duration: duration,
        description: description,
        achievements: this.extractAchievements(section)
      });
    });

    return experience;
  }

  private parseAchievementsFromInput(achievementsInput: string): string[] {
    if (!achievementsInput || achievementsInput.trim().length === 0) {
      return [];
    }

    return achievementsInput
      .split(/\n|•|-/)
      .map(achievement => achievement.trim())
      .filter(achievement => achievement.length > 0)
      .slice(0, 6);
  }

  private generateEducationSection(params: PortfolioGenerationParams): Array<any> {
    // Since education is not provided in the form, generate a basic entry
    return [
      {
        id: 'edu1',
        degree: 'Relevant Education',
        school: 'Educational Institution',
        year: new Date().getFullYear().toString(),
        description: 'Focused on developing strong foundational knowledge and practical skills.'
      }
    ];
  }

  private generateSoftSkills(params: PortfolioGenerationParams): string[] {
    const softSkills = [
      'Problem Solving', 'Team Collaboration', 'Communication', 'Leadership',
      'Project Management', 'Critical Thinking', 'Adaptability', 'Time Management',
      'Creative Thinking', 'Attention to Detail', 'Customer Service', 'Mentoring'
    ];
    
    // Return skills relevant to the target role
    const roleBasedSkills = this.getRelevantSoftSkills(params.targetRole);
    return [...roleBasedSkills, ...softSkills.filter(skill => !roleBasedSkills.includes(skill))].slice(0, 8);
  }

  private generateToolsSkills(params: PortfolioGenerationParams): string[] {
    const allTools = ['Git', 'VS Code', 'Docker', 'AWS', 'Node.js', 'MongoDB', 'PostgreSQL', 'REST API', 'GraphQL', 'Jenkins'];
    
    // Filter tools that might be relevant to user's skills
    const relevantTools = allTools.filter(tool => 
      params.skills.some(skill => skill.toLowerCase().includes(tool.toLowerCase()))
    );
    
    return relevantTools.length > 0 ? relevantTools : allTools.slice(0, 6);
  }

  private generateTestimonials(params: PortfolioGenerationParams): Array<any> {
    return [
      {
        id: 'test1',
        name: 'Professional Colleague',
        role: 'Senior Team Member',
        company: 'Previous Organization',
        content: `${params.personalInfo.name} demonstrates excellent technical skills and professional dedication. A valuable team member who consistently delivers quality work.`
      }
    ];
  }

  private extractExperienceYears(experience: string): number {
    const yearMatches = experience.match(/(\d+)\s*(?:years?|yrs?)/i);
    if (yearMatches) {
      return parseInt(yearMatches[1]);
    }
    
    // Try to extract from date ranges
    const dateRanges = experience.match(/(\d{4})\s*[-to]\s*(\d{4}|present|current)/gi);
    if (dateRanges && dateRanges.length > 0) {
      let totalYears = 0;
      dateRanges.forEach(range => {
        const [start, end] = range.split(/[-to]/).map(s => s.trim());
        const startYear = parseInt(start);
        const endYear = end.toLowerCase().includes('present') || end.toLowerCase().includes('current') 
          ? new Date().getFullYear() 
          : parseInt(end);
        if (startYear && endYear) {
          totalYears += endYear - startYear;
        }
      });
      return Math.max(totalYears, 0);
    }
    
    return 0;
  }

  private isTechnicalSkill(skill: string): boolean {
    const technicalKeywords = [
      'javascript', 'python', 'java', 'react', 'node', 'sql', 'html', 'css', 'php', 'ruby',
      'angular', 'vue', 'mongodb', 'postgresql', 'mysql', 'docker', 'kubernetes', 'aws', 'azure',
      'git', 'jenkins', 'api', 'rest', 'graphql', 'microservices', 'cloud', 'devops'
    ];
    
    return technicalKeywords.some(keyword => 
      skill.toLowerCase().includes(keyword)
    );
  }

  private getRelevantSoftSkills(targetRole: string): string[] {
    const role = targetRole.toLowerCase();
    
    if (role.includes('manager') || role.includes('lead')) {
      return ['Leadership', 'Project Management', 'Team Collaboration', 'Communication'];
    } else if (role.includes('developer') || role.includes('engineer')) {
      return ['Problem Solving', 'Critical Thinking', 'Attention to Detail', 'Team Collaboration'];
    } else if (role.includes('designer')) {
      return ['Creative Thinking', 'Attention to Detail', 'Communication', 'Problem Solving'];
    } else if (role.includes('sales') || role.includes('marketing')) {
      return ['Communication', 'Customer Service', 'Problem Solving', 'Adaptability'];
    }
    
    return ['Problem Solving', 'Communication', 'Team Collaboration', 'Adaptability'];
  }

  private generateDefaultProjects(skills: string[]): Array<any> {
    return [
      {
        id: 'project1',
        title: 'Professional Project',
        description: 'A comprehensive project demonstrating technical expertise and problem-solving abilities.',
        technologies: skills.slice(0, 4),
        liveUrl: '',
        githubUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
        features: ['Professional Implementation', 'Best Practices', 'Quality Code']
      }
    ];
  }

  private generateProjectFeatures(title: string, technologies: string[]): string[] {
    const features = [
      'Responsive Design',
      'User-Friendly Interface',
      'Performance Optimized',
      'Modern Architecture',
      'Scalable Solution',
      'Best Practices Implementation'
    ];
    
    return features.slice(0, 3);
  }

  private getProjectImage(index: number): string {
    const images = [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800'
    ];
    
    return images[index % images.length];
  }

  private extractAchievements(text: string): string[] {
    // Look for bullet points or achievement indicators
    const achievements = text
      .split(/\n|•|-/)
      .map(line => line.trim())
      .filter(line => line.length > 10 && (
        line.includes('%') || 
        line.includes('increased') || 
        line.includes('improved') || 
        line.includes('reduced') ||
        line.includes('led') ||
        line.includes('managed') ||
        line.includes('delivered')
      ))
      .slice(0, 3);
    
    return achievements.length > 0 ? achievements : ['Delivered quality results and met project objectives'];
  }

  // Configuration methods (no longer using AI)
  isConfigured(): boolean {
    return true; // Always configured since we're not using AI
  }

  getConfigurationStatus(): { configured: boolean; message: string } {
    return {
      configured: true,
      message: 'Portfolio generation uses local processing only - no AI configuration required.'
    };
  }
}

// Export singleton instance
export const geminiPortfolioGenerator = new GeminiPortfolioGenerator();

// Export the main function for easy use
export const generatePortfolio = (params: PortfolioGenerationParams): Promise<PortfolioGenerationResult> => {
  return geminiPortfolioGenerator.generatePortfolio(params);
};