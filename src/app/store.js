


import { combineReducers } from 'redux'; // Explicitly import combineReducers

import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from '../features/user/userSlice';
import searchReducer from '../features/search/searchSlice';

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // Ensure user slice is persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);