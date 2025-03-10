

import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    profilePicture: null, // Current profile picture
    previousProfilePicture: null, // Previous profile picture
   previousCoverPicture:null,
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
    setCoverPicture: (state, action) => {
      state.previousCoverPicture = state.coverPicture;
      state.coverPicture = action.payload;
      console.log('Cover picture updated', action.payload);
    },
    updateMetrics: (state, action) => {
      const {userName, profilePicture, walletAmount,totalLikes, totalDislikes, postCount } = action.payload;
      state.user = { ...state.user, userName, profilePicture }; 
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
    /*setPosts: (state, action) => {
      //state.posts = action.payload;
      //console.log('Posts fetched:', action.payload);
      state.posts = [];
     
      const newPosts = action.payload;
       // Ensure we update the correct post while keeping the rest unchanged
    state.posts = state.posts.map((post) =>
      newPosts.find((updatedPost) => updatedPost._id === post._id)
          ? newPosts.find((updatedPost) => updatedPost._id === post._id)
          : post
  );


    // Remove duplicate posts by checking the post ID
    const existingPostIds = new Set(state.posts.map(post => post._id));

    // Filter out posts that already exist
    const uniquePosts = newPosts.filter(post => !existingPostIds.has(post._id));

    // Update state with unique posts
    state.posts = [...uniquePosts];
    console.log('Posts fetched:', state.posts);
    
    },*/
    setPosts: (state, action) => {
     
  
      {/*const newPosts = action.payload;
  
      // Separate sticky and non-sticky posts
      const stickyPosts = newPosts.filter(post => post.sticky && new Date(post.stickyUntil) > new Date());
      const normalPosts = newPosts.filter(post => !post.sticky || new Date(post.stickyUntil) <= new Date());
  
      // Sort sticky posts by `stickyUntil` (most recent ones first)
      stickyPosts.sort((a, b) => new Date(b.stickyUntil) - new Date(a.stickyUntil));*/}
  

      const now = new Date();

  // Filter sticky posts correctly
  const stickyPosts = action.payload.filter(post => 
      post.sticky && 
      post.stickyUntil && 
      new Date(post.stickyUntil) > now // Ensure it's still within the sticky time
  );

  // Filter normal posts (including expired sticky posts)
  const normalPosts = action.payload.filter(post => 
      !post.sticky || !post.stickyUntil || new Date(post.stickyUntil) <= now
  );

  // Sort sticky posts by `createdAt` (newer sticky posts first)
  stickyPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Merge sticky posts first, followed by normal posts
  state.posts = [...stickyPosts, ...normalPosts];

  console.log("Sticky Posts:", stickyPosts);
  console.log("All Posts (Sticky First):", state.posts);;
  },

 


    clearUserDetails: (state) => {
      state.user = null;
      state.profilePicture = null;
      state.coverPicture=null
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

export const {setPosts ,setUserDetails, clearUserDetails, setProfilePicture,updateMetrics, updatePostReaction,setCoverPicture } = userSlice.actions;

export default userSlice.reducer;



{/*import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMetrics = createAsyncThunk('user/fetchMetrics', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/usermatrics`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching metrics', error);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchPosts = createAsyncThunk('user/fetchPosts', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/post`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts', error);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    walletAmount: 0,
    totalLikes: 0,
    totalDislikes: 0,
    postCount: 0,
    posts: [],
    isLoadingMetrics: false,
    isLoadingPosts: false,
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.user = action.payload;
    },
   
    
    updatePostReaction: (state, action) => {
      const { postId, updatedPost } = action.payload;
      state.posts = state.posts.map((post) => (post._id === postId ? { ...post, ...updatedPost } : post));
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetrics.pending, (state) => {
        state.isLoadingMetrics = true;
      })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.isLoadingMetrics = false;
        const { walletAmount, totalLikes, totalDislikes, postCount } = action.payload;
        state.walletAmount = walletAmount;
        state.totalLikes = totalLikes;
        state.totalDislikes = totalDislikes;
        state.postCount = postCount;
      })
      .addCase(fetchMetrics.rejected, (state) => {
        state.isLoadingMetrics = false;
      })
      .addCase(fetchPosts.pending, (state) => {
        state.isLoadingPosts = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoadingPosts = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.isLoadingPosts = false;
      });
  },
});

export const { setUserDetails, updatePostReaction, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;*/}
