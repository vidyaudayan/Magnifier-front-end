import React from 'react'
import axios from 'axios';
import { useState,useEffect } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { useNavigate} from 'react-router-dom';
import { X } from 'lucide-react'; // Import Lucide for the cross icon

function VerificationPage(){
    const [isOpen, setIsOpen] = useState(true);

 const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [mobileOtpSent, setMobileOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [token, setToken] = useState(null);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isMobileOtpVerified, setIsMobileOtpVerified] = useState(false);
   
   
    const navigate = useNavigate();
    const handleClose = () => {
        setIsOpen(false);
        navigate(-1); // ✅ Go back to the previous page
      };
      const {
            register: registerSignup,
            formState: { errors: signupErrors },
            getValues,
            reset: resetSignupForm,
            setValue,  // To manually set the file value
        } = useForm();

        useEffect(() => {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`);
                    const { email, phoneNumber } = response.data;
    
                    if (email) setValue('email', email);
                    if (phoneNumber) setValue('phoneNumber', phoneNumber);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            };
    
            fetchUserData();
        }, [setValue]);
    

         const handleSendOtp = async () => {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/send-otp`, { email });
                    if (response.status === 200) {
                        setOtpSent(true);
                        toast.success("OTP sent to your email", { position: "top-center" });
                    }
                } catch (error) {
                    toast.error(
                        error.response?.data?.message || "Failed to send OTP. Please try again.",
                        { position: "top-center" }
                    );
                }
            };
            const handleVerifyOtp = async () => {

                if (!email) {
                    toast.error("Email is required!", { position: "top-center" });
                    return;
                }
        
                const otp = getValues("otp");
                console.log("Request Data:", { email, otp });
                if (!otp) {
                    toast.error("OTP is required!", { position: "top-center" });
                    return;
                }
                try {
                    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/verify-otp`, { email, otp }, {
                        headers: {
                            "Content-Type": "application/json", // Explicit header
                        },
                    });
                    if (response.status === 200) {
                        setToken(response.data.token);
                        toast.success("OTP verified successfully!", { position: "top-center" });
                        setIsOtpVerified(true);
                        navigate("/landing");
                    }
                } catch (error) {
                    toast.error(
                        error.response?.data?.message || "Failed to verify OTP. Please try again.",
                        { position: "top-center" }
                    );
                }
            };
        
        
            const handleSendMobileOtp = async () => {
                try {
                
                    const phoneNumber = getValues("phoneNumber"); // Fetch directly from form
                    console.log("mobile",phoneNumber)
                   
                    if (!phoneNumber) {
                      alert("Please enter your phone number");
                      return;
                    }
                    const formatPhoneNumber = (phoneNumber) => {
                        return phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber.trim()}`;
                      };
                  
                      const formattedNumber = formatPhoneNumber(phoneNumber);
                      console.log('Formatted Phone Number:', formattedNumber); // Debug here
                      
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/user/send-mobileotp`, { phoneNumber: formattedNumber }
                      ,{ headers: { 'Content-Type': 'application/json' } });
                    alert('OTP sent successfully!');
                      setMobileOtpSent(true);
                    setStep(2);
                } catch (error) {
                    console.error('Error:', error);
                    alert(`Error sending OTP: ${error.response?.data?.error || error.message}`);
                }
            };
        
            const handleVerifyMobileOtp = async () => {
                const { phoneNumber, mobileOtp } = getValues();
                console.log("Phone number:", phoneNumber);
                console.log("verify otp",mobileOtp)
                try {
                    
                    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/verify-mobileotp`, { phoneNumber,otp: mobileOtp });
                    alert(response.data.message);
                    if (response.status === 200) {
                        setToken(response.data.token);
                        toast.success("OTP verified successfully!", { position: "top-center" });
                        setIsMobileOtpVerified(true)

                       
                    }
                } catch (error) {
                    console.error(error.response?.data);
            alert(error.response?.data?.error || "Invalid OTP");
                }
            };
    
  return (
    isOpen && (
   <>
   
  
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
        {/* Close Button */}
        <button 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={handleClose} // Close the modal
        >
          <X size={24} />
        </button>


        <h2 className="text-xl font-semibold mb-4 text-center">Verify Your Account</h2>

        <div className="space-y-4">
          {/* Email Input */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border border-slate-400 rounded"
              {...registerSignup("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email address",
                },
                onChange: (e) => setEmail(e.target.value),
              })}
            />
            {signupErrors.email && (
              <p className="text-red-500 text-sm">{signupErrors.email.message}</p>
            )}
          </div>

          {/* OTP Section for Email */}
          {!isOtpVerified && otpSent ? (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full mb-3 p-2 border border-slate-400 rounded"
                {...registerSignup("otp", { required: "OTP is required" })}
              />
              {signupErrors.otp && (
                <p className="text-red-500 text-sm">{signupErrors.otp.message}</p>
              )}
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => handleVerifyOtp(getValues("otp"))}
              >
                Verify OTP
              </button>
            </div>
          ) : null}

          {/* Send OTP Button for Email */}
          {!isOtpVerified && !otpSent && (
            <button
              type="button"
              className="bg-blue-500 mb-4 text-white px-4 py-2 rounded"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          )}

          {/* Success Message for Email */}
          {isOtpVerified && (
            <div className="text-green-500 mb-2 text-sm font-semibold">
              OTP successfully verified!
            </div>
          )}

          {/* Phone Number Input */}
          <div className="mb-4">
            <input
              type="number"
              placeholder="Phone Number"
              className="w-full mb-3 p-2 border border-slate-400 rounded appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
             
              {...registerSignup("phoneNumber", {
                required: "Phone Number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Invalid phone number",
                },
              })}
            />
            {signupErrors.phoneNumber && (
              <p className="text-red-500 text-sm">{signupErrors.phoneNumber.message}</p>
            )}
          </div>

          {/* OTP Section for Phone */}
          {!isMobileOtpVerified && mobileOtpSent ? (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full mb-3 p-2 border border-slate-400 rounded"
                {...registerSignup("mobileOtp", { required: "Mobile OTP is required" })}
              />
              {signupErrors.mobileOtp && (
                <p className="text-red-500 text-sm">{signupErrors.mobileOtp.message}</p>
              )}
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleVerifyMobileOtp}
              >
                Verify Mobile OTP
              </button>
            </div>
          ) : null}

          {/* Send OTP Button for Phone */}
          {!isMobileOtpVerified && !mobileOtpSent && (
            <button
              type="button"
              className="bg-blue-500 mb-4 text-white px-4 py-2 rounded"
              onClick={handleSendMobileOtp}
            >
              Send Mobile OTP
            </button>
          )}

          {/* Success Message for Phone */}
          {isMobileOtpVerified && (
            <div className="text-green-500 mb-2 text-sm font-semibold">
              Mobile OTP successfully verified!
            </div>
          )}
        </div>
      </div>
    </div>

    </>
       )
 ) 
}
export default VerificationPage;