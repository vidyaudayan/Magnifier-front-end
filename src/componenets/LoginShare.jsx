import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import Context from "../context/context.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../features/user/userSlice.js";
import useWallet from "./hooks/useWallet.jsx";
import { Link } from "react-router-dom";
const LoginFormShare= () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchUserDetails } = useContext(Context);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetLoginForm,
  } = useForm();
  const [walletAmount, setWalletAmount] = useWallet();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/login`,
        data,
        { withCredentials: true }
      );
      const { token, user } = response.data;

      if (response.data.success) {
        const queryParams = new URLSearchParams(location.search);
        let postId = queryParams.get("postId");

        console.log("Extracted postId from URL:", postId);
        //navigate(postId ? `/post/${postId}` : "/post");
       
      if (postId) {
        localStorage.setItem("postId", postId); // Store in sessionStorage
      } else {
        postId = localStorage.getItem("postId"); // Retrieve if missing
      }
      console.log("Stored/Retrieved postId:", postId);
        
        //navigate(`/displaypost?postId=${postId}`);
     
      // Navigate to displaypost with postId
      navigate(postId ? `/displaypost?postId=${postId}` : "/displaypost");

        fetchUserDetails();
      }
      
      {/*else {
     
        navigate("/landing");
      }*/}

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      dispatch(setUserDetails(user));

      try {
        const walletResponse = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/wallet`,
          { withCredentials: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWalletAmount(walletResponse.data.walletAmount);
      } catch (walletError) {
        console.error("Error initializing wallet:", walletError);
      }

      toast.success("You are logged in");
      //navigate("/landing");
      resetLoginForm();
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("An error occurred during sign-in.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-xl">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">
          Log In
        </h2>
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Username Field */}
          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-300"
          >
            Log In
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mt-4">
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
        <div className="mt-2">
            <p className="text-slate-600">If you are not a Magnifier user, <Link to="/" className="underline text-slate-500">Please Click here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginFormShare;
