import React from 'react';
import { Users, MapPin, Flag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';


const FeedHeader = ({ activeTab, onTabChange }) => {
const { t } = useLanguage();

  const tabs = [
    { id: 'personalized', label:t('forYou'), icon: Users },
    { id: 'local', label:  t('localPolitics'), icon: MapPin },
    { id: 'national', label:  t('national'), icon: Flag },
  ];
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