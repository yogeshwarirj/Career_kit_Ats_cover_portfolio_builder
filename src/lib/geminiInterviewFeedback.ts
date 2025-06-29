import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeneratedQuestion } from './questionGenerator';

export interface FeedbackResult {
  score: number; // 0-100
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  detailedAnalysis: {
    clarity: number;
    relevance: number;
    depth: number;
    structure: number;
  };
  suggestions: string[];
}

class GeminiInterviewFeedback {
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
      console.log('Gemini AI initialized for interview feedback');
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
    }
  }

  private buildFeedbackPrompt(question: GeneratedQuestion, userAnswer: string): string {
    return `
You are an expert interview coach and HR professional. Analyze the following interview question and candidate's answer, then provide comprehensive feedback.

INTERVIEW QUESTION:
Type: ${question.type}
Difficulty: ${question.difficulty}
Category: ${question.category}
Question: ${question.question}

CANDIDATE'S ANSWER:
${userAnswer}

EXPECTED ANSWER GUIDANCE:
${question.expectedAnswer || 'No specific guidance provided'}

PROFESSIONAL GUIDANCE:
${question.professionalGuidance || 'No specific guidance provided'}

Please provide a detailed analysis in the following JSON format:

{
  "score": <number 0-100>,
  "overallFeedback": "Comprehensive feedback paragraph (150-200 words) that sounds natural when spoken aloud by a professional female voice coach",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "detailedAnalysis": {
    "clarity": <number 0-100>,
    "relevance": <number 0-100>,
    "depth": <number 0-100>,
    "structure": <number 0-100>
  },
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3"]
}

SCORING CRITERIA:
- 90-100: Exceptional answer that demonstrates mastery and would impress any interviewer
- 80-89: Strong answer with minor areas for improvement
- 70-79: Good answer but missing some key elements or depth
- 60-69: Adequate answer but needs significant improvement
- 50-59: Weak answer with major gaps
- Below 50: Poor answer that needs complete restructuring

FEEDBACK GUIDELINES:
1. Be constructive and encouraging while being honest about areas for improvement
2. Provide specific, actionable advice
3. Consider the question type (technical vs behavioral) in your evaluation
4. The overallFeedback should sound natural when read aloud by a professional voice coach
5. Focus on interview best practices and professional communication
6. Acknowledge what the candidate did well before suggesting improvements
7. Provide concrete examples of how to improve

Return ONLY the JSON object, no additional text.
`;
  }

  private parseFeedbackResponse(response: string): FeedbackResult {
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
      const feedback = JSON.parse(jsonString);
      
      // Validate and provide defaults for required fields
      return {
        score: Math.min(100, Math.max(0, feedback.score || 70)),
        overallFeedback: feedback.overallFeedback || 'Your answer shows understanding of the topic. Consider providing more specific examples and structuring your response more clearly to make a stronger impression.',
        strengths: Array.isArray(feedback.strengths) ? feedback.strengths : ['Shows basic understanding'],
        improvements: Array.isArray(feedback.improvements) ? feedback.improvements : ['Add more specific examples'],
        detailedAnalysis: {
          clarity: Math.min(100, Math.max(0, feedback.detailedAnalysis?.clarity || 70)),
          relevance: Math.min(100, Math.max(0, feedback.detailedAnalysis?.relevance || 70)),
          depth: Math.min(100, Math.max(0, feedback.detailedAnalysis?.depth || 70)),
          structure: Math.min(100, Math.max(0, feedback.detailedAnalysis?.structure || 70))
        },
        suggestions: Array.isArray(feedback.suggestions) ? feedback.suggestions : ['Practice structuring your answers using the STAR method']
      };
      
    } catch (error) {
      console.error('Error parsing Gemini feedback response:', error);
      throw new Error('Failed to parse AI feedback response. Please try again.');
    }
  }

  async analyzeAnswer(question: GeneratedQuestion, userAnswer: string): Promise<FeedbackResult> {
    if (!this.model) {
      throw new Error('GEMINI_NOT_CONFIGURED');
    }

    try {
      const prompt = this.buildFeedbackPrompt(question, userAnswer);
      
      console.log('Analyzing answer with Gemini AI...');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from Gemini AI');
      }
      
      const feedback = this.parseFeedbackResponse(text);
      
      console.log('Feedback generated successfully');
      
      return feedback;
      
    } catch (error) {
      console.error('Error analyzing answer with Gemini:', error);
      
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
      
      throw new Error('FEEDBACK_ANALYSIS_FAILED');
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
  generateFallbackFeedback(question: GeneratedQuestion, userAnswer: string): FeedbackResult {
    const answerLength = userAnswer.trim().length;
    const hasExamples = /example|instance|case|situation|time when/i.test(userAnswer);
    const hasStructure = /first|second|third|finally|in conclusion/i.test(userAnswer);
    
    let score = 60; // Base score
    
    // Adjust score based on answer characteristics
    if (answerLength > 200) score += 10;
    if (hasExamples) score += 15;
    if (hasStructure) score += 10;
    if (answerLength > 500) score += 5;
    
    score = Math.min(100, score);
    
    return {
      score,
      overallFeedback: `Your answer demonstrates understanding of the question and provides relevant information. ${hasExamples ? 'Good use of examples to support your points.' : 'Consider adding specific examples to strengthen your response.'} ${hasStructure ? 'Your answer has good structure.' : 'Try organizing your thoughts with a clear beginning, middle, and end.'} Focus on being more specific and detailed in your explanations to make a stronger impression.`,
      strengths: [
        'Shows understanding of the topic',
        answerLength > 200 ? 'Provides adequate detail' : 'Addresses the question directly',
        hasExamples ? 'Uses examples effectively' : 'Demonstrates relevant knowledge'
      ],
      improvements: [
        answerLength < 200 ? 'Provide more detailed explanations' : 'Consider being more concise',
        !hasExamples ? 'Add specific examples from your experience' : 'Ensure examples are highly relevant',
        !hasStructure ? 'Organize your response with clear structure' : 'Maintain consistent flow throughout'
      ],
      detailedAnalysis: {
        clarity: hasStructure ? 80 : 65,
        relevance: 75,
        depth: answerLength > 300 ? 75 : 60,
        structure: hasStructure ? 85 : 60
      },
      suggestions: [
        'Use the STAR method (Situation, Task, Action, Result) for behavioral questions',
        'Practice your answer out loud to improve delivery',
        'Research the company and role to provide more targeted responses'
      ]
    };
  }
}

// Export singleton instance
export const geminiInterviewFeedback = new GeminiInterviewFeedback();