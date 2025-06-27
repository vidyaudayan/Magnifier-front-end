import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { updateMetrics, updatePostReaction, setPosts } from "../features/user/userSlice";

const SharePostDisplayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.user.posts);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [displayCount, setDisplayCount] = useState(5);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const { postId: pathPostId } = useParams();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Link copied to clipboard!");
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        toast.success("Link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
      document.body.removeChild(textarea);
    });
  };


useEffect(() => {
  let isMounted = true;
  
  const fetchPost = async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      let postId = queryParams.get("postId") || 
                  localStorage.getItem("sharedPostId") || 
                  sessionStorage.getItem("sharedPostId") || 
                  pathPostId;

      // Clear storage after getting the ID
      localStorage.removeItem("sharedPostId");
      sessionStorage.removeItem("sharedPostId");

      if (!postId) {
        navigate("/posts");
        return;
      }

      // Ensure the URL reflects the postId
      if (!queryParams.get("postId") && postId) {
        navigate(`/livefeed/displaypost?postId=${postId}`, { replace: true });
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/post/${postId}`
      );
      
      if (isMounted) {
        if (response.data.success) {
          setPost(response.data.data);
        } else {
          throw new Error("Post not found");
        }
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("The post could not be loaded");
      navigate("/posts");
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchPost();
  
  return () => {
    isMounted = false;
  };
}, [location.search, pathPostId, navigate]);

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/post/${postId}/comment`,
        { comment: newComment },
        { headers }
      );

      const updatedPost = response.data;
      
      dispatch(setPosts(posts.map((post) =>
        post._id === postId ? { ...post, comments: updatedPost.comments } : post
      )));

      setPost(prev => ({
        ...prev,
        comments: updatedPost.comments
      }));
      
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleReaction = async (postId, reactionType) => {
    try {
      // Optimistic UI update
      setPost(prevPost => {
        if (!prevPost) return prevPost;
        
        const newPost = { ...prevPost };
        const userReaction = newPost.userReaction || {};
        
        // Remove opposite reaction if exists
        if (reactionType === 'like' && userReaction.disliked) {
          newPost.dislikes = (newPost.dislikes || 1) - 1;
          delete userReaction.disliked;
        } else if (reactionType === 'dislike' && userReaction.liked) {
          newPost.likes = (newPost.likes || 1) - 1;
          delete userReaction.liked;
        }
        
        // Add new reaction
        if (reactionType === 'like') {
          newPost.likes = (newPost.likes || 0) + (userReaction.liked ? -1 : 1);
          userReaction.liked = !userReaction.liked;
        } else {
          newPost.dislikes = (newPost.dislikes || 0) + (userReaction.disliked ? -1 : 1);
          userReaction.disliked = !userReaction.disliked;
        }
        
        newPost.userReaction = userReaction;
        return newPost;
      });

      const url = reactionType === "like"
        ? `${import.meta.env.VITE_BASE_URL}/post/${postId}/like`
        : `${import.meta.env.VITE_BASE_URL}/post/${postId}/dislike`;

      const response = await axios.patch(url, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const { post: updatedPost, walletAmount, totalLikes, totalDislikes, postCount } = response.data;
      
      dispatch(updatePostReaction({
        postId,
        updatedPost: {
          ...updatedPost,
          userId: posts.find(p => p._id === postId)?.userId || post.userId,
        }
      }));
      
      dispatch(updateMetrics({ walletAmount, totalLikes, totalDislikes, postCount }));
      
    } catch (error) {
      console.error("Error updating reactions:", error);
      toast.error("Failed to update reaction");
      // Revert optimistic update on error
      setPost(prevPost => {
        if (!prevPost) return prevPost;
        return { ...prevPost };
      });
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
      }).catch((error) => {
        copyToClipboard(shareUrl);
      });
    } else {
      copyToClipboard(shareUrl);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-gray-700">Post not available</p>
        <button 
          onClick={() => navigate("/posts")} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Posts
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-10">
      {/* Post Content */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        {/* User Info */}
        <div className="flex items-center space-x-4 mb-4 mt-4">
          {post.userId && post.userId._id ? (
            <>
              {post.userId.profilePic ? (
                <img
                  src={post.userId.profilePic} 
                  alt={`${post.userId.username}'s Profile`}
                  className="h-10 w-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                    e.target.parentNode.innerHTML = `
                      <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        ${post.userId.username?.charAt(0).toUpperCase() || 'U'}
                      </div>`;
                  }}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {post.userId.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <Link 
                  to={`/profile/${post.userId._id}`} 
                  className="text-sm font-semibold hover:text-blue-600"
                >
                  {post.userId.username || "Unknown User"}
                </Link>
                <p className="text-xs text-gray-500">
                  {post.createdAt ? formatDate(post.createdAt) : "Loading..."}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                ?
              </div>
              <span className="text-sm text-gray-500">Loading user...</span>
            </div>
          )}
        </div>

        {/* Post Content */}
        <p className="text-gray-800 mb-4 break-words whitespace-pre-line">{post.content}</p>
        
        {/* Media */}
        {post.postType === "Photo" && (
          <img 
            src={post.mediaUrl} 
            alt="Post" 
            className="w-full rounded mb-4 max-h-96 object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '';
              e.target.className = "hidden";
            }}
          />
        )}
        
        {post.postType === "VoiceNote" && (
          <audio 
            controls 
            src={post.mediaUrl} 
            className="w-full mb-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '';
              toast.error("Failed to load audio");
            }}
          />
        )}

        {/* Stats */}
        <div className="flex gap-3 justify-between items-center text-sm text-gray-500 mb-4">
          <div className="flex gap-2">
            <p className={`hover:text-green-500 ${post.userReaction?.liked ? 'text-green-500 font-semibold' : ''}`}>
              {post.likes || 0} Likes
            </p>
            <p className={`hover:text-red-500 ${post.userReaction?.disliked ? 'text-red-500 font-semibold' : ''}`}>
              {post.dislikes || 0} Dislikes
            </p>
          </div>

          <div className="px-1">
            <p 
              onClick={() => setCommentsVisible((prev) => !prev)} 
              className="hover:text-blue-500 cursor-pointer"
            >
              {post.comments?.length || 0} Comments
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 text-md text-gray-700 mb-4 flex-wrap">
          <button
            onClick={() => handleReaction(post._id, "like")}
            className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${post.userReaction?.liked ? 'text-blue-500' : 'hover:text-blue-500'}`}
          >
            <span>👍</span> Like
          </button>
          <button
            onClick={() => handleReaction(post._id, "dislike")}
            className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 ${post.userReaction?.disliked ? 'text-red-500' : 'hover:text-red-500'}`}
          >
            <span>👎</span> Dislike
          </button>
          <button
            onClick={() => handleShare(post)}
            className="flex items-center gap-1 hover:text-green-500 text-md px-2 py-1 rounded hover:bg-gray-100"
          >
            <span>📤</span> Share
          </button>
        </div>

        {/* Add Comment Section */}
        <div className="flex items-center gap-3 mb-4">
          <textarea
            className="flex-1 border border-gray-300 rounded-md p-2 resize-none text-sm h-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddComment(post._id);
              }
            }}
          />
          <button
            onClick={() => {
              handleAddComment(post._id);
              setNewComment("");
            }}
            disabled={!newComment.trim()}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 h-10 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>

        {/* Comment Section */}
        {commentsVisible && (
          <div className="mt-4">
            {post.comments?.length ? (
              <>
                {post.comments
                  .slice()
                  .reverse()
                  .slice(0, displayCount)
                  .map((commentObj, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 flex gap-3 border border-gray-200 rounded-md p-3 mb-2 items-start"
                    >
                      {commentObj.userId?.profilePic ? (
                        <img
                          src={commentObj.userId.profilePic}
                          alt="User"
                          className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentNode.innerHTML = `
                              <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                ${commentObj.userId?.username?.charAt(0).toUpperCase() || 'A'}
                              </div>`;
                          }}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {commentObj.userId?.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {commentObj.userId?.username || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-700 break-words whitespace-pre-line">
                          {commentObj.comment}
                        </p>
                      </div>
                    </div>
                  ))}

                {/* Load More Button */}
                {displayCount < (post.comments?.length || 0) && (
                  <button
                    className="text-blue-500 mt-2 hover:text-blue-700 border border-blue-300 hover:border-blue-400 px-3 py-1 rounded-md text-sm"
                    onClick={() => setDisplayCount((prev) => prev + 5)}
                  >
                    Load More Comments
                  </button>
                )}

                {/* Close Comments Section */}
                {displayCount >= (post.comments?.length || 0) && (
                  <button
                    className="text-gray-500 mt-2 hover:text-gray-700 border border-gray-300 hover:border-gray-400 px-3 py-1 rounded-md text-sm"
                    onClick={() => setCommentsVisible(false)}
                  >
                    Close Comments
                  </button>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center py-4">No comments yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharePostDisplayPage;