import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import Context from "../context/context.jsx";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserDetails } from "../features/user/userSlice.js";

const LoginForm = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const {fetchUserDetails}= useContext(Context)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset:resetLoginForm,
  } = useForm();

  const onSubmit =async (data) => {
    console.log("Login Data:", data);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, data, {
        withCredentials: true
      });
      const { token, user } = response.data;


      const dataApi = response.data;
  
      if (dataApi.success) {
       
        fetchUserDetails(); 
       
      } 
      if (response.data.token) {
        console.log("Received Token:", response.data.token);
        localStorage.setItem('token', response.data.token); // Save the token in localStorage
       
    }
    dispatch(setUserDetails(user));

      //alert("Login successfull")
      toast.success("You are logged in")
      navigate('/landing')
      resetLoginForm()
      console.log(response);
      
      
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('An error occurred during sign-in.');
    }
  };

  return (
    <div className=" h-96 ml-5 mr-20 mt-6  bg-gradient-to-r from-slate-100 to-slate-100 p-6 rounded-lg shadow-md">
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
          className="w-full bg-blue-600 hover:bg-blue-800 text-white py-2 rounded"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
