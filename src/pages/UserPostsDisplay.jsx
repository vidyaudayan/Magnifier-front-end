import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarLanding from "../componenets/NavbarLanding.jsx";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../features/user/userSlice.js";

const UserPostDisplay = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/userprofile`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          },
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/userPosts`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          },
          { withCredentials: true }
        );
        setPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUserDetails();
    fetchUserPosts();
  }, []);

  return (
    <div className="min-h-screen  bg-gray-50">
    
 

      <div className="bg-white shadow-md py-8">
        <div className="container mx-auto flex flex-col items-center">
          <img
            src={user.profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-md mb-4"
          />
          <h1 className="text-xl font-bold">{user.username || "Username"}</h1>
          <p className="text-gray-600">{user.email || "user@example.com"}</p>
        </div>
      </div>

      <div className="container mx-auto mt-24 pl-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 pt-4"> Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={user.profilePic || "/default-profile.png"}
                    alt="User"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-medium">{user.username}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {post.postType === "Photo" && (
                  <img
                    src={post.mediaUrl}
                    alt="Post Media"
                    className="rounded-lg mb-4 max-h-40 object-cover"
                  />
                )}
                <p className="text-gray-800">{post.content}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No posts available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPostDisplay;
