import React from 'react';
import { AlertTriangleIcon, RefreshCwIcon, ArrowLeftIcon } from './Icons';

interface ErrorDisplayProps {
  message: string;
  onReset: () => void;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onReset, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
      <div className="bg-white border border-red-200/80 p-8 rounded-2xl max-w-lg w-full shadow-sm">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-red-100/70 rounded-full">
            <AlertTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Oops, Something Went Wrong</h2>
          <p className="text-slate-600 text-base">
            {message}
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105"
        >
          <RefreshCwIcon className="h-5 w-5" />
          Retry
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Start Over
        </button>
      </div>
    </div>
  );
};