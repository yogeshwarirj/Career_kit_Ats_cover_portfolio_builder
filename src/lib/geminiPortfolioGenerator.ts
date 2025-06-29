import { GoogleGenerativeAI } from '@google/generative-ai';

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
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    this.initializeGemini();
  }

  private initializeGemini() {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
        console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('Gemini AI initialized for portfolio generation');
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
    }
  }

  private buildPortfolioPrompt(params: PortfolioGenerationParams): string {
    const colorSchemes = {
      blue: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6', background: '#ffffff', text: '#1f2937' },
      green: { primary: '#059669', secondary: '#047857', accent: '#10b981', background: '#ffffff', text: '#1f2937' },
      purple: { primary: '#7c3aed', secondary: '#6d28d9', accent: '#8b5cf6', background: '#ffffff', text: '#1f2937' },
      orange: { primary: '#ea580c', secondary: '#c2410c', accent: '#f97316', background: '#ffffff', text: '#1f2937' },
      red: { primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444', background: '#ffffff', text: '#1f2937' }
    };

    const selectedColors = colorSchemes[params.preferences.colorScheme];

    return `
You are an expert portfolio designer and content creator. Generate a comprehensive, professional portfolio based on the provided information.

PERSONAL INFORMATION:
Name: ${params.personalInfo.name}
Email: ${params.personalInfo.email}
Phone: ${params.personalInfo.phone}
Location: ${params.personalInfo.location}
LinkedIn: ${params.personalInfo.linkedin || 'Not provided'}
GitHub: ${params.personalInfo.github || 'Not provided'}
Website: ${params.personalInfo.website || 'Not provided'}

TARGET ROLE: ${params.targetRole}

EXPERIENCE BACKGROUND:
${params.experience}

SKILLS: ${params.skills.join(', ')}

PROJECTS DESCRIPTION:
${params.projects}

ACHIEVEMENTS:
${params.achievements}

PREFERENCES:
Style: ${params.preferences.style}
Color Scheme: ${params.preferences.colorScheme}
Include Testimonials: ${params.preferences.includeTestimonials}

Generate a complete portfolio in the following JSON format:

{
  "personalInfo": {
    "name": "${params.personalInfo.name}",
    "email": "${params.personalInfo.email}",
    "phone": "${params.personalInfo.phone}",
    "location": "${params.personalInfo.location}",
    "linkedin": "${params.personalInfo.linkedin || ''}",
    "github": "${params.personalInfo.github || ''}",
    "website": "${params.personalInfo.website || ''}"
  },
  "sections": {
    "about": "Professional about section (150-200 words) that showcases personality, passion, and value proposition",
    "projects": [
      {
        "id": "project1",
        "title": "Project Title",
        "description": "Detailed project description (100-150 words)",
        "technologies": ["tech1", "tech2", "tech3"],
        "liveUrl": "https://example.com",
        "githubUrl": "https://github.com/user/project",
        "imageUrl": "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800",
        "features": ["feature1", "feature2", "feature3"]
      }
    ],
    "experience": [
      {
        "id": "exp1",
        "title": "Job Title",
        "company": "Company Name",
        "duration": "Start Date - End Date",
        "description": "Role description (80-120 words)",
        "achievements": ["achievement1", "achievement2", "achievement3"]
      }
    ],
    "education": [
      {
        "id": "edu1",
        "degree": "Degree Name",
        "school": "Institution Name",
        "year": "Graduation Year",
        "description": "Optional description"
      }
    ],
    "skills": {
      "technical": ["skill1", "skill2", "skill3"],
      "soft": ["skill1", "skill2", "skill3"],
      "tools": ["tool1", "tool2", "tool3"]
    }${params.preferences.includeTestimonials ? `,
    "testimonials": [
      {
        "id": "test1",
        "name": "Person Name",
        "role": "Their Role",
        "company": "Their Company",
        "content": "Professional testimonial content (50-80 words)"
      }
    ]` : ''}
  },
  "customizations": {
    "colors": {
      "primary": "${selectedColors.primary}",
      "secondary": "${selectedColors.secondary}",
      "accent": "${selectedColors.accent}",
      "background": "${selectedColors.background}",
      "text": "${selectedColors.text}"
    },
    "font": "Inter",
    "layout": "${params.preferences.style}",
    "theme": "light"
  },
  "seo": {
    "title": "${params.personalInfo.name} - ${params.targetRole}",
    "description": "Professional portfolio of ${params.personalInfo.name}, ${params.targetRole}",
    "keywords": ["${params.personalInfo.name}", "${params.targetRole}", ...skills]
  },
  "slug": "${params.personalInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}"
}

IMPORTANT GUIDELINES:
1. Create 3-5 realistic projects based on the skills and experience provided
2. Generate professional, engaging content that reflects the target role
3. Use appropriate Unsplash URLs for project images (technology/coding related)
4. Make achievements quantifiable when possible
5. Ensure all content is professional and industry-appropriate
6. Create realistic company names and project details
7. Skills should be relevant to the target role and provided skills
8. If testimonials are requested, create 2-3 realistic professional testimonials

Return ONLY the JSON object, no additional text.
`;
  }

  private parseGeminiResponse(response: string): GeneratedPortfolio {
    try {
      // Clean the response to extract JSON
      let cleanedResponse = response.trim();
      
      // Remove any markdown code blocks
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find the JSON object in the response
      const jsonStart = cleanedResponse.indexOf('{');
      const jsonEnd = cleanedResponse.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No JSON object found in response');
      }
      
      const jsonString = cleanedResponse.substring(jsonStart, jsonEnd);
      const portfolio = JSON.parse(jsonString);
      
      // Validate required fields and provide defaults
      return {
        personalInfo: portfolio.personalInfo || {},
        sections: {
          about: portfolio.sections?.about || 'Professional summary to be added.',
          projects: Array.isArray(portfolio.sections?.projects) ? portfolio.sections.projects : [],
          experience: Array.isArray(portfolio.sections?.experience) ? portfolio.sections.experience : [],
          education: Array.isArray(portfolio.sections?.education) ? portfolio.sections.education : [],
          skills: portfolio.sections?.skills || { technical: [], soft: [], tools: [] },
          testimonials: Array.isArray(portfolio.sections?.testimonials) ? portfolio.sections.testimonials : []
        },
        customizations: portfolio.customizations || {
          colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6', background: '#ffffff', text: '#1f2937' },
          font: 'Inter',
          layout: 'modern',
          theme: 'light'
        },
        seo: portfolio.seo || { title: 'Portfolio', description: 'Professional Portfolio', keywords: [] },
        slug: portfolio.slug || 'portfolio'
      };
      
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error('Failed to parse AI response. Please try again.');
    }
  }

  async generatePortfolio(params: PortfolioGenerationParams): Promise<PortfolioGenerationResult> {
    try {
      if (!this.model) {
        return {
          success: false,
          error: 'Gemini AI is not configured. Please add your API key to the .env file.'
        };
      }

      const prompt = this.buildPortfolioPrompt(params);
      
      console.log('Generating portfolio with Gemini AI...');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from Gemini AI');
      }
      
      const portfolio = this.parseGeminiResponse(text);
      
      console.log('Portfolio generated successfully');
      
      return {
        success: true,
        portfolio
      };
      
    } catch (error) {
      console.error('Error generating portfolio:', error);
      
      let errorMessage = 'Failed to generate portfolio. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'Invalid Gemini API key. Please check your configuration.';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = 'API quota exceeded. Please try again later.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Fallback method for when API is not available
  generateFallbackPortfolio(params: PortfolioGenerationParams): GeneratedPortfolio {
    const colorSchemes = {
      blue: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6', background: '#ffffff', text: '#1f2937' },
      green: { primary: '#059669', secondary: '#047857', accent: '#10b981', background: '#ffffff', text: '#1f2937' },
      purple: { primary: '#7c3aed', secondary: '#6d28d9', accent: '#8b5cf6', background: '#ffffff', text: '#1f2937' },
      orange: { primary: '#ea580c', secondary: '#c2410c', accent: '#f97316', background: '#ffffff', text: '#1f2937' },
      red: { primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444', background: '#ffffff', text: '#1f2937' }
    };

    const selectedColors = colorSchemes[params.preferences.colorScheme];

    return {
      personalInfo: params.personalInfo,
      sections: {
        about: `I am a passionate ${params.targetRole} with expertise in ${params.skills.slice(0, 3).join(', ')}. I love creating innovative solutions and delivering high-quality results. My experience includes working on various projects that have helped me develop strong technical and problem-solving skills.`,
        projects: [
          {
            id: 'project1',
            title: 'Portfolio Website',
            description: 'A responsive portfolio website built with modern web technologies to showcase my work and skills.',
            technologies: params.skills.slice(0, 4),
            liveUrl: 'https://example.com',
            githubUrl: 'https://github.com/user/portfolio',
            imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
            features: ['Responsive Design', 'Modern UI/UX', 'Performance Optimized']
          },
          {
            id: 'project2',
            title: 'Web Application',
            description: 'A full-stack web application demonstrating my technical skills and ability to create complete solutions.',
            technologies: params.skills.slice(2, 6),
            liveUrl: 'https://example.com',
            githubUrl: 'https://github.com/user/webapp',
            imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
            features: ['User Authentication', 'Database Integration', 'API Development']
          }
        ],
        experience: [
          {
            id: 'exp1',
            title: params.targetRole,
            company: 'Previous Company',
            duration: '2022 - Present',
            description: 'Responsible for developing and maintaining applications using modern technologies and best practices.',
            achievements: ['Improved performance by 30%', 'Led team of 3 developers', 'Delivered projects on time']
          }
        ],
        education: [
          {
            id: 'edu1',
            degree: 'Bachelor of Science in Computer Science',
            school: 'University',
            year: '2022',
            description: 'Focused on software development and computer science fundamentals.'
          }
        ],
        skills: {
          technical: params.skills.slice(0, 8),
          soft: ['Problem Solving', 'Team Collaboration', 'Communication', 'Leadership'],
          tools: ['Git', 'VS Code', 'Docker', 'AWS']
        },
        testimonials: params.preferences.includeTestimonials ? [
          {
            id: 'test1',
            name: 'John Smith',
            role: 'Senior Developer',
            company: 'Tech Company',
            content: 'Excellent developer with strong technical skills and great attention to detail.'
          }
        ] : []
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

  // Check if Gemini is properly configured
  isConfigured(): boolean {
    return this.model !== null;
  }

  // Get configuration status
  getConfigurationStatus(): { configured: boolean; message: string } {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
      return {
        configured: false,
        message: 'Gemini API key not configured. Please add your API key to the .env file.'
      };
    }
    
    if (!this.model) {
      return {
        configured: false,
        message: 'Gemini AI failed to initialize. Please check your API key.'
      };
    }
    
    return {
      configured: true,
      message: 'Gemini AI is properly configured and ready to use.'
    };
  }
}

// Export singleton instance
export const geminiPortfolioGenerator = new GeminiPortfolioGenerator();

// Export the main function for easy use
export const generatePortfolio = (params: PortfolioGenerationParams): Promise<PortfolioGenerationResult> => {
  return geminiPortfolioGenerator.generatePortfolio(params);
};