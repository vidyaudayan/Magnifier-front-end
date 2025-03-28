import React from "react";

const testimonialsData = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Delhi, India",
    feedback: "Magnifier made my travel experience seamless and memorable. Highly recommended!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    name: "Amit Verma",
    location: "Bihar, India",
    feedback: "Fantastic service! The recommendations were spot on. Will use again.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 3,
    name: "Ananya Roy",
    location: "West Bengal, India",
    feedback: "Such a user-friendly platform. Made my vacation planning super easy.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/3.jpg"
  }
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <span key={index} className={`text-xl ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      ))}
    </div>
  );
};

const Testimonials = () => {
  return (
    <div className="bg-white py-2 mb-4">
      <h2 className="text-xl font-bold text-center text-black mb-12">What Our Users Say</h2>
      
      <div className="grid grid-cols-1   md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-20">
        {testimonialsData.map(({ id, name, location, feedback, rating, image }) => (
          <div key={id} className="bg-pink-600 border-2 border-blue-800 shadow-lg rounded-lg p-6 hover:shadow-3xl hover:cursor-pointer hover:border-4 transition-transform duration-300">
            <div className="flex items-center mb-4">
              <img
                src={image}
                alt={name}
                className="w-16 h-16 rounded-full border-2 border-blue-400"
              />
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-blue-700">{name}</h3>
                <p className="text-white">{location}</p>
              </div>
            </div>
            <p className="text-white mb-4">"{feedback}"</p>
            <StarRating rating={rating} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
