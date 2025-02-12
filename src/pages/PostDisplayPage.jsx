import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PostDisplayPage = () => {
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const postId = queryParams.get("postId")|| sessionStorage.getItem("postId");
    console.log("Extracted postId:", postId); // Debugging step
    if (!postId) {
      postId = sessionStorage.getItem("postId"); // Retrieve from storage if missing
    } else {
      sessionStorage.setItem("postId", postId); // Store for later use
    }
   
    if (postId) {
      fetchPostById(postId);
    }
  }, [location.search]);

  const fetchPostById = async (postId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/post/${postId}`
      );
      console.log("postbyId",response.data)
      setPost(response.data.data);
    } catch (error) {
      console.error("Error fetching post:", error);
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
      [type === "like" ? "likes" : "dislikes"]: (post[type] || 0) + 1,
    };
    setPost(updatedPost);
  };

  if (!post) {
    return <p className="text-center mt-10">Loading post...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Post Content */}
      <div className="mb-4">
        <p className="text-sm text-gray-800 mb-2">
          {post.content || "No content available"}
        </p>
        {post.postType === "Photo" && (
          <img src={post.mediaUrl} alt="Post Media" className="w-full rounded-md mt-3" />
        )}
        {post.postType === "VoiceNote" && (
          <audio controls src={post.mediaUrl} className="w-full mt-3" />
        )}
      </div>

      {/* Like, Dislike, Comments */}
      <div className="flex gap-4 text-md text-gray-700 mb-4">
        <button onClick={() => handleReaction("like")} className="hover:text-blue-500">
          👍 Like
        </button>
        <button onClick={() => handleReaction("dislike")} className="hover:text-red-500">
          👎 Dislike
        </button>
      </div>

      {/* Comment Section */}
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
    </div>
  );
};

export default PostDisplayPage;
