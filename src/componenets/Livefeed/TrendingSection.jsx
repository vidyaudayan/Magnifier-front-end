import React from 'react';
import { TrendingUp, ExternalLink } from 'lucide-react';

const trendingTopics = [
  { id: '1', topic: 'Election2024', posts: 145200, category: 'Politics' },
  { id: '2', topic: 'ClimateAction', posts: 89300, category: 'Environment' },
  { id: '3', topic: 'DigitalIndia', posts: 67800, category: 'Technology' },
  { id: '4', topic: 'FarmersProtest', posts: 45600, category: 'Agriculture' },
  { id: '5', topic: 'SmartCities', posts: 34200, category: 'Urban Development' },
];

const TrendingSection = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trending</h2>
        <TrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>

      <div className="space-y-4">
        {trendingTopics.map((topic) => (
          <div
            key={topic.id}
            className="group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 -mx-4 px-4 py-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {topic.category}
                </p>
                <p className="font-medium text-gray-900 dark:text-white mt-0.5">
                  #{topic.topic}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {topic.posts.toLocaleString()} posts
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
