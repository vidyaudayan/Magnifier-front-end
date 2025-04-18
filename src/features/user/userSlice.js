

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
    setPostss: (state, action) => {

      const now = new Date();

  // Filter sticky posts correctly
  const stickyPosts = action.payload.filter(post => 
    post.status === 'approved' &&
      post.sticky && 
      post.stickyUntil && 
      post.stickyStartUTC && 
      new Date(post.stickyStartUTC) <= now &&
      new Date(post.stickyUntil) >= now,


      {/*new Date(post.stickyUntil) > now &&
     now >= new Date(post.stickyStartUTC)*/}
  );

  // Filter normal posts (including expired sticky posts)
  const normalPosts = action.payload.filter(post =>  post.status === 'approved' && 
      !post.sticky || !post.stickyUntil || new Date(post.stickyUntil) <= now ||
      (post.stickyStartUTC && now < new Date(post.stickyStartUTC))
  );

  // Sort sticky posts by `createdAt` (newer sticky posts first)
  //stickyPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  stickyPosts.sort((a, b) => (
    new Date(a.stickyStartUTC) - new Date(b.stickyStartUTC)
  ));
  // Merge sticky posts first, followed by normal posts
  state.posts = [...stickyPosts, ...normalPosts];

  console.log("Sticky Posts:", stickyPosts);
  console.log("All Posts (Sticky First):", state.posts);;
  },

 
  setPosts: (state, action) => {
    const now = new Date();
  
    // Filter sticky posts correctly - must meet ALL conditions
    const stickyPosts = action.payload.filter(post => 
      post.status === 'approved' &&
      post.sticky && 
      post.stickyUntil && 
      post.stickyStartUTC &&
      new Date(post.stickyStartUTC) <= now &&  // Current time is after start time
      new Date(post.stickyUntil) > now        // Current time is before end time
    );
  
    // Filter normal posts (non-sticky or not currently in pinned window)
    const normalPosts = action.payload.filter(post => 
      post.status === 'approved' && (
        !post.sticky || 
        !post.stickyUntil || 
        !post.stickyStartUTC ||
        new Date(post.stickyUntil) <= now ||      // Pinning period ended
        new Date(post.stickyStartUTC) > now       // Pinning hasn't started
      )
    );
  
    // Sort sticky posts by pinning start time (earlier pinned posts first)
    stickyPosts.sort((a, b) => new Date(a.stickyStartUTC) - new Date(b.stickyStartUTC));
  
    // For debugging
    console.log("Current time:", now);
    console.log("Sticky Posts:", stickyPosts.map(p => ({
      id: p._id,
      content: p.content,
      stickyWindow: `${new Date(p.stickyStartUTC)} - ${new Date(p.stickyUntil)}`,
      isActive: new Date(p.stickyStartUTC) <= now && new Date(p.stickyUntil) > now
    })));
  
    state.posts = [...stickyPosts, ...normalPosts];
  },

  setPostssss: (state, action) => {
    const now = new Date();
    
    // Filter posts that should be visible now
    const visiblePosts = action.payload.filter(post => {
      // Post must be approved
      if (post.status !== 'approved') return false;
      
      // If post is scheduled for future, don't show yet
      if (post.postStatus === 'scheduled' && post.stickyStartUTC && new Date(post.stickyStartUTC) > now) {
        return false;
      }
      
      // If post has a sticky period, only show during that window
      if (post.stickyStartUTC && post.stickyUntil) {
        const isInStickyWindow = new Date(post.stickyStartUTC) <= now && new Date(post.stickyUntil) > now;
        return isInStickyWindow || post.postStatus === 'published';
      }
      
      // Regular published posts
      return post.postStatus === 'published';
    });
  
    // Separate sticky and normal posts
    const stickyPosts = visiblePosts.filter(post => 
      post.sticky && 
      post.stickyStartUTC && 
      post.stickyUntil &&
      new Date(post.stickyStartUTC) <= now &&
      new Date(post.stickyUntil) > now
    );
  
    const normalPosts = visiblePosts.filter(post => !stickyPosts.includes(post));
  
    // Sort sticky posts by pinning start time
    stickyPosts.sort((a, b) => new Date(a.stickyStartUTC) - new Date(b.stickyStartUTC));
    
    state.posts = [...stickyPosts, ...normalPosts];
  },



  setPosts: (state, action) => {
    const now = new Date();
    
    // Filter posts that should be visible now
    const visiblePosts = action.payload.filter(post => {
      // Post must be approved
      if (post.status !== 'approved') return false;
      
      // If post is scheduled, only show if current time is within window
      if (post.postStatus === 'scheduled') {
        return post.stickyStartUTC && post.stickyUntil && 
               new Date(post.stickyStartUTC) <= now && 
               new Date(post.stickyUntil) > now;
      }
      
      // Published posts without scheduling
      if (post.postStatus === 'published') {
        // If it has sticky timing, only show during that window
        if (post.stickyStartUTC && post.stickyUntil) {
          return new Date(post.stickyStartUTC) <= now && 
                 new Date(post.stickyUntil) > now;
        }
        return true;
      }
      
      return false;
    });
  
    // Separate sticky and normal posts
    const stickyPosts = visiblePosts.filter(post => 
      post.sticky && 
      post.stickyStartUTC && 
      post.stickyUntil &&
      new Date(post.stickyStartUTC) <= now &&
      new Date(post.stickyUntil) > now
    );
  
    const normalPosts = visiblePosts.filter(post => !stickyPosts.includes(post));
  
    // Sort sticky posts by pinning start time
    stickyPosts.sort((a, b) => new Date(a.stickyStartUTC) - new Date(b.stickyStartUTC));
    
    // Debug logging
    console.log("Current posts:", {
      time: now,
      stickyPosts: stickyPosts.map(p => ({
        id: p._id,
        stickyWindow: `${new Date(p.stickyStartUTC)} - ${new Date(p.stickyUntil)}`,
        content: p.content
      })),
      normalPosts: normalPosts.length
    });
    
    state.posts = [...stickyPosts, ...normalPosts];
  },

  setPosts1: (state, action) => {
    const now = new Date();
  
    const visiblePosts = action.payload.filter(post => {
      const start = post.stickyStartUTC ? new Date(post.stickyStartUTC) : null;
      const end = post.stickyUntil ? new Date(post.stickyUntil) : null;
  
      // Only approved posts are shown
      if (post.postStatus !== 'approved' && post.postStatus !== 'scheduled' && post.postStatus !== 'published') return false;
  
      // Scheduled post: show only if now is within the sticky window
      if (post.postStatus === 'scheduled') {
        return start && end && now >= start && now < end;
      }
  
      // Published post: always show unless it's outside sticky window
      if (post.postStatus === 'published') {
        if (start && end) {
          return now >= start && now < end;
        }
        return true; // No sticky window, always show
      }
  
      return false;
    });
  
    const stickyPosts = visiblePosts.filter(post => post.sticky);
    const normalPosts = visiblePosts.filter(post => !post.sticky);
  
    stickyPosts.sort((a, b) => new Date(a.stickyStartUTC) - new Date(b.stickyStartUTC));
  
    console.log("Current posts:", {
      time: now,
      stickyPosts: stickyPosts.map(p => ({
        id: p._id,
        stickyWindow: `${new Date(p.stickyStartUTC)} - ${new Date(p.stickyUntil)}`,
        content: p.content
      })),
      normalPosts: normalPosts.length
    });
  
    state.posts = [...stickyPosts, ...normalPosts];
  },
  
  setPosts2: (state, action) => {
    const now = new Date();
  
    const visiblePosts = action.payload.filter(post => {
      const start = post.stickyStartUTC ? new Date(post.stickyStartUTC) : null;
      const end = post.stickyUntil ? new Date(post.stickyUntil) : null;
  
      // Must be approved
      if (post.status !== 'approved') return false;
  
      // If there's a sticky time window, enforce it
      const isInStickyWindow = start && end && now >= start && now < end;
  
      if (post.postStatus === 'scheduled') {
        return isInStickyWindow;
      }
  
      if (post.postStatus === 'published') {
        // If sticky is true and sticky window exists, enforce time restriction
        if (post.sticky && start && end) {
          return isInStickyWindow;
        }
        // Otherwise show it
        return true;
      }
  
      return false;
    });
  
    // Separate sticky and normal posts
    const stickyPosts = visiblePosts.filter(post => post.sticky);
    const normalPosts = visiblePosts.filter(post => !post.sticky);
  
    // Sort sticky posts by start time
    stickyPosts.sort((a, b) => new Date(a.stickyStartUTC) - new Date(b.stickyStartUTC));
  
    console.log("Current posts:", {
      time: now.toISOString(),
      stickyPosts: stickyPosts.map(p => ({
        id: p._id,
        stickyWindow: `${new Date(p.stickyStartUTC).toISOString()} - ${new Date(p.stickyUntil).toISOString()}`,
        content: p.content
      })),
      normalPosts: normalPosts.length
    });
  
    state.posts = [...stickyPosts, ...normalPosts];
  },
  
  setPostssuccess: (state, action) => {
    const now = new Date();
  
    const visiblePosts = action.payload.filter(post => {
      const start = post.stickyStartUTC ? new Date(post.stickyStartUTC) : null;
      const end = post.stickyEndUTC ? new Date(post.stickyEndUTC) : null;
  
      if (post.status !== 'approved') return false;
  
      const isInStickyWindow = start && end && now >= start && now < end;
  
      if (post.postStatus === 'scheduled') {
        return isInStickyWindow;
      }
  
      if (post.postStatus === 'published') {
        if (post.sticky && isInStickyWindow) {
          return true;
        }
        if (post.sticky && !isInStickyWindow) {
          return false;
        }
        return true;
      }
  
      return false;
    });
  
    const stickyPosts = visiblePosts.filter(post => post.sticky);
    const normalPosts = visiblePosts.filter(post => !post.sticky);
  
    stickyPosts.sort((a, b) => new Date(a.stickyStartUTC) - new Date(b.stickyStartUTC));
  
    state.posts = [...stickyPosts, ...normalPosts];
  },
  
  setPosts: (state, action) => { 
    const now = new Date();
  
    const visiblePosts = action.payload.filter(post => {
      const start = post.stickyStartUTC ? new Date(post.stickyStartUTC) : null;
      const end = post.stickyEndUTC ? new Date(post.stickyEndUTC) : null;
  
      if (post.status !== 'approved') return false;
  
      // Non-sticky published posts show immediately
      if (post.postStatus === 'published') {
        if (!post.sticky) return true;
  
        // Sticky published posts should only show within their sticky window
        return start && end && now >= start && now < end;
      }
  
      // Scheduled posts show only during their sticky window
      if (post.postStatus === 'scheduled') {
        return start && end && now >= start && now < end;
      }
  
      return false;
    });
  
    // Sticky posts that are in their sticky time window (to be pinned at top)
    const stickyPosts = visiblePosts.filter(post => {
      if (!post.sticky) return false;
  
      const start = post.stickyStartUTC ? new Date(post.stickyStartUTC) : null;
      const end = post.stickyEndUTC ? new Date(post.stickyEndUTC) : null;
  
      return start && end && now >= start && now < end;
    });
  
    // Normal posts are either non-sticky or sticky but not currently in their slot
    const normalPosts = visiblePosts.filter(post => {
      const start = post.stickyStartUTC ? new Date(post.stickyStartUTC) : null;
      const end = post.stickyEndUTC ? new Date(post.stickyEndUTC) : null;
  
      const isInStickyWindow = start && end && now >= start && now < end;
  
      return !post.sticky || !isInStickyWindow;
    });
  
    // Optional: sort sticky posts by start time
    stickyPosts.sort((a, b) => new Date(a.stickyStartUTC) - new Date(b.stickyStartUTC));
  
    // Final post list: sticky posts first, then the rest
    state.posts = [...stickyPosts, ...normalPosts];
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
