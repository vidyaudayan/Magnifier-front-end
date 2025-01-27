{/*import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/${userId}`);
        setUser(userResponse.data);

        // Fetch user posts
        const postsResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/posts/${userId}`);
        setPosts(postsResponse.data.data);
      } catch (error) {
        console.error('Error fetching user or posts:', error);
      }
    };

    fetchUserAndPosts();
  }, [userId]);

  return (
    <div className="flex">
      {/* Left Section: User Details */}
{/*<div className="w-1/3 p-4">
        {user && (
          <>
            <img src={user.profilePic || 'default-profile-pic.jpg'} alt="Profile" className="rounded-full w-32 h-32" />
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p>{user.email}</p>
          </>
        )}
      </div>

      {/* Right Section: User Posts */}
{/*  <div className="w-2/3 p-4">
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="bg-white border rounded-lg p-4 mb-4">
              <p>{post.content}</p>
              {post.mediaUrl && post.postType === 'Photo' && <img src={post.mediaUrl} alt="Post" />}
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;*/}

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../componenets/Navbar";
import NavbarLanding from "../componenets/NavbarLanding";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../features/user/userSlice";
import { setCoverPicture } from "../features/user/userSlice";
const ProfilePage = () => {
  const dispatch = useDispatch()
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
const[coverPic, setCoverPic]= useState(user.coverPic || "")
  const handleCoverPicUpload = async (event) => {
  
          const file = event.target.files[0];
          console.log("Selected file:", file);
          if (file) {
              const formData = new FormData();
              formData.append('coverPic', file);
              for (let [key, value] of formData.entries()) {
                  console.log(`${key}:`, value);
              }
  
              try {
                  const token = localStorage.getItem('token');
                  console.log("cover token", token)
                  const headers = { Authorization: `Bearer ${token}` };
                  const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/user/add-coverpic`,
                    formData,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                      withCredentials: true, // Ensure this matches your backend's CORS setup
                    }
                  );
              
                  const data = response.data;
                  if (response.status === 200) {
  
                  
                      const updatedCoverPic = response.data.user?.coverPic;
  
                      // Update Redux state immediately after successful upload
                      dispatch(setUserDetails({ ...response.data.user }));
                   dispatch(setCoverPicture())
                      // Optionally, update the local state (if you're using one)
                      setCoverPic(updatedCoverPic);
  
                  } else {
                      console.error(response.data.error);
                  }
  
  
              } catch (error) {
                  console.error('Error uploading cover picture:', error);
              }
          }
      };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/userprofile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }, { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/userPosts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }, { withCredentials: true });
        console.log("userposts", response.data.data)
        setPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUserDetails();
    fetchUserPosts();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <NavbarLanding/>
      {/* Cover Photo */}
      <div className="w-full flex  h-[350px] bg-slate-200 relative"   onClick={() => document.getElementById('coverPic').click()}>
       
      {coverPic ? (
          <img
            src={coverPic}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="w-full h-full flex items-center justify-center text-gray-500">
            Upload a cover photo
          </p>
        )}

        {/* Upload Button */}
        <label
          htmlFor="coverPic"
          className="absolute top-4 right-4 bg-white px-4 py-2 rounded-md shadow-md cursor-pointer text-sm font-medium hover:bg-gray-100"
        >
          Change Cover Photo
          <input
            type="file"
            id="coverPic"
            className="border"
            accept="image/*"
            onChange={handleCoverPicUpload}
            onClick={handleCoverPicUpload}
          />
        </label>
       
       
       
        <div className="absolute  bottom-[-50px] left-1/2 transform -translate-x-1/2 ">
          {/* Profile Picture */}
          <img
            src={user.profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-[100px] h-[100px] rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="mt-16 text-center">
        <h1 className="text-xl font-bold">{user.username || "Username"}</h1>
        <p className="text-gray-600">{user.email || "user@example.com"}</p>
      </div>

      {/* User Posts */}
      <div className="w-full max-w-3xl  mt-8">
        <h2 className="text-lg font-semibold mb-4"> Posts</h2>
        <div className="space-y-6 ">
          
          {posts.length > 0 ? (
            posts.map((post, index) => (
              
              <div
                key={post._id} // Use unique ID for key
                className="bg-white p-4 rounded-lg shadow-md sm:flex-row items-start sm:items-center"
              >
                {/* Post User Info */}
                <div className="flex items-center pb-8 sm:mb-0 sm:mr-4">
                  <img
                    src={user.profilePic || "/default-profile.png"}
                    alt="User"
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-medium">{user.username}</h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <div className="flex-1 ">
                  {post.postType === "Photo" && (
                    <img
                      src={post.mediaUrl}
                      alt="Post"
                      className="max-w-full rounded-lg mb-4"
                    />
                  )}
                  <p className="text-gray-800">{post.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No posts available</p>
          )}
        </div>
      </div>


    </div>


  );
};

export default ProfilePage;

