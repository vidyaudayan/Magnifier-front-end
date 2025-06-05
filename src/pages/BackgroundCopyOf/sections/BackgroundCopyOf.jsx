import React from "react";
import { BackgroundSection } from "./BackgroundSection/BackgroundSection";
import { CallToActionSection } from "./CallToActionSection/CallToActionSection";
import { MainContentSection } from "./MainContentSection/MainContentSection";
import { DashboardSection } from "./DashboardSection/DashboardSection";
import { FeatureSection } from "./FeatureSection/FeatureSection";
import { FooterSection } from "./FooterSection/FooterSection";
import { HeaderSection } from "./HeaderSection/HeaderSection";
import { InfoSection } from "./InfoSection/InfoSection";
import { NavigationSection } from "./NavigationSection/NavigationSection";
import { StateSelectionSection } from "./StateSelectionSection/StateSelectionSection";

export const BackgroundCopyOf = () => {
  return (
    <div className="bg-white flex flex-col items-center w-full">
      {/* Fixed Navigation */}
      <NavigationSection />
      
      <div className="bg-white w-full max-w-[1440px] relative pt-[100px] md:pt-[84px] ">
        {/* Header below Navigation */}
        <HeaderSection />



         <section id="services" className="scroll-mt-[100px] md:scroll-mt-[84px] -mt-28  md:-mt-36 relative z-10">

          <DashboardSection />
          {/* <CallToActionSection /> */}
        </section>

        {/* State Selection Section */}
        {/* <StateSelectionSection /> */}


        {/* Services Section */}
       

        {/* Features Section */}
        <section id="features" className="scroll-mt-[100px] md:scroll-mt-[84px]">
          <MainContentSection />
        </section>

        

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-[100px] md:scroll-mt-[84px]">
          <InfoSection />
        </section>

        {/* FAQ Section */}
        <section id="faqs" className="scroll-mt-[100px] md:scroll-mt-[84px]">
          <FeatureSection />
        </section>

        <BackgroundSection />
        <FooterSection />
      </div>
    </div>
  );
};