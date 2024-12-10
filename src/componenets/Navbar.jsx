import React, { useState } from "react";
import logo from '../assets/Images/logo.png'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails } from "../features/user/userSlice";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.user); // Get user from Redux store
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/user/logout`,{}, {
        withCredentials: true
      }, {headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });
    

      localStorage.removeItem('token'); 
      dispatch(clearUserDetails()); 
      toast.success("You are logged out..")
      navigate('/'); 
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
    }

  }


  return (
    <header className="z-50 fixed top-0 w-full bg-blue-600 text-white shadow-lg">
      <nav className="container mx-auto flex items-center justify-between lg:px-32 px-4 py-3 md:py-4">
        {/* Logo and Name */}
        <div className="flex items-center space-x-2">
          <img
            src= {logo}
            alt="Logo"
            className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full"
          />
          <span className="text-3xl p-2 md:text-2xl font-bold font-mono">Magnifier</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center  lg:space-x-20">
          
{[
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Magnifier Dashboard", path: "/dashboard" },
    { name: "Contact Us", path: "/contact" },
    { name: "Support", path: "/support" },
  ].map((link, index) => (
    <Link
      key={index}
      to={link.path}
      className="text-sm md:text-base hover:text-yellow-300 transition-colors duration-300"
    >
      {link.name}
    </Link>
    
    ))}

    {/* Conditionally render Logout button */}
    {user && (
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-600 px-4 py-2 rounded-md text-white hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden ">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          <ul className="flex flex-col items-center space-y-4 py-4">
            {["Home", "About Us", "Magnifier Dashboard", "Contact Us", "Support"].map(
              (link, index) => (
                <li key={index}>
                  <Link
                    href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-sm md:text-base hover:text-yellow-300 transition-colors duration-300"
                  >
                    {link}
                  </Link>
                </li>
              )
            )}
             {/* Conditionally render Logout button */}
             {user && (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-2 rounded-md text-white hover:bg-red-700 transition duration-300"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
