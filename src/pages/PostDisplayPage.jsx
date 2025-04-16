{/*import { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import axios from "axios";

const PostDisplayPage = () => {
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);

  
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const postId = queryParams.get("postId") || localStorage.getItem("sharedPostId");

    // If we have a postId, fetch and display that specific post
    if (postId) {
      fetchSinglePost(postId);
      // Clear the stored postId after use
      localStorage.removeItem("sharedPostId");
    } else {
      // Default behavior - show all posts (your existing implementation)
      fetchAllPosts();
    }
  }, [location.search]);

  const fetchPostById = async (postId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/post/${postId}`
      );
      setPost(response.data.data);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Post not found or no longer available");
      navigate("/posts"); // Redirect if post doesn't exist
    }
  };




  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    const updatedComments = [
      ...(post.comments || []),
      {
        userId: { username: "CurrentUser", profilePic: "" },
        comment: newComment,
      },
    ];
    setPost({ ...post, comments: updatedComments });
    setNewComment("");
  };

  const handleReaction = (type) => {
    const updatedPost = {
      ...post,
      likes: type === "like" ? (post.likes || 0) + 1 : post.likes,
   dislikes: type === "dislike" ? (post.dislikes || 0) + 1 : post.dislikes,
    };
    setPost(updatedPost);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/displaypost?postId=${post._id}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Check out this post on Magnifier!",
        text: post.content?.substring(0, 100) || "Interesting post",
        url: shareUrl,
      }).catch(() => copyToClipboard(shareUrl));
    } else {
      copyToClipboard(shareUrl);
    }
  };


  if (!post) {
    return <p className="text-center mt-10">Loading post...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
    
      <div className="mb-4">
        <p className="text-sm text-gray-800 mb-2">
          {post.content || "No content available"}
        </p>
        {post.postType === "Photo" && (
          <img src={post.mediaUrl} alt="Post Media" className="w-48  object-cover rounded-md mt-3" />
        )}
        {post.postType === "VoiceNote" && (
          <audio controls src={post.mediaUrl} className="w-full mt-3" />
        )}
      </div>


      <div className="flex gap-4 text-md text-gray-700 mb-4">
        <button onClick={() => handleReaction("like")} className="hover:text-blue-500">
          👍 Like
        </button>
        <button onClick={() => handleReaction("dislike")} className="hover:text-red-500">
          👎 Dislike
        </button>
      </div>

 
      <div className="flex items-center space-x-3 mb-4">
        <textarea
          className="flex-1 border border-gray-300 rounded-md p-2 resize-none text-sm"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <div className="flex gap-4 text-md text-gray-700 mb-4">
        <button onClick={() => handleReaction("like")} className="hover:text-blue-500">
          👍 Like
        </button>
        <button onClick={() => handleReaction("dislike")} className="hover:text-red-500">
          👎 Dislike
        </button>
        <button onClick={handleShare} className="hover:text-green-500">
          🔗 Share
        </button>
      </div>
    </div>
  );
};

export default PostDisplayPage;*/}

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PostDisplayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        let postId = queryParams.get("postId") || 
                    localStorage.getItem("sharedPostId") || 
                    sessionStorage.getItem("sharedPostId");

        // Clear storage after getting the ID
        localStorage.removeItem("sharedPostId");
        sessionStorage.removeItem("sharedPostId");

        if (!postId) {
          // No post ID - redirect to all posts view
          navigate("/posts");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/post/${postId}`
        );
        
        if (response.data.success) {
          setPost(response.data.data);
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("The shared post could not be loaded");
        navigate("/posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [location.search, navigate]);

  if (loading) {
    return <div className="text-center p-8">Loading post...</div>;
  }

  if (!post) {
    return <div className="text-center p-8">Post not available</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Post Content */}
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <p className="text-gray-800 mb-4">{post.content}</p>
        
        {post.postType === "Photo" && (
          <img src={post.mediaUrl} alt="Post" className="max-w-full rounded mb-4" />
        )}
        
        {post.postType === "VoiceNote" && (
          <audio controls src={post.mediaUrl} className="w-full mb-4" />
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button className="text-blue-500">Like</button>
          <button className="text-red-500">Dislike</button>
          <button className="text-green-500">Share</button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-medium mb-3">Comments</h3>
        <textarea
          className="w-full border rounded p-2 mb-2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded">
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default PostDisplayPage;