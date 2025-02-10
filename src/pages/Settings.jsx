import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Settings, Lock, HelpCircle, Shield, Trash2,UserRoundCog } from "lucide-react";
import NavbarLanding from '../componenets/NavbarLanding';
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
   
    <div className="max-w-4xl mx-auto p-4 sm:p-8 md:p-12 lg:p-16 rounded-lg shadow-lg mt-10">
      <h1 className="text-4xl font-bold mb-6 text-center mt-10">Settings</h1>
      <div className="p-4 space-y-6">
        {/* General Settings */}
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

        {/* FAQ Link */}
        <Link to="/faq" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
          <HelpCircle className="w-5 h-5" />
          <span>FAQ</span>
        </Link>

        {/* Privacy Policy */}
        <Link to="/termsandconditions" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
          <Shield className="w-5 h-5" />
          <span>Privacy Policy</span>
        </Link>

        {/* User Guidelines */}
        <Link to="/userguidelines" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
          <UserRoundCog className="w-5 h-5" />
          <span>User Guidelines</span>
        </Link>

        {/* Delete Account Section */}
        <div className="flex items-center gap-3 p-3 text-red-600 hover:bg-gray-100 rounded-lg">
          <Trash2 className="w-5 h-5" />
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => setIsFirstModalOpen(true)}
          >
            Delete Account
          </button>
        </div>

        {/* Modal for Deactivation Confirmation */}
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

        {/* Deactivation Under Review Modal */}
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

        {/* Success or Error Message */}
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

export default SettingsPage
