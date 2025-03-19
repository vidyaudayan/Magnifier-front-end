import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarLanding from "../componenets/NavbarLanding";
import { useDispatch } from "react-redux";
import { setUserDetails, setCoverPicture, updatePostReaction, updateMetrics } from "../features/user/userSlice";
import { useLocation, useParams } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs"
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';




const  ProfilePageUsers = () => {
    const dispatch = useDispatch();
    const { userId } = useParams();

    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [coverPic, setCoverPic] = useState(user.coverPic || "");
    const [newComment, setNewComment] = useState("");
    const [highlightPostId, setHighlightPostId] = useState(null);
    const location = useLocation();
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [displayCount, setDisplayCount] = useState(6);

    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [showOverlay, setShowOverlay] = useState(null); // Track which post's menu is open

    {/*const handleCoverPicUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("coverPic", file);
            try {
                const token = localStorage.getItem("token");
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/user/add-coverpic`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );

                const updatedCoverPic = response.data.user?.coverPic;
                dispatch(setUserDetails({ ...response.data.user }));
                setCoverPic(updatedCoverPic);
            } catch (error) {
                console.error("Error uploading cover picture:", error);
            }
        }
    };*/}

    const deletePost = async (postId) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setMessage('Authentication token not found.');
                setMessageType('error');
                setIsMessageVisible(true);
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };

            const response = await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/post/delete/${postId}`,
             
                { headers, withCredentials: true }
            );

            if (response.status===200) {
                toast.success("Your post is deleted.");
                //alert("Your post is deleted.");
                setPosts(posts.filter(post => post._id !== postId));
            } else {
                const data = await response.json();
                //alert(response.data.message || "Failed to delete the post");
                toast.error(response.data.message || "Failed to delete the post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
           // alert("Server error");
           toast.error("Server error");
        }
    };


    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/userprofile/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }, { withCredentials: true });
                //setUser(response.data);
                const userData = response.data;
                setUser(userData);
                setCoverPic(userData.coverPic); // Set cover picture from the response
                dispatch(setUserDetails(userData));
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/posts/${userId}`, );
                setPosts(response.data.data);
            } catch (error) {
                console.error("Error fetching user posts:", error);
            }
        };

        const fetchPostById = async (postId) => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/post/${postId}`);
                setHighlightPostId(response.data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        const queryParams = new URLSearchParams(location.search);
        const postId = queryParams.get("highlightPostId");
        if (postId) fetchPostById(postId);

        fetchUserDetails();
        fetchUserPosts();
    }, [location]);

    const handleReaction = async (postId, reactionType) => {
        try {
            const url =
                reactionType === "like"
                    ? `${import.meta.env.VITE_BASE_URL}/post/${postId}/like`
                    : `${import.meta.env.VITE_BASE_URL}/post/${postId}/dislike`;

            const response = await axios.patch(url, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            dispatch(updatePostReaction({ postId, updatedPost: response.data.post }));
            dispatch(updateMetrics(response.data));
        } catch (error) {
            console.error("Error updating reactions:", error);
        }
    };

    const handleAddComment = async (postId) => {
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/post/${postId}/comment`,
                { comment: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPosts(posts.map((post) => (post._id === postId ? response.data : post)));
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <div className="flex flex-col  items-center">
            <NavbarLanding />
            <div className="w-full flex h-[350px] bg-slate-200 relative" onClick={() => document.getElementById("coverPic").click()}>
                {coverPic ? (
                    <img src={coverPic} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                    <p className="w-full h-full flex items-center justify-center text-gray-500"></p>
                )}
                {/*<label htmlFor="coverPic" className="absolute top-4 right-4 bg-white px-4 py-2 rounded-md shadow-md cursor-pointer">
                    Change Cover Photo
                    <input type="file" id="coverPic" accept="image/*"  className="hidden" />
                </label>*/}
                <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2">
                    <img src={user.profilePic || "/default-profile.png"} alt="Profile" className="w-[100px] h-[100px] rounded-full border-4 border-white shadow-lg" />
                </div>
            </div>

            <div className="mt-16 text-center">
                <h1 className="text-xl font-bold">{user.username || "Username"}</h1>
                <p className="text-gray-600">{user.email || "user@example.com"}</p>
            </div>

            <div className="w-full max-w-3xl mt-8 p-6 ">
                <h2 className="text-lg font-semibold mb-4">Posts</h2>
                <div className="space-y-6 mt-3 ">



                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post._id} className="bg-white p-4 rounded-lg mb-8 border border-blue-50 hover:border-blue-100 shadow-lg relative">
                                <div className="flex items-center justify-between pb-4">
                                    <img src={user.profilePic || "/default-profile.png"} alt="User" className="w-12 h-12 rounded-full mr-3" />
                                    <div className="flex flex-col items-center mr-auto">
                                        <h3 className="font-medium">{user.username}</h3>
                                        <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
                                    </div>


                                    {/* Three Dots Icon */}
                                    <div className="flex justify-between">
                                    {/*<button  className="relative z-10" onClick={() => setShowOverlay(showOverlay === post._id ? null : post._id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6 text-gray-600" viewBox="0 0 16 16">
                                            <path d="M3 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm5 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm5 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                                        </svg>
                                    </button>*/}
                                    </div>
                                </div>




                                {post.postType === "Photo" && <img src={post.mediaUrl} alt="Post" className="w-full h-80 object-cover rounded-lg mb-4" />}
                                < p className="text-gray-800" > {post.content}</p>

 {/* Overlay for Delete Option */}
 {showOverlay === post._id && (
      <div className="absolute  top-0 right-0 mt-10 mr-4 bg-white border shadow-lg p-3 rounded-md z-50">
        <button className="text-red-500 hover:underline mb-2 mt-2 mr-4" onClick={() => deletePost(post._id)}>
          Delete Post
        </button>
        <button className="text-gray-500  absolute top-1 right-1 hover:underline" onClick={() => setShowOverlay(null)}>
      
        <IoMdClose />
        </button>
      </div>
    )}



                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex gap-4">
                                        <button className="text-blue-500 hover:scale-105" onClick={() => handleReaction(post._id, "like")}>
                                            {post.likes || 0} Likes
                                        </button>
                                        <button className="text-red-500 hover:scale-105" onClick={() => handleReaction(post._id, "dislike")}>
                                            {post.likes || 0} Dislikes
                                        </button>
                                    </div >
                                    <div className="p-1 mb-2">
                                        <p onClick={() => setCommentsVisible((prev) => !prev)} className="text-md text-slate-500  hover:scale-105 ">{post.comments?.length || 0} Comments</p>
                                    </div>

                                </div>
                                <div>



                                    {/* Comment Section */}
                                    {commentsVisible && (
                                        <div className="mt-4">
                                            {post.comments
                                                .slice()
                                                .reverse()
                                                .slice(0, displayCount)
                                                .map((commentObj, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-gray-100 flex gap-2 border border-gray-300 rounded-md p-3 mb-2"
                                                    >

                                                        {commentObj.userId?.profilePic ? (
                                                            <img
                                                                src={commentObj.userId.profilePic}
                                                                alt="User"
                                                                className="h-5 w-5 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                                                {commentObj.userId?.username?.charAt(0).toUpperCase() || 'A'}
                                                            </div>
                                                        )}
                                                        <p className="text-sm">
                                                            <strong>{commentObj.userId?.username || 'Anonymous'}:</strong> {commentObj.comment}
                                                        </p>


                                                    </div>
                                                ))}

                                            {/* Load More Button */}
                                            {displayCount < post.comments.length && (
                                                <button
                                                    className="text-slate-500 mt-2 hover:text-slate-700 border hover:border-slate-400 p-1 rounded-md "
                                                    onClick={() => setDisplayCount((prev) => prev + 6)} // Increment display count
                                                >
                                                    Load More Comments
                                                </button>
                                            )}

                                            {/* Close Comments Section */}
                                            {displayCount >= post.comments.length && (
                                                <button
                                                    className="text-slate-500 mt-2 hover:text-slate-700 border hover:border-slate-400 p-1 rounded-md"
                                                    onClick={() => setCommentsVisible(false)} // Close the comments section
                                                >
                                                    Close Comments
                                                </button>
                                            )}

                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No posts available</p>
                    )}
                </div>
            </div >
        </div >
    );
};

export default ProfilePageUsers;
