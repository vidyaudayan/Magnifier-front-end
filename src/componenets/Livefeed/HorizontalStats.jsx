import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { FileText,MessageSquare,ThumbsUp,ThumbsDown,Eye,Wallet,ChevronLeft, ChevronRight} from 'lucide-react';

export const HorizontalStats = ({ posts, user }) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const statsRef = useRef(null);
  
    const stats = [
      {
        icon: <FileText className="w-5 h-5 text-blue-500" />,
        label: "Posts",
        value: posts.length
      },
      {
        icon: <MessageSquare className="w-5 h-5 text-green-500" />,
        label: "Comments",
        value: posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)
      },
      {
        icon: <ThumbsUp className="w-5 h-5 text-blue-500" />,
        label: "Likes",
        value: posts.reduce((sum, post) => sum + (post.likes || 0), 0)
      },
      {
        icon: <ThumbsDown className="w-5 h-5 text-red-500" />,
        label: "Dislikes",
        value: posts.reduce((sum, post) => sum + (post.dislikes || 0), 0)
      },
      {
        icon: <Eye className="w-5 h-5 text-purple-500" />,
        label: "Impressions",
        value: posts.reduce((sum, post) => sum + (post.impressions || 0), 0)
      },
      {
        icon: <Wallet className="w-5 h-5 text-yellow-500" />,
        label: "Wallet",
        value: user?.walletAmount?.toLocaleString() || 0
      }
    ];
  
    const handleScroll = (direction) => {
      const container = statsRef.current;
      const scrollAmount = 200; // Adjust this value as needed
      
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
      
      setScrollPosition(container.scrollLeft);
    };
  
    return (
      <div className="relative mb-6 mt-6">
        {/* Left arrow - only show if not at start */}
        {scrollPosition > 0 && (
          <button 
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}
        
        {/* Stats container */}
        <div 
          ref={statsRef}
          className="flex space-x-4 overflow-x-auto scroll-smooth py-2 px-1 hide-scrollbar"
          onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
        >
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-32 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                {stat.icon}
                <span className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</span>
              </div>
              <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
        
        {/* Right arrow - only show if not at end */}
        {statsRef.current && 
          scrollPosition < statsRef.current.scrollWidth - statsRef.current.clientWidth && (
          <button 
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>
    );
  };