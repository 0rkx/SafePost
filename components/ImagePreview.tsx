import React, { useState } from 'react';
import { ArrowLeftIcon, SparklesIcon } from './Icons';

interface ImagePreviewProps {
  imageUrl: string;
  preserveElements: string;
  onProcess: (finalPreserveElements: string) => void;
  onCancel: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  preserveElements,
  onProcess,
  onCancel,
}) => {
  const [currentInstructions, setCurrentInstructions] = useState(preserveElements);
  const [imageAspectRatio, setImageAspectRatio] = useState<string>('16 / 9');

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalHeight > 0) {
      setImageAspectRatio(`${naturalWidth} / ${naturalHeight}`);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-sm w-full">
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 md:gap-12">
            <div className="w-full lg:w-3/5 flex-shrink-0">
                <div 
                  className="bg-gray-100 p-2 rounded-xl border border-slate-200 w-full flex items-center justify-center overflow-hidden"
                  style={{ aspectRatio: imageAspectRatio }}
                >
                    <img
                    src={imageUrl}
                    alt="Image preview"
                    className="rounded-lg w-full h-full object-contain"
                    onLoad={handleImageLoad}
                    />
                </div>
            </div>

            <div className="w-full lg:w-2/5 lg:max-w-md space-y-6 pt-2">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">Ready to Process</h2>
                  <p className="mt-2 text-slate-600">
                      Confirm or edit your instructions below. The AI will then remove all other faces and sensitive information.
                  </p>
                </div>

                <div>
                    <label htmlFor="preserve-instructions-preview" className="block text-sm font-medium text-slate-700">
                        Things to keep visible
                    </label>
                    <textarea
                        id="preserve-instructions-preview"
                        rows={3}
                        value={currentInstructions}
                        onChange={(e) => setCurrentInstructions(e.target.value)}
                        placeholder="e.g., brand logos, the person in the red shirt"
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-white"
                    />
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
                 <button
                    onClick={onCancel}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-colors"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Back
                </button>
                <button
                    onClick={() => onProcess(currentInstructions)}
                    className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
                >
                    <SparklesIcon className="h-5 w-5" />
                    Make Safe
                </button>
                </div>
            </div>
        </div>
    </div>
  );
};