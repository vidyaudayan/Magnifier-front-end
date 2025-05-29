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
  Menu, LogOut, Loader2,Wallet,
} from 'lucide-react';
import logo from "../../assets/Images/logonew.jpeg"
import { useDispatch } from 'react-redux';

import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'

const navItems = [
  { icon: Home, label: 'Home', path: '/livefeed' },
  { icon: User, label: 'Profile', path: '/livefeed/profile' },
  { icon: Search, label: 'Search', path: '/livefeed/search' },
  { icon: Bot, label: 'ElectoAI', path: '/livefeed/electoai' },
  { icon: Bell, label: 'Notifications', path: '/livefeed/notifications' },
  { icon: Settings, label: 'Settings', path: '/livefeed/settings' },
  { icon: Wallet, label: 'Wallet', path: '/livefeed/wallet' },
];

const Sidebar = ({ isCollapsed, onToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
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
        toast.success("You are logged out.");
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
        toast.error("Logout failed. Please try again.");
      } finally {
        setIsLoggingOut(false);
      }
    }
  };
  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block ${isCollapsed ? 'w-16' : 'w-64'
          } bg-white dark:bg-gray-800 h-screen fixed left-0 transition-all duration-300 ease-in-out shadow-lg`}
      >
        <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
          <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
           <img src={logo} className="h-10 w-10 " alt="" />
           
            {!isCollapsed && (
              <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
                 Magnifier
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

        <nav className="mt-6 flex-1">
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

        {/* Logout Button - Desktop */}
        <div className="p-4  border-t dark:border-gray-700">
          <button
            onClick={handleLogout} disabled={isLoggingOut}
            className={`flex ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''} items-center w-full mt-56  py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${isCollapsed ? 'justify-center' : ''
              }`}
          >
           
            {isLoggingOut ? (
              <Loader2 className="h-5 w-5" />
            ) : (
              <>
                <LogOut className={`h-5 w-5 ml-2 ${isCollapsed ? '' : 'mr-4'}`} />
                {!isCollapsed && <span>Logout</span>}
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
               Magnifier
            </span>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
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

          {/* Logout Button - Mobile */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center p-2 rounded-lg text-red-600 dark:text-red-400"
          >
            <LogOut className="h-6 w-6" />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;