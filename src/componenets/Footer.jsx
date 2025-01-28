
import { FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";


import { Link } from "react-router-dom";
const Footer = () => {
    return (
      <footer className="bg-blue-600 lg:h-[500px] mt-10 text-black text-md py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between gap-8">
            {/* Logo and About Section */}
            <div className="w-full sm:w-1/2 lg:w-1/4">
              <h2 className="text-white text-2xl font-bold mb-4">Magnifier</h2>
              <p className="leading-relaxed">
                Magnifier transforms grassroots political discussions into actionable insights through data-driven tools and analytics.
              </p>
            </div>
  
            {/* Quick Links */}
            <div className="w-full sm:w-1/2 lg:w-1/4">
              <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3 flex flex-col">
              <Link to="/" className="hover:text-white transition">
                 Home
                </Link>
                <Link to="/faq" className="hover:text-white transition">
                 FAQ
                </Link>
                <Link to="/contact" className="hover:text-white transition">
                 Contact Us
                </Link>
                <Link to="/support" className="hover:text-white transition">
                 Support
                </Link>
                <Link to="/userguidelines" className="hover:text-white transition">
                  User guidelines
                </Link>
                <Link to="termsandconditions" className="hover:text-white transition">
                 Privacy Policy|Terms and conditions
                </Link>
              </ul>
            </div>
  
            {/* Contact Information */}
            <div className="w-full sm:w-1/2 lg:w-1/4">
              <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
              <p>Email: <a href="mailto:support@magnifier-platform.com" className="hover:text-white">support@magnifier-platform.com</a></p>
              <p>Email: <a href="mailto:contactus@magnifier-platform.com" className="hover:text-white">contactus@magnifier-platform.com</a></p>
          
            </div>
  
            {/* Social Media */}
            <div className="w-full sm:w-1/2 lg:w-1/4">
              <h3 className="text-white text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
              <FaLinkedin className="hover:text-white text-2xl transition" />
              <FaFacebook className="hover:text-white text-2xl transition"/>
              <FaSquareInstagram className="hover:text-white text-2xl transition"/>
              <FaYoutube className="hover:text-white text-2xl transition"/> 
              </div>
            </div>
          </div>
  
          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-2 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Magnifier. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  