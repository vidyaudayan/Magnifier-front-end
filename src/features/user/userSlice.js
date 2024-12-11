{/*import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
  },
  reducers: {
   setUserDetails: (state,action)=>{
    state.user= action.payload
console.log("user details",action.payload)

   },
   clearUserDetails: (state) => {
    state.user = null;
    console.log("User logged out");
  }
  
  },
})


export const { setUserDetails,clearUserDetails} = userSlice.actions

export default userSlice.reducer*/}

import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    profilePicture: null, // Current profile picture
    previousProfilePicture: null, // Previous profile picture
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
    clearUserDetails: (state) => {
      state.user = null;
      state.profilePicture = null;
      state.previousProfilePicture = null;
      console.log('User logged out');
    },
  },
});

export const { setUserDetails, clearUserDetails, setProfilePicture } = userSlice.actions;

export default userSlice.reducer;
