import React from 'react';
import { Crown, Lock, Shield, Star } from 'lucide-react';

function Subscription() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <div className="bg-indigo-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Premium Access Required</h2>
          <p className="mt-2 text-gray-600">Subscribe to unlock all premium features and content</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gray-700">
            <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <span>Exclusive premium content access</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <Crown className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <span>Priority customer support</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <Star className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <span>Advanced features and tools</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition duration-150 ease-in-out transform hover:scale-[1.02]"
            onClick={() => console.log('Subscribe clicked')}
          >
            Subscribe Now
          </button>
          <button
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition duration-150 ease-in-out"
            onClick={() => console.log('Learn more clicked')}
          >
            Learn More
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have a subscription?{' '}
          <button className="text-indigo-600 font-medium hover:text-indigo-500">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Subscription;