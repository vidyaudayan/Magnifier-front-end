import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios"; // Make sure to import axios
import { Button } from "../../componenets/Welcome/button";
import { Card, CardContent } from "../../componenets/Welcome/card";
import { Checkbox } from "../../componenets/Welcome/checkbox";
import { useToast } from "../../componenets/Welcome/use-toast";
import { Toaster } from "../../componenets/Welcome/toaster";
import { useDispatch } from "react-redux"; // Import useDispatch if using Redux
import { setUserDetails } from "../../features/user/userSlice";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch(); // Initialize dispatch if using Redux
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
    console.log("Login Data:", data);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/login`,
        {
          username: data.username,
          password: data.password
        },
        {
          withCredentials: true
        }
      );

      const { token, user } = response.data;
      console.log('Full API Response:', response.data);
      // Handle remember me functionality if needed
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      localStorage.setItem('token', token);
      // Save token to localStorage
      if (token) {
        console.log("Received Token:", token);
        localStorage.setItem('token', token);
      }

      console.log("User payload before dispatch:", user);

      if (user && user.id && user.username) {
        dispatch(setUserDetails(user));
      } else {
        console.warn("User data is incomplete or undefined:", user);
      }

      dispatch(setUserDetails(user));

      // Dispatch user details to Redux store if using Redux
      {/*if (user) {
        dispatch(setUserDetails(user));
      }*/}

      // Dispatch user details to Redux store
      {/*if (user) {
  dispatch(setUserDetails({
    _id: user.id, // Ensure this matches your backend
    username: user.username,
    profilePic: user.profilePic, // or whatever your backend calls it
    // Include other necessary fields
  }

));
dispatch(setUserDetails(user));
console.log('Dispatched user data:', user);
}

      // Initialize wallet
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
        const { walletAmount: initializedAmount } = walletResponse.data;
        console.log("Wallet Initialized:", initializedAmount);
        // You might want to store this in state/context/Redux
      } catch (walletError) {
        console.error("Error initializing wallet:", walletError);
      }*/}

      // Show success message
      toast({
        title: "Success",
        description: "You are logged in",
        variant: "default",
      });

      // Reset form and navigate
      reset();
      navigate("/livefeed/");

    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || 'An error occurred during sign-in.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToStateSelection = () => {
    const stateSection = document.getElementById("state-selection");
    if (stateSection) {
      stateSection.scrollIntoView({ behavior: "smooth" });
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
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your credentials to continue
          </p>
        </div>

        <Card className="rounded-lg shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Rest of your form remains the same */}
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  {...register("username")}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#578cff] focus:border-transparent"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#578cff] focus:border-transparent"
                    placeholder="Enter your password"
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
                    checked={watch("rememberMe")}
                    onCheckedChange={(checked) =>
                      setValue("rememberMe", !!checked)
                    }
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

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-[29px] font-medium text-white text-sm tracking-[-0.14px] bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>

              {/* Sign up link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    //onClick={scrollToStateSelection}
                    onClick={() => navigate("/")}
                    className="text-[#578cff] hover:text-[#4171ff] font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};