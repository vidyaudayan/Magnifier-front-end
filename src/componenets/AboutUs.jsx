


import React from "react";
import image1 from "../assets/Images/about1.avif"
import card1 from "../assets/Images/card1.4.jpg"
import card2 from "../assets/Images/card4.avif"
import card3 from "../assets/Images/card3.2.png"
import Navbar from "../componenets/Navbar";
const AboutUsPage = () => {
  return (
    <div className="bg-gray-100 text-gray-800">
       <Navbar />
      {/* Introduction Section */}
      <div className="container mt-10 lg:mt-20 mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center gap-8 bg-blue-50 shadow-lg rounded-lg p-6">
          {/* Left Side Image */}
          <div className="md:w-1/2">
            <img
              src={image1} // Replace with actual image URL
              alt="Magnifier Introduction"
              className="rounded-lg shadow-lg object-cover w-full h-full"
            />
          </div>
          {/* Right Side Text */}
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              About Magnifier
            </h1>
            <p className="text-lg mb-4 leading-relaxed">
              Magnifier is a groundbreaking initiative designed to reshape
              political engagement by transforming everyday discussions into
              actionable insights and tangible change. Our platform is built to
              give a voice to grassroots political debates, making them heard,
              structured, and impactful.
            </p>
            <p className="text-lg leading-relaxed">
              Magnifier is more than just a platform – it’s a movement to
              redefine political discourse and amplify grassroots voices like
              never before.
            </p>
          </div>
        </div>
      </div>

      {/* Ecosystem Section */}
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">
          Our Magnifier Ecosystem
        </h2>
        <p className="text-lg mb-10">
          Magnifier is built around 3 unique platforms, each designed to empower
          users, engage communities, and enlighten political entities.
        </p>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Web Magnifier */}
          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
          <h3 className="text-lg font-semibold text-blue-500 mb-4">
             1. Web Magnifier – Your Voice, Amplified
            </h3>
            <img
              src={card1} 
              alt="Web Magnifier"
              className="rounded-lg mb-4 h-72 w-full"
            />
            
            <p className="text-gray-700 mb-4">
              A dedicated space for political enthusiasts to share opinions,
              spark discussions, and engage in meaningful debates.
            </p>
            <ul className="list-disc  pl-8 text-left text-gray-600">
              <li>
                Post and Discuss – Share views and engage in respectful
                dialogue.
              </li>
              <li>No Hate, Just Debate – Verified posts ensure compliance.</li>
              <li>
                Earn and Engage – Monetize posts through reactions and
                engagement.
              </li>
            </ul>
          </div>

          {/* Voter Magnifier */}
          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
          <h3 className="text-lg font-semibold text-blue-500 mb-4">
             2. Voter Magnifier – Empowering Political Strategy
            </h3>
            <img
              src={card2}
              alt="Voter Magnifier"
              className="rounded-lg mb-4 h-72 w-full"
            />
            
            <p className="text-gray-700 mb-4">
              Designed for political entities and strategists, Voter Magnifier
              provides booth-wise voter insights and analytics.
            </p>
            <ul className="list-disc  pl-8 text-left text-gray-600">
              <li>Data-Driven Decisions – Smarter, targeted campaigns.</li>
              <li>Know the Key Voters – Analyze key voter groups.</li>
             
            </ul>
          </div>

          {/* Media Magnifier */}
          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
          <h3 className="text-lg font-semibold text-blue-500 mb-4">
           3. Media Magnifier – Insight at Your Fingertips
            </h3>
            <img
              src={card3} 
              alt="Media Magnifier"
              className="rounded-lg mb-4 h-72 w-full"
            />
            
            <p className="text-gray-700 mb-4">
              A subscription-based platform delivering exclusive voter insights
              to political analysts, media houses, and organizations.
            </p>
            <ul className="list-disc  pl-8 text-left text-gray-600">
              <li >Unparalleled Access – Detailed voter analytics.</li>
              <li>On Demand – Subscriptions available via Contact Us.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Closing Section */}
      <div className="text-center bg-blue-600 text-white py-10">
        <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
        <p className="text-lg">
          Magnifier is where conversations spark change and voices drive the
          future. Join us and be part of the next wave of political evolution.
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;


