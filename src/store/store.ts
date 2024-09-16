import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // Adjust the path as necessary
import friendsReducer from '../features/friends/friendsSlice'; // Adjust the path as necessary
import postReducer from '../features/posts/postsSlice';
import profileReducer from '../features/profile/profileSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
// Create the store with all reducers combined
export const store = configureStore({
  reducer: {
    auth: authReducer,           // Authentication slice
    friends: friendsReducer,     // Friends slice
    posts:postReducer,
    profile:profileReducer,
    notifications:notificationsReducer,
  },
});

// Define RootState type for use in your components
export type RootState = ReturnType<typeof store.getState>;
// Define AppDispatch type for use in your components
export type AppDispatch = typeof store.dispatch;
