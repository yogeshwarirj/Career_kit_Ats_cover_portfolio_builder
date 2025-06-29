import { GoogleGenerativeAI } from '@google/generative-ai';
import { ResumeData } from './localStorage';

export interface GeminiATSAnalysisResult {
  overallScore: number;
  keywordScore: number;
  formatScore: number;
  contentScore: number;
  readabilityScore: number;
  keywords: {
    found: string[];
    missing: string[];
    density: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  optimizedContent: {
    summary: string;
    experience: Array<{
      title: string;
      company: string;
      description: string;
    }>;
    skills: string[];
    additionalKeywords: string[];
  };
  atsLetter?: string;
}

export interface ATSLetterParams {
  resumeData: ResumeData;
  jobDescription: string;
  companyName: string;
  jobTitle: string;
  applicantName: string;
  achievements?: string;
}

class GeminiATSAnalyzer {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    this.initializeGemini();
  }

  private initializeGemini() {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
        console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('Gemini AI initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
    }
  }

  private extractResumeText(resumeData: ResumeData): string {
    const sections = [
      resumeData.personalInfo?.name || '',
      resumeData.summary || '',
      resumeData.experience?.map(exp => 
        `${exp.title} at ${exp.company}. ${exp.description}`
      ).join(' ') || '',
      resumeData.education?.map(edu => 
        `${edu.degree} from ${edu.school}`
      ).join(' ') || '',
      resumeData.skills?.technical?.join(' ') || '',
      resumeData.skills?.soft?.join(' ') || '',
      resumeData.certifications?.map(cert => 
        `${cert.name} from ${cert.issuer}`
      ).join(' ') || ''
    ];

    return sections.filter(section => section.trim()).join(' ');
  }

  private buildATSAnalysisPrompt(resumeText: string, jobDescription: string): string {
    return `
You are an expert ATS (Applicant Tracking System) analyzer and resume optimization specialist. Analyze the following resume against the job description and provide a comprehensive ATS analysis.

RESUME CONTENT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Please provide a detailed ATS analysis in the following JSON format:

{
  "overallScore": <number 0-100>,
  "keywordScore": <number 0-100>,
  "formatScore": <number 0-100>,
  "contentScore": <number 0-100>,
  "readabilityScore": <number 0-100>,
  "keywords": {
    "found": ["keyword1", "keyword2", ...],
    "missing": ["missing1", "missing2", ...],
    "density": <number 0-1>
  },
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...],
  "optimizedContent": {
    "summary": "ATS-optimized professional summary",
    "experience": [
      {
        "title": "optimized job title",
        "company": "company name",
        "description": "ATS-optimized job description with relevant keywords"
      }
    ],
    "skills": ["optimized skill list with job-relevant keywords"],
    "additionalKeywords": ["keyword1", "keyword2", ...]
  }
}

Analysis Guidelines:
1. KEYWORD ANALYSIS: Compare resume keywords with job description requirements
2. FORMAT COMPLIANCE: Assess ATS-friendly formatting and structure
3. CONTENT QUALITY: Evaluate writing quality, achievements, and impact statements
4. READABILITY: Assess clarity and professional presentation
5. OPTIMIZATION: Suggest specific improvements for better ATS performance

Scoring Criteria:
- 90-100: Excellent ATS optimization
- 80-89: Good with minor improvements needed
- 70-79: Average with moderate improvements needed
- 60-69: Below average with significant improvements needed
- Below 60: Poor ATS optimization requiring major changes

Return ONLY the JSON object, no additional text.
`;
  }

  private buildATSLetterPrompt(params: ATSLetterParams): string {
    const resumeText = this.extractResumeText(params.resumeData);
    const address = params.resumeData.personalInfo?.address || '';
    const email = params.resumeData.personalInfo?.email || '';
    const phone = params.resumeData.personalInfo?.phone || '';
    const achievements = params.achievements || '';
    
    return `
You are an expert cover letter writer specializing in ATS-optimized application letters. Create a professional, compelling cover letter that maximizes ATS compatibility while maintaining human readability.

APPLICANT INFORMATION:
Name: ${params.applicantName}
Address: ${address}
Email: ${email}
Phone: ${phone}
Resume Content: ${resumeText}
${achievements ? `Key Achievements & Impact: ${achievements}` : ''}

JOB INFORMATION:
Company: ${params.companyName}
Position: ${params.jobTitle}
Job Description: ${params.jobDescription}

Create a concise, ATS-optimized cover letter that:
1. Uses keywords from the job description naturally
2. Highlights relevant experience and skills from the resume
3. Incorporates specific achievements and quantifiable impact where provided
4. Demonstrates clear value proposition with concrete examples
5. Maintains professional tone and structure
6. Is optimized for ATS scanning while remaining engaging for human readers
7. MUST be exactly 3 paragraphs long (no more, no less)
8. Uses specific achievements and metrics when available to demonstrate impact

Format the cover letter as a complete, professional business letter including:
- Proper header with applicant contact information (name, address, email, phone)
- Date
- Company address line (use "[Company Name] Hiring Team" if specific address not provided)
- Professional salutation
- EXACTLY 3 compelling paragraphs:
  * Paragraph 1: Opening statement expressing interest and brief overview of qualifications with a standout achievement if provided
  * Paragraph 2: Specific examples of relevant experience, skills, and quantifiable achievements that match job requirements
  * Paragraph 3: Closing statement with call to action and professional sign-off
- Professional closing
- Signature line

IMPORTANT GUIDELINES:
- If achievements are provided, weave them naturally into the letter with specific metrics and results
- Use action verbs and quantifiable results (percentages, dollar amounts, timeframes, team sizes, etc.)
- Connect achievements directly to how they would benefit the target company
- Maintain professional tone while showcasing measurable impact

IMPORTANT: The letter should be approximately 250-350 words total and MUST contain exactly 3 paragraphs in the body. Do not exceed 3 paragraphs under any circumstances.

Return only the complete cover letter text, properly formatted.
`;
  }

  async analyzeResumeWithGemini(resumeData: ResumeData, jobDescription: string): Promise<GeminiATSAnalysisResult> {
    if (!this.model) {
      throw new Error('GEMINI_NOT_CONFIGURED');
    }

    try {
      const resumeText = this.extractResumeText(resumeData);
      const analysisPrompt = this.buildATSAnalysisPrompt(resumeText, jobDescription);
      
      console.log('Analyzing resume with Gemini AI...');
      
      const result = await this.model.generateContent(analysisPrompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from Gemini AI');
      }
      
      // Parse the JSON response
      const analysisResult = this.parseAnalysisResponse(text);
      
      // Generate ATS letter separately
      const letterParams: ATSLetterParams = {
        resumeData,
        jobDescription,
        companyName: 'Hiring Company', // Default if not provided
        jobTitle: 'Target Position', // Default if not provided
        applicantName: resumeData.personalInfo?.name || 'Applicant'
      };
      
      // Optional: Generate ATS letter if needed
      // const atsLetter = await this.generateATSLetter(letterParams);
      
      return {
        ...analysisResult
        // atsLetter
      };
      
    } catch (error) {
      console.error('Error analyzing resume with Gemini:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
          throw new Error('INVALID_API_KEY');
        } else if (error.message.includes('QUOTA_EXCEEDED') || error.message.includes('429')) {
          throw new Error('QUOTA_EXCEEDED');
        } else if (error.message.includes('NETWORK') || error.message.includes('fetch')) {
          throw new Error('NETWORK_ERROR');
        }
      }
      
      throw new Error('ANALYSIS_FAILED');
    }
  }

  async generateATSLetter(params: ATSLetterParams): Promise<string> {
    if (!this.model) {
      throw new Error('GEMINI_NOT_CONFIGURED');
    }

    try {
      const letterPrompt = this.buildATSLetterPrompt(params);
      
      console.log('Generating ATS-optimized cover letter...');
      
      const result = await this.model.generateContent(letterPrompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from Gemini AI');
      }
      
      return text.trim();
      
    } catch (error) {
      console.error('Error generating ATS letter:', error);
      throw new Error('LETTER_GENERATION_FAILED');
    }
  }

  private parseAnalysisResponse(response: string): Omit<GeminiATSAnalysisResult, 'atsLetter'> {
    try {
      // Clean the response to extract JSON
      let cleanedResponse = response.trim();
      
      // Remove any markdown code blocks
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find the JSON object in the response
      const jsonStart = cleanedResponse.indexOf('{');
      const jsonEnd = cleanedResponse.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No JSON object found in response');
      }
      
      const jsonString = cleanedResponse.substring(jsonStart, jsonEnd);
      const analysis = JSON.parse(jsonString);
      
      // Validate and provide defaults for required fields
      return {
        overallScore: Math.min(100, Math.max(0, analysis.overallScore || 75)),
        keywordScore: Math.min(100, Math.max(0, analysis.keywordScore || 70)),
        formatScore: Math.min(100, Math.max(0, analysis.formatScore || 80)),
        contentScore: Math.min(100, Math.max(0, analysis.contentScore || 75)),
        readabilityScore: Math.min(100, Math.max(0, analysis.readabilityScore || 80)),
        keywords: {
          found: Array.isArray(analysis.keywords?.found) ? analysis.keywords.found : [],
          missing: Array.isArray(analysis.keywords?.missing) ? analysis.keywords.missing : [],
          density: Math.min(1, Math.max(0, analysis.keywords?.density || 0.3))
        },
        strengths: Array.isArray(analysis.strengths) ? analysis.strengths : ['Professional presentation'],
        weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses : ['Could improve keyword optimization'],
        recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : ['Add more relevant keywords'],
        optimizedContent: {
          summary: analysis.optimizedContent?.summary || 'Professional summary needs optimization',
          experience: Array.isArray(analysis.optimizedContent?.experience) ? analysis.optimizedContent.experience : [],
          skills: Array.isArray(analysis.optimizedContent?.skills) ? analysis.optimizedContent.skills : [],
          additionalKeywords: Array.isArray(analysis.optimizedContent?.additionalKeywords) ? analysis.optimizedContent.additionalKeywords : []
        }
      };
      
    } catch (error) {
      console.error('Error parsing Gemini analysis response:', error);
      throw new Error('Failed to parse AI analysis response. Please try again.');
    }
  }

  // Check if Gemini is properly configured
  isConfigured(): boolean {
    return this.model !== null;
  }

  // Get configuration status
  getConfigurationStatus(): { configured: boolean; message: string } {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
      return {
        configured: false,
        message: 'Gemini API key not configured. Please add your API key to the .env file.'
      };
    }
    
    if (!this.model) {
      return {
        configured: false,
        message: 'Gemini AI failed to initialize. Please check your API key.'
      };
    }
    
    return {
      configured: true,
      message: 'Gemini AI is properly configured and ready to use.'
    };
  }

  // Fallback method when API is not available
  generateFallbackAnalysis(resumeData: ResumeData, jobDescription: string): GeminiATSAnalysisResult {
    const resumeText = this.extractResumeText(resumeData);
    const jobWords = jobDescription.toLowerCase().split(/\s+/);
    const resumeWords = resumeText.toLowerCase().split(/\s+/);
    
    // Simple keyword matching
    const foundKeywords = jobWords.filter(word => 
      word.length > 3 && resumeWords.includes(word)
    ).slice(0, 10);
    
    const missingKeywords = jobWords.filter(word => 
      word.length > 3 && !resumeWords.includes(word)
    ).slice(0, 8);
    
    const keywordDensity = foundKeywords.length / Math.max(jobWords.length, 1);
    const keywordScore = Math.round(keywordDensity * 100);
    
    return {
      overallScore: Math.max(60, Math.min(85, keywordScore + 15)),
      keywordScore,
      formatScore: 80,
      contentScore: 75,
      readabilityScore: 80,
      keywords: {
        found: foundKeywords,
        missing: missingKeywords,
        density: keywordDensity
      },
      strengths: [
        'Professional resume structure',
        'Clear contact information',
        'Relevant work experience listed'
      ],
      weaknesses: [
        'Could improve keyword optimization',
        'May need more specific achievements',
        'Consider adding more technical skills'
      ],
      recommendations: [
        'Add more keywords from the job description',
        'Include quantifiable achievements',
        'Optimize summary section for ATS',
        'Ensure consistent formatting throughout'
      ],
      optimizedContent: {
        summary: 'Results-driven professional with expertise in relevant technologies and proven track record of delivering high-quality solutions.',
        experience: resumeData.experience?.slice(0, 2).map(exp => ({
          title: exp.title,
          company: exp.company,
          description: `${exp.description} Utilized relevant technologies to achieve measurable results.`
        })) || [],
        skills: [...(resumeData.skills?.technical || []), ...foundKeywords.slice(0, 5)],
        additionalKeywords: missingKeywords.slice(0, 6)
      },
      // atsLetter: this.generateFallbackATSLetter(resumeData, jobDescription)
    };
  }

  private generateFallbackATSLetter(resumeData: ResumeData, jobDescription: string): string {
    const name = resumeData.personalInfo?.name || 'Applicant Name';
    const email = resumeData.personalInfo?.email || 'email@example.com';
    const phone = resumeData.personalInfo?.phone || 'Phone Number';
    
    return `${name}
${email} | ${phone}

[Date]

Dear Hiring Manager,

I am writing to express my strong interest in the position at your organization. After reviewing the job description, I am confident that my background and skills make me an ideal candidate for this role.

In my previous experience, I have developed expertise in the key areas mentioned in your job posting. My background includes relevant technical skills and a proven track record of delivering results in professional environments. I am particularly drawn to this opportunity because it aligns perfectly with my career goals and expertise.

The requirements outlined in your job description match well with my experience and skills. I have successfully worked on projects that required similar competencies and have consistently delivered high-quality results. My approach to work emphasizes collaboration, innovation, and continuous learning.

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team's success. Thank you for considering my application, and I look forward to hearing from you.

Sincerely,
${name}`;
  }
}

// Export singleton instance
export const geminiATSAnalyzer = new GeminiATSAnalyzer();