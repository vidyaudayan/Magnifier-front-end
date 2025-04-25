import React from 'react';
import { Users, MapPin, Flag } from 'lucide-react';

const tabs = [
  { id: 'personalized', label: 'For You', icon: Users },
  { id: 'local', label: 'Local Politics', icon: MapPin },
  { id: 'national', label: 'National', icon: Flag },
];

const FeedHeader = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm">
      <div className="flex items-center p-1">
        <div className="flex flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1.5 px-2 md:px-4 py-2 rounded-lg md:rounded-xl transition-colors font-medium ${
                activeTab === tab.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-xs md:text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedHeader;