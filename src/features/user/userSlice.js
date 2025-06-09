import { createSlice } from '@reduxjs/toolkit';

const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));

const normalizedUser = userFromLocalStorage
  ? {
      ...userFromLocalStorage,
      _id: userFromLocalStorage.id || userFromLocalStorage._id || '',
      username: userFromLocalStorage.username || userFromLocalStorage.userName || '',
      profilePic: userFromLocalStorage.profilePic || userFromLocalStorage.profilePicture || '',
      walletAmount: userFromLocalStorage.walletAmount || 0,
      state: userFromLocalStorage.state || '',
    }
  : null;

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: normalizedUser,
    loading: false,
    walletAmount: normalizedUser?.walletAmount || 0,
    totalLikes: 0,
    totalDislikes: 0,
    postCount: 0,
    posts: [],
    availableStates: [],
    rechargedPoints: 0,
    earnedPoints: 0
  },
  reducers: {
    setUserDetails: (state, action) => {
      const user = action.payload || {};
      if (!user || (!user.id && !user._id)) return;

      state.user = {
        ...state.user,
        ...user,
        _id: user.id || user._id,
        username: user.username || user.userName || '',
        profilePic: user.profilePic || user.profilePicture || '',
        state: user.state || '',
        rechargedPoints: user.rechargedPoints || 0,
        warnedPoints: user.warnedPoints || 0,
      };

      localStorage.setItem('user', JSON.stringify(state.user));
      state.loading = false;
      console.log('User details updated:', state.user);
    },

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

    setPoints: (state, action) => {
      const { rechargedPoints, earnedPoints } = action.payload;

      state.rechargedPoints = rechargedPoints || 0;
      state.earnedPoints = earnedPoints || 0;

      if (state.user) {
        state.user.rechargedPoints = rechargedPoints || 0;
        state.user.earnedPoints = earnedPoints || 0;
        localStorage.setItem('user', JSON.stringify(state.user));
      }

      console.log("Recharged:", rechargedPoints, "Earned:", earnedPoints);
    },

    updateWalletData: (state, action) => {
      const { walletAmount } = action.payload;
      state.walletAmount = walletAmount;

      if (state.user) {
        state.user.walletAmount = walletAmount;
        localStorage.setItem('user', JSON.stringify(state.user));
      }

      console.log("Wallet updated:", walletAmount);
    },

    updateMetrics: (state, action) => {
      const { userName, profilePic, walletAmount, totalLikes, totalDislikes, postCount } = action.payload;
      if (state.user) {
        state.user = {
          ...state.user,
          userName,
          profilePic: profilePic || state.user.profilePic,
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

    updatePostComments: (state, action) => {
      const { postId, comments } = action.payload;
      state.posts = state.posts.map((post) =>
        post._id === postId
          ? { ...post, comments: Array.isArray(comments) ? comments : [] }
          : post
      );
    },

    setPosts: (state, action) => {
      const now = new Date();
      const posts = Array.isArray(action.payload) ? action.payload : [];

      const visiblePosts = posts.filter((post) => {
        const start = post?.stickyStartUTC ? new Date(post.stickyStartUTC) : null;
        const end = post?.stickyEndUTC ? new Date(post.stickyEndUTC) : null;

        if (post?.status !== 'approved') return false;

        if (post?.postStatus === 'published') {
          if (!post?.sticky) return true;
          return start && end && now >= start && now < end;
        }

        if (post?.postStatus === 'scheduled') {
          return start && end && now >= start && now < end;
        }

        return false;
      });

      const stickyPosts = visiblePosts.filter((post) => {
        if (!post?.sticky) return false;
        const start = post?.stickyStartUTC ? new Date(post.stickyStartUTC) : null;
        const end = post?.stickyEndUTC ? new Date(post.stickyEndUTC) : null;
        return start && end && now >= start && now < end;
      });

      const normalPosts = visiblePosts.filter((post) => {
        const start = post?.stickyStartUTC ? new Date(post.stickyStartUTC) : null;
        const end = post?.stickyEndUTC ? new Date(post.stickyEndUTC) : null;
        const isInStickyWindow = start && end && now >= start && now < end;
        return !post?.sticky || !isInStickyWindow;
      });

      stickyPosts.sort((a, b) => new Date(a.stickyStartUTC) - new Date(b.stickyStartUTC));
      state.posts = [...stickyPosts, ...normalPosts];
    },

    setAvailableStates: (state, action) => {
      state.availableStates = action.payload || [];
      console.log('Available states updated:', state.availableStates);
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    clearUserDetails: (state) => {
      state.user = null;
      state.loading = false;
      state.profilePicture = null;
      state.coverPicture = null;
      state.previousProfilePicture = null;
      state.walletAmount = 0;
      state.totalLikes = 0;
      state.totalDislikes = 0;
      state.postCount = 0;
      state.posts = [];
      state.availableStates = [];
      console.log('User logged out');
    },
  },
});

export const {
  setPosts,
  setUserDetails,
  clearUserDetails,
  setProfilePicture,
  updateMetrics,
  updatePostReaction,
  setCoverPicture,
  updatePostComments,
  setLoading,
  updateWalletData,
  setPoints,
  setAvailableStates
} = userSlice.actions;

export default userSlice.reducer;