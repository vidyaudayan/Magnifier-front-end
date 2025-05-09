

import { createSlice } from '@reduxjs/toolkit';
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    walletAmount: 0,
    totalLikes: 0,
    totalDislikes: 0,
    postCount: 0,
    posts: [],
  },
  reducers: {
    setUserDetails: (state, action) => {
      const user = action.payload || {};
      if (!user || (!user.id && !user._id)) return;
      
      // Merge all user properties while standardizing on 'profilePic'
      state.user = {
        ...state.user, // Keep existing state
        ...user,      // Add/update with new data
        _id: user.id || user._id,
        username: user.username || user.userName || '',
        profilePic: user.profilePic || user.profilePicture || '',
        walletAmount: user.walletAmount || 0
      };
      
      localStorage.setItem('user', JSON.stringify(state.user));
      state.loading = false;
      console.log('User details updated:', state.user);
    },
    
    // Standardize on profilePic instead of profilePicture
    setProfilePicture: (state, action) => {
      if (state.user) {
        state.user.profilePic = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
        console.log('Profile picture updated:', action.payload);
      }
    },
    
    setCoverPicture: (state, action) => {
      if (state.user) {
        state.user.coverPic = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
        console.log('Cover picture updated:', action.payload);
      }
    },
    
    updateMetrics: (state, action) => {
      const { userName, profilePic, walletAmount, totalLikes, totalDislikes, postCount } = action.payload;
      if (state.user) {
        state.user = { 
          ...state.user, 
          userName, 
          profilePic: profilePic || state.user.profilePic 
        };
      }
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

 

 
updatePostComments: (state, action) => {
  const { postId, comments } = action.payload;
  state.posts = state.posts.map(post => 
    post._id === postId 
      ? { 
          ...post, 
          comments: Array.isArray(comments) 
            ? comments 
            : [] 
        } 
      : post
  );
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
    const posts = Array.isArray(action.payload) ? action.payload : [];

    const visiblePosts = posts.filter(post => {
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

  setPosts: (state, action) => {
  const now = new Date();
  const posts = Array.isArray(action.payload) ? action.payload : [];

  const visiblePosts = posts.filter(post => {
    // Use optional chaining to avoid undefined errors
    const start = post?.stickyStartUTC ? new Date(post.stickyStartUTC) : null;
    const end = post?.stickyEndUTC ? new Date(post.stickyEndUTC) : null;

    if (post?.status !== 'approved') return false;

    // Non-sticky published posts show immediately
    if (post?.postStatus === 'published') {
      if (!post?.sticky) return true;

      // Sticky published posts should only show within their sticky window
      return start && end && now >= start && now < end;
    }

    // Scheduled posts show only during their sticky window
    if (post?.postStatus === 'scheduled') {
      return start && end && now >= start && now < end;
    }

    return false;
  });

  // Sticky posts that are in their sticky time window (to be pinned at top)
  const stickyPosts = visiblePosts.filter(post => {
    if (!post?.sticky) return false;

    const start = post?.stickyStartUTC ? new Date(post.stickyStartUTC) : null;
    const end = post?.stickyEndUTC ? new Date(post.stickyEndUTC) : null;

    return start && end && now >= start && now < end;
  });

  // Normal posts are either non-sticky or sticky but not currently in their slot
  const normalPosts = visiblePosts.filter(post => {
    const start = post?.stickyStartUTC ? new Date(post.stickyStartUTC) : null;
    const end = post?.stickyEndUTC ? new Date(post.stickyEndUTC) : null;

    const isInStickyWindow = start && end && now >= start && now < end;

    return !post?.sticky || !isInStickyWindow;
  });

  // Optional: sort sticky posts by start time
  stickyPosts.sort((a, b) => new Date(a.stickyStartUTC) - new Date(b.stickyStartUTC));

  // Final post list: sticky posts first, then the rest
  state.posts = [...stickyPosts, ...normalPosts];
},

setLoading: (state, action) => {
  state.loading = action.payload;
},

    clearUserDetails: (state) => {
      state.user = null;
      state.loading = false;
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

export const {setPosts ,setUserDetails, clearUserDetails, setProfilePicture,updateMetrics, updatePostReaction,setCoverPicture,updatePostComments ,setLoading} = userSlice.actions;

export default userSlice.reducer;




