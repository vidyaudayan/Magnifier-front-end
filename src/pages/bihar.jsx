import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../componenets/Navbar";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import LoginForm from "../componenets/LoginForm";
import { useNavigate } from 'react-router-dom';
import image from '../assets/Images/loginback.avif'
import 'animate.css';
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUserDetails } from "../features/user/userSlice";

export const AuthBihar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showJobForm, setShowJobForm] = useState(false);
   
   const [email, setEmail] = useState("");
       const [otpSent, setOtpSent] = useState(false);
       const [mobileOtpSent, setMobileOtpSent] = useState(false);
       const [otp, setOtp] = useState("");
       const [token, setToken] = useState(null);
       const [isOtpVerified, setIsOtpVerified] = useState(false);
       const [isMobileOtpVerified, setIsMobileOtpVerified] = useState(false);
   
       const [phoneNumber, setPhoneNumber] = useState('');
       const [mobileOtp, setMobileOtp] = useState('');
       const [step, setStep] = useState(1);
   
   
   
   
    const dispatch = useDispatch();
    // Extract state from URL query
    const state = new URLSearchParams(location.search).get("state") || "Bihar";

    // Vidhan Sabha options
    const [vidhanSabhaOptions, setVidhanSabhaOptions] = useState([]);

    // React Hook Form setup for Signup
    const {
        register: registerSignup,
        handleSubmit: handleSignupSubmit,
        getValues,
        formState: { errors: signupErrors },
        reset: resetSignupForm,
        setValue,  // To manually set the file value
    } = useForm();

    // React Hook Form setup for Job Application
    const {
        register: registerJob,
        handleSubmit: handleJobSubmit,
        formState: { errors: jobErrors },
        reset: resetJobForm,
    } = useForm();

    // Populate Vidhan Sabha options
    useEffect(() => {
        const vidhanSabhas = {
            Bihar: [
                "Adhaura",  "Agiaon", "Alamnagar", "Amarpur", "Amour", "Amdabad", "Arah", 
"Araria","Arwal", "Aurangabad", "Aurangabad", "Bagaha", "Bahadurganj", 
"Bajpatti", "Bakhtiarpur", "Banka", "Bankipur", "Banmankhi", "Barahat", 
"Barari", "Barbigha", "Barhara", "Barh", "Barachatti", "Bariarpur", 
"Bathnaha", "Baisi", "Belaganj", "Belhar", "Belsand", "Benipatti", 
"Bettiah", "Bhabua", "Bihpur", "Bihariganj","Bikram", "Bisfi", "Bodh Gaya", 
"Brahmpur","Buxar", "Chanpatia", "Chakai", "Chainpur", "Chhatapur", "Chiraiya", 
"Chenari", "Colgong", "Danapur","Darauli", "Dehri", "Dhamdaha", "Dhaka", 
"Digha", "Dumraon", "Fatuha", "Forbesganj", "Gaya", "Gaya Town", 
"Ghosi", "Gobindpur", "Govindganj", "Gurua","Hajipur","Harsidhi", "Harlakhi", 
"Hisua", "Imamganj","Islampur", "Jamui", "Jamui", "Jehanabad", "Jagdishpur", 
"Jhanjharpur", "Jhajha", "Jokihat", "Kahalgaon", "Kalyanpur", 
"Kasba", "Katihar", "Kargahar", "Karakat", "Kesaria","Khajauli", "Kishanganj", 
"Korha", "Kurtha", "Kutumba"," Lakhisarai", "Lauriya", "Laukaha", "Madhepura", 
"Madhubani"," Maharajganj", "Mahishi", "Makhdumpur", "Maner", "Manihari", "Masaurhi", 
"Matihari", "Mohania", "Motihari", "Mokama", "Munger", "Nabinagar", 
"Narkatia", "Narkatiaganj", "Narpatganj", "Nautan", "Nawada", 
"Nirmali", "Nokha", "Paliganj", "Parihar", "Patliputra", "Patna Sahib", 
"Phulparas", "Pirpainti", "Pipra", "Piro", "Pranpur", "Ramnagar", 
"Rafiganj", "Raghopur","Rajauli", "Rampur", "Raniganj", "Raxaul", "Riga", 
"Riga", "Rupauli", "Runnisaidpur", "Sandesh", "Saharsa", "Sasaram", 
"Sheikhpura", "Sheohar", "Sherghati", "Shahpur", "Simri Bakhtiyarpur", 
"Singheshwar", "Sitamarhi", "Sikandra", "Sikta","Siwan", "Sugauli", "Sultanganj", 
"Supaul", "Sursand", "Tikari", "Tarari", "Tarapur", "Thakurganj", 
"Triveniganj","Ujiarpur","Valmiki Nagar", "Wazirganj", "Warsaliganj"

            ],

        };
        setVidhanSabhaOptions(vidhanSabhas[state] || []);
    }, [state]);



    const onSignupSubmit = async (data) => {
        try {

            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/signup`, data, {
                withCredentials: true,
            })
            const { token, user } = res.data;
            if (res.data.token) {
                localStorage.setItem('token', res.data.token); // Save the token in localStorage
                //alert('Signup successful! You are now logged in.');
                resetSignupForm()
            }
            dispatch(setUserDetails(user));
            console.log("res data", res);
            toast.success("User signed up successfully!");
            //alert("signup sucess")
        
            if (res.status === 201) {
                toast.success("User signed up successfully!");
            }
            navigate('/landing')

        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error("User already exists. Please use a different email.");
            } else {
                toast.error("Signup failed. Please try again.");
            }
            console.log(error);

        };
    };

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
        <div className="min-h-screen  bg-slate-200   flex flex-col  lg:flex-row justify-center lg:justify-evenly gap-6 lg:gap-0   mt-20">
            <Navbar />
            <div className=" max-w-5xl lg:w-[600px]  flex flex-wrap lg:mr-10  gap-0 p-6">
                {/* Signup Form */}
                <div className="w-full p-6 rounded-lg  shadow-md bg-gradient-to-r sm:flex-col from-slate-100 to-slate-100">
                <p className="text-center text-md font-semibold text-gray-700  animate-pulse bounce">
  If you are a new user, Please <span className="text-blue-600 ">register here</span>
</p>
                    <h2 className="text-2xl text-center  font-bold text-gray-800 mb-4 mt-2">Sign Up </h2>
                    <form className="" onSubmit={handleSignupSubmit(onSignupSubmit)}>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full mb-3 p-2 border border-slate-400 rounded"
                            {...registerSignup("name", { required: "Name is required" })}
                        />
                        {signupErrors.name && (
                            <p className="text-red-500 text-sm">{signupErrors.name.message}</p>
                        )}

                        <input
                            type="text"
                            placeholder="Magnifier Username"
                            className="w-full mb-3 p-2 border border-slate-400 rounded"
                            {...registerSignup("username", { required: "Magnifier username is required" })}
                        />
                        {signupErrors.name && (
                            <p className="text-red-500 text-sm">{signupErrors.username.message}</p>
                        )}

                        <input
                            type="text"
                            placeholder="Father's Name"
                            className="w-full mb-3 p-2 border border-slate-400 rounded"
                            {...registerSignup("fatherName", {
                                required: "Father's Name is required",
                            })}
                        />
                        {signupErrors.fatherName && (
                            <p className="text-red-500 text-sm">{signupErrors.fatherName.message}</p>
                        )}

                        <input
                            type="number"
                            placeholder="Age"
                            className="w-full mb-3 p-2 border border-slate-400 rounded"
                            {...registerSignup("age", {
                                required: "Age is required",
                                valueAsNumber: true,
                            })}
                        />
                        {signupErrors.age && (
                            <p className="text-red-500 text-sm">{signupErrors.age.message}</p>
                        )}

                        <select
                            className="w-full mb-3 p-2 text-gray-500 border border-slate-400 rounded"
                            {...registerSignup("gender", { required: "Gender is required" })}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {signupErrors.gender && (
                            <p className="text-red-500 text-sm">{signupErrors.gender.message}</p>
                        )}

                        <select
                            className="w-full mb-3 p-2 text-gray-500 border border-slate-400 rounded"
                            {...registerSignup("vidhanSabha", { required: "Vidhan Sabha is required" })}
                        >
                            <option value="">Select Vidhan Sabha</option>
                            {vidhanSabhaOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {signupErrors.vidhanSabha && (
                            <p className="text-red-500 text-sm">{signupErrors.vidhanSabha.message}</p>
                        )}

                        <select
                            className="w-full mb-3 p-2 text-gray-500 border border-slate-400 rounded"
                            {...registerSignup("wardNumber")}
                        >
                            <option value="">Select Ward Number</option>
                            {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>

                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full mb-3 p-2 border border-slate-400 rounded"
                            {...registerSignup("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: "Invalid email address",
                                },  onChange: (e) => setEmail(e.target.value),
                            })}
                        />
                        {signupErrors.email && (
                            <p className="text-red-500 text-sm">{signupErrors.email.message}</p>
                        )}


                        {/* OTP Section - Show only if not verified */}
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

                        {/* Send OTP Button - Hide after verification */}
                        {!isOtpVerified && !otpSent && (
                            <button
                                type="button"
                                className="bg-blue-500 mb-4 text-white px-4 py-2 rounded"
                                onClick={handleSendOtp}
                            >
                                Send OTP
                            </button>
                        )}

                        {/* Show success message when verified */}
                        {isOtpVerified && (
                            <div className="text-green-500 mb-2 text-sm font-semibold">
                                OTP successfully verified!
                            </div>
                        )}


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

                        {/* OTP Section - Show only if not verified */}
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
                                    onClick={ handleVerifyMobileOtp}
                                >
                                    Verify Mobile OTP
                                </button>
                            </div>
                        ) : null}

                        {/* Send OTP Button - Hide after verification */}
                        {!isMobileOtpVerified && !mobileOtpSent && (
                            <button
                                type="button"
                                className="bg-blue-500 mb-4 text-white px-4 py-2 rounded"
                                onClick={handleSendMobileOtp}
                            >
                                Send Mobile OTP
                            </button>
                        )}

                        {/* Show success message when verified */}
                        {isMobileOtpVerified && (
                            <div className="text-green-500 mb-2 text-sm font-semibold">
                               Mobile OTP successfully verified!
                            </div>
                        )}


                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full mb-3 p-2 border border-slate-400 rounded"
                            {...registerSignup("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                        />
                        {signupErrors.password && (
                            <p className="text-red-500 text-sm">{signupErrors.password.message}</p>
                        )}



                        <button
                            className="w-full bg-blue-600 hover:bg-blue-800 text-white py-2 rounded"
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </form>
                    <Link to={'/job-application'}
                        className="text-black mt-4 font-semibold pt-1 underline hover:scale-105 hover:ml-2 cursor-pointer"
                     
                    >
                        Apply for a Job
                    </Link>
                </div>


            </div>
            <LoginForm />

        </div>
    )
};

export default AuthBihar;
