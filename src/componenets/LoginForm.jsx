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

const LoginForm = () => {
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
    
      setLoading(false);
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
        navigate("/landing")
   
      resetLoginForm()
      
    
      
      
    } catch (error) {
      setLoading(false);
      console.error('Error signing in:', error);
      toast.error('An error occurred during sign-in.');
    }
  };

  return (
    <div className=" h-96 ml-5 mr-20 mt-6  bg-gradient-to-r from-slate-100 to-slate-100 p-6 rounded-lg shadow-md">
    <p className="text-center text-md font-semibold text-gray-700  animate-pulse bounce">
If you are a registered user, Please <span className="text-blue-600 ">login here</span>
</p>
 <h2 className="text-2xl text-center font-bold text-gray-800 mb-4">Log In</h2>
 <form className="lg:w-96 flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
   {/* Username Field */}
   <input
     type="text"
     placeholder="Username"
     className="w-full mb-3 p-2 border border-slate-400 rounded"
     {...register("username", { required: "Username is required" })}
   />
   {errors.username && (
     <p className="text-red-500 text-sm">{errors.username.message}</p>
   )}

   {/* Password Field */}
   <input
     type="password"
     placeholder="Password"
     className="w-full mb-3 p-2 border border-slate-400 rounded"
     {...register("password", { required: "Password is required" })}
   />
   {errors.password && (
     <p className="text-red-500 text-sm">{errors.password.message}</p>
   )}

   {/* Submit Button */}
   <button
  type="submit"
  className={`w-full py-2 rounded ${
    loading
      ? "bg-blue-300 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-800 text-white"
  }`}
  disabled={loading}
>
  {loading ? "Logging in..." : "Log In"}
</button>
  
 </form>
 

 <div className="w-full text-left mt-2">
<button
type="button"
className="text-slate-500 hover:underline"
onClick={() => navigate("/forgot-password")}
>
Forgot Password?
</button>
</div>

</div>
  )        
};

export default LoginForm;
