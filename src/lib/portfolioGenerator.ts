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

export interface PortfolioSection {
  id: string;
  name: string;
  type: 'text' | 'list' | 'grid' | 'timeline';
  content: any;
  visible: boolean;
  order: number;
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
  };
  sections: {
    about: string;
    experience: any[];
    projects: any[];
    skills: {
      technical: string[];
      soft: string[];
    };
    education: any[];
    certifications: any[];
    testimonials: any[];
    blogPosts: any[];
    achievements: any[];
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
      },
      {
        id: 'business-executive',
        name: 'Business Executive',
        description: 'Professional design for executives, consultants, and business leaders',
        category: 'executive',
        features: ['Professional Layout', 'Achievement Focus', 'Testimonials', 'Case Studies'],
        colors: {
          primary: '#dc2626',
          secondary: '#991b1b',
          accent: '#f87171'
        },
        layout: 'executive'
      },
      {
        id: 'freelancer-showcase',
        name: 'Freelancer Showcase',
        description: 'Versatile design perfect for freelancers and independent professionals',
        category: 'freelancer',
        features: ['Service Showcase', 'Client Testimonials', 'Pricing Tables', 'Contact Forms'],
        colors: {
          primary: '#ea580c',
          secondary: '#c2410c',
          accent: '#fb923c'
        },
        layout: 'freelancer'
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
      },
      {
        id: 'corporate-blue',
        name: 'Corporate Blue',
        description: 'Professional blue theme',
        colors: {
          background: '#f8fafc',
          surface: '#e2e8f0',
          text: '#1e293b',
          muted: '#475569'
        }
      },
      {
        id: 'creative-gradient',
        name: 'Creative Gradient',
        description: 'Vibrant gradient theme',
        colors: {
          background: '#fef7ff',
          surface: '#f3e8ff',
          text: '#581c87',
          muted: '#7c3aed'
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

  /**
   * Get all available templates
   */
  getTemplates(): PortfolioTemplate[] {
    return this.templates;
  }

  /**
   * Get all available themes
   */
  getThemes(): PortfolioTheme[] {
    return this.themes;
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): PortfolioTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  /**
   * Get theme by ID
   */
  getTheme(id: string): PortfolioTheme | undefined {
    return this.themes.find(theme => theme.id === id);
  }

  /**
   * Generate portfolio HTML from data
   */
  generatePortfolioHTML(portfolioData: PortfolioData): string {
    const template = this.getTemplate(portfolioData.template);
    const theme = this.getTheme(portfolioData.theme);

    if (!template || !theme) {
      throw new Error('Invalid template or theme');
    }

    return this.buildHTML(portfolioData, template, theme);
  }

  /**
   * Generate portfolio slug from name
   */
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Validate portfolio slug uniqueness
   */
  async validateSlug(slug: string, excludeId?: string): Promise<{ valid: boolean; suggestion?: string }> {
    // Simulate server-side validation
    await new Promise(resolve => setTimeout(resolve, 500));

    // In production, this would check against a database
    const existingSlugs = ['john-doe', 'jane-smith', 'alex-johnson'];
    
    if (existingSlugs.includes(slug) && excludeId !== slug) {
      return {
        valid: false,
        suggestion: `${slug}-${Math.floor(Math.random() * 1000)}`
      };
    }

    return { valid: true };
  }

  /**
   * Deploy portfolio to Netlify
   */
  async deployToNetlify(portfolioData: PortfolioData): Promise<NetlifyDeployment> {
    // Simulate Netlify deployment
    const deploymentId = Date.now().toString();
    
    // Generate HTML and assets
    const html = this.generatePortfolioHTML(portfolioData);
    const css = this.generateCSS(portfolioData);
    
    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 3000));

    const deployment: NetlifyDeployment = {
      id: deploymentId,
      url: `https://careerkit-portfolios.netlify.app/${portfolioData.slug}`,
      deployUrl: `https://${deploymentId}--careerkit-portfolios.netlify.app`,
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

  /**
   * Generate SEO-optimized HTML
   */
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
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seo.title || `${personalInfo.name} - Portfolio`}">
    <meta name="twitter:description" content="${seo.description || sections.about}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${personalInfo.name.charAt(0)}</text></svg>">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <style>
        ${this.generateCSS(portfolioData)}
    </style>
    
    ${portfolioData.analytics.googleAnalytics ? `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${portfolioData.analytics.googleAnalytics}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${portfolioData.analytics.googleAnalytics}');
    </script>
    ` : ''}
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

  /**
   * Generate CSS for portfolio
   */
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

        body {
            font-family: var(--font-body);
            background-color: var(--color-background);
            color: var(--color-text);
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading);
            font-weight: 600;
            line-height: 1.2;
        }

        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
            color: white;
        }

        .section {
            padding: 4rem 0;
        }

        .section-title {
            font-size: 2.5rem;
            margin-bottom: 2rem;
            color: var(--color-primary);
        }

        .card {
            background: var(--color-surface);
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
        }

        .skill-tag {
            display: inline-block;
            background: var(--color-primary);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            margin: 0.25rem;
            font-size: 0.875rem;
        }

        .btn {
            display: inline-block;
            background: var(--color-primary);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .btn:hover {
            background: var(--color-secondary);
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .container {
                padding: 0 1rem;
            }
            
            .section-title {
                font-size: 2rem;
            }
            
            .hero {
                min-height: 80vh;
            }
        }

        ${customizations.animations ? `
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            animation: fadeInUp 0.6s ease forwards;
        }

        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        ` : ''}
    `;
  }

  /**
   * Generate body HTML based on template
   */
  private generateBodyHTML(portfolioData: PortfolioData, template: PortfolioTemplate, theme: PortfolioTheme): string {
    const { personalInfo, sections } = portfolioData;

    switch (template.layout) {
      case 'modern':
        return this.generateModernLayout(portfolioData);
      case 'creative':
        return this.generateCreativeLayout(portfolioData);
      case 'minimal':
        return this.generateMinimalLayout(portfolioData);
      case 'technical':
        return this.generateTechnicalLayout(portfolioData);
      case 'executive':
        return this.generateExecutiveLayout(portfolioData);
      case 'freelancer':
        return this.generateFreelancerLayout(portfolioData);
      default:
        return this.generateModernLayout(portfolioData);
    }
  }

  /**
   * Generate JavaScript for portfolio
   */
  private generateJavaScript(portfolioData: PortfolioData): string {
    return `
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Contact form handling
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // Handle form submission
                alert('Thank you for your message! I will get back to you soon.');
            });
        }

        ${portfolioData.customizations.animations ? `
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
        ` : ''}
    `;
  }

  /**
   * Generate modern layout HTML
   */
  private generateModernLayout(portfolioData: PortfolioData): string {
    const { personalInfo, sections } = portfolioData;

    return `
        <!-- Hero Section -->
        <section class="hero">
            <div class="container">
                <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">${personalInfo.name}</h1>
                <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">${personalInfo.email}</p>
                <a href="#about" class="btn">Learn More</a>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="section">
            <div class="container">
                <h2 class="section-title">About Me</h2>
                <div class="card">
                    <p style="font-size: 1.125rem;">${sections.about}</p>
                </div>
            </div>
        </section>

        <!-- Skills Section -->
        <section id="skills" class="section" style="background: var(--color-surface);">
            <div class="container">
                <h2 class="section-title">Skills</h2>
                <div class="card">
                    <h3 style="margin-bottom: 1rem;">Technical Skills</h3>
                    <div>
                        ${sections.skills.technical?.map(skill => `<span class="skill-tag">${skill}</span>`).join('') || ''}
                    </div>
                    ${sections.skills.soft?.length ? `
                    <h3 style="margin: 2rem 0 1rem 0;">Soft Skills</h3>
                    <div>
                        ${sections.skills.soft.map(skill => `<span class="skill-tag" style="background: var(--color-secondary);">${skill}</span>`).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        </section>

        <!-- Experience Section -->
        ${(sections.experience && sections.experience.length > 0) || (sections.workExperience && sections.workExperience.length > 0) ? `
        <section id="experience" class="section">
            <div class="container">
                <h2 class="section-title">Experience</h2>
                ${(sections.experience || sections.workExperience || []).map(exp => `
                <div class="card">
                    <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">${exp.title || exp.position || 'Position'}</h3>
                    <p style="font-weight: 500; margin-bottom: 0.5rem;">${exp.company || 'Company'}</p>
                    <p style="color: var(--color-muted); margin-bottom: 1rem;">${exp.startDate || ''} - ${exp.endDate || (exp.current ? 'Present' : '')}</p>
                    <p>${exp.description || ''}</p>
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        ${sections.projects && sections.projects.length > 0 ? `
        <section id="projects" class="section">
            <div class="container">
                <h2 class="section-title">Projects</h2>
                ${sections.projects.map(project => `
                <div class="card">
                    <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">${project.title}</h3>
                    <p style="margin-bottom: 1rem;">${project.description}</p>
                    ${project.technologies ? `
                    <div style="margin-bottom: 1rem;">
                        <strong>Technologies:</strong> ${Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                    </div>
                    ` : ''}
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="btn" style="font-size: 0.875rem; padding: 0.5rem 1rem;">Live Demo</a>` : ''}
                        ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="btn" style="font-size: 0.875rem; padding: 0.5rem 1rem; background: var(--color-secondary);">GitHub</a>` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <!-- Education Section -->
        ${sections.education && sections.education.length > 0 ? `
        <section id="education" class="section">
            <div class="container">
                <h2 class="section-title">Education</h2>
                ${sections.education.map(edu => `
                <div class="card">
                    <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">${edu.degree || 'Degree'}</h3>
                    <p style="font-weight: 500; margin-bottom: 0.5rem;">${edu.school || 'Institution'}</p>
                    <p style="color: var(--color-muted); margin-bottom: 1rem;">${edu.graduationYear || ''}</p>
                    ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <!-- Certifications Section -->
        ${sections.certifications && sections.certifications.length > 0 ? `
        <section id="certifications" class="section">
            <div class="container">
                <h2 class="section-title">Certifications</h2>
                ${sections.certifications.map(cert => `
                <div class="card">
                    <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">${cert.name || 'Certification'}</h3>
                    <p style="font-weight: 500; margin-bottom: 0.5rem;">${cert.issuer || 'Issuer'}</p>
                    <p style="color: var(--color-muted); margin-bottom: 1rem;">${cert.date || ''}</p>
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <!-- Blog Posts Section -->
        ${sections.blogPosts && sections.blogPosts.length > 0 ? `
        <section id="blog" class="section" style="background: var(--color-surface);">
            <div class="container">
                <h2 class="section-title">Latest Blog Posts</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                    ${sections.blogPosts.map(post => `
                    <div class="card">
                        <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">${post.title}</h3>
                        <p style="color: var(--color-muted); font-size: 0.875rem; margin-bottom: 1rem;">${post.date}</p>
                        <p style="margin-bottom: 1rem;">${post.excerpt || post.content?.substring(0, 150) + '...' || ''}</p>
                        ${post.tags && post.tags.length > 0 ? `
                        <div style="margin-bottom: 1rem;">
                            ${post.tags.map(tag => `<span style="background: var(--color-primary); color: white; padding: 0.25rem 0.5rem; border-radius: 1rem; font-size: 0.75rem; margin-right: 0.5rem;">${tag}</span>`).join('')}
                        </div>
                        ` : ''}
                        ${post.url ? `<a href="${post.url}" target="_blank" class="btn" style="font-size: 0.875rem; padding: 0.5rem 1rem;">Read More</a>` : ''}
                    </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}

        <!-- Achievements Section -->
        ${sections.achievements && sections.achievements.length > 0 ? `
        <section id="achievements" class="section">
            <div class="container">
                <h2 class="section-title">Achievements & Awards</h2>
                ${sections.achievements.map(achievement => `
                <div class="card">
                    <h3 style="color: var(--color-primary); margin-bottom: 0.5rem;">${achievement.title}</h3>
                    <p style="font-weight: 500; margin-bottom: 0.5rem;">${achievement.organization || achievement.issuer || ''}</p>
                    <p style="color: var(--color-muted); margin-bottom: 1rem;">${achievement.date}</p>
                    <p>${achievement.description}</p>
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <!-- Contact Section -->
        <section id="contact" class="section" style="background: var(--color-surface);">
            <div class="container">
                <h2 class="section-title">Get In Touch</h2>
                <div class="card" style="text-align: center;">
                    <p style="font-size: 1.125rem; margin-bottom: 2rem;">Let's work together!</p>
                    <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
                        <div>
                            <h4>Email</h4>
                            <p><a href="mailto:${personalInfo.email}" style="color: var(--color-primary);">${personalInfo.email}</a></p>
                        </div>
                        ${personalInfo.phone ? `
                        <div>
                            <h4>Phone</h4>
                            <p><a href="tel:${personalInfo.phone}" style="color: var(--color-primary);">${personalInfo.phone}</a></p>
                        </div>
                        ` : ''}
                        ${personalInfo.linkedin ? `
                        <div>
                            <h4>LinkedIn</h4>
                            <p><a href="${personalInfo.linkedin}" target="_blank" style="color: var(--color-primary);">Connect</a></p>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </section>
    `;
  }

  /**
   * Generate creative layout HTML
   */
  private generateCreativeLayout(portfolioData: PortfolioData): string {
    // Implementation for creative layout
    return this.generateModernLayout(portfolioData); // Fallback for now
  }

  /**
   * Generate minimal layout HTML
   */
  private generateMinimalLayout(portfolioData: PortfolioData): string {
    // Implementation for minimal layout
    return this.generateModernLayout(portfolioData); // Fallback for now
  }

  /**
   * Generate technical layout HTML
   */
  private generateTechnicalLayout(portfolioData: PortfolioData): string {
    // Implementation for technical layout
    return this.generateModernLayout(portfolioData); // Fallback for now
  }

  /**
   * Generate executive layout HTML
   */
  private generateExecutiveLayout(portfolioData: PortfolioData): string {
    // Implementation for executive layout
    return this.generateModernLayout(portfolioData); // Fallback for now
  }

  /**
   * Generate freelancer layout HTML
   */
  private generateFreelancerLayout(portfolioData: PortfolioData): string {
    // Implementation for freelancer layout
    return this.generateModernLayout(portfolioData); // Fallback for now
  }

  /**
   * Optimize portfolio for SEO
   */
  optimizeForSEO(portfolioData: PortfolioData): PortfolioData {
    const optimized = { ...portfolioData };

    // Generate SEO title if not provided
    if (!optimized.seo.title) {
      optimized.seo.title = `${optimized.personalInfo.name} - Professional Portfolio`;
    }

    // Generate SEO description if not provided
    if (!optimized.seo.description) {
      optimized.seo.description = optimized.sections.about.substring(0, 160);
    }

    // Generate keywords if not provided
    if (optimized.seo.keywords.length === 0) {
      const keywords = [
        optimized.personalInfo.name,
        ...optimized.sections.skills.technical.slice(0, 5),
        ...optimized.sections.skills.soft.slice(0, 3),
        'portfolio',
        'professional'
      ];
      optimized.seo.keywords = keywords;
    }

    return optimized;
  }

  /**
   * Generate portfolio performance report
   */
  generatePerformanceReport(portfolioData: PortfolioData): {
    score: number;
    metrics: {
      seo: number;
      performance: number;
      accessibility: number;
      bestPractices: number;
    };
    recommendations: string[];
  } {
    const seoScore = this.calculateSEOScore(portfolioData);
    const performanceScore = this.calculatePerformanceScore(portfolioData);
    const accessibilityScore = this.calculateAccessibilityScore(portfolioData);
    const bestPracticesScore = this.calculateBestPracticesScore(portfolioData);

    const overallScore = Math.round(
      (seoScore + performanceScore + accessibilityScore + bestPracticesScore) / 4
    );

    const recommendations = [];
    if (seoScore < 80) recommendations.push('Improve SEO metadata and content structure');
    if (performanceScore < 80) recommendations.push('Optimize images and reduce bundle size');
    if (accessibilityScore < 80) recommendations.push('Add alt text and improve color contrast');
    if (bestPracticesScore < 80) recommendations.push('Enable HTTPS and add security headers');

    return {
      score: overallScore,
      metrics: {
        seo: seoScore,
        performance: performanceScore,
        accessibility: accessibilityScore,
        bestPractices: bestPracticesScore
      },
      recommendations
    };
  }

  private calculateSEOScore(portfolioData: PortfolioData): number {
    let score = 100;
    
    if (!portfolioData.seo.title) score -= 20;
    if (!portfolioData.seo.description) score -= 20;
    if (portfolioData.seo.keywords.length === 0) score -= 15;
    if (!portfolioData.sections.about) score -= 15;
    if (portfolioData.sections.about.length < 100) score -= 10;
    
    return Math.max(0, score);
  }

  private calculatePerformanceScore(portfolioData: PortfolioData): number {
    let score = 100;
    
    // Simulate performance analysis
    if (portfolioData.customizations.animations) score -= 10;
    if (portfolioData.sections.experience.length > 10) score -= 5;
    if (portfolioData.sections.projects.length > 20) score -= 10;
    
    return Math.max(60, score);
  }

  private calculateAccessibilityScore(portfolioData: PortfolioData): number {
    let score = 100;
    
    // Simulate accessibility analysis
    if (!portfolioData.personalInfo.name) score -= 20;
    if (!portfolioData.sections.about) score -= 15;
    
    return Math.max(70, score);
  }

  private calculateBestPracticesScore(portfolioData: PortfolioData): number {
    let score = 100;
    
    // Simulate best practices analysis
    if (!portfolioData.personalInfo.email) score -= 10;
    if (!portfolioData.seo.title) score -= 10;
    
    return Math.max(80, score);
  }
}

// Export singleton instance
export const portfolioGenerator = PortfolioGenerator.getInstance();

// Default portfolio data to prevent undefined errors
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
  publishedUrl: '',
  editCount: 0,
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString()
};