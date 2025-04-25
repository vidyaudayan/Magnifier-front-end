import { HelpCircleIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../../../../componenets/Welcome/card";

export const BackgroundSection = () => {
  return (
    <Card className="w-full rounded-[44px] overflow-hidden shadow-[0px_0px_24px_#00000012] bg-blue-600">
      <CardContent className="p-8 md:p-16">
        <div className="flex flex-col items-center">
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="w-[44px] h-[44px] md:w-[52px] md:h-[51px] bg-[#ffffff0d] rounded-[15px] overflow-hidden border-2 border-solid border-[#ffffff1a] flex items-center justify-center">
              <HelpCircleIcon className="w-[26px] h-[26px] md:w-[30px] md:h-[30px] text-white" />
            </div>
          </div>

          <div className="text-center mb-6 md:mb-10">
            <h2 className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-white text-[32px] md:text-[46px] tracking-[-1px] md:tracking-[-1.38px] leading-[1.2] md:leading-[55.2px] mb-2">
              Need Assistance?
            </h2>
            <h2 className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-white text-[32px] md:text-[46px] tracking-[-1px] md:tracking-[-1.38px] leading-[1.2] md:leading-[55.2px]">
              We&apos;re Here to Help!
            </h2>
          </div>

          <p className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-white text-[18px] md:text-[25px] text-center tracking-[-0.25px] md:tracking-[-0.34px] leading-[1.4] md:leading-[33px] max-w-[320px] md:max-w-[491px]">
            Email us at{" "}
            <a
              href="mailto:support@magnifierplatform.com"
              rel="noopener noreferrer"
              target="_blank"
              className="underline break-words"
            >
              support@magnifierplatform.com
            </a>
            . Include a screenshot for faster resolution.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};