import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { formatDate } from "../utils/dateUtils";
import { useSelector } from 'react-redux';
import { setUserDetails } from "../features/user/userSlice";
import NavbarLanding from "./NavbarLanding";
import { updateMetrics } from "../features/user/userSlice";
import { updatePostReaction } from "../features/user/userSlice";
import { useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
const SearchUserPost = () => {
    const dispatch = useDispatch();
    const { userId } = useParams();
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [commentsVisible, setCommentsVisible] = useState(false);
    //const user = useSelector(state => state?.user?.user)



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
    
                const response = await axios.patch(url, {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }, { withCredentials: true });
    
                const { post, walletAmount, totalLikes, totalDislikes, postCount } = response.data;
                // Dispatch to Redux store
    
                {/*setPosts(prevPosts =>
        prevPosts.map(p => p._id === postId ? { ...p, ...post } : p)
    );*/}
                dispatch(updatePostReaction({ postId, updatedPost: post }));
                dispatch(updateMetrics({ walletAmount, totalLikes, totalDislikes, postCount }));
    
    
                //setPosts(prevPosts =>prevPosts.map(p => (p._id === postId ? { ...p, ...post } : p)));
            } catch (error) {
                console.error("Error updating reactions:", error);
            }
        };
    


        const handleShare = (post) => {
            const postId = post._id; // Use the actual post's ID
            const isLoggedIn = !!localStorage.getItem("token"); // Check login status
            const shareUrl = isLoggedIn
                ? `${window.location.origin}/login?postId=${postId}`
                : `${window.location.origin}/signup?postId=${postId}`;
    
            navigator
                .share({
                    title: "Check out this post!",
                    text: "Here's a great post for you to read!",
                    url: shareUrl,
                })
                .then(() => console.log("Successfully shared!"))
                .catch((error) => console.error("Error sharing:", error));
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

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/posts/${userId}`);
                setPosts(response.data.data);
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching user posts:", error);
            }
        };
        fetchUserPosts();
    }, [userId]);

    return (
        <div className="lg:mt-44">
  <NavbarLanding />

  {/* Post Section */}
  {posts.length > 0 ? (
    posts.map((post) => (
      <div key={post._id} className="bg-white border border-gray-300 p-8 mt-24 lg:mt-20 lg:mx-20 mx-10 rounded-lg">
        {/* Header: User Image, Name, and Date */}
        <div className="flex items-center space-x-4 mb-4">
          {post.userId?.profilePic ? (
            <img
              src={post.userId.profilePic}
              alt={`${post.userId.username || 'User'}'s Profile`}
              className="h-10 w-10 rounded-full object-cover border-2 border-blue-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '';
                e.target.parentNode.innerHTML = `
                  <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    ${post?.userId?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>`;
              }}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {post?.userId?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{post?.userId?.username || 'Unknown User'}</p>
            <p className="text-xs text-gray-500">{post.createdAt ? formatDate(post.createdAt) : 'Loading...'}</p>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-sm text-gray-800">
            {post.content && post.content.split(' ').length > 8 ? (
              <>
                {post.content.split(' ').slice(0, 8).join(' ')}...{' '}
                <button
                  className="text-blue-500 hover:underline text-xs"
                  onClick={() => handleViewMore(post._id)}
                >
                  More
                </button>
              </>
            ) : (
              post.content || 'No content available'
            )}
          </p>
          {post.postType === 'Photo' && (
            <img src={post.mediaUrl} alt="Post Media" className="lg:w-1/2 rounded-md h-80 w-full object-cover mt-3 shadow-md" />
          )}
          {post.postType === 'VoiceNote' && (
            <audio controls src={post.mediaUrl} className="lg:w-1/2 mt-3 rounded-md" />
          )}
        </div>

        {/* Likes and Comments Count */}
        <div className="flex gap-3 justify-between items-center text-sm text-gray-500 mb-4">
          <div className="flex gap-2">
            <p className="hover:text-green-500">{post.likes || 0} Likes</p>
            <p className="hover:text-red-500">{post.dislikes || 0} Dislikes</p>
          </div>
          <div>
            <p onClick={() => setCommentsVisible((prev) => !prev)} className="hover:text-blue-500 cursor-pointer">
              {post.comments?.length || 0} Comments
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 text-md text-gray-700 mb-4">
          <button onClick={() => handleReaction(post._id, 'like')} className="hover:text-blue-500">
            👍 Like
          </button>
          <button onClick={() => handleReaction(post._id, 'dislike')} className="hover:text-red-500">
            👎 Dislike
          </button>
          <button onClick={() => handleShare(post)} className="hover:text-green-500 text-md">
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
          <button onClick={() => handleAddComment(post._id)} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
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
                <div key={index} className="bg-gray-100 flex gap-2 border border-gray-300 rounded-md p-3 mb-2">
                  {commentObj.userId?.profilePic ? (
                    <img src={commentObj.userId.profilePic} alt="User" className="h-5 w-5 rounded-full object-cover" />
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
                className="text-slate-500 mt-2 hover:text-slate-700 border hover:border-slate-400 p-1 rounded-md"
                onClick={() => setDisplayCount((prev) => prev + 6)}
              >
                Load More Comments
              </button>
            )}

            {/* Close Comments Section */}
            {displayCount >= post.comments.length && (
              <button
                className="text-slate-500 mt-2 hover:text-slate-700 border hover:border-slate-400 p-1 rounded-md"
                onClick={() => setCommentsVisible(false)}
              >
                Close Comments
              </button>
            )}
          </div>
        )}
      </div>
    ))
  ) : user ? (
    <p className="text-center text-gray-500 mt-10">No posts created by this user</p>
  ) : (
    <p className="text-center text-gray-500 mt-10">Loading user data...</p>
  )}
</div>

    );
};

export default SearchUserPost;
