import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, X, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  className?: string;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImage,
  className = '',
  maxSize = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
        toast.error(`File size must be less than ${maxSize}MB`);
      } else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
        toast.error('Only JPEG, PNG, WebP, and GIF images are supported');
      } else {
        toast.error('Invalid file. Please try again.');
      }
      setUploadStatus('error');
      return;
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);
    setUploadStatus('idle');

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onImageUpload(result);
          setUploadStatus('success');
          toast.success('Image uploaded successfully!');
        }
      };
      reader.onerror = () => {
        setUploadStatus('error');
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onImageUpload, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => {
      acc[format] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: 1,
    maxSize: maxSize * 1024 * 1024 // Convert MB to bytes
  });

  const removeImage = () => {
    onImageUpload('');
    setUploadStatus('idle');
    toast.success('Image removed');
  };

  const getStatusIcon = () => {
    if (isUploading) return <Upload className="h-6 w-6 animate-pulse text-blue-600" />;
    if (uploadStatus === 'success' || currentImage) return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (uploadStatus === 'error') return <AlertCircle className="h-6 w-6 text-red-600" />;
    return <Image className="h-6 w-6 text-gray-400" />;
  };

  const getStatusColor = () => {
    if (uploadStatus === 'success' || currentImage) return 'border-green-300 bg-green-50';
    if (uploadStatus === 'error') return 'border-red-300 bg-red-50';
    if (isDragActive) return 'border-blue-400 bg-blue-50';
    return 'border-gray-300 bg-white hover:bg-gray-50';
  };

  return (
    <div className={`w-full ${className}`}>
      {currentImage ? (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-xl border-2 border-gray-200">
            <img
              src={currentImage}
              alt="Uploaded project"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <button
                onClick={removeImage}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-2 text-center">
            <button
              {...getRootProps()}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <input {...getInputProps()} />
              Change Image
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${getStatusColor()}`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-3">
            {getStatusIcon()}
            
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {isUploading ? 'Uploading...' : 
                 isDragActive ? 'Drop image here' : 
                 'Upload project image'}
              </p>
              
              <p className="text-xs text-gray-600">
                {isDragActive ? 'Release to upload' : 
                 `Drag & drop or click to browse (Max ${maxSize}MB)`}
              </p>
            </div>

            {/* Supported formats */}
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Supports:</span>
              <div className="flex space-x-1">
                {['JPG', 'PNG', 'WebP', 'GIF'].map((format) => (
                  <span key={format} className="px-2 py-1 bg-gray-100 rounded-full">
                    {format}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Upload Progress Animation */}
          {isUploading && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {uploadStatus === 'error' && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
          <p className="font-medium mb-1">Upload Requirements:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>File must be an image (JPEG, PNG, WebP, or GIF)</li>
            <li>File size must be less than {maxSize}MB</li>
            <li>Image should be clear and professional</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;