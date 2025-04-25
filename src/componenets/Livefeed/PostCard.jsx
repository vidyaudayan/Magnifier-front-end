{/*import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Brain,
  MoreHorizontal,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

const PostCard = ({ post }) => {
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50">
  
      <div className="flex items-start justify-between p-5 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center space-x-3.5">
          <img 
            src={post.author.avatar} 
            alt={post.author.name}
            className="w-11 h-11 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-medium text-gray-900 dark:text-white">
                {post.author.name}
              </span>
              {post.author.verified && (
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-[13px] text-gray-500 dark:text-gray-400">
              <span>@{post.author.handle}</span>
              <span>•</span>
              <span>{post.timestamp}</span>
              {post.source && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>{post.source.name}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 -mt-1">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

 
      <div className="p-5">
        <p className="text-gray-900 dark:text-white text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>
        
     
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mt-4 ${
            post.images.length === 1 ? 'grid-cols-1' :
            post.images.length === 2 ? 'grid-cols-2' :
            'grid-cols-2'
          }`}>
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="rounded-xl w-full h-48 object-cover"
              />
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {post.hashtags.map((tag) => (
            <span
              key={tag}
              className="text-blue-600 dark:text-blue-400 text-[13px] hover:underline cursor-pointer font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

      
        {post.aiLabels && post.aiLabels.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.aiLabels.map((label) => (
              <span
                key={label}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      
      <div className="px-5">
        <button
          onClick={() => setShowAiSummary(!showAiSummary)}
          className="flex items-center space-x-2 text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Brain className="w-4 h-4" />
          <span>Analyze with ElectoAI</span>
        </button>
        
        {showAiSummary && (
          <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="text-[13px] text-gray-600 dark:text-gray-300">
              AI analysis coming soon...
            </p>
          </div>
        )}
      </div>

  
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 dark:border-gray-700/50 mt-4">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
            <ThumbsUp className="w-[18px] h-[18px]" />
            <span className="text-[13px] font-medium">{post.engagement.likes}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
            <ThumbsDown className="w-[18px] h-[18px]" />
            <span className="text-[13px] font-medium">{post.engagement.dislikes}</span>
          </button>
          <button 
            onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <MessageCircle className="w-[18px] h-[18px]" />
            <span className="text-[13px] font-medium">{post.engagement.comments}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Share2 className="w-[18px] h-[18px]" />
            <span className="text-[13px] font-medium">{post.engagement.shares}</span>
          </button>
        </div>
        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Bookmark className="w-[18px] h-[18px]" />
        </button>
      </div>

      {isCommentsExpanded && post.topComments && (
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700/50">
          {post.topComments.map((comment, index) => (
            <div 
              key={index}
              className="mb-4 last:mb-0"
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900 dark:text-white text-[14px]">
                  {comment.author}
                </span>
                <span className="text-[13px] text-gray-500 dark:text-gray-400">
                  • {comment.likes} likes
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-[14px] leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;*/}


import React, { useState, useRef } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Share2, 
  Bookmark,
  MoreHorizontal,
  CheckCircle2,
  ExternalLink,
  Mic,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateMetrics, updatePostReaction, setPosts,updatePostComments } from '../../features/user/userSlice';

const PostCard = ({ 
  post, 
  user,
  highlightPostId,
  selectedUser,
  expandedPosts,
  handleViewMore
}) => {
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState("");
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [displayCount, setDisplayCount] = useState(6);
  const [loading, setLoading] = useState(false);
  const postRef = useRef(null);
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
    handleViewMore: () => {}
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

  {/*const handleReaction = async (postId, reactionType) => {
    try {
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
          userId: post.userId
        }
      }));

      dispatch(updateMetrics({ walletAmount, totalLikes, totalDislikes, postCount }));
    } catch (error) {
      if (error.response) {
        // Handle 400 errors (like/dislike own post)
        if (error.response.status === 400) {
          toast.error(error.response.data.message || 
            `You cannot ${reactionType} your own post`);
        } 
        // Handle other errors
        else {
          toast.error(`Failed to ${reactionType} post`);
          console.error("Error updating reactions:", error);
        }
      } else {
        console.error("Network error:", error);
        toast.error("Network error - please try again");
      }
    }
  };*/}

  const handleReaction = async (postId, reactionType) => {
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/post/${postId}/${reactionType}`;
      
      const response = await axios.patch(url, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
  
      // Handle successful response
      const { post: updatedPost, walletAmount, totalLikes, totalDislikes, postCount } = response.data;
      
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
              <span className="font-medium text-gray-900 dark:text-white">
                {post?.userId?.username || "Unknown User"}
              </span>
              {post.userId?.verified && (
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-[13px] text-gray-500 dark:text-gray-400">
              <span>{post.createdAt ? formatDate(post.createdAt) : "Loading..."}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 -mt-1">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="p-5">
        <p className="text-gray-900 dark:text-white text-[15px] leading-relaxed whitespace-pre-wrap">
          {post.content && post.content.split(" ").length > 8 && !expandedPosts[post._id] ? (
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

      {/* Add Comment Section */}
      {commentsVisible && (
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
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

          {/* Comments Section */}
          {post.comments?.length > 0 && (
            <div className="mt-4 space-y-3">
              {post.comments
                .slice()
                .reverse()
                .slice(0, displayCount)
                .map((comment, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl flex items-start space-x-3"
                  >
                    {comment.userId?.profilePic ? (
                      <img
                        src={comment.userId.profilePic}
                        alt="User"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {comment.userId?.username?.charAt(0).toUpperCase() || 'A'}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.userId?.username || 'Anonymous'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
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
                ) : (
                  <button
                    onClick={() => setCommentsVisible(false)}
                    className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Close Comments
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;