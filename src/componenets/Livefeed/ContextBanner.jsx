import React from 'react';
import { AlertCircle } from 'lucide-react';

const ContextBanner = ({ type, message, link }) => {
  const getBannerStyles = () => {
    switch (type) {
      case 'election':
        return 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300';
      case 'live':
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
      case 'ai':
        return 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
    }
  };

  return (
    <div className={`rounded-xl p-2 md:p-4 mb-2 md:mb-4 flex items-center space-x-2 md:space-x-3 ${getBannerStyles()}`}>
      <AlertCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm md:text-base font-medium">{message}</p>
      </div>
      {link && (
        <a
          href={link}
          className="text-xs md:text-sm font-medium hover:underline whitespace-nowrap"
        >
          Learn More →
        </a>
      )}
    </div>
  );
};

export default ContextBanner;