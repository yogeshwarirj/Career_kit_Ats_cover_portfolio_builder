// Professional ATS Analysis Engine
export interface ATSAnalysisResult {
  overallScore: number;
  keywordScore: number;
  formatScore: number;
  contentScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
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
      matchedKeywords: keywordAnalysis.foundKeywords,
      missingKeywords: keywordAnalysis.missingKeywords,
      recommendations,
      detailedAnalysis: {
        sections: sectionAnalysis,
        readabilityScore: this.calculateReadabilityScore(resumeText),
        lengthAnalysis: this.analyzeLengthOptimization(resumeText)
      }
    };
  }

  /**
   * Optimize resume based on analysis results
   */
  async optimizeResume(resumeData: any, analysisResult: ATSAnalysisResult): Promise<any> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const optimized = JSON.parse(JSON.stringify(resumeData)); // Deep clone

    // Add missing keywords to skills
    const missingSkills = analysisResult.missingKeywords.filter(keyword => 
      this.isSkillKeyword(keyword)
    ).slice(0, 5);

    if (missingSkills.length > 0) {
      optimized.skills = optimized.skills || [];
      optimized.skills.push(...missingSkills);
    }

    // Enhance summary with keywords
    if (analysisResult.missingKeywords.length > 0) {
      const keywordsToAdd = analysisResult.missingKeywords.slice(0, 3);
      const enhancedSummary = optimized.summary + 
        ` Experienced in ${keywordsToAdd.join(', ')} with a proven track record of delivering results.`;
      optimized.summary = enhancedSummary;
    }

    return optimized;
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
      Array.isArray(resumeData.skills) ? resumeData.skills.join(' ') : '',
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

    if (!resumeData.skills || (Array.isArray(resumeData.skills) && resumeData.skills.length === 0)) {
      issues.push('Missing skills section');
      recommendations.push('Add a dedicated skills section with relevant technical and soft skills');
      score -= 15;
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

    return sections;
  }

  // Helper methods
  private isRelevantPhrase(phrase: string): boolean {
    const relevantPhrases = [
      'project management', 'data analysis', 'customer service', 'team leadership',
      'software development', 'digital marketing', 'financial analysis', 'quality assurance'
    ];
    return relevantPhrases.some(p => phrase.includes(p));
  }

  private isSkillKeyword(keyword: string): boolean {
    return this.skillsDatabase.some(skill => 
      skill.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private capitalizePhrase(phrase: string): string {
    return phrase.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private calculateKeywordScore(keywordAnalysis: any): number {
    const { density, foundKeywords, totalKeywords } = keywordAnalysis;
    
    if (totalKeywords === 0) return 75;
    
    let score = density * 100;
    
    // Bonus for high keyword count
    if (foundKeywords.length >= 10) score += 10;
    if (foundKeywords.length >= 15) score += 5;
    
    return Math.min(95, Math.max(30, Math.round(score)));
  }

  private calculateFormatScore(formatAnalysis: any): number {
    return formatAnalysis.score;
  }

  private calculateContentScore(contentAnalysis: any): number {
    return contentAnalysis.score;
  }

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

    return recommendations.slice(0, 8); // Limit to most important recommendations
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
    const allSkills = Array.isArray(skills) ? skills : [];
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