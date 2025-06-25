export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  atsOptimized: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean, modern design perfect for tech and business roles',
    preview: '/templates/modern-professional.png',
    category: 'modern',
    atsOptimized: true,
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#0ea5e9'
    }
  },
  {
    id: 'classic-executive',
    name: 'Classic Executive',
    description: 'Traditional format ideal for senior positions',
    preview: '/templates/classic-executive.png',
    category: 'classic',
    atsOptimized: true,
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#374151'
    }
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    description: 'Stylish template for creative professionals',
    preview: '/templates/creative-designer.png',
    category: 'creative',
    atsOptimized: false,
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#c084fc'
    }
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Simple, distraction-free design',
    preview: '/templates/minimal-clean.png',
    category: 'minimal',
    atsOptimized: true,
    colors: {
      primary: '#059669',
      secondary: '#6b7280',
      accent: '#10b981'
    }
  }
];

export const getTemplate = (id: string): ResumeTemplate | undefined => {
  return resumeTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): ResumeTemplate[] => {
  return resumeTemplates.filter(template => template.category === category);
};

export const getATSOptimizedTemplates = (): ResumeTemplate[] => {
  return resumeTemplates.filter(template => template.atsOptimized);
};