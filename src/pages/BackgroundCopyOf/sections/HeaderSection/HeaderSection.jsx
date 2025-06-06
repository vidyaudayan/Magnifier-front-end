import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../../../../componenets/Welcome/button";

// Define IndiaFlagIcon outside the main component
const IndiaFlagIcon = () => (
  <svg
    width="24"
    height="16"
    viewBox="0 0 24 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block"
  >
    {/* Saffron stripe */}
    <rect width="24" height="5.333" fill="#FF9933" />
    {/* White stripe */}
    <rect y="5.333" width="24" height="5.333" fill="#FFFFFF" />
    {/* Green stripe */}
    <rect y="10.666" width="24" height="5.334" fill="#138808" />

    {/* Ashoka Chakra: outer circle */}
    <circle cx="12" cy="8" r="2" stroke="#000080" strokeWidth="0.5" fill="none" />
    {/* Ashoka Chakra: inner circle */}
    <circle cx="12" cy="8" r="1.3" stroke="#000080" strokeWidth="0.3" fill="none" />

    {/* 24 spokes */}
    {[...Array(24)].map((_, i) => {
      const angle = (i * 15) * (Math.PI / 180);
      const x1 = 12 + 0.3 * Math.cos(angle);
      const y1 = 8 + 0.3 * Math.sin(angle);
      const x2 = 12 + 2 * Math.cos(angle);
      const y2 = 8 + 2 * Math.sin(angle);
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#000080"
          strokeWidth="0.3"
        />
      );
    })}
  </svg>
);


export const HeaderSection = () => {
  const headerData = {
    title: {
      firstPart: "India's",
      // icon: "/yar0hfd2ii54lrlguj1splmjos0-svg.svg", // Not used now
      secondPart: "First",
      thirdPart: "Politic-Tech Platform",
    },
    subtitle: [
      "Turn conversations into powerful insights with real-",
      "time data, AI, and grassroots intelligence",
    ],
    cta: {
      primaryButton: "Get started",
      demoLink: {
        text: "Watch Demo",
        url: "https://youtu.be/yH7eDWTH5iM?si=ee_--DgoIMYtIM9E",
      },
    },
  };

  const scrollToStateSelection = () => {
    const stateSection = document.getElementById("state-selection");
    if (stateSection) {
      stateSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToFeatureSelection = () => {
    const featureSection = document.getElementById("services");
    if (featureSection) {
      featureSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="flex flex-col items-center justify-center py-8 md:py-14 w-full max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center gap-2.5 w-full">
        <div className="relative w-full max-w-5xl">
          <div className="flex flex-col items-center text-center">
            {/* Fixed h3 with Indian flag icon */}
            <h3 className="mb-4 text-black font-medium flex items-center gap-2">
              Made in India
              <IndiaFlagIcon />

            </h3>

            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-5 mb-2 md:mb-4">
              <h1 className="text-3xl pr-2 sm:text-4xl md:text-[58px] text-[#0c0c0c] tracking-[-1px] md:tracking-[-1.74px] leading-tight md:leading-[58px] font-normal [font-family:'Helvetica_Neue-Regular',Helvetica]">
                {headerData.title.firstPart}
              </h1>

              <h1 className="text-3xl sm:text-4xl md:text-[58px] text-[#0c0c0c] tracking-[-1px] md:tracking-[-1.74px] leading-tight md:leading-[58px] font-normal [font-family:'Helvetica_Neue-Regular',Helvetica]">
                {headerData.title.secondPart}
              </h1>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-[58px] text-[#0c0c0c] tracking-[-1px] md:tracking-[-1.74px] leading-tight md:leading-[58px] font-normal [font-family:'Helvetica_Neue-Regular',Helvetica] mb-4 md:mb-8 px-4">
              {headerData.title.thirdPart}
            </h1>

            <div className="text-center mb-8 md:mb-16 px-4">
              {headerData.subtitle.map((line, index) => (
                <p
                  key={index}
                  className="text-base sm:text-lg md:text-xl text-[#0c0c0c] tracking-[-0.10px] leading-relaxed md:leading-[30px] [font-family:'Helvetica_Neue-Regular',Helvetica]"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button
              onClick={scrollToFeatureSelection}
              className="w-[200px] sm:w-auto h-11 rounded-[1000px] text-white"
            >
              <span className="[font-family:'Helvetica_Neue-Medium',Helvetica] font-medium text-[15px] tracking-[-0.16px] leading-6 mr-2">
                {headerData.cta.primaryButton}
              </span>
              <div className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center">
                <img
                  className="w-[13px] h-[11px]"
                  alt="Arrow icon"
                  src="/group.png"
                />
              </div>
            </Button>

            <div className="flex items-center">
              <a
                className="group inline-flex items-center [font-family:'Helvetica_Neue-Medium',Helvetica] font-medium text-black text-[15px] tracking-[-0.16px] leading-6 relative"
                href={headerData.cta.demoLink.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="relative">
                  {headerData.cta.demoLink.text}
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black transform origin-left transition-transform duration-300 group-hover:scale-x-0"></span>
                </span>
                <ArrowUpRight className="w-4 h-4 ml-1 transform -translate-y-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
