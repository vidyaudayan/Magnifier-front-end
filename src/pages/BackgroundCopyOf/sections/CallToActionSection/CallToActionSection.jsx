import React from "react";
import { Button } from "../../../../componenets/Welcome/button";
import { Card, CardContent } from "../../../../componenets/Welcome/card";
import { useNavigate } from 'react-router-dom';


export const CallToActionSection = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/login');
  };
  // Feature card data for mapping
  const featureCards = [
    {
      id: 1,
      title: "ElectoAI System",
      description:
        "Our predictive engine analyzes past trends and real-time data to forecast elections with unmatched accuracy and clarity.",
      imagePath: "..//frame-21.png",
    },
    {
      id: 2,
      title: "Magnifier Dashboard",
      description:
        "Visualize political data, election insights, and voter trends through a dynamic, interactive dashboard built for clarity.",
      imagePath: "..//frame-21.png",
    },
  ];

  return (
    <section className="w-full py-16 flex justify-center">
      <div className="w-full max-w-[1000px] flex flex-col items-center">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="font-normal text-[46px] text-[#292929] tracking-[-1.38px] leading-[55.2px]">
            More Features to Power
            <br />
            Your Political Journey
          </h2>
        </div>

        {/* Cards Container */}
        <div className="w-full flex flex-wrap justify-center gap-6">
          {featureCards.map((card) => (
            <Card
              key={card.id}
              className="w-full max-w-[463px] rounded-[28px] border border-solid border-[#ddd7d7] bg-[#fafcff] overflow-hidden"
            >
              <CardContent className="p-8">
                <div className="mb-12">
                  <h3 className="font-normal text-[32px] text-[#292929] tracking-[-1.28px] leading-[48px] mb-4">
                    {card.title}
                  </h3>
                  <p className="font-normal text-xl text-[#636363] tracking-[-0.10px] leading-[30px]">
                    {card.description}
                  </p>
                </div>

                {/* Image placeholder */}
                <div
                  className="w-[362px] h-[235px] mx-auto rounded-[20px_20px_0px_0px] mb-12"
                  style={{
                    background: `url(${card.imagePath}) 50% 50% / cover`,
                  }}
                />

                {/* Action buttons */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button  onClick={handleClick} className="h-[38px] rounded-[29px] bg-blue-600">
                    <span className="font-medium text-sm tracking-[-0.14px]">
                      Discover
                    </span>
                    <img
                      className="w-[5px] h-2 ml-1"
                      alt="Arrow"
                      src="/vector-3.svg"
                    />
                  </Button>

                  <button className="font-normal text-sm text-black tracking-[-0.14px] leading-5">
                    Learn more
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};