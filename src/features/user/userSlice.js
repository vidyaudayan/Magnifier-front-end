

import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    profilePicture: null, // Current profile picture
    previousProfilePicture: null, // Previous profile picture
    walletAmount: 0, // User's wallet balance
    totalLikes: 0, // Total likes received
    totalDislikes: 0, // User's reactions to posts
    postCount: 0, 
    posts: [], // Add posts to track updates here

  },
  reducers: {
    setUserDetails: (state, action) => {
      state.user = action.payload;
      console.log('User details', action.payload);
    },
    setProfilePicture: (state, action) => {
      state.previousProfilePicture = state.profilePicture; // Set the previous profile picture
      state.profilePicture = action.payload; // Update the current profile picture
      console.log('Profile picture updated', action.payload);
    },
    updateMetrics: (state, action) => {
      const { walletAmount,totalLikes, totalDislikes, postCount } = action.payload;
      state.walletAmount = walletAmount;
      state.totalLikes = totalLikes;
      state.totalDislikes = totalDislikes;
      state.postCount = postCount;
      console.log('Metrics updated:', action.payload);
    },
    updatePostReaction: (state, action) => {
      const { postId, updatedPost } = action.payload;
      state.posts = state.posts.map((post) =>
        post._id === postId ? { ...post, ...updatedPost } : post
      );
      console.log('Post reaction updated:', action.payload);
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
      console.log('Posts fetched:', action.payload);
    },
    clearUserDetails: (state) => {
      state.user = null;
      state.profilePicture = null;
      state.previousProfilePicture = null;
      state.walletAmount = 0;
      state.totalLikes = 0;
      state.totalDislikes = 0;
      state.postCount = 0;
      state.posts = []; // Clear posts as well
      console.log('User logged out');
    },
  },
});

export const { setUserDetails, clearUserDetails, setProfilePicture,updateMetrics, updatePostReaction } = userSlice.actions;

export default userSlice.reducer;