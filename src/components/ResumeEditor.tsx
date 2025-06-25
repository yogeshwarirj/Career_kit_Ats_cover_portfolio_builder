import React, { useState, useEffect } from 'react';
import { Save, Download, Eye, EyeOff, Clock, Users, Shield, Zap } from 'lucide-react';
import { ResumeData, LocalStorageManager } from '../lib/localStorage';
import { ResumeExporter } from '../lib/exportResume';
import { sanitizeInput } from '../lib/encryption';
import CoverLetterIntegration from './CoverLetterIntegration';
import ATSChecker from './ATSChecker';
import toast from 'react-hot-toast';
import debounce from 'lodash.debounce';

interface ResumeEditorProps {
  resumeData: ResumeData;
  onResumeUpdate: (updatedResume: ResumeData) => void;
  selectedTemplate: string;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resumeData,
  onResumeUpdate,
  selectedTemplate,
  isPreviewMode,
  onTogglePreview
}) => {
  const [activeSection, setActiveSection] = useState('personal');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [showATSChecker, setShowATSChecker] = useState(false);
  const localStorage = LocalStorageManager.getInstance();

  // Auto-save functionality
  const debouncedSave = debounce((data: ResumeData) => {
    setIsAutoSaving(true);
    localStorage.autoSave(data);
    setLastSaved(new Date());
    setIsAutoSaving(false);
  }, 2000);

  useEffect(() => {
    debouncedSave(resumeData);
  }, [resumeData, debouncedSave]);

  const handleInputChange = (section: string, field: string, value: any) => {
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
    
    const updatedResume = {
      ...resumeData,
      [section]: {
        ...resumeData[section as keyof ResumeData],
        [field]: sanitizedValue
      },
      lastModified: new Date().toISOString(),
      version: resumeData.version + 1
    };

    onResumeUpdate(updatedResume);
  };

  const handleArrayUpdate = (section: string, index: number, field: string, value: any) => {
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
    const currentArray = resumeData[section as keyof ResumeData] as any[];
    const updatedArray = [...currentArray];
    updatedArray[index] = { ...updatedArray[index], [field]: sanitizedValue };

    const updatedResume = {
      ...resumeData,
      [section]: updatedArray,
      lastModified: new Date().toISOString(),
      version: resumeData.version + 1
    };

    onResumeUpdate(updatedResume);
  };

  const addArrayItem = (section: string, newItem: any) => {
    const currentArray = resumeData[section as keyof ResumeData] as any[];
    const updatedArray = [...currentArray, { ...newItem, id: Date.now().toString() }];

    const updatedResume = {
      ...resumeData,
      [section]: updatedArray,
      lastModified: new Date().toISOString(),
      version: resumeData.version + 1
    };

    onResumeUpdate(updatedResume);
  };

  const removeArrayItem = (section: string, index: number) => {
    const currentArray = resumeData[section as keyof ResumeData] as any[];
    const updatedArray = currentArray.filter((_, i) => i !== index);

    const updatedResume = {
      ...resumeData,
      [section]: updatedArray,
      lastModified: new Date().toISOString(),
      version: resumeData.version + 1
    };

    onResumeUpdate(updatedResume);
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      if (format === 'pdf') {
        await ResumeExporter.exportToPDF(resumeData, 'resume-preview');
      } else {
        await ResumeExporter.exportToWord(resumeData);
      }
      toast.success(`Resume exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      toast.error(`Failed to export resume as ${format.toUpperCase()}`);
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: '👤', color: 'from-blue-500 to-blue-600' },
    { id: 'summary', label: 'Summary', icon: '📝', color: 'from-green-500 to-green-600' },
    { id: 'experience', label: 'Experience', icon: '💼', color: 'from-teal-500 to-teal-600' },
    { id: 'education', label: 'Education', icon: '🎓', color: 'from-purple-500 to-purple-600' },
    { id: 'skills', label: 'Skills', icon: '⚡', color: 'from-orange-500 to-orange-600' },
    { id: 'certifications', label: 'Certifications', icon: '🏆', color: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar - Section Navigation */}
      <div className="lg:col-span-1">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Resume Sections</h3>
            <div className="flex items-center space-x-2">
              {isAutoSaving && <Zap className="h-4 w-4 text-orange-500 animate-pulse" />}
              <Shield className="h-4 w-4 text-green-500" title="Secure & Encrypted" />
            </div>
          </div>
          
          <div className="space-y-3">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`group w-full flex items-center p-4 rounded-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up ${
                  activeSection === section.id
                    ? `bg-gradient-to-r ${section.color} text-white shadow-lg`
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-xl mr-3">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
                
                {activeSection === section.id && (
                  <div className="ml-auto">
                    <Zap className="h-4 w-4 animate-pulse" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Auto-save Status */}
          <div className="mt-6 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                {isAutoSaving ? 'Saving...' : 'Auto-saved'}
              </div>
              {lastSaved && (
                <span className="text-green-600 font-medium">
                  {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 space-y-2">
            <button
              onClick={onTogglePreview}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              {isPreviewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm"
              >
                <Download className="h-4 w-4 mr-1" />
                PDF
              </button>
              <button
                onClick={() => handleExport('docx')}
                className="flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm"
              >
                <Download className="h-4 w-4 mr-1" />
                DOCX
              </button>
            </div>
            
            <button
              onClick={() => setShowCoverLetterModal(true)}
              className="w-full mt-3 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200"
            >
              <Mail className="h-4 w-4 mr-2" />
              Generate Cover Letter
            </button>
            
            <button
              onClick={() => setShowATSChecker(true)}
              className="w-full mt-2 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
            >
              <Shield className="h-4 w-4 mr-2" />
              Check ATS Score
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-2">
        {!isPreviewMode ? (
          /* Edit Mode */
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 animate-fade-in-up">
            {activeSection === 'personal' && (
              <PersonalInfoSection 
                data={resumeData.personalInfo} 
                onChange={(field, value) => handleInputChange('personalInfo', field, value)}
              />
            )}
            
            {activeSection === 'summary' && (
              <SummarySection 
                data={resumeData.summary} 
                onChange={(value) => handleInputChange('summary', 'summary', value)}
              />
            )}
            
            {activeSection === 'experience' && (
              <ExperienceSection 
                data={resumeData.experience} 
                onChange={handleArrayUpdate}
                onAdd={addArrayItem}
                onRemove={removeArrayItem}
              />
            )}
            
            {activeSection === 'education' && (
              <EducationSection 
                data={resumeData.education} 
                onChange={handleArrayUpdate}
                onAdd={addArrayItem}
                onRemove={removeArrayItem}
              />
            )}
            
            {activeSection === 'skills' && (
              <SkillsSection 
                data={resumeData.skills} 
                onChange={(field, value) => handleInputChange('skills', field, value)}
              />
            )}
            
            {activeSection === 'certifications' && (
              <CertificationsSection 
                data={resumeData.certifications} 
                onChange={handleArrayUpdate}
                onAdd={addArrayItem}
                onRemove={removeArrayItem}
              />
            )}
          </div>
        ) : (
          /* Preview Mode */
          <div id="resume-preview" className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 animate-fade-in">
            <ResumePreview data={resumeData} template={selectedTemplate} />
          </div>
        )}
      </div>
      
      {/* Cover Letter Integration Modal */}
      {showCoverLetterModal && (
        <CoverLetterIntegration
          resumeData={resumeData}
          onClose={() => setShowCoverLetterModal(false)}
        />
      )}
      
      {/* ATS Checker Modal */}
      {showATSChecker && (
        <ATSChecker
          resumeContent={JSON.stringify(resumeData)}
          jobDescription=""
          onClose={() => setShowATSChecker(false)}
        />
      )}
    </div>
  );
};

// Section Components
const PersonalInfoSection: React.FC<{ data: any; onChange: (field: string, value: string) => void }> = ({ data, onChange }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
      👤 Personal Information
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
        <input 
          type="text" 
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
          placeholder="John Doe"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input 
          type="email" 
          value={data.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
          placeholder="john@example.com"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
        <input 
          type="tel" 
          value={data.phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
          placeholder="+1 (555) 123-4567"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <input 
          type="text" 
          value={data.location || ''}
          onChange={(e) => onChange('location', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
          placeholder="San Francisco, CA"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
        <input 
          type="url" 
          value={data.website || ''}
          onChange={(e) => onChange('website', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
          placeholder="https://johndoe.com"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
        <input 
          type="url" 
          value={data.linkedin || ''}
          onChange={(e) => onChange('linkedin', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
          placeholder="https://linkedin.com/in/johndoe"
        />
      </div>
    </div>
  </div>
);

const SummarySection: React.FC<{ data: string; onChange: (value: string) => void }> = ({ data, onChange }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
      📝 Professional Summary
    </h2>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
      <textarea 
        rows={6}
        value={data || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
        placeholder="Write a compelling summary of your professional background and key achievements..."
      />
      <p className="text-sm text-gray-500 mt-2">
        {data?.length || 0}/500 characters
      </p>
    </div>
  </div>
);

const ExperienceSection: React.FC<{ 
  data: any[]; 
  onChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, item: any) => void;
  onRemove: (section: string, index: number) => void;
}> = ({ data, onChange, onAdd, onRemove }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
      💼 Work Experience
    </h2>
    
    <div className="space-y-6">
      {data.map((exp, index) => (
        <div key={exp.id || index} className="p-6 border-2 border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input 
              type="text" 
              value={exp.title || ''}
              onChange={(e) => onChange('experience', index, 'title', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Job Title"
            />
            <input 
              type="text" 
              value={exp.company || ''}
              onChange={(e) => onChange('experience', index, 'company', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Company Name"
            />
            <input 
              type="text" 
              value={exp.startDate || ''}
              onChange={(e) => onChange('experience', index, 'startDate', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Start Date"
            />
            <input 
              type="text" 
              value={exp.endDate || ''}
              onChange={(e) => onChange('experience', index, 'endDate', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="End Date (or Present)"
            />
          </div>
          <textarea 
            rows={4}
            value={exp.description || ''}
            onChange={(e) => onChange('experience', index, 'description', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Describe your key responsibilities and achievements..."
          />
          <button
            onClick={() => onRemove('experience', index)}
            className="mt-3 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Remove Position
          </button>
        </div>
      ))}
      
      <button 
        onClick={() => onAdd('experience', { title: '', company: '', startDate: '', endDate: '', description: '', current: false })}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-teal-400 hover:text-teal-600 transition-all duration-200 flex items-center justify-center"
      >
        <span className="text-2xl mr-2">+</span>
        Add Work Experience
      </button>
    </div>
  </div>
);

const EducationSection: React.FC<{ 
  data: any[]; 
  onChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, item: any) => void;
  onRemove: (section: string, index: number) => void;
}> = ({ data, onChange, onAdd, onRemove }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
      🎓 Education
    </h2>
    
    <div className="space-y-6">
      {data.map((edu, index) => (
        <div key={edu.id || index} className="p-6 border-2 border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              value={edu.degree || ''}
              onChange={(e) => onChange('education', index, 'degree', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Degree"
            />
            <input 
              type="text" 
              value={edu.school || ''}
              onChange={(e) => onChange('education', index, 'school', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="School/University"
            />
            <input 
              type="text" 
              value={edu.graduationYear || ''}
              onChange={(e) => onChange('education', index, 'graduationYear', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Graduation Year"
            />
            <input 
              type="text" 
              value={edu.gpa || ''}
              onChange={(e) => onChange('education', index, 'gpa', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="GPA (Optional)"
            />
          </div>
          <button
            onClick={() => onRemove('education', index)}
            className="mt-3 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Remove Education
          </button>
        </div>
      ))}
      
      <button 
        onClick={() => onAdd('education', { degree: '', school: '', graduationYear: '', gpa: '' })}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-all duration-200 flex items-center justify-center"
      >
        <span className="text-2xl mr-2">+</span>
        Add Education
      </button>
    </div>
  </div>
);

const SkillsSection: React.FC<{ data: any; onChange: (field: string, value: any) => void }> = ({ data, onChange }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
      ⚡ Skills & Expertise
    </h2>
    
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
        <input 
          type="text" 
          value={data.technical?.join(', ') || ''}
          onChange={(e) => onChange('technical', e.target.value.split(',').map((s: string) => s.trim()))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="JavaScript, React, Node.js, Python..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
        <input 
          type="text" 
          value={data.soft?.join(', ') || ''}
          onChange={(e) => onChange('soft', e.target.value.split(',').map((s: string) => s.trim()))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Leadership, Communication, Problem Solving..."
        />
      </div>
    </div>
  </div>
);

const CertificationsSection: React.FC<{ 
  data: any[]; 
  onChange: (section: string, index: number, field: string, value: any) => void;
  onAdd: (section: string, item: any) => void;
  onRemove: (section: string, index: number) => void;
}> = ({ data, onChange, onAdd, onRemove }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
      🏆 Certifications
    </h2>
    
    <div className="space-y-6">
      {data.map((cert, index) => (
        <div key={cert.id || index} className="p-6 border-2 border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              value={cert.name || ''}
              onChange={(e) => onChange('certifications', index, 'name', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Certification Name"
            />
            <input 
              type="text" 
              value={cert.issuer || ''}
              onChange={(e) => onChange('certifications', index, 'issuer', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Issuing Organization"
            />
            <input 
              type="text" 
              value={cert.date || ''}
              onChange={(e) => onChange('certifications', index, 'date', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Date Obtained"
            />
          </div>
          <button
            onClick={() => onRemove('certifications', index)}
            className="mt-3 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Remove Certification
          </button>
        </div>
      ))}
      
      <button 
        onClick={() => onAdd('certifications', { name: '', issuer: '', date: '' })}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-400 hover:text-red-600 transition-all duration-200 flex items-center justify-center"
      >
        <span className="text-2xl mr-2">+</span>
        Add Certification
      </button>
    </div>
  </div>
);

const ResumePreview: React.FC<{ data: ResumeData; template: string }> = ({ data, template }) => (
  <div className="max-w-2xl mx-auto">
    {/* Header */}
    <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personalInfo.name || 'Your Name'}</h1>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
        {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
      </div>
    </div>

    {/* Summary */}
    {data.summary && (
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Professional Summary</h2>
        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Experience</h2>
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-gray-700 text-sm">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Education</h2>
        <div className="space-y-2">
          {data.education.map((edu, index) => (
            <div key={index} className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600">{edu.school}</p>
              </div>
              <span className="text-sm text-gray-500">{edu.graduationYear}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Skills */}
    {(data.skills.technical?.length > 0 || data.skills.soft?.length > 0) && (
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {data.skills.technical?.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Technical</h4>
              <p className="text-gray-700">{data.skills.technical.join(', ')}</p>
            </div>
          )}
          {data.skills.soft?.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Soft Skills</h4>
              <p className="text-gray-700">{data.skills.soft.join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Certifications */}
    {data.certifications.length > 0 && (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Certifications</h2>
        <div className="space-y-2">
          {data.certifications.map((cert, index) => (
            <div key={index} className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-gray-600">{cert.issuer}</p>
              </div>
              <span className="text-sm text-gray-500">{cert.date}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default ResumeEditor;