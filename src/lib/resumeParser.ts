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
// GENERALIZED SKILLS EXTRACTION

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

export const validateResumeFile = (file: File): { valid: boolean; error?: string } => {
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
// Generalized skills extraction function for all industries
const extractSkills = (lines: string[], fullText: string) => {
  // Technical/Hard Skills Keywords (Industry-Agnostic)
  const technicalKeywords = [
    // Technology & Software (Basic)
    'microsoft office', 'excel', 'word', 'powerpoint', 'outlook', 'google workspace', 'google sheets', 'google docs',
    'adobe creative suite', 'photoshop', 'illustrator', 'indesign', 'premiere pro', 'after effects',
    'autocad', 'solidworks', 'revit', 'sketchup', 'archicad', 'maya', '3ds max', 'blender',
    'salesforce', 'hubspot', 'crm', 'erp', 'sap', 'oracle', 'quickbooks', 'sage', 'xero',
    
    // Programming & Development
    'programming', 'coding', 'software development', 'web development', 'mobile development',
    'javascript', 'python', 'java', 'html', 'css', 'sql', 'c++', 'c#', 'php', 'ruby',
    
    // Data & Analytics
    'data analysis', 'statistical analysis', 'tableau', 'power bi', 'spss', 'r', 'stata',
    'data visualization', 'business intelligence', 'reporting', 'dashboards',
    
    // Digital Marketing & Social Media
    'digital marketing', 'social media marketing', 'seo', 'sem', 'google analytics', 'google ads',
    'facebook ads', 'instagram marketing', 'linkedin marketing', 'email marketing', 'content marketing',
    'mailchimp', 'hootsuite', 'buffer', 'sprout social',
    
    // Design & Creative
    'graphic design', 'web design', 'ui/ux design', 'branding', 'typography', 'color theory',
    'wireframing', 'prototyping', 'figma', 'sketch', 'canva',
    
    // Finance & Accounting
    'financial analysis', 'budgeting', 'forecasting', 'financial modeling', 'cost accounting',
    'tax preparation', 'auditing', 'accounts payable', 'accounts receivable', 'payroll',
    'gaap', 'ifrs', 'financial reporting',
    
    // Healthcare & Medical
    'medical terminology', 'patient care', 'medical records', 'hipaa', 'electronic health records',
    'medical coding', 'icd-10', 'cpt coding', 'medical billing', 'phlebotomy', 'vital signs',
    'medication administration', 'clinical research',
    
    // Manufacturing & Engineering
    'quality control', 'quality assurance', 'lean manufacturing', 'six sigma', 'iso 9001',
    'process improvement', 'root cause analysis', 'statistical process control',
    'machine operation', 'equipment maintenance', 'safety protocols',
    
    // Sales & Business Development
    'sales forecasting', 'lead generation', 'cold calling', 'prospecting', 'territory management',
    'account management', 'relationship building', 'contract negotiation', 'closing deals',
    
    // Legal & Compliance
    'legal research', 'contract review', 'compliance monitoring', 'regulatory knowledge',
    'litigation support', 'document review', 'paralegal skills',
    
    // Human Resources
    'recruitment', 'talent acquisition', 'employee relations', 'performance management',
    'training and development', 'compensation analysis', 'benefits administration',
    'hr information systems', 'onboarding', 'exit interviews',
    
    // Education & Training
    'curriculum development', 'lesson planning', 'classroom management', 'educational technology',
    'student assessment', 'learning management systems', 'instructional design',
    
    // Languages
    'bilingual', 'multilingual', 'spanish', 'french', 'german', 'mandarin', 'japanese',
    'translation', 'interpretation', 'language proficiency',
    
    // Certifications & Licenses
    'certified', 'licensed', 'accredited', 'pmp', 'cpa', 'cfa', 'frm', 'cissp', 'comptia',
    'aws certified', 'google certified', 'microsoft certified', 'cisco certified',
    
    // Industry-Specific Tools
    'pos systems', 'inventory management', 'supply chain management', 'logistics',
    'warehouse management', 'shipping', 'receiving', 'forklift operation',
    'food safety', 'servsafe', 'haccp', 'restaurant management',
    'retail management', 'visual merchandising', 'cash handling'
  ];

  // Soft Skills Keywords (Universal)
  const softKeywords = [
    // Communication Skills
    'communication', 'verbal communication', 'written communication', 'presentation skills',
    'public speaking', 'storytelling', 'active listening', 'interpersonal skills',
    'client communication', 'customer service', 'phone etiquette', 'email communication',
    
    // Leadership & Management
    'leadership', 'team leadership', 'project management', 'people management',
    'mentoring', 'coaching', 'delegation', 'supervision', 'training staff',
    'conflict resolution', 'decision making', 'strategic thinking', 'vision setting',
    
    // Teamwork & Collaboration
    'teamwork', 'collaboration', 'cross-functional collaboration', 'team player',
    'cooperative', 'supportive', 'relationship building', 'networking',
    'stakeholder management', 'partnership development',
    
    // Problem-Solving & Analysis
    'problem solving', 'analytical thinking', 'critical thinking', 'troubleshooting',
    'research skills', 'attention to detail', 'quality focus', 'process improvement',
    'innovation', 'creative thinking', 'solution-oriented',
    
    // Adaptability & Learning
    'adaptability', 'flexibility', 'learning agility', 'continuous learning',
    'open-mindedness', 'curiosity', 'self-directed learning', 'resilience',
    'change management', 'embracing change', 'growth mindset',
    
    // Organization & Planning
    'organization', 'time management', 'prioritization', 'planning', 'scheduling',
    'multitasking', 'efficiency', 'productivity', 'goal setting', 'deadline management',
    'resource management', 'workflow optimization',
    
    // Personal Qualities
    'reliability', 'dependability', 'accountability', 'responsibility', 'integrity',
    'professionalism', 'work ethic', 'persistence', 'patience', 'empathy',
    'emotional intelligence', 'cultural sensitivity', 'diversity awareness',
    
    // Customer & Service Focus
    'customer focus', 'service orientation', 'client relations', 'hospitality',
    'patient care', 'bedside manner', 'compassion', 'understanding',
    
    // Sales & Persuasion
    'persuasion', 'negotiation', 'sales skills', 'influencing', 'relationship selling',
    'consultative selling', 'closing skills', 'objection handling',
    
    // Work Style
    'self-motivated', 'independent', 'autonomous', 'proactive', 'initiative',
    'results-oriented', 'detail-oriented', 'big picture thinking', 'strategic mindset',
    'hands-on', 'practical', 'methodical', 'systematic'
  ];

  // Major section headers that indicate end of skills section
  const majorSectionHeaders = [
    'experience', 'work experience', 'professional experience', 'employment', 'career history', 'work history',
    'education', 'academic background', 'academic history', 'qualifications',
    'certifications', 'certificates', 'licenses', 'credentials',
    'projects', 'portfolio', 'achievements', 'accomplishments', 'awards',
    'publications', 'research', 'patents',
    'volunteer', 'volunteering', 'community service', 'volunteer experience',
    'interests', 'hobbies', 'personal interests', 'activities',
    'references', 'contact references', 'professional references'
  ];

  // Find skills section
  const skillsIndex = lines.findIndex(line => 
    /^(skills|technical skills|core competencies|technologies|expertise|competencies|proficiencies|capabilities|key skills|areas of expertise)$/i.test(line.trim())
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

  // Extract skills from the identified section
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
    .filter(skill => skill.length > 1 && skill.length < 60);

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
    
    // Check for technical skills
    const isTechnical = technicalKeywords.some(keyword => {
      const keywordLower = keyword.toLowerCase();
      return skillLower.includes(keywordLower) || 
             keywordLower.includes(skillLower) ||
             // Exact match for shorter skills
             (skillLower.length <= 15 && keywordLower === skillLower);
    });
    
    // Check for soft skills
    const isSoft = softKeywords.some(keyword => {
      const keywordLower = keyword.toLowerCase();
      return skillLower.includes(keywordLower) || 
             keywordLower.includes(skillLower) ||
             // Exact match for shorter skills
             (skillLower.length <= 20 && keywordLower === skillLower);
    });

    if (isTechnical && !technical.some(t => t.toLowerCase() === skillLower)) {
      technical.push(skill);
    } else if (isSoft && !soft.some(s => s.toLowerCase() === skillLower)) {
      soft.push(skill);
    } else if (!isTechnical && !isSoft && skill.length > 2) {
      // Smart categorization for unrecognized skills
      if (isLikelyTechnicalSkill(skillLower)) {
        if (!technical.some(t => t.toLowerCase() === skillLower)) {
          technical.push(skill);
        }
      } else if (isLikelySoftSkill(skillLower)) {
        if (!soft.some(s => s.toLowerCase() === skillLower)) {
          soft.push(skill);
        }
      }
    }
  });

  return {
    technical: technical.slice(0, 15), // Limit to prevent overwhelming lists
    soft: soft.slice(0, 12)
  };
};

// Helper function to identify likely technical skills
const isLikelyTechnicalSkill = (skill: string): boolean => {
  const technicalPatterns = [
    /software$/i, /system$/i, /platform$/i, /tool$/i, /application$/i,
    /analysis$/i, /management$/i, /administration$/i, /operation$/i,
    /certified$/i, /certification$/i, /license$/i, /proficiency$/i,
    /\d+\.\d+/i, // Version numbers
    /microsoft|adobe|google|apple|oracle|sap|salesforce/i,
    /operating|maintenance|installation|configuration/i,
    /machine|equipment|technical|medical|legal|financial/i
  ];
  
  return technicalPatterns.some(pattern => pattern.test(skill));
};

// Helper function to identify likely soft skills
const isLikelySoftSkill = (skill: string): boolean => {
  const softPatterns = [
    /skills?$/i, /ability$/i, /oriented$/i, /focused$/i, /minded$/i,
    /management$/i, /building$/i, /development$/i, /resolution$/i,
    /strong|excellent|outstanding|superior|exceptional/i,
    /work|team|client|customer|people|relationship/i,
    /creative|innovative|strategic|analytical|detail/i
  ];
  
  return softPatterns.some(pattern => pattern.test(skill));
};

// Fallback function to extract skills from full text when no clear skills section exists
const extractSkillsFromFullText = (fullText: string, technicalKeywords: string[], softKeywords: string[]) => {
  const technical: string[] = [];
  const soft: string[] = [];

  // Extract technical skills with higher confidence threshold
  const commonTechnicalSkills = technicalKeywords.filter(keyword => 
    keyword.split(' ').length <= 3 && keyword.length >= 3
  );

  commonTechnicalSkills.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(fullText)) {
      technical.push(keyword);
    }
  });

  // Extract soft skills with higher confidence threshold
  const commonSoftSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'customer service',
    'time management', 'project management', 'analytical thinking', 'attention to detail',
    'adaptability', 'creativity', 'organization', 'multitasking', 'negotiation'
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
  return { valid: true };
};