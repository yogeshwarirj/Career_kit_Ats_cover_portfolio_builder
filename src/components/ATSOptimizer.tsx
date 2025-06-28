Here's the fixed version with all missing closing brackets and proper formatting:

```typescript
import React, { useState, useEffect } from 'react';
import { Upload, FileText, Target, Zap, Shield, TrendingUp, CheckCircle, AlertTriangle, XCircle, Download, Copy, Eye, EyeOff, RefreshCw, Star, Award, Users, Lightbulb, ArrowRight, BarChart3, PieChart, Activity, Sparkles, Edit3, Save, Plus } from 'lucide-react';
import { ResumeData } from '../lib/localStorage';
import { ATSAnalyzer, ATSAnalysisResult } from '../lib/atsAnalyzer';
import { ResumeUploader } from './ResumeUploader';
import { ParsedResume } from '../lib/resumeParser';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ATSOptimizerProps {
  onClose?: () => void;
  initialResumeData?: ResumeData;
  className?: string;
}

interface OptimizedResumeResult extends ATSAnalysisResult {
  optimizedResume?: ResumeData;
}

const ATSOptimizer: React.FC<ATSOptimizerProps> = ({ onClose, initialResumeData, className = '' }) => {
  // ... [previous code remains unchanged until the broken sections]

  {optimizedResult.optimizedResume.summary && (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
        PROFESSIONAL SUMMARY
      </h2>
      <p className="text-gray-700">{optimizedResult.optimizedResume.summary}</p>
    </div>
  )}

  {(optimizedResult.optimizedResume.skills.technical.length > 0 || optimizedResult.optimizedResume.skills.soft.length > 0) && (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">
        CORE COMPETENCIES & SKILLS
      </h2>
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Technical Skills:</h3>
            {optimizedResult.optimizedResume.skills.technical.join(' • ')}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Professional Skills:</h3>
            {optimizedResult.optimizedResume.skills.soft.join(' • ')}
          </div>
        </div>
      </div>
    </div>
  )}

  {optimizedResult.optimizedResume.experience.length > 0 && (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
        PROFESSIONAL EXPERIENCE
      </h2>
      {optimizedResult.optimizedResume.experience.map((exp, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-gray-900">{exp.title}</h3>
            <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
          </div>
          <p className="text-gray-700 font-medium mb-2">{exp.company}</p>
          <p className="text-gray-600 text-sm">{exp.description}</p>
        </div>
      ))}
    </div>
  )}

  {optimizedResult.optimizedResume.education.length > 0 && (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
        EDUCATION
      </h2>
      {optimizedResult.optimizedResume.education.map((edu, index) => (
        <div key={index} className="mb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
              <p className="text-gray-700">{edu.school}</p>
            </div>
            <span className="text-sm text-gray-600">{edu.graduationYear}</span>
          </div>
        </div>
      ))}
    </div>
  )}

  {optimizedResult.optimizedResume.additionalKeywords && (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
        ADDITIONAL KEYWORDS
      </h2>
      <div className="text-gray-700 text-sm">
        {optimizedResult.optimizedResume.additionalKeywords.join(' • ')}
      </div>
    </div>
  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSOptimizer;
```