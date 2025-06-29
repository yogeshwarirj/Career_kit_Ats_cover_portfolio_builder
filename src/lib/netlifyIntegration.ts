// Netlify Integration for Portfolio Hosting
export interface NetlifyConfig {
  apiToken?: string;
  siteId?: string;
  buildCommand: string;
  publishDirectory: string;
  functionsDirectory?: string;
}

export interface NetlifyDeployment {
  id: string;
  url: string;
  deployUrl: string;
  state: 'building' | 'ready' | 'error' | 'processing';
  createdAt: string;
  updatedAt: string;
  buildLog: string[];
  errorMessage?: string;
  screenshot?: string;
}

export interface NetlifySite {
  id: string;
  name: string;
  url: string;
  adminUrl: string;
  customDomain?: string;
  sslUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeploymentOptions {
  title?: string;
  branch?: string;
  draft?: boolean;
  production?: boolean;
}

export class NetlifyIntegration {
  private static instance: NetlifyIntegration;
  private baseUrl = 'https://api.netlify.com/api/v1';
  private config: NetlifyConfig;

  constructor(config: NetlifyConfig = {
    buildCommand: 'npm run build',
    publishDirectory: 'dist'
  }) {
    this.config = config;
  }

  static getInstance(config?: NetlifyConfig): NetlifyIntegration {
    if (!NetlifyIntegration.instance) {
      NetlifyIntegration.instance = new NetlifyIntegration(config);
    }
    return NetlifyIntegration.instance;
  }

  /**
   * Deploy portfolio to Netlify
   */
  async deployPortfolio(
    portfolioData: any,
    files: { [path: string]: string },
    options: DeploymentOptions = {}
  ): Promise<NetlifyDeployment> {
    try {
      // Simulate Netlify deployment process
      const deploymentId = this.generateDeploymentId();
      const siteName = this.generateSiteName(portfolioData.slug);
      
      // Create deployment
      const deployment = await this.createDeployment(deploymentId, siteName, files, options);
      
      // Simulate build process
      await this.simulateBuildProcess(deployment);
      
      return deployment;
    } catch (error) {
      console.error('Netlify deployment failed:', error);
      throw new Error('Failed to deploy portfolio to Netlify');
    }
  }

  /**
   * Create a new Netlify site
   */
  async createSite(siteName: string, options: any = {}): Promise<NetlifySite> {
    // Simulate site creation
    await new Promise(resolve => setTimeout(resolve, 1000));

    const site: NetlifySite = {
      id: this.generateSiteId(),
      name: siteName,
      url: `https://${siteName}.netlify.app`,
      adminUrl: `https://app.netlify.com/sites/${siteName}`,
      sslUrl: `https://${siteName}.netlify.app`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return site;
  }

  /**
   * Update existing deployment
   */
  async updateDeployment(
    deploymentId: string,
    files: { [path: string]: string },
    options: DeploymentOptions = {}
  ): Promise<NetlifyDeployment> {
    // Simulate deployment update
    await new Promise(resolve => setTimeout(resolve, 2000));

    const deployment: NetlifyDeployment = {
      id: deploymentId,
      url: `https://careerkit-portfolios.netlify.app`,
      deployUrl: `https://${deploymentId}--careerkit-portfolios.netlify.app`,
      state: 'ready',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      buildLog: [
        'Starting deployment update...',
        'Processing files...',
        'Building site...',
        'Deploying to CDN...',
        'Update complete!'
      ]
    };

    return deployment;
  }

  /**
   * Get deployment status
   */
  async getDeploymentStatus(deploymentId: string): Promise<NetlifyDeployment> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const deployment: NetlifyDeployment = {
      id: deploymentId,
      url: `https://careerkit-portfolios.netlify.app`,
      deployUrl: `https://${deploymentId}--careerkit-portfolios.netlify.app`,
      state: 'ready',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      buildLog: [
        'Build started',
        'Installing dependencies...',
        'Building site...',
        'Optimizing assets...',
        'Deploying to global CDN...',
        'Build complete!'
      ]
    };

    return deployment;
  }

  /**
   * Delete deployment
   */
  async deleteDeployment(deploymentId: string): Promise<boolean> {
    // Simulate deletion
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }

  /**
   * Get site analytics
   */
  async getSiteAnalytics(siteId: string, period: '7d' | '30d' | '90d' = '30d'): Promise<{
    pageViews: number;
    uniqueVisitors: number;
    topPages: Array<{ path: string; views: number }>;
    referrers: Array<{ source: string; visits: number }>;
  }> {
    // Simulate analytics data
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      pageViews: Math.floor(Math.random() * 1000) + 100,
      uniqueVisitors: Math.floor(Math.random() * 500) + 50,
      topPages: [
        { path: '/', views: Math.floor(Math.random() * 500) + 50 },
        { path: '/about', views: Math.floor(Math.random() * 200) + 20 },
        { path: '/projects', views: Math.floor(Math.random() * 300) + 30 }
      ],
      referrers: [
        { source: 'Direct', visits: Math.floor(Math.random() * 300) + 30 },
        { source: 'Google', visits: Math.floor(Math.random() * 200) + 20 },
        { source: 'LinkedIn', visits: Math.floor(Math.random() * 100) + 10 }
      ]
    };
  }

  /**
   * Configure custom domain
   */
  async configureCustomDomain(siteId: string, domain: string): Promise<{
    domain: string;
    status: 'pending' | 'verified' | 'error';
    dnsRecords: Array<{ type: string; name: string; value: string }>;
  }> {
    // Simulate domain configuration
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      domain,
      status: 'pending',
      dnsRecords: [
        { type: 'CNAME', name: 'www', value: 'careerkit-portfolios.netlify.app' },
        { type: 'A', name: '@', value: '75.2.60.5' }
      ]
    };
  }

  /**
   * Enable form handling
   */
  async enableFormHandling(siteId: string, formName: string): Promise<{
    endpoint: string;
    webhookUrl?: string;
    notificationEmail?: string;
  }> {
    // Simulate form handling setup
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      endpoint: `https://careerkit-portfolios.netlify.app/forms/${formName}`,
      webhookUrl: `https://api.netlify.com/build_hooks/${this.generateWebhookId()}`,
      notificationEmail: 'notifications@careerkit.com'
    };
  }

  /**
   * Generate portfolio files for deployment
   */
  generatePortfolioFiles(portfolioData: any): { [path: string]: string } {
    const files: { [path: string]: string } = {};

    // Generate HTML
    files['index.html'] = this.generatePortfolioHTML(portfolioData);
    
    // Generate CSS
    files['styles.css'] = this.generatePortfolioCSS(portfolioData);
    
    // Generate JavaScript
    files['script.js'] = this.generatePortfolioJavaScript(portfolioData);
    
    // Generate manifest
    files['manifest.json'] = this.generatePortfolioManifest(portfolioData);
    
    // Generate robots.txt
    files['robots.txt'] = this.generateRobotsTxt();
    
    // Generate sitemap
    files['sitemap.xml'] = this.generatePortfolioSitemap(portfolioData);

    return files;
  }

  /**
   * Optimize portfolio for performance
   */
  optimizeForPerformance(files: { [path: string]: string }): { [path: string]: string } {
    const optimized = { ...files };

    // Minify HTML
    if (optimized['index.html']) {
      optimized['index.html'] = this.minifyHTML(optimized['index.html']);
    }

    // Minify CSS
    if (optimized['styles.css']) {
      optimized['styles.css'] = this.minifyCSS(optimized['styles.css']);
    }

    // Minify JavaScript
    if (optimized['script.js']) {
      optimized['script.js'] = this.minifyJavaScript(optimized['script.js']);
    }

    return optimized;
  }

  // Private helper methods
  private async createDeployment(
    deploymentId: string,
    siteName: string,
    files: { [path: string]: string },
    options: DeploymentOptions
  ): Promise<NetlifyDeployment> {
    const deployment: NetlifyDeployment = {
      id: deploymentId,
      url: `https://${siteName}.netlify.app`,
      deployUrl: `https://${deploymentId}--${siteName}.netlify.app`,
      state: 'building',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      buildLog: ['Starting deployment...']
    };

    return deployment;
  }

  private async simulateBuildProcess(deployment: NetlifyDeployment): Promise<void> {
    const buildSteps = [
      'Uploading files...',
      'Installing dependencies...',
      'Building site...',
      'Optimizing assets...',
      'Generating sitemap...',
      'Deploying to global CDN...',
      'Build complete!'
    ];

    for (const step of buildSteps) {
      await new Promise(resolve => setTimeout(resolve, 500));
      deployment.buildLog.push(step);
    }

    deployment.state = 'ready';
    deployment.updatedAt = new Date().toISOString();
  }

  private generateDeploymentId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generateSiteId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generateSiteName(slug: string): string {
    return `careerkit-${slug}`;
  }

  private generateWebhookId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generatePortfolioHTML(portfolioData: any): string {
    const { personalInfo, sections, customizations, seo } = portfolioData;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}">
    <meta name="keywords" content="${seo.keywords.join(', ')}">
    <meta name="author" content="${personalInfo.name}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://${portfolioData.slug}.netlify.app/">
    <meta property="og:title" content="${seo.title}">
    <meta property="og:description" content="${seo.description}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://${portfolioData.slug}.netlify.app/">
    <meta property="twitter:title" content="${seo.title}">
    <meta property="twitter:description" content="${seo.description}">
    
    <link rel="stylesheet" href="styles.css">
    <link rel="manifest" href="manifest.json">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=${customizations.font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Loading Screen -->
    <div id="loading-screen" class="loading-screen">
        <div class="loader">
            <div class="loader-inner"></div>
        </div>
    </div>

    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">${personalInfo.name}</div>
            <ul class="nav-menu">
                <li><a href="#about" class="nav-link">About</a></li>
                ${sections.skills && (sections.skills.technical.length > 0 || sections.skills.soft.length > 0) ? '<li><a href="#skills" class="nav-link">Skills</a></li>' : ''}
                <li><a href="#projects" class="nav-link">Projects</a></li>
                ${sections.experience && sections.experience.length > 0 ? '<li><a href="#experience" class="nav-link">Experience</a></li>' : ''}
                ${sections.education && sections.education.length > 0 ? '<li><a href="#education" class="nav-link">Education</a></li>' : ''}
                <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-background">
            <div class="hero-shape-1"></div>
            <div class="hero-shape-2"></div>
            <div class="hero-shape-3"></div>
        </div>
        <div class="hero-content">
            <h1 class="hero-title">${personalInfo.name}</h1>
            <p class="hero-subtitle">${sections.about.substring(0, 150)}${sections.about.length > 150 ? '...' : ''}</p>
            <div class="hero-buttons">
                ${sections.projects && sections.projects.length > 0 ? '<a href="#projects" class="btn btn-primary">View My Work</a>' : ''}
                <a href="#contact" class="btn btn-secondary">Get In Touch</a>
            </div>
            ${personalInfo.linkedin || personalInfo.github || personalInfo.website ? `
            <div class="hero-social">
                ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>` : ''}
                ${personalInfo.github ? `<a href="${personalInfo.github}" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>` : ''}
                ${personalInfo.website ? `<a href="${personalInfo.website}" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Website"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg></a>` : ''}
            </div>
            ` : ''}
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="section">
        <div class="container">
            <h2 class="section-title" data-aos="fade-up">About Me</h2>
            <div class="about-content">
                <div class="about-text" data-aos="fade-up" data-aos-delay="200">
                    <p>${sections.about}</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Skills Section -->
    ${sections.skills && (sections.skills.technical.length > 0 || sections.skills.soft.length > 0 || sections.skills.tools.length > 0) ? `
    <section id="skills" class="section bg-light">
        <div class="container">
            <h2 class="section-title" data-aos="fade-up">Skills & Expertise</h2>
            <div class="skills-container">
                ${sections.skills.technical.length > 0 ? `
                <div class="skills-category">
                    <h3 class="skills-category-title" data-aos="fade-up" data-aos-delay="100">Technical Skills</h3>
                    <div class="skills-grid" data-aos="fade-up" data-aos-delay="200">
                        ${sections.skills.technical.map(skill => `<span class="skill-tag technical">${skill}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${sections.skills.soft.length > 0 ? `
                <div class="skills-category">
                    <h3 class="skills-category-title" data-aos="fade-up" data-aos-delay="300">Soft Skills</h3>
                    <div class="skills-grid" data-aos="fade-up" data-aos-delay="400">
                        ${sections.skills.soft.map(skill => `<span class="skill-tag soft">${skill}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${sections.skills.tools && sections.skills.tools.length > 0 ? `
                <div class="skills-category">
                    <h3 class="skills-category-title" data-aos="fade-up" data-aos-delay="500">Tools & Technologies</h3>
                    <div class="skills-grid" data-aos="fade-up" data-aos-delay="600">
                        ${sections.skills.tools.map(tool => `<span class="skill-tag tools">${tool}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Projects Section -->
    ${sections.projects && sections.projects.length > 0 ? `
    <section id="projects" class="section">
        <div class="container">
            <h2 class="section-title" data-aos="fade-up">Featured Projects</h2>
            <div class="projects-grid">
                ${sections.projects.map((project, index) => `
                <div class="project-card" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
                    <div class="project-image">
                        <img src="${project.imageUrl}" alt="${project.title}" loading="lazy">
                        <div class="project-overlay">
                            <div class="project-links">
                                ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link-btn">Live Demo</a>` : ''}
                                ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link-btn">GitHub</a>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tech">
                            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                        ${project.features && project.features.length > 0 ? `
                        <div class="project-features">
                            <h4>Key Features:</h4>
                            <ul>
                                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Experience Section -->
    ${sections.experience.length > 0 ? `
    <section id="experience" class="section bg-light">
        <div class="container">
            <h2 class="section-title" data-aos="fade-up">Professional Experience</h2>
            <div class="timeline">
                ${sections.experience.map((exp, index) => `
                <div class="timeline-item" data-aos="fade-up" data-aos-delay="${(index + 1) * 150}">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <h3 class="timeline-title">${exp.title}</h3>
                        <h4 class="timeline-company">${exp.company}</h4>
                        <p class="timeline-duration">${exp.duration}</p>
                        <p class="timeline-description">${exp.description}</p>
                        ${exp.achievements && exp.achievements.length > 0 ? `
                        <ul class="timeline-achievements">
                            ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                        ` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Education Section -->
    ${sections.education && sections.education.length > 0 ? `
    <section id="education" class="section">
        <div class="container">
            <h2 class="section-title" data-aos="fade-up">Education</h2>
            <div class="education-grid">
                ${sections.education.map((edu, index) => `
                <div class="education-card" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
                    <div class="education-content">
                        <h3 class="education-degree">${edu.degree}</h3>
                        <h4 class="education-school">${edu.school}</h4>
                        <p class="education-year">${edu.year}</p>
                        ${edu.description ? `<p class="education-description">${edu.description}</p>` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Testimonials Section -->
    ${sections.testimonials && sections.testimonials.length > 0 ? `
    <section id="testimonials" class="section bg-light">
        <div class="container">
            <h2 class="section-title" data-aos="fade-up">What People Say</h2>
            <div class="testimonials-grid">
                ${sections.testimonials.map((testimonial, index) => `
                <div class="testimonial-card" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
                    <p class="testimonial-content">"${testimonial.content}"</p>
                    <div class="testimonial-author">
                        <strong>${testimonial.name}</strong>
                        <span>${testimonial.role} at ${testimonial.company}</span>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Contact Section -->
    <section id="contact" class="section">
        <div class="container">
            <h2 class="section-title" data-aos="fade-up">Get In Touch</h2>
            <div class="contact-content">
                <div class="contact-info" data-aos="fade-up" data-aos-delay="200">
                    <div class="contact-item">
                        <div class="contact-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                        </div>
                        <div>
                            <strong>Email</strong>
                        <a href="mailto:${personalInfo.email}">${personalInfo.email}</a>
                        </div>
                    </div>
                    ${personalInfo.phone ? `
                    <div class="contact-item">
                        <div class="contact-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                        </div>
                        <div>
                            <strong>Phone</strong>
                        <a href="tel:${personalInfo.phone}">${personalInfo.phone}</a>
                        </div>
                    </div>
                    ` : ''}
                    ${personalInfo.location ? `
                    <div class="contact-item">
                        <div class="contact-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                        </div>
                        <div>
                            <strong>Location</strong>
                        <span>${personalInfo.location}</span>
                        </div>
                    </div>
                    ` : ''}
                </div>
                ${personalInfo.linkedin || personalInfo.github || personalInfo.website ? `
                <div class="social-links" data-aos="fade-up" data-aos-delay="400">
                    ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        LinkedIn
                    </a>` : ''}
                    ${personalInfo.github ? `<a href="${personalInfo.github}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        GitHub
                    </a>` : ''}
                    ${personalInfo.website ? `<a href="${personalInfo.website}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Website">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                        Website
                    </a>` : ''}
                </div>
                ` : ''}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${personalInfo.name}. All rights reserved.</p>
            <p>Portfolio created with passion and precision.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
  }

  private generatePortfolioCSS(portfolioData: any): string {
    const { customizations } = portfolioData;
    const { colors, layout } = customizations;
    
    return `
/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
    font-size: 16px;
}

body {
    font-family: '${font}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: ${colors.text};
    background-color: ${colors.background};
    overflow-x: hidden;
}

/* Loading Screen */
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.5s ease-out;
}

.loader {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: conic-gradient(from 0deg, ${colors.primary}, ${colors.accent}, ${colors.secondary}, ${colors.primary});
    animation: spin 1s linear infinite;
    display: flex;
    justify-content: center;
    align-items: center;
}

.loader-inner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${colors.background};
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* Navigation */
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(20px);
    z-index: 1000;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.navbar.scrolled {
    padding: 0.5rem 0;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${colors.primary};
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-link {
    text-decoration: none;
    color: ${colors.text};
    font-weight: 500;
    transition: color 0.3s ease;
    position: relative;
}

.nav-link:hover {
    color: ${colors.primary};
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    transition: width 0.3s ease;
}

.nav-link:hover::after {
    width: 100%;
}

.hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.hamburger:hover {
    transform: scale(1.1);
}

.hamburger span {
    width: 25px;
    height: 3px;
    background: ${colors.text};
    margin: 3px 0;
    transition: 0.3s;
}

/* Hero Section */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: linear-gradient(135deg, ${colors.primary}08, ${colors.accent}12, ${colors.secondary}06);
    padding-top: 80px;
    position: relative;
    overflow: hidden;
}

.hero-background {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.hero-shape-1 {
    position: absolute;
    top: 10%;
    right: 10%;
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, ${colors.primary}15, ${colors.accent}10);
    border-radius: 50%;
    filter: blur(60px);
    animation: float 8s ease-in-out infinite;
}

.hero-shape-2 {
    position: absolute;
    bottom: 20%;
    left: 5%;
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, ${colors.accent}12, ${colors.secondary}08);
    border-radius: 50%;
    filter: blur(40px);
    animation: float 6s ease-in-out infinite reverse;
}

.hero-shape-3 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 100px;
    background: linear-gradient(90deg, ${colors.primary}06, ${colors.accent}08, ${colors.secondary}06);
    border-radius: 50px;
    filter: blur(80px);
    animation: pulse 4s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes pulse {
    0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.hero-content {
    max-width: 800px;
    padding: 0 2rem;
    position: relative;
    z-index: 1;
}

.hero-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent}, ${colors.secondary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
    animation: fadeInUp 1s ease-out;
}

.hero-subtitle {
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    margin-bottom: 2rem;
    color: ${colors.text};
    opacity: 0.9;
    animation: fadeInUp 1s ease-out 0.2s both;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    animation: fadeInUp 1s ease-out 0.4s both;
}

.hero-social {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
    animation: fadeInUp 1s ease-out 0.6s both;
}

.social-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.text};
    text-decoration: none;
    transition: all 0.3s ease;
}

.social-icon:hover {
    background: ${colors.primary};
    color: white;
    transform: translateY(-3px) scale(1.1);
}

.social-icon svg {
    width: 20px;
    height: 20px;
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 1rem 2.5rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid transparent;
    position: relative;
    overflow: hidden;
}

.btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transition: all 0.6s ease;
    transform: translate(-50%, -50%);
}

.btn:hover::before {
    width: 300px;
    height: 300px;
}

.btn-primary {
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    color: white;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
    background: transparent;
    color: ${colors.primary};
    border-color: ${colors.primary};
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover {
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

[data-aos] {
    opacity: 0;
    transition: all 0.8s ease;
}

[data-aos].aos-animate {
    opacity: 1;
}

[data-aos="fade-up"] {
    transform: translateY(40px);
}

[data-aos="fade-up"].aos-animate {
    transform: translateY(0);
}

/* Sections */
.section {
    padding: 6rem 0;
    position: relative;
}

.bg-light {
    background: linear-gradient(135deg, ${colors.background === '#ffffff' ? '#fafbfc' : '#1a1a1a'}, ${colors.background === '#ffffff' ? '#f1f5f9' : '#2a2a2a'});
}

.section-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    text-align: center;
    margin-bottom: 4rem;
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    border-radius: 2px;
}

/* About Section */
.about-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.about-text {
    font-size: 1.1rem;
    line-height: 1.9;
    color: ${colors.text};
    opacity: 0.9;
}

/* Skills Section */
.skills-container {
    max-width: 1000px;
    margin: 0 auto;
}

.skills-category {
    margin-bottom: 3rem;
}

.skills-category-title {
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1.5rem;
    text-align: center;
}

.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
}

.skill-tag {
    padding: 0.6rem 1.2rem;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: default;
    border: 1px solid transparent;
    position: relative;
    overflow: hidden;
}

.skill-tag::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
}

.skill-tag:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.skill-tag:hover::before {
    left: 100%;
}

.skill-tag.technical {
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    color: white;
    border-color: ${colors.primary};
}

.skill-tag.soft {
    background: linear-gradient(135deg, ${colors.accent}, ${colors.secondary});
    color: white;
    border-color: ${colors.accent};
}

.skill-tag.tools {
    background: linear-gradient(135deg, ${colors.secondary}, ${colors.primary});
    color: white;
    border-color: ${colors.secondary};
}

/* Projects Section */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 2.5rem;
}

.project-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
}

.project-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.project-image {
    height: 220px;
    overflow: hidden;
    position: relative;
}

.project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.project-card:hover .project-image img {
    transform: scale(1.08);
}

.project-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, ${colors.primary}90, ${colors.accent}80);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.4s ease;
}

.project-card:hover .project-overlay {
    opacity: 1;
}

.project-link-btn {
    padding: 0.5rem 1rem;
    background: white;
    color: ${colors.primary};
    text-decoration: none;
    border-radius: 25px;
    font-weight: 600;
    margin: 0 0.5rem;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.project-link-btn:hover {
    background: ${colors.primary};
    color: white;
    transform: scale(1.05);
}

.project-content {
    padding: 2rem;
}

.project-title {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.project-description {
    margin-bottom: 1rem;
    color: ${colors.text};
    opacity: 0.9;
    line-height: 1.6;
}

.project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.tech-tag {
    background: linear-gradient(135deg, ${colors.accent}15, ${colors.primary}10);
    color: ${colors.accent};
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid ${colors.accent}30;
    transition: all 0.3s ease;
}

.tech-tag:hover {
    background: ${colors.accent};
    color: white;
    transform: scale(1.05);
}

.project-features {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid ${colors.background === '#ffffff' ? '#e5e7eb' : '#374151'};
}

.project-features h4 {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${colors.primary};
    margin-bottom: 0.5rem;
}

.project-features ul {
    list-style: none;
    padding: 0;
}

.project-features li {
    font-size: 0.85rem;
    color: ${colors.text};
    opacity: 0.8;
    margin-bottom: 0.25rem;
    padding-left: 1rem;
    position: relative;
}

.project-features li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: ${colors.primary};
    font-weight: bold;
}

/* Experience Timeline */
.timeline {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    padding-left: 2rem;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, ${colors.primary}, ${colors.accent}, ${colors.secondary});
    border-radius: 1.5px;
}

.timeline-item {
    position: relative;
    margin-bottom: 3.5rem;
}

.timeline-marker {
    position: absolute;
    left: -2rem;
    top: 1rem;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    border-radius: 50%;
    border: 3px solid ${colors.background};
    box-shadow: 0 0 0 3px ${colors.primary}30;
    z-index: 1;
}

.timeline-content {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    margin-left: 2rem;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
}

.timeline-content:hover {
    transform: translateX(8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.timeline-content::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 1.5rem;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid rgba(255, 255, 255, 0.95);
}

.timeline-title {
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
    font-weight: 600;
}

.timeline-company {
    color: ${colors.secondary};
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 1.1rem;
}

.timeline-duration {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 1rem;
    color: ${colors.primary};
    font-weight: 500;
    background: ${colors.primary}10;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    display: inline-block;
}

.timeline-description {
    line-height: 1.7;
    color: ${colors.text};
    opacity: 0.9;
}

.timeline-achievements {
    margin-top: 1rem;
    padding-left: 1.5rem;
    border-left: 3px solid ${colors.primary}20;
    padding-left: 1rem;
}

.timeline-achievements li {
    margin-bottom: 0.5rem;
    color: ${colors.text};
    opacity: 0.9;
    position: relative;
}

.timeline-achievements li::before {
    content: '→';
    position: absolute;
    left: -1rem;
    color: ${colors.primary};
    font-weight: bold;
}

/* Education Section */
.education-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2.5rem;
    max-width: 800px;
    margin: 0 auto;
}

.education-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;
}

.education-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
}

.education-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.education-degree {
    font-size: 1.3rem;
    font-weight: 600;
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
}

.education-school {
    font-size: 1.1rem;
    color: ${colors.secondary};
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.education-year {
    font-size: 0.9rem;
    color: ${colors.primary};
    font-weight: 500;
    background: ${colors.primary}10;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    display: inline-block;
    margin-bottom: 1rem;
}

.education-description {
    font-size: 0.9rem;
    color: ${colors.text};
    opacity: 0.9;
    line-height: 1.6;
}

/* Testimonials */
.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2.5rem;
}

.testimonial-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    position: relative;
}

.testimonial-card::before {
    content: '"';
    position: absolute;
    top: 1rem;
    left: 1.5rem;
    font-size: 4rem;
    color: ${colors.primary}20;
    font-family: serif;
    line-height: 1;
}

.testimonial-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.testimonial-content {
    font-style: italic;
    margin-bottom: 1rem;
    font-size: 1.05rem;
    line-height: 1.7;
    color: ${colors.text};
    opacity: 0.9;
    position: relative;
    z-index: 1;
}

.testimonial-author {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.testimonial-author strong {
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 600;
}

.testimonial-author span {
    font-size: 0.9rem;
    color: ${colors.secondary};
    opacity: 0.8;
}

/* Contact Section */
.contact-content {
    max-w: 700px;
    margin: 0 auto;
}

.contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
}

.contact-item:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: translateX(5px);
}

.contact-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    flex-shrink: 0;
}

.contact-icon svg {
    width: 24px;
    height: 24px;
    color: white;
}

.contact-item div strong {
    display: block;
    font-weight: 600;
    color: ${colors.primary};
    margin-bottom: 0.25rem;
}

.contact-item a {
    color: ${colors.text};
    text-decoration: none;
    transition: color 0.3s ease;
}

.contact-item a:hover {
    color: ${colors.primary};
}

.social-links {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 2rem;
}

.social-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    color: white;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;
}

.social-link::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transition: all 0.5s ease;
    transform: translate(-50%, -50%);
}

.social-link:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
}

.social-link:hover::before {
    width: 200px;
    height: 200px;
}

.social-link svg {
    width: 20px;
    height: 20px;
    position: relative;
    z-index: 1;
}

/* Footer */
.footer {
    background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
    color: white;
    text-align: center;
    padding: 3rem 0;
    position: relative;
    overflow: hidden;
}

.footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
}

.footer p {
    margin-bottom: 0.5rem;
    opacity: 0.9;
}

.footer a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.3s ease;
}

.footer a:hover {
    opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .section {
        padding: 4rem 0;
    }
    
    .projects-grid {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    }
}

@media (max-width: 768px) {
    .hamburger {
        display: flex;
    }
    
    .nav-menu {
        display: none;
    }
    
    .hero-buttons {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    
    .hero-social {
        gap: 0.8rem;
    }
    
    .skills-grid {
        justify-content: center;
    }
    
    .projects-grid {
        grid-template-columns: 1fr;
    }
    
    .timeline::before {
        left: 15px;
    }
    
    .timeline-content {
        margin-left: 2rem;
    }
    
    .social-links {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    
    .contact-item {
        text-align: left;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 1rem;
    }
    
    .section {
        padding: 3rem 0;
    }
    
    .skills-grid {
        gap: 0.5rem;
    }
    
    .skill-tag {
        font-size: 0.8rem;
        padding: 0.4rem 0.8rem;
    }
    
    .timeline-marker {
        left: -1.8rem;
        width: 16px;
        height: 16px;
    }
    
    .timeline-content {
        margin-left: 1.5rem;
        padding: 2rem;
    }
    
    .project-content {
        padding: 1.5rem;
    }
    
    .education-card,
    .testimonial-card {
        padding: 2rem;
    }
}

/* Print Styles */
@media print {
    .navbar,
    .hero-buttons,
    .social-links,
    .footer {
        display: none;
    }
    
    .section {
        padding: 2rem 0;
    }
    
    .hero {
        min-height: auto;
        padding: 2rem 0;
    }
}

/* High contrast mode */
@media (prefers-contrast: high) {
    .skill-tag,
    .tech-tag {
        border-width: 2px;
    }
    
    .project-card,
    .education-card,
    .testimonial-card,
    .timeline-content {
        border-width: 2px;
    }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .hero-shape-1,
    .hero-shape-2,
    .hero-shape-3 {
        animation: none;
    }
}

/* Motion preference */
@media (prefers-reduced-motion: no-preference) {
    html {
        scroll-behavior: smooth;
    }
    
    .loading-screen.loaded {
        opacity: 0;
        pointer-events: none;
    }
}
    `;
  }

  private generatePortfolioJavaScript(portfolioData: any): string {
    return `
// Loading screen
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('loaded');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 800);
    }
});

// Simple AOS (Animate On Scroll) Implementation
function initAOS() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Add staggered animation delays for child elements
                const children = entry.target.querySelectorAll('[data-aos-delay]');
                children.forEach((child, index) => {
                    const delay = child.getAttribute('data-aos-delay') || (index * 100);
                    setTimeout(() => {
                        child.classList.add('aos-animate');
                    }, parseInt(delay));
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// Initialize AOS when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAOS);
} else {
    initAOS();
}

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
            
            // Update URL without causing scroll
            history.pushState(null, null, this.getAttribute('href'));
        }
    });
});

// Enhanced mobile navigation toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
}

// Enhanced navbar background on scroll
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar based on scroll direction
    if (scrollTop > lastScrollTop && scrollTop > 200) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
});

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === \`#\${current}\`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Enhanced lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Create a new image to preload
                const newImg = new Image();
                newImg.onload = () => {
                    img.src = newImg.src;
                    img.classList.add('loaded');
                };
                newImg.src = img.dataset.src || img.src;
                
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });

    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// Enhanced interaction tracking
document.querySelectorAll('.btn, .project-link-btn, .social-link').forEach(button => {
    button.addEventListener('click', (e) => {
        // Add click effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = \`
            position: absolute;
            width: \${size}px;
            height: \${size}px;
            left: \${x}px;
            top: \${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        \`;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Enhanced skill tag interactions
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
        this.style.zIndex = '10';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.zIndex = '1';
    });
});

// Enhanced project card interactions
document.querySelectorAll('.project-card').forEach(card => {
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;
    
    card.addEventListener('mouseenter', function() {
        isHovering = true;
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        isHovering = false;
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    card.addEventListener('mousemove', function(e) {
        if (!isHovering) return;
        
        const rect = this.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (mouseY - centerY) / 10;
        const rotateY = (centerX - mouseX) / 10;
        
        this.style.transform = \`translateY(-8px) scale(1.02) perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`;
    });
});

// Add ripple effect styles
const rippleStyles = document.createElement('style');
rippleStyles.textContent = \`
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
\`;
document.head.appendChild(rippleStyles);

// Parallax effect for hero background shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const shapes = document.querySelectorAll('.hero-shape-1, .hero-shape-2, .hero-shape-3');
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.3;
        shape.style.transform = \`translateY(\${rate * speed}px)\`;
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    }
});

// Performance optimization: Defer non-critical functions
window.addEventListener('load', () => {
    // Preload next section images
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.loading = 'eager';
                imageLoadObserver.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });
    
    images.forEach(img => imageLoadObserver.observe(img));
});
    `;
  }

  private generatePortfolioManifest(portfolioData: any): string {
    const { personalInfo, seo, customizations } = portfolioData;
    
    return JSON.stringify({
      name: seo.title,
      short_name: personalInfo.name,
      description: seo.description,
      start_url: '/',
      display: 'standalone',
      background_color: customizations.colors.background,
      theme_color: customizations.colors.primary,
      orientation: 'portrait-primary',
      scope: '/',
      lang: 'en',
      icons: [
        {
          src: 'https://via.placeholder.com/192x192/2563eb/ffffff?text=' + personalInfo.name.charAt(0),
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: 'https://via.placeholder.com/512x512/2563eb/ffffff?text=' + personalInfo.name.charAt(0),
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ],
      categories: ['portfolio', 'professional', 'personal'],
      screenshots: [
        {
          src: 'https://via.placeholder.com/1280x720/f8fafc/2563eb?text=Portfolio+Screenshot',
          sizes: '1280x720',
          type: 'image/png',
          label: 'Portfolio Homepage'
        }
      ]
    }, null, 2);
  }

  private generatePortfolioSitemap(portfolioData: any): string {
    const { personalInfo } = portfolioData;
    const baseUrl = 'https://careerkit-portfolios.netlify.app';
    const currentDate = new Date().toISOString();
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/#about</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${baseUrl}/#skills</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${baseUrl}/#projects</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${baseUrl}/#experience</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>${baseUrl}/#education</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>${baseUrl}/#contact</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.6</priority>
    </url>
</urlset>`;
  }

  private generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

Sitemap: https://careerkit-portfolios.netlify.app/sitemap.xml`;
  }

  private generateHTML(portfolioData: any): string {
    // Keep original method for backward compatibility
    return this.generatePortfolioHTML(portfolioData);
  }

  private generateCSS(portfolioData: any): string {
    // Keep original method for backward compatibility  
    return this.generatePortfolioCSS(portfolioData);
  }

  private generateJavaScript(portfolioData: any): string {
    // Keep original method for backward compatibility
    return this.generatePortfolioJavaScript(portfolioData);
  }

  private generateManifest(portfolioData: any): string {
    // Keep original method for backward compatibility
    return this.generatePortfolioManifest(portfolioData);
  }

  private generateSitemap(portfolioData: any): string {
    // Keep original method for backward compatibility
    return this.generatePortfolioSitemap(portfolioData);
  }

  private minifyHTML(html: string): string {
    // Simple HTML minification
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  }

  private minifyCSS(css: string): string {
    // Simple CSS minification
    return css
      .replace(/\s+/g, ' ')
      .replace(/;\s*}/g, '}')
      .replace(/{\s*/g, '{')
      .replace(/;\s*/g, ';')
      .trim();
  }

  private minifyJavaScript(js: string): string {
    // Simple JavaScript minification
    return js
      .replace(/\s+/g, ' ')
      .replace(/;\s*}/g, ';}')
      .replace(/{\s*/g, '{')
      .trim();
  }
}

// Export singleton instance
export const netlifyIntegration = NetlifyIntegration.getInstance();