import React from 'react';
import { LogoIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-medium tracking-tight text-gray-800">
              SafePost
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};