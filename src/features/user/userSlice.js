import { createSlice } from '@reduxjs/toolkit'

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

export default userSlice.reducer