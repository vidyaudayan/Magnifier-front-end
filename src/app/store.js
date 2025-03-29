import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice.js'
import searchReducer from "../features/search/searchSlice.js"

export default configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
  },
})