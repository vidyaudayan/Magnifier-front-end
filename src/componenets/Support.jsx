import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, MessageCircleQuestion } from 'lucide-react';
import NavbarWelcome from "./NavbarWelcome";
const Support = () => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
<NavbarWelcome/>
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8 md:p-12 text-gray-800">
          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 text-center mb-6">
            Need Assistance? We're Here to Help!
          </h1>
  
          {/* Description */}
          <p className="text-lg text-gray-700 text-center mb-8">
            For any technical assistance or user support, reach out to us!
          </p>
  
          {/* Support Options */}
          <div className="space-y-8">
            {/* Phone Support */}
           
  
            {/* Email Support */}
            <div className="flex items-center space-x-4">
              <div className="text-blue-500 text-3xl">
                📧
              </div>
              <div>
                <h3 className="text-xl font-semibold">Email Support</h3>
                <p className="text-gray-600">
                  Email us at{" "}
                  <a
                    href="mailto:support@magnifierplatform.com"
                    className="text-blue-500 hover:underline"
                  >
                    support@magnifierplatform.com
                  </a>
                  . Include a screenshot for faster resolution.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-blue-500 text-3xl">
              <MessageCircleQuestion size={36} className="text-blue-500 mx-auto" />
              </div>

            
              <div>
                <h3 className="text-xl font-semibold">FAQ</h3>
                <p className="text-gray-600">
                 To know more about us please click
                 
               <Link to="/faq" className="text-blue-500 font-semibold hover:scale-105 hover:underline-offset-1">  Frequently asked questions</Link>
                </p>
              </div>
            </div>
          </div>
  
          {/* Closing Statement */}
          <div className="mt-10 text-center">
            <p className="text-gray-700">
              We strive to respond quickly and make your experience with{" "}
              <Link to="/" className="font-semibold text-blue-600">Magnifier Platform</Link> enjoyable!
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Support;
  