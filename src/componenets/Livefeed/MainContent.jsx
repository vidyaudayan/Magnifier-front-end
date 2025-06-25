import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../../LivefeedPages/Home';
import ElectoAI from '../../LivefeedPages/ElectoAI';
import Notifications from '../../LivefeedPages/Notifications';
import Settings from '../../LivefeedPages/Settings';
import ProfileNew from '../../LivefeedPages/ProfileNew';
import SearchPage from '../../LivefeedPages/SearchPage';
import UsersProfilePage from '../../LivefeedPages/UsersProfilePage';
import SearchPostDisplayPage from '../../LivefeedPages/SearchPostDisplayPage';
import PricingPage from '../../LivefeedPages/PricingPage';
import Wallet from '../../LivefeedPages/Wallet';
import SharePostDisplayPage from '../../LivefeedPages/SharePostDisplayPage';



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
          <Route path="/userprofile/:userId" element={<UsersProfilePage/>} />
          <Route path="/profile" element={<ProfileNew />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/searchpost/:postId" element={<SearchPostDisplayPage/>}/>
          <Route path="/electoai" element={<ElectoAI />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/displaypost" element={<SharePostDisplayPage />} />
          <Route path="/wallet" element={<Wallet/>} />
        </Routes>
      </div>
    </main>
  );
}

export default MainContent;