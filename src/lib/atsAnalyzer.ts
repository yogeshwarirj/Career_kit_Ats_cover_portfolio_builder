// Professional ATS Analysis Engine
export interface ATSAnalysisResult {
  overallScore: number;
  keywordScore: number;
  formatScore: number;
  contentScore: number;
  keywords: {
    found: string[];
    missing: string[];
    density: number;
  };
  formatting: {
    issues: string[];
    recommendations: string[];
  };
  content: {
    strengths: string[];
    improvements: string[];
  };
  recommendations: string[];
  detailedAnalysis: {
    sections: {
      name: string;
      score: number;
      issues: string[];
      suggestions: string[];
    }[];
    readabilityScore: number;
    lengthAnalysis: {
      wordCount: number;
      optimal: boolean;
      recommendation: string;
    };
  };
}

export interface ResumeSection {
  name: string;
  content: string;
  keywords: string[];
  score: number;
}

export class ATSAnalyzer {
  private static instance: ATSAnalyzer;
  private commonATSKeywords: string[];
  private industryKeywords: { [key: string]: string[] };
  private actionVerbs: string[];
  private skillsDatabase: string[];

  constructor() {
    this.commonATSKeywords = [
      'experience', 'skills', 'education', 'certification', 'achievement', 'project',
      'management', 'leadership', 'development', 'analysis', 'implementation',
      'collaboration', 'communication', 'problem-solving', 'innovation', 'strategy'
    ];

    this.industryKeywords = {
      technology: [
        'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git',
        'API', 'Database', 'Cloud', 'DevOps', 'Agile', 'Scrum', 'Machine Learning',
        'Data Science', 'Cybersecurity', 'Mobile Development', 'Web Development'
      ],
      healthcare: [
        'Patient Care', 'Medical Records', 'HIPAA', 'Clinical', 'Diagnosis',
        'Treatment', 'Healthcare', 'Nursing', 'Pharmacy', 'Medical Device',
        'EMR', 'EHR', 'Compliance', 'Quality Assurance', 'Patient Safety'
      ],
      finance: [
        'Financial Analysis', 'Risk Management', 'Investment', 'Portfolio',
        'Accounting', 'Budgeting', 'Forecasting', 'Compliance', 'Audit',
        'Banking', 'Insurance', 'Trading', 'Derivatives', 'Financial Modeling'
      ],
      marketing: [
        'Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Content Marketing',
        'Brand Management', 'Campaign', 'Analytics', 'Lead Generation',
        'Customer Acquisition', 'Email Marketing', 'PPC', 'Conversion Rate'
      ],
      sales: [
        'Sales', 'Revenue', 'Lead Generation', 'Customer Relationship',
        'CRM', 'Pipeline', 'Quota', 'Negotiation', 'Account Management',
        'Business Development', 'Territory Management', 'Sales Forecasting'
      ]
    };

    this.actionVerbs = [
      'achieved', 'improved', 'increased', 'decreased', 'developed', 'implemented',
      'managed', 'led', 'created', 'designed', 'optimized', 'streamlined',
      'collaborated', 'coordinated', 'executed', 'delivered', 'established',
      'enhanced', 'reduced', 'generated', 'built', 'launched', 'transformed'
    ];

    this.skillsDatabase = [
      ...this.industryKeywords.technology,
      ...this.industryKeywords.healthcare,
      ...this.industryKeywords.finance,
      ...this.industryKeywords.marketing,
      ...this.industryKeywords.sales,
      'Project Management', 'Team Leadership', 'Strategic Planning',
      'Data Analysis', 'Problem Solving', 'Communication', 'Presentation',
      'Training', 'Mentoring', 'Quality Control', 'Process Improvement'
    ];
  }

  static getInstance(): ATSAnalyzer {
    if (!ATSAnalyzer.instance) {
      ATSAnalyzer.instance = new ATSAnalyzer();
    }
    return ATSAnalyzer.instance;
  }

  /**
   * Main analysis function that evaluates a resume against a job description
   */
  async analyzeResume(resumeData: any, jobDescription: string): Promise<ATSAnalysisResult> {
    // Simulate processing time for realistic UX
    await new Promise(resolve => setTimeout(resolve, 3000));

    const resumeText = this.extractResumeText(resumeData);
    const jobKeywords = this.extractJobKeywords(jobDescription);
    
    // Perform comprehensive analysis
    const keywordAnalysis = this.analyzeKeywords(resumeText, jobKeywords);
    const formatAnalysis = this.analyzeFormatting(resumeData);
    const contentAnalysis = this.analyzeContent(resumeText, resumeData);
    const sectionAnalysis = this.analyzeSections(resumeData, jobDescription);
    
    // Calculate scores
    const keywordScore = this.calculateKeywordScore(keywordAnalysis);
    const formatScore = this.calculateFormatScore(formatAnalysis);
    const contentScore = this.calculateContentScore(contentAnalysis);
    const overallScore = Math.round((keywordScore * 0.4 + formatScore * 0.3 + contentScore * 0.3));

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      keywordAnalysis, formatAnalysis, contentAnalysis, overallScore
    );

    return {
      overallScore,
      keywordScore,
      formatScore,
      contentScore,
      keywords: {
        found: keywordAnalysis.foundKeywords,
        missing: keywordAnalysis.missingKeywords,
        density: keywordAnalysis.density
      },
      formatting: {
        issues: formatAnalysis.issues,
        recommendations: formatAnalysis.recommendations
      },
      content: {
        strengths: contentAnalysis.strengths,
        improvements: contentAnalysis.improvements
      },
      recommendations,
      detailedAnalysis: {
        sections: sectionAnalysis,
        readabilityScore: this.calculateReadabilityScore(resumeText),
        lengthAnalysis: this.analyzeLengthOptimization(resumeText)
      }
    };
  }

  /**
   * Create an optimized version of the resume based on job requirements
   */
  private createOptimizedResume(resumeData: any, jobKeywords: string[], jobDescription: string): any {
    const optimized = JSON.parse(JSON.stringify(resumeData)); // Deep clone
    
    // Optimize summary/objective
    optimized.summary = this.optimizeSummary(resumeData.summary, jobKeywords, jobDescription);
    
    // Optimize experience descriptions
    optimized.experience = this.optimizeExperience(resumeData.experience, jobKeywords, jobDescription);
    
    // Optimize skills section
    optimized.skills = this.optimizeSkills(resumeData.skills, jobKeywords);
    
    // Add missing keywords strategically
    optimized.additionalKeywords = this.suggestAdditionalKeywords(jobKeywords, resumeData);
    
    return optimized;
  }

  /**
   * Optimize the professional summary
   */
  private optimizeSummary(originalSummary: string, jobKeywords: string[], jobDescription: string): string {
    if (!originalSummary) {
      return this.generateSummaryFromKeywords(jobKeywords);
    }
    
    let optimizedSummary = originalSummary;
    
    // Add missing high-priority keywords naturally
    const missingKeywords = jobKeywords.filter(keyword => 
      !originalSummary.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 3);
    
    if (missingKeywords.length > 0) {
      optimizedSummary += ` Experienced in ${missingKeywords.join(', ')} with a proven track record of delivering results.`;
    }
    
    return optimizedSummary;
  }

  /**
   * Generate a summary from job keywords if none exists
   */
  private generateSummaryFromKeywords(jobKeywords: string[]): string {
    const topSkills = jobKeywords.slice(0, 5);
    return `Results-driven professional with expertise in ${topSkills.join(', ')}. Proven ability to deliver high-quality solutions and drive business objectives through innovative approaches and collaborative teamwork.`;
  }

  /**
   * Optimize experience descriptions
   */
  private optimizeExperience(experience: any[], jobKeywords: string[], jobDescription: string): any[] {
    return experience.map(exp => {
      const optimizedExp = { ...exp };
      
      if (exp.description) {
        optimizedExp.description = this.enhanceDescription(exp.description, jobKeywords);
      }
      
      return optimizedExp;
    });
  }

  /**
   * Enhance job descriptions with relevant keywords
   */
  private enhanceDescription(description: string, jobKeywords: string[]): string {
    let enhanced = description;
    
    // Find keywords that could naturally fit into the description
    const relevantKeywords = jobKeywords.filter(keyword => {
      const keywordLower = keyword.toLowerCase();
      return !description.toLowerCase().includes(keywordLower) && 
             (keywordLower.includes('manage') || keywordLower.includes('develop') || 
              keywordLower.includes('implement') || keywordLower.includes('lead') ||
              keywordLower.includes('design') || keywordLower.includes('optimize'));
    }).slice(0, 2);
    
    if (relevantKeywords.length > 0) {
      enhanced += ` Utilized ${relevantKeywords.join(' and ')} to enhance project outcomes and team efficiency.`;
    }
    
    return enhanced;
  }

  /**
   * Optimize skills section
   */
  private optimizeSkills(skills: any, jobKeywords: string[]): any {
    const optimized = { ...skills };
    
    // Add missing technical keywords to technical skills
    const technicalKeywords = jobKeywords.filter(keyword => 
      this.isTechnicalSkill(keyword) && 
      !skills.technical?.some((skill: string) => skill.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    if (technicalKeywords.length > 0) {
      optimized.technical = [...(skills.technical || []), ...technicalKeywords.slice(0, 5)];
    }
    
    // Add missing soft skills
    const softKeywords = jobKeywords.filter(keyword => 
      this.isSoftSkill(keyword) && 
      !skills.soft?.some((skill: string) => skill.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    if (softKeywords.length > 0) {
      optimized.soft = [...(skills.soft || []), ...softKeywords.slice(0, 3)];
    }
    
    return optimized;
  }

  /**
   * Check if a keyword is a technical skill
   */
  private isTechnicalSkill(keyword: string): boolean {
    const technicalTerms = [
      'javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker', 'git',
      'html', 'css', 'angular', 'vue', 'mongodb', 'postgresql', 'kubernetes', 'jenkins',
      'api', 'rest', 'graphql', 'microservices', 'cloud', 'devops', 'ci/cd', 'testing'
    ];
    
    return technicalTerms.some(term => keyword.toLowerCase().includes(term));
  }

  /**
   * Check if a keyword is a soft skill
   */
  private isSoftSkill(keyword: string): boolean {
    const softTerms = [
      'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
      'creative', 'adaptable', 'organized', 'detail-oriented', 'collaborative',
      'innovative', 'strategic', 'customer service', 'project management'
    ];
    
    return softTerms.some(term => keyword.toLowerCase().includes(term));
  }

  /**
   * Suggest additional keywords to add
   */
  private suggestAdditionalKeywords(jobKeywords: string[], resumeData: any): string[] {
    const resumeText = this.extractResumeText(resumeData).toLowerCase();
    
    return jobKeywords.filter(keyword => 
      !resumeText.includes(keyword.toLowerCase())
    ).slice(0, 8);
  }
  /**
   * Generate an ATS-optimized resume based on uploaded resume and job description
   */
  async generateOptimizedResume(resumeData: any, jobDescription: string): Promise<ATSAnalysisResult & { optimizedResume: any }> {
    // Simulate processing time for realistic UX
    await new Promise(resolve => setTimeout(resolve, 3000));

    const resumeText = this.extractResumeText(resumeData);
    const jobKeywords = this.extractJobKeywords(jobDescription);
    
    // Perform analysis first
    const analysis = await this.analyzeResume(resumeData, jobDescription);
    
    // Generate optimized resume
    const optimizedResume = this.createOptimizedResume(resumeData, jobKeywords, jobDescription);
    
    return {
      ...analysis,
      optimizedResume
    };
  }

  /**
   * Create an optimized version of the resume based on job requirements
   */
  private createOptimizedResume(resumeData: any, jobKeywords: string[], jobDescription: string): any {
    const optimized = JSON.parse(JSON.stringify(resumeData)); // Deep clone
    
    // Optimize summary/objective
    optimized.summary = this.optimizeSummary(resumeData.summary, jobKeywords, jobDescription);
    
    // Optimize experience descriptions
    optimized.experience = this.optimizeExperience(resumeData.experience, jobKeywords, jobDescription);
    
    // Optimize skills section
    optimized.skills = this.optimizeSkills(resumeData.skills, jobKeywords);
    
    // Add missing keywords strategically
    optimized.additionalKeywords = this.suggestAdditionalKeywords(jobKeywords, resumeData);
    
    return optimized;
  }

  /**
   * Optimize the professional summary
   */
  private optimizeSummary(originalSummary: string, jobKeywords: string[], jobDescription: string): string {
    if (!originalSummary) {
      return this.generateSummaryFromKeywords(jobKeywords);
    }
    
    let optimizedSummary = originalSummary;
    
    // Add missing high-priority keywords naturally
    const missingKeywords = jobKeywords.filter(keyword => 
      !originalSummary.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 3);
    
    if (missingKeywords.length > 0) {
      optimizedSummary += ` Experienced in ${missingKeywords.join(', ')} with a proven track record of delivering results.`;
    }
    
    return optimizedSummary;
  }

  /**
   * Generate a summary from job keywords if none exists
   */
  private generateSummaryFromKeywords(jobKeywords: string[]): string {
    const topSkills = jobKeywords.slice(0, 5);
    return `Results-driven professional with expertise in ${topSkills.join(', ')}. Proven ability to deliver high-quality solutions and drive business objectives through innovative approaches and collaborative teamwork.`;
  }

  /**
   * Optimize experience descriptions
   */
  private optimizeExperience(experience: any[], jobKeywords: string[], jobDescription: string): any[] {
    return experience.map(exp => {
      const optimizedExp = { ...exp };
      
      if (exp.description) {
        optimizedExp.description = this.enhanceDescription(exp.description, jobKeywords);
      }
      
      return optimizedExp;
    });
  }

  /**
   * Enhance job descriptions with relevant keywords
   */
  private enhanceDescription(description: string, jobKeywords: string[]): string {
    let enhanced = description;
    
    // Find keywords that could naturally fit into the description
    const relevantKeywords = jobKeywords.filter(keyword => {
      const keywordLower = keyword.toLowerCase();
      return !description.toLowerCase().includes(keywordLower) && 
             (keywordLower.includes('manage') || keywordLower.includes('develop') || 
              keywordLower.includes('implement') || keywordLower.includes('lead') ||
              keywordLower.includes('design') || keywordLower.includes('optimize'));
    }).slice(0, 2);
    
    if (relevantKeywords.length > 0) {
      enhanced += ` Utilized ${relevantKeywords.join(' and ')} to enhance project outcomes and team efficiency.`;
    }
    
    return enhanced;
  }

  /**
   * Optimize skills section
   */
  private optimizeSkills(skills: any, jobKeywords: string[]): any {
    const optimized = { ...skills };
    
    // Add missing technical keywords to technical skills
    const technicalKeywords = jobKeywords.filter(keyword => 
      this.isTechnicalSkill(keyword) && 
      !skills.technical?.some((skill: string) => skill.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    if (technicalKeywords.length > 0) {
      optimized.technical = [...(skills.technical || []), ...technicalKeywords.slice(0, 5)];
    }
    
    // Add missing soft skills
    const softKeywords = jobKeywords.filter(keyword => 
      this.isSoftSkill(keyword) && 
      !skills.soft?.some((skill: string) => skill.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    if (softKeywords.length > 0) {
      optimized.soft = [...(skills.soft || []), ...softKeywords.slice(0, 3)];
    }
    
    return optimized;
  }

  /**
   * Check if a keyword is a technical skill
   */
  private isTechnicalSkill(keyword: string): boolean {
    const technicalTerms = [
      'javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker', 'git',
      'html', 'css', 'angular', 'vue', 'mongodb', 'postgresql', 'kubernetes', 'jenkins',
      'api', 'rest', 'graphql', 'microservices', 'cloud', 'devops', 'ci/cd', 'testing'
    ];
    
    return technicalTerms.some(term => keyword.toLowerCase().includes(term));
  }

  /**
   * Check if a keyword is a soft skill
   */
  private isSoftSkill(keyword: string): boolean {
    const softTerms = [
      'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
      'creative', 'adaptable', 'organized', 'detail-oriented', 'collaborative',
      'innovative', 'strategic', 'customer service', 'project management'
    ];
    
    return softTerms.some(term => keyword.toLowerCase().includes(term));
  }

  /**
   * Suggest additional keywords to add
   */
  private suggestAdditionalKeywords(jobKeywords: string[], resumeData: any): string[] {
    const resumeText = this.extractResumeText(resumeData).toLowerCase();
    
    return jobKeywords.filter(keyword => 
      !resumeText.includes(keyword.toLowerCase())
    ).slice(0, 8);
  }

  /**
   * Extract text content from resume data structure
   */
  private extractResumeText(resumeData: any): string {
    const sections = [
      resumeData.personalInfo?.name || '',
      resumeData.summary || '',
      resumeData.experience?.map((exp: any) => 
        `${exp.title} ${exp.company} ${exp.description}`
      ).join(' ') || '',
      resumeData.education?.map((edu: any) => 
        `${edu.degree} ${edu.school}`
      ).join(' ') || '',
      resumeData.skills?.technical?.join(' ') || '',
      resumeData.skills?.soft?.join(' ') || '',
      resumeData.certifications?.map((cert: any) => 
        `${cert.name} ${cert.issuer}`
      ).join(' ') || ''
    ];
    
    return sections.filter(section => section.trim()).join(' ');
  }

  /**
   * Extract and prioritize keywords from job description
   */
  private extractJobKeywords(jobDescription: string): string[] {
    const text = jobDescription.toLowerCase();
    const words = text.split(/\s+/);
    const keywords = new Set<string>();

    // Add industry-specific keywords
    Object.values(this.industryKeywords).forEach(industryTerms => {
      industryTerms.forEach(term => {
        if (text.includes(term.toLowerCase())) {
          keywords.add(term);
        }
      });
    });

    // Add skills from database
    this.skillsDatabase.forEach(skill => {
      if (text.includes(skill.toLowerCase())) {
        keywords.add(skill);
      }
    });

    // Extract multi-word phrases (2-3 words)
    for (let i = 0; i < words.length - 1; i++) {
      const twoWordPhrase = `${words[i]} ${words[i + 1]}`;
      const threeWordPhrase = i < words.length - 2 ? `${words[i]} ${words[i + 1]} ${words[i + 2]}` : '';
      
      if (this.isRelevantPhrase(twoWordPhrase)) {
        keywords.add(this.capitalizePhrase(twoWordPhrase));
      }
      if (threeWordPhrase && this.isRelevantPhrase(threeWordPhrase)) {
        keywords.add(this.capitalizePhrase(threeWordPhrase));
      }
    }

    // Extract single important words
    const importantWords = words.filter(word => 
      word.length >= 4 && 
      !this.isCommonWord(word) &&
      this.isRelevantTerm(word)
    );

    importantWords.forEach(word => {
      if (this.isSkillOrTechnology(word)) {
        keywords.add(this.capitalizeWord(word));
      }
    });

    return Array.from(keywords).slice(0, 25); // Limit to most relevant keywords
  }

  /**
   * Analyze keyword matching between resume and job description
   */
  private analyzeKeywords(resumeText: string, jobKeywords: string[]): any {
    const resumeLower = resumeText.toLowerCase();
    const foundKeywords: string[] = [];
    const missingKeywords: string[] = [];

    jobKeywords.forEach(keyword => {
      if (resumeLower.includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      } else {
        missingKeywords.push(keyword);
      }
    });

    const density = jobKeywords.length > 0 ? foundKeywords.length / jobKeywords.length : 0;

    return {
      foundKeywords,
      missingKeywords,
      density,
      totalKeywords: jobKeywords.length
    };
  }

  /**
   * Analyze resume formatting for ATS compatibility
   */
  private analyzeFormatting(resumeData: any): any {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check section structure
    if (!resumeData.personalInfo?.name) {
      issues.push('Missing contact information');
      score -= 15;
    }

    if (!resumeData.summary || resumeData.summary.length < 50) {
      issues.push('Missing or insufficient professional summary');
      recommendations.push('Add a compelling professional summary (100-200 words)');
      score -= 10;
    }

    if (!resumeData.experience || resumeData.experience.length === 0) {
      issues.push('No work experience listed');
      score -= 20;
    }

    if (!resumeData.skills || (!resumeData.skills.technical && !resumeData.skills.soft)) {
      issues.push('Missing skills section');
      recommendations.push('Add a dedicated skills section with relevant technical and soft skills');
      score -= 15;
    }

    // Check for ATS-friendly formatting
    if (!this.hasConsistentDateFormat(resumeData.experience)) {
      issues.push('Inconsistent date formatting');
      recommendations.push('Use consistent date format (MM/YYYY or Month YYYY)');
      score -= 5;
    }

    if (!this.hasActionVerbs(resumeData.experience)) {
      issues.push('Limited use of action verbs');
      recommendations.push('Start bullet points with strong action verbs');
      score -= 10;
    }

    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push('Use standard section headings (Experience, Education, Skills)');
      recommendations.push('Maintain consistent formatting throughout');
      recommendations.push('Use bullet points for easy scanning');
    }

    return {
      score: Math.max(60, score),
      issues,
      recommendations
    };
  }

  /**
   * Analyze content quality and impact
   */
  private analyzeContent(resumeText: string, resumeData: any): any {
    const strengths: string[] = [];
    const improvements: string[] = [];
    let score = 75;

    // Check for quantifiable achievements
    const hasNumbers = /\d+%|\d+\$|\d+ years|\d+k|\d+ million/i.test(resumeText);
    if (hasNumbers) {
      strengths.push('Contains quantifiable achievements');
      score += 10;
    } else {
      improvements.push('Add specific numbers and metrics to demonstrate impact');
      score -= 10;
    }

    // Check for action verbs
    const actionVerbCount = this.actionVerbs.filter(verb => 
      resumeText.toLowerCase().includes(verb)
    ).length;
    
    if (actionVerbCount >= 5) {
      strengths.push('Uses strong action verbs effectively');
      score += 5;
    } else {
      improvements.push('Use more action verbs to describe accomplishments');
      score -= 5;
    }

    // Check content length
    const wordCount = resumeText.split(' ').length;
    if (wordCount >= 300 && wordCount <= 800) {
      strengths.push('Appropriate content length');
      score += 5;
    } else if (wordCount < 300) {
      improvements.push('Expand content to provide more detail about your experience');
      score -= 10;
    } else {
      improvements.push('Consider condensing content for better readability');
      score -= 5;
    }

    // Check for industry terminology
    const industryTermCount = Object.values(this.industryKeywords)
      .flat()
      .filter(term => resumeText.toLowerCase().includes(term.toLowerCase()))
      .length;

    if (industryTermCount >= 5) {
      strengths.push('Includes relevant industry terminology');
      score += 5;
    } else {
      improvements.push('Include more industry-specific terms and technologies');
      score -= 5;
    }

    return {
      score: Math.max(50, Math.min(95, score)),
      strengths,
      improvements
    };
  }

  /**
   * Analyze individual resume sections
   */
  private analyzeSections(resumeData: any, jobDescription: string): any[] {
    const sections = [];

    // Analyze Summary
    if (resumeData.summary) {
      sections.push(this.analyzeSummarySection(resumeData.summary, jobDescription));
    }

    // Analyze Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      sections.push(this.analyzeExperienceSection(resumeData.experience, jobDescription));
    }

    // Analyze Skills
    if (resumeData.skills) {
      sections.push(this.analyzeSkillsSection(resumeData.skills, jobDescription));
    }

    // Analyze Education
    if (resumeData.education && resumeData.education.length > 0) {
      sections.push(this.analyzeEducationSection(resumeData.education, jobDescription));
    }

    return sections;
  }

  /**
   * Calculate keyword matching score
   */
  private calculateKeywordScore(keywordAnalysis: any): number {
    const { density, foundKeywords, totalKeywords } = keywordAnalysis;
    
    if (totalKeywords === 0) return 75;
    
    let score = density * 100;
    
    // Bonus for high keyword count
    if (foundKeywords.length >= 10) score += 10;
    if (foundKeywords.length >= 15) score += 5;
    
    return Math.min(95, Math.max(30, Math.round(score)));
  }

  /**
   * Calculate formatting compliance score
   */
  private calculateFormatScore(formatAnalysis: any): number {
    return formatAnalysis.score;
  }

  /**
   * Calculate content quality score
   */
  private calculateContentScore(contentAnalysis: any): number {
    return contentAnalysis.score;
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(
    keywordAnalysis: any, 
    formatAnalysis: any, 
    contentAnalysis: any, 
    overallScore: number
  ): string[] {
    const recommendations: string[] = [];

    // Keyword recommendations
    if (keywordAnalysis.density < 0.3) {
      recommendations.push('Incorporate more keywords from the job description throughout your resume');
    }
    
    if (keywordAnalysis.missingKeywords.length > 5) {
      recommendations.push(`Add these important keywords: ${keywordAnalysis.missingKeywords.slice(0, 3).join(', ')}`);
    }

    // Format recommendations
    if (formatAnalysis.score < 80) {
      recommendations.push('Improve resume formatting for better ATS compatibility');
      recommendations.push(...formatAnalysis.recommendations.slice(0, 2));
    }

    // Content recommendations
    if (contentAnalysis.score < 80) {
      recommendations.push(...contentAnalysis.improvements.slice(0, 2));
    }

    // Overall recommendations
    if (overallScore < 70) {
      recommendations.push('Focus on adding quantifiable achievements and relevant keywords');
      recommendations.push('Ensure your resume directly addresses the job requirements');
    }

    return recommendations.slice(0, 8); // Limit to most important recommendations
  }

  // Helper methods
  private isRelevantPhrase(phrase: string): boolean {
    const relevantPhrases = [
      'project management', 'data analysis', 'customer service', 'team leadership',
      'software development', 'digital marketing', 'financial analysis', 'quality assurance',
      'business development', 'product management', 'user experience', 'machine learning'
    ];
    return relevantPhrases.some(p => phrase.includes(p));
  }

  private isCommonWord(word: string): boolean {
    const commonWords = [
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one',
      'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old',
      'see', 'two', 'who', 'boy', 'did', 'man', 'men', 'put', 'say', 'she', 'too', 'use', 'will'
    ];
    return commonWords.includes(word.toLowerCase());
  }

  private isRelevantTerm(word: string): boolean {
    return this.skillsDatabase.some(skill => 
      skill.toLowerCase().includes(word.toLowerCase())
    ) || this.commonATSKeywords.includes(word.toLowerCase());
  }

  private isSkillOrTechnology(word: string): boolean {
    return this.skillsDatabase.some(skill => 
      skill.toLowerCase() === word.toLowerCase()
    );
  }

  private capitalizePhrase(phrase: string): string {
    return phrase.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private capitalizeWord(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  private hasConsistentDateFormat(experience: any[]): boolean {
    if (!experience || experience.length === 0) return true;
    
    const dateFormats = experience.map(exp => {
      const start = exp.startDate || '';
      const end = exp.endDate || '';
      return `${start}-${end}`;
    });
    
    // Simple check - in production, would use more sophisticated date parsing
    return dateFormats.every(format => format.includes('/') || format.includes('-'));
  }

  private hasActionVerbs(experience: any[]): boolean {
    if (!experience || experience.length === 0) return false;
    
    const allDescriptions = experience
      .map(exp => exp.description || '')
      .join(' ')
      .toLowerCase();
    
    return this.actionVerbs.some(verb => allDescriptions.includes(verb));
  }

  private analyzeSummarySection(summary: string, jobDescription: string): any {
    const jobKeywords = this.extractJobKeywords(jobDescription);
    const summaryLower = summary.toLowerCase();
    const matchingKeywords = jobKeywords.filter(keyword => 
      summaryLower.includes(keyword.toLowerCase())
    );
    
    const score = summary.length >= 100 && matchingKeywords.length >= 3 ? 85 : 65;
    
    return {
      name: 'Professional Summary',
      score,
      issues: summary.length < 100 ? ['Summary too brief'] : [],
      suggestions: matchingKeywords.length < 3 ? 
        ['Include more keywords from job description'] : 
        ['Well-optimized summary section']
    };
  }

  private analyzeExperienceSection(experience: any[], jobDescription: string): any {
    const jobKeywords = this.extractJobKeywords(jobDescription);
    const allExperience = experience.map(exp => exp.description || '').join(' ').toLowerCase();
    const matchingKeywords = jobKeywords.filter(keyword => 
      allExperience.includes(keyword.toLowerCase())
    );
    
    const hasQuantifiableResults = /\d+%|\d+\$|\d+ years/.test(allExperience);
    const score = matchingKeywords.length >= 5 && hasQuantifiableResults ? 90 : 70;
    
    return {
      name: 'Work Experience',
      score,
      issues: !hasQuantifiableResults ? ['Missing quantifiable achievements'] : [],
      suggestions: matchingKeywords.length < 5 ? 
        ['Add more relevant keywords and achievements'] : 
        ['Strong experience section with good keyword coverage']
    };
  }

  private analyzeSkillsSection(skills: any, jobDescription: string): any {
    const allSkills = [...(skills.technical || []), ...(skills.soft || [])];
    const jobKeywords = this.extractJobKeywords(jobDescription);
    const matchingSkills = allSkills.filter(skill => 
      jobKeywords.some(keyword => 
        keyword.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    const score = matchingSkills.length >= 5 ? 85 : 60;
    
    return {
      name: 'Skills',
      score,
      issues: matchingSkills.length < 3 ? ['Limited relevant skills listed'] : [],
      suggestions: matchingSkills.length < 5 ? 
        ['Add more skills that match job requirements'] : 
        ['Good skills alignment with job requirements']
    };
  }

  private analyzeEducationSection(education: any[], jobDescription: string): any {
    const hasRelevantEducation = education.some(edu => 
      jobDescription.toLowerCase().includes(edu.degree?.toLowerCase() || '') ||
      jobDescription.toLowerCase().includes(edu.school?.toLowerCase() || '')
    );
    
    const score = hasRelevantEducation ? 80 : 70;
    
    return {
      name: 'Education',
      score,
      issues: [],
      suggestions: hasRelevantEducation ? 
        ['Education aligns well with job requirements'] : 
        ['Consider highlighting relevant coursework or certifications']
    };
  }

  private calculateReadabilityScore(text: string): number {
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const avgWordsPerSentence = words / sentences;
    
    // Optimal range for professional documents: 15-25 words per sentence
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 25) {
      return 85;
    } else if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 30) {
      return 75;
    } else {
      return 65;
    }
  }

  private analyzeLengthOptimization(text: string): any {
    const wordCount = text.split(/\s+/).length;
    
    if (wordCount >= 400 && wordCount <= 800) {
      return {
        wordCount,
        optimal: true,
        recommendation: 'Resume length is optimal for ATS processing'
      };
    } else if (wordCount < 400) {
      return {
        wordCount,
        optimal: false,
        recommendation: 'Consider adding more detail to reach 400-800 words'
      };
    } else {
      return {
        wordCount,
        optimal: false,
        recommendation: 'Consider condensing content to stay within 400-800 words for optimal ATS processing'
      };
    }
  }
}