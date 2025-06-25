// Portfolio Export System for PDF and Word formats
import jsPDF from 'jspdf';
import { PortfolioData } from './portfolioGenerator';

export interface ExportOptions {
  format: 'pdf' | 'docx';
  template: string;
  includeContact: boolean;
  includeProjects: boolean;
  pageSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
}

export class PortfolioExporter {
  private static instance: PortfolioExporter;

  static getInstance(): PortfolioExporter {
    if (!PortfolioExporter.instance) {
      PortfolioExporter.instance = new PortfolioExporter();
    }
    return PortfolioExporter.instance;
  }

  /**
   * Export portfolio to PDF format
   */
  async exportToPDF(portfolioData: PortfolioData, options: ExportOptions = {
    format: 'pdf',
    template: 'modern',
    includeContact: true,
    includeProjects: true,
    pageSize: 'A4',
    orientation: 'portrait'
  }): Promise<void> {
    try {
      const pdf = new jsPDF({
        orientation: options.orientation,
        unit: 'mm',
        format: options.pageSize
      });

      // Set up document properties
      pdf.setProperties({
        title: `${portfolioData.personalInfo.name} - Portfolio`,
        subject: 'Professional Portfolio',
        author: portfolioData.personalInfo.name,
        creator: 'CareerKit Portfolio Builder'
      });

      let yPosition = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // Header Section
      yPosition = this.addPDFHeader(pdf, portfolioData, yPosition, contentWidth, margin);

      // About Section
      if (portfolioData.sections.about) {
        yPosition = this.addPDFSection(pdf, 'About Me', portfolioData.sections.about, yPosition, contentWidth, margin, pageHeight);
      }

      // Skills Section
      if (portfolioData.sections.skills.technical.length > 0 || portfolioData.sections.skills.soft.length > 0) {
        yPosition = this.addPDFSkillsSection(pdf, portfolioData.sections.skills, yPosition, contentWidth, margin, pageHeight);
      }

      // Experience Section
      if (portfolioData.sections.experience.length > 0) {
        yPosition = this.addPDFExperienceSection(pdf, portfolioData.sections.experience, yPosition, contentWidth, margin, pageHeight);
      }

      // Education Section
      if (portfolioData.sections.education.length > 0) {
        yPosition = this.addPDFEducationSection(pdf, portfolioData.sections.education, yPosition, contentWidth, margin, pageHeight);
      }

      // Projects Section
      if (options.includeProjects && portfolioData.sections.projects && portfolioData.sections.projects.length > 0) {
        yPosition = this.addPDFProjectsSection(pdf, portfolioData.sections.projects, yPosition, contentWidth, margin, pageHeight);
      }

      // Contact Section
      if (options.includeContact) {
        this.addPDFContactSection(pdf, portfolioData.personalInfo, yPosition, contentWidth, margin, pageHeight);
      }

      // Add footer to all pages
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        this.addPDFFooter(pdf, portfolioData.personalInfo.name, i, pageCount, pageWidth, pageHeight);
      }

      // Download the PDF
      const fileName = `${portfolioData.personalInfo.name.replace(/\s+/g, '_')}_Portfolio.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('PDF export error:', error);
      throw new Error('Failed to export portfolio as PDF');
    }
  }

  /**
   * Export portfolio to Word format
   */
  async exportToWord(portfolioData: PortfolioData, options: ExportOptions = {
    format: 'docx',
    template: 'modern',
    includeContact: true,
    includeProjects: true,
    pageSize: 'A4',
    orientation: 'portrait'
  }): Promise<void> {
    try {
      const htmlContent = this.generateWordHTML(portfolioData, options);
      
      // Create blob and download
      const blob = new Blob([htmlContent], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${portfolioData.personalInfo.name.replace(/\s+/g, '_')}_Portfolio.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Word export error:', error);
      throw new Error('Failed to export portfolio as Word document');
    }
  }

  /**
   * Export resume data to PDF format
   */
  async exportResumeToPDF(resumeData: any): Promise<void> {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'A4'
      });

      // Set up document properties
      pdf.setProperties({
        title: `${resumeData.personalInfo.name} - Resume`,
        subject: 'Professional Resume',
        author: resumeData.personalInfo.name,
        creator: 'CareerKit Resume Builder'
      });

      let yPosition = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // Header Section
      yPosition = this.addResumeHeader(pdf, resumeData, yPosition, contentWidth, margin);

      // Summary Section
      if (resumeData.summary) {
        yPosition = this.addPDFSection(pdf, 'Professional Summary', resumeData.summary, yPosition, contentWidth, margin, pageHeight);
      }

      // Experience Section
      if (resumeData.experience && resumeData.experience.length > 0) {
        yPosition = this.addPDFExperienceSection(pdf, resumeData.experience, yPosition, contentWidth, margin, pageHeight);
      }

      // Education Section
      if (resumeData.education && resumeData.education.length > 0) {
        yPosition = this.addPDFEducationSection(pdf, resumeData.education, yPosition, contentWidth, margin, pageHeight);
      }

      // Skills Section
      if (resumeData.skills) {
        yPosition = this.addPDFSkillsSection(pdf, resumeData.skills, yPosition, contentWidth, margin, pageHeight);
      }

      // Certifications Section
      if (resumeData.certifications && resumeData.certifications.length > 0) {
        yPosition = this.addPDFCertificationsSection(pdf, resumeData.certifications, yPosition, contentWidth, margin, pageHeight);
      }

      // Add footer to all pages
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        this.addPDFFooter(pdf, resumeData.personalInfo.name, i, pageCount, pageWidth, pageHeight);
      }

      // Download the PDF
      const fileName = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Resume PDF export error:', error);
      throw new Error('Failed to export resume as PDF');
    }
  }

  /**
   * Export resume data to Word format
   */
  async exportResumeToWord(resumeData: any): Promise<void> {
    try {
      const htmlContent = this.generateResumeWordHTML(resumeData);
      
      // Create blob and download
      const blob = new Blob([htmlContent], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Resume Word export error:', error);
      throw new Error('Failed to export resume as Word document');
    }
  }

  // PDF Helper Methods
  private addPDFHeader(pdf: jsPDF, portfolioData: PortfolioData, yPosition: number, contentWidth: number, margin: number): number {
    const { personalInfo } = portfolioData;

    // Name
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text(personalInfo.name, margin, yPosition);
    yPosition += 12;

    // Contact Info
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    
    const contactInfo = [];
    if (personalInfo.email) contactInfo.push(personalInfo.email);
    if (personalInfo.phone) contactInfo.push(personalInfo.phone);
    if (personalInfo.location) contactInfo.push(personalInfo.location);
    
    if (contactInfo.length > 0) {
      pdf.text(contactInfo.join(' | '), margin, yPosition);
      yPosition += 8;
    }

    // Links
    const links = [];
    if (personalInfo.website) links.push(personalInfo.website);
    if (personalInfo.linkedin) links.push(personalInfo.linkedin);
    if (personalInfo.github) links.push(personalInfo.github);
    
    if (links.length > 0) {
      pdf.text(links.join(' | '), margin, yPosition);
      yPosition += 8;
    }

    // Add separator line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition + 2, margin + contentWidth, yPosition + 2);
    
    return yPosition + 10;
  }

  private addResumeHeader(pdf: jsPDF, resumeData: any, yPosition: number, contentWidth: number, margin: number): number {
    const { personalInfo } = resumeData;

    // Name
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text(personalInfo.name, margin, yPosition);
    yPosition += 12;

    // Contact Info
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    
    const contactInfo = [];
    if (personalInfo.email) contactInfo.push(personalInfo.email);
    if (personalInfo.phone) contactInfo.push(personalInfo.phone);
    if (personalInfo.location) contactInfo.push(personalInfo.location);
    
    if (contactInfo.length > 0) {
      pdf.text(contactInfo.join(' | '), margin, yPosition);
      yPosition += 8;
    }

    // Links
    const links = [];
    if (personalInfo.website) links.push(personalInfo.website);
    if (personalInfo.linkedin) links.push(personalInfo.linkedin);
    
    if (links.length > 0) {
      pdf.text(links.join(' | '), margin, yPosition);
      yPosition += 8;
    }

    // Add separator line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition + 2, margin + contentWidth, yPosition + 2);
    
    return yPosition + 10;
  }

  private addPDFSection(pdf: jsPDF, title: string, content: string, yPosition: number, contentWidth: number, margin: number, pageHeight: number): number {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }

    // Section title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text(title, margin, yPosition);
    yPosition += 10;

    // Section content
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    
    const lines = pdf.splitTextToSize(content, contentWidth);
    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * 5 + 10;

    return yPosition;
  }

  private addPDFSkillsSection(pdf: jsPDF, skills: any, yPosition: number, contentWidth: number, margin: number, pageHeight: number): number {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    // Section title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text('Skills', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);

    // Technical Skills
    if (skills.technical && skills.technical.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Technical Skills:', margin, yPosition);
      yPosition += 6;
      
      pdf.setFont('helvetica', 'normal');
      const techSkills = skills.technical.join(', ');
      const techLines = pdf.splitTextToSize(techSkills, contentWidth);
      pdf.text(techLines, margin, yPosition);
      yPosition += techLines.length * 5 + 5;
    }

    // Soft Skills
    if (skills.soft && skills.soft.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Soft Skills:', margin, yPosition);
      yPosition += 6;
      
      pdf.setFont('helvetica', 'normal');
      const softSkills = skills.soft.join(', ');
      const softLines = pdf.splitTextToSize(softSkills, contentWidth);
      pdf.text(softLines, margin, yPosition);
      yPosition += softLines.length * 5 + 10;
    }

    return yPosition;
  }

  private addPDFExperienceSection(pdf: jsPDF, experience: any[], yPosition: number, contentWidth: number, margin: number, pageHeight: number): number {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    // Section title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text('Experience', margin, yPosition);
    yPosition += 10;

    experience.forEach((exp, index) => {
      // Check if we need a new page for this experience
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }

      // Job title and company
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(44, 62, 80);
      pdf.text(exp.title, margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${exp.company} | ${exp.startDate} - ${exp.endDate}`, margin, yPosition);
      yPosition += 8;

      // Description
      if (exp.description) {
        pdf.setTextColor(60, 60, 60);
        const lines = pdf.splitTextToSize(exp.description, contentWidth);
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * 5 + 8;
      }
    });

    return yPosition + 5;
  }

  private addPDFEducationSection(pdf: jsPDF, education: any[], yPosition: number, contentWidth: number, margin: number, pageHeight: number): number {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }

    // Section title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text('Education', margin, yPosition);
    yPosition += 10;

    education.forEach((edu) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }

      // Degree
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(44, 62, 80);
      pdf.text(edu.degree, margin, yPosition);
      yPosition += 6;

      // School and year
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      const schoolInfo = `${edu.school}${edu.graduationYear ? ` | ${edu.graduationYear}` : ''}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`;
      pdf.text(schoolInfo, margin, yPosition);
      yPosition += 10;
    });

    return yPosition + 5;
  }

  private addPDFProjectsSection(pdf: jsPDF, projects: any[], yPosition: number, contentWidth: number, margin: number, pageHeight: number): number {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    // Section title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text('Projects', margin, yPosition);
    yPosition += 10;

    projects.forEach((project) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      // Project title
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(44, 62, 80);
      pdf.text(project.title, margin, yPosition);
      yPosition += 6;

      // Project description
      if (project.description) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        const lines = pdf.splitTextToSize(project.description, contentWidth);
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * 5 + 8;
      }
    });

    return yPosition + 5;
  }

  private addPDFCertificationsSection(pdf: jsPDF, certifications: any[], yPosition: number, contentWidth: number, margin: number, pageHeight: number): number {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }

    // Section title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text('Certifications', margin, yPosition);
    yPosition += 10;

    certifications.forEach((cert) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }

      // Certification name
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(44, 62, 80);
      pdf.text(cert.name, margin, yPosition);
      yPosition += 6;

      // Issuer and date
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      const certInfo = `${cert.issuer}${cert.date ? ` | ${cert.date}` : ''}`;
      pdf.text(certInfo, margin, yPosition);
      yPosition += 8;
    });

    return yPosition + 5;
  }

  private addPDFContactSection(pdf: jsPDF, personalInfo: any, yPosition: number, contentWidth: number, margin: number, pageHeight: number): number {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }

    // Section title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text('Contact', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);

    const contactItems = [
      personalInfo.email && `Email: ${personalInfo.email}`,
      personalInfo.phone && `Phone: ${personalInfo.phone}`,
      personalInfo.website && `Website: ${personalInfo.website}`,
      personalInfo.linkedin && `LinkedIn: ${personalInfo.linkedin}`
    ].filter(Boolean);

    contactItems.forEach((item) => {
      pdf.text(item, margin, yPosition);
      yPosition += 6;
    });

    return yPosition + 10;
  }

  private addPDFFooter(pdf: jsPDF, name: string, pageNum: number, totalPages: number, pageWidth: number, pageHeight: number): void {
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(150, 150, 150);
    
    // Left side - name
    pdf.text(name, 20, pageHeight - 10);
    
    // Right side - page number
    const pageText = `Page ${pageNum} of ${totalPages}`;
    const textWidth = pdf.getTextWidth(pageText);
    pdf.text(pageText, pageWidth - 20 - textWidth, pageHeight - 10);
  }

  // Word Document Generation
  private generateWordHTML(portfolioData: PortfolioData, options: ExportOptions): string {
    const { personalInfo, sections } = portfolioData;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${personalInfo.name} - Portfolio</title>
    <style>
        body { 
            font-family: 'Calibri', sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
        }
        .name { 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 10px; 
            color: #2563eb;
        }
        .contact { 
            font-size: 14px; 
            color: #666; 
            margin-bottom: 5px;
        }
        .section { 
            margin-bottom: 25px; 
        }
        .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            border-bottom: 1px solid #2563eb; 
            margin-bottom: 15px; 
            color: #2563eb;
            padding-bottom: 5px;
        }
        .job { 
            margin-bottom: 15px; 
        }
        .job-title { 
            font-weight: bold; 
            font-size: 16px;
            color: #333;
        }
        .company { 
            font-style: italic; 
            color: #666;
            margin-bottom: 5px;
        }
        .date { 
            color: #888; 
            font-size: 14px;
        }
        .description { 
            margin-top: 8px; 
            text-align: justify;
        }
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }
        .skill-tag {
            background-color: #e3f2fd;
            color: #1976d2;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
        }
        ul { 
            margin: 10px 0; 
            padding-left: 20px; 
        }
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .contact-item {
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        .contact-label {
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${personalInfo.name}</div>
        <div class="contact">${personalInfo.email}</div>
        ${personalInfo.phone ? `<div class="contact">${personalInfo.phone}</div>` : ''}
        ${personalInfo.location ? `<div class="contact">${personalInfo.location}</div>` : ''}
        ${personalInfo.website ? `<div class="contact">${personalInfo.website}</div>` : ''}
        ${personalInfo.linkedin ? `<div class="contact">${personalInfo.linkedin}</div>` : ''}
    </div>

    ${sections.about ? `
    <div class="section">
        <div class="section-title">About Me</div>
        <p class="description">${sections.about}</p>
    </div>
    ` : ''}

    ${(sections.skills.technical.length > 0 || sections.skills.soft.length > 0) ? `
    <div class="section">
        <div class="section-title">Skills</div>
        ${sections.skills.technical.length > 0 ? `
        <div>
            <strong>Technical Skills:</strong>
            <div class="skills-list">
                ${sections.skills.technical.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        ${sections.skills.soft.length > 0 ? `
        <div style="margin-top: 15px;">
            <strong>Soft Skills:</strong>
            <div class="skills-list">
                ${sections.skills.soft.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
        ` : ''}
    </div>
    ` : ''}

    ${sections.experience.length > 0 ? `
    <div class="section">
        <div class="section-title">Experience</div>
        ${sections.experience.map(exp => `
        <div class="job">
            <div class="job-title">${exp.title}</div>
            <div class="company">${exp.company} <span class="date">${exp.startDate} - ${exp.endDate}</span></div>
            <div class="description">${exp.description}</div>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${sections.education.length > 0 ? `
    <div class="section">
        <div class="section-title">Education</div>
        ${sections.education.map(edu => `
        <div class="job">
            <div class="job-title">${edu.degree}</div>
            <div class="company">${edu.school} <span class="date">${edu.graduationYear}</span></div>
            ${edu.gpa ? `<div class="description">GPA: ${edu.gpa}</div>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${options.includeProjects && sections.projects && sections.projects.length > 0 ? `
    <div class="section">
        <div class="section-title">Projects</div>
        ${sections.projects.map(project => `
        <div class="job">
            <div class="job-title">${project.title}</div>
            <div class="description">${project.description}</div>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${sections.certifications.length > 0 ? `
    <div class="section">
        <div class="section-title">Certifications</div>
        ${sections.certifications.map(cert => `
        <div class="job">
            <div class="job-title">${cert.name}</div>
            <div class="company">${cert.issuer} <span class="date">${cert.date}</span></div>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${options.includeContact ? `
    <div class="section">
        <div class="section-title">Contact Information</div>
        <div class="contact-grid">
            ${personalInfo.email ? `
            <div class="contact-item">
                <div class="contact-label">Email</div>
                <div>${personalInfo.email}</div>
            </div>
            ` : ''}
            ${personalInfo.phone ? `
            <div class="contact-item">
                <div class="contact-label">Phone</div>
                <div>${personalInfo.phone}</div>
            </div>
            ` : ''}
            ${personalInfo.website ? `
            <div class="contact-item">
                <div class="contact-label">Website</div>
                <div>${personalInfo.website}</div>
            </div>
            ` : ''}
            ${personalInfo.linkedin ? `
            <div class="contact-item">
                <div class="contact-label">LinkedIn</div>
                <div>${personalInfo.linkedin}</div>
            </div>
            ` : ''}
        </div>
    </div>
    ` : ''}
</body>
</html>`;
  }

  private generateResumeWordHTML(resumeData: any): string {
    const { personalInfo, summary, experience, education, skills, certifications } = resumeData;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${personalInfo.name} - Resume</title>
    <style>
        body { 
            font-family: 'Calibri', sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
        }
        .name { 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 10px; 
            color: #2563eb;
        }
        .contact { 
            font-size: 14px; 
            color: #666; 
            margin-bottom: 5px;
        }
        .section { 
            margin-bottom: 25px; 
        }
        .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            border-bottom: 1px solid #2563eb; 
            margin-bottom: 15px; 
            color: #2563eb;
            padding-bottom: 5px;
        }
        .job { 
            margin-bottom: 15px; 
        }
        .job-title { 
            font-weight: bold; 
            font-size: 16px;
            color: #333;
        }
        .company { 
            font-style: italic; 
            color: #666;
            margin-bottom: 5px;
        }
        .date { 
            color: #888; 
            font-size: 14px;
        }
        .description { 
            margin-top: 8px; 
            text-align: justify;
        }
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }
        .skill-tag {
            background-color: #e3f2fd;
            color: #1976d2;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${personalInfo.name}</div>
        <div class="contact">${personalInfo.email}</div>
        ${personalInfo.phone ? `<div class="contact">${personalInfo.phone}</div>` : ''}
        ${personalInfo.location ? `<div class="contact">${personalInfo.location}</div>` : ''}
        ${personalInfo.website ? `<div class="contact">${personalInfo.website}</div>` : ''}
        ${personalInfo.linkedin ? `<div class="contact">${personalInfo.linkedin}</div>` : ''}
    </div>

    ${summary ? `
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <p class="description">${summary}</p>
    </div>
    ` : ''}

    ${experience && experience.length > 0 ? `
    <div class="section">
        <div class="section-title">Work Experience</div>
        ${experience.map(exp => `
        <div class="job">
            <div class="job-title">${exp.title}</div>
            <div class="company">${exp.company} <span class="date">${exp.startDate} - ${exp.endDate}</span></div>
            <div class="description">${exp.description}</div>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${education && education.length > 0 ? `
    <div class="section">
        <div class="section-title">Education</div>
        ${education.map(edu => `
        <div class="job">
            <div class="job-title">${edu.degree}</div>
            <div class="company">${edu.school} <span class="date">${edu.graduationYear}</span></div>
            ${edu.gpa ? `<div class="description">GPA: ${edu.gpa}</div>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${skills && (skills.technical?.length > 0 || skills.soft?.length > 0) ? `
    <div class="section">
        <div class="section-title">Skills</div>
        ${skills.technical?.length > 0 ? `
        <div>
            <strong>Technical Skills:</strong>
            <div class="skills-list">
                ${skills.technical.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        ${skills.soft?.length > 0 ? `
        <div style="margin-top: 15px;">
            <strong>Soft Skills:</strong>
            <div class="skills-list">
                ${skills.soft.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
        ` : ''}
    </div>
    ` : ''}

    ${certifications && certifications.length > 0 ? `
    <div class="section">
        <div class="section-title">Certifications</div>
        ${certifications.map(cert => `
        <div class="job">
            <div class="job-title">${cert.name}</div>
            <div class="company">${cert.issuer} <span class="date">${cert.date}</span></div>
        </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>`;
  }
}

// Export singleton instance
export const portfolioExporter = PortfolioExporter.getInstance();