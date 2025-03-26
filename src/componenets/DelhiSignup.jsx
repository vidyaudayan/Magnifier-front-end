import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../componenets/Navbar";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import LoginForm from "./LoginForm";
import image from '../assets/Images/loginback.avif'
import 'animate.css';
import NavbarWelcome from "./NavbarWelcome";

const DelhiSignup = () => {
  const location = useLocation();
  const [showJobForm, setShowJobForm] = useState(false);

  // Extract state from URL query
  const state = new URLSearchParams(location.search).get("state") || "Delhi";

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
      Delhi: [
      "Narela",
  "Burari",
  "Timarpur",
  "Adarsh Nagar",
  "Badli",
  "Rithala",
  "Bawana",
  "Mundka",
  "Kirari",
  "Sultanpur Majra",
  "Nangloi Jat",
  "Mangolpuri",
  "Rohini",
  "Shalimar Bagh",
  "Shakur Basti",
  "Tri Nagar",
  "Wazirpur",
  "Model Town",
  "Sadar Bazar",
  "Chandni Chowk",
  "Matia Mahal",
  "Ballimaran",
  "Karol Bagh",
  "Patel Nagar",
  "Moti Nagar",
  "Madipur",
  "Rajouri Garden",
  "Hari Nagar",
  "Tilak Nagar",
  "Janakpuri",
  "Vikaspuri",
  "Uttam Nagar",
  "Dwarka",
  "Matiala",
  "Najafgarh",
  "Bijwasan",
  "Palam",
  "Delhi Cantonment",
  "Rajinder Nagar",
  "New Delhi",
  "Jangpura",
  "Kasturba Nagar",
  "Malviya Nagar",
  "R.K. Puram",
  "Mehrauli",
  "Chhatarpur",
  "Deoli",
  "Ambedkar Nagar",
  "Sangam Vihar",
  "Greater Kailash",
  "Kalkaji",
  "Tughlakabad",
  "Badarpur",
  "Okhla",
  "Trilokpuri",
  "Kondli",
  "Patparganj",
  "Laxmi Nagar",
  "Vishwas Nagar",
  "Krishna Nagar",
  "Gandhi Nagar",
  "Shahdara",
  "Seemapuri",
  "Rohtas Nagar",
  "Seelampur",
  "Ghonda",
  "Babarpur",
  "Gokalpur",
  "Mustafabad",
  "Karawal Nagar"
      ],
     
    };
    setVidhanSabhaOptions(vidhanSabhas[state] || []);
  }, [state]);

  // Handle Signup Form Submission
  {/*const onSignupSubmit = async (data) => {
    try {
      // Create a new FormData object
      const formData = new FormData();

      // Append all the form data (text fields)
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      // Append the file (if present)
      const resumeFile = data.resume[0];
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      // Send the form data to the backend
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/signup`,
        formData,
        { 
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
      toast.success("User signed up successfully!");
      resetSignupForm();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("User already exists. Please use a different email.");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    }
  };*/}

  const onSignupSubmit = async (data) => {
try{

 const res= await axios.post(`${import.meta.env.VITE_BASE_URL}/user/signup`, data, {
        withCredentials: true,
      })
      if (res.data.token) {
        localStorage.setItem('token', res.data.token); // Save the token in localStorage
        alert('Signup successful! You are now logged in.');
         resetSignupForm()
      }
    
        console.log("res data",res);
       toast.success("User signed up successfully!");
alert("signup sucess")
    if (res.status === 201) {
        toast.success("User signed up successfully!");
      }
  
 } catch(error) {
        if (error.response && error.response.status === 400) {
          toast.error("User already exists. Please use a different email.");
        } else {
          toast.error("Signup failed. Please try again.");
        }
        console.log(error);
       
      };
  };



  // Handle Job Application Form Submission
  {/*const onJobSubmit =async(data) => {

    const formData = new FormData()
    
    {/*formData.append('voterCardNumber', voterCardNumber);
    formData.append('aadhaarNumber', aadhaarNumber);
    formData.append('experience', experience);
    formData.append('qualification', qualification);
    formData.append('resume', file); // File  

    formData.append("resume", data.resume[0])
    console.log("resume",data)
    console.log(data.resume[0])
    //delete data.resume
 
formData.append("jobApplicationDetails", JSON.stringify(data))
        console.log(data)
await axios.post(`${import.meta.env.VITE_BASE_URL}/user/jobapplication`, formData, {withCredentials:true})
      .then(res=>console.log(res))
      .catch(error=>console.log(error))
    console.log("Job Application Data:", data);
    console.log("formdata",formData)
    toast.success("Job application submitted!");
    resetJobForm();
  };*/}
  const onJobSubmit = async (data) => {
    const formData = new FormData();

    // Check if 'resume' is not empty and is a file object
    if (data.resume && data.resume.length > 0) {
        formData.append("resume", data.resume[0]);  // Append the first file from the FileList
    } else {
        console.log("Resume file not selected!");
        return;
    }

    // Append other form data
    delete data.resume;  // Delete the resume property from data since it's already added to FormData
    formData.append("jobApplicationDetails", JSON.stringify(data));

    // Log FormData to check if the data is correctly appended
    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }

    try {
      const token = localStorage.getItem('token');
      console.log( "job token",token)
const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/jobapplication`, formData,{ headers },{
            withCredentials: true,
        });
        alert("Job application submitted")
        console.log("Job application submitted successfully:", response);
        toast.success("Job application submitted!");
        resetJobForm();
    } catch (error) {
        console.log("Error submitting job application:", error.response || error.message);
    }
};

  
  

  return (
    <div className="min-h-screen w-full bg-blue-200 flex   mt-20">
      <NavbarWelcome />
      <div className="w-full max-w-5xl flex flex-wrap lg:flex-nowrap gap-8 p-6">
        {/* Signup Form */}
        <div className="w-full lg:w-1/2 p-6 rounded-lg shadow-md bg-gradient-to-r from-slate-100 to-slate-100">
          <h2 className="text-2xl text-center  font-bold text-gray-800 mb-4">Sign Up </h2>
          <form onSubmit={handleSignupSubmit(onSignupSubmit)}>
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-3 p-2 border  rounded"
              {...registerSignup("name", { required: "Name is required" })}
            />
            {signupErrors.name && (
              <p className="text-red-500 text-sm">{signupErrors.name.message}</p>
            )}

            <input
              type="text"
              placeholder="Father's Name"
              className="w-full mb-3 p-2 border rounded"
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
              className="w-full mb-3 p-2 border rounded"
              {...registerSignup("age", {
                required: "Age is required",
                valueAsNumber: true,
              })}
            />
            {signupErrors.age && (
              <p className="text-red-500 text-sm">{signupErrors.age.message}</p>
            )}

            <select
              className="w-full mb-3 p-2 text-gray-500 border rounded"
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
              className="w-full mb-3 p-2 text-gray-500 border rounded"
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
              className="w-full mb-3 p-2 text-gray-500 border rounded"
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
              className="w-full mb-3 p-2 border rounded"
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
              className="w-full mb-3 p-2 border rounded"
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
              className="w-full mb-3 p-2 border rounded"
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
              className="w-full bg-blue-400 hover:bg-blue-600 text-white py-2 rounded"
              type="submit"
            >
              Sign Up
            </button>
          </form>
          <p
            className="text-black mt-4 underline hover:scale-105 hover:ml-2 cursor-pointer"
            onClick={() => setShowJobForm(!showJobForm)}
          >
            Apply for a Job
          </p>
        </div>
                
        {/* Job Application Form */}
        {!showJobForm && (
  <div className="p-8 w-96 sm:ml-4 bg-blue-300 bg-[url('src/assets/Images/loginback1.avif')] bg-cover bg-center shadow-lg ">

   <div className="relative  z-10 text-blue-800 p-6 flex flex-col items-center justify-center space-y-4">
        <p className="text-lg font-semibold text-center animate-pulse">
          Interested in applying for a job?
        </p>
        <span className="text-md text-center animate-pulse animation-delay-2000">
          Click the link in the sign-up form
        </span>
      </div>

   
  </div>
)}

        {showJobForm && (
<div className=" lg:w-1/2 p-6 rounded-lg shadow-md bg-gradient-to-r from-pink-100 to-pink-100">
            <h2 className="text-2xl text-center font-bold text-gray-800 mb-4">Job Application</h2>
            <form onSubmit={handleJobSubmit(onJobSubmit)}>
              <input
                type="text"
                placeholder="Voter Card Number"
                className="w-full mb-3 p-2 border rounded"
                {...registerJob("voterCardNumber", { required: "Voter Card Number is required" })}
              />
              {jobErrors.voterCardNumber && (
                <p className="text-red-500 text-sm">{jobErrors.voterCardNumber.message}</p>
              )}

              <input
                type="text"
                placeholder="Adhaar Card Number"
                className="w-full mb-3 p-2 border rounded"
                {...registerJob("adhaarCardNumber", { required: "Adhaar Card Number is required" })}
              />
              {jobErrors.adhaarCardNumber && (
                <p className="text-red-500 text-sm">{jobErrors.adhaarCardNumber.message}</p>
              )}

              <input
                type=" text"
                placeholder="Experience"
                className="w-full mb-3 p-2 border rounded"
                {...registerJob("experience", { required: "Experience is required" })}
              />
              {jobErrors.experience && (
                <p className="text-red-500 text-sm">{jobErrors.experience.message}</p>
              )}

              <input
                type="text"
                placeholder="Qualification"
                className="w-full mb-3 p-2 border rounded"
                {...registerJob("qualification", { required: "Qualification is required"})}
              />
              {jobErrors.qualification && (
                <p className="text-red-500 text-sm">{jobErrors.qualification.message}</p>
              )}

              

             
           <label htmlFor="" className="text-slate-700">Upload your resume</label>
             <input
              type="file"
              accept=".pdf,.doc,.docx"
  onChange={(e) => console.log(e.target.files[0])}
              className="w-full mb-3 mt-2 p-2 border rounded"
              {...registerJob("resume", {
                required: "Resume is required",
              })}
            />
            {signupErrors.resume && (
              <p className="text-red-500 text-sm">{signupErrors.resume.message}</p>
            )}


              <button
                className="w-full bg-purple-400 hover:bg-purple-600 text-white py-2 rounded"
                type="submit"
              >
                Submit Job Application
              </button>
            </form>

           
          </div>
        )}
      </div>
<LoginForm/>

    </div>
  );
};

export default DelhiSignup;
