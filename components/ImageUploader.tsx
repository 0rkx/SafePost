import React, { useState, useCallback } from 'react';
import { PhotoShieldIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File, preserveElements: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropped, setIsDropped] = useState(false);
  const [preserveInstructions, setPreserveInstructions] = useState('');

  const handleFileValidation = useCallback((file: File | null): boolean => {
    if (!file) return false;

    const acceptedTypes = ['image/jpeg', 'image/png'];
    if (!acceptedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPEG or PNG image.');
      return false;
    }
    
    const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSizeInBytes) {
      setError('File is too large. Maximum size is 10 MB.');
      return false;
    }

    setError(null);
    return true;
  }, []);
  
  const handleFileAccepted = useCallback((file: File) => {
    if (handleFileValidation(file)) {
      setIsDropped(true);
      setTimeout(() => {
        onImageUpload(file, preserveInstructions);
      }, 400); // Match CSS animation duration
    }
  }, [handleFileValidation, onImageUpload, preserveInstructions]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileAccepted(file);
    }
    event.target.value = '';
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileAccepted(file);
    }
  }, [handleFileAccepted]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center space-y-8 py-4 ${isDropped ? 'animate-drop-confirm' : ''}`}>
      <div className="text-center max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Share Photos, Worry-Free</h2>
          <p className="mt-4 text-lg text-slate-600">
              Our AI automatically anonymizes sensitive details. Describe anything you want to keep visible below.
          </p>
      </div>
      <div className="w-full max-w-2xl space-y-6">
        <div 
            className={`relative p-8 border-2 border-dashed rounded-2xl transition-colors duration-300 ${isDragging ? 'animate-pulse-border bg-blue-50/50' : 'border-slate-300 bg-white'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                accept="image/png, image/jpeg"
                onChange={handleFileChange} 
            />
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <PhotoShieldIcon className="h-20 w-20 text-slate-400" />
                <div className="flex flex-col items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="px-6 py-3 font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    Choose an Image
                  </button>
                  <p className="text-slate-500 mt-2">or drag and drop</p>
                </div>
                <p className="text-sm text-slate-500">PNG or JPG (max 10MB)</p>
            </div>
        </div>

        <div>
            <label htmlFor="preserve-instructions" className="block text-sm font-medium text-slate-700 mb-1">
                Things to keep visible (optional)
            </label>
            <input
                type="text"
                id="preserve-instructions"
                value={preserveInstructions}
                onChange={(e) => setPreserveInstructions(e.target.value)}
                placeholder="e.g., brand logos, the person in the red shirt"
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-white"
            />
            <p className="mt-2 text-xs text-slate-500">
              Describe any people or objects to exclude from anonymization. All other faces are removed.
            </p>
        </div>
      </div>
      {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
    </div>
  );
};