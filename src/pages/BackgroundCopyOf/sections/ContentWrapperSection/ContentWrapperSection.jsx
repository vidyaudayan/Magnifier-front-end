import React from "react";
import { Card, CardContent } from "../../../../componenets/Welcome/card";

export const ContentWrapperSection = () => {
  // Feature card data for mapping
  const featureCards = [
    {
      id: 1,
      icon: "/container-3.svg",
      iconBg:
        "linear-gradient(180deg,rgba(140,182,255,1) 0%,rgba(104,154,255,1) 100%)",
      title: "AI-powered insights",
      description: ["Get smart suggestions and", "insights powered by AI"],
    },
    {
      id: 2,
      icon: "/vector.svg",
      iconBg:
        "linear-gradient(180deg,rgba(144,186,255,1) 0%,rgba(111,159,255,1) 100%)",
      title: "Real-Time Analytics",
      description: [
        "Follow key trends and updates as",
        "they happen, all in one place",
      ],
    },
    {
      id: 3,
      icon: "/container.svg",
      iconBg:
        "linear-gradient(180deg,rgba(156,195,255,1) 0%,rgba(87,140,255,1) 100%)",
      title: "Microblogging",
      description: [
        "Share your thoughts and explore",
        "what others are saying right now",
      ],
    },
    {
      id: 4,
      icon: "/lucide-lock-keyhole.svg",
      iconBg:
        "linear-gradient(180deg,rgba(156,195,255,1) 0%,rgba(87,140,255,1) 100%)",
      title: "Data Security",
      description: [
        "Your data stays safe and private",
        "with strong, built-in protection",
      ],
    },
    {
      id: 5,
      iconBg:
        "linear-gradient(180deg,rgba(156,195,255,1) 0%,rgba(87,140,255,1) 100%)",
      backgroundImage: "/container-1.svg",
      title: "Semantic Topic Search",
      description: [
        "Search smarter with tools that",
        "understand what you really mean",
      ],
    },
    {
      id: 6,
      icon: "/container-2.svg",
      iconBg:
        "linear-gradient(180deg,rgba(156,195,255,1) 0%,rgba(87,140,255,1) 100%)",
      title: "Election Hub & Dashboard",
      description: [
        "Explore election results, comparisons,",
        "and trends in real time",
      ],
    },
  ];

  return (
    <section className="flex flex-wrap gap-6 w-full max-w-[1150px] mx-auto my-8">
      {featureCards.map((card) => (
        <Card
          key={card.id}
          className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] h-[257px] rounded-[26px] border border-solid border-[#578cff33] bg-white"
        >
          <CardContent className="p-0 h-full relative">
            <div
              className="absolute w-[58px] h-[58px] top-8 left-1/2 -translate-x-1/2 rounded-full overflow-hidden shadow-[0px_2px_10px_1px_#0000001a,0px_0px_0px_1px_#12376914]"
              style={{ background: card.iconBg }}
            >
              {card.icon ? (
                <img
                  className="absolute w-[26px] h-[26px] top-4 left-4"
                  alt="Feature icon"
                  src={card.icon}
                />
              ) : (
                <div
                  className="relative w-[26px] h-[26px] top-4 left-4"
                  style={{
                    backgroundImage: `url(${card.backgroundImage})`,
                    backgroundSize: "100% 100%",
                  }}
                />
              )}
            </div>

            <div className="absolute w-[303px] h-[99px] top-[126px] left-1/2 -translate-x-1/2">
              <div className="text-center">
                <h3 className="font-normal text-[#292929] text-2xl tracking-[-0.72px] leading-9">
                  {card.title}
                </h3>
              </div>

              <div className="mt-[14px] text-center">
                {card.description.map((line, index) => (
                  <p
                    key={index}
                    className="font-normal text-[#636363] text-lg tracking-[-0.36px] leading-[27.9px]"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};