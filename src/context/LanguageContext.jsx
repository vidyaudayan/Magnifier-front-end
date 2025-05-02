import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  english: {
    // Common
    appName: 'Web Magnifier',
    home: 'Home',
    profile: 'Profile',
    search: 'Search',
    electoAI: 'ElectoAI',
    notifications: 'Notifications',
    settings: 'Settings',
    
    // Home
    forYou: 'For You',
    localPolitics: 'Local Politics',
    national: 'National',
    post: 'Post',
    whatOnMind: "What's on your political mind?",
    everyone: 'Everyone',
    
    // Settings
    generalSettings: 'General Settings',
    darkMode: 'Dark Mode',
    language: 'Language',
    privacySecurity: 'Privacy & Security',
    profileVisibility: 'Profile Visibility',
    profileVisibilityDesc: 'Control who can see your profile',
    accountSecurity: 'Account Security',
    accountSecurityDesc: 'Password, 2FA, and login settings',
    soundSettings: 'Sound Settings',
    soundSettingsDesc: 'Manage notification sounds',
    helpSupport: 'Help & Support',
    faq: 'FAQ',
    faqDesc: 'Frequently asked questions',
    userGuidelines: 'User Guidelines',
    userGuidelinesDesc: 'Community rules and guidelines',
    deleteAccount: 'Delete Account',
    deleteAccountDesc: 'Permanently delete your account and all data',
  },
  hindi: {
    // Common
    appName: 'वेब मैग्निफायर',
    home: 'होम',
    profile: 'प्रोफाइल',
    search: 'खोज',
    electoAI: 'इलेक्टो एआई',
    notifications: 'सूचनाएं',
    settings: 'सेटिंग्स',
    
    // Home
    forYou: 'आपके लिए',
    localPolitics: 'स्थानीय राजनीति',
    national: 'राष्ट्रीय',
    post: 'पोस्ट',
    whatOnMind: "आपके मन में क्या चल रहा है?",
    everyone: 'सभी के लिए',
    
    // Settings
    generalSettings: 'सामान्य सेटिंग्स',
    darkMode: 'डार्क मोड',
    language: 'भाषा',
    privacySecurity: 'गोपनीयता और सुरक्षा',
    profileVisibility: 'प्रोफ़ाइल दृश्यता',
    profileVisibilityDesc: 'कौन आपकी प्रोफ़ाइल देख सकता है, इसे नियंत्रित करें',
    accountSecurity: 'खाता सुरक्षा',
    accountSecurityDesc: 'पासवर्ड, 2FA, और लॉगिन सेटिंग्स',
    soundSettings: 'ध्वनि सेटिंग्स',
    soundSettingsDesc: 'सूचना ध्वनियों को प्रबंधित करें',
    helpSupport: 'सहायता और समर्थन',
    faq: 'सामान्य प्रश्न',
    faqDesc: 'अक्सर पूछे जाने वाले प्रश्न',
    userGuidelines: 'उपयोगकर्ता दिशानिर्देश',
    userGuidelinesDesc: 'सामुदायिक नियम और दिशानिर्देश',
    deleteAccount: 'खाता हटाएं',
    deleteAccountDesc: 'अपना खाता और सभी डेटा स्थायी रूप से हटाएं',
  },
  marathi: {
    // Common
    appName: 'वेब मॅग्निफायर',
    home: 'होम',
    profile: 'प्रोफाइल',
    search: 'शोध',
    electoAI: 'इलेक्टो एआय',
    notifications: 'सूचना',
    settings: 'सेटिंग्ज',
    
    // Home
    forYou: 'तुमच्यासाठी',
    localPolitics: 'स्थानिक राजकारण',
    national: 'राष्ट्रीय',
    post: 'पोस्ट',
    whatOnMind: "तुमच्या मनात राजकीय काय चालले आहे?",
    everyone: 'प्रत्येकासाठी',
    
    // Settings
    generalSettings: 'सामान्य सेटिंग्ज',
    darkMode: 'डार्क मोड',
    language: 'भाषा',
    privacySecurity: 'गोपनीयता आणि सुरक्षा',
    profileVisibility: 'प्रोफाइल दृश्यता',
    profileVisibilityDesc: 'तुमची प्रोफाइल कोण पाहू शकतो यावर नियंत्रण ठेवा',
    accountSecurity: 'खाते सुरक्षा',
    accountSecurityDesc: 'पासवर्ड, 2FA, आणि लॉगिन सेटिंग्ज',
    soundSettings: 'ध्वनी सेटिंग्ज',
    soundSettingsDesc: 'सूचना ध्वनी व्यवस्थापित करा',
    helpSupport: 'मदत आणि समर्थन',
    faq: 'सामान्य प्रश्न',
    faqDesc: 'वारंवार विचारले जाणारे प्रश्न',
    userGuidelines: 'वापरकर्ता मार्गदर्शक तत्त्वे',
    userGuidelinesDesc: 'समुदाय नियम आणि मार्गदर्शक तत्त्वे',
    deleteAccount: 'खाते हटवा',
    deleteAccountDesc: 'तुमचे खाते आणि सर्व डेटा कायमस्वरूपी हटवा'
  },
  bengali: {
    // Common
    appName: 'ওয়েব ম্যাগনিফায়ার',
    home: 'হোম',
    profile: 'প্রোফাইল',
    search: 'খুঁজুন',
    electoAI: 'ইলেক্টোএআই',
    notifications: 'বিজ্ঞপ্তি',
    settings: 'সেটিংস',
    
    // Home
    forYou: 'আপনার জন্য',
    localPolitics: 'স্থানীয় রাজনীতি',
    national: 'জাতীয়',
    post: 'পোস্ট',
    whatOnMind: "আপনার রাজনৈতিক চিন্তা কি?",
    everyone: 'সবার জন্য',
    
    // Settings
    generalSettings: 'সাধারণ সেটিংস',
    darkMode: 'ডার্ক মোড',
    language: 'ভাষা',
    privacySecurity: 'গোপনীয়তা ও নিরাপত্তা',
    profileVisibility: 'প্রোফাইল দৃশ্যমানতা',
    profileVisibilityDesc: 'কে আপনার প্রোফাইল দেখতে পারবে তা নিয়ন্ত্রণ করুন',
    accountSecurity: 'অ্যাকাউন্ট সুরক্ষা',
    accountSecurityDesc: 'পাসওয়ার্ড, 2FA এবং লগইন সেটিংস',
    soundSettings: 'সাউন্ড সেটিংস',
    soundSettingsDesc: 'বিজ্ঞপ্তির শব্দ ব্যবস্থাপনা',
    helpSupport: 'সাহায্য ও সমর্থন',
    faq: 'সচরাচর জিজ্ঞাস্য',
    faqDesc: 'প্রায়শই জিজ্ঞাসিত প্রশ্ন',
    userGuidelines: 'ব্যবহারকারী নির্দেশিকা',
    userGuidelinesDesc: 'কমিউনিটি নিয়ম ও নির্দেশিকা',
    deleteAccount: 'অ্যাকাউন্ট মুছুন',
    deleteAccountDesc: 'আপনার অ্যাকাউন্ট এবং সমস্ত ডেটা স্থায়ীভাবে মুছে ফেলুন'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'english';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || translations.english[key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};