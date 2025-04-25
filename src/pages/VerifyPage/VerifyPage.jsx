import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Check } from "lucide-react";
import { Button } from "../../componenets/Welcome/button";
import { Card, CardContent } from "../../componenets/Welcome/card";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form'; 

const steps = [
  { id: 1, title: "Mobile OTP" },
  { id: 2, title: "Email OTP" },
  { id: 3, title: "Selfie" },
];

const buttonStyles = "h-11 rounded-[29px] font-medium text-white text-sm tracking-[-0.14px] bg-blue-600";
const outlineButtonStyles = "h-11 rounded-[29px] font-medium text-[#578cff] text-sm tracking-[-0.14px] border-[#578cff] hover:bg-[#578cff10]";

 // or useForm() if it's a standalone

const OTPInput = ({ value, onChange }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  useEffect(() => {
    if (value) {
      const otpArray = value.split("").slice(0, 6);
      setOtp([...otpArray, ...new Array(6 - otpArray.length).fill("")]);
    }
  }, [value]);

  const handleChange = (element, index) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    onChange(combinedOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const otpArray = pastedData.split("").slice(0, 6);
      setOtp([...otpArray, ...new Array(6 - otpArray.length).fill("")]);
      onChange(pastedData);
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          ref={(ref) => (inputRefs.current[index] = ref)}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#578cff] focus:border-transparent"
        />
      ))}
    </div>
  );
};

export const VerifyPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [mobileOTP, setMobileOTP] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isMobileOtpVerified, setIsMobileOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [token, setToken] = useState(null);

  // const userData = JSON.parse(localStorage.getItem('signupData') || '{}');
  const { register, handleSubmit, watch, setValue, errors } = useForm({
    defaultValues: {
      phoneNumber: "",
      mobileOtp: "",
      email: "",
      otp: ""
    }
  });
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/png');
        setSelfieImage(imageData);
        stopCamera();
      }
    }
  };

  const [userData, setUserData] = useState({ email: "", phoneNumber: "" });


  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/userprofile`);
        const { email, phoneNumber } = response.data;

        if (email) setValue('email', email);
        if (phoneNumber) setValue('phoneNumber', phoneNumber);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    userData();
  }, [setValue]);

  const handleSendMobileOTP = async () => {
    try {

     // const phoneNumber = getValues("phoneNumber"); // Fetch directly from form
      const phoneNumber = watch("phoneNumber"); 
     
      console.log("mobile", phoneNumber)

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
        , { headers: { 'Content-Type': 'application/json' } });
      alert('OTP sent successfully!');
      setMobileOtpSent(true);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error sending OTP: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleSendEmailOTP = async () => {
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

  {/*const handleVerifyMobileOTP = async () => {
   // const { phoneNumber, mobileOtp } = getValues();
   const phoneNumber = watch("phoneNumber");
    const mobileOtp = watch("mobileOtp");
   
   console.log("Phone number:", phoneNumber);
    console.log("verify otp", mobileOtp)
    try {

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/verify-mobileotp`, { phoneNumber, otp: mobileOtp });
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
  };*/}
  const handleVerifyMobileOTP = async () => {
    try {
      const phoneNumber = watch("phoneNumber");
      const mobileOtp = watch("mobileOtp");
  
      if (!phoneNumber || !mobileOtp) {
        toast.error("Phone number and OTP are required");
        return;
      }
  
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/verify-mobileotp`,
        { phoneNumber, otp: mobileOtp },
        {
          headers: {
            'Content-Type': 'application/json',
            // Add this if your backend requires auth
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
  
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        toast.success(response.data.message);
        setIsMobileOtpVerified(true);
        setCurrentStep(2);
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(
        error.response?.data?.error || 
        "Verification failed. Please try again."
      );
    }
  };

  const handleVerifyEmailOTP = async () => {
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

  const handleSubmitVerification = () => {
    if (selfieImage) {
      setShowSuccess(true);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
             
                {...register("phoneNumber")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            
            </div>
            <div>
              <Button
                onClick={handleSendMobileOTP}
                className={`w-full mb-4 ${buttonStyles}`}
              >
                Send OTP
              </Button>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <OTPInput  value={watch("mobileOtp")} 
  onChange={(value) => setValue("mobileOtp", value)}  />
              </div>
              <Button
                onClick={handleVerifyMobileOTP}
                className={`w-full mt-4 ${buttonStyles}`}
                disabled={mobileOTP.length !== 6}
              >
                Verify Mobile
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={userData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <Button
                onClick={handleSendEmailOTP}
                className={`w-full mb-4 ${buttonStyles}`}
              >
                Send OTP
              </Button>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <OTPInput value={emailOTP} onChange={setEmailOTP} />
              </div>
              <Button
                onClick={handleVerifyEmailOTP}
                className={`w-full mt-4 ${buttonStyles}`}
                disabled={emailOTP.length !== 6}
              >
                Verify Email
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="relative">
              {!stream && !selfieImage && (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <Camera className="w-12 h-12 text-gray-400 mb-4" />
                  <Button onClick={startCamera} className={buttonStyles}>
                    Start Camera
                  </Button>
                </div>
              )}
              {stream && !selfieImage && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg"
                  />
                  <Button
                    onClick={takeSelfie}
                    className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 ${buttonStyles}`}
                  >
                    Take Selfie
                  </Button>
                </div>
              )}
              {selfieImage && (
                <div className="relative">
                  <img
                    src={selfieImage}
                    alt="Selfie preview"
                    className="w-full rounded-lg"
                  />
                  <div className="flex justify-center gap-4 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelfieImage(null);
                        startCamera();
                      }}
                      className={outlineButtonStyles}
                    >
                      Retake
                    </Button>
                    <Button
                      onClick={handleSubmitVerification}
                      className={buttonStyles}
                    >
                      Submit Verification
                    </Button>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account Successfully Verified
          </h2>
          <p className="text-gray-600">Redirecting you to the dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 flex items-center gap-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign Up
        </Button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Verify Your Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Complete the verification process to activate your account
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step.id <= currentStep
                        ? "[background:linear-gradient(180deg,rgba(145,187,255,1)_0%,rgba(101,151,255,1)_100%)] text-white"
                        : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="ml-2 text-sm font-medium text-gray-600">
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 ${step.id < currentStep ? "bg-[#578cff]" : "bg-gray-200"
                      }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-6">{renderStepContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
};