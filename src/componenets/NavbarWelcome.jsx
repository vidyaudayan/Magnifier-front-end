import React, { useState,useEffect } from "react";
import logo from '../assets/Images/logo1.jpg';
import { Link,} from "react-router-dom";

function NavbarWelcome() {

    const [isOpen, setIsOpen] = useState(false);
    

     
  return (
    <>
    <header className="z-50 fixed dark:bg-gray-900 top-0 w-full bg-blue-600 text-white shadow-lg lg:h-20">
          <nav className="container mx-auto flex items-center justify-between px-4 md:px-6 lg:px-10 py-4">
            {/* Logo and Name */}
            <div className="flex items-center space-x-3">
              <img
                src={logo}
                alt="Logo"
                className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full"
              />
              <span className="text-2xl md:text-3xl  font-bold font-roboto">
                Magnifier
              </span>
            </div>
    
            {/* Desktop Menu */}
            <div className="hidden md:flex font-bold items-center space-x-6 lg:space-x-12">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/aboutus" },
                { name: "Magnifier Dashboard", path: "/dashboard" },
                { name: "Contact Us", path: "/contact" },
                { name: "Support", path: "/support" },
              ].map((link, index) => (
                 <Link
                              key={index}
                              to={link.path}
                              className="text-sm lg:text-base hover:text-red-400 hover:shadow-yellow-400 hover:shadow-md  hover:translate-y-[-3px] hover:scale-105 transition duration-300"
                            >
                              {link.name}
                            </Link>
                          ))}
                        
                           </div>

                            {/* Mobile Menu Toggle */}
        <div className="md:hidden">
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
                
              <div className="md:hidden bg-blue-700">
               
                <ul className="flex flex-col items-center space-y-4 py-4">
              
                  {[
             { name: "Home", path: "/" },
                    { name: "About Us", path: "/aboutus" },
                    { name: "Magnifier Dashboard", path: "/dashboard" },
                    { name: "Contact Us", path: "/contact" },
                    { name: "Support", path: "/support" },
                  ].map((link, index) => (
                    <li key={index} className="w-full text-center">
                      <Link
                        to={link.path}
                        className="block py-2 text-sm hover:text-yellow-300 transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                   </ul>
        </div>
      )}
    </header>
      
    </>
  )
}

export default NavbarWelcome