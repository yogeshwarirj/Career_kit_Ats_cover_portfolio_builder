// Portfolio Generation and Management System
export interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  layout: 'modern' | 'creative' | 'minimal' | 'technical' | 'executive' | 'freelancer';
}

export interface PortfolioTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    surface: string;
    text: string;
    muted: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  level?: number; // 1-100
  icon?: string; // Lucide icon name
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  organization?: string;
  type: 'award' | 'certification' | 'recognition' | 'milestone';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  publishDate: string;
  tags: string[];
}

export interface PortfolioData {
  id: string;
  title: string;
  slug: string;
  template: string;
  theme: string;
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
    tagline?: string;
  };
  sections: {
    about: string;
    experience: Array<{
      id: string;
      title: string;
      company: string;
      startDate: string;
      endDate: string;
      description: string;
      current: boolean;
    }>;
    projects: Project[];
    skills: {
      technical: Skill[];
      soft: Skill[];
    };
    education: Array<{
      id: string;
      degree: string;
      school: string;
      graduationYear: string;
      gpa?: string;
    }>;
    certifications: Array<{
      id: string;
      name: string;
      issuer: string;
      date: string;
    }>;
    achievements: Achievement[];
    blogPosts: BlogPost[];
    contact: any;
  };
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
    layout: string;
    animations: boolean;
    darkMode: boolean;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  analytics: {
    googleAnalytics?: string;
    facebookPixel?: string;
  };
  isPublished: boolean;
  publishedUrl?: string;
  editCount: number;
  createdAt: string;
  lastModified: string;
}

export interface NetlifyDeployment {
  id: string;
  url: string;
  deployUrl: string;
  state: 'building' | 'ready' | 'error';
  createdAt: string;
  buildLog?: string[];
}

export class PortfolioGenerator {
  private static instance: PortfolioGenerator;
  private templates: PortfolioTemplate[];
  private themes: PortfolioTheme[];

  constructor() {
    this.templates = [
      {
        id: 'modern-professional',
        name: 'Modern Professional',
        description: 'Clean, contemporary design perfect for tech and business professionals',
        category: 'professional',
        features: ['Responsive Design', 'Dark/Light Mode', 'Project Showcase', 'Contact Form'],
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#0ea5e9'
        },
        layout: 'modern'
      },
      {
        id: 'creative-portfolio',
        name: 'Creative Portfolio',
        description: 'Bold, artistic design for designers, artists, and creative professionals',
        category: 'creative',
        features: ['Image Gallery', 'Animation Effects', 'Custom Layouts', 'Portfolio Grid'],
        colors: {
          primary: '#7c3aed',
          secondary: '#a855f7',
          accent: '#c084fc'
        },
        layout: 'creative'
      },
      {
        id: 'minimal-clean',
        name: 'Minimal Clean',
        description: 'Simple, distraction-free design that lets your work speak for itself',
        category: 'minimal',
        features: ['Clean Typography', 'Whitespace Focus', 'Fast Loading', 'Mobile First'],
        colors: {
          primary: '#059669',
          secondary: '#6b7280',
          accent: '#10b981'
        },
        layout: 'minimal'
      },
      {
        id: 'developer-focused',
        name: 'Developer Focused',
        description: 'Technical design optimized for software developers and engineers',
        category: 'technical',
        features: ['Code Snippets', 'GitHub Integration', 'Tech Stack Display', 'Project Demos'],
        colors: {
          primary: '#1f2937',
          secondary: '#374151',
          accent: '#60a5fa'
        },
        layout: 'technical'
      }
    ];

    this.themes = [
      {
        id: 'light',
        name: 'Light',
        description: 'Clean and bright theme',
        colors: {
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#1f2937',
          muted: '#6b7280'
        }
      },
      {
        id: 'dark',
        name: 'Dark',
        description: 'Modern dark theme',
        colors: {
          background: '#0f172a',
          surface: '#1e293b',
          text: '#f1f5f9',
          muted: '#94a3b8'
        }
      }
    ];
  }

  static getInstance(): PortfolioGenerator {
    if (!PortfolioGenerator.instance) {
      PortfolioGenerator.instance = new PortfolioGenerator();
    }
    return PortfolioGenerator.instance;
  }

  getTemplates(): PortfolioTemplate[] {
    return this.templates;
  }

  getThemes(): PortfolioTheme[] {
    return this.themes;
  }

  getTemplate(id: string): PortfolioTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  getTheme(id: string): PortfolioTheme | undefined {
    return this.themes.find(theme => theme.id === id);
  }

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  generatePortfolioHTML(portfolioData: PortfolioData): string {
    const template = this.getTemplate(portfolioData.template);
    const theme = this.getTheme(portfolioData.theme);

    if (!template || !theme) {
      throw new Error('Invalid template or theme');
    }

    return this.buildHTML(portfolioData, template, theme);
  }

  private buildHTML(portfolioData: PortfolioData, template: PortfolioTemplate, theme: PortfolioTheme): string {
    const { personalInfo, sections, customizations, seo } = portfolioData;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.title || `${personalInfo.name} - Portfolio`}</title>
    <meta name="description" content="${seo.description || `Professional portfolio of ${personalInfo.name}`}">
    <meta name="keywords" content="${seo.keywords.join(', ')}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${seo.title || `${personalInfo.name} - Portfolio`}">
    <meta property="og:description" content="${seo.description || sections.about}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${portfolioData.publishedUrl}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${personalInfo.name.charAt(0)}</text></svg>">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <style>
        ${this.generateCSS(portfolioData)}
    </style>
</head>
<body>
    ${this.generateBodyHTML(portfolioData, template, theme)}
    
    <!-- Scripts -->
    <script>
        ${this.generateJavaScript(portfolioData)}
    </script>
</body>
</html>`;
  }

  private generateCSS(portfolioData: PortfolioData): string {
    const { customizations } = portfolioData;
    const theme = this.getTheme(portfolioData.theme);

    return `
        :root {
            --color-primary: ${customizations.colors.primary};
            --color-secondary: ${customizations.colors.secondary};
            --color-accent: ${customizations.colors.accent};
            --color-background: ${theme?.colors.background};
            --color-surface: ${theme?.colors.surface};
            --color-text: ${theme?.colors.text};
            --color-muted: ${theme?.colors.muted};
            --font-heading: '${customizations.fonts.heading}', sans-serif;
            --font-body: '${customizations.fonts.body}', sans-serif;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: var(--font-body);
            background-color: var(--color-background);
            color: var(--color-text);
            line-height: 1.6;
        }

        /* Header & Navigation */
        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            z-index: 1000;
            padding: 0.75rem 0;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-family: var(--font-heading);
            font-size: 1.4rem;
            font-weight: 700;
            color: var(--color-primary);
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .logo:hover {
            transform: translateY(-1px);
            color: var(--color-accent);
        }

        .nav-links {
            display: flex;
            list-style: none;
            gap: 1.5rem;
        }

        .nav-links a {
            text-decoration: none;
            color: var(--color-text);
            font-weight: 400;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            position: relative;
            padding: 0.5rem 0;
        }

        .nav-links a:hover {
            color: var(--color-primary);
            transform: translateY(-1px);
        }

        .nav-links a::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
            transition: width 0.3s ease;
            border-radius: 1px;
        }

        .nav-links a:hover::after {
            width: 100%;
        }

        .social-links {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .social-link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--color-muted);
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 400;
            transition: all 0.3s ease;
            padding: 0.5rem;
            border-radius: 0.5rem;
        }

        .social-link:hover {
            color: var(--color-primary);
            background: var(--color-surface);
            transform: translateY(-1px);
        }

        /* Main Content */
        .main-content {
            margin-top: 70px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .section {
            padding: 2rem 0;
            min-height: auto;
            display: flex;
            align-items: center;
        }

        .section-content {
            width: 100%;
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading);
            font-weight: 600;
            line-height: 1.2;
            margin-bottom: 0.5rem;
        }

        h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
        }

        h2 {
            font-size: 2.5rem;
            color: var(--color-primary);
            margin-bottom: 1rem;
            text-align: center;
            position: relative;
        }

        h2::after {
            content: '';
            position: absolute;
            bottom: -0.5rem;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
            border-radius: 2px;
        }

        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
            color: white;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }

        .hero h1 {
            color: white;
            margin-bottom: 1rem;
            position: relative;
            z-index: 1;
        }

        .hero .tagline {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }

        .hero .contact-info {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1rem;
            flex-wrap: wrap;
            position: relative;
            z-index: 1;
        }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: white;
            text-decoration: none;
            opacity: 0.9;
            transition: all 0.3s ease;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }

        .contact-item:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }

        /* About Section */
        .about {
            background: var(--color-surface);
        }

        .about-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
            font-size: 1.2rem;
            line-height: 1.8;
        }

        /* Skills Section */
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .skill-category {
            background: white;
            padding: 1rem;
            border-radius: 1rem;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            border-left: 4px solid var(--color-primary);
        }

        .skill-category:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
        }

        .skill-category h3 {
            color: var(--color-primary);
            margin-bottom: 0.75rem;
            text-align: center;
            font-size: 1.5rem;
            font-weight: 700;
        }

        .skill-item {
            display: flex;
            align-items: center;
            margin-bottom: 0.75rem;
            padding: 0.75rem;
            background: var(--color-surface);
            border-radius: 1rem;
            transition: all 0.3s ease;
            border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .skill-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .skill-icon {
            width: 3.5rem;
            height: 3.5rem;
            background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
            border-radius: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 0.75rem;
            color: white;
            font-size: 1.2rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .skill-info {
            flex: 1;
        }

        .skill-name {
            font-weight: 700;
            margin-bottom: 0.25rem;
            font-size: 1.1rem;
            color: var(--color-text);
        }

        .skill-description {
            color: var(--color-muted);
            font-size: 0.95rem;
            margin-bottom: 0.25rem;
            line-height: 1.5;
        }

        .skill-level {
            width: 100%;
            height: 6px;
            background: #e5e7eb;
            border-radius: 3px;
            overflow: hidden;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .skill-level-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
            transition: width 0.5s ease;
            border-radius: 3px;
        }

        /* Projects Section */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .project-card {
            background: white;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .project-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .project-image {
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 3rem;
            position: relative;
            overflow: hidden;
        }

        .project-image::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.2"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
        }

        .project-content {
            padding: 1rem;
        }

        .project-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
            color: var(--color-primary);
        }

        .project-description {
            color: var(--color-muted);
            margin-bottom: 0.75rem;
            line-height: 1.6;
        }

        .project-tech {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
        }

        .tech-tag {
            background: linear-gradient(135deg, var(--color-surface), rgba(0, 0, 0, 0.02));
            color: var(--color-primary);
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.8rem;
            font-weight: 500;
            border: 1px solid rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }

        .tech-tag:hover {
            background: var(--color-primary);
            color: white;
            transform: translateY(-1px);
        }

        .project-links {
            display: flex;
            gap: 0.75rem;
        }

        .project-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--color-primary);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            padding: 0.5rem;
            border-radius: 0.5rem;
        }

        .project-link:hover {
            color: var(--color-accent);
            background: var(--color-surface);
            transform: translateY(-1px);
        }

        /* Experience Section */
        .experience-timeline {
            position: relative;
            margin-top: 1.5rem;
        }

        .experience-timeline::before {
            content: '';
            position: absolute;
            left: 1.5rem;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(180deg, var(--color-primary), var(--color-accent));
            border-radius: 1px;
        }

        .experience-item {
            position: relative;
            margin-bottom: 1.5rem;
            margin-left: 3rem;
            background: white;
            padding: 1rem;
            border-radius: 1rem;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }

        .experience-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
        }

        .experience-item::before {
            content: '';
            position: absolute;
            left: -2.25rem;
            top: 1rem;
            width: 1rem;
            height: 1rem;
            background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .experience-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.5rem;
        }

        .experience-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--color-primary);
        }

        .experience-company {
            font-weight: 500;
            color: var(--color-text);
        }

        .experience-date {
            color: var(--color-muted);
            font-size: 0.9rem;
            background: var(--color-surface);
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            border: 1px solid rgba(0, 0, 0, 0.05);
        }

        /* Education Section */
        .education-timeline {
            position: relative;
            margin-top: 1.5rem;
        }

        .education-timeline::before {
            content: '';
            position: absolute;
            left: 1.5rem;
            top: 0;
            bottom: 0;
            width: 2px;
            background: var(--color-secondary);
        }

        .education-item {
            position: relative;
            margin-bottom: 1rem;
            margin-left: 3rem;
            background: white;
            padding: 1rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .education-item::before {
            content: '';
            position: absolute;
            left: -2.25rem;
            top: 1rem;
            width: 1rem;
            height: 1rem;
            background: var(--color-secondary);
            border-radius: 50%;
            border: 3px solid white;
        }

        .education-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .education-degree {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--color-primary);
            margin-bottom: 0.25rem;
        }

        .education-school {
            font-weight: 500;
            color: var(--color-text);
            margin-bottom: 0.125rem;
        }

        .education-gpa {
            font-size: 0.9rem;
            color: var(--color-muted);
        }

        .education-year {
            color: var(--color-muted);
            font-size: 0.9rem;
            font-weight: 500;
        }

        /* Certifications Section */
        .certifications-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .certification-card {
            background: white;
            padding: 1rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: transform 0.3s ease;
            border-left: 4px solid var(--color-accent);
        }

        .certification-card:hover {
            transform: translateY(-3px);
        }

        .certification-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .certification-name {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--color-primary);
            margin-bottom: 0.25rem;
        }

        .certification-issuer {
            color: var(--color-text);
            margin-bottom: 0.25rem;
        }

        .certification-date {
            color: var(--color-muted);
            font-size: 0.9rem;
        }

        /* Achievements Section */
        .achievements-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .achievement-card {
            background: white;
            padding: 1rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: transform 0.3s ease;
        }

        .achievement-card:hover {
            transform: translateY(-3px);
        }

        .achievement-icon {
            width: 4rem;
            height: 4rem;
            background: var(--color-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 0.5rem;
            color: white;
            font-size: 1.5rem;
        }

        /* Blog Section */
        .blog-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .blog-card {
            background: white;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .blog-card:hover {
            transform: translateY(-3px);
        }

        .blog-content {
            padding: 1rem;
        }

        .blog-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
            color: var(--color-primary);
        }

        .blog-excerpt {
            color: var(--color-muted);
            margin-bottom: 0.75rem;
            line-height: 1.6;
        }

        .blog-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.9rem;
            color: var(--color-muted);
        }

        /* Contact Section */
        .contact {
            background: var(--color-surface);
            text-align: center;
        }

        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .contact-card {
            background: white;
            padding: 1rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .contact-icon {
            width: 3rem;
            height: 3rem;
            background: var(--color-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 0.5rem;
            color: white;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .nav-links, .social-links {
                display: none;
            }
            
            .header {
                padding: 0.5rem 0;
            }
            
            .main-content {
                margin-top: 60px;
            }
            
            h1 {
                font-size: 2.5rem;
            }
            
            h2 {
                font-size: 2rem;
            }
            
            .hero .tagline {
                font-size: 1.2rem;
            }
            
            .hero .contact-info {
                flex-direction: column;
                gap: 1rem;
            }
            
            .container {
                padding: 0 1rem;
            }
            
            .section {
                padding: 3rem 0;
                min-height: auto;
            }
            
            .skills-grid {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            
            .skill-category {
                padding: 2rem;
            }
            
            .skill-item {
                padding: 1rem;
                margin-bottom: 1.5rem;
            }
            
            .skill-icon {
                width: 3rem;
                height: 3rem;
                margin-right: 1rem;
            }
            
            .experience-timeline::before {
                left: 0.75rem;
            }
            
            .experience-item {
                margin-left: 1.5rem;
            }
            
            .experience-item::before {
                left: -1.5rem;
            }
            
            .education-timeline::before {
                left: 0.75rem;
            }
            
            .education-item {
                margin-left: 1.5rem;
            }
            
            .education-item::before {
                left: -1.5rem;
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

        .fade-in-up {
            animation: fadeInUp 0.6s ease-out;
        }

        /* Utility Classes */
        .text-center {
            text-align: center;
        }

        .mb-4 {
            margin-bottom: 1rem;
        }

        .mb-8 {
            margin-bottom: 2rem;
        }
    `;
  }

  private generateBodyHTML(portfolioData: PortfolioData, template: PortfolioTemplate, theme: PortfolioTheme): string {
    const { personalInfo, sections } = portfolioData;

    return `
        <!-- Header -->
        <header class="header">
            <div class="nav-container">
                <a href="#home" class="logo">${personalInfo.name}</a>
                <nav>
                    <ul class="nav-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#skills">Skills</a></li>
                        <li><a href="#projects">Projects</a></li>
                        <li><a href="#experience">Experience</a></li>
                        ${sections.education && sections.education.length > 0 ? '<li><a href="#education">Education</a></li>' : ''}
                        ${sections.certifications && sections.certifications.length > 0 ? '<li><a href="#certifications">Certifications</a></li>' : ''}
                        <li><a href="#achievements">Achievements</a></li>
                        <li><a href="#blog">Blog</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
                
                <div class="social-links">
                    ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="social-link">💼 LinkedIn</a>` : ''}
                    ${personalInfo.github ? `<a href="${personalInfo.github}" target="_blank" rel="noopener noreferrer" class="social-link">🔗 GitHub</a>` : ''}
                    ${personalInfo.website ? `<a href="${personalInfo.website}" target="_blank" rel="noopener noreferrer" class="social-link">🌐 Portfolio</a>` : ''}
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Hero Section -->
            <section id="home" class="section hero">
                <div class="container">
                    <div class="section-content">
                        <h1>${personalInfo.name}</h1>
                        ${personalInfo.tagline ? `<p class="tagline">${personalInfo.tagline}</p>` : ''}
                        <div class="contact-info">
                            ${personalInfo.email ? `<a href="mailto:${personalInfo.email}" class="contact-item">📧 ${personalInfo.email}</a>` : ''}
                            ${personalInfo.phone ? `<a href="tel:${personalInfo.phone}" class="contact-item">📱 ${personalInfo.phone}</a>` : ''}
                            ${personalInfo.location ? `<span class="contact-item">📍 ${personalInfo.location}</span>` : ''}
                            ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank" class="contact-item">💼 LinkedIn</a>` : ''}
                            ${personalInfo.github ? `<a href="${personalInfo.github}" target="_blank" class="contact-item">🔗 GitHub</a>` : ''}
                        </div>
                    </div>
                </div>
            </section>

            <!-- About Section -->
            <section id="about" class="section about">
                <div class="container">
                    <div class="section-content">
                        <h2>About Me</h2>
                        <div class="about-content">
                            <p>${sections.about}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Skills Section -->
            <section id="skills" class="section">
                <div class="container">
                    <div class="section-content">
                        <h2>Technical Proficiencies</h2>
                        <div class="skills-grid">
                            ${sections.skills.technical && sections.skills.technical.length > 0 ? `
                            <div class="skill-category">
                                <h3>Technical Skills</h3>
                                ${sections.skills.technical.filter(skill => skill && (typeof skill === 'string' ? skill.trim() : skill.name)).map(skill => {
                                    const skillName = typeof skill === 'string' ? skill : skill.name;
                                    const skillDescription = typeof skill === 'object' ? skill.description : '';
                                    const skillLevel = typeof skill === 'object' ? skill.level : null;
                                    const skillIcon = typeof skill === 'object' ? skill.icon : 'code';
                                    
                                    return `
                                <div class="skill-item">
                                    <div class="skill-icon">
                                        ${this.getSkillIcon(skillIcon)}
                                    </div>
                                    <div class="skill-info">
                                        <div class="skill-name">${skillName}</div>
                                        ${skillDescription ? `<div class="skill-description">${skillDescription}</div>` : ''}
                                        ${skillLevel ? `
                                        <div class="skill-level">
                                            <div class="skill-level-fill" style="width: ${skillLevel}%"></div>
                                        </div>
                                        ` : ''}
                                    </div>
                                </div>
                                `;
                                }).join('')}
                            </div>
                            ` : ''}
                            
                            ${sections.skills.soft && sections.skills.soft.length > 0 ? `
                            <div class="skill-category">
                                <h3>Soft Skills</h3>
                                ${sections.skills.soft.filter(skill => skill && (typeof skill === 'string' ? skill.trim() : skill.name)).map(skill => {
                                    const skillName = typeof skill === 'string' ? skill : skill.name;
                                    const skillDescription = typeof skill === 'object' ? skill.description : '';
                                    const skillLevel = typeof skill === 'object' ? skill.level : null;
                                    const skillIcon = typeof skill === 'object' ? skill.icon : 'users';
                                    
                                    return `
                                <div class="skill-item">
                                    <div class="skill-icon">
                                        ${this.getSkillIcon(skillIcon)}
                                    </div>
                                    <div class="skill-info">
                                        <div class="skill-name">${skillName}</div>
                                        ${skillDescription ? `<div class="skill-description">${skillDescription}</div>` : ''}
                                        ${skillLevel ? `
                                        <div class="skill-level">
                                            <div class="skill-level-fill" style="width: ${skillLevel}%"></div>
                                        </div>
                                        ` : ''}
                                    </div>
                                </div>
                                `;
                                }).join('')}
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </section>

            <!-- Projects Section -->
            ${sections.projects && sections.projects.length > 0 ? `
            <section id="projects" class="section">
                <div class="container">
                    <div class="section-content">
                        <h2>Projects</h2>
                        <div class="projects-grid">
                            ${sections.projects.filter(project => project && project.title).map(project => `
                            <div class="project-card">
                                <div class="project-image">
                                    🚀
                                </div>
                                <div class="project-content">
                                    <h3 class="project-title">${project.title}</h3>
                                    <p class="project-description">${project.description || ''}</p>
                                    <div class="project-tech">
                                        ${(project.technologies || []).filter(tech => tech && tech.trim()).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                                    </div>
                                    <div class="project-links">
                                        ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="project-link">🔗 Live Demo</a>` : ''}
                                        ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-link">📂 GitHub</a>` : ''}
                                    </div>
                                </div>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- Experience Section -->
            ${sections.experience && sections.experience.length > 0 ? `
            <section id="experience" class="section">
                <div class="container">
                    <div class="section-content">
                        <h2>Experience</h2>
                        <div class="experience-timeline">
                            ${sections.experience.filter(exp => exp && exp.title && exp.company).map(exp => `
                            <div class="experience-item">
                                <div class="experience-header">
                                    <div>
                                        <h3 class="experience-title">${exp.title}</h3>
                                        <p class="experience-company">${exp.company}</p>
                                    </div>
                                    <span class="experience-date">${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}</span>
                                </div>
                                <p>${exp.description || ''}</p>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- Education Section -->
            ${sections.education && sections.education.length > 0 ? `
            <section id="education" class="section">
                <div class="container">
                    <div class="section-content">
                        <h2>Education</h2>
                        <div class="education-timeline">
                            ${sections.education.filter(edu => edu && edu.degree && edu.school).map(edu => `
                            <div class="education-item">
                                <div class="education-header">
                                    <div>
                                        <h3 class="education-degree">${edu.degree}</h3>
                                        <p class="education-school">${edu.school}</p>
                                        ${edu.gpa ? `<p class="education-gpa">GPA: ${edu.gpa}</p>` : ''}
                                    </div>
                                    <span class="education-year">${edu.graduationYear || ''}</span>
                                </div>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- Certifications Section -->
            ${sections.certifications && sections.certifications.length > 0 ? `
            <section id="certifications" class="section">
                <div class="container">
                    <div class="section-content">
                        <h2>Certifications</h2>
                        <div class="certifications-grid">
                            ${sections.certifications.filter(cert => cert && cert.name).map(cert => `
                            <div class="certification-card">
                                <div class="certification-icon">
                                    🏆
                                </div>
                                <h3 class="certification-name">${cert.name}</h3>
                                <p class="certification-issuer">${cert.issuer || ''}</p>
                                <span class="certification-date">${cert.date || ''}</span>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- Achievements Section -->
            ${sections.achievements && sections.achievements.length > 0 ? `
            <section id="achievements" class="section">
                <div class="container">
                    <div class="section-content">
                        <h2>Achievements</h2>
                        <div class="achievements-grid">
                            ${sections.achievements.filter(achievement => achievement && achievement.title).map(achievement => `
                            <div class="achievement-card">
                                <div class="achievement-icon">
                                    ${this.getAchievementIcon(achievement.type || 'award')}
                                </div>
                                <h3>${achievement.title}</h3>
                                <p>${achievement.description || ''}</p>
                                <small>${achievement.date || ''} ${achievement.organization ? `• ${achievement.organization}` : ''}</small>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- Blog Section -->
            ${sections.blogPosts && sections.blogPosts.length > 0 ? `
            <section id="blog" class="section">
                <div class="container">
                    <div class="section-content">
                        <h2>Latest Blog Posts</h2>
                        <div class="blog-grid">
                            ${sections.blogPosts.filter(post => post && post.title).map(post => `
                            <div class="blog-card">
                                <div class="blog-content">
                                    <h3 class="blog-title">${post.title}</h3>
                                    <p class="blog-excerpt">${post.excerpt || ''}</p>
                                    <div class="blog-meta">
                                        <span>${post.publishDate || ''}</span>
                                        ${post.url ? `<a href="${post.url}" target="_blank" class="project-link">Read More →</a>` : ''}
                                    </div>
                                </div>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- Contact Section -->
            <section id="contact" class="section contact">
                <div class="container">
                    <div class="section-content">
                        <h2>Get In Touch</h2>
                        <p>Let's work together to bring your ideas to life!</p>
                        <div class="contact-grid">
                            ${personalInfo.email ? `
                            <div class="contact-card">
                                <div class="contact-icon">📧</div>
                                <h3>Email</h3>
                                <a href="mailto:${personalInfo.email}">${personalInfo.email}</a>
                            </div>
                            ` : ''}
                            ${personalInfo.phone ? `
                            <div class="contact-card">
                                <div class="contact-icon">📱</div>
                                <h3>Phone</h3>
                                <a href="tel:${personalInfo.phone}">${personalInfo.phone}</a>
                            </div>
                            ` : ''}
                            ${personalInfo.linkedin ? `
                            <div class="contact-card">
                                <div class="contact-icon">💼</div>
                                <h3>LinkedIn</h3>
                                <a href="${personalInfo.linkedin}" target="_blank">Connect</a>
                            </div>
                            ` : ''}
                            ${personalInfo.github ? `
                            <div class="contact-card">
                                <div class="contact-icon">🔗</div>
                                <h3>GitHub</h3>
                                <a href="${personalInfo.github}" target="_blank">Follow</a>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    `;
  }

  private getSkillIcon(iconName: string): string {
    const icons: { [key: string]: string } = {
      'code': '💻',
      'database': '🗄️',
      'design': '🎨',
      'mobile': '📱',
      'cloud': '☁️',
      'security': '🔒',
      'analytics': '📊',
      'users': '👥',
      'communication': '💬',
      'leadership': '👑',
      'problem-solving': '🧩',
      'creativity': '💡'
    };
    return icons[iconName] || '⚡';
  }

  private getAchievementIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'award': '🏆',
      'certification': '📜',
      'recognition': '⭐',
      'milestone': '🎯'
    };
    return icons[type] || '🏆';
  }

  private generateJavaScript(portfolioData: PortfolioData): string {
    return `
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

        // Animate skill levels on scroll
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillLevels = entry.target.querySelectorAll('.skill-level-fill');
                    skillLevels.forEach(level => {
                        const width = level.style.width;
                        level.style.width = '0%';
                        setTimeout(() => {
                            level.style.width = width;
                        }, 100);
                    });
                }
            });
        }, observerOptions);

        const skillsSection = document.querySelector('#skills');
        if (skillsSection) {
            observer.observe(skillsSection);
        }

        // Add fade-in animation to sections
        const sections = document.querySelectorAll('.section');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Update active navigation link
        const navLinks = document.querySelectorAll('.nav-links a');
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => {
            navObserver.observe(section);
        });
    `;
  }

  optimizeForSEO(portfolioData: PortfolioData): PortfolioData {
    const optimized = { ...portfolioData };

    if (!optimized.seo.title) {
      optimized.seo.title = `${optimized.personalInfo.name} - Professional Portfolio`;
    }

    if (!optimized.seo.description) {
      optimized.seo.description = optimized.sections.about.substring(0, 160);
    }

    if (optimized.seo.keywords.length === 0) {
      const keywords = [
        optimized.personalInfo.name,
        ...optimized.sections.skills.technical.map(s => s.name).slice(0, 5),
        ...optimized.sections.skills.soft.map(s => s.name).slice(0, 3),
        'portfolio',
        'professional'
      ];
      optimized.seo.keywords = keywords;
    }

    return optimized;
  }

  async deployToNetlify(portfolioData: PortfolioData): Promise<NetlifyDeployment> {
    // Simulate Netlify deployment
    const deploymentId = Date.now().toString();
    
    // Generate HTML and assets
    const html = this.generatePortfolioHTML(portfolioData);
    
    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 3000));

    const deployment: NetlifyDeployment = {
      id: deploymentId,
      url: `https://${portfolioData.slug}.netlify.app`,
      deployUrl: `https://${deploymentId}--${portfolioData.slug}.netlify.app`,
      state: 'ready',
      createdAt: new Date().toISOString(),
      buildLog: [
        'Starting build...',
        'Generating HTML...',
        'Optimizing assets...',
        'Deploying to CDN...',
        'Build complete!'
      ]
    };

    return deployment;
  }
}

// Export singleton instance
export const portfolioGenerator = PortfolioGenerator.getInstance();

// Default portfolio data
export const defaultPortfolioData: PortfolioData = {
  id: '',
  title: '',
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
    twitter: '',
    tagline: ''
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
    achievements: [],
    blogPosts: [],
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
  publishedUrl: '',
  editCount: 0,
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString()
};