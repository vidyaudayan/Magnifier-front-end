import React, { useState, useEffect, useContext } from "react";
import Navbar from "../componenets/Navbar.jsx";
import { formatDate } from "../utils/dateUtils.js";
import { toast } from "react-toastify";
import { IoSettings } from "react-icons/io5";
import postImage from '../assets/Images/post2.avif'
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import { FaCamera } from 'react-icons/fa';
import Context from "../context/context.jsx";
import { TbLoadBalancer } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { useDispatch } from 'react-redux';

import { setUserDetails } from '../features/user/userSlice.js';
import { setProfilePicture } from "../features/user/userSlice.js";

export const LandingPage = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state?.user?.user)
    console.log("user header", user)
    const dispatch = useDispatch();
    const context = useContext(Context)
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [postOverlayOpen, setPostOverlayOpen] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [photo, setPhoto] = useState(null);
    const [voiceNote, setVoiceNote] = useState(null);
    const [posts, setPosts] = useState([]);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [profilePic, setProfilePic] = useState(""); 
    const [username, setUsername] = useState("Username"); 
    const [userId, setUserId] = useState({ profilePic: "" });
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [loading, setLoading] = useState(false); 
    const [commentsVisible, setCommentsVisible] = useState(false); 
    const [displayCount, setDisplayCount] = useState(6);
    const { profilePicture, previousProfilePicture } = useSelector((state) => state.user);
    const [newPicture, setNewPicture] = useState(null);
    const toggleAddComment = () => {
        setShowCommentBox(!showCommentBox);
    };
    const [showComments, setShowComments] = useState(false);

    const toggleComments = () => {
        setShowComments(!showComments);
    };



    const handleAddComment = async (postId) => {
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem("token"); // Fetch token
            const headers = { Authorization: `Bearer ${token}` }; // Set header

            // Pass headers as the third argument in axios.post
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/post/${postId}/comment`,
                { comment: newComment }, // Payload
                { headers } // Headers
            );

            // Update posts
            setPosts(
                posts.map((post) => (post._id === postId ? response.data : post))
            );
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };


    

    const handleReaction = async (postId, reactionType) => {
        try {
            const url =
                reactionType === "like"
                    ? `${import.meta.env.VITE_BASE_URL}/post/${postId}/like`
                    : `${import.meta.env.VITE_BASE_URL}/post/${postId}/dislike`;

            const response = await axios.patch(url, {}, { withCredentials: true });

            // Update the specific post's likes/dislikes in state
            setPosts(posts.map(post => (post._id === postId ? response.data : post)));
        } catch (error) {
            console.error("Error updating reactions:", error);
        }
    };


    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file); // Store the actual file object for FormData
            setPhotoPreview(URL.createObjectURL(file)); // Generate a preview URL for the photo
        }
    };

    const handleVoiceNoteUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVoiceNote(file); // Save the voice note file
        }
    };

   

    const handleCreatePost = async () => {
        const tempPostId = Math.random().toString(36)
        const tempPost = {
            _id: tempPostId,
            userId: { username: user?.username || "Unknown", profilePic: user?.profilePic || "" },
            content: postContent,
            mediaUrl: photo ? URL.createObjectURL(photo) : null, // Temporary image preview
            postType: photo ? "Photo" : "Text",
            createdAt: new Date().toISOString(),
        };

        // Add the temporary post to the state
        setPosts((prevPosts) => [tempPost, ...prevPosts]);
       
        try {
           
            const formData = new FormData();

            // Determine the type of post
            const postType = photo ? "Photo" : voiceNote ? "VoiceNote" : "Text";

            // Append content based on post type
            formData.append('postType', postType);
            formData.append('content', postContent); // For text posts

            // Append the file if it's a photo or voice note
            if (photo) formData.append("media", photo); // Add file
            if (voiceNote) formData.append("media", voiceNote); // Add file
          
            setLoading(true); // Start loading

            console.log("Photo:", photo);
            console.log("Voice Note:", voiceNote);
            console.log("form data", formData);

            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }


            const token = localStorage.getItem('token');
            //console.log( "landing token",token)
            const headers = { Authorization: `Bearer ${token}`, };
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/post/create`, formData, { headers }, {
                withCredentials: true,
            });
            console.log('New Post Response:', response.data);
        //setPosts([response.data, ...posts]); // Prepend the new post to the list
              
            // Replace the temporary post with the actual post
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === tempPostId ? response.data : post
                )
            );

            
            setPhoto(null);
            setVoiceNote(null);
            setPostContent("");
            setPhotoPreview(null);
            setPostOverlayOpen(false);
           
            toast.success("Post created successfully");
            
        } catch (error) {
            console.error("Error creating post:", error);
            setPosts((prevPosts) =>
                prevPosts.filter((post) => post._id !== tempPostId)
            );

            toast.error("Failed to create post");
        } finally {
            setLoading(false);
        }

    };



    const handleProfilePicUpload = async (event) => {

        const file = event.target.files[0];
        console.log("Selected file:", file);
        if (file) {
            const formData = new FormData();
            formData.append('profilePic', file);
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            try {
                const token = localStorage.getItem('token');
                console.log("profile token", token)
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/add-profilepic`, formData, { headers }, {
                    withCredentials: true,
                });
                const data = response.data;
                if (response.status === 200) {
                   
                    const updatedProfilePic = `${response.data.user?.profilePic}?t=${new Date().getTime()}`;
                //setProfilePic(updatedProfilePic); // Update the state for immediate reflection
                //setUserId((prevUser) => ({ ...prevUser, profilePic: updatedProfilePic })); // Update user state
                dispatch(setProfilePicture(updatedProfilePic));
                    //setProfilePic(data.user?.profilePic || ""); // Assuming API returns updated user
                } else {
                    console.error(response.data.error);
                }

 
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }
    };
    const displayProfilePic = profilePic || `https://via.placeholder.com/80`;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/post`, {
                    withCredentials: true,
                });;
                setPosts(response.data); // Assuming API returns an array of posts
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, []);


    return (
        <div className="min-h-screen  bg-gray-100 flex flex-col lg:flex-row gap-4 pr-8 py-4  mt-20">
            <Navbar />

            {/* Left Section */}
            <div className="lg:w-1/4 w-full max-h-[600px] bg-white border border-gray-300 rounded-lg lg:ml-32 ml-6 p-4  space-y-6 shadow-sm">
                {/* User Info */}
                <div className="text-center">
                    <div
                        onClick={() => document.getElementById('profilePic').click()}
                        className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-2 cursor-pointer flex justify-center items-center"
                    >
                        {user?.profilePic ? (
                            <img
                            src={
                                user.profilePic
                                  ? `${user.profilePic}?t=${new Date().getTime()}`
                                  : "/default-avatar.png"
                              }
                                //src={user.profilePic}

                                alt="User"
                                className="w-20 h-20 rounded-full"
                            />
                        ) : (
                            <span className="text-3xl text-gray-500">+</span>
                        )}
                    </div>

                    {
                        user?.username ? (
                            <p className="text-lg font-semibold">{user.username}</p>
                        ) : ("")
                    }
                    {/* Hidden file input */}
                    <input
                        type="file"
                        id="profilePic"
                        accept="image/*"
                        onChange={handleProfilePicUpload}
                        className="hidden"
                    />
                </div>

                {/* Wallet Box */}
                <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
                    <p className="text-sm font-medium">Wallet Balance</p>
                    <p className="text-lg font-bold text-green-600">200</p>
                </div>

                {/* Reactions Box */}
                <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
                    <p className="text-sm font-medium">Reactions</p>
                    <div className="flex items-center space-x-3 mt-2">
                        <span>👍 50</span>
                        <span>❤️ 30</span>
                        <span>👏 20</span>
                    </div>
                </div>

                {/* Posts Count */}
                <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
                    <p className="text-sm font-medium">Posts</p>
                    <p className="text-lg font-bold text-blue-600">15</p>
                </div>

                {/* Settings */}
                <div className="flex items-center space-x-2 cursor-pointer">
                    <IoSettings />
                    <p className="text-sm font-medium cursor-pointer">Settings</p>
                </div>
            </div>

            {/* Right Section */}
            <div className="lg:w-2/4 w-full bg-white border border-gray-300 rounded-lg ml-6 lg:ml-16 shadow-sm p-6">
                {/* Write a Post Section */}

                <div className="flex items-center mb-6">


                    {user?.profilePic ?(
                        <img
                            src={user.profilePic}
                            alt="User"
                            className="w-12 h-12 rounded-full"
                        />
                    ) : (
                        <span className="text-3xl text-gray-500">U</span>
                    )}
                    <div
                        className="ml-4 bg-gray-50 border border-gray-300 rounded-md p-2 w-full cursor-pointer"
                        onClick={() => setPostOverlayOpen(true)}
                    >
                        Write a post...
                    </div>


                </div>

                {/* Posts Section */}
                {posts.map((post) => (
                    <div
                        key={post._id}
                        className="bg-white border border-gray-300 rounded-lg shadow-sm mb-6 p-4"
                    >
                        {/* Header: User Image, Name, and Date */}
                        <div className="flex items-center space-x-4 mb-4">
                            {post.userId?.profilePic ? (
                                <img
                                    src={post.userId.profilePic} alt={`${post.userId.username || 'User'}'s Profile`}
                                    className="h-10 w-10 rounded-full object-cover"
                                    onError={(e) => {
                                        // Fallback to display initial if the image fails to load
                                        e.target.onerror = null;
                                        e.target.src = ''; // Clear src to hide broken image icon
                                        e.target.parentNode.innerHTML = `
                                          <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                            ${post?.userId?.username?.charAt(0).toUpperCase() || 'U'}
                                          </div>`;
                                    }}
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                    {post?.userId?.username?.charAt(0).toUpperCase() || "U"}
                                </div>
                            )}


                            <div>
                                <p className="text-sm font-semibold">{post?.userId?.username || "Unknown User"}</p>


                                <p className="text-xs text-gray-500">{post.createdAt?formatDate(post.createdAt):"Loading..."}</p>
                            </div>
                            {/*<p className="text-gray-700">{post.content || "Loading content..."}</p>
        {post.mediaUrl && post.postType === "Photo" && (
            <img
                src={post.mediaUrl}
                alt="Post media"
                className="w-full rounded-md mt-3"
            />
        )}*/}
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-800">
                                {post.content && post.content.split(" ").length > 8 ? (
                                    <>
                                        {post.content.split(" ").slice(0, 8).join(" ")}...{" "}
                                        <button
                                            className="text-blue-500 hover:underline text-xs"
                                            onClick={() => handleViewMore(post._id)}
                                        >
                                            More
                                        </button>
                                    </>
                                ) : (
                                    post.content || "No content available"
                                )}
                            </p>
                            {post.postType === "Photo" && (
                                <img
                                    src={post.mediaUrl}
                                    alt="Post Media"
                                    className="w-full rounded-md mt-3"
                                />
                            )}
                            {post.postType === "VoiceNote" && (
                                <audio
                                    controls
                                    src={post.mediaUrl}
                                    className="w-full mt-3 rounded-md"
                                />
                            )}
                        </div>

                        {/* Likes and Comments Count */}
                        <div className="flex gap-3 justify-between items-center text-sm text-gray-500 mb-4">
                            <div className="flex gap-2">
                                <p className="hover:text-green-500">{post.likes || 0} Likes</p>
                                <p className="hover:text-red-500">{post.dislikes || 0} Dislikes</p>
                            </div>
                            <div className="px-1">
                                <p onClick={() => setCommentsVisible((prev) => !prev)} className="hover:text-blue-500 ">{post.comments?.length || 0} Comments</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 text-md  text-gray-700 mb-4">
                            <button
                                onClick={() => handleReaction(post._id, "like")}
                                className="hover:text-blue-500"
                            >
                                👍 Like
                            </button>
                            <button
                                onClick={() => handleReaction(post._id, "dislike")}
                                className="hover:text-red-500"
                            >
                                👎 Dislike
                            </button>
                            <button
                                onClick={() =>
                                    navigator.share({
                                        title: "Post",
                                        text: "Check out this post!",
                                        url: window.location.href,
                                    })
                                }
                                className="hover:text-green-500 text-md"
                            >
                                📤 Share
                            </button>
                        </div>

                        {/* Add Comment Section */}
                        <div className="flex items-center space-x-3 mb-4">
                            <textarea
                                className="flex-1 border border-gray-300 rounded-md p-2 resize-none text-sm"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                            />
                            <button
                                onClick={() => handleAddComment(post._id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                            >
                                Add
                            </button>
                        </div>

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
                ))}

                {/* Post Overlay */}
                {postOverlayOpen && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white relative rounded-lg shadow-lg w-3/4 lg:w-1/2 p-6">

                            {/* Close Button */}
                            <button
                                onClick={() => setPostOverlayOpen(false)}
                                className="absolute top-4 right-4 text-black text-2xl"
                                aria-label="Close"
                            >
                                <IoCloseSharp />
                            </button>

                            <div className="flex items-center mb-4">
                            {user?.profilePic ?(
                        <img
                            src={user.profilePic}
                            alt="User"
                            className="w-6 h-6 rounded-full"
                        />
                    ) : (
                        <span className="text-3xl text-gray-500">U</span>
                    )}
                                
                                {
                        user?.username ? (
                            <p className="text-lg ml-4 font-semibold">{user?.username}</p>
                        ) : ("")
                    }
                            </div>
                            <input type="text" />
                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full border border-gray-300 rounded-md p-3 mb-4 text-sm focus:outline-none focus:ring focus:ring-blue-200 resize-none"
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex space-x-4">
                                    <label className="bg-gray-100 p-2 rounded-md hover:bg-gray-200 cursor-pointer">
                                        📷 Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="media"
                                            className="hidden"
                                            onChange={handlePhotoUpload}
                                        />
                                    </label>
                                    <label className="bg-gray-100 p-2 rounded-md hover:bg-gray-200 cursor-pointer">
                                        🎤 Voice Note
                                        <input
                                            type="file"
                                            accept="audio/*"
                                            className="hidden"
                                            name="media"
                                            onChange={handleVoiceNoteUpload}
                                        />
                                    </label>
                                </div>
                                <button
                                    onClick={handleCreatePost}
                                    disabled={loading}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                   {loading ? "Posting..." : "Post"}
                                </button>
                            </div>
                            {photoPreview && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium">Photo Preview:</p>
                                    <img
                                        src={photoPreview}
                                        alt="Selected"
                                        className="w-full max-h-64 object-contain rounded-md border border-gray-300"
                                    />
                                </div>
                            )}
                            {voiceNote && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium">Voice Note:</p>
                                    <p className="text-gray-600">{voiceNote.name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}



export default LandingPage;
