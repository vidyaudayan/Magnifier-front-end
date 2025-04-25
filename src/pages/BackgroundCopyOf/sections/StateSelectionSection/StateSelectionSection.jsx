import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "../../../../componenets/Welcome/card";

const states = [
    {
      name: "Delhi",
      path: "delhi", // URL-friendly version
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      alt: "India Gate, Delhi"
    },
    {
      name: "Bihar", 
      path: "bihar",
      image: "https://cdn.britannica.com/12/94612-050-B4EEB84A/temple-Buddhist-Mahabodhi-Bihar-India-Bodh-Gaya.jpg",
      alt: "Cultural scene from Bihar"
    },
    {
      name: "West Bengal",
      path: "west-bengal", // Hyphen instead of space
      image: "https://images.unsplash.com/photo-1558431382-27e303142255",
      alt: "Victoria Memorial, Kolkata"
    }
  ];

export const StateSelectionSection = () => {
  const navigate = useNavigate();

  return (
    <section id="state-selection" className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-[#292929] [font-family:'Helvetica_Neue-Regular',Helvetica] tracking-[-1.38px] leading-[55.2px] font-normal mb-3">
            Sign up to explore
          </h2>
          <p className="text-lg text-[#636363] [font-family:'Helvetica_Neue-Regular',Helvetica] tracking-[-0.16px]">
            Select your state
          </p>
        </div>

        {/* State Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {states.map((state, index) => (
            <Card
              key={index}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              onClick={() => navigate(`/signup/${state.path}`)} 
            >
              <CardContent className="p-0">
                <div className="relative">
                  {/* Image */}
                  <div className="w-full h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={state.image}
                      alt={state.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* State Name and Arrow */}
                  <div className="flex items-center justify-between p-4">
                    <h3 className="text-xl text-[#292929] tracking-[-0.72px] leading-9">
                      {state.name}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-[#578cff] transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};