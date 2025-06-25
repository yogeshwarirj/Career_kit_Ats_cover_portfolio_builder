import React, { useState } from 'react';
import { Check, Eye, Zap, Shield } from 'lucide-react';
import { resumeTemplates, ResumeTemplate } from '../lib/resumeTemplates';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  className?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  className = ''
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Templates', count: resumeTemplates.length },
    { id: 'modern', name: 'Modern', count: resumeTemplates.filter(t => t.category === 'modern').length },
    { id: 'classic', name: 'Classic', count: resumeTemplates.filter(t => t.category === 'classic').length },
    { id: 'creative', name: 'Creative', count: resumeTemplates.filter(t => t.category === 'creative').length },
    { id: 'minimal', name: 'Minimal', count: resumeTemplates.filter(t => t.category === 'minimal').length },
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTemplates = activeCategory === 'all' 
    ? resumeTemplates 
    : resumeTemplates.filter(template => template.category === activeCategory);

  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={`group relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
              selectedTemplate === template.id
                ? 'border-teal-500 ring-2 ring-teal-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            {/* Template Preview */}
            <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl overflow-hidden">
              {/* Mock Resume Preview */}
              <div className="p-4 h-full flex flex-col" style={{ backgroundColor: '#ffffff' }}>
                <div className="text-center mb-3">
                  <div 
                    className="h-3 w-24 mx-auto mb-1 rounded"
                    style={{ backgroundColor: template.colors.primary }}
                  ></div>
                  <div className="h-2 w-16 bg-gray-300 mx-auto rounded"></div>
                </div>
                
                <div className="space-y-2 flex-1">
                  <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                  
                  <div className="mt-3">
                    <div 
                      className="h-2 w-16 mb-1 rounded"
                      style={{ backgroundColor: template.colors.secondary }}
                    ></div>
                    <div className="space-y-1">
                      <div className="h-1 bg-gray-200 rounded w-full"></div>
                      <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div 
                      className="h-2 w-20 mb-1 rounded"
                      style={{ backgroundColor: template.colors.secondary }}
                    ></div>
                    <div className="space-y-1">
                      <div className="h-1 bg-gray-200 rounded w-full"></div>
                      <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template.id);
                    }}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors duration-200">
                  {template.name}
                </h3>
                <div className="flex items-center space-x-1">
                  {template.atsOptimized && (
                    <div className="flex items-center text-green-600" title="ATS Optimized">
                      <Shield className="h-4 w-4" />
                    </div>
                  )}
                  <div className="flex items-center text-orange-500" title="Popular">
                    <Zap className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {template.description}
              </p>

              {/* Color Palette */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Colors:</span>
                <div className="flex space-x-1">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: template.colors.primary }}
                  ></div>
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: template.colors.secondary }}
                  ></div>
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: template.colors.accent }}
                  ></div>
                </div>
              </div>

              {/* ATS Badge */}
              {template.atsOptimized && (
                <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  ATS Optimized
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  {resumeTemplates.find(t => t.id === previewTemplate)?.name} Preview
                </h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Full Template Preview */}
              <div className="bg-gray-100 p-8 rounded-lg">
                <div className="bg-white shadow-lg max-w-2xl mx-auto p-8 rounded">
                  <p className="text-center text-gray-500">
                    Full template preview would be rendered here with actual resume data
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleTemplateSelect(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;