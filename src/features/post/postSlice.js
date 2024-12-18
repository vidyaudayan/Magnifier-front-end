// Redux Slice
import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
  },
  reducers: {
    updatePostReaction: (state, action) => {
      const { postId, updatedPost } = action.payload;
      const index = state.posts.findIndex(post => post._id === postId);
      if (index !== -1) {
        state.posts[index] = updatedPost;
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export const { updatePostReaction, setPosts } = postSlice.actions;
export default postSlice.reducer;
