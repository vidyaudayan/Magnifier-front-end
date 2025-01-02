import Navbar from "./Navbar";

const Support = () => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
<Navbar/>
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
            <div className="flex items-center space-x-4">
              <div className="text-blue-500 text-3xl">
                📞
              </div>
              <div>
                <h3 className="text-xl font-semibold">Phone Support</h3>
                <p className="text-gray-600">
                  Call us at 
                  <a href="tel:+1234567890" className="text-blue-500 hover:underline ml-1">
                    +1 234 567 890
                  </a>{" "}
                  for urgent issues.
                </p>
              </div>
            </div>
  
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
          </div>
  
          {/* Closing Statement */}
          <div className="mt-10 text-center">
            <p className="text-gray-700">
              We strive to respond quickly and make your experience with{" "}
              <span className="font-semibold text-blue-600">Magnifier Platform</span> enjoyable!
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Support;
  