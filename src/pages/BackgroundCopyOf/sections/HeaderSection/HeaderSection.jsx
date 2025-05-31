import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../../../../componenets/Welcome/button";

export const HeaderSection = () => {
  // Data for the header content
  const headerData = {
    title: {
      firstPart: "India's",
      icon: "/yar0hfd2ii54lrlguj1splmjos0-svg.svg",
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
          {/* Main heading section */}
          <div className="flex flex-col items-center text-center">
            {/* First line of heading */}
            <h3 className=" mb-4  text-black font-bold  ">
              
                Made in India
             
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-5 mb-2 md:mb-4">




              <h1 className="text-3xl pr-2 sm:text-4xl md:text-[58px] text-[#0c0c0c] tracking-[-1px] md:tracking-[-1.74px] leading-tight md:leading-[58px] font-normal [font-family:'Helvetica_Neue-Regular',Helvetica]">
                {headerData.title.firstPart}
              </h1>

              {/* Icon between words */}
              {/*<div className="relative inline-flex items-center justify-center">
                <div className="w-[44px] h-[44px] md:w-[56px] md:h-[56px] bg-white rounded-2xl overflow-hidden shadow-[0px_0px_24px_#00000014] opacity-[0.92] flex items-center justify-center">
                  <img
                    src={headerData.title.icon}
                    alt="Icon"
                    className="w-6 h-6 md:w-8 md:h-8 object-contain"
                  />
                </div>
              </div>*/}

              <h1 className="text-3xl sm:text-4xl md:text-[58px] text-[#0c0c0c]  tracking-[-1px] md:tracking-[-1.74px] leading-tight md:leading-[58px] font-normal [font-family:'Helvetica_Neue-Regular',Helvetica]">
                {headerData.title.secondPart}
              </h1>
            </div>

            {/* Second line of heading */}
            <h1 className="text-3xl sm:text-4xl md:text-[58px] text-[#0c0c0c] tracking-[-1px] md:tracking-[-1.74px] leading-tight md:leading-[58px] font-normal [font-family:'Helvetica_Neue-Regular',Helvetica] mb-4 md:mb-8 px-4">
              {headerData.title.thirdPart}
            </h1>

            {/* Subtitle */}
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

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button
              onClick={scrollToFeatureSelection}
              className="w-[200px] sm:w-auto h-11 rounded-[1000px]  text-white"
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