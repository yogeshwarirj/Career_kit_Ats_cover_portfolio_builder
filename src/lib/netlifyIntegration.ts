import { GeneratedPortfolio } from './geminiPortfolioGenerator';

export interface NetlifyDeployment {
  id: string;
  url: string;
  deploy_url: string;
  site_id: string;
  site_name: string;
  state: 'ready' | 'building' | 'error';
  created_at: string;
  updated_at: string;
}

export interface PortfolioDeployment {
  success: boolean;
  deployment?: NetlifyDeployment;
  error?: string;
  previewUrl?: string;
}

class NetlifyIntegration {
  private static instance: NetlifyIntegration;

  static getInstance(): NetlifyIntegration {
    if (!NetlifyIntegration.instance) {
      NetlifyIntegration.instance = new NetlifyIntegration();
    }
    return NetlifyIntegration.instance;
  }

  /**
   * Generate enhanced HTML for portfolio using only user's input data
   */
  generatePortfolioHTML(portfolioData: GeneratedPortfolio): string {
    const { personalInfo, sections, customizations, seo } = portfolioData;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}">
    <meta name="keywords" content="${seo.keywords.join(', ')}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${seo.title}">
    <meta property="og:description" content="${seo.description}">
    <meta property="og:type" content="website">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${personalInfo.name.charAt(0)}</text></svg>">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=${customizations.font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <style>${this.generatePortfolioCSS(portfolioData)}</style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <span class="brand-text">${personalInfo.name}</span>
            </div>
            <div class="nav-menu" id="nav-menu">
                <a href="#about" class="nav-link">About</a>
                ${sections.projects.length > 0 ? '<a href="#projects" class="nav-link">Projects</a>' : ''}
                ${sections.experience.length > 0 ? '<a href="#experience" class="nav-link">Experience</a>' : ''}
                ${sections.education.length > 0 ? '<a href="#education" class="nav-link">Education</a>' : ''}
                ${sections.skills.technical.length > 0 || sections.skills.soft.length > 0 ? '<a href="#skills" class="nav-link">Skills</a>' : ''}
                ${sections.testimonials && sections.testimonials.length > 0 ? '<a href="#testimonials" class="nav-link">Testimonials</a>' : ''}
                <a href="#contact" class="nav-link">Contact</a>
            </div>
            <div class="nav-toggle" id="nav-toggle">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="hero" class="hero">
        <div class="hero-container">
            <div class="hero-content">
                <h1 class="hero-title">
                    <span class="hero-greeting">Hello, I'm</span>
                    <span class="hero-name">${personalInfo.name}</span>
                </h1>
                <p class="hero-subtitle">${sections.about}</p>
                <div class="hero-actions">
                    ${sections.projects.length > 0 ? '<a href="#projects" class="btn btn-primary">View My Work</a>' : ''}
                    <a href="#contact" class="btn btn-secondary">Get In Touch</a>
                </div>
                ${this.generateSocialLinks(personalInfo)}
            </div>
            <div class="hero-visual">
                <div class="hero-avatar">
                    <div class="avatar-circle">
                        <span class="avatar-text">${personalInfo.name.split(' ').map(n => n.charAt(0)).join('')}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="section">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <p class="about-text">${sections.about}</p>
            </div>
        </div>
    </section>

    ${sections.projects.length > 0 ? this.generateProjectsSection(sections.projects) : ''}
    ${sections.experience.length > 0 ? this.generateExperienceSection(sections.experience) : ''}
    ${sections.education.length > 0 ? this.generateEducationSection(sections.education) : ''}
    ${(sections.skills.technical.length > 0 || sections.skills.soft.length > 0 || sections.skills.tools.length > 0) ? this.generateSkillsSection(sections.skills) : ''}
    ${sections.testimonials && sections.testimonials.length > 0 ? this.generateTestimonialsSection(sections.testimonials) : ''}

    <!-- Contact Section -->
    <section id="contact" class="section contact-section">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-content">
                <div class="contact-info">
                    ${personalInfo.email ? `<div class="contact-item">
                        <span class="contact-icon">✉</span>
                        <a href="mailto:${personalInfo.email}" class="contact-link">${personalInfo.email}</a>
                    </div>` : ''}
                    ${personalInfo.phone ? `<div class="contact-item">
                        <span class="contact-icon">📞</span>
                        <a href="tel:${personalInfo.phone}" class="contact-link">${personalInfo.phone}</a>
                    </div>` : ''}
                    ${personalInfo.location ? `<div class="contact-item">
                        <span class="contact-icon">📍</span>
                        <span class="contact-text">${personalInfo.location}</span>
                    </div>` : ''}
                </div>
                ${this.generateSocialLinks(personalInfo)}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p class="footer-text">&copy; ${new Date().getFullYear()} ${personalInfo.name}. All rights reserved.</p>
        </div>
    </footer>

    <script>${this.generatePortfolioJavaScript()}</script>
</body>
</html>`;
  }

  /**
   * Generate projects section HTML
   */
  private generateProjectsSection(projects: any[]): string {
    return `
    <!-- Projects Section -->
    <section id="projects" class="section">
        <div class="container">
            <h2 class="section-title">Projects</h2>
            <div class="projects-grid">
                ${projects.map(project => `
                    <div class="project-card">
                        ${project.imageUrl ? `<div class="project-image">
                            <img src="${project.imageUrl}" alt="${project.title}" loading="lazy">
                        </div>` : ''}
                        <div class="project-content">
                            <h3 class="project-title">${project.title}</h3>
                            <p class="project-description">${project.description}</p>
                            ${project.technologies.length > 0 ? `
                                <div class="project-tech">
                                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                                </div>
                            ` : ''}
                            ${project.features.length > 0 ? `
                                <ul class="project-features">
                                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                            ` : ''}
                            <div class="project-links">
                                ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">Live Demo</a>` : ''}
                                ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary">Source Code</a>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>`;
  }

  /**
   * Generate experience section HTML
   */
  private generateExperienceSection(experience: any[]): string {
    return `
    <!-- Experience Section -->
    <section id="experience" class="section">
        <div class="container">
            <h2 class="section-title">Experience</h2>
            <div class="timeline">
                ${experience.map(exp => `
                    <div class="timeline-item">
                        <div class="timeline-content">
                            <h3 class="timeline-title">${exp.title}</h3>
                            <h4 class="timeline-company">${exp.company}</h4>
                            <span class="timeline-duration">${exp.duration}</span>
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
    </section>`;
  }

  /**
   * Generate education section HTML
   */
  private generateEducationSection(education: any[]): string {
    return `
    <!-- Education Section -->
    <section id="education" class="section">
        <div class="container">
            <h2 class="section-title">Education</h2>
            <div class="education-grid">
                ${education.map(edu => `
                    <div class="education-card">
                        <h3 class="education-degree">${edu.degree}</h3>
                        <h4 class="education-school">${edu.school}</h4>
                        <span class="education-year">${edu.year}</span>
                        ${edu.description ? `<p class="education-description">${edu.description}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    </section>`;
  }

  /**
   * Generate skills section HTML
   */
  private generateSkillsSection(skills: any): string {
    return `
    <!-- Skills Section -->
    <section id="skills" class="section">
        <div class="container">
            <h2 class="section-title">Skills</h2>
            <div class="skills-grid">
                ${skills.technical.length > 0 ? `
                    <div class="skills-category">
                        <h3 class="skills-category-title">Technical Skills</h3>
                        <div class="skills-list">
                            ${skills.technical.map(skill => `<span class="skill-tag technical">${skill}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                ${skills.soft.length > 0 ? `
                    <div class="skills-category">
                        <h3 class="skills-category-title">Soft Skills</h3>
                        <div class="skills-list">
                            ${skills.soft.map(skill => `<span class="skill-tag soft">${skill}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                ${skills.tools.length > 0 ? `
                    <div class="skills-category">
                        <h3 class="skills-category-title">Tools & Technologies</h3>
                        <div class="skills-list">
                            ${skills.tools.map(tool => `<span class="skill-tag tools">${tool}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    </section>`;
  }

  /**
   * Generate testimonials section HTML
   */
  private generateTestimonialsSection(testimonials: any[]): string {
    return `
    <!-- Testimonials Section -->
    <section id="testimonials" class="section">
        <div class="container">
            <h2 class="section-title">Testimonials</h2>
            <div class="testimonials-grid">
                ${testimonials.map(testimonial => `
                    <div class="testimonial-card">
                        <div class="testimonial-content">
                            <p class="testimonial-text">"${testimonial.content}"</p>
                        </div>
                        <div class="testimonial-author">
                            <div class="author-info">
                                <h4 class="author-name">${testimonial.name}</h4>
                                <p class="author-role">${testimonial.role}</p>
                                <p class="author-company">${testimonial.company}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>`;
  }

  /**
   * Generate social links HTML
   */
  private generateSocialLinks(personalInfo: any): string {
    const links = [];
    
    if (personalInfo.linkedin) {
      links.push(`<a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="social-link">LinkedIn</a>`);
    }
    
    if (personalInfo.github) {
      links.push(`<a href="${personalInfo.github}" target="_blank" rel="noopener noreferrer" class="social-link">GitHub</a>`);
    }
    
    if (personalInfo.website) {
      links.push(`<a href="${personalInfo.website}" target="_blank" rel="noopener noreferrer" class="social-link">Website</a>`);
    }

    return links.length > 0 ? `
        <div class="social-links">
            ${links.join('')}
        </div>
    ` : '';
  }

  /**
   * Generate enhanced CSS for portfolio
   */
  generatePortfolioCSS(portfolioData: GeneratedPortfolio): string {
    const { customizations } = portfolioData;
    const colors = customizations.colors;

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
        font-family: '${customizations.font}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: ${colors.text};
        background-color: ${colors.background};
    }

    /* Career Objectives */
    .career-objectives-content {
      text-align: center;
    }

    .career-objectives-text {
      font-size: 1.25rem;
      color: ${colors.text}dd;
      margin-bottom: 1rem;
      line-height: 1.6;
      max-width: 3xl;
      margin-left: auto;
      margin-right: auto;
    }

    /* Personal Interests */
    .personal-interests-content {
      text-align: center;
    }

    .personal-interests-text {
      font-size: 1.125rem;
      color: ${colors.text}dd;
      margin-bottom: 1rem;
      line-height: 1.6;
      max-width: 2xl;
      margin-left: auto;
      margin-right: auto;
    }

    /* What Makes Me Unique */
    .unique-content {
      text-align: center;
    }

    .unique-text {
      font-size: 1.125rem;
      color: ${colors.text}dd;
      margin-bottom: 1rem;
      line-height: 1.6;
      max-width: 2xl;
      margin-left: auto;
      margin-right: auto;
    }

    /* Typography */
    h1, h2, h3, h4, h5, h6 {
        font-weight: 600;
        line-height: 1.2;
        margin-bottom: 1rem;
    }

    h1 { font-size: 2.5rem; }
    h2 { font-size: 2.25rem; }
    h3 { font-size: 1.875rem; }
    h4 { font-size: 1.5rem; }
    h5 { font-size: 1.25rem; }
    h6 { font-size: 1.125rem; }

    p {
        margin-bottom: 1rem;
        color: ${colors.text}dd;
    }

    a {
        color: ${colors.primary};
        text-decoration: none;
        transition: all 0.3s ease;
    }

    a:hover {
        color: ${colors.secondary};
    }

    /* Layout */
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    .section {
        padding: 5rem 0;
    }

    .section-title {
        text-align: center;
        margin-bottom: 3rem;
        color: ${colors.primary};
        position: relative;
    }

    .section-title::after {
        content: '';
        display: block;
        width: 60px;
        height: 4px;
        background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
        margin: 1rem auto;
        border-radius: 2px;
    }

    /* Navigation */
    .navbar {
        position: fixed;
        top: 0;
        width: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transition: all 0.3s ease;
    }

    .nav-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .nav-brand .brand-text {
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
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: all 0.3s ease;
        position: relative;
    }

    .nav-link:hover {
        background: ${colors.primary}15;
        color: ${colors.primary};
    }

    .nav-toggle {
        display: none;
        flex-direction: column;
        cursor: pointer;
    }

    .bar {
        width: 25px;
        height: 3px;
        background: ${colors.primary};
        margin: 3px 0;
        transition: 0.3s;
        border-radius: 2px;
    }

    /* Hero Section */
    .hero {
        padding: 8rem 0 6rem;
        background: linear-gradient(135deg, ${colors.background} 0%, ${colors.primary}10 100%);
        overflow: hidden;
        position: relative;
    }

    .hero::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${colors.primary.slice(1)}' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        z-index: 0;
    }

    .hero-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        position: relative;
        z-index: 1;
    }

    .hero-content {
        animation: fadeInUp 1s ease-out;
    }

    .hero-greeting {
        display: block;
        font-size: 1.2rem;
        color: ${colors.text}aa;
        margin-bottom: 0.5rem;
    }

    .hero-name {
        display: block;
        font-size: 3.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 1rem;
    }

    .hero-subtitle {
        font-size: 1.25rem;
        color: ${colors.text}dd;
        margin-bottom: 2rem;
        line-height: 1.6;
    }

    .hero-actions {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .hero-visual {
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeInRight 1s ease-out 0.3s both;
    }

    .hero-avatar {
        position: relative;
    }

    .avatar-circle {
        width: 200px;
        height: 200px;
        background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
    }

    .avatar-circle::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, ${colors.primary}, ${colors.accent}, ${colors.secondary});
        border-radius: 50%;
        z-index: -1;
        animation: rotate 4s linear infinite;
    }

    .avatar-text {
        font-size: 3rem;
        font-weight: 700;
        color: white;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    /* Buttons */
    .btn {
        display: inline-block;
        padding: 0.875rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        text-align: center;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
        z-index: 1;
    }

    .btn:hover::before {
        left: 100%;
    }

    .btn-primary {
        background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
        color: white;
        box-shadow: 0 4px 15px ${colors.primary}40;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px ${colors.primary}60;
    }

    .btn-secondary {
        background: transparent;
        color: ${colors.primary};
        border: 2px solid ${colors.primary};
    }

    .btn-secondary:hover {
        background: ${colors.primary};
        color: white;
        transform: translateY(-2px);
    }

    .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
    }

    /* Social Links */
    .social-links {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }

    .social-link {
        padding: 0.75rem 1.5rem;
        background: ${colors.primary}15;
        color: ${colors.primary};
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .social-link:hover {
        background: ${colors.primary};
        color: white;
        transform: translateY(-2px);
    }

    /* Project Cards */
    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
    }

    .project-card {
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        border: 1px solid ${colors.primary}20;
    }

    .project-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .project-image {
        height: 200px;
        overflow: hidden;
        position: relative;
    }

    .project-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .project-card:hover .project-image img {
        transform: scale(1.05);
    }

    .project-content {
        padding: 1.5rem;
    }

    .project-title {
        color: ${colors.primary};
        margin-bottom: 0.5rem;
    }

    .project-description {
        color: ${colors.text}dd;
        margin-bottom: 1rem;
        line-height: 1.6;
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
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .project-features {
        list-style: none;
        margin-bottom: 1.5rem;
    }

    .project-features li {
        padding: 0.25rem 0;
        color: ${colors.text}dd;
        position: relative;
        padding-left: 1.5rem;
    }

    .project-features li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: ${colors.accent};
        font-weight: bold;
    }

    .project-links {
        display: flex;
        gap: 0.5rem;
    }

    /* Timeline */
    .timeline {
        position: relative;
        padding-left: 3rem;
    }

    .timeline::before {
        content: '';
        position: absolute;
        left: 1rem;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(180deg, ${colors.primary}, ${colors.accent});
    }

    .timeline-item {
        position: relative;
        margin-bottom: 3rem;
    }

    .timeline-item::before {
        content: '';
        position: absolute;
        left: -3.5rem;
        top: 0.5rem;
        width: 12px;
        height: 12px;
        background: ${colors.primary};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 0 3px ${colors.primary}30;
    }

    .timeline-content {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid ${colors.primary}20;
    }

    .timeline-title {
        color: ${colors.primary};
        margin-bottom: 0.5rem;
    }

    .timeline-company {
        color: ${colors.secondary};
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
    }

    .timeline-duration {
        background: ${colors.accent}20;
        color: ${colors.accent};
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
        display: inline-block;
        margin-bottom: 1rem;
    }

    .timeline-achievements {
        list-style: none;
        margin-top: 1rem;
    }

    .timeline-achievements li {
        padding: 0.25rem 0;
        position: relative;
        padding-left: 1.5rem;
        color: ${colors.text}dd;
    }

    .timeline-achievements li::before {
        content: '•';
        position: absolute;
        left: 0;
        color: ${colors.accent};
        font-weight: bold;
    }

    /* Education Cards */
    .education-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .education-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid ${colors.primary}20;
        text-align: center;
        transition: all 0.3s ease;
    }

    .education-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    .education-degree {
        color: ${colors.primary};
        margin-bottom: 0.5rem;
    }

    .education-school {
        color: ${colors.secondary};
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
    }

    .education-year {
        background: ${colors.accent}20;
        color: ${colors.accent};
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
        display: inline-block;
        margin-bottom: 1rem;
    }

    /* Skills */
    .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }

    .skills-category {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid ${colors.primary}20;
    }

    .skills-category-title {
        color: ${colors.primary};
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .skill-tag {
        padding: 0.5rem 1rem;
        border-radius: 25px;
        font-weight: 500;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        cursor: default;
    }

    .skill-tag.technical {
        background: ${colors.primary}15;
        color: ${colors.primary};
    }

    .skill-tag.soft {
        background: ${colors.secondary}15;
        color: ${colors.secondary};
    }

    .skill-tag.tools {
        background: ${colors.accent}15;
        color: ${colors.accent};
    }

    .skill-tag:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Testimonials */
    .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
    }

    .testimonial-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid ${colors.primary}20;
        position: relative;
    }

    .testimonial-card::before {
        content: '"';
        position: absolute;
        top: -10px;
        left: 1.5rem;
        font-size: 4rem;
        color: ${colors.primary}30;
        font-family: serif;
    }

    .testimonial-text {
        font-style: italic;
        color: ${colors.text}dd;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }

    .author-name {
        color: ${colors.primary};
        margin-bottom: 0.25rem;
    }

    .author-role {
        color: ${colors.secondary};
        font-weight: 500;
        margin-bottom: 0.25rem;
    }

    .author-company {
        color: ${colors.text}aa;
        font-size: 0.9rem;
    }

    /* Contact Section */
    .contact-section {
        background: linear-gradient(135deg, ${colors.primary}05 0%, ${colors.accent}05 100%);
    }

    .contact-content {
        text-align: center;
    }

    .contact-info {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .contact-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid ${colors.primary}20;
        transition: all 0.3s ease;
    }

    .contact-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    .contact-icon {
        font-size: 1.2rem;
    }

    .contact-link {
        color: ${colors.primary};
        font-weight: 500;
    }

    .contact-text {
        color: ${colors.text}dd;
    }

    /* Footer */
    .footer {
        background: ${colors.primary};
        color: white;
        text-align: center;
        padding: 2rem 0;
    }

    .footer-text {
        margin: 0;
        opacity: 0.9;
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

    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: white;
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            padding: 2rem 0;
        }

        .nav-menu.active {
            left: 0;
        }

        .nav-toggle {
            display: flex;
        }

        .nav-toggle.active .bar:nth-child(2) {
            opacity: 0;
        }

        .nav-toggle.active .bar:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }

        .nav-toggle.active .bar:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }

        .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
        }

        .hero-name {
            font-size: 2.5rem;
        }

        .projects-grid {
            grid-template-columns: 1fr;
        }

        .timeline {
            padding-left: 2rem;
        }

        .timeline::before {
            left: 0.5rem;
        }

        .timeline-item::before {
            left: -0.25rem;
        }

        .contact-info {
            flex-direction: column;
            align-items: center;
        }

        .hero-actions {
            flex-direction: column;
            align-items: center;
        }

        .social-links {
            justify-content: center;
        }

        h1 { font-size: 2rem; }
        h2 { font-size: 1.75rem; }
        
        .container {
            padding: 0 1rem;
        }
        
        .section {
            padding: 3rem 0;
        }
    }

    @media (max-width: 480px) {
        .hero-name {
            font-size: 2rem;
        }
        
        .avatar-circle {
            width: 150px;
            height: 150px;
        }
        
        .avatar-text {
            font-size: 2rem;
        }
        
        .btn {
            padding: 0.75rem 1.5rem;
        }
    }
    `;
  }

  /**
   * Generate JavaScript for portfolio functionality
   */
  generatePortfolioJavaScript(): string {
    return `
    // Mobile Navigation Toggle
    document.addEventListener('DOMContentLoaded', function() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Smooth scrolling for anchor links
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

        // Navbar background on scroll
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.project-card, .timeline-item, .education-card, .skills-category, .testimonial-card');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Lazy loading for images
        const images = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });

        // Add a subtle parallax effect to hero background
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = 'translateY(' + scrolled * 0.3 + 'px)';
            }
        });
    });
    `;
  }

  /**
   * Deploy portfolio to Netlify
   */
  async deployToNetlify(portfolioData: GeneratedPortfolio): Promise<PortfolioDeployment> {
    try {
      const html = this.generatePortfolioHTML(portfolioData);
      
      // Create a mock deployment for now since we don't have actual Netlify integration
      const mockDeployment: NetlifyDeployment = {
        id: `deploy_${Date.now()}`,
        url: `https://${portfolioData.slug}.netlify.app`,
        deploy_url: `https://${portfolioData.slug}.netlify.app`,
        site_id: `site_${Date.now()}`,
        site_name: portfolioData.slug,
        state: 'ready',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return {
        success: true,
        deployment: mockDeployment,
        previewUrl: mockDeployment.url
      };
    } catch (error) {
      console.error('Deployment error:', error);
      return {
        success: false,
        error: 'Failed to deploy portfolio. Please try again.'
      };
    }
  }
}

// Export singleton instance
export const netlifyIntegration = NetlifyIntegration.getInstance();