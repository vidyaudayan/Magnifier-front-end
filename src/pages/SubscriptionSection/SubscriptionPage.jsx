import React, { useState } from 'react';

import { CreditCard, Shield, Zap } from 'lucide-react';
import { Button } from "../../componenets/Button"
import { PromoCodeInput } from '../../componenets/PromoCodeInput';
import { SubscriptionModal } from '../../componenets/SubscriptionModal';



export const SubscriptionPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePromoCodeApply = (code) => {
    // In a real app, you would validate the promo code
    alert(`Promo code "${code}" applied!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Upgrade Your Experience</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get access to premium features and take your experience to the next level.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl">
          <div className="bg-blue-600 p-6 text-white">
            <h2 className="text-2xl font-bold">Premium Subscription</h2>
            <p className="mt-2 opacity-90">Unlock all features with our premium plan</p>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex items-baseline mb-6">
              <span className="text-5xl font-extrabold">100 Points</span>
              <span className="text-gray-500 ml-2">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              {[
                { icon: <Zap size={20} />, text: 'Priority support and faster response times' },
                { icon: <CreditCard size={20} />, text: 'No ads and enhanced user experience' }
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="text-blue-600">{item.icon}</div>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="w-full mb-4"
            >
              Subscribe Now
            </Button>
            
            <PromoCodeInput onApply={handlePromoCodeApply} />
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          By subscribing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
