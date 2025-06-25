import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData } from './localStorage';
import { portfolioExporter } from './portfolioExporter';

export class ResumeExporter {
  static async exportToPDF(resumeData: ResumeData, elementId: string): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Resume element not found');
      }

      // Create canvas from HTML element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save(`${resumeData.title || 'resume'}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      // Fallback to portfolio exporter
      try {
        await portfolioExporter.exportResumeToPDF(resumeData);
      } catch (fallbackError) {
        throw new Error('Failed to export resume as PDF');
      }
    }
  }

  static async exportToWord(resumeData: ResumeData): Promise<void> {
    try {
      // Use portfolio exporter for better Word export
      await portfolioExporter.exportResumeToWord(resumeData);
    } catch (error) {
      console.error('Word export error:', error);
      throw new Error('Failed to export resume as Word document');
    }
  }

  private static generateWordHTML(resumeData: ResumeData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${resumeData.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; }
          .name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .contact { font-size: 14px; color: #666; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; font-weight: bold; border-bottom: 2px solid #333; margin-bottom: 15px; }
          .job { margin-bottom: 15px; }
          .job-title { font-weight: bold; }
          .company { font-style: italic; }
          .date { float: right; color: #666; }
          .description { margin-top: 5px; }
          ul { margin: 10px 0; padding-left: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${resumeData.personalInfo.name || ''}</div>
          <div class="contact">
            ${resumeData.personalInfo.email || ''} | 
            ${resumeData.personalInfo.phone || ''} | 
            ${resumeData.personalInfo.location || ''}
          </div>
        </div>

        ${resumeData.summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <p>${resumeData.summary}</p>
        </div>
        ` : ''}

        ${resumeData.experience.length > 0 ? `
        <div class="section">
          <div class="section-title">Work Experience</div>
          ${resumeData.experience.map(exp => `
            <div class="job">
              <div class="job-title">${exp.title}</div>
              <div class="company">${exp.company} <span class="date">${exp.startDate} - ${exp.endDate}</span></div>
              <div class="description">${exp.description}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${resumeData.education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${resumeData.education.map(edu => `
            <div class="job">
              <div class="job-title">${edu.degree}</div>
              <div class="company">${edu.school} <span class="date">${edu.graduationYear}</span></div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0 ? `
        <div class="section">
          <div class="section-title">Skills</div>
          ${resumeData.skills.technical.length > 0 ? `<p><strong>Technical:</strong> ${resumeData.skills.technical.join(', ')}</p>` : ''}
          ${resumeData.skills.soft.length > 0 ? `<p><strong>Soft Skills:</strong> ${resumeData.skills.soft.join(', ')}</p>` : ''}
        </div>
        ` : ''}
      </body>
      </html>
    `;
  }
}