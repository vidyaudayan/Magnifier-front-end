import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Check } from "lucide-react";
import { Button } from "../../componenets/Welcome/button";
import { Card, CardContent } from "../../componenets/Welcome/card";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { useRecaptcha } from "../../componenets/hooks/useRecaptcha";
//import { auth } from "../../firebase";
//import { auth, RecaptchaVerifier } from "../../firebase"
//import {  getAuth,signInWithPhoneNumber } from 'firebase/auth';
import {getAuth,  signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
// Changed the order of steps to prioritize email verification
const steps = [
  { id: 1, title: "Email OTP" },
  { id: 2, title: "Mobile OTP" },
  { id: 3, title: "Selfie" },
];
const auth = getAuth();
const buttonStyles = "h-11 rounded-[29px] font-medium text-white text-sm tracking-[-0.14px] bg-blue-600";
const outlineButtonStyles = "h-11 rounded-[29px] font-medium text-[#578cff] text-sm tracking-[-0.14px] border-[#578cff] hover:bg-[#578cff10]";

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
  const [emailOTP, setEmailOTP] = useState("");
  const [mobileOTP, setMobileOTP] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
//const recaptchaVerifier = useRef(null);
 // const recaptchaContainerRef = useRef(null);

 const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
 const [verificationId, setVerificationId] = useState(null);
 
 //const { recaptchaVerifier, isReady, error, resetRecaptcha, initializing } = useRecaptcha(auth);
  //const [isSending, setIsSending] = useState(false);


 const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [selfieImage, setSelfieImage] = useState(null);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isMobileOtpVerified, setIsMobileOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [token, setToken] = useState(null);
  const[confirmationResult,setConfirmationResult]= useState(null)
  const [userData, setUserData] = useState({ email: "", phoneNumber: "" });
 // const [confirmationResult, setConfirmationResult] = useState(null);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
   
    defaultValues: {
      phoneNumber: "",
      mobileOtp: "",
      email: "",
      otp: ""
    }
  });
 
  const recaptchaContainerRef = useRef(null);

  
  useEffect(() => {
    if (currentStep === 2 && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          console.log("Recaptcha solved");
        },
        "expired-callback": () => {
          toast.error("reCAPTCHA expired");
        },
      });
  
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    }
  }, [currentStep]);
  
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  useEffect(() => {
    // Initialize reCAPTCHA when component mounts
    const initializeRecaptcha = () => {
      try {
        const verifier = new RecaptchaVerifier(
          'recaptcha-container',
          {
            size: 'invisible',
            callback: (response) => {
              console.log('reCAPTCHA verified:', response);
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
              setRecaptchaVerifier(null);
            }
          },
          auth
        );
        
        setRecaptchaVerifier(verifier);
      } catch (error) {
        console.error('reCAPTCHA initialization error:', error);
        toast.error('Failed to initialize security check');
      }
    };
  
    initializeRecaptcha();
  
    return () => {
      // Cleanup reCAPTCHA when component unmounts
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, [auth])
 

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.log('Recaptcha cleanup error:', e);
        }
        window.recaptchaVerifier = null;
      }
    };
  }, []);
  
  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/userprofile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const { email, phoneNumber } = response.data;
        setUserData({ email, phoneNumber });
        setValue("email", email);
        setValue("phoneNumber", phoneNumber);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [setValue]);

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
      toast.error("Error accessing camera. Please ensure you've granted permissions.");
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

  const handleSendEmailOTP = async () => {
    try {
      const email = watch("email");
      if (!email) {
        toast.error("Email is required!", { position: "top-center" });
        return;
      }

      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/send-otp`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success("OTP sent to your email", { position: "top-center" });
      setOtpSent(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Please try again.",
        { position: "top-center" }
      );
    }
  };

  const handleVerifyEmailOTP = async () => {
    const email = watch("email");
    const otp = watch("otp");

    if (!email) {
      toast.error("Email is required!", { position: "top-center" });
      return;
    }

    if (!otp) {
      toast.error("OTP is required!", { position: "top-center" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/verify-otp`,
        { email, otp },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success("Email verified successfully!", { position: "top-center" });
        setIsOtpVerified(true);
        setCurrentStep(2); // Move to mobile verification step
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(
        error.response?.data?.message || "Failed to verify OTP. Please try again.",
        { position: "top-center" }
      );
    }
  };



 
{/*const handleSendMobileOTP = async () => {
    try {
      let phoneNumber = watch("phoneNumber").trim();
      if (!phoneNumber) {
        toast.error("Phone number is required");
        return;
      }
  
      // Format phone number
      if (!phoneNumber.startsWith("+")) {
        phoneNumber = `+91${phoneNumber}`;
      }
      phoneNumber = phoneNumber.replace(/[^+\d]/g, '');
  
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/send-mobileotp`,
        { phoneNumber },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        //appVerifier
      );
  
      if (response.data.success) {
        setConfirmationResult(confirmationResult);
        setVerificationId(response.data.verificationId);
        toast.success('OTP sent successfully!');
        setMobileOtpSent(true);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        error.response?.data?.error || "Failed to send OTP. Please try again."
      );
    }
  };*/}

  const handleSendMobileOTP = async () => {
    try {
      let phoneNumber = watch("phoneNumber").trim();
      
      // Validate phone number
      if (!phoneNumber) {
        toast.error("Phone number is required");
        return;
      }
  
      // Format phone number
      if (!phoneNumber.startsWith("+")) {
        phoneNumber = `+91${phoneNumber}`; // Default to India if no country code
      }
  
      setIsSendingOtp(true);
  
      // Verify reCAPTCHA is ready
      if (!recaptchaVerifier) {
        throw new Error('Security check not ready. Please try again.');
      }
  
      // Send OTP
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      );
      
      setConfirmationResult(confirmation);
      setMobileOtpSent(true);
      toast.success("OTP sent successfully");
      
    } catch (error) {
      console.error("OTP sending failed:", error);
      
      let errorMessage = "Failed to send OTP. Please try again.";
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = "Invalid phone number format";
      } else if (error.code === 'auth/invalid-app-credential') {
        errorMessage = "Firebase configuration error. Please contact support.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many attempts. Please try again later.";
      } else if (error.message.includes('reCAPTCHA')) {
        errorMessage = "Security check failed. Please refresh the page.";
      }
      
      toast.error(errorMessage);
      
      // Reset reCAPTCHA on failure
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        setRecaptchaVerifier(null);
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyMobileOTP = async () => {
    const code = watch("mobileOtp");
  
    if (!code || code.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
  
    try {
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      
      // Optional: Send verification to your backend
      try {
        const idToken = await user.getIdToken();
        const token = localStorage.getItem("token");
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/verify-mobileotp`,
          { idToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } catch (backendError) {
        console.error("Backend verification error:", backendError);
      }
  
      setIsMobileOtpVerified(true);
      setCurrentStep(3);
      toast.success("Mobile number verified!");
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error("Invalid OTP. Please try again.");
    }
  };
  


  {/*const handleVerifyMobileOTP = async () => {
    try {
      const otp = watch("mobileOtp");
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      // Send Firebase ID token to your backend
      const idToken = await user.getIdToken();
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/verify-mobileotp`,
        { idToken },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      toast.success('Mobile number verified!');
      setIsMobileOtpVerified(true);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
    }
  };*/}

  {/*const handleVerifyMobileOTP = async () => {
    try {
      const otp = watch("mobileOtp");
      if (!otp || otp.length !== 6) {
        toast.error("Please enter a valid 6-digit OTP");
        return;
      }
  
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/verify-mobileotp`,
        { 
          verificationId, // From the send OTP response
          otp 
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (response.data.success) {
        toast.success('Mobile number verified successfully!');
        setIsMobileOtpVerified(true);
        setCurrentStep(3); // Move to next step
        
        // If you get a token from backend, store it
        if (response.data.token) {
          localStorage.setItem('firebaseToken', response.data.token);
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(
        error.response?.data?.error || "Invalid OTP. Please try again."
      );
    }
  };*/}
  const handleSubmitVerification = async () => {
    if (!selfieImage) {
      toast.error("Please take a selfie first", { position: "top-center" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/complete-verification`,
        { selfieImage },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setShowSuccess(true);
        toast.success("Verification completed successfully!", { position: "top-center" });
      }
    } catch (error) {
      console.error("Verification submission error:", error);
      toast.error(
        error.response?.data?.message || "Failed to complete verification. Please try again.",
        { position: "top-center" }
      );
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Email verification step
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                value={userData.email || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <Button
                onClick={handleSendEmailOTP}
                className={`w-full mb-4 ${buttonStyles}`}
                disabled={otpSent}
              >
                {otpSent ? "OTP Sent" : "Send OTP"}
              </Button>
              {otpSent && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  <OTPInput
                    value={watch("otp")}
                    onChange={(value) => setValue("otp", value)}
                  />
                  <Button
                    onClick={handleVerifyEmailOTP}
                    className={`w-full mt-4 ${buttonStyles}`}
                    disabled={watch("otp")?.length !== 6}
                  >
                    Verify Email
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 2: // Mobile verification step
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
                disabled={mobileOtpSent}
              >
                {mobileOtpSent ? "OTP Sent" : "Send OTP"}
              </Button>
              {mobileOtpSent && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  <OTPInput
                    value={watch("mobileOtp")}
                    onChange={(value) => setValue("mobileOtp", value)}
                  />
                  <Button
                    onClick={handleVerifyMobileOTP}
                    className={`w-full mt-4 ${buttonStyles}`}
                    disabled={watch("mobileOtp")?.length !== 6}
                  >
                    Verify Mobile
                  </Button>
                </div>
              )}
              <div id="recaptcha-container" style={{ display: 'none' }}></div>
            </div>
          </div>
        );

      case 3: // Selfie verification step
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
      {/*<div 
        id="recaptcha-container" 
        ref={recaptchaContainerRef}
        style={{ display: 'none' }}
      />*/}

<div id="recaptcha-container" ref={recaptchaContainerRef}></div>


     
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.id <= currentStep
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
                    className={`w-12 h-1 mx-2 ${
                      step.id < currentStep ? "bg-[#578cff]" : "bg-gray-200"
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