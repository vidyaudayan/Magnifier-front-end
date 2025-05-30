import React from "react";
import { Button } from "../../../../componenets/Welcome/button";
import { Separator } from "../../../../componenets/Welcome/separator";
import logo from "../../../../assets/Images/logo.jpg"
import { Link } from "react-router-dom";
export const FooterSection = () => {

  const quickLinks = [

    { title: "Features", href: "#features", type: "hash" },
    { title: "Services", href: "#services", type: "hash" },
    { title: "Contact", href: "#contact", type: "hash" },
    { title: "FAQs", href: "#faq", type: "hash" },

    { title: "Terms & Conditions", href: "/terms-condition", type: "page" },
    { title: "User Guidelines", href: "/user-guidelines", type: "page" },
    { title: "Apply for job", href: "/job-application", type: "page" },
    {title:"Bulletin", href:"/bulletin",type:"page"}
  ];
  const serviceLinks = [
    { title: "Web Magnifier", href: "#" },
    { title: "ElectoAI", href: "#" },
    { title: "Dashboard", href: "#" },
  ];

  const socialLinks = [
    { title: "Youtube", href: "#" },
    { title: "Linkedin", href: "#" },
  ];

  const scrollToFeatureSelection = () => {
    const featureSection = document.getElementById("services");
    if (featureSection) {
      featureSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full py-16 bg-transparent">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-40">
          {/* Logo and CTA section */}
          <div className="col-span-1">
            <div className="mb-4">
              <div className="flex flex-shrink-0 cursor-pointer items-center space-x-2" >
                <img
                  src={logo} // Make sure the path is correct: `public/logo.jpg`
                  alt="Logo"
                  className="w-10 h-10 sm:w-8 sm:h-8 md:w-12 md:h-12 object-contain"
                />
                <h1 className="font-bold text-xl sm:text-2xl md:text-4xl">Magnifier</h1>
              </div>
            </div>

            <p className="text-2xl text-[#636363] tracking-[-0.48px] leading-9 mb-6">
              Turn conversations into <br />
              powerful insights
            </p>

            <Button onClick={scrollToFeatureSelection} className="bg-blue-600 text-white rounded-full h-11 px-4 flex items-center">
              <span className="mr-2">Get started</span>
              <div className="w-[34px] h-[34px] bg-white rounded-full flex items-center justify-center">
                <img
                  className="w-[13px] h-[11px]"
                  alt="Arrow"
                  src="/group-2.png"
                />
              </div>
            </Button>
          </div>

          {/* Quick links section */}
          <div className="col-span-1">
            <h3 className="text-xl text-[#292929] font-normal tracking-[-0.60px] leading-[30px] mb-6">
              Quick links
            </h3>
           <ul className="grid grid-cols-2 gap-x-28 gap-y-4">
  {quickLinks.map((link, index) => (
    <li key={index}>
      <a
        onClick={(e) => {
          if (link.type === "hash") {
            e.preventDefault();
            document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        href={link.href}
        className="text-lg text-[#636363] tracking-[-0.36px] leading-7 hover:text-blue-700 transition-colors"
      >
        {link.title}
      </a>
    </li>
  ))}
</ul>
          </div>

          {/* Services section */}
          <div className="col-span-1">
            <h3 className="text-xl text-[#292929] font-normal tracking-[-0.60px] leading-[30px] mb-6">
              Services
            </h3>
            <ul className="space-y-4">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-lg text-[#636363] tracking-[-0.36px] leading-7 hover:text-blue-700 transition-colors"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow us section */}
          <div className="col-span-1">
            <h3 className="text-xl text-[#292929] font-normal tracking-[-0.60px] leading-[30px] mb-6">
              Follow us
            </h3>
            <ul className="space-y-4">
              {socialLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-lg text-[#636363] tracking-[-0.36px] leading-7 hover:text-blue-700 transition-colors"
                  >
                    {link.title}
                  </a>


                </li>
              ))}

            </ul>

          </div>

           {/* <div className="col-span-1">
            <h3 className="text-xl text-[#292929] font-normal tracking-[-0.60px] leading-[30px] mb-6">
              <Link to={"/bulletin"}>
                Bulletin
              </Link>
             
            </h3>
      

          </div> */}

          
        </div>

        <Separator className="my-8 bg-[#292929] opacity-10" />

        <div className="flex justify-between items-center">
          <p className="text-lg text-[#292929] tracking-[-0.36px]">
            © 2025 Magnifier. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            {/* Additional footer elements can be added here if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
};