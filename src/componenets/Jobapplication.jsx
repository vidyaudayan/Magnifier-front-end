{/*import React from 'react'
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from './Navbar';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';


const Jobapplication = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate()
  const {
    register: registerJob,
    handleSubmit: handleJobSubmit,
    formState: { errors: jobErrors },
    reset: resetJobForm,
  } = useForm();

  const onJobSubmit = async (data) => {
    const formData = new FormData();


    
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

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      console.log("job token", token)
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/jobapplication`, formData);
      alert("Job application submitted")
      console.log("Job application submitted successfully:", response);
      toast.success("Job application submitted!");
      resetJobForm();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitting(false);
      navigate('/joblogin')

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

      <div className="w-full max-w-lg p-6 rounded-lg shadow-lg bg-white">
        <h2 className="text-3xl text-center font-extrabold text-gray-800 mb-6">
          Job Application
        </h2>
        <form onSubmit={handleJobSubmit(onJobSubmit)} className="space-y-4">

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
              {...registerJob("experience",)}
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
            //className="w-full py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
            disabled={submitting}
            className={`px-4 py-2 bg-blue-600 text-white rounded flex items-center justify-center ${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-800"
              }`}

          >

            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              " Submit Job Application"
            )}
          </button>
        </form>
      </div>
    </div>


  )
}

export default Jobapplication*/}

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";
import { Card, CardContent } from "../componenets/Welcome/card";
import { Button } from "../componenets/Welcome/button";
import { Loader2 } from "lucide-react";

const Jobapplication = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register: registerJob,
    handleSubmit: handleJobSubmit,
    formState: { errors: jobErrors },
    setError,
    clearErrors,
    reset: resetJobForm,
  } = useForm();

  const onJobSubmit = async (data) => {
    const formData = new FormData();

    if (data.resume && data.resume.length > 0) {
      formData.append("resume", data.resume[0]);
    } else {
      toast.error("Please upload a resume file");
      return;
    }

    delete data.resume;
    formData.append("jobApplicationDetails", JSON.stringify(data));

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/jobapplication`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Job application submitted!");
      resetJobForm();
      setTimeout(() => {
        setSubmitting(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      setSubmitting(false);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="space-y-5 py-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Job Application
          </h2>

          <form onSubmit={handleJobSubmit(onJobSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...registerJob("username", { required: "Username is required" })}
              />
              {jobErrors.username && (
                <p className="text-sm text-red-500 mt-1">{jobErrors.username.message}</p>
              )}
            </div>

            {/* Qualification */}
            <div>
              <select
                className="w-full text-slate-900 p-3 border  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...registerJob("qualification", { required: "Qualification is required" })}
                defaultValue=""
              >
                <option value="" disabled>Qualification</option>
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="graduation">Graduation</option>
                <option value="post-graduation">Post-Graduation</option>
                <option value="other">Other</option>
              </select>
              {jobErrors.qualification && (
                <p className="text-sm text-red-500 mt-1">{jobErrors.qualification.message}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <select
                className="w-full text-slate-900 p-3 border text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...registerJob("experience")}
                defaultValue=""
              >
                <option value="" disabled>Select Experience (in years)</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i + 1 === 1 ? "year" : "years"}
                  </option>
                ))}
              </select>
              {jobErrors.experience && (
                <p className="text-sm text-red-500 mt-1">{jobErrors.experience.message}</p>
              )}
            </div>

            {/* Resume Upload */}
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-600 mb-1">
                Upload Resume
              </label>
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...registerJob("resume", { required: "Resume is required" })}
                onChange={(e) => {
                  const file = e.target.files[0];
                  const validFormats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                  if (file && !validFormats.includes(file.type)) {
                    setError('resume', {
                      type: 'manual',
                      message: 'Only PDF or DOC formats are allowed',
                    });
                  } else {
                    clearErrors('resume');
                  }
                }}
              />
              {jobErrors.resume && (
                <p className="text-sm text-red-500 mt-1">{jobErrors.resume.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full flex justify-center items-center gap-2"
              disabled={submitting}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Jobapplication;
