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

const AuthBengal = () => {
    const location = useLocation();
    const [showJobForm, setShowJobForm] = useState(false);

    // Extract state from URL query
    const state = new URLSearchParams(location.search).get("state") || "West Bengal";

    // Vidhan Sabha options
    const [vidhanSabhaOptions, setVidhanSabhaOptions] = useState([]);

    // React Hook Form setup for Signup
    const {
        register: registerSignup,
        handleSubmit: handleSignupSubmit,
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
           "West Bengal": ["Alipurduars", "Ashoknagar", "Bally", "Bangaon", "Barabani", "Baranagar", "Baraipur", "Barjora", "Basirhat", "Bethuadahari", 
  "Bishnupur", "Bolpur", "Cooch Behar North", "Cooch Behar South", "Chandernagore", "Chanditala", "Daspur", "Dharmadam", "Dum Dum", 
  "Durgapur", "Galsi", "Gangarampur", "Haldia", "Hanskhali", "Haringhata", "Haripal", "Hasnabad", "Hingalganj", "Hugli", "Jangipur", 
  "Jorasanko", "Joynagar", "Kaliaganj", "Kamarhati", "Kanksa", "Kolkata Dakshin", "Kolkata Uttar", "Kolar", "Malda Dakshin", "Malda Uttar", 
  "Mathurapur", "Midnapore", "Mursidabad", "Murarai", "Nadia", "Naihati", "Nandigram", "Nandrol", "Nayagram", "Nobatpara", "Panchla", 
  "Panskura", "Purba Medinipur", "Purulia", "Raghunathganj", "Rajapur", "Sagar", "Sainthia", "Saltora", "Srirampur", "Siliguri", 
  "Sonarpur", "Sreerampur", "Sriniketan", "Tamluk", "Tarakeswar", "Uttarpara", "Uluberia", "Howrah", "Shibpur", "Chandannagar", 
  "Jadavpur", "Ballygunge", "Behala", "Garia", "Kolkata South", "Kolkata West", "Kolkata East", "Barrackpore", "Chinsurah", "Maheshtala", 
  "Kolar", "Baruipur", "Santipur", "Bongaon", "Rajbari", "Gajol", "Raiganj", "Kushmandi", "Balurghat"],

        };
        setVidhanSabhaOptions(vidhanSabhas[state] || []);
    }, [state]);



    const onSignupSubmit = async (data) => {
        try {

            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/signup`, data, {
                withCredentials: true,
            })
            if (res.data.token) {
                localStorage.setItem('token', res.data.token); // Save the token in localStorage
                alert('Signup successful! You are now logged in.');
                resetSignupForm()
            }

            console.log("res data", res);
            toast.success("User signed up successfully!");
            alert("signup sucess")
            if (res.status === 201) {
                toast.success("User signed up successfully!");
            }

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
                    <h2 className="text-2xl text-center  font-bold text-gray-800 mb-4">Sign Up </h2>
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
                            {...registerSignup("wardNumber", { required: "Vidhan Sabha is required" })}
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
                                },
                            })}
                        />
                        {signupErrors.email && (
                            <p className="text-red-500 text-sm">{signupErrors.email.message}</p>
                        )}

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
                        className="text-black mt-4 underline hover:scale-105 hover:ml-2 cursor-pointer"
                        onClick={() => setShowJobForm(!showJobForm)}
                    >
                        Apply for a Job
                    </Link>
                </div>


            </div>
            <LoginForm />

        </div>
    )
};

export default AuthBengal;
