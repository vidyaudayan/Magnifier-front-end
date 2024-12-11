import React from 'react';
import image from '../assets/Images/about.avif'
function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      {/* Main Container */}
      <div className="text-center p-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-700">
          No Contents Available
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-500">
          Sorry, there's nothing to display here right now. Please check back later!
        </p>

        {/* Navigation Button */}
        <button
          onClick={() => (window.location.href = '/')}
          className="mt-8 px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Home
        </button>
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

export default AboutUsPage;
