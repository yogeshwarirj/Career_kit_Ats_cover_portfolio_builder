import { GoogleGenerativeAI } from '@google/generative-ai';

export interface QuestionGenerationParams {
  jobDescription: string;
  technologies: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'technical' | 'hr';
  count?: number;
}

export interface GeneratedQuestion {
  id: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'technical' | 'hr';
  category?: string;
  expectedAnswer?: string;
  hints?: string[];
}

export interface QuestionGenerationResult {
  success: boolean;
  questions: GeneratedQuestion[];
  error?: string;
}

class QuestionGenerator {
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
      console.log('Gemini AI initialized for question generation');
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
    }
  }

  private buildPrompt(params: QuestionGenerationParams): string {
    const { jobDescription, technologies, difficulty, type, count = 30 } = params;
    
    const techList = technologies.length > 0 ? technologies.join(', ') : 'general programming';
    
    const basePrompt = `
You are an expert technical interviewer and HR professional. Generate exactly ${count} ${difficulty} ${type} interview questions.

Job Description:
${jobDescription}

Technologies/Skills Focus:
${techList}

Requirements:
1. Generate exactly ${count} questions
2. All questions must be ${difficulty} level
3. All questions must be ${type} type
4. Questions should be relevant to the job description and technologies mentioned
5. For technical questions: focus on practical coding, system design, problem-solving, and technology-specific knowledge
6. For HR questions: focus on behavioral, situational, cultural fit, and soft skills
7. Ensure questions are realistic and commonly asked in actual interviews

Difficulty Guidelines:
- Easy: Basic concepts, simple scenarios, entry-level knowledge
- Medium: Intermediate concepts, moderate complexity, some experience required
- Hard: Advanced concepts, complex scenarios, senior-level expertise

Format your response as a JSON array with this exact structure:
[
  {
    "id": "q1",
    "question": "Your question here",
    "difficulty": "${difficulty}",
    "type": "${type}",
    "category": "relevant category (e.g., 'JavaScript', 'System Design', 'Behavioral', 'Leadership')",
    "expectedAnswer": "Brief outline of what a good answer should include",
    "hints": ["hint1", "hint2", "hint3"]
  }
]

Important: 
- Return ONLY the JSON array, no additional text
- Ensure all ${count} questions are unique and valuable
- Make questions specific to the technologies and job requirements mentioned
- Include practical, real-world scenarios when possible
`;

    return basePrompt;
  }

  private parseGeminiResponse(response: string): GeneratedQuestion[] {
    try {
      // Clean the response to extract JSON
      let cleanedResponse = response.trim();
      
      // Remove any markdown code blocks
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find the JSON array in the response
      const jsonStart = cleanedResponse.indexOf('[');
      const jsonEnd = cleanedResponse.lastIndexOf(']') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No JSON array found in response');
      }
      
      const jsonString = cleanedResponse.substring(jsonStart, jsonEnd);
      const questions = JSON.parse(jsonString);
      
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }
      
      // Validate and clean questions
      return questions.map((q, index) => ({
        id: q.id || `q${index + 1}`,
        question: q.question || 'Question not provided',
        difficulty: q.difficulty || 'medium',
        type: q.type || 'technical',
        category: q.category || 'General',
        expectedAnswer: q.expectedAnswer || 'No expected answer provided',
        hints: Array.isArray(q.hints) ? q.hints : []
      }));
      
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error('Failed to parse AI response. Please try again.');
    }
  }

  async generateQuestions(params: QuestionGenerationParams): Promise<QuestionGenerationResult> {
    try {
      if (!this.model) {
        return {
          success: false,
          questions: [],
          error: 'Gemini AI is not configured. Please add your API key to the .env file and restart the server.'
        };
      }

      const prompt = this.buildPrompt(params);
      
      console.log('Generating questions with Gemini AI...');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from Gemini AI');
      }
      
      const questions = this.parseGeminiResponse(text);
      
      if (questions.length === 0) {
        throw new Error('No questions were generated');
      }
      
      console.log(`Successfully generated ${questions.length} questions`);
      
      return {
        success: true,
        questions
      };
      
    } catch (error) {
      console.error('Error generating questions:', error);
      
      let errorMessage = 'Failed to generate questions. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'Invalid Gemini API key. Please check your configuration in the .env file.';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = 'API quota exceeded. Please try again later.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        questions: [],
        error: errorMessage
      };
    }
  }

  // Fallback method for when API is not available
  generateFallbackQuestions(params: QuestionGenerationParams): GeneratedQuestion[] {
    const { difficulty, type, count = 30 } = params;
    
    const technicalQuestions = {
      easy: [
        "What is the difference between let, const, and var in JavaScript?",
        "Explain what a function is in programming.",
        "What is the purpose of HTML in web development?",
        "What is CSS and how is it used?",
        "Explain what an array is.",
        "What is a loop in programming?",
        "What is the difference between == and === in JavaScript?",
        "What is a variable?",
        "Explain what a conditional statement is.",
        "What is the DOM in web development?"
      ],
      medium: [
        "Explain the concept of closures in JavaScript.",
        "What is the difference between synchronous and asynchronous programming?",
        "How does event delegation work in JavaScript?",
        "Explain the box model in CSS.",
        "What are promises in JavaScript and how do they work?",
        "Describe the difference between SQL and NoSQL databases.",
        "What is REST API and how does it work?",
        "Explain the concept of inheritance in object-oriented programming.",
        "What is the difference between GET and POST HTTP methods?",
        "How does CSS flexbox work?"
      ],
      hard: [
        "Explain the event loop in JavaScript and how it handles asynchronous operations.",
        "Design a scalable system for handling millions of concurrent users.",
        "Implement a debounce function from scratch.",
        "Explain the differences between various database indexing strategies.",
        "How would you optimize a React application for performance?",
        "Design a caching strategy for a high-traffic web application.",
        "Explain the CAP theorem and its implications for distributed systems.",
        "Implement a custom hook in React for managing complex state.",
        "How would you handle race conditions in a multi-threaded environment?",
        "Design a microservices architecture for an e-commerce platform."
      ]
    };

    const hrQuestions = {
      easy: [
        "Tell me about yourself.",
        "Why are you interested in this position?",
        "What are your greatest strengths?",
        "Where do you see yourself in 5 years?",
        "Why do you want to work for our company?",
        "What motivates you?",
        "Describe your ideal work environment.",
        "What are you looking for in your next role?",
        "How do you handle stress?",
        "What makes you unique?"
      ],
      medium: [
        "Describe a challenging project you worked on and how you overcame obstacles.",
        "Tell me about a time when you had to work with a difficult team member.",
        "How do you prioritize tasks when you have multiple deadlines?",
        "Describe a situation where you had to learn something new quickly.",
        "Tell me about a time when you made a mistake and how you handled it.",
        "How do you handle constructive criticism?",
        "Describe a time when you had to persuade someone to see your point of view.",
        "Tell me about a goal you set and how you achieved it.",
        "How do you stay updated with industry trends?",
        "Describe a time when you had to work under pressure."
      ],
      hard: [
        "Tell me about a time when you had to make a difficult decision with limited information.",
        "Describe a situation where you had to lead a team through a major change.",
        "How would you handle a situation where your team consistently misses deadlines?",
        "Tell me about a time when you had to deal with an ethical dilemma at work.",
        "Describe a situation where you had to influence stakeholders without direct authority.",
        "How would you approach building a team culture in a remote work environment?",
        "Tell me about a time when you had to pivot a project strategy mid-execution.",
        "How do you balance innovation with meeting business requirements?",
        "Describe a situation where you had to manage conflicting priorities from different stakeholders.",
        "How would you handle a situation where a key team member wants to leave during a critical project phase?"
      ]
    };

    const questionPool = type === 'technical' ? technicalQuestions[difficulty] : hrQuestions[difficulty];
    
    // Generate questions up to the requested count, cycling through if needed
    const questions: GeneratedQuestion[] = [];
    for (let i = 0; i < count; i++) {
      const questionText = questionPool[i % questionPool.length];
      questions.push({
        id: `fallback_q${i + 1}`,
        question: questionText,
        difficulty,
        type,
        category: type === 'technical' ? 'General Programming' : 'Behavioral',
        expectedAnswer: 'This is a fallback question. Expected answer would depend on the specific question.',
        hints: ['Think about your experience', 'Provide specific examples', 'Be honest and authentic']
      });
    }
    
    return questions;
  }
}

// Export singleton instance
export const questionGenerator = new QuestionGenerator();

// Export the main function for easy use
export const generateQuestions = (params: QuestionGenerationParams): Promise<QuestionGenerationResult> => {
  return questionGenerator.generateQuestions(params);
};