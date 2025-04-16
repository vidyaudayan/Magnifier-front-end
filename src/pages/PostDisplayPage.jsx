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

const PostDisplayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [posts, setPosts] = useState([]); // For multiple posts
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("single"); // 'single' or 'all'

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const postId = queryParams.get("postId") || localStorage.getItem("sharedPostId");

    if (postId) {
      fetchPostById(postId);
      localStorage.removeItem("sharedPostId");
      setViewMode("single");
    } else {
      fetchAllPosts();
      setViewMode("all");
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
      // Fallback to showing all posts
      fetchAllPosts();
      setViewMode("all");
    }
  };

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/post` // Adjust to your API endpoint
      );
      setPosts(response.data.data); // Assuming your API returns { data: posts }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts");
    }
  };

  // ... keep your existing handleAddComment, handleReaction, handleShare functions ...
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

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Single Post View */}
      {viewMode === "single" && post && (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-800 mb-2">
              {post.content || "No content available"}
            </p>
            {post.postType === "Photo" && (
              <img src={post.mediaUrl} alt="Post Media" className="w-48 object-cover rounded-md mt-3" />
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
            <button onClick={handleShare} className="hover:text-green-500">
              🔗 Share
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
        </>
      )}

      {/* All Posts View */}
      {viewMode === "all" && (
        <div>
          {posts.length > 0 ? (
            posts.map((p) => (
              <div key={p._id} className="mb-6 border-b pb-4">
                <p className="text-sm text-gray-800 mb-2">{p.content}</p>
                {/* Render other post elements as needed */}
              </div>
            ))
          ) : (
            <p className="text-center">No posts available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostDisplayPage;
