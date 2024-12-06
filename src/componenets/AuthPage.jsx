import React, { useState } from "react";
import image1 from '../assets/Images/background1.webp';
const AuthPage = () => {
  const [showJobForm, setShowJobForm] = useState(false);

  // Form state for validation
  const [signupData, setSignupData] = useState({
    name: "",
    fatherName: "",
    age: "",
    gender: "",
    wardNumber: "",
    vidhanSabha: "",
    email: "",
    phoneNumber: "",
    referralCode: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Validation Function
  const validateSignup = () => {
    let errorMessages = {};
    if (!signupData.name) errorMessages.name = "Name is required";
    if (!signupData.fatherName) errorMessages.fatherName = "Father's Name is required";
    if (!signupData.age || isNaN(signupData.age)) errorMessages.age = "Valid Age is required";
    if (!signupData.gender) errorMessages.gender = "Gender is required";
    if (!signupData.email || !/^\S+@\S+\.\S+$/.test(signupData.email)) {
      errorMessages.email = "Valid Email is required";
    }
    if (!signupData.phoneNumber || !/^\d{10}$/.test(signupData.phoneNumber)) {
      errorMessages.phoneNumber = "Valid Phone Number is required";
    }
    if (!signupData.password || signupData.password.length < 6) {
      errorMessages.password = "Password must be at least 6 characters";
    }
    setErrors(errorMessages);
    return Object.keys(errorMessages).length === 0;
  };

  const validateLogin = () => {
    let errorMessages = {};
    if (!loginData.username) errorMessages.username = "Username is required";
    if (!loginData.password) errorMessages.password = "Password is required";
    setErrors(errorMessages);
    return Object.keys(errorMessages).length === 0;
  };

  // Form Submission Handlers
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (validateSignup()) {
      console.log("Signup Data Submitted:", signupData);
      alert("Signup successful!");
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (validateLogin()) {
      console.log("Login Data Submitted:", loginData);
      alert("Login successful!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center mt-20">
      <div className="w-full max-w-5xl flex flex-wrap lg:flex-nowrap gap-8 p-6">
        {/* Signup Form */}
        <div className="w-full lg:w-1/2 p-6 rounded-lg shadow-md bg-gradient-to-r from-green-500 to-pink-500  " >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign Up</h2>
          <form onSubmit={handleSignupSubmit}  >
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-3 p-2 border rounded"
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            <input
              type="text"
              placeholder="Father's Name"
              className="w-full mb-3 p-2 border rounded"
              value={signupData.fatherName}
              onChange={(e) => setSignupData({ ...signupData, fatherName: e.target.value })}
            />
            {errors.fatherName && <p className="text-red-500 text-sm">{errors.fatherName}</p>}

            <input
              type="number"
              placeholder="Age"
              className="w-full mb-3 p-2 border rounded"
              value={signupData.age}
              onChange={(e) => setSignupData({ ...signupData, age: e.target.value })}
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}

            <select
              className="w-full mb-3 p-2 border rounded"
              value={signupData.gender}
              onChange={(e) => setSignupData({ ...signupData, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}

            <input
              type="text"
              placeholder="Ward Number"
              className="w-full mb-3 p-2 border rounded"
              value={signupData.wardNumber}
              onChange={(e) => setSignupData({ ...signupData, wardNumber: e.target.value })}
            />
            <input
              type="text"
              placeholder="Name of Vidhan Sabha"
              className="w-full mb-3 p-2 border rounded"
              value={signupData.vidhanSabha}
              onChange={(e) => setSignupData({ ...signupData, vidhanSabha: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <input
              type="text"
              placeholder="Phone Number"
              className="w-full mb-3 p-2 border rounded"
              value={signupData.phoneNumber}
              onChange={(e) => setSignupData({ ...signupData, phoneNumber: e.target.value })}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}

            <input
              type="text"
              placeholder="Referral Code"
              className="w-full mb-3 p-2 border rounded"
              value={signupData.referralCode}
              onChange={(e) => setSignupData({ ...signupData, referralCode: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-2 border rounded"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

            <button className="w-full bg-blue-500 text-white py-2 rounded">
              Sign Up
            </button>
          </form>
          <p
            className="text-white mt-4 cursor-pointer"
            onClick={() => setShowJobForm(!showJobForm)}
          >
            Apply for a Job
          </p>
          {showJobForm && (
            <div className="mt-4 p-4 border rounded bg-gray-50">
              <h3 className="font-bold">Job Application Form</h3>
              <input type="text" placeholder="Voter Card Number" className="w-full mb-3 p-2 border rounded" />
              <input type="text" placeholder="Aadhaar Number" className="w-full mb-3 p-2 border rounded" />
              <textarea placeholder="Experience" className="w-full mb-3 p-2 border rounded" />
              <input type="file" className="w-full mb-3 p-2 border rounded" />
              <input type="text" placeholder="Qualification" className="w-full mb-3 p-2 border rounded" />
              <button className="w-full bg-pink-500 text-white py-2 rounded">
               Submit
            </button>
           
            </div>
          )}
        </div>

        {/* Login Form */}
        <div className="w-full lg:w-1/2 bg-gradient-to-r from-yellow-500 to-pink-500 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Log In</h2>
          <form onSubmit={handleLoginSubmit}>
            <input
              type="text"
              placeholder="Username"
              className="w-full mb-3 p-2 border rounded"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-2 border rounded"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

            <button className="w-full bg-green-500 text-white py-2 rounded">
              Log In
            </button>
            < img className="mt-4" src={image1} alt="" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
