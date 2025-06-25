import mammoth from 'mammoth';
import toast from 'react-hot-toast';

export interface ParsedResume {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
    current: boolean;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    graduationYear: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
     [key: string]: any; 
  }>;
}

export const parseResumeFile = async (file: File): Promise<ParsedResume> => {
  const fileType = file.type;
  let text = '';

  try {
    if (fileType === 'application/pdf') {
      text = await parsePDF(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      text = await parseDOCX(file);
    } else if (fileType === 'text/plain') {
      text = await file.text();
    } else {
      throw new Error('Unsupported file format');
    }

    return parseTextToResume(text);
  } catch (error) {
    console.error('Resume parsing error:', error);
    if (error instanceof Error && error.message.includes('PDF text extraction')) {
      throw error; // Re-throw PDF-specific errors with their original message
    }
    throw new Error('Failed to parse resume. Please check the file format and try again.');
  }
};

const parsePDF = async (file: File): Promise<string> => {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Use PDF.js library for text extraction
    // Since PDF.js is not available in this environment, we'll use a fallback approach
    // that attempts to extract text using basic methods
    
    // Try to extract text using a simple approach
    const uint8Array = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('utf-8', { fatal: false });
    let rawText = decoder.decode(uint8Array);
    
    // Clean up the extracted text
    // Remove PDF-specific characters and formatting
    rawText = rawText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
    rawText = rawText.replace(/\s+/g, ' ');
    
    // Extract readable text patterns
    const textMatches = rawText.match(/[A-Za-z0-9\s@.,;:()\-_+='"/\\]+/g);
    if (textMatches) {
      const extractedText = textMatches.join(' ').trim();
      
      // Validate that we extracted meaningful content
      if (extractedText.length > 50 && /[A-Za-z]{3,}/.test(extractedText)) {
        return extractedText;
      }
    }
    
    // If basic extraction fails, provide helpful guidance
    throw new Error('Unable to extract text from this PDF file. For best results, please convert your PDF to a Word document (.docx) or save it as a text file (.txt). You can usually do this by opening your PDF and using "Save As" or "Export" to convert it.');
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unable to extract text')) {
      throw error;
    }
    throw new Error('PDF processing failed. Please convert your PDF to a Word document (.docx) or text file (.txt) for better compatibility.');
  }
};

const parseDOCX = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

const parseTextToResume = (text: string): ParsedResume => {
  if (!text || text.trim().length === 0) {
    throw new Error('No readable content found in the uploaded file. Please ensure your resume contains text content and try again.');
  }

  // Enhanced parsing logic with better content extraction
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  if (lines.length === 0) {
    throw new Error('Unable to extract meaningful content from your resume. Please check the file format and try again.');
  }

  const resume: ParsedResume = {
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
    },
    certifications: [],
  };

  // Extract email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g);
  if (emailMatch) {
    resume.personalInfo.email = emailMatch[0];
  }

  // Extract phone
  const phoneMatch = text.match(/(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g);
  if (phoneMatch) {
    resume.personalInfo.phone = phoneMatch[0];
  }

  // Enhanced name extraction
  let nameFound = false;
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    // Look for a line that looks like a name (contains letters, possibly spaces, not too long)
    if (line.length > 2 && line.length < 50 && /^[A-Za-z\s.'-]+$/.test(line) && !line.includes('@')) {
      resume.personalInfo.name = line;
      nameFound = true;
      break;
    }
  }
  
  if (!nameFound && lines.length > 0) {
    // Fallback to first line if no clear name pattern found
    resume.personalInfo.name = lines[0];
  }

  // Extract location (look for city, state patterns)
  const locationMatch = text.match(/([A-Za-z\s]+),\s*([A-Z]{2}|[A-Za-z\s]+)/g);
  if (locationMatch) {
    resume.personalInfo.location = locationMatch[0];
  }

  // Extract LinkedIn URL
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9-]+/gi);
  if (linkedinMatch) {
    resume.personalInfo.linkedin = linkedinMatch[0];
  }

  // Extract website/portfolio URL
  const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[A-Za-z0-9-]+\.[A-Za-z]{2,}(?:\/[^\s]*)?/gi);
  if (websiteMatch) {
    // Filter out email domains and LinkedIn
    const filteredWebsites = websiteMatch.filter(url => 
      !url.includes('@') && 
      !url.toLowerCase().includes('linkedin.com') &&
      !url.toLowerCase().includes('gmail.com') &&
      !url.toLowerCase().includes('yahoo.com') &&
      !url.toLowerCase().includes('outlook.com')
    );
    if (filteredWebsites.length > 0) {
      resume.personalInfo.website = filteredWebsites[0];
    }
  }

  // Enhanced summary extraction
  const summaryIndex = lines.findIndex(line => 
    /summary|objective|profile|about|overview/i.test(line)
  );
  if (summaryIndex !== -1 && summaryIndex + 1 < lines.length) {
    // Collect multiple lines for summary
    const summaryLines = [];
    for (let i = summaryIndex + 1; i < lines.length && i < summaryIndex + 5; i++) {
      const line = lines[i];
      if (line && !line.match(/^(experience|education|skills|work|employment)/i)) {
        summaryLines.push(line);
      } else {
        break;
      }
    }
    resume.summary = summaryLines.join(' ');
  }

    // ENHANCED SKILLS EXTRACTION

  const skillsData = extractSkills(lines, text);

  resume.skills.technical = skillsData.technical;

  resume.skills.soft = skillsData.soft;

  // Extract experience
  const experienceIndex = lines.findIndex(line => 
    /experience|employment|work|career/i.test(line)
  );
  if (experienceIndex !== -1) {
    // Basic experience extraction - look for patterns like job titles and companies
    const experienceLines = lines.slice(experienceIndex + 1, Math.min(experienceIndex + 20, lines.length));
    let currentJob: any = null;
    
    experienceLines.forEach((line, index) => {
      // Look for date patterns to identify job entries
      if (line.match(/\d{4}|\d{1,2}\/\d{4}/)) {
        if (currentJob) {
          resume.experience.push(currentJob);
        }
        currentJob = {
          id: Date.now().toString() + index,
          title: experienceLines[Math.max(0, index - 1)] || 'Position',
          company: 'Company',
          startDate: line.split('-')[0]?.trim() || '',
          endDate: line.split('-')[1]?.trim() || 'Present',
          description: '',
          current: line.toLowerCase().includes('present') || line.toLowerCase().includes('current')
        };
      } else if (currentJob && line.length > 10) {
        currentJob.description += (currentJob.description ? ' ' : '') + line;
      }
    });
    
    if (currentJob) {
      resume.experience.push(currentJob);
    }
  }

  // Extract education
  const educationIndex = lines.findIndex(line => 
    /education|academic|degree|university|college/i.test(line)
  );
  if (educationIndex !== -1) {
    const educationLines = lines.slice(educationIndex + 1, Math.min(educationIndex + 10, lines.length));
    educationLines.forEach((line, index) => {
      if (line.match(/\d{4}/) && (line.toLowerCase().includes('bachelor') || line.toLowerCase().includes('master') || line.toLowerCase().includes('degree'))) {
        resume.education.push({
          id: Date.now().toString() + index,
          degree: line.split(/\d{4}/)[0]?.trim() || line,
          school: 'University',
          graduationYear: line.match(/\d{4}/)?.[0] || '',
          gpa: ''
        });
      }
    });
  }

  return resume;
};

// Enhanced skills extraction function

const extractSkills = (lines: string[], fullText: string) => {

  // Comprehensive technical skills keywords

  const technicalKeywords = [

    // Programming Languages

    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'lua', 'dart', 'objective-c', 'vb.net', 'f#', 'haskell', 'clojure', 'erlang', 'elixir',

    

    // Web Technologies

    'html', 'css', 'sass', 'scss', 'less', 'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt.js', 'gatsby', 'webpack', 'vite', 'parcel', 'rollup', 'babel', 'postcss', 'tailwind', 'bootstrap', 'material-ui', 'chakra-ui',

    

    // Backend & Frameworks

    'node.js', 'express', 'fastify', 'django', 'flask', 'fastapi', 'spring', 'spring boot', 'laravel', 'symfony', 'codeigniter', 'ruby on rails', 'asp.net', 'gin', 'fiber', 'echo', 'nest.js', 'koa.js',

    

    // Databases

    'mysql', 'postgresql', 'sqlite', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'firebase', 'supabase', 'mariadb', 'oracle', 'sql server', 'couchdb', 'neo4j', 'influxdb',

    

    // Cloud & DevOps

    'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'jenkins', 'github actions', 'gitlab ci', 'circleci', 'travis ci', 'terraform', 'ansible', 'puppet', 'chef', 'vagrant', 'nginx', 'apache', 'cloudflare',

    

    // Mobile Development

    'react native', 'flutter', 'ionic', 'xamarin', 'cordova', 'phonegap', 'android studio', 'xcode', 'unity', 'unreal engine',
    

    // Data Science & ML

    'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras', 'opencv', 'matplotlib', 'seaborn', 'plotly', 'jupyter', 'anaconda', 'spark', 'hadoop', 'tableau', 'power bi', 'qlik',

    

    // Version Control & Tools

    'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial', 'npm', 'yarn', 'pip', 'composer', 'maven', 'gradle', 'cmake', 'make',

    

    // Testing

    'jest', 'mocha', 'chai', 'jasmine', 'cypress', 'selenium', 'playwright', 'puppeteer', 'junit', 'pytest', 'rspec', 'phpunit',

    

    // Other Technologies

    'graphql', 'rest api', 'soap', 'xml', 'json', 'yaml', 'grpc', 'websockets', 'oauth', 'jwt', 'microservices', 'serverless', 'lambda', 'api gateway', 'cdn', 'load balancer'
  ];

// Comprehensive soft skills keywords

  const softKeywords = [

    // Communication

    'communication', 'verbal communication', 'written communication', 'presentation', 'public speaking', 'storytelling', 'negotiation', 'persuasion', 'active listening', 'interpersonal skills',

    

    // Leadership & Management

    'leadership', 'team leadership', 'project management', 'people management', 'mentoring', 'coaching', 'delegation', 'conflict resolution', 'decision making', 'strategic thinking',

    

    // Collaboration & Teamwork

    'teamwork', 'collaboration', 'cross-functional', 'stakeholder management', 'client relations', 'customer service', 'relationship building', 'networking', 'partnership development',

    

    // Problem-Solving & Analysis

    'problem solving', 'analytical thinking', 'critical thinking', 'troubleshooting', 'debugging', 'research', 'data analysis', 'attention to detail', 'quality assurance',

    

    // Adaptability & Learning

    'adaptability', 'flexibility', 'learning agility', 'continuous learning', 'innovation', 'creativity', 'open-mindedness', 'curiosity', 'self-directed learning',

    

    // Organization & Planning

    'organization', 'time management', 'prioritization', 'planning', 'scheduling', 'multitasking', 'efficiency', 'productivity', 'goal setting', 'resource management',

    

    // Personal Qualities

    'reliability', 'dependability', 'accountability', 'responsibility', 'integrity', 'ethics', 'professionalism', 'work ethic', 'persistence', 'resilience', 'patience', 'empathy'

  ];



  // Major section headers that indicate end of skills section

  const majorSectionHeaders = [

    'experience', 'work experience', 'professional experience', 'employment', 'career history', 'work history',

    'education', 'academic background', 'academic history', 'qualifications',

    'certifications', 'certificates', 'licenses',

    'projects', 'portfolio', 'achievements', 'accomplishments', 'awards',

    'publications', 'research', 'patents',

    'volunteer', 'volunteering', 'community service',

    'interests', 'hobbies', 'personal interests',

    'references', 'contact references'

  ];



  // Find skills section

  const skillsIndex = lines.findIndex(line => 

    /^(skills|technical skills|core competencies|technologies|expertise|competencies|proficiencies|capabilities)$/i.test(line.trim())

  );



  if (skillsIndex === -1) {

    // Fallback: look for skills mentioned anywhere in the text

    return extractSkillsFromFullText(fullText, technicalKeywords, softKeywords);
  }

  // Find the end of skills section

  let skillsEndIndex = lines.length;

  for (let i = skillsIndex + 1; i < lines.length; i++) {

    const line = lines[i].trim().toLowerCase();

    if (majorSectionHeaders.some(header => line === header || line.startsWith(header))) {

      skillsEndIndex = i;

      break;

    }
    
  }

  return  // Extract skills from the identified section

  const skillsLines = lines.slice(skillsIndex + 1, skillsEndIndex);

  const skillsText = skillsLines.join(' ');



  return parseSkillsFromText(skillsText, technicalKeywords, softKeywords);

};



// Parse skills from text with various delimiters and formats

const parseSkillsFromText = (text: string, technicalKeywords: string[], softKeywords: string[]) => {

  // Handle various skill formats and delimiters

  const skillDelimiters = /[,;|•·\n\t]/g;

  

  // First, try to extract skills with common delimiters

  let skillsArray = text.split(skillDelimiters)

    .map(skill => skill.trim())

    .filter(skill => skill.length > 1 && skill.length < 50);



  // If no clear delimiters found, try to extract from continuous text

  if (skillsArray.length < 3) {

    // Look for skill patterns in continuous text

    const skillPatterns = [...technicalKeywords, ...softKeywords];

    skillsArray = [];

    

    skillPatterns.forEach(pattern => {

      const regex = new RegExp(`\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');

      const matches = text.match(regex);

      if (matches) {

        skillsArray.push(...matches);

      }

    });

  }



  // Clean and deduplicate skills

  skillsArray = [...new Set(skillsArray.map(skill => 

    skill.replace(/[^\w\s.#+-]/g, '').trim()

  ))].filter(skill => skill.length > 1);



  // Categorize skills with improved matching

  const technical: string[] = [];

  const soft: string[] = [];



  skillsArray.forEach(skill => {

    const skillLower = skill.toLowerCase();

    

    const isTechnical = technicalKeywords.some(keyword => 

      skillLower.includes(keyword.toLowerCase()) || 

      keyword.toLowerCase().includes(skillLower)

    );

    

    const isSoft = softKeywords.some(keyword => 

      skillLower.includes(keyword.toLowerCase()) || 

      keyword.toLowerCase().includes(skillLower)

    );



    if (isTechnical && !technical.some(t => t.toLowerCase() === skillLower)) {

      technical.push(skill);

    } else if (isSoft && !soft.some(s => s.toLowerCase() === skillLower)) {

      soft.push(skill);

    } else if (!isTechnical && !isSoft) {

      // If uncertain, make an educated guess based on common patterns

      if (skillLower.match(/\.(js|py|java|cpp|cs|php|rb|go|rs|swift|kt)$/) || 

          skillLower.includes('programming') || 

          skillLower.includes('development') ||

          skillLower.includes('coding') ||

          skillLower.includes('database') ||

          skillLower.includes('framework') ||

          skillLower.includes('library')) {

        technical.push(skill);

      } else if (skillLower.includes('management') || 

                 skillLower.includes('leadership') || 

                 skillLower.includes('communication') ||

                 skillLower.includes('teamwork') ||

                 skillLower.includes('problem') ||

                 skillLower.includes('organization')) {

        soft.push(skill);

      }

    }

  });



  return {

    technical: technical.slice(0, 15), // Limit to prevent overwhelming lists

    soft: soft.slice(0, 12)

  };

};



// Fallback function to extract skills from full text when no clear skills section exists

const extractSkillsFromFullText = (fullText: string, technicalKeywords: string[], softKeywords: string[]) => {

  const technical: string[] = [];

  const soft: string[] = [];



  // Extract technical skills

  technicalKeywords.forEach(keyword => {

    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');

    if (regex.test(fullText)) {

      technical.push(keyword);

    }

  });



  // Extract soft skills (be more conservative with full text extraction)

  const commonSoftSkills = [

    'leadership', 'communication', 'teamwork', 'problem solving', 'project management',

    'analytical thinking', 'creativity', 'adaptability', 'time management', 'customer service'

  ];



  commonSoftSkills.forEach(keyword => {

    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');

    if (regex.test(fullText)) {

      soft.push(keyword);

    }

  });



  return {

    technical: [...new Set(technical)].slice(0, 10),

    soft: [...new Set(soft)].slice(0, 8)

  };
};