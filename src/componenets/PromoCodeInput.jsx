import React, { useState } from 'react';

export const PromoCodeInput = ({ onApply }) => {
  const [promoCode, setPromoCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    if (promoCode.trim()) {
      onApply(promoCode);
      setPromoCode('');
    }
  };

  return (
    <div className="mt-4">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          Have a promo code?
        </button>
      ) : (
        <div className="animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleApply}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
