import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../componenets/Welcome/accordion";

export const FeatureSection = () => {
  // FAQ data for mapping
  const faqItems = [
    {
      question: "What is Magnifier, and how does it work?",
      answer: "Magnifier is a platform that transforms grassroots political discussions into actionable insights. It operates through three platforms – Web Magnifier (a political discussion platform with monetization), Voter Magnifier (booth-level voter insights), and Media Magnifier (voter analytics for media and organizations).",
    },
    {
      question: "How can I join Web Magnifier?",
      answer: "You can sign up directly on the Web Magnifier platform. If you already have an account, simply log in and start participating in discussions.",
    },
    {
      question: "How does the post verification process work?",
      answer: "All posts made on Web Magnifier go through expert review to ensure they align with platform guidelines, social media norms, and legal standards. This helps us maintain a respectful and hate-free environment.",
    },
    {
      question: "Can I earn money on Web Magnifier?",
      answer: "Yes! Users will earn money based on the engagement and each reaction (like or dislike) they receive. Earnings per Reaction – ₹10 for each reaction. Earnings policies may change based on platform policies.",
    },
    {
      question: "What is Voter Magnifier used for?",
      answer: "Voter Magnifier provides booth-wise voter insights and analytics for political parties and strategists. This helps in creating data-driven campaigns and understanding key voter demographics.",
    },
    {
      question: "How can I subscribe to Voter Magnifier or Media Magnifier?",
      answer: "Both operate on a subscription basis. Fill out the Contact Us form with your details, and our team will guide you through the process.",
    },
    {
      question: "What kind of identity proof is required for subscription?",
      answer: "We accept government-issued IDs such as organization’s ID card, or political party membership cards. This helps us ensure authenticity and secure access to sensitive voter data.",
    },
    {
      question: "How long does it take to process my subscription request?",
      answer: "Subscription requests typically take 24-48 business hours for review and verification. Our team will contact you if additional information is needed.",
    },
    {
      question: "Is my data secure on Magnifier?",
      answer: "Absolutely. We prioritize user privacy and ensure that all submitted data is kept confidential and used solely for verification and communication purposes.",
    },
    {
      question: "Who can use Media Magnifier?",
      answer: "Media Magnifier is designed for media houses, political analysts, and organizations looking for in-depth voter insights. It's available through a subscription model.",
    },
    {
      question: "How can I contact support for further questions?",
      answer: "You can reach out to us directly via the Contact Us page, email, or by calling our support team. We’re happy to assist with any inquiries.",
    },
    {
      question: "How can I withdraw my earnings from Web Magnifier?",
      answer: "Minimum Withdrawal – ₹100 initially, withdraw any amount after one month. Withdrawal Methods – Bank transfer, UPI, or linked payment wallets. Processing Time – 3-7 business days.",
    },
  ];

  return (
    <section id="faq" className="w-full py-16 flex flex-col items-center">
      {/* Header */}
      <div className="flex flex-col items-center mb-12">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-[#578cff] rounded-full mr-4"></div>
          <span className="ml-4 font-normal text-base text-[#292929]">
            FAQ&#39;s
          </span>
        </div>

        <h2 className="text-[46px] font-normal text-[#292929] text-center tracking-[-1.38px] leading-[55.2px]">
          Answers to your common
          <br />
          questions
        </h2>
      </div>

      {/* FAQ Accordion */}
      <div className="w-full max-w-[720px]">
        <Accordion type="single" collapsible defaultValue="item-0">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={`item-${index}`}
              value={`item-${index}`}
              className="mb-3 rounded-2xl border border-solid border-[#0000000d] overflow-hidden"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline">
                <span className="font-normal text-xl text-[#292929] tracking-[-0.60px] text-left">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4">
                <p className="text-base text-[#636363] opacity-80 tracking-[-0.16px] leading-6">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};