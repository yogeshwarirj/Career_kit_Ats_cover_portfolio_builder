// AI-Powered Cover Letter Generator
import { ResumeData } from './localStorage';

export interface CoverLetterRequest {
  resumeData: ResumeData;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  template: string;
  customInstructions?: string;
}

export interface CoverLetterResponse {
  content: string;
  atsScore: number;
  keywordMatches: string[];
  suggestions: string[];
}

export class AICoverLetterGenerator {
  private static instance: AICoverLetterGenerator;

  static getInstance(): AICoverLetterGenerator {
    if (!AICoverLetterGenerator.instance) {
      AICoverLetterGenerator.instance = new AICoverLetterGenerator();
    }
    return AICoverLetterGenerator.instance;
  }

  /**
   * Generate a personalized cover letter using AI analysis
   */
  async generateCoverLetter(request: CoverLetterRequest): Promise<CoverLetterResponse> {
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Extract relevant information from resume
      const relevantSkills = this.extractRelevantSkills(request.resumeData, request.jobDescription);
      const relevantExperience = this.extractRelevantExperience(request.resumeData, request.jobDescription);
      const keywordMatches = this.findKeywordMatches(request.resumeData, request.jobDescription);

      // Generate cover letter content
      const content = this.generateContent(request, relevantSkills, relevantExperience);
      
      // Calculate ATS score
      const atsScore = this.calculateATSScore(content, request.jobDescription);
      
      // Generate suggestions
      const suggestions = this.generateSuggestions(content, request.jobDescription, keywordMatches);

      return {
        content,
        atsScore,
        keywordMatches,
        suggestions
      };
    } catch (error) {
      console.error('Cover letter generation failed:', error);
      throw new Error('Failed to generate cover letter');
    }
  }

  /**
   * Extract skills from resume that are relevant to the job description
   */
  private extractRelevantSkills(resumeData: ResumeData, jobDescription: string): string[] {
    const allSkills = [
      ...(resumeData.skills.technical || []),
      ...(resumeData.skills.soft || [])
    ];

    if (!jobDescription) return allSkills.slice(0, 6);

    const jobWords = jobDescription.toLowerCase().split(/\s+/);
    const relevantSkills = allSkills.filter(skill =>
      jobWords.some(word => 
        skill.toLowerCase().includes(word) || 
        word.includes(skill.toLowerCase()) ||
        this.calculateSimilarity(skill.toLowerCase(), word) > 0.7
      )
    );

    return relevantSkills.length > 0 ? relevantSkills : allSkills.slice(0, 6);
  }

  /**
   * Extract experience from resume that's relevant to the job
   */
  private extractRelevantExperience(resumeData: ResumeData, jobDescription: string): any[] {
    if (!jobDescription) return resumeData.experience.slice(0, 2);

    const jobWords = jobDescription.toLowerCase().split(/\s+/);
    const relevantExp = resumeData.experience.filter(exp =>
      jobWords.some(word =>
        exp.title?.toLowerCase().includes(word) ||
        exp.description?.toLowerCase().includes(word) ||
        exp.company?.toLowerCase().includes(word)
      )
    );

    return relevantExp.length > 0 ? relevantExp : resumeData.experience.slice(0, 2);
  }

  /**
   * Find keyword matches between resume and job description
   */
  private findKeywordMatches(resumeData: ResumeData, jobDescription: string): string[] {
    const resumeText = this.extractResumeText(resumeData);
    const jobKeywords = this.extractKeywords(jobDescription);
    
    return jobKeywords.filter(keyword =>
      resumeText.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * Extract text content from resume data
   */
  private extractResumeText(resumeData: ResumeData): string {
    const parts = [
      resumeData.summary || '',
      resumeData.experience.map(exp => `${exp.title} ${exp.description}`).join(' '),
      resumeData.skills.technical?.join(' ') || '',
      resumeData.skills.soft?.join(' ') || '',
      resumeData.education.map(edu => `${edu.degree} ${edu.school}`).join(' ')
    ];
    
    return parts.join(' ');
  }

  /**
   * Extract important keywords from job description
   */
  private extractKeywords(jobDescription: string): string[] {
    const commonSkills = [
      'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git',
      'Leadership', 'Management', 'Communication', 'Problem Solving', 'Teamwork',
      'Project Management', 'Agile', 'Scrum', 'DevOps', 'Machine Learning',
      'Data Analysis', 'Marketing', 'Sales', 'Customer Service', 'Design'
    ];

    const keywords = [];
    
    // Extract known skills
    for (const skill of commonSkills) {
      if (jobDescription.toLowerCase().includes(skill.toLowerCase())) {
        keywords.push(skill);
      }
    }

    // Extract other important terms
    const words = jobDescription.split(/\s+/);
    const wordCount: { [key: string]: number } = {};
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
      if (cleanWord.length >= 3 && !commonSkills.some(s => s.toLowerCase() === cleanWord)) {
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
      }
    });

    // Add frequently mentioned words
    Object.entries(wordCount)
      .filter(([word, count]) => count >= 2)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([word]) => keywords.push(word));

    return keywords.slice(0, 15);
  }

  /**
   * Generate cover letter content based on template and data
   */
  private generateContent(
    request: CoverLetterRequest,
    relevantSkills: string[],
    relevantExperience: any[]
  ): string {
    const { resumeData, jobTitle, companyName, jobDescription, template, customInstructions } = request;
    const { personalInfo, summary } = resumeData;

    const templates = {
      professional: this.generateProfessionalTemplate(
        personalInfo, jobTitle, companyName, summary, relevantSkills, relevantExperience, customInstructions
      ),
      modern: this.generateModernTemplate(
        personalInfo, jobTitle, companyName, summary, relevantSkills, relevantExperience, customInstructions
      ),
      creative: this.generateCreativeTemplate(
        personalInfo, jobTitle, companyName, summary, relevantSkills, relevantExperience, customInstructions
      ),
      executive: this.generateExecutiveTemplate(
        personalInfo, jobTitle, companyName, summary, relevantSkills, relevantExperience, customInstructions
      )
    };

    return templates[template as keyof typeof templates] || templates.professional;
  }

  private generateProfessionalTemplate(
    personalInfo: any,
    jobTitle: string,
    companyName: string,
    summary: string,
    skills: string[],
    experience: any[],
    customInstructions?: string
  ): string {
    return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background in ${skills.slice(0, 3).join(', ')}, I am confident that I would be a valuable addition to your team.

${summary ? `As highlighted in my resume, ${summary.substring(0, 150)}...` : ''}

In my previous role as ${experience[0]?.title || 'a professional'} at ${experience[0]?.company || 'my previous company'}, I successfully ${experience[0]?.description?.substring(0, 100) || 'contributed to various projects'}. This experience has equipped me with the skills necessary to excel in the ${jobTitle} role.

Key qualifications that align with your requirements:
• Expertise in ${skills.slice(0, 2).join(' and ')}
• Proven track record in ${skills.slice(2, 4).join(' and ')}
• Strong foundation in ${skills.slice(4, 6).join(' and ')}

${customInstructions ? `\n${customInstructions}\n` : ''}

I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team's success. Thank you for considering my application.

Sincerely,
${personalInfo.name}`;
  }

  private generateModernTemplate(
    personalInfo: any,
    jobTitle: string,
    companyName: string,
    summary: string,
    skills: string[],
    experience: any[],
    customInstructions?: string
  ): string {
    return `Dear ${companyName} Hiring Team,

I am excited to submit my application for the ${jobTitle} role at ${companyName}. Your company's reputation for innovation and commitment to excellence makes this an ideal opportunity for someone with my background.

RELEVANT EXPERIENCE:
${experience.slice(0, 2).map(exp => 
  `• ${exp.title} at ${exp.company} - ${exp.description?.substring(0, 80)}...`
).join('\n')}

KEY SKILLS ALIGNMENT:
${skills.slice(0, 5).map(skill => `• ${skill}`).join('\n')}

WHAT I BRING TO ${companyName.toUpperCase()}:
${summary ? `${summary.substring(0, 200)}...` : `Proven expertise in ${skills.slice(0, 3).join(', ')} with a track record of delivering results.`}

${customInstructions ? `\n${customInstructions}\n` : ''}

I am eager to bring my skills and passion to ${companyName} and contribute to your team's continued success.

Best regards,
${personalInfo.name}`;
  }

  private generateCreativeTemplate(
    personalInfo: any,
    jobTitle: string,
    companyName: string,
    summary: string,
    skills: string[],
    experience: any[],
    customInstructions?: string
  ): string {
    return `Hello ${companyName} Team!

I'm thrilled to apply for the ${jobTitle} position at ${companyName}. As someone passionate about ${skills.slice(0, 2).join(' and ')}, I believe I could bring fresh perspectives and innovative solutions to your team.

🚀 MY JOURNEY:
${summary || `I've built my career around ${skills.slice(0, 3).join(', ')}, always looking for ways to push boundaries and create impact.`}

💡 WHAT EXCITES ME ABOUT THIS ROLE:
Your job posting resonated with me because it emphasizes ${skills.slice(0, 2).join(' and ')}, areas where I've consistently delivered exceptional results. At ${experience[0]?.company || 'my previous company'}, I ${experience[0]?.description?.substring(0, 100) || 'led innovative projects'}.

🎯 MY SUPERPOWERS:
${skills.slice(0, 4).map(skill => `• ${skill}`).join('\n')}

${customInstructions ? `\n✨ SPECIAL NOTE:\n${customInstructions}\n` : ''}

I'd love to discuss how my unique blend of skills and creative approach could contribute to ${companyName}'s continued innovation and success.

Looking forward to connecting!

${personalInfo.name}`;
  }

  private generateExecutiveTemplate(
    personalInfo: any,
    jobTitle: string,
    companyName: string,
    summary: string,
    skills: string[],
    experience: any[],
    customInstructions?: string
  ): string {
    return `Dear Executive Leadership Team,

I am pleased to submit my candidacy for the ${jobTitle} position at ${companyName}. With ${experience.length}+ years of progressive leadership experience and a proven track record in ${skills.slice(0, 3).join(', ')}, I am well-positioned to drive strategic initiatives and deliver measurable results.

EXECUTIVE SUMMARY:
${summary || `Accomplished leader with expertise in ${skills.slice(0, 3).join(', ')} and a history of transforming organizations through strategic vision and operational excellence.`}

LEADERSHIP EXPERIENCE:
${experience.slice(0, 2).map(exp => 
  `• ${exp.title} | ${exp.company}\n  ${exp.description?.substring(0, 120)}...`
).join('\n\n')}

STRATEGIC COMPETENCIES:
${skills.slice(0, 6).map(skill => `• ${skill}`).join('\n')}

VALUE PROPOSITION:
My approach to leadership combines strategic thinking with hands-on execution. I have consistently delivered results by ${experience[0]?.description?.substring(0, 100) || 'building high-performing teams and driving innovation'}.

${customInstructions ? `\nADDITIONAL CONSIDERATIONS:\n${customInstructions}\n` : ''}

I would welcome the opportunity to discuss how my leadership experience and strategic vision can contribute to ${companyName}'s continued growth and market leadership.

Respectfully,
${personalInfo.name}`;
  }

  /**
   * Calculate ATS compatibility score
   */
  private calculateATSScore(content: string, jobDescription: string): number {
    if (!jobDescription) return 75;

    const jobWords = jobDescription.toLowerCase().split(/\s+/);
    const contentWords = content.toLowerCase().split(/\s+/);

    const matchingWords = jobWords.filter(word =>
      word.length > 3 && contentWords.includes(word)
    );

    const keywordDensity = matchingWords.length / jobWords.length;
    const lengthScore = Math.min(1, content.length / 500); // Optimal length around 500 chars
    const structureScore = this.analyzeStructure(content);

    const score = (keywordDensity * 0.5 + lengthScore * 0.3 + structureScore * 0.2) * 100;
    return Math.min(95, Math.max(60, Math.round(score)));
  }

  /**
   * Analyze document structure for ATS compatibility
   */
  private analyzeStructure(content: string): number {
    let score = 0.5;

    // Check for proper greeting
    if (content.includes('Dear') || content.includes('Hello')) score += 0.1;

    // Check for proper closing
    if (content.includes('Sincerely') || content.includes('Best regards')) score += 0.1;

    // Check for bullet points or structured content
    if (content.includes('•') || content.includes('-')) score += 0.1;

    // Check for paragraph structure
    const paragraphs = content.split('\n\n');
    if (paragraphs.length >= 3 && paragraphs.length <= 6) score += 0.2;

    return Math.min(1, score);
  }

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(
    content: string,
    jobDescription: string,
    keywordMatches: string[]
  ): string[] {
    const suggestions = [];

    if (keywordMatches.length < 5) {
      suggestions.push('Consider adding more keywords from the job description');
    }

    if (content.length < 300) {
      suggestions.push('Expand your cover letter to provide more detail about your qualifications');
    }

    if (!content.includes('achieved') && !content.includes('improved')) {
      suggestions.push('Include specific achievements and quantifiable results');
    }

    if (!content.includes('•') && !content.includes('-')) {
      suggestions.push('Use bullet points to highlight key qualifications');
    }

    return suggestions;
  }

  /**
   * Calculate similarity between two strings
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }
}

// Export singleton instance
export const aiCoverLetterGenerator = AICoverLetterGenerator.getInstance();