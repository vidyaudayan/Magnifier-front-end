import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { Button } from "../../componenets/Welcome/button";
import { Card, CardContent } from "../../componenets/Welcome/card";
import { Checkbox } from "../../componenets/Welcome/checkbox";
import { useToast } from "../../componenets/Welcome/use-toast";
import { Toaster } from "../../componenets/Welcome/toaster";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../features/user/userSlice";
import LoginImage from '../../assets/Images/LoginImage.png';


const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const MediaMagnifierLogin = () => {

    const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/login`,
        {
          username: data.username,
          password: data.password,
          appName: "mediaMagnifier",
        },
        {
          withCredentials: true,
        }
      );

      const { token, user } = response.data;

      if (data.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      if (token) {
        localStorage.setItem("token", token);
      }

      if (user && user.id && user.username) {
        dispatch(setUserDetails(user));
      }

    //   // ✅ New: Show toast if user is not subscribed
    //  if (!user?.subscribed) {
    //   toast({
    //     title: "Subscription Required",
    //     description: "You are not subscribed. Please subscribe to access full features.",
    //     variant: "warning",
    //   });
    // }

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
        const { walletAmount } = walletResponse.data;
        console.log("Wallet Initialized:", walletAmount);
      } catch (walletError) {
        console.error("Error initializing wallet:", walletError);
      }

      toast({
        title: "Success",
        description: "You are logged in",
        variant: "default",
      });

      reset();
      navigate("/dashboard/media");
    } catch (error) {
    const message = error.response?.data?.message;
    const reason = error.response?.data?.reason;

    console.error("Error signing in:", error);

    if (reason === "not_subscribed") {
      toast({
        title: "Subscription Required",
        description: message || "You are not subscribed. Please subscribe.",
        variant: "warning",
      });

      return navigate("/subscriptionflow");
    }

    toast({
      title: "Error",
      description: message || "An error occurred during sign-in.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
  };




  return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f8ff] px-4 py-8 sm:py-0">
        {/* Main container - column on mobile, row on large screens */}
        <div className="flex flex-col lg:flex-row bg-white shadow-xl rounded-3xl overflow-hidden w-full max-w-5xl">
          {/* Image - Top on mobile, right side on desktop */}
          <div className="w-full lg:w-1/2 bg-[#f7f9fc] p-6 flex items-center justify-center order-1 lg:order-2">
            <img
              src={LoginImage}
              alt="Login Illustration"
              className="w-full max-w-md max-h-64 lg:max-h-[450px] object-contain"
            />
          </div>
  
          {/* Form - Bottom on mobile, left side on desktop */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Login</h1>
            <p className="text-gray-600 text-base mb-6">Access your account</p>
  
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  {...register("username")}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
                )}
              </div>
  
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>
  
              {/* Remember me + Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="rememberMe"
                    checked={watch("rememberMe")}
                    onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot password?
                </button>
              </div>
  
              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl font-semibold text-white text-sm bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
              </Button>
  
              {/* Sign up */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
        <Toaster />
      </div>
    );
  };