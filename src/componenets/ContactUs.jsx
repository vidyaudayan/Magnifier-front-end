import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Navbar from "./Navbar";
import Modal from "react-modal";
const ContactForm = () => {
  const {
    register,
    handleSubmit,reset,
    formState: { errors },
  } = useForm();
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal State

  // Submit Form Handler
  const onSubmit = async (data) => {
    const formData = new FormData();
    
    // Check if 'resume' is not empty and is a file object
    if (data.identityProof&& data.identityProof.length > 0) {
        formData.append("identityProof", data.identityProof[0]);  // Append the first file from the FileList
    } else {
        console.log("IdentityProof file not selected!");
        return;
    }

    // Append other form data
    delete data.identityProof;  // Delete the resume property from data since it's already added to FormData
    formData.append("contactDetails", JSON.stringify(data));

    // Log FormData to check if the data is correctly appended
    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }

    try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/contact`, formData);
      alert(response.data.message); // Show success message
      reset()
      setModalIsOpen(true);
    } catch (error) {
      alert("Failed to submit form. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Navbar/>
      <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row w-full max-w-6xl mt-20 lg:mt-28 overflow-hidden">
        {/* Left Section */}
        <div className="md:w-1/2 p-8 bg-cover bg-center  bg-[url('./assets/Images/contact.avif')]  relative">
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative text-white text-center lg:mt-44">
            <h2 className="text-3xl font-bold mb-4">We’d love to hear from you!</h2>
            <p className="text-lg leading-relaxed">
              Whether you're interested in subscribing to Voter Magnifier or Media Magnifier, or simply want to connect, please fill out the form below. Our team will get back to you shortly.
            </p>
          </div>
        </div>

        {/* Right Section (Contact Form) */}
        <div className="md:w-1/2 p-8 bg-white">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                {...register("fullName", { required: "Full Name is required" })}
                className="w-full px-4 py-2 mt-2 border rounded-lg  "
                placeholder="Full Name"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-gray-700">Age</label>
              <input
                type="number"
                {...register("age", { required: "Age is required" })}
                className="w-full px-4 py-2 mt-2 border rounded-lg "
                placeholder="Age"
              />
              {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700">Gender</label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="w-full px-4 py-2 mt-2 border rounded-lg "
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-gray-700">Web Magnifier Username</label>
              <input
                {...register("username")}
                className="w-full px-4 py-2 mt-2 border rounded-lg "
                placeholder="Username"
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-gray-700">Organization/Political Party Name</label>
              <input
                {...register("organization",{ required: "Organization is required" })}
                className="w-full px-4 py-2 mt-2 border rounded-lg "
                placeholder="Organization Name"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-gray-700">Identity Proof (Office ID card/ party membership card is required) </label>
              <input
                type="file"
                {...register("identityProof", { required: "Identity Proof is required" })}
                className="w-full px-4 py-2 mt-2 border rounded-lg "
              />
              {errors.identityProof && <p className="text-red-500 text-sm">{errors.identityProof.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="tel"
                {...register("phone", { required: "Phone number is required",pattern: {
                    value: /^\d{10}$/,
                    message: "Invalid phone number",
                }, })}
                className="w-full px-4 py-2 mt-2 border rounded-lg "
                placeholder="Phone Number"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700">Email Address</label>
              <input
                type="email"
                {...register("email", { required: "Email is required",pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email address",
                } },)}
                className="w-full px-4 py-2 mt-2 border rounded-lg "
                placeholder="Email Address"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-700">Message</label>
              <textarea
                {...register("message")}
                className="w-full px-4 py-2 mt-2 border rounded-lg resize-none "
                rows="5"
                placeholder="Your Message"
              ></textarea>
            </div>

            {/* Privacy Note */}
            <p className="text-sm text-gray-500">
              Privacy Note: All information submitted is strictly confidential and used only for verification and communication purposes.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      {/* Modal */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <div className="p-6 mt-14 bg-white rounded-lg shadow-lg">
          <h2 className=" text-xl font-bold mb-4">Thank You!</h2>
          <p className="">✅ Confirmation: You will receive an email confirming that we have received your inquiry.</p>
          <p>🔍 Verification: Our team will review your details and verify your identity proof or membership card.</p>
          <p>⏳ Response Time: Expect a response within 3-5 business days.</p>
          <p>🚀 Next Steps: We will guide you through the subscription process.</p>
         <p>Privacy Note: All information submitted is strictly confidential and used only for verification and communication purposes.</p>
         <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={() => setModalIsOpen(false)}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default ContactForm;
