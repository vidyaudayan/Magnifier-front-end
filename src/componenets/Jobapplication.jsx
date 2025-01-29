import React from 'react'
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from './Navbar';
import { Navigate, useNavigate } from 'react-router-dom';


const Jobapplication = () => {
  const navigate= useNavigate()
    const {
        register: registerJob,
        handleSubmit: handleJobSubmit,
        formState: { errors: jobErrors },
        reset: resetJobForm,
      } = useForm();
    
      const onJobSubmit = async (data) => {
        const formData = new FormData();
    
        // Check if 'resume' is not empty and is a file object
        if (data.resume && data.resume.length > 0) {
            formData.append("resume", data.resume[0]);  // Append the first file from the FileList
        } else {
            console.log("Resume file not selected!");
            toast.error("Please upload a resume file");
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
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/jobapplication`, formData);
            alert("Job application submitted")
            console.log("Job application submitted successfully:", response);
            toast.success("Job application submitted!");
            resetJobForm();
            navigate('/login')
        } catch (error) {
            console.log("Error submitting job application:", error.response || error.message);
        
            if (error.response && error.response.data && error.response.data.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("An unexpected error occurred. Please try again.");
            }
        
          }
    };
    
  
  
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 px-4">
        <Navbar/>
        <div className="w-full max-w-lg p-6 rounded-lg shadow-lg bg-white">
          <h2 className="text-3xl text-center font-extrabold text-gray-800 mb-6">
            Job Application
          </h2>
          <form onSubmit={handleJobSubmit(onJobSubmit)} className="space-y-4">
{/*<div>
              <input
                type="text"
                placeholder="Voter Card Number"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...registerJob("voterCardNumber", { required: "Voter Card Number is required" })}
              />
              {jobErrors.voterCardNumber && (
                <p className="text-red-500 text-sm mt-1">{jobErrors.voterCardNumber.message}</p>
              )}
            </div>
      
            <div>
              <input
                type="text"
                placeholder="Adhaar Card Number"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...registerJob("adhaarCardNumber", { required: "Adhaar Card Number is required" })}
              />
              {jobErrors.adhaarCardNumber && (
                <p className="text-red-500 text-sm mt-1">{jobErrors.adhaarCardNumber.message}</p>
              )}
            </div>*/}
            <div>
              <input
                type="text"
                placeholder="Magnifier Username"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...registerJob("username", { required: "Username is required" })}
              />
              {jobErrors.username && (
                <p className="text-red-500 text-sm mt-1">{jobErrors.username.message}</p>
              )}
            </div>
           
      


            <div>
  <select
    className="w-full p-3 border text-gray-400 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    {...registerJob("qualification", { required: "Qualification is required" })}
  >
    <option value="" disabled selected>
     Qualification
    </option>
    <option value="10th">10th</option>
    <option value="12th">12th</option>
    <option value="graduation">Graduation</option>
    <option value="post-graduation">Post-Graduation</option>
    <option value="other">Other</option>
  </select>
  {jobErrors.qualification && (
    <p className="text-red-500 text-sm mt-1">{jobErrors.qualification.message}</p>
  )}
</div>

            

            <div>
  <select
    className="w-full p-3 border text-gray-400 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    {...registerJob("experience", )}
  >
    <option value="" disabled selected>
      Select Experience (in years)
    </option>
    {Array.from({ length: 10 }, (_, i) => (
      <option key={i + 1} value={i + 1}>
        {i + 1} {i + 1 === 1 ? "year" : "years"}
      </option>
    ))}
  </select>
  {jobErrors.experience && (
    <p className="text-red-500 text-sm mt-1">{jobErrors.experience.message}</p>
  )}
</div>

      
            <div>
              <label htmlFor="resume" className="block text-gray-600 mb-2 font-semibold">
                Upload your resume
              </label>
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
               
               
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const validFormats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                    if (!validFormats.includes(file.type)) {
                      setError('resume', {
                        type: 'manual',
                        message: 'Please upload a resume in PDF or DOC format',
                      });
                    } else {
                      clearErrors('resume');
                      console.log(file);
                    }
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...registerJob("resume", { required: "Resume is required" })}
              />
              {jobErrors.resume && (
                <p className="text-red-500 text-sm mt-1">{signupErrors.resume.message}</p>
              )}
            </div>
      
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
            >
              Submit Job Application
            </button>
          </form>
        </div>
      </div>
      
    
  )
}

export default Jobapplication