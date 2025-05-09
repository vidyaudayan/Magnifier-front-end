{/*import React, { useState } from 'react';
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

export default SettingsPage;*/}

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
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const { language, setLanguage, t } = useLanguage();
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const { isDarkMode, setIsDarkMode } = useTheme();
 
 
  const handleDeactivate = async () => {
    setIsDeactivating(true);
    setIsSecondModalOpen(false);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage(t('authTokenNotFound'));
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
        setMessage(t('accountDeactivationSuccess'));
        setIsSecondModalOpen(false);
        toast.success(t('accountDeactivationSuccess'));
      } else {
        setMessageType('error');
        setMessage(t('unexpectedServerResponse'));
        toast.error(t('unexpectedServerResponse'));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setMessage(`${t('error')}: ${errorMessage}`);
      setMessageType('error');
      toast.error(`${t('error')}: ${errorMessage}`);
    } finally {
      setIsDeactivating(false);
    }
  };

 const sections = [
    {
      title: t('generalSettings'),
      icon: SettingsIcon,
      items: [
        {
          label: t('darkMode'),
          icon: isDarkMode ? Moon : Sun,
          type: 'toggle',
          value: isDarkMode,
          onChange: setIsDarkMode,
          
        },
        {
          label: t('language'),
          icon: Globe,
          type: 'select',
          value: language,
          onChange: setLanguage,
         
          options: [
            { value: 'english', label: 'English' },
            { value: 'hindi', label: 'हिंदी' },
            { value: 'marathi', label: 'मराठी' },
            { value: 'bengali', label: 'বাংলা' }
          ],
        },
        {
          label: t('notifications'),
          icon: Bell,
          type: 'toggle',
          value: notifications,
          onChange: setNotifications,
        },
        {
          label: t('changePassword'),
          icon: Lock,
          type: 'link',
          description: t('changePasswordDesc'),
          link: '/forgot-password'
        },
      ],
    },
    {
      title: t('privacySecurity'),
      icon: Shield,
      items: [
        {
          label: t('profileVisibility'),
          icon: Eye,
          type: 'link',
          description: t('profileVisibilityDesc'),
        },
        {
          label: t('accountSecurity'),
          icon: Lock,
          type: 'link',
          description: t('accountSecurityDesc'),
        },
        {
          label: t('privacyPolicy'),
          icon: Shield,
          type: 'link',
          description: t('privacyPolicyDesc'),
          link: '/terms-condition'
        },
      ],
    },
    {
      title: t('helpSupport'),
      icon: HelpCircle,
      items: [
        {
          label: t('faq'),
          icon: MessageCircle,
          type: 'link',
          description: t('faqDesc'),
          link: '/faq'
        },
        {
          label: t('userGuidelines'),
          icon: Users,
          type: 'link',
          description: t('userGuidelinesDesc'),
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
              onClick={() => {
                if (typeof item.onChange === 'function') {
                  item.onChange(!item.value); // Safe function call
                }
              }}
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
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {item.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
      <h1 className=" text-3xl font-bold text-gray-900 dark:text-white mb-8"> {t('settings')} </h1>

      {message && isMessageVisible && (
        <div
          className={`mb-6 p-4 rounded relative ${
            messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
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
                    {t('deleteAccount')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {t('deleteAccountDesc')}
                  </p>
                </div>
              </div>
              <button 
                className={`px-4 py-2 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors ${
                  isDeactivating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => setIsFirstModalOpen(true)}
                disabled={isDeactivating}
              >
                {t('deleteAccount')}
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
            <h2 className="text-xl font-semibold mb-4 dark:text-white">{t('confirmDeactivation')}</h2>
            <p className="mb-4 dark:text-gray-300">{t('confirmDeactivationMessage')}</p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded mr-2"
                onClick={() => setIsFirstModalOpen(false)}
              >
                {t('cancel')}
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setIsFirstModalOpen(false);
                  setIsSecondModalOpen(true);
                }}
              >
                {t('deactivate')}
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
            <h2 className="text-xl font-semibold mb-4 dark:text-white">{t('deactivationUnderReview')}</h2>
            <p className="mb-4 dark:text-gray-300">
              {t('deactivationReviewMessage')}
            </p>
            <div className="flex justify-end">
              <button
                className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${
                  isDeactivating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleDeactivate}
                disabled={isDeactivating}
              >
                {isDeactivating ? t('processing') : t('ok')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
