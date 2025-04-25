import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../../LivefeedPages/Home';
import ElectoAI from '../../LivefeedPages/ElectoAI';
import Notifications from '../../LivefeedPages/Notifications';
import Settings from '../../LivefeedPages/Settings';
import ProfileNew from '../../LivefeedPages/ProfileNew';
import SearchPage from '../../LivefeedPages/SearchPage';

const MainContent = ({ isSidebarCollapsed }) => {
  return (
    <main 
      className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
      }`}
    >
      <div className="min-h-screen pt-[120px] md:pt-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfileNew />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/electoai" element={<ElectoAI />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </main>
  );
}

export default MainContent;