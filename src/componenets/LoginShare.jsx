import React, { useState } from "react";
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
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../componenets/Welcome/button";
import { Card, CardContent } from "../componenets/Welcome/card";
import { Checkbox } from "../componenets/Welcome/checkbox";

const LoginFormShare = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchUserDetails } = useContext(Context);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAmount, setWalletAmount] = useWallet();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetLoginForm,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/login`,
        data,
        { withCredentials: true }
      );
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      
      const queryParams = new URLSearchParams(location.search);
      const postId = queryParams.get("postId");
      
      if (postId) {
        localStorage.setItem("sharedPostId", postId);
        sessionStorage.setItem("sharedPostId", postId);
        window.location.href = `/livefeed/displaypost?postId=${postId}`;
      } else {
        navigate("/");
      }
      
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Button
        onClick={() => navigate("/")}
        className="mb-6 flex bg-blue-900 items-center gap-2 hover:bg-white hover:text-blue-900 border hover:border-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>

      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Log In to View Post</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your credentials to view the shared content
          </p>
        </div>

        <Card className="rounded-lg shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#578cff] focus:border-transparent"
                  {...register("username", { required: "Username is required" })}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#578cff] focus:border-transparent"
                    {...register("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me + forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="rememberMe"
                    className="border-gray-300"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-[#578cff] hover:text-[#4171ff] font-medium"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-[29px] font-medium text-white text-sm tracking-[-0.14px] bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Log In"
                )}
              </Button>

              {/* Sign up link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Not a Magnifier user?{" "}
                  <Link
                    to="/"
                    className="text-[#578cff] hover:text-[#4171ff] font-medium"
                  >
                    Click here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginFormShare;