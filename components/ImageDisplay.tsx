import React from 'react';
import { DownloadIcon, RefreshCwIcon } from './Icons';

interface ImageDisplayProps {
  originalUrl: string;
  safeUrl: string;
  onReset: () => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalUrl, safeUrl, onReset }) => {
  return (
    <div className="w-full py-4">
      <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Your Photo is Ready!</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
              Review your original and privacy-protected images below. When you're happy, download the safe version.
          </p>
      </div>
      
       <div className="w-full max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {/* Original Image */}
                <div>
                    <h3 className="text-center mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Before</h3>
                    <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                        <img 
                            src={originalUrl} 
                            alt="Original" 
                            className="w-full h-auto object-contain rounded-lg" 
                        />
                    </div>
                </div>

                {/* Safe Image */}
                <div>
                    <h3 className="text-center mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">Safe Version</h3>
                     <div className="bg-white p-2 rounded-xl border-2 border-blue-500 shadow-md">
                        <img 
                            src={safeUrl} 
                            alt="Safe" 
                            className="w-full h-auto object-contain rounded-lg"
                        />
                    </div>
                </div>
            </div>
       </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href={safeUrl}
          download="safe_image.png"
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105"
        >
          <DownloadIcon className="h-5 w-5" />
          Download Safe Photo
        </a>
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-colors"
        >
          <RefreshCwIcon className="h-5 w-5" />
          Process Another
        </button>
      </div>
    </div>
  );
};