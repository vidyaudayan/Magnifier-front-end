
import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from '../componenets/Livefeed/Sidebar';
import MainContent from '../componenets/Livefeed/MainContent';

const Livefeed = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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




