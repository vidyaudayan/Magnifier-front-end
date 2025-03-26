import React, { useState, useEffect, useContext,useRef } from "react";
import Navbar from "../componenets/Navbar.jsx";
import NavbarLanding from "../componenets/NavbarLanding.jsx";
import { formatDate } from "../utils/dateUtils.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IoSettings } from "react-icons/io5";
import postImage from '../assets/Images/post2.avif'
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import { FaCamera } from 'react-icons/fa';
import Context from "../context/context.jsx";
import { FaUser } from "react-icons/fa6";
import BreadCrumbs from "../componenets/Breadcrumbs.jsx";
import { TbLoadBalancer } from "react-icons/tb";
import { useNavigate, useLocation } from 'react-router-dom';
import { BiSolidDislike } from "react-icons/bi";
import { useSelector } from 'react-redux';
import { UserOverlay } from "../componenets/UserOverlay.jsx";
import { useDispatch } from 'react-redux';
import { updateMetrics } from "../features/user/userSlice.js";
import { setUserDetails } from '../features/user/userSlice.js';
import { setPosts } from "../features/user/userSlice.js";
import { setProfilePicture } from "../features/user/userSlice.js";
import { updatePostReaction } from "../features/user/userSlice.js";
import UserSearch from "../componenets/UserSearch.jsx";
import { FaThumbtack } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

//import { fetchMetrics, fetchPosts, updatePostReaction } from '../features/user/userSlice.js';
export const LandingPage = () => {
    const postRefs = useRef([]);
    const [pos, setPos] = useState(null);
    const navigate = useNavigate();
    const user = useSelector(state => state?.user?.user)
  // const { user } = useSelector((state) => state.user);
   
    //const { walletAmount,  postCount } = useSelector((state) => state.user);
    //const totalLikes = useSelector(state => state?.user?.totalLikes);
    // totalDislikes = useSelector(state => state?.user?.totalDislikes);
    // Access Redux state
    const {posts, walletAmount, totalLikes, totalDislikes, postCount, } = useSelector(
        (state) => state.user
    );

    
      const trackPostImpression = async (postId) => {
        
        try
        {
            const token = localStorage.getItem('token');
                console.log("profile token", token)
                const headers = { Authorization: `Bearer ${token}` };
            console.log(`Tracking impression for postId: ${postId}`);
          await axios.post(`${import.meta.env.VITE_BASE_URL}/post/impression/${postId}`, {headers },{withCredentials:true});
          console.log('Post impression recorded for:', postId);
        } catch (error) {
          console.error('Error tracking impression:', error);
        }
      };

      useEffect(() => {
        postRefs.current = postRefs.current.slice(0, posts.length);
    
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const postId = entry.target.getAttribute("data-post-id");
                if (postId) {
                  trackPostImpression(postId);
                  observer.unobserve(entry.target); // Track only once
                }
              }
            });
          },
          { threshold: 0.5 } // 50% of post is visible
        );
    
        postRefs.current.forEach((ref) => {
          if (ref) observer.observe(ref);
        });
    
        return () => {
          postRefs.current.forEach((ref) => {
            if (ref) observer.unobserve(ref);
          });
        };
      }, [posts]);
    
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
      
    //const posts = useSelector(state => state.posts?.posts|| []);
    console.log("user header", user)
    const dispatch = useDispatch();
    const context = useContext(Context)
    const { postId } = useParams(); // Extracting postId from URL

    const [submitting, setSubmitting] = useState(false);
    const [stickyDuration, setStickyDuration] = useState("3600000");
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState(null);
    
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [postOverlayOpen, setPostOverlayOpen] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [photo, setPhoto] = useState(null);
    const [VoiceNote, setVoiceNote] = useState(null);
    const [post, setPostss] = useState([]);
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
    const [wallet, setWallet] = useState();
    const [postsFetched, setPostsFetched] = useState(false);
    const toggleAddComment = () => {
        setShowCommentBox(!showCommentBox);
    };
    const [showComments, setShowComments] = useState(false);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const toggleComments = () => {
        setShowComments(!showComments);
    };
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [metrics, setMetrics] = useState({
        walletAmount: 0, postCount: 0,
        totalLikes: 0, totalDislikes: 0
    });

    const [expandedPosts, setExpandedPosts] = useState({});
    const [impressions, setImpressions] = useState(post.impressions);


    const handleDurationClick = (durationText) => {
        setSelectedDuration(durationText);
        setShowPopup(true);
      };

    const handleViewMore = (postId) => {
        setExpandedPosts((prev) => ({
          ...prev,
          [postId]: !prev[postId], // Toggle the expanded state
        }));
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
            {/*setPosts(
                posts.map((post) => (post._id === postId ? response.data : post))
            );*/}

            const updatedPost = response.data; // Updated post received from backend

            dispatch(setPosts(posts.map((post) =>
                post._id === postId ? { ...post, comments: updatedPost.comments } : post
            )));
    
            
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

            const response = await axios.patch(url, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }, { withCredentials: true });

            const { post, walletAmount, totalLikes, totalDislikes, postCount } = response.data;
            // Dispatch to Redux store

            {/*setPosts(prevPosts =>
    prevPosts.map(p => p._id === postId ? { ...p, ...post } : p)
);*/}
            //dispatch(updatePostReaction({ postId, updatedPost: post }));

            dispatch(updatePostReaction({
                postId,
                updatedPost: {
                    ...post,
                    userId: posts.find(p => p._id === postId)?.userId || post.userId, // Keep existing userId data
                }
            }));
            
            dispatch(updateMetrics({ walletAmount, totalLikes, totalDislikes, postCount }));


            //setPosts(prevPosts =>prevPosts.map(p => (p._id === postId ? { ...p, ...post } : p)));
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
        const tempPostId = Math.random().toString(36);
        const tempPost = {
            _id: tempPostId,
            userId: { username: user?.username || "Unknown", profilePic: user?.profilePic || "" },
            content: postContent,
            media: photo ? URL.createObjectURL(photo) : null,
            postType: photo ? "Photo" : "Text",
            createdAt: new Date().toISOString(),
        };

        //setPosts((prevPosts) => [tempPost, ...prevPosts]);
           setLoading(true)
        try {
            const formData = new FormData();

            const fileType = photo ? "photo" : (VoiceNote ? "audio" : "text");

            //formData.append('postType', photo ? "Photo" : "Text");
            formData.append('postType', fileType === 'audio' ? "VoiceNote" : (photo ? "Photo" : "Text"));


            formData.append('content', postContent || '');
            if (photo) formData.append("media", photo);
            if (VoiceNote) formData.append("media", VoiceNote);
            //formData.append("stickyDuration", stickyDuration);
           
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/post/create`,
                formData,
                { headers },
                { withCredentials: true }
            );

            {/*setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === tempPostId ? response.data : post
                )
            );*/}
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setLoading(false);
            toast.success("Post created. Admin will review it before publishing.");
        } catch (error) {
            console.error("Error creating post:", error);
            setPosts((prevPosts) =>
                prevPosts.filter((post) => post._id !== tempPostId)
            );
            toast.error("Failed to create post");
        } finally {
            if (photo) URL.revokeObjectURL(tempPost.media);
            setLoading(false);
            setPostContent("");
            setPhoto(null);
            setPhotoPreview(null)
            setVoiceNote(null)
            setPostOverlayOpen(false);
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

                    //const updatedProfilePic = `${response.data.user?.profilePic}?t=${new Date().getTime()}`;
                    //setProfilePic(updatedProfilePic); // Update the state for immediate reflection
                    //setUserId((prevUser) => ({ ...prevUser, profilePic: updatedProfilePic })); // Update user state
                    // dispatch(setProfilePicture(updatedProfilePic));
                    //setProfilePic(data.user?.profilePic || ""); // Assuming API returns updated user


                    const updatedProfilePic = response.data.user?.profilePic;

                    // Update Redux state immediately after successful upload
                    dispatch(setUserDetails({ ...response.data.user }));

                    // Optionally, update the local state (if you're using one)
                    setProfilePic(updatedProfilePic);

                } else {
                    console.error(response.data.error);
                }


            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }
    };
    const displayProfilePic = profilePic || `https://via.placeholder.com/80`;


    const handleShare = (post) => {
        const postId = post._id; // Use the actual post's ID
       // const isLoggedIn = !!localStorage.getItem("token"); // Check login status
       const isLoggedIn = localStorage.getItem("token") !== null; 
       const shareUrl = isLoggedIn
            ? `${window.location.origin}/displaypost?postId=${postId}`
            : `${window.location.origin}/signup?postId=${postId}`;
            if (navigator.share) {
                navigator.share({
                    title: "Check out this post!",
                    text: "Here's a great post for you to read!",
                    url: shareUrl,
                })
                .then(() => console.log("Successfully shared!"))
                .catch((error) => console.error("Error sharing:", error));
            } else {
                navigator.clipboard.writeText(shareUrl)
                    .then(() => alert("Link copied to clipboard!"))
                    .catch((error) => console.error("Failed to copy:", error));
            }
    };

    const location = useLocation();
    const [highlightPostId, setHighlightPostId] = useState(null);
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const postId = queryParams.get("highlightPostId");

        if (postId) {
            fetchPostById(postId);
        }
    }, [location]);

    const fetchPostById = async (postId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/post/${postId}`);
            setHighlightPostId(response.data);
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    };


    // Track impression when component mounts
  {/*useEffect(() => {
    const trackImpression = async () => {
        if (!pos?._id) {
            console.error('Post ID is undefined');
            return;
          }
      try {
        const response =  await axios.post(`${import.meta.env.VITE_BASE_URL}/post/impression/${post._id}`);
        setImpressions(response.data.impressions);
      } catch (error) {
        console.error('Error tracking impression:', error);
      }
    };
    trackImpression();
  }, [pos]);*/}
  

    useEffect(() => {
        console.log("postId:", postId)
        const fetchPost = async () => {
          try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/post/${postId}`);
            setPos(response.data);
            console.log("post impression",response.data)
          } catch (error) {
            console.error('Error fetching post:', error);
          }
        };
      
        if (postId) {
          fetchPost();
        }
      }, [postId]);
      

    const fetchUserPosts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/userPosts`, {
                withCredentials: true,
            })
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching user posts:", error);
        }
    };

    const handleMouseEnter = () => {
        setIsOverlayOpen(true);
        if (posts.length === 0) {
            fetchUserPosts();
        }
    };

    const handleMouseLeave = () => setIsOverlayOpen(false);



    useEffect(() => {
        let isMounted = true;
        const fetchPosts = async () => {
            const queryParams = new URLSearchParams(location.search);
            const postId = queryParams.get("highlightPost");
            setHighlightPostId(postId);
            if (postsFetched || !isMounted) return;
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/post`, {
                    withCredentials: true,
                });;
                //setPosts(response.data); // Assuming API returns an array of posts
                setPostss(response.data);
                {/*const fetchedPosts = response.data || []; // Ensure it's an array
                setPosts(fetchedPosts.map(post => ({
                    ...post,
                    userId: post.userId || {}, // Default to an empty object if userId is missing
                })));*/}

                //dispatch(setPosts(response.data || [])); 
                setFilteredPosts(response.data.data);
                //const approvedPosts = response.data.filter((post) => post.status === "approved");
                //dispatch(setPosts(approvedPosts || [])); 

                if (postId) {
                    const highlightedPost = data.find((post) => post._id === postId);
                    const otherPosts = data.filter((post) => post._id !== postId);
                    setPosts([highlightedPost, ...otherPosts]);
                } else {
                    //setPosts(data);
                    const approvedPosts = response.data.filter((post) => post.status === "approved");
                    dispatch(setPosts(approvedPosts || []));
                }
                setPostsFetched(true);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
        return () => {
            isMounted = false;
        };

    }, [dispatch, postsFetched, location.search]);

    // Handle user selection from search bar
    const onUserSelect = (user) => {
        setSelectedUser(user);
        if (user) {
            // Filter posts by selected user's ID
            const userPosts = posts.filter((post) => post.userId === user._id);
            setFilteredPosts(userPosts); // Update filtered posts
        } else {
            setFilteredPosts(posts); // Reset to show all posts if no user is selected
        }
    };

    useEffect(() => {

        const fetchMetrics = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/usermatrics`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }, { withCredentials: true });
                setMetrics(response.data);
                const {  userName, profilePicture,walletAmount, totalLikes, totalDislikes, postCount } = response.data;

                // Dispatch fetched metrics to Redux store
                dispatch(
                    updateMetrics({
                        walletAmount,
                        totalLikes, totalDislikes,
                        postCount, userName, profilePicture,
                    })
                )

            } catch (error) {
                console.error("Error fetching metrics", error);
            }
        };
        //dispatch(fetchMetrics());
        fetchMetrics();
    }, []);


    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!searchQuery) {
                setSearchResults([]);
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/search?query=${searchQuery}`,
                );
                setSearchResults(response.data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const debounceFetch = setTimeout(fetchUsers, 300); // Debounce API calls
        return () => clearTimeout(debounceFetch); // Cleanup timeout
    }, [searchQuery]);

    const handleUserClick = async (userId, user) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/posts/${userId}`);
            //setPosts(response.data.data); // Update posts state

            const userPosts = response.data.data;

            // Update posts state by appending user-specific posts
            setPosts((prevPosts) => [
                ...prevPosts.filter((post) => post.userId !== userId), // Avoid duplicate entries
                ...userPosts,
            ]);


            console.log('Fetched Posts:', response.data.data);
            setSelectedUser(user); // Save selected user
            setSearchQuery(user.username); // Update search box with username
            setSearchResults([]); // Clear search results
            onUserSelect(user);

        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    };
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setSelectedUser(null); // Clear selected user if query changes
    }

    
useEffect(() => {
    const interval = setInterval(async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/post`, ); 
            dispatch(setPosts(response.data)); // Update Redux store
        } catch (error) {
            console.error("Error fetching posts:", error.response ? error.response.data : error.message);
        }
    }, 300000); 

    return () => clearInterval(interval);
}, [dispatch]);

const handleOkClick = () => {
    const postData = {
      content: postContent,
      media: photoPreview,
      voiceNote: VoiceNote,
    };
  
    localStorage.setItem("pendingPost", JSON.stringify(postData));
    navigate("/pricing"); // Redirect to pricing page
  };
  
  useEffect(() => {
    const savedPost = JSON.parse(localStorage.getItem("pendingPost"));
    if (savedPost) {
      setPostContent(savedPost.content || "");
      setPhotoPreview(savedPost.media || null);
      setVoiceNote(savedPost.voiceNote || null);
      setStickyDuration(savedPost.stickyDuration || ""); // Now it includes the selected duration
    }
  }, []);

  

    return (
        <div className="min-h-screen  bg-slate-50 flex flex-col lg:flex-row gap-4 pr-8 py-4 lg:mt-28 mt-20">
            <NavbarLanding />
      
            {/* Left Section */}
            <div className="lg:w-1/4 w-full max-h-[600px] bg-white border border-gray-300 rounded-lg lg:ml-32 ml-6 pl-4 p-4 space-y-4 shadow-sm ">
             {/* User Info */}
                <div className="text-center ">
                    <div
                        onClick={() => document.getElementById('profilePic').click()}
                        className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-2 cursor-pointer flex justify-center items-center "
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

                    {/* {
                        user?.username ? (
                            <p className="text-lg font-semibold" onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}>{user.username}</p>
                        ) : ("")
                        
                    }*/}
                    <div className="relative inline-block">
                        <Link to="/profile"
                            className="text-lg font-semibold cursor-pointer"
                          
                        >
                            {user?.username}
                        </Link>

                        {isOverlayOpen && (
                            <div
                                className="absolute top-10 left-0"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <UserOverlay user={user} posts={posts} />
                            </div>
                        )}
                    </div>

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

                <div className="bg-gray-50 border border-gray-300 rounded-md p-4 ">

                    <p className="text-sm font-medium">Wallet Balance</p>
                    {/*<p className="text-lg font-bold text-green-600">{walletAmount}</p>*/}
                    <p className="text-lg font-bold text-green-200">0</p>
                </div>

                {/* Reactions Box */}
                <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
                    <p className="text-sm font-medium">Reactions</p>
                    <div className="flex items-center space-x-3 mt-2">
                        <span>👍 {metrics.totalLikes}</span>
                        <span>👎 {metrics.totalDislikes}</span>
                      

                    </div>
                </div>

                {/* Posts Count */}
                <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
                    <Link to="/userposts" className="text-sm font-medium">Posts</Link>
                    <p className="text-lg font-bold text-blue-600">{metrics.postCount}</p>

                </div>

                {/* Posts Impressions */}
                <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
                <p  className="text-sm font-medium">Posts Impressions</p>
                    <p className="text-lg font-bold text-blue-600">{metrics.totalImpressions}</p>

                </div>




                {/* Settings */}
                <div className="flex items-center space-x-2 pb-4 mb-4 cursor-pointer ">
                    <IoSettings />
                    <Link to="/settings"  className="text-sm font-medium cursor-pointer ">Settings</Link>
                </div>
            </div>

            {/* Right Section */}
            <div className="lg:w-2/4 w-full bg-white border border-gray-300 rounded-lg ml-6 lg:ml-16 shadow-sm p-6 mt-6">
                {/* Write a Post Section */}


                

                <div className="flex items-center mb-6">


                    {user?.profilePic ? (
                        <img
                            src={user.profilePic}
                            alt="User"
                            className="w-12 h-12 rounded-full"
                        />
                    ) : (
                        <FaUser className="w-10 h-10 p-1 text-gray-400 bg-white rounded-full border-4 border-white shadow-lg" />
                    )}




                    <div
                        className="ml-4 bg-gray-50 border border-gray-300 rounded-md p-2 w-full cursor-pointer"
                        onClick={() => setPostOverlayOpen(true)}
                    
                    >
                        Write a post...
                    </div>

                </div>

                {/* Posts Section */}
                {posts.map((post,index) => (
                    <div
                        key={post._id}  data-post-id={post._id}
                        ref={(el) => (postRefs.current[index] = el)}
                        // className="bg-white border border-gray-300 rounded-lg shadow-sm mb-6 p-4"
                       //className={`bg-white ${post._id === highlightPostId ? "bg-yellow-300" : ""
                            //} border border-gray-300 rounded-lg shadow-sm mb-6 p-4 ${selectedUser && post.userId === selectedUser._id ? "bg-blue-500" : ""
                           // }`}
                           className={`relative bg-white border border-gray-300 rounded-lg shadow-sm mb-6 p-4 
                            ${post._id === highlightPostId ? "bg-yellow-300" : ""} 
                            ${selectedUser && post.userId === selectedUser._id ? "bg-blue-500" : ""}`}
                           
                    >

                          {/* 📌 Pin Icon for Pinned Posts */}
        {post.sticky && (
            <div className="absolute top-2 right-2 text-yellow-500">
                <FaThumbtack size={20} />
            </div>
        )}

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
                                <Link to={`/profile/${post.userId?._id}`} className="text-sm font-semibold">{post?.userId?.username || "Unknown User"}</Link>


                                <p className="text-xs text-gray-500">{post.createdAt ? formatDate(post.createdAt) : "Loading..."}</p>

                            </div>

                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-800">
                                {post.content && post.content.split(" ").length > 8 && !expandedPosts[post._id]  ? (
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
                                    <>
        {post.content || "No content available"}
        {post.content.split(" ").length > 8 && (
          <button
            className="text-blue-500 hover:underline text-xs ml-2"
            onClick={() => handleViewMore(post._id)}
          >
             Less
          </button>
        )}
      </>
                                )}
                            </p>
                            {post.postType === "Photo" && (
                                <img
                                    src={post.mediaUrl}
                                    alt="Post Media"
                                    className="w-full h-[450px] object-cover rounded-md mt-3"
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

                                onClick={() => handleShare(post)}

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
                ))
                }

                {/* Post Overlay */}
                {
                    postOverlayOpen && (
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
                                    {user?.profilePic ? (
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


                            {/* Sticky Duration Dropdown */}
            <div className="mb-6">
              <label className="block  text-gray-700 mb-2">
                Display your  post on Top For:
              </label>
              <select
                value={stickyDuration}
                onChange={(e) => {
                    setStickyDuration(e.target.value);
                    handleDurationClick(e.target.options[e.target.selectedIndex].text);
                  }}
                
                className="w-full p-2 border border-gray-300 rounded  focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
             
                <option value="3600000">1 Hour</option>
                <option value="10800000">3 Hours</option>
                <option value="21600000">6 Hours</option>
                <option value="43200000">12 Hours</option>
              </select>
              {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-72 h-54 p-5 rounded shadow-lg">
            <p className="mb-4">
              Hi {user.username}, Pin Posts are a premium service on the Web Magnifier platform. To view pricing and available time slots, please click on Ok
            </p>
            <button
              className="px-4 py-2 bg-red-500 hover:bg-red-600 hover:scale-105 text-white rounded"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
            <button
                className="px-4 py-2 ml-2 w-16 bg-blue-500 hover:bg-blue-600 hover:scale-105 text-white rounded"
                onClick={handleOkClick} 
              >
                OK
              </button>
          </div>
        </div>
      )}
            </div>

            


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
                                {VoiceNote && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium">Voice Note:</p>
                                        <p className="text-gray-600">{VoiceNote.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
            </div >

        </div >
    )
}



export default LandingPage;
