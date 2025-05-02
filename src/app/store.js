{/*import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice.js'
import searchReducer from "../features/search/searchSlice.js"

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
export default configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
  },
})*/}

import { combineReducers } from 'redux'; // Explicitly import combineReducers
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from '../features/user/userSlice';
import searchReducer from '../features/search/searchSlice';

// 1. Combine reducers explicitly
const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer
});

// 2. Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user']
};

// 3. Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export const persistor = persistStore(store);


