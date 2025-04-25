import React from "react";
import { Card, CardContent } from "../../../../componenets/Welcome/card";

export const MainContentSection = () => {
  const features = [
    {
      icon: "/container-3.svg",
      title: "AI-powered insights",
      description: "Get smart suggestions and insights powered by AI",
    },
    {
      icon: "/vector.svg",
      title: "Real-Time Analytics",
      description: "Follow key trends and updates as they happen, all in one place",
    },
    {
      icon: "/container.svg",
      title: "Microblogging",
      description: "Share your thoughts and explore what others are saying right now",
    },
    {
      icon: "/lucide-lock-keyhole.svg",
      title: "Data Security",
      description: "Your data stays safe and private with strong, built-in protection",
    },
    {
      icon: "/container-1.svg",
      title: "Semantic Topic Search",
      description: "Search smarter with tools that understand what you really mean",
    },
    {
      icon: "/container-2.svg",
      title: "Election Hub & Dashboard",
      description: "Explore election results, comparisons, and trends in real time",
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center py-16 w-full max-w-[1200px] mx-auto px-4">
      {/* Section label */}
      <div className="flex items-center justify-center mb-4">
        <div className="w-2 h-2 bg-[#578cff] rounded-full mr-4"></div>
        <span className="text-base text-[#292929] font-normal">Features</span>
      </div>

      {/* Section heading */}
      <div className="text-center mb-16">
        <h2 className="font-normal text-[46px] text-[#292929] tracking-[-1.38px] leading-[55.2px]">
          Next-Gen Features for Smarter
          <br />
          Political Engagement
        </h2>
      </div>

      {/* Feature cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="bg-white rounded-[20px] border border-solid border-[#578cff33] hover:shadow-lg transition-shadow">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-[58px] h-[58px] mb-6 rounded-full bg-blue-600 flex items-center justify-center">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-[26px] h-[26px]"
                />
              </div>
              
              <h3 className="text-[20px] text-[#292929] font-normal mb-2">
                {feature.title}
              </h3>
              
              <p className="text-[#636363] text-base">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};