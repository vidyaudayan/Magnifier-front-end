import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBell,
  FaUser,
  FaCog,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navItems = [
    { path: "/", icon: <FaHome />, label: "Home" },
    { path: "/notifications", icon: <FaBell />, label: "Notifications" },
    { path: "/profile", icon: <FaUser />, label: "Profile" },
    { path: "/settings", icon: <FaCog />, label: "Settings" },
    { path: "/search", icon: <FaSearch />, label: "Search" },
  ];

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed lg:hidden bottom-4 right-4 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg"
      >
        {isMobileSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-center p-4 mb-8">
            <h1 className="text-xl font-bold text-blue-600">Magnifier</h1>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile (Bottom) */}
          <div className="mt-auto p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                {metrics?.profilePicture ? (
                  <img
                    src={metrics.profilePicture}
                    alt="User"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">U</span>
                )}
              </div>
              <div>
                <p className="font-medium">{metrics?.userName || "User"}</p>
                <p className="text-xs text-gray-500">@{metrics?.userName || "username"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;