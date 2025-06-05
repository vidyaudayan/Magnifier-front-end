import React, { useState } from "react";
import { CreditCard } from "lucide-react"; // import icon to use same style
import { LoginModal } from "./LoginModal";
import { SubscriptionModal } from "./SubscriptionModal";
import { Button } from "./Button"; // assuming you have Button component like in SubscriptionModal
import { PromoCodeInput } from "./PromoCodeInput";
import { VoterSubscriptionModal } from "./VoterSubscriptionModal";




export const VoterSubscriptionFlow = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  const handleSubscribeClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLogin(true);
    } else {
      setShowSubscription(true);
    }
  };

  const handlePromoCodeApply = (code) => {
    alert(`Promo code "${code}" applied!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl">
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
            //   { icon: <Zap size={20} />, text: 'Priority support and faster response times' },
              { icon: <CreditCard size={20} />, text: 'No ads and enhanced user experience' },
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="text-blue-600">{item.icon}</div>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>

          <Button onClick={handleSubscribeClick} size="lg" className="w-full mb-4">
            Subscribe Now
          </Button>

          <PromoCodeInput onApply={handlePromoCodeApply} />
        </div>
      </div>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={() => {
          setShowLogin(false);
          setShowSubscription(true);
        }}
      />

      <VoterSubscriptionModal isOpen={showSubscription} onClose={() => setShowSubscription(false)} />
    </div>
  );
};
