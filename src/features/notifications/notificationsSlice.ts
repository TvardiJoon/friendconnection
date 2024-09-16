// Asynchronous thunk to handle notifications 
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface FriendRequest {
  from: string;
  name: string;
  timestamp: string;
}

interface Notification {
  type: string;
  message: string;
  date: string;
}

interface NotificationsState {
  friendRequests: FriendRequest[];
  notifications: Notification[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
const initialState: NotificationsState = {
  friendRequests: [],
  notifications: [],
  status: 'idle',
  error: null,
};
// Thunks
export const fetchData = createAsyncThunk<
  { friendRequests: FriendRequest[]; notifications: Notification[] },
  void,
  { rejectValue: string }
>(
  'notifications/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const localStorageData = localStorage.getItem('userData');
      const userProfileId = localStorageData ? JSON.parse(localStorageData).id : '';

      if (!userProfileId) {
        throw new Error('User profile ID is missing');
      }

      const userDocRef = doc(db, `users/${userProfileId}`);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        return {
          friendRequests: userData.friendrequests || [],
          notifications: userData.notifications || [],
        };
      } else {
        throw new Error('No user data found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return { friendRequests: [], notifications: [] }; // Return empty arrays in case of error
    }
  }
);
// Thunks
export const handleAcceptRequest = createAsyncThunk(
  'notifications/handleAcceptRequest',
  async ({ requestId, requestName }: { requestId: string; requestName: string }, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as { notifications: NotificationsState };
      const profileId = JSON.parse(localStorage.getItem('userData') || '{}').id;

      if (!profileId) throw new Error('Profile ID is not available');

      const recipientDocRef = doc(db, `users/${profileId}`);
      const recipientDoc = await getDoc(recipientDocRef);

      if (recipientDoc.exists()) {
        const recipientData = recipientDoc.data() as NotificationsState;
        const friendRequestsArray = recipientData.friendRequests || [];
        const updatedRequests = friendRequestsArray.filter((request: FriendRequest) => request.from !== requestId);
        const currentFriends = recipientData.friends || [];
        const newFriends = [...currentFriends, { id: requestId, name: requestName, date: new Date().toISOString() }];

        await updateDoc(recipientDocRef, {
          friendrequests: updatedRequests,
          friends: newFriends,
        });

        dispatch(setFriendRequests(updatedRequests));

        const senderDocRef = doc(db, `users/${requestId}`);
        const senderDoc = await getDoc(senderDocRef);

        if (senderDoc.exists()) {
          const senderData = senderDoc.data() as NotificationsState;
          const currentSenderFriends = senderData.friends || [];
          const updatedSenderFriends = [...currentSenderFriends, { id: profileId, name: recipientData.fullName, date: new Date().toISOString() }];
          const notification = {
            type: 'friendRequestAccepted',
            message: `Your friend request to ${recipientData.fullName} has been accepted.`,
            date: new Date().toISOString(),
          };

          await updateDoc(senderDocRef, {
            friends: updatedSenderFriends,
            notifications: [...(senderData.notifications || []), notification],
            numberOfNewNotifications: (senderData.numberOfNewNotifications || 0) + 1,
          });
        } else {
          console.error('No sender data found');
        }
      } else {
        console.error('No recipient data found');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      return rejectWithValue('Failed to accept friend request');
    }
  }
);
export const handleRejectRequest = createAsyncThunk(
  'notifications/handleRejectRequest',
  async (requestId: string, { dispatch, rejectWithValue }) => {
    const profileId = JSON.parse(localStorage.getItem('userData') || '{}').id;

    if (!profileId) return rejectWithValue('Profile ID is not available');

    try {
      const userDocRef = doc(db, `users/${profileId}`);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as NotificationsState;
        const friendRequestsArray = userData.friendrequests || [];
        const updatedRequests = friendRequestsArray.filter((request: FriendRequest) => request.from !== requestId);

        await updateDoc(userDocRef, {
          friendRequests: updatedRequests
        });

        dispatch(setFriendRequests(updatedRequests));
      } else {
        console.error('No user data found');
        return rejectWithValue('No user data found');
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      return rejectWithValue('Failed to reject friend request');
    }
  }
);
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setFriendRequests(state, action: PayloadAction<FriendRequest[]>) {
      state.friendRequests = action.payload;
    },
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchData.fulfilled, (state, action: PayloadAction<{ friendRequests: FriendRequest[]; notifications: Notification[] }>) => {
        state.status = 'succeeded';
        state.friendRequests = action.payload.friendRequests;
        state.notifications = action.payload.notifications;
        state.error = null;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch data';
      })
      .addCase(handleAcceptRequest.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to accept friend request';
      })
      .addCase(handleRejectRequest.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to reject friend request';
      });
  },
});

export const { setFriendRequests, setNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
