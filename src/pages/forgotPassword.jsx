import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Email is required!");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/forgot-password`, { email });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to process request!"
      );
    }
  };

  return (
    <div className="h-96 ml-5 mr-20 mt-6 bg-gradient-to-r from-slate-100 to-slate-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-4">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-3 p-2 border border-slate-400 rounded"
      />
      <button
        className="w-full bg-blue-600 hover:bg-blue-800 text-white py-2 rounded"
        onClick={handleForgotPassword}
      >
        Submit
      </button>
    </div>
  );
};

export default ForgotPassword;
