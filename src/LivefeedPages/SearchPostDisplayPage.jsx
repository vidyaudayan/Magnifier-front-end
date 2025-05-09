import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SearchPostDisplayPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [displayCount, setDisplayCount] = useState(5);
  const [commentsVisible, setCommentsVisible] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchPost = async () => {
      try {
        if (!postId) {
          navigate("/posts");
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
  }, [postId, navigate]);

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
  
        
      const handleShare = (post) => {
        const postId = post._id;
        // Always generate login link for sharing
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

  // ... [Keep all your existing handler functions (handleAddComment, handleReaction, handleShare) unchanged]

  if (loading) {
    return <div className="text-center p-8">Loading post...</div>;
  }

  if (!post) {
    return <div className="text-center p-8">Post not available</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
    
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
      <p className="text-gray-800 mb-4 break-words">{post.content}</p>
      
      {/* Media */}
      {post.postType === "Photo" && (
        <img 
          src={post.mediaUrl} 
          alt="Post" 
          className="w-full rounded mb-4 max-h-96 object-contain"
        />
      )}
      
      {post.postType === "VoiceNote" && (
        <audio 
          controls 
          src={post.mediaUrl} 
          className="w-full mb-4"
        />
      )}

      {/* Stats */}
      <div className="flex gap-3 justify-between items-center text-sm text-gray-500 mb-4">
        <div className="flex gap-2">
          <p className="hover:text-green-500">{post.likes || 0} Likes</p>
          <p className="hover:text-red-500">{post.dislikes || 0} Dislikes</p>
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
          className="hover:text-blue-500 px-2 py-1 rounded hover:bg-gray-100"
        >
          👍 Like
        </button>
        <button
          onClick={() => handleReaction(post._id, "dislike")}
          className="hover:text-red-500 px-2 py-1 rounded hover:bg-gray-100"
        >
          👎 Dislike
        </button>
        <button
          onClick={() => handleShare(post)}
          className="hover:text-green-500 text-md px-2 py-1 rounded hover:bg-gray-100"
        >
          📤 Share
        </button>
      </div>

      {/* Add Comment Section */}
      <div className="flex items-center gap-3 mb-4">
        <textarea
          className="flex-1 border border-gray-300 rounded-md p-2 resize-none text-sm h-10 "
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button
          onClick={() => {
            handleAddComment(post._id);
            setNewComment("");
          }}
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 h-10"
        >
          Add
        </button>
      </div>

      {/* Comment Section */}
      {commentsVisible && (
        <div className="mt-4">
          {post.comments
            ?.slice()
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
                  <p className="text-sm text-gray-700 break-words">
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
        </div>
      )}
    </div>
  </div>
  );
};

export default SearchPostDisplayPage;