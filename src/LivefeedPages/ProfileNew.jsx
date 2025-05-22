import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'
import {
  MapPin,
  Calendar,
  Award, FileText,
  Users,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Eye,
  Wallet,
  ChevronRight,
  Edit3,
  Camera,
  Share2,
  Bookmark, ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Image as ImageIcon,
  Play,
  CheckCircle2,
  Trash2, ChevronLeft,
  X
} from 'lucide-react';

import { toast } from 'react-toastify';
import { setUserDetails, updatePostReaction, updateMetrics } from '../features/user/userSlice';
import { HorizontalStats } from '../componenets/Livefeed/HorizontalStats';

const ProfileNew = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const currentUser = useSelector(state => state.user.user);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [commentsVisible, setCommentsVisible] = useState({});
  const [displayCount, setDisplayCount] = useState(6);
  const [activeTab, setActiveTab] = useState('posts');
  const [showOverlay, setShowOverlay] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCoverPicDropdown, setShowCoverPicDropdown] = useState(false);
  const [showDeleteCoverModal, setShowDeleteCoverModal] = useState(false);
  const [showProfilePicDropdown, setShowProfilePicDropdown] = useState(false);
  const tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'media', label: 'Media' },
    { id: 'stats', label: 'Stats' }
  ];
  console.log("currentUser:", currentUser, "user:", user);
  const coverPicInputRef = useRef(null);
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 / 1 }); // Square crop for profile pics
  const [image, setImage] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const fileInputRef = useRef(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const imgRef = useRef(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result));
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  const handleProfilePicUpload = async () => {
    const croppedImage = await getCroppedImg();

    if (croppedImage) {
      try {
        const file = new File([croppedImage], 'profile-pic.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now()
        });

        const formData = new FormData();
        formData.append('profilePic', file);

        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        };

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/add-profilepic`,
          formData,
          { headers, withCredentials: true }
        );

        if (response.data?.user) {
          const updatedProfilePic = response.data.user.profilePic
            ? `${response.data.user.profilePic}?${Date.now()}`
            : '';

          // Create new user object with updated profile picture
          const updatedUser = {
            ...response.data.user,
            profilePic: updatedProfilePic
          };

          // Update local state
          setUser(updatedUser);

          // Update Redux store
          dispatch(setUserDetails(updatedUser));
          dispatch(setUserDetails({
            ...response.data.user,
            profilePic: updatedProfilePic
          }));
          // Clear any cached image
          if (imgRef.current) {
            imgRef.current.src = '';
          }

          toast.success("Profile picture updated successfully");
          setSrc(null);
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(error.response?.data?.message || "Update failed");
      }
    }
  };;
  const deleteProfilePic = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/user/delete-profilepic`,
        { headers, withCredentials: true }
      );

      if (response.status === 200) {
        const updatedUser = {
          ...response.data.user,
          profilePic: '' // Set to empty or default image
        };
        setUser(updatedUser);
        dispatch(setUserDetails(updatedUser));
        toast.success("Profile picture deleted successfully");
      }
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      toast.error("Failed to delete profile picture");
    }
  };

  // Add this effect to your component
  useEffect(() => {
    const handleClickOutside = (event) => {
      // For profile pic dropdown
      if (showProfilePicDropdown && !event.target.closest('.profile-pic-dropdown-container')) {
        setShowProfilePicDropdown(false);
      }
      // For cover pic dropdown
      if (showCoverPicDropdown && !event.target.closest('.cover-pic-dropdown-container')) {
        setShowCoverPicDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfilePicDropdown, showCoverPicDropdown]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [profileRes, postsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/user/userprofile`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/user/userPosts`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setUser(profileRes.data);
        setPosts(postsRes.data.data || []);
        dispatch(setUserDetails(profileRes.data));
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, dispatch]);

  const handleCoverPicUpload = async (event) => {
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

        const updatedUser = response.data.user;
        setUser(updatedUser);
        dispatch(setUserDetails(updatedUser));
        toast.success("Cover photo updated successfully");
      } catch (error) {
        console.error("Error uploading cover picture:", error);
        toast.error("Failed to update cover photo");
      }
    }
  };

  {/*const handleProfilePicUpload = async (event) => {
  
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
                      const updatedUser = {
                        ...response.data.user,
                        // This adds a timestamp to force image reload without browser cache
                        profilePic: `${response.data.user.profilePic}?t=${Date.now()}`
                      };
                      setUser(updatedUser);

                      // ✅ Update Redux store
                      dispatch(setUserDetails(updatedUser));
              
                      toast.success("Profile picture updated successfully");
                     
                      //const updatedProfilePic = `${response.data.user?.profilePic}?t=${Date.now()}`;
                      //setProfilePic(updatedProfilePic);
                      //dispatch(setUserDetails({ ...response.data.user, profilePic: updatedProfilePic }));
  
                  } else {
                      console.error(response.data.error);
                  }
  
  
              } catch (error) {
                  console.error('Error uploading profile picture:', error);
              }
          }
      };*/}

  const deletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/post/delete/${postId}`,
        { headers, withCredentials: true }
      );

      toast.success("Post deleted successfully");
      setPosts(posts.filter(post => post._id !== postId));
      setShowOverlay(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const handleReaction = async (postId, reactionType) => {
    try {
      const url = reactionType === "like"
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

      setPosts(posts.map(post =>
        post._id === postId ? { ...post, comments: response.data.comments } : post
      ));
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const toggleComments = (postId) => {
    setCommentsVisible(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const deleteCoverPic = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/user/delete-coverpic`,
        { headers, withCredentials: true }
      );

      if (response.status === 200) {
        const updatedUser = {
          ...response.data.user,
          coverPic: '' // Set to empty or null
        };
        setUser(updatedUser);
        dispatch(setUserDetails(updatedUser));
        toast.success("Cover photo deleted successfully");
      }
    } catch (error) {
      console.error('Error deleting cover photo:', error);
      toast.error("Failed to delete cover photo");
    }
  };

  const renderPosts = () => (
    <div className="space-y-6 pb-10">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <img
                  src={user.profilePic || "/default-profile.png"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </span>
                    {user.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>


              </div>



              <div className="relative">
                <button
                  onClick={() => setShowOverlay(showOverlay === post._id ? null : post._id)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {showOverlay === post._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => deletePost(post._id)}
                      className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Post
                    </button>
                    <button
                      onClick={() => setShowOverlay(null)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Post Content */}
            <div className="p-4">
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {post.content}
              </p>

              {/* Media */}
              {post.postType === "Photo" && post.mediaUrl && (
                <img
                  src={post.mediaUrl}
                  alt="Post media"
                  className="w-full h-auto max-h-96 object-contain rounded-lg mt-4"
                />
              )}
              {post.postType === "VoiceNote" && post.mediaUrl && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center">
                  <Play className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-3" />
                  <audio
                    controls
                    src={post.mediaUrl}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Engagement */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleReaction(post._id, "like")}
                  className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.likes || 0}</span>
                </button>
                <button
                  onClick={() => handleReaction(post._id, "dislike")}
                  className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <ThumbsDown className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.dislikes || 0}</span>
                </button>
                <button
                  onClick={() => toggleComments(post._id)}
                  className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <button className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>

            {/* Comments Section */}
            {commentsVisible[post._id] && (
              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                {/* Add Comment */}
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={currentUser?.profilePic || "/default-profile.png"}
                    alt="Your profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 bg-transparent text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                {post.comments?.length > 0 && (
                  <div className="space-y-3">
                    {post.comments
                      .slice()
                      .reverse()
                      .slice(0, displayCount)
                      .map((comment, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <img
                            src={comment.userId?.profilePic || "/default-profile.png"}
                            alt="Commenter"
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {comment.userId?.username || 'Anonymous'}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      ))}

                    {/* Load More / Close Comments */}
                    <div className="flex justify-center mt-3">
                      {displayCount < post.comments.length ? (
                        <button
                          onClick={() => setDisplayCount(prev => prev + 6)}
                          className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Load more comments
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleComments(post._id)}
                          className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Close comments
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No posts available
        </div>
      )}
    </div>
  );

  const renderMedia = () => {
    const mediaPosts = posts.filter(post => post.postType === "Photo" || post.postType === "VoiceNote");

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {mediaPosts.length > 0 ? (
          mediaPosts.map((post) => (
            <div key={post._id} className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden">
                {post.postType === "Photo" ? (
                  <img
                    src={post.mediaUrl}
                    alt="Post media"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90">
                        <Play className="w-6 h-6 text-gray-900" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {post.content.substring(0, 30)}...
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(post.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-10 text-gray-500 dark:text-gray-400">
            No media posts available
          </div>
        )}
      </div>
    );
  };

  const renderStats = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Posts</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {posts.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <MessageSquare className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Comments</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <ThumbsUp className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Likes</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {posts.reduce((sum, post) => sum + (post.likes || 0), 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <ThumbsDown className="w-5 h-5 text-red-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Dislikes</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {posts.reduce((sum, post) => sum + (post.dislikes || 0), 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <Eye className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Impressions</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {posts.reduce((sum, post) => sum + (post.impressions || 0), 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <Wallet className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Wallet</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {user?.walletAmount?.toLocaleString() || 0}
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (


    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 w-full">
        {user.coverPic ? (
          <img
            src={user.coverPic}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-lg">Cover Photo</span>
          </div>
        )}

        {/*<label htmlFor="coverPic" className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 cursor-pointer">
          <Camera className="w-5 h-5" />
          <input
            type="file"
            id="coverPic"
            accept="image/*"
            onChange={handleCoverPicUpload}
            className="hidden"
          />
        </label>*/}
        <input
  type="file"
  id="coverPic"
  accept="image/*"
  ref={coverPicInputRef}
  onChange={handleCoverPicUpload}
  className="hidden"
/>

        {/* Cover Photo Actions */}
      <div className="absolute bottom-4 right-4">
  <div className="relative">
    <button
      onClick={() => setShowCoverPicDropdown(!showCoverPicDropdown)}
      className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 cursor-pointer"
    >
      <Camera className="w-5 h-5" />
    </button>

    {showCoverPicDropdown && (
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20">
        <div className="py-1">
          <label
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            //onClick={() => coverPicInputRef.current?.click()}
           onClick={() => {
    console.log('Attempting to click file input');
    console.log('Input ref:', coverPicInputRef.current);
    coverPicInputRef.current?.click();
  }}
          >
            <Camera className="w-4 h-4 mr-2" />
            <span>{user.coverPic ? "Change" : "Add"} cover photo</span>
          </label>

          {user.coverPic && (
            <button
              onClick={() => {
                setShowCoverPicDropdown(false);
                setShowDeleteCoverModal(true);
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete cover photo
            </button>
          )}
        </div>
      </div>
    )}
  </div>
</div>
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user?.profilePic ? `${user.profilePic}?${Date.now()}` : "/userProfile.avif"}
                alt={user?.username}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-profile.png";
                }}
              />

              <div className="absolute -bottom-2 -right-2">
                <div className="relative">
                  <button
                    onClick={() => setShowProfilePicDropdown(!showProfilePicDropdown)}
                    className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 cursor-pointer z-10"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {showProfilePicDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <label
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          role="menuitem"
                          htmlFor="profilePic"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          <span>{user.profilePic ? "Change" : "Add"} profile photo</span>
                          <input
                            type="file"
                            id="profilePic"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>

                        {user.profilePic && (
                          <button
                            onClick={() => {
                              setShowProfilePicDropdown(false);
                              setShowDeleteModal(true);
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            role="menuitem"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete profile photo
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="mt-4 sm:ml-6 sm:mt-0">
              <div className="flex flex-col space-x-2">
                <div className='pl-2'>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.username}
                  </h1>
                </div>
                <div className='text-sm text-slate-600'>
                  <span>{user.email}</span>
                </div>
                {user.verified && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="mt-4">
              <p className="text-gray-700 dark:text-gray-300">
                {user.bio}
              </p>
            </div>
          )}

          <HorizontalStats posts={posts} user={user} />

          {/* Tabs Navigation */}
          <div className="mt-8 border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                  pb-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'posts' && renderPosts()}
            {activeTab === 'media' && renderMedia()}
            {activeTab === 'stats' && renderStats()}
          </div>
        </div>

        {/* Crop Modal */}
        {src && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-md w-full">
              <ReactCrop
                crop={crop}
                onChange={setCrop}
                onComplete={setCompletedCrop}
                aspect={1}
              >
                <img
                  ref={imgRef}
                  src={src}
                  alt="Crop me"
                  onLoad={(e) => {
                    const { width, height } = e.currentTarget;
                    setCrop({
                      unit: 'px',
                      width: Math.min(width, height),
                      height: Math.min(width, height),
                      x: (width - Math.min(width, height)) / 2,
                      y: (height - Math.min(width, height)) / 2,
                    });
                  }}
                  style={{ maxWidth: '100%', maxHeight: '70vh' }}
                />
              </ReactCrop>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => setSrc(null)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfilePicUpload}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">Delete Profile Picture</h3>
              <p className="mb-6">Are you sure you want to remove your profile picture?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteProfilePic();
                    setShowDeleteModal(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Cover Photo Confirmation Modal */}
        {showDeleteCoverModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full dark:bg-gray-800">
              <h3 className="text-lg font-bold mb-4 dark:text-white">Delete Cover Photo</h3>
              <p className="mb-6 dark:text-gray-300">Are you sure you want to remove your cover photo?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteCoverModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await deleteCoverPic();
                    setShowDeleteCoverModal(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default ProfileNew;