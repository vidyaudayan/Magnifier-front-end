


import React, { useState, useRef,useEffect } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  CheckCircle2,
  ExternalLink,
  Mic,Flag,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateMetrics, updatePostReaction, setPosts, updatePostComments ,updateWalletData} from '../../features/user/userSlice';
import { useSelector } from 'react-redux';
import { Edit3, Trash2 } from 'lucide-react';

const PostCard = ({
  post,
  user,
  highlightPostId,
  selectedUser,
 
}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);
  //const currentUser = useSelector(state => state.user.user);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [displayCount, setDisplayCount] = useState(6);
  const [loading, setLoading] = useState(false);

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
const [showReportDialog, setShowReportDialog] = useState(false);
const [reportReason, setReportReason] = useState('');
const [selectedReportType, setSelectedReportType] = useState('');
  const postRef = useRef(null);
  //console.log('Redux currentUser in component:', currentUser);
  const currentPosts = useSelector(state => state.user.posts);
  const posts = useSelector((state) => state.user.posts);
  PostCard.defaultProps = {
    post: {
      _id: '',
      content: '',
      postType: '',
      mediaUrl: '',
      userId: {},
      comments: [],
      likes: 0,
      dislikes: 0,
      sticky: false,
      stickyUntil: null,
      createdAt: new Date().toISOString()
    },
    user: {},
    highlightPostId: null,
    selectedUser: null,
    expandedPosts: {},
    handleViewMore: () => { }
  };
  const [isUserLoaded, setIsUserLoaded] = useState(false);

    const [expandedPosts, setExpandedPosts] = useState({});
   
const handleReportPost = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/post/report/${post._id}`,
      { 
        reason: reportReason,
        reportType: selectedReportType 
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Post reported successfully. Admin will review it.");
    setShowReportDialog(false);
    setReportReason('');
    setSelectedReportType('');
  } catch (error) {
    console.error("Error reporting post:", error);
    toast.error(error.response?.data?.message || "Failed to report post");
  }
};
    const handleViewMore = (postId) => {
        setExpandedPosts((prev) => ({
            ...prev,
            [postId]: !prev[postId], // Toggle the expanded state
        }));
    };
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const trackPostImpression = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/post/impression/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };

  // Intersection Observer for impression tracking
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackPostImpression(post._id);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (postRef.current) {
      observer.observe(postRef.current);
    }

    return () => {
      if (postRef.current) {
        observer.unobserve(postRef.current);
      }
    };
  }, [post._id]);

  const fetchPopulatedPostById = async (postId) => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/post/${postId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.post; // Make sure backend returns `post` inside the response
  };



  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/post/${postId}/comment`,
        { comment: newComment },
        { headers }
      );

      // Update only the specific post's comments
      dispatch(updatePostComments({
        postId,
        comments: response.data.comments
      }));

      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  
  // 9.44
  {/*const handleReaction = async (postId, reactionType) => {
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/post/${postId}/${reactionType}`;

      const response = await axios.patch(url, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Handle successful response
      const {post:updatedPost,  walletAmount, totalLikes, totalDislikes, postCount } = response.data;
      
      dispatch(updatePostReaction({
        postId,
        updatedPost: {
          ...updatedPost,
          userId: post.userId
        }
      }));

      dispatch(updateMetrics({ walletAmount, totalLikes, totalDislikes, postCount }));

    } catch (error) {
      // Improved error handling
      if (error.response) {
        // 400 errors (like/dislike own post)
        if (error.response.status === 400) {
          toast.error(error.response.data.message);
          return;  // Important: Return early to prevent state updates
        }
        // Other error statuses
        toast.error(`Error ${reactionType}ing post: ${error.response.data.message}`);
      } else {
        // Network errors
        toast.error(`Network error - failed to ${reactionType} post`);
      }
      console.error(`${reactionType} error:`, error);
    }
  };*/}
  // new

  const handleReaction = async (postId, reactionType) => {
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/post/${postId}/${reactionType}`;

      const response = await axios.patch(url, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Get current posts from Redux store


      // Find the current post in state to preserve comment user data
      const currentPost = currentPosts.find(p => p._id === postId);

      if (!currentPost) {
        throw new Error("Post not found in current state");
      }

      // Create updated post by merging existing data with new reaction counts
      const updatedPost = {
        ...currentPost, // preserve existing data including comments with user info
        likes: response.data.post.likes,
        dislikes: response.data.post.dislikes,
        // preserve userId if it exists in current post
        userId: currentPost.userId || response.data.post.userId
      };

      dispatch(updatePostReaction({
        postId,
        updatedPost
      }));

      dispatch(updateMetrics({
        walletAmount: response.data.walletAmount,
        totalLikes: response.data.totalLikes,
        totalDislikes: response.data.totalDislikes,
        postCount: response.data.postCount
      }));

      if (response.data.earnedPoints !== undefined) {
        dispatch(updateWalletData({
          earnedPoints: response.data.earnedPoints,
          rechargedPoints: response.data.rechargedPoints,
          // Include transactions if needed
        }));
      }

    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data.message);
          return;
        }
        toast.error(`Error ${reactionType}ing post: ${error.response.data.message}`);
      } else {
        toast.error(`Network error - failed to ${reactionType} post`);
      }
      console.error(`${reactionType} error:`, error);
    }
  };
  const handleShare = (post) => {
    const postId = post._id;
    const shareUrl = `${window.location.origin}/loginshare?postId=${postId}`;

    if (navigator.share) {
      navigator.share({
        title: "Check out this post on Magnifier!",
        text: post.content?.substring(0, 100) || "Interesting post",
        url: shareUrl,
      }).catch(() => {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  
  const handleEditComment = async (postId, commentId, newCommentText) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/post/${postId}/comment/${commentId}`,
        { comment: newCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Find the post in Redux state
      const updatedPosts = posts.map(post => {
        if (post._id === postId) {
          // Update the specific comment
          const updatedComments = post.comments.map(comment => 
            comment._id === commentId 
              ? { ...comment, comment: newCommentText } 
              : comment
          );
          return { ...post, comments: updatedComments };
        }
        return post;
      });
  
      // Update both Redux and local state
      dispatch(setPosts(updatedPosts));
      setComments(updatedPosts.find(p => p._id === postId).comments);
      
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error("Error editing comment:", error);
      toast.error(error.response?.data?.message || "Failed to edit comment");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/post/${postId}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Update both Redux and local state
      const updatedPosts = posts.map(post => {
        if (post._id === postId) {
          // Filter out the deleted comment
          const updatedComments = post.comments.filter(comment => 
            comment._id !== commentId
          );
          return { ...post, comments: updatedComments };
        }
        return post;
      });
  
      // Update Redux state
      dispatch(setPosts(updatedPosts));
      
      // Update local comments state
      setComments(updatedPosts.find(p => p._id === postId).comments);
      
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  useEffect(() => {
    // Update local comments when Redux posts change
    const updatedPost = posts.find(p => p._id === post._id);
    if (updatedPost) {
      setComments(updatedPost.comments);
    }
  }, [posts, post._id]);

  useEffect(() => {
    const currentPost = posts.find(p => p._id === post._id);
    if (currentPost) {
      setComments(currentPost.comments);
    }
  }, [posts, post._id]);
  

  return (
    <div
      ref={postRef}
      data-post-id={post._id}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 mb-4
        ${post._id === highlightPostId ? "bg-yellow-300 dark:bg-yellow-700" : ""} 
        ${selectedUser && post.userId === selectedUser._id ? "bg-blue-100 dark:bg-blue-900" : ""}`}
    >
      {/* Pin Indicator */}
      {post.sticky && (
        <div className="absolute top-4 right-4 flex items-center text-yellow-500 dark:text-yellow-400">
          <span className="text-xs mr-2">
            Pinned until: {new Date(post.stickyUntil).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            })}
          </span>
          <Bookmark className="w-4 h-4" />
        </div>
      )}
  
      {/* Post Header */}
      <div className="flex items-start justify-between p-5 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center space-x-3.5">
          {post.userId?.profilePic ? (
            <img
              src={post.userId.profilePic}
              alt={`${post.userId.username || 'User'}'s Profile`}
              className="w-11 h-11 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '';
                e.target.parentNode.innerHTML = `
                  <div class="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    ${post?.userId?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>`;
              }}
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
              {post?.userId?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
  
          <div>
            <div className="flex items-center space-x-1.5">
              <Link to={`/livefeed/userprofile/${post.userId?._id}`} className="font-medium text-gray-900 dark:text-white">
                {post?.userId?.username || "Unknown User"}
              </Link>
              {post.userId?.verified && (
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-[13px] text-gray-500 dark:text-gray-400">
              <span>{post.createdAt ? formatDate(post.createdAt) : "Loading..."}</span>
            </div>
          </div>
        </div>
       <div className="relative">
  <button 
    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 -mt-1"
    onClick={() => setShowOptionsMenu(!showOptionsMenu)}
  >
    <MoreHorizontal className="w-5 h-5" />
  </button>
  
  {showOptionsMenu && (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
      <div className="py-1">
        {currentUser?._id !== post.userId?._id && (
          <button
            onClick={() => {
              setShowOptionsMenu(false);
              setShowReportDialog(true);
            }}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
          >
            <Flag className="w-4 h-4 mr-2" />
            Report Post
          </button>
        )}
      </div>
    </div>
  )}
</div>

{showReportDialog && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
      <h3 className="text-lg font-medium mb-4 dark:text-white">Report Post</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Please select the reason for reporting this post:
      </p>
      
      <div className="space-y-2 mb-4">
        {['Inappropriate Content', 'Hate Speech', 'Harassment', 'Spam', 'False Information', 'Other'].map((type) => (
          <label key={type} className="flex items-center space-x-2">
            <input
              type="radio"
              name="reportType"
              value={type}
              checked={selectedReportType === type}
              onChange={() => setSelectedReportType(type)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="text-gray-700 dark:text-gray-300">{type}</span>
          </label>
        ))}
      </div>
      
      {selectedReportType === 'Other' && (
        <textarea
          placeholder="Please specify the reason..."
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 dark:bg-gray-700 dark:text-white"
          rows={3}
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
        />
      )}
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            setShowReportDialog(false);
            setReportReason('');
            setSelectedReportType('');
          }}
          className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleReportPost}
          disabled={!selectedReportType || (selectedReportType === 'Other' && !reportReason)}
          className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed"
        >
          Submit Report
        </button>
      </div>
    </div>
  </div>
)}
      </div>
  
      {/* Post Content */}
      <div className="p-5">
        <p className="text-gray-900 dark:text-white text-[15px] leading-relaxed whitespace-pre-wrap">
          {post.content && post.content.split(" ").length > 18 && !expandedPosts[post._id] ? (
            <>
              {post.content.split(" ").slice(0, 18).join(" ")}...{" "}
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
  
        {/* Media */}
        {post.postType === "Photo" && post.mediaUrl && (
          <img
            src={post.mediaUrl}
            alt="Post Media"
            className="w-full h-[450px] object-cover rounded-xl mt-4"
          />
        )}
        {post.postType === "VoiceNote" && post.mediaUrl && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center">
            <Mic className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-3" />
            <audio
              controls
              src={post.mediaUrl}
              className="w-full"
            />
          </div>
        )}
      </div>
  
      {/* Engagement Stats */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 cursor-default">
            {post.likes || 0} Likes
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 cursor-default">
            {post.dislikes || 0} Dislikes
          </span>
           <span className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 cursor-default">
      {post.impressions || 0} Impressions
    </span>
          <button
            onClick={() => setCommentsVisible(!commentsVisible)}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
          >
            {post.comments?.length || 0} Comments
          </button>
        </div>
      </div>
  
      {/* Action Buttons */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => handleReaction(post._id, "like")}
            className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ThumbsUp className="w-5 h-5" />
            <span className="text-sm">Like</span>
          </button>
          <button
            onClick={() => handleReaction(post._id, "dislike")}
            className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          >
            <ThumbsDown className="w-5 h-5" />
            <span className="text-sm">Dislike</span>
          </button>
          <button
            onClick={() => setCommentsVisible(!commentsVisible)}
            className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">Comment</span>
          </button>
          <button
            onClick={() => handleShare(post)}
            className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>
  
      {/* Comment Section */}
      {commentsVisible && (
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700/50">
          {/* Add Comment Form */}
          <div className="flex items-center space-x-3 mb-4">
            <textarea
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl p-3 resize-none text-sm bg-transparent text-gray-900 dark:text-white"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={2}
            />
            <button
              onClick={() => handleAddComment(post._id)}
              disabled={loading || !newComment.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Posting..." : "Add"}
            </button>
          </div>
  
          {/* Comments List */}
          {post.comments?.length > 0 && (
            <div className="space-y-3">
              {comments
                .slice()
                .reverse()
                .slice(0, displayCount)
                .map((comment, index) => (
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl flex items-start gap-3">
                  
                    <div className="flex-shrink-0">
                      {comment.userId?.profilePic ? (
                        <img 
                          src={comment.userId.profilePic} 
                          alt="User" 
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentNode.innerHTML = `
                              <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                ${comment.userId?.username?.charAt(0).toUpperCase() || 'A'}
                              </div>`;
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                          {comment.userId?.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                      )}
                    </div>
  
                   
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {comment.userId?.username || 'Anonymous'}
                        </span>
                        
                      
                    {currentUser?._id?.toString() === comment.userId?._id?.toString() && (
                    
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newCommentText = prompt("Edit your comment:", comment.comment);
                                if (newCommentText && newCommentText !== comment.comment) {
                                  handleEditComment(post._id, comment._id, newCommentText);
                                }
                              }}
                              className="text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 p-1"
                              title="Edit comment"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm("Are you sure you want to delete this comment?")) {
                                  handleDeleteComment(post._id, comment._id);
                                }
                              }}
                              className="text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1"
                              title="Delete comment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                       )}
                      </div>
                      
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 break-words">
                        {comment.comment}
                      </p>
                      
                     
                    </div>
                  </div>
                ))}

                
  
              {/* Load More / Close Comments Buttons */}
              <div className="flex justify-center mt-3">
                {displayCount < post.comments.length ? (
                  <button
                    onClick={() => setDisplayCount(prev => prev + 6)}
                    className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Load More Comments
                  </button>
                ) : post.comments.length > 6 ? (
                  <button
                    onClick={() => setDisplayCount(6)}
                    className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Show Less
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;