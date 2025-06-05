import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FileText, MessageSquare, ThumbsUp, ThumbsDown, Eye, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';

export const HorizontalStats = ({ posts, user }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const statsRef = useRef(null);
  const rechargedPoints = useSelector((state) => state.user.rechargedPoints);
  const earnedPoints = useSelector((state) => state.user.earnedPoints);

  const stats = [
    {
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />,
      label: "Posts",
      value: posts.length
    },
    {
      icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />,
      label: "Comments",
      value: posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)
    },
    {
      icon: <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />,
      label: "Likes",
      value: posts.reduce((sum, post) => sum + (post.likes || 0), 0)
    },
    {
      icon: <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />,
      label: "Dislikes",
      value: posts.reduce((sum, post) => sum + (post.dislikes || 0), 0)
    },
    {
      icon: <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />,
      label: "Impressions",
      value: posts.reduce((sum, post) => sum + (post.impressions || 0), 0)
    },
    {
      icon: <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />,
      label: "Wallet",
      value: rechargedPoints + earnedPoints
    }
  ];

  const handleScroll = (direction) => {
    const container = statsRef.current;
    if (!container) return;

    // Calculate scroll amount based on screen width
    const cardWidth = window.innerWidth < 640 ? 120 : window.innerWidth < 1423 ? 150 : 160;
    const scrollAmount = cardWidth + (window.innerWidth < 640 ? 12 : 16); // Card width + gap

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    setScrollPosition(container.scrollLeft);
  };

  // Update scroll position on scroll and resize
  useEffect(() => {
    const container = statsRef.current;
    if (!container) return;

    const updateScrollPosition = () => {
      setScrollPosition(container.scrollLeft);
    };

    // Add scroll and resize listeners only for horizontal scrolling (desktop)
    if (window.innerWidth >= 1423) {
      container.addEventListener('scroll', updateScrollPosition);
      window.addEventListener('resize', updateScrollPosition);
      updateScrollPosition();
    }

    return () => {
      container.removeEventListener('scroll', updateScrollPosition);
      window.removeEventListener('resize', updateScrollPosition);
    };
  }, []);

  // Check if scrolling is possible (only for desktop)
  const canScrollLeft = window.innerWidth >= 1423 && scrollPosition > 0;
  const canScrollRight = window.innerWidth >= 1423 && statsRef.current
    ? scrollPosition < statsRef.current.scrollWidth - statsRef.current.clientWidth - 1
    : false;

  return (
    <div className="relative w-full mx-auto my-4 sm:my-6 px-4 sm:px-6 custom:px-8">
      {/* Left arrow (visible only on desktop) */}
      {canScrollLeft && (
        <button
          onClick={() => handleScroll('left')}
          className="hidden custom:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      )}

      {/* Stats container */}
      <div
        ref={statsRef}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 custom:grid-cols-none custom:flex custom:gap-4 custom:overflow-x-auto custom:scroll-smooth custom:py-2 custom:no-scrollbar"
        style={{ scrollSnapType: window.innerWidth >= 1423 ? 'x mandatory' : 'none' }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full sm:w-[150px] custom:w-[160px] bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 custom:snap-start"
          >
            <div className="flex items-center justify-between">
              {stat.icon}
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
            </div>
            <p className="mt-1 sm:mt-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Right arrow (visible only on desktop) */}
      {canScrollRight && (
        <button
          onClick={() => handleScroll('right')}
          className="hidden custom:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      )}
    </div>
  );
};