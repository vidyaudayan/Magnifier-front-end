{/*import { ChevronRightIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../componenets/Welcome/button";
import { Card, CardContent } from "../../../../componenets/Welcome/card";
import { useNavigate } from 'react-router-dom';
export const DashboardSection = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/logindashboard');
  };
  return (
    <section id="services" className="w-full max-w-[1000px] mx-auto py-16">
      <div className="flex flex-col items-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="w-2 h-2 bg-[#578cff] rounded-full mr-4"></div>
          <span className="text-base text-[#292929] [font-family:'Helvetica_Neue-Regular',Helvetica] font-normal">
            Services
          </span>
        </div>

        <div className="text-center">
          <h2 className="text-[46px] text-[#292929] [font-family:'Helvetica_Neue-Regular',Helvetica] font-normal tracking-[-1.38px] leading-[55.2px]">
            A Smarter Social Space for
          </h2>
          <h2 className="text-[46px] text-[#292929] [font-family:'Helvetica_Neue-Regular',Helvetica] font-normal tracking-[-1.38px] leading-[55.2px]">
            Political Voices
          </h2>
        </div>
      </div>

      <Card className="border-none shadow-none mb-10">
        <CardContent className="p-0">
          <img
            className="w-full h-auto object-cover rounded-md"
            alt="Political social platform interface"
            src="/image-11.png"
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-6">
        <Button  onClick={handleClick} className="rounded-full bg-blue-600 text-white [font-family:'Helvetica_Neue-Medium',Helvetica] font-medium text-sm h-[38px] px-6">
          Discover
          <ChevronRightIcon className="ml-1 h-2 w-5" />
        </Button>

        <span className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-black text-sm tracking-[-0.14px] leading-5 cursor-pointer">
          Learn more
        </span>
      </div>
    </section>
  );
};*/}

import { ChevronRightIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../componenets/Welcome/button";
import { Card, CardContent } from "../../../../componenets/Welcome/card";
import { useNavigate } from 'react-router-dom';
import Slider from "../../../../componenets/Slider";

export const DashboardSection = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <section id="services" className="scroll-mt-[100px] md:scroll-mt-[84px] mt-20 w-full">
      <div className="flex flex-col items-center mb-12 px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-2 h-2 bg-[#578cff] rounded-full mr-4"></div>
          <span className="text-4xl text-[#292929] font-normal font-['Helvetica_Neue-Regular']">
            Services
          </span>
        </div>

        {/* Optional Subtitle */}
        {/* <div className="text-center">
          <h2 className="text-[46px] text-[#292929] font-normal tracking-[-1.38px] leading-[55.2px] font-['Helvetica_Neue-Regular']">
            A Smarter Social Space for
          </h2>
          <h2 className="text-[46px] text-[#292929] font-normal tracking-[-1.38px] leading-[55.2px] font-['Helvetica_Neue-Regular']">
            Political Voices
          </h2>
        </div> */}
      </div>

      {/* Optional Image Section */}
      {/* <Card className="border-none shadow-none mb-10">
        <CardContent className="p-0">
          <img
            className="w-full h-auto object-cover rounded-md"
            alt="Political social platform interface"
            src="/image-11.png"
          />
        </CardContent>
      </Card> */}

      {/* Slider Section */}
      <div className="w-full overflow-x-visible">
        <Slider />
      </div>

      {/* CTA Buttons */}
      {/* <div className="flex items-center justify-center gap-6 mt-10">
        <Button
          onClick={handleClick}
          className="rounded-full bg-blue-600 text-white font-medium text-sm h-[38px] px-6"
        >
          Discover
          <ChevronRightIcon className="ml-1 h-2 w-5" />
        </Button>

        <span className="font-normal text-black text-sm tracking-[-0.14px] leading-5 cursor-pointer">
          Learn more
        </span>
      </div> */}
    </section>
  );
};