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
    <meta property="og:url" content="https://careerkit-portfolios.netlify.app/">
    <meta property="og:title" content="${seo.title}">
    <meta property="og:description" content="${seo.description}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://careerkit-portfolios.netlify.app/">
    <meta property="twitter:title" content="${seo.title}">
    <meta property="twitter:description" content="${seo.description}">
    
    <link rel="stylesheet" href="styles.css">
    <link rel="manifest" href="manifest.json">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">${personalInfo.name}</div>
            <ul class="nav-menu">
                <li><a href="#about" class="nav-link">About</a></li>
                <li><a href="#projects" class="nav-link">Projects</a></li>
                <li><a href="#experience" class="nav-link">Experience</a></li>
                <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>${portfolioData.personalInfo.name}</h1>
        <p>${portfolioData.personalInfo.email}</p>
    </header>
    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1 class="hero-title">${personalInfo.name}</h1>
            <p class="hero-subtitle">${sections.about}</p>
            <div class="hero-buttons">
                <a href="#projects" class="btn btn-primary">View My Work</a>
                <a href="#contact" class="btn btn-secondary">Get In Touch</a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="section">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>${sections.about}</p>
                </div>
                <div class="about-skills">
                    <h3>Technical Skills</h3>
                    <div class="skills-grid">
                        ${sections.skills.technical.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                    ${sections.skills.soft.length > 0 ? `
                    <h3>Soft Skills</h3>
                    <div class="skills-grid">
                        ${sections.skills.soft.map(skill => `<span class="skill-tag soft">${skill}</span>`).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="section bg-light">
        <div class="container">
            <h2 class="section-title">Projects</h2>
            <div class="projects-grid">
                ${sections.projects.map(project => `
                <div class="project-card">
                    <div class="project-image">
                        <img src="${project.imageUrl}" alt="${project.title}" loading="lazy">
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tech">
                            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                        <div class="project-links">
                            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link">Live Demo</a>` : ''}
                            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link">GitHub</a>` : ''}
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Experience Section -->
    ${sections.experience.length > 0 ? `
    <section id="experience" class="section">
        <div class="container">
            <h2 class="section-title">Experience</h2>
            <div class="timeline">
                ${sections.experience.map(exp => `
                <div class="timeline-item">
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

    <!-- Testimonials Section -->
    ${sections.testimonials && sections.testimonials.length > 0 ? `
    <section id="testimonials" class="section bg-light">
        <div class="container">
            <h2 class="section-title">Testimonials</h2>
            <div class="testimonials-grid">
                ${sections.testimonials.map(testimonial => `
                <div class="testimonial-card">
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
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <div class="contact-item">
                        <strong>Email:</strong>
                        <a href="mailto:${personalInfo.email}">${personalInfo.email}</a>
                    </div>
                    ${personalInfo.phone ? `
                    <div class="contact-item">
                        <strong>Phone:</strong>
                        <a href="tel:${personalInfo.phone}">${personalInfo.phone}</a>
                    </div>
                    ` : ''}
                    ${personalInfo.location ? `
                    <div class="contact-item">
                        <strong>Location:</strong>
                        <span>${personalInfo.location}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="social-links">
                    ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="social-link">LinkedIn</a>` : ''}
                    ${personalInfo.github ? `<a href="${personalInfo.github}" target="_blank" rel="noopener noreferrer" class="social-link">GitHub</a>` : ''}
                    ${personalInfo.website ? `<a href="${personalInfo.website}" target="_blank" rel="noopener noreferrer" class="social-link">Website</a>` : ''}
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${personalInfo.name}. All rights reserved.</p>
            <p>Built with <a href="https://careerkit.com" target="_blank" rel="noopener noreferrer">CareerKit</a></p>
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
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: ${colors.text};
    background-color: ${colors.background};
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
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
}

.nav-link:hover {
    color: ${colors.primary};
}

.hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
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
    background: linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10);
    padding-top: 80px;
}

.hero-content {
    max-width: 800px;
    padding: 0 2rem;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: ${colors.primary};
    line-height: 1.2;
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    color: ${colors.text};
    opacity: 0.8;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.btn-primary {
    background: ${colors.primary};
    color: white;
}

.btn-primary:hover {
    background: ${colors.secondary};
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    color: ${colors.primary};
    border-color: ${colors.primary};
}

.btn-secondary:hover {
    background: ${colors.primary};
    color: white;
    transform: translateY(-2px);
}

/* Sections */
.section {
    padding: 5rem 0;
}

.bg-light {
    background: ${colors.background === '#ffffff' ? '#f8fafc' : '#1a1a1a'};
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 3rem;
    color: ${colors.primary};
}

/* About Section */
.about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
}

.about-text {
    font-size: 1.1rem;
    line-height: 1.8;
}

.about-skills h3 {
    margin-bottom: 1rem;
    color: ${colors.primary};
}

.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 2rem;
}

.skill-tag {
    background: ${colors.primary};
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
}

.skill-tag.soft {
    background: ${colors.accent};
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
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.project-image {
    height: 200px;
    overflow: hidden;
}

.project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.project-content {
    padding: 1.5rem;
}

.project-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: ${colors.primary};
}

.project-description {
    margin-bottom: 1rem;
    color: ${colors.text};
    opacity: 0.8;
}

.project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.tech-tag {
    background: ${colors.accent}20;
    color: ${colors.accent};
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
}

.project-links {
    display: flex;
    gap: 1rem;
}

.project-link {
    color: ${colors.primary};
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.project-link:hover {
    color: ${colors.secondary};
}

/* Timeline */
.timeline {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${colors.primary};
    transform: translateX(-50%);
}

.timeline-item {
    position: relative;
    margin-bottom: 3rem;
}

.timeline-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-left: 60%;
    position: relative;
}

.timeline-item:nth-child(even) .timeline-content {
    margin-left: 0;
    margin-right: 60%;
}

.timeline-title {
    color: ${colors.primary};
    margin-bottom: 0.5rem;
}

.timeline-company {
    color: ${colors.accent};
    margin-bottom: 0.5rem;
}

.timeline-duration {
    font-size: 0.9rem;
    opacity: 0.7;
    margin-bottom: 1rem;
}

.timeline-achievements {
    margin-top: 1rem;
    padding-left: 1.5rem;
}

.timeline-achievements li {
    margin-bottom: 0.5rem;
}

/* Testimonials */
.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.testimonial-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.testimonial-content {
    font-style: italic;
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.testimonial-author {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.testimonial-author strong {
    color: ${colors.primary};
}

.testimonial-author span {
    font-size: 0.9rem;
    opacity: 0.7;
}

/* Contact Section */
.contact-content {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
}

.contact-item {
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.contact-item a {
    color: ${colors.primary};
    text-decoration: none;
}

.contact-item a:hover {
    text-decoration: underline;
}

.social-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
}

.social-link {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: ${colors.primary};
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.social-link:hover {
    background: ${colors.secondary};
    transform: translateY(-2px);
}

/* Footer */
.footer {
    background: ${colors.primary};
    color: white;
    text-align: center;
    padding: 2rem 0;
}

.footer a {
    color: white;
    text-decoration: none;
}

.footer a:hover {
    text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hamburger {
        display: flex;
    }
    
    .nav-menu {
        display: none;
    }
    
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .about-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .projects-grid {
        grid-template-columns: 1fr;
    }
    
    .timeline::before {
        left: 20px;
    }
    
    .timeline-content {
        margin-left: 60px !important;
        margin-right: 0 !important;
    }
    
    .social-links {
        flex-direction: column;
        align-items: center;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 1rem;
    }
    
    .hero-title {
        font-size: 2rem;
    }
    
    .section {
        padding: 3rem 0;
    }
    
    .section-title {
        font-size: 2rem;
    }
}

/* Animation */
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

/* Smooth scrolling for older browsers */
@media (prefers-reduced-motion: no-preference) {
    html {
        scroll-behavior: smooth;
    }
}
    `;
  }

  private generatePortfolioJavaScript(portfolioData: any): string {
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

// Mobile navigation toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-card, .timeline-item, .testimonial-card').forEach(el => {
    observer.observe(el);
});

// Form handling (if contact form exists)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        this.reset();
    });
}

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Performance optimization: Preload critical resources
const preloadLink = document.createElement('link');
preloadLink.rel = 'preload';
preloadLink.as = 'font';
preloadLink.type = 'font/woff2';
preloadLink.crossOrigin = 'anonymous';
preloadLink.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
document.head.appendChild(preloadLink);

// Analytics (placeholder for future implementation)
function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, properties);
}

// Track page view
trackEvent('page_view', {
    page: 'portfolio',
    timestamp: new Date().toISOString()
});

// Track button clicks
document.querySelectorAll('.btn, .project-link, .social-link').forEach(button => {
    button.addEventListener('click', (e) => {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            button_href: e.target.href || null
        });
    });
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
        <loc>${baseUrl}/#contact</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.6</priority>
    </url>
</urlset>`;
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
        </section>
        <!-- Additional sections would be generated here -->
    </main>
    <script src="script.js"></script>
</body>
</html>`;
  }

  private generateCSS(portfolioData: any): string {
    // Generate CSS based on portfolio theme and customizations
    return `
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background-color: ${portfolioData.customizations?.colors?.background || '#ffffff'};
            color: ${portfolioData.customizations?.colors?.text || '#333333'};
        }
        
        header {
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, ${portfolioData.customizations?.colors?.primary || '#2563eb'}, ${portfolioData.customizations?.colors?.accent || '#0ea5e9'});
            color: white;
        }
        
        main {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        section {
            margin-bottom: 3rem;
        }
        
        h1, h2, h3 {
            color: ${portfolioData.customizations?.colors?.primary || '#2563eb'};
        }
    `;
  }

  private generateJavaScript(portfolioData: any): string {
    // Generate JavaScript for portfolio functionality
    return `
        // Smooth scrolling
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
                alert('Thank you for your message!');
            });
        }
    `;
  }

  private generateManifest(portfolioData: any): string {
    return JSON.stringify({
      name: `${portfolioData.personalInfo.name} - Portfolio`,
      short_name: portfolioData.personalInfo.name,
      description: portfolioData.sections.about,
      start_url: '/',
      display: 'standalone',
      background_color: portfolioData.customizations?.colors?.background || '#ffffff',
      theme_color: portfolioData.customizations?.colors?.primary || '#2563eb',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }, null, 2);
  }

  private generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

Sitemap: https://careerkit-portfolios.netlify.app/sitemap.xml`;
  }

  private generateSitemap(portfolioData: any): string {
    const baseUrl = portfolioData.publishedUrl || 'https://careerkit-portfolios.netlify.app';
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.0</priority>
    </url>
</urlset>`;
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