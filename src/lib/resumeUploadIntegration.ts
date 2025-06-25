// Resume Upload Integration for Cover Letter Generation
import { ResumeData } from './localStorage';
import { parseResumeFile, ParsedResume } from './resumeParser';

export interface ResumeUploadResult {
  success: boolean;
  resumeData?: ResumeData;
  error?: string;
}

export class ResumeUploadIntegration {
  private static instance: ResumeUploadIntegration;

  static getInstance(): ResumeUploadIntegration {
    if (!ResumeUploadIntegration.instance) {
      ResumeUploadIntegration.instance = new ResumeUploadIntegration();
    }
    return ResumeUploadIntegration.instance;
  }

  /**
   * Process uploaded resume file and convert to ResumeData format
   */
  async processResumeUpload(file: File): Promise<ResumeUploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Parse resume file
      const parsedResume = await parseResumeFile(file);
      
      // Convert to ResumeData format
      const resumeData = this.convertToResumeData(parsedResume);
      
      return { success: true, resumeData };
    } catch (error) {
      console.error('Resume upload processing failed:', error);
      return { 
        success: false, 
        error: 'Failed to process resume file. Please check the format and try again.' 
      };
    }
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only PDF, DOCX, and TXT files are supported' };
    }

    return { valid: true };
  }

  /**
   * Convert ParsedResume to ResumeData format
   */
  private convertToResumeData(parsedResume: ParsedResume): ResumeData {
    return {
      id: Date.now().toString(),
      title: `Imported Resume - ${new Date().toLocaleDateString()}`,
      personalInfo: {
        name: parsedResume.personalInfo.name || '',
        email: parsedResume.personalInfo.email || '',
        phone: parsedResume.personalInfo.phone || '',
        location: parsedResume.personalInfo.location || '',
        website: parsedResume.personalInfo.website || '',
        linkedin: parsedResume.personalInfo.linkedin || ''
      },
      summary: parsedResume.summary || '',
      experience: parsedResume.experience.map(exp => ({
        id: exp.id,
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
        current: exp.current
      })),
      education: parsedResume.education.map(edu => ({
        id: edu.id,
        degree: edu.degree,
        school: edu.school,
        graduationYear: edu.graduationYear,
        gpa: edu.gpa || ''
      })),
      skills: {
        technical: parsedResume.skills.technical || [],
        soft: parsedResume.skills.soft || []
      },
      certifications: parsedResume.certifications.map(cert => ({
        id: cert.id,
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date
      })),
      template: 'modern-professional',
      lastModified: new Date().toISOString(),
      version: 1
    };
  }

  /**
   * Extract text content from resume for analysis
   */
  extractResumeText(resumeData: ResumeData): string {
    const sections = [
      resumeData.personalInfo.name,
      resumeData.summary,
      resumeData.experience.map(exp => 
        `${exp.title} at ${exp.company}. ${exp.description}`
      ).join(' '),
      resumeData.education.map(edu => 
        `${edu.degree} from ${edu.school}`
      ).join(' '),
      resumeData.skills.technical?.join(' ') || '',
      resumeData.skills.soft?.join(' ') || '',
      resumeData.certifications.map(cert => 
        `${cert.name} from ${cert.issuer}`
      ).join(' ')
    ];

    return sections.filter(section => section && section.trim()).join(' ');
  }

  /**
   * Analyze resume content for job matching
   */
  analyzeResumeForJob(resumeData: ResumeData, jobDescription: string): {
    matchingSkills: string[];
    relevantExperience: any[];
    keywordDensity: number;
    suggestions: string[];
  } {
    const resumeText = this.extractResumeText(resumeData).toLowerCase();
    const jobWords = jobDescription.toLowerCase().split(/\s+/);
    
    // Find matching skills
    const allSkills = [
      ...(resumeData.skills.technical || []),
      ...(resumeData.skills.soft || [])
    ];
    
    const matchingSkills = allSkills.filter(skill =>
      jobDescription.toLowerCase().includes(skill.toLowerCase())
    );

    // Find relevant experience
    const relevantExperience = resumeData.experience.filter(exp =>
      jobWords.some(word =>
        exp.title?.toLowerCase().includes(word) ||
        exp.description?.toLowerCase().includes(word) ||
        exp.company?.toLowerCase().includes(word)
      )
    );

    // Calculate keyword density
    const matchingWords = jobWords.filter(word =>
      word.length > 3 && resumeText.includes(word)
    );
    const keywordDensity = matchingWords.length / jobWords.length;

    // Generate suggestions
    const suggestions = this.generateMatchingSuggestions(
      resumeData,
      jobDescription,
      matchingSkills,
      keywordDensity
    );

    return {
      matchingSkills,
      relevantExperience,
      keywordDensity,
      suggestions
    };
  }

  /**
   * Generate suggestions for improving job match
   */
  private generateMatchingSuggestions(
    resumeData: ResumeData,
    jobDescription: string,
    matchingSkills: string[],
    keywordDensity: number
  ): string[] {
    const suggestions = [];

    if (matchingSkills.length < 3) {
      suggestions.push('Consider highlighting more skills that match the job requirements');
    }

    if (keywordDensity < 0.1) {
      suggestions.push('Add more keywords from the job description to your resume');
    }

    if (!resumeData.summary || resumeData.summary.length < 100) {
      suggestions.push('Add a professional summary that aligns with the job requirements');
    }

    if (resumeData.experience.length === 0) {
      suggestions.push('Add relevant work experience to strengthen your application');
    }

    return suggestions;
  }

  /**
   * Generate cover letter data from resume and job info
   */
  generateCoverLetterData(
    resumeData: ResumeData,
    jobTitle: string,
    companyName: string,
    jobDescription: string
  ): {
    personalInfo: any;
    relevantSkills: string[];
    relevantExperience: any[];
    keyPoints: string[];
  } {
    const analysis = this.analyzeResumeForJob(resumeData, jobDescription);
    
    return {
      personalInfo: resumeData.personalInfo,
      relevantSkills: analysis.matchingSkills.slice(0, 6),
      relevantExperience: analysis.relevantExperience.slice(0, 3),
      keyPoints: [
        `${analysis.matchingSkills.length} matching skills identified`,
        `${analysis.relevantExperience.length} relevant positions found`,
        `${Math.round(analysis.keywordDensity * 100)}% keyword match with job description`
      ]
    };
  }
}

// Export singleton instance
export const resumeUploadIntegration = ResumeUploadIntegration.getInstance();