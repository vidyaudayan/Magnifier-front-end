
import React, { useState ,useEffect} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from '../componenets/Livefeed/Sidebar';
import MainContent from '../componenets/Livefeed/MainContent';

const Livefeed = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });
  
    useEffect(() => {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }, [isDarkMode]);
  
    return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
    <Sidebar 
      isCollapsed={isSidebarCollapsed} 
      onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
    />
    <MainContent isSidebarCollapsed={isSidebarCollapsed} />
  </div>

  )
}

export default Livefeed




