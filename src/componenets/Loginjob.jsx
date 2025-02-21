import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { useContext } from "react";
import Context from "../context/context.jsx";
import {useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserDetails } from "../features/user/userSlice.js";
import useWallet from "./hooks/useWallet.jsx";
import Navbar from "./Navbar.jsx";

const LoginJob = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {fetchUserDetails}= useContext(Context)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset:resetLoginForm,
  } = useForm();
  const [walletAmount, setWalletAmount] = useWallet();

  const onSubmit =async (data) => {
    setLoading(true);
    console.log("Login Data:", data);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, data, {
        withCredentials: true
      });
      const { token, user } = response.data;


      const dataApi = response.data;
      const success = true;
      if (success) {
        const queryParams = new URLSearchParams(location.search);
        const postId = queryParams.get("postId");
  
        // Redirect to posts with the highlighted post
        navigate(postId ? `/posts?highlightPost=${postId}` : "/posts");
      }
    
  
      if (dataApi.success) {
       
        fetchUserDetails(); 
       
      } 
      if (response.data.token) {
        console.log("Received Token:", response.data.token);
        localStorage.setItem('token', response.data.token); // Save the token in localStorage
       
    }
    dispatch(setUserDetails(user));

    try {
      const walletResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/wallet`, {withCredentials:true}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { walletAmount: initializedAmount } = walletResponse.data;
      setWalletAmount(initializedAmount); // Update wallet in frontend
      console.log("Wallet Initialized:", initializedAmount);
    } catch (walletError) {
      console.error("Error initializing wallet:", walletError);
    }


  
    //setWalletAmount(walletResponse.data.walletAmount); // Update wallet state
      //alert("Login successfull")
      toast.success("You are logged in")
      navigate('/landing')
      resetLoginForm()
      
    
      
      
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('An error occurred during sign-in.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 p-6">
      <Navbar/>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {/* Heading */}
        <p className="text-center text-sm md:text-md font-semibold text-gray-700 animate-pulse">
          If you are a registered user, please{" "}
          <span className="text-blue-600">login here</span>
        </p>
        <h2 className="text-2xl text-center font-bold text-gray-800 mt-4 mb-6">
          Log In
        </h2>
  
        {/* Login Form */}
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border border-slate-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>
  
          {/* Password Field */}
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border border-slate-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 rounded text-white bg-blue-600 hover:bg-blue-800 transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
  
        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-slate-500 hover:text-slate-700 hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginJob;
