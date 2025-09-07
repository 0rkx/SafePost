import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center text-sm text-gray-500 space-y-2">
        <p>Secure photo processing powered by Google Gemini.</p>
        <p className="text-xs text-gray-400">
          made by <a href="https://orkx.xyz" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">owais</a>
        </p>
      </div>
    </footer>
  );
};