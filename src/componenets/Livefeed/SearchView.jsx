import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Users, FileText, Hash, Newspaper, X, TrendingUp } from 'lucide-react';

const mockResults = [
  {
    id: '1',
    type: 'post',
    title: 'Agricultural Reforms Discussion',
    description: 'Today, I met with farmers in Punjab to discuss the agricultural reforms...',
    image: 'https://images.pexels.com/photos/2612911/pexels-photo-2612911.jpeg?auto=compress&cs=tinysrgb&w=150',
    metadata: {
      timestamp: '2 hours ago',
      likes: 1243
    }
  },
  {
    id: '2',
    type: 'user',
    title: 'Rahul Gandhi',
    description: '@RahulGandhi • Member of Parliament',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    metadata: {
      followers: 25000000
    }
  },
  {
    id: '3',
    type: 'topic',
    title: '#FarmersProtest',
    description: 'Trending with #AgricultureReforms',
    metadata: {
      posts: 45600,
      trending: true
    }
  }
];

const SearchView = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = activeFilter === 'all' 
        ? mockResults 
        : mockResults.filter(result => result.type === activeFilter);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [searchTerm, activeFilter]);

  if (!isOpen) return null;

  const filters = [
    { id: 'all', label: 'All', icon: SearchIcon },
    { id: 'post', label: 'Posts', icon: FileText },
    { id: 'user', label: 'People', icon: Users },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'topic', label: 'Topics', icon: Hash }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 ">
      <div className="absolute inset-x-0 top-0  bg-white shadow-lg max-h-[80vh] overflow-auto">
        <div className="container mx-auto max-w-4xl p-4 ">
          {/* Search Header */}
          <div className="flex items-center gap-3 mb-4 ">
            <div className="flex-1 relative ">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for posts, people, topics..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <filter.icon size={16} />
                {filter.label}
              </button>
            ))}
          </div>

          {/* Results */}
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map(result => (
                <div 
                  key={result.id}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  {result.image ? (
                    <img 
                      src={result.image} 
                      alt={result.title}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Hash size={20} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{result.title}</h3>
                      {result.metadata?.trending && (
                        <TrendingUp size={16} className="text-blue-500" />
                      )}
                    </div>
                    {result.description && (
                      <p className="text-sm text-gray-500 truncate">{result.description}</p>
                    )}
                    {result.metadata && (
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        {result.metadata.timestamp && <span>{result.metadata.timestamp}</span>}
                        {result.metadata.likes && <span>{result.metadata.likes.toLocaleString()} likes</span>}
                        {result.metadata.followers && <span>{result.metadata.followers.toLocaleString()} followers</span>}
                        {result.metadata.posts && <span>{result.metadata.posts.toLocaleString()} posts</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm.length > 0 ? (
            <div className="text-center py-8 text-gray-500">
              No results found for "{searchTerm}"
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Start typing to search...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchView;