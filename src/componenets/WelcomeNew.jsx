import React from "react";
import delhiMap from '../assets/Images/delhi.jpg';
import biharMap from '../assets/Images/bihar.jpg';
import bengalMap from '../assets/Images/westbengal.jpg';
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Marquee from "./Marquee";
import NavbarWelcome from "./NavbarWelcome";
import Testimonials from "./Testmonials";
import ImageCarousel from "./ImageCarousel";
const WelcomeNew = () => {
  return (
    <div className="h-80  bg-[url('./assets/Images/background7.avif')] bg-cover  bg-center  text-white">
      {/* Navbar */}
    
      <NavbarWelcome/>

      {/* Content */}
      <div className="flex flex-col items-center justify-center pt-24  text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold">Welcome to Magnifier</h1>
        <h2 className="text-3xl md:text-5xl ">
        मैग्निफायर में आपका स्वागत है</h2>
        <h2 className="text-3xl md:text-5xl ">ম্যাগনিফায়ারে স্বাগতম
        </h2>
        
      </div>
     
      <div className="flex flex-col items-center justify-center pt-16 lg:pt-5 text-center ">
      
      
      <p className="text-xl md:text-xl font-bold pt-10 text-black">
        अपने राज्य पर क्लिक करें 
        </p>
      </div>

      {/* State Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 px-6">
        {[
          { name: "Delhi", image: delhiMap ,title: "delhi"},
          { name: "Bihar", image: biharMap },
          { name: "West Bengal", image: bengalMap },
        ].map((state, index) => (
          < button
            key={index}
            className="relative mb-10 flex flex-col items-center bg-[url('./assets/Images/background2.webp')] bg-cover bg-center  p-4 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
            aria-label={`Select ${state.name}`}
          >
            <span className="text-xl font-semibold absolute top-2 text-white bg-opacity-70 px-2 rounded">
              {state.name}
            </span>
            <Link to={`/signup/${state.name.toLowerCase()}`}>
            < img 
              src={state.image}
              alt={state.name}
              className="rounded-lg h-48 w-96 object-cover mt-6"
            />
            </Link>

          </button>
        ))}
      </div>
     
     
      <Footer/>
    </div>
  );
};

export default WelcomeNew;
