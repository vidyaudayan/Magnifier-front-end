import React from 'react';
import image from '../assets/Images/comingsoon1.avif'
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      {/* Main Container */}
      <Navbar/>
      <div className="text-center p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-700">
        Voter Magnifier and Media Magnifier Dashboard Coming Soon……….!

        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-500">
        
        </p>

        {/* Navigation Button */}
        <p className="text-xl">
        You can{" "}
        <Link to="/contact" className="text-blue-500 underline hover:text-blue-700">
          click here
        </Link>{" "}
        to submit your demand and get the first opportunity to subscribe.
      </p>
      </div>

      {/* Illustration */}
      <img
        src={image} // Replace this with an actual SVG/illustration URL
        alt="No Content"
        className="mt-12 max-w-full w-96"
      />
    </div>
  );
}

export default Dashboard;
