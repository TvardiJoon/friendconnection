// Asynchronous thunk to handle profile posts /profile details
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, updateDoc, arrayUnion, collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface UserState {
  profileId: string | null;
  fullName: string | null;
  isFriend: boolean;
  isRequestSent: boolean;
  status: 'idle' | 'loading' | 'fulfilled' | 'rejected';
  error: string | null;
  statusPosts: [];
}

// Set the initial state using the interface
const initialState: UserState = {
  profileId: null,
  fullName: null,
  isFriend: false,
  isRequestSent: false,
  status: 'idle',
  error: null,
  statusPosts: [],
};

export const fetchProfilePosts = createAsyncThunk(
  'profile/fetchProfilePosts',
  async (currentProfileId) => {
    try {
      if (!currentProfileId) return [];

      const statusUpdatesCollection = collection(db, 'statusUpdates');
      const snapshot = await getDocs(statusUpdatesCollection);

      const allPosts = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          profileId: data.profileId || '',
          fullName: data.fullName || '',
          status: data.statusMessage[0]?.status || '',
          timestamp: data.statusMessage[0]?.timestamp || '',
        };
      });

      const userPosts = allPosts.filter(post => post.profileId === currentProfileId);
      userPosts.reverse();

      return userPosts;
    } catch (error) {
      console.error('Error fetching profile posts:', error);
      return [];
    }
  }
);
// Async thunk for checking friend status
export const fetchFriendStatus = createAsyncThunk<FriendStatus, string>(
  'profile/fetchFriendStatus',
  async (currentProfileId, { rejectWithValue }) => {
    try {

      const currentUserProfileDoc = await getDoc(doc(db, 'users', currentProfileId));
      const currentUserProfile = currentUserProfileDoc.data();
      const localStorageData = localStorage.getItem('userData');
      const userProfileId = localStorageData ? JSON.parse(localStorageData).id : '';


      const isFriend = currentUserProfile?.friends?.some((friend) => friend.id === userProfileId);

      const userProfileDoc = await getDoc(doc(db, 'users', userProfileId));
      const userProfileData = userProfileDoc.data();

      const isRequestSent = currentUserProfile?.friendrequests?.some((request) => request.from === userProfileId);

      return { isFriend, isRequestSent,fullName: currentUserProfile.fullName};
    } catch (error) {
      console.error('Error checking friend status:', error);
      throw error;
    }
  }
);

// Async thunk for sending friend request
export const sendFriendRequest = createAsyncThunk(
  'profile/sendFriendRequest',
  async ({ userProfileId }) => {
    const localStorageData = localStorage.getItem('userData');
    const currentUserProfileId = localStorageData ? JSON.parse(localStorageData).id : '';
    const currentUserFullName = localStorageData ? JSON.parse(localStorageData).fullName : '';
    const timestamp = new Date().toISOString();
    const request = {
      timestamp,
      from: currentUserProfileId,
      name: currentUserFullName,
    };

    try {
      const userRef = doc(db, 'users', userProfileId);
      await updateDoc(userRef, {
        friendrequests: arrayUnion(request),
      });
      return true;
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    isFriend: false,
    isRequestSent: false,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchFriendStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFriendStatus.fulfilled, (state, action) => {
        state.isFriend = action.payload.isFriend;
        state.isRequestSent = action.payload.isRequestSent;
        state.fullName = action.payload.fullName;
        state.status = 'fulfilled';
      })
      .addCase(fetchFriendStatus.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.payload as string;
      })
      .addCase(sendFriendRequest.fulfilled, (state) => {
        state.isRequestSent = true;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchProfilePosts.fulfilled, (state, action) => {
      state.statusPosts = action.payload; // Set posts in state
      state.status = 'fulfilled';
    })
    .addCase(fetchProfilePosts.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = action.payload as string;
    });
  },
});
export const { setProfileId, setFullName } = profileSlice.actions;
export default profileSlice.reducer;
