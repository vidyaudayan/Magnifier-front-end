import React from 'react';
import { NavLink } from 'react-router-dom';
import { clearUserDetails } from '../../features/user/userSlice';
import {
  Home,
  User,
  Search,
  Bot,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Microscope,
  Menu, 
  LogOut, 
  Loader2,
  Wallet,
  X
} from 'lucide-react';
import logo from "../../assets/Images/logonew.jpeg"
import { useDispatch } from 'react-redux';

import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'
import { useLanguage } from '../../context/LanguageContext.jsx'

const Sidebar = ({ isCollapsed, onToggle }) => {

  

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const navItems = [
    { icon: Home, label: t('home'), path: '/livefeed' },
    { icon: User, label: t('profile'), path: '/livefeed/profile' },
    { icon: Search, label: t('search'), path: '/livefeed/search' },
    { icon: Bot, label: t('electoAI'), path: '/livefeed/electoai' },
    { icon: Bell, label: t('notifications'), path: '/livefeed/notifications' },
    { icon: Wallet, label: t('wallet'), path: '/livefeed/wallet' },
    { icon: Settings, label: t('settings'), path: '/livefeed/settings' },
  ];

  const handleLogout = async () => {
 if (window.confirm(t('confirmLogout'))){
      setIsLoggingOut(true);
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/logout`,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        localStorage.removeItem("token");
        dispatch(clearUserDetails());
        toast.success(t('logoutSuccess'));
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
      toast.error(t('logoutFailed'));
      } finally {
        setIsLoggingOut(false);
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block ${isCollapsed ? 'w-16' : 'w-64'
          } bg-white dark:bg-gray-800 h-screen fixed left-0 transition-all z-40 duration-300 ease-in-out shadow-lg`}
      >
        <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
          <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <img src={logo} className="h-10 w-10 " alt="" />
           
            {!isCollapsed && (
              <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
               {t('appName')}
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            className={`p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isCollapsed ? 'absolute right-0 transform translate-x-full bg-white dark:bg-gray-800 shadow-md' : ''
              }`}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>

        <nav className="mt-6  flex-1">
          {navItems.map((item) => (
            <NavLink
              end
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 ${isActive
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }hover:bg-gray-50 dark:hover:bg-gray-700`
              }
            >
              <item.icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-4'}`} />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button - Desktop Only */}
        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={handleLogout} 
            disabled={isLoggingOut}
            className={`flex ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''} items-center w-full mt-56 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${isCollapsed ? 'justify-center' : ''
              }`}
          >
            {isLoggingOut ? (
              <Loader2 className="h-5 w-5" />
            ) : (
              <>
                <LogOut className={`h-5 w-5 ml-2 ${isCollapsed ? '' : 'mr-4'}`} />
                {!isCollapsed && <span>{t('logout')}</span>}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50">
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <img src={logo} className="h-10 w-10 " alt="" />
            <span className="text-lg font-bold text-gray-800 dark:text-white">
            {t('appName')}
            </span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
        <div className="flex justify-around overflow-x-auto hide-scrollbar py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          {navItems.map((item) => (
            <NavLink
              end
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `p-2 rounded-full ${isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300'
                }`
              }
            >
              <item.icon className="h-6 w-6" />
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu (for logout) */}
        {isMobileMenuOpen && (
          <div className="absolute right-4 top-16 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 w-48 border dark:border-gray-700 z-50">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`flex items-center w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoggingOut ? (
                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
              ) : (
                <LogOut className="h-5 w-5 mr-3" />
              )}
              <span>{t('logout')}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;