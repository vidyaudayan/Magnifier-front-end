{/*import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Settings, Lock, HelpCircle, Shield, Trash2,UserRoundCog } from "lucide-react";

const SettingsPage = () => {
    const [showGeneralOptions, setShowGeneralOptions] = useState(false);
    const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('');
    const [isMessageVisible, setIsMessageVisible] = useState(true); 

        
    const handleDeactivate = async () => {
        setIsSecondModalOpen(false);
        try {
            const token = localStorage.getItem('token');
            console.log("deact", token)
            if (!token) {
              setMessage('Authentication token not found.');
              setMessageType('error');
              setIsMessageVisible(true);
              return;
            }
        
            const headers = { Authorization: `Bearer ${token}` };
            
            const response = await axios.patch(
              `${import.meta.env.VITE_BASE_URL}/user/deactivateaccount`,
              {}, // Payload if required
              { headers, withCredentials: true }
            );
console.log("deact", response)
            if (response.status === 200) {
              setMessageType('success');
              setMessage(
                'Your account deactivation is under review. Your account will be automatically deleted after 30 days. Until then, you can still access your account. If you wish to keep your account, please submit a request to prevent its deletion through the "Contact Us" section.'
              );
              setIsSecondModalOpen(false);
            } else {
              setMessageType('error');
              setMessage('Unexpected response from the server.');
            }
          } catch (error) {
            if (error.response&& error.response.data) {
              // Handle server errors
              setMessage(`Error: ${error.response.data.message}`);
            } else {
              setMessage(`Error: ${error.message}`);
            }
            setMessageType('unknown network error');
          }
          //setIsMessageVisible(true);
    };
  
  return (
    <>
   
    <div className="max-w-4xl mx-auto mt-16  sm:p-8 md:p-10 lg:p-4 bg-slate-200 ">
      <h1 className="text-xl font-bold mb-6 text-center ">Settings</h1>
      <div className="p-4 space-y-6">
      
        <div className="space-y-2">
          <button
            onClick={() => setShowGeneralOptions(!showGeneralOptions)}
            className="flex items-center gap-3 p-3 w-full text-left hover:bg-gray-100 rounded-lg"
          >
            <Settings className="w-5 h-5" />
            <span>General Settings</span>
          </button>
          {showGeneralOptions && (
            <Link to="/forgot-password" className="flex items-center gap-3 pl-10 p-3 hover:bg-gray-100 rounded-lg">
              <Lock className="w-5 h-5" />
              <span>Change Password</span>
            </Link>
          )}
        </div>

      
        <Link to="/faq" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
          <HelpCircle className="w-5 h-5" />
          <span>FAQ</span>
        </Link>

      
        <Link to="/termsandconditions" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
          <Shield className="w-5 h-5" />
          <span>Privacy Policy</span>
        </Link>

       
        <Link to="/userguidelines" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
          <UserRoundCog className="w-5 h-5" />
          <span>User Guidelines</span>
        </Link>

       
        <div className="flex items-center gap-3 p-3 text-red-600 hover:bg-gray-100 rounded-lg">
          <Trash2 className="w-5 h-5" />
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => setIsFirstModalOpen(true)}
          >
            Delete Account
          </button>
        </div>

      
        {isFirstModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg relative w-full max-w-md mx-4">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsFirstModalOpen(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">Confirm Deactivation</h2>
              <p className="mb-4">Are you sure you want to delete your account?</p>
              <div className="flex justify-end">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                  onClick={() => setIsFirstModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setIsFirstModalOpen(false);
                    setIsSecondModalOpen(true);
                  }}
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        )}

   
        {isSecondModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg relative w-full max-w-md mx-4">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsSecondModalOpen(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">Deactivation Under Review</h2>
              <p className="mb-4">
                Your account deactivation is under review. Your account will be automatically deleted after 30 days.
                Until then, you can still access your account. If you wish to keep your account, please submit a request
                to prevent its deletion through the "Contact Us" section.
              </p>
              <div className="flex justify-end">
                <button
                  className="bg-blue-500  cursor-pointer hover:bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={handleDeactivate}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}


        {message && isMessageVisible && (
          <div
            className={`mt-4 p-4 rounded relative ${
              messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsMessageVisible(false)}
            >
              &times;
            </button>
            {message}
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default */}


;




import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Settings as SettingsIcon,
  HelpCircle,
  Shield,
  Users,
  Bell,
  Moon,
  Sun,
  Globe,
  Trash2,
  ChevronRight,
  Volume2,
  Eye,
  Lock,
  MessageCircle,
  UserRoundCog
} from 'lucide-react';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(true);

  const handleDeactivate = async () => {
    setIsSecondModalOpen(false);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication token not found.');
        setMessageType('error');
        setIsMessageVisible(true);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/user/deactivateaccount`,
        {},
        { headers, withCredentials: true }
      );

      if (response.status === 200) {
        setMessageType('success');
        setMessage(
          'Your account deactivation is under review. Your account will be automatically deleted after 30 days. Until then, you can still access your account. If you wish to keep your account, please submit a request to prevent its deletion through the "Contact Us" section.'
        );
        setIsSecondModalOpen(false);
      } else {
        setMessageType('error');
        setMessage('Unexpected response from the server.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage(`Error: ${error.message}`);
      }
      setMessageType('unknown network error');
    }
  };

  const sections = [
    {
      title: 'General Settings',
      icon: SettingsIcon,
      items: [
        {
          label: 'Dark Mode',
          icon: darkMode ? Moon : Sun,
          type: 'toggle',
          value: darkMode,
          onChange: setDarkMode,
        },
        {
          label: 'Language',
          icon: Globe,
          type: 'select',
          value: language,
          onChange: setLanguage,
          options: ['English', 'Hindi', 'Marathi', 'Bengali'],
        },
        {
          label: 'Notifications',
          icon: Bell,
          type: 'toggle',
          value: notifications,
          onChange: setNotifications,
        },
        {
          label: 'Change Password',
          icon: Lock,
          type: 'link',
          description: 'Update your account password',
          link: '/forgot-password'
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        {
          label: 'Profile Visibility',
          icon: Eye,
          type: 'link',
          description: 'Control who can see your profile',
        },
        {
          label: 'Account Security',
          icon: Lock,
          type: 'link',
          description: 'Password, 2FA, and login settings',
        },
        {
          label: 'Privacy Policy',
          icon: Shield,
          type: 'link',
          description: 'View our privacy policy',
          link: '/terms-condition'
        },
      ],
    },
    {
      title: 'Help & Support',
      icon: HelpCircle,
      items: [
        {
          label: 'FAQ',
          icon: MessageCircle,
          type: 'link',
          description: 'Frequently asked questions',
          link: '/faq'
        },
        {
          label: 'User Guidelines',
          icon: Users,
          type: 'link',
          description: 'Community rules and guidelines',
          link: '/user-guidelines'
        },
      ],
    },
  ];

  const renderSettingItem = (item) => {
    switch (item.type) {
      case 'toggle':
        return (
          <div className="flex items-center">
            <button
              onClick={() => item.onChange(!item.value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                item.value ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  item.value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        );

      case 'select':
        return (
          <select
            value={item.value}
            onChange={(e) => item.onChange(e.target.value)}
            className="bg-transparent text-gray-600 dark:text-gray-300 pr-8 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {item.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'link':
        return item.link ? (
          <Link to={item.link}>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

      {message && isMessageVisible && (
        <div
          className={`mb-6 p-4 rounded relative ${
            messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setIsMessageVisible(false)}
          >
            &times;
          </button>
          {message}
        </div>
      )}

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <section.icon className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    {item.icon && <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {renderSettingItem(item)}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Delete Account Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Trash2 className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="text-base font-medium text-red-600 dark:text-red-400">
                    Delete Account
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Permanently delete your account and all data
                  </p>
                </div>
              </div>
              <button 
                className="px-4 py-2 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                onClick={() => setIsFirstModalOpen(true)}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modals */}
      {isFirstModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative w-full max-w-md mx-4">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              onClick={() => setIsFirstModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Confirm Deactivation</h2>
            <p className="mb-4 dark:text-gray-300">Are you sure you want to delete your account?</p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded mr-2"
                onClick={() => setIsFirstModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setIsFirstModalOpen(false);
                  setIsSecondModalOpen(true);
                }}
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {isSecondModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative w-full max-w-md mx-4">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              onClick={() => setIsSecondModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Deactivation Under Review</h2>
            <p className="mb-4 dark:text-gray-300">
              Your account deactivation is under review. Your account will be automatically deleted after 30 days.
              Until then, you can still access your account. If you wish to keep your account, please submit a request
              to prevent its deletion through the "Contact Us" section.
            </p>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleDeactivate}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
