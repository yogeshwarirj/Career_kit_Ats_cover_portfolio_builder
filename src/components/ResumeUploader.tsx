import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle, Loader, ExternalLink, Download } from 'lucide-react';
import { parseResumeFile, validateResumeFile, ParsedResume } from '../lib/resumeParser';
import { resumeUploadIntegration } from '../lib/resumeUploadIntegration';
import toast from 'react-hot-toast';

interface ResumeUploaderProps {
  onResumeUploaded: (parsedResume: ParsedResume ) => void;
  onResumeDataExtracted?: (resumeData: any) => void;
  className?: string;
  mode?: 'resume-builder' | 'cover-letter' | 'ats-analysis';
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ 
  onResumeUploaded, 
  onResumeDataExtracted,
  className = '',
  mode = 'resume-builder'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Check for rejected files (non-DOCX files)
    if (rejectedFiles.length > 0) {
      const rejectedFile = rejectedFiles[0];
      if (rejectedFile.file.type === 'application/pdf') {
        toast.error('PDF files are not supported. Please convert your PDF to DOCX format using Adobe\'s converter.', {
          duration: 6000,
          style: { maxWidth: '500px' }
        });
      } else {
        toast.error('Only DOCX files are supported. Please upload a Word document (.docx).', {
          duration: 4000
        });
      }
      setUploadStatus('error');
      return;
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const validation = validateResumeFile(file);

    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      const parsedResume = await parseResumeFile(file);
      
      // Validate that we extracted meaningful data
      if (!parsedResume.personalInfo.name && !parsedResume.personalInfo.email) {
        throw new Error('Unable to extract personal information from your resume. Please ensure your resume contains your name and email address clearly at the top.');
      }
      
      onResumeUploaded(parsedResume);
      
      // If in cover letter mode, also extract resume data
      if (mode === 'cover-letter' && onResumeDataExtracted) {
        const result = await resumeUploadIntegration.processResumeUpload(file);
        if (result.success && result.resumeData) {
          onResumeDataExtracted(result.resumeData);
        }
      }
      
      setUploadStatus('success');
      toast.success('Resume uploaded and parsed successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      
      // Provide specific error messages based on the error type
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse resume. Please try again.';
      toast.error(errorMessage, {
        duration: 6000,
        style: {
          maxWidth: '500px',
        },
      });
    } finally {
      setIsUploading(false);
    }
  }, [onResumeUploaded, onResumeDataExtracted, mode]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const getStatusIcon = () => {
    if (isUploading) return <Loader className="h-8 w-8 animate-spin text-teal-600" />;
    if (uploadStatus === 'success') return <CheckCircle className="h-8 w-8 text-green-600" />;
    if (uploadStatus === 'error') return <AlertCircle className="h-8 w-8 text-red-600" />;
    return <Upload className="h-8 w-8 text-gray-400" />;
  };

  const getStatusText = () => {
    if (isUploading) return 'Parsing your resume...';
    if (uploadStatus === 'success') return 'Resume uploaded successfully!';
    if (uploadStatus === 'error') return 'Upload failed. Please check the file and try again.';
    if (isDragActive) return 'Drop your DOCX resume here...';
    return 'Upload your resume in .docx format only';
  };

  const getStatusColor = () => {
    if (uploadStatus === 'success') return 'border-green-300 bg-green-50';
    if (uploadStatus === 'error') return 'border-red-300 bg-red-50';
    if (isDragActive) return 'border-teal-400 bg-teal-50';
    return 'border-gray-300 bg-white hover:bg-gray-50';
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${getStatusColor()}`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {getStatusIcon()}
          
          <div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {getStatusText()}
            </p>
            
            <p className="text-sm text-gray-600 mb-3">
              {mode === 'cover-letter' 
                ? 'Upload your resume in DOCX format to generate a personalized cover letter'
                : mode === 'ats-analysis'
                ? 'Upload your resume in DOCX format for comprehensive ATS analysis'
                : 'Only Microsoft Word documents (.docx) are supported for best results'
              }
            </p>

            {/* DOCX File Icon */}
            {!isUploading && uploadStatus !== 'success' && (
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <FileText className="h-4 w-4 mr-2" />
                  DOCX Only
                </div>
              </div>
            )}
          </div>

          {/* PDF Conversion Notice */}
          {uploadStatus !== 'success' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-orange-400" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-orange-800 mb-2">
                    Have a PDF resume?
                  </h4>
                  <p className="text-sm text-orange-700 mb-3">
                    Convert your PDF to DOCX format for best results and accurate text extraction.
                  </p>
                  <a
                    href="https://www.adobe.com/acrobat/online/pdf-to-word.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Convert PDF to DOCX
                  </a>
                </div>
              </div>
            </div>
           )}


          {uploadStatus === 'error' && (
            <div className="text-sm text-red-600 bg-red-50 p-4 rounded-lg mt-4 max-w-md">
              <p className="font-medium mb-2">Upload Requirements:</p>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>File must be in Microsoft Word (.docx) format</li>
                <li>File size must be less than 10MB</li>
                <li>Resume should contain clear text (not just images)</li>
                <li>Name and email should be visible at the top</li>
              </ul>
              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="font-medium mb-1">Need to convert a PDF?</p>
                <a
                  href="https://www.adobe.com/acrobat/online/pdf-to-word.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-red-700 hover:text-red-800 text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Use Adobe's free PDF to Word converter
                </a>
              </div>
            </div>
           )}
        </div>

        {/* Upload Progress Animation */}
        {isUploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-500 to-blue-500 animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Why DOCX Notice */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800 mb-1">Why DOCX format?</h4>
            <p className="text-sm text-blue-700">
              DOCX files provide the most accurate text extraction and formatting analysis. This ensures we can properly analyze your resume content, structure, and ATS compatibility.
            </p>
            {mode === 'ats-analysis' && (
              <p className="text-xs text-blue-600 mt-2">
                <strong>Privacy:</strong> Your resume is processed securely and used only for analysis. No data is stored permanently.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploader;

export { ResumeUploader };