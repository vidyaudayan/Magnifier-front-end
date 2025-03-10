import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../componenets/Navbar";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import LoginForm from "../componenets/LoginForm";
import image from '../assets/Images/loginback.avif'
import 'animate.css';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserDetails } from "../features/user/userSlice";
import VerificationPage from "./VerificationPage";

const AuthDelhi = () => {
    const location = useLocation();
    const [showJobForm, setShowJobForm] = useState(false);
    //otp verification
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

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Extract state from URL query
    const state = new URLSearchParams(location.search).get("state") || "Delhi";

    // Vidhan Sabha options
    const [vidhanSabhaOptions, setVidhanSabhaOptions] = useState([]);

    // React Hook Form setup for Signup
    const {
        register: registerSignup,
        handleSubmit: handleSignupSubmit,
        formState: { errors: signupErrors },
        getValues,
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
            Delhi: [
                "Adarsh Nagar", "Ambedkar Nagar", "Babarpur", "Badarpur", "Badli", "Ballimaran",
                "Bawana", "Bijwasan", "Burari", "Chandni Chowk", "Chhatarpur", "Deoli",
                "Delhi Cantonment", "Dwarka", "Gandhi Nagar", "Ghonda", "Gokalpur", "Greater Kailash",
                "Hari Nagar", "Janakpuri", "Jangpura", "Karawal Nagar", "Karol Bagh", "Kasturba Nagar",
                "Kalkaji", "Kirari", "Kondli", "Krishna Nagar", "Laxmi Nagar", "Madipur",
                "Malviya Nagar", "Mangolpuri", "Matiala", "Matia Mahal", "Mehrauli", "Model Town",
                "Moti Nagar", "Mundka", "Mustafabad", "Najafgarh", "Nangloi Jat", "Narela",
                "New Delhi", "Okhla", "Palam", "Patel Nagar", "Patparganj", "Rajinder Nagar",
                "Rajouri Garden", "Rithala", "Rohini", "R.K. Puram", "Sadar Bazar", "Sangam Vihar",
                "Seelampur", "Seemapuri", "Shahdara", "Shakur Basti", "Shalimar Bagh", "Sultanpur Majra",
                "Tilak Nagar", "Timarpur", "Tri Nagar", "Trilokpuri", "Tughlakabad", "Uttam Nagar",
                "Vikaspuri", "Vishwas Nagar", "Wazirpur"],

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
            toast.success("Signup completed! please verify your email and mobile for login ");
           
            alert("signup sucess")
            // if (res.status === 201) {
            //  toast.success("User signed up successfully!");
            // }

        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error("User already exists. Please use a different email.");
            } else {
                toast.error("Signup failed. Please try again.");
            }
            console.log(error);

        };
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
                            className="w-full mb-3 p-2 border border-slate-400  rounded"
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
                            {Array.from({ length: 500 }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>

                        {/*<input
                            type="email"
                            placeholder="Email"
                            className="w-full mb-3 p-2 border border-slate-400 rounded"
                            {...registerSignup("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: "Invalid email address",
                                },
                            })}
                        />
                        {signupErrors.email && (
                            <p className="text-red-500 text-sm">{signupErrors.email.message}</p>
                        )}

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
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
            </div>

            {/* OTP Section */}
                        {/*{otpSent ? (
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        className="w-full mb-3 p-2 border border-slate-400 rounded"
                        {...registerSignup("otp", { required: "OTP is required" })}
                    />
                    {signupErrors.otp && (
                        <p className="text-red-500 text-sm">{errors.otp.message}</p>
                    )}
                    <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => handleVerifyOtp(getValues("otp"))}
                    >
                        Verify OTP
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleSendOtp}
                >
                    Send OTP
                </button>
            )}*/}



                        {/* Email Input */}
                        <div className="mb-">
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

                        {/* OTP Section - Show only if not verified */}
                        {/* {!isOtpVerified && otpSent ? (
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
                        ) : null} */}

                        {/* Send OTP Button - Hide after verification */}
                        {/* {!isOtpVerified && !otpSent && (
                            <button
                                type="button"
                                className="bg-blue-500 mb-4 text-white px-4 py-2 rounded"
                                onClick={handleSendOtp}
                            >
                                Send OTP
                            </button>
                        )} */}

                        {/* Show success message when verified */}
                        {/* {isOtpVerified && (
                            <div className="text-green-500 mb-2 text-sm font-semibold">
                                OTP successfully verified!
                            </div>
                        )} */}



                        {/*<div>
                            {step === 1 ? (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        className="w-full mb-3 p-2 border border-slate-400 rounded"
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

                                    <button className="bg-blue-500 mb-4 text-white px-4 py-2 rounded" onClick={handleSendMobileOtp}>Send mobile OTP</button>
                                </>
                            ) : (
                                <>
                                    <h3>Enter the OTP</h3>
                                    <input
                                        type="text"
                                        placeholder="OTP"
                                        value={mobileOtp}
                                        onChange={(e) => setMobileOtp(e.target.value)}
                                    />
                                    <button onClick={handleVerifyMobileOtp}>Verify Mobile OTP</button>
                                </>
                            )}
                        </div>*/}


                          <div className="mb-">
                          <input
                                        type="number"
                                        placeholder="Phone Number"
                                        className="w-full mb-3 p-2 border border-slate-400 rounded"
                                        //value={phoneNumber}
                                        //onChange={(e) => setPhoneNumber(e.target.value)}
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

                        {/* </div> */}

                        {/* OTP Section - Show only if not verified */}
                        {/* {!isMobileOtpVerified && mobileOtpSent ? (
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    className="w-full mb-3 p-2 border border-slate-400 rounded"
                                    {...registerSignup("mobileOtp", { required: "Mobile OTP is required" })}
                                />
                                {signupErrors.mobileOtp && (
                                    <p className="text-red-500 text-sm">{signupErrors.mobileOtp.message}</p>
                                )} */}
                                {/* <button
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={ handleVerifyMobileOtp}
                                >
                                    Verify Mobile OTP
                                </button> */}
                            </div>
                        {/* ) : null} */}

                        {/* Send OTP Button - Hide after verification */}
                        {/* {!isMobileOtpVerified && !mobileOtpSent && (
                            <button
                                type="button"
                                className="bg-blue-500 mb-4 text-white px-4 py-2 rounded"
                                onClick={handleSendMobileOtp}
                            >
                                Send Mobile OTP
                            </button>
                        )} */}

                        {/* Show success message when verified */}
                        {/* {isMobileOtpVerified && (
                            <div className="text-green-500 mb-2 text-sm font-semibold">
                               Mobile OTP successfully verified!
                            </div>
                        )} */}


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
                   <div className="flex flex-row justify-between">
                   < Link to={'/verification'}
                        className="text-black mt-4 underline font-semibold pt-1 hover:scale-105 hover:ml-2 cursor-pointer"

                    >
                        Verify Account
                    </Link>
                    < Link to={'/job-application'}
                        className="text-black mt-4 underline font-semibold pt-1 hover:scale-105 hover:ml-2 cursor-pointer"

                    >
                        Apply for a Job
                    </Link>
                   </div>
                </div>


            </div>
            <LoginForm />

        </div>
    )
};

export default AuthDelhi;