import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/reset-password`, {
        resetToken: token,
        newPassword: password,
      }, {
        headers: {
          "Content-Type": "application/json", // Ensure JSON format
        }
      });
      toast.success(response.data.message);
      setPassword(""); 
      setConfirmPassword(""); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password!");
    }
  };

  return (
    <div className="min-h-screen lg:ml-80 flex items-center justify-center mx-5 mt-6 bg-gradient-to-r from-slate-100 to-slate-100 p-6 rounded-lg shadow-md sm:w-full md:w-3/4 lg:w-1/2 xl:w-1/3">
    <div className="w-full">
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-4">Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-3 p-2 border border-slate-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full mb-3 p-2 border border-slate-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        className="w-full bg-blue-600 hover:bg-blue-800 text-white py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleResetPassword}
      >
        Reset Password
      </button>
    </div>
  </div>
  
  );
};

export default ResetPassword;
