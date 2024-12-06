import React from 'react'

function Header() {
  return (
    <div>
          <nav className="w-full bg-blue-600 py-4 fixed top-0 left-0 shadow-lg z-50">
        <ul className="flex justify-around text-sm md:text-lg uppercase">
          <li className="hover:text-gray-300 transition duration-300 cursor-pointer">Home</li>
          <li className="hover:text-gray-300 transition duration-300 cursor-pointer">About Us</li>
          <li className="hover:text-gray-300 transition duration-300 cursor-pointer">Magnifier Dashboard</li>
          <li className="hover:text-gray-300 transition duration-300 cursor-pointer">Contact Us</li>
          <li className="hover:text-gray-300 transition duration-300 cursor-pointer">Support</li>
        </ul>
      </nav>
    </div>
  )
}

export default Header