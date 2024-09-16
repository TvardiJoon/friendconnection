// Asynchronous thunk to handle posts and status updates  
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { doc, getDoc, collection, getDocs, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface StatusPost {
  id: string;
  fullName: string;
  status: string;
  timestamp: string;
}

interface StatusUpdate {
  id: string;
  fullName: string;
  status: string;
  timestamp: string;
}

interface PostState {
  statusPosts: StatusPost[];
  statusUpdates: { [key: string]: StatusUpdate };
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  statusPosts: [],
  statusUpdates: {},
  loading: false,
  error: null,
};
const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};
export const fetchProfilePosts = createAsyncThunk(
  'posts/fetchProfilePosts',
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
export const fetchStatusPosts = createAsyncThunk<StatusPost[], void>(
  'posts/fetchStatusPosts',
  async (_, { rejectWithValue }) => {
    try {
      const localStorageData = localStorage.getItem('userData');
      const userProfileId = localStorageData ? JSON.parse(localStorageData).id : '';

      if (!userProfileId) {
        return rejectWithValue("User profile ID not found");
      }

      const userProfileDoc = await getDoc(doc(db, "users", userProfileId));
      if (!userProfileDoc.exists()) {
        return rejectWithValue("User profile not found");
      }

      const userProfile = userProfileDoc.data();
      const userId = userProfile.profileId;
      const friends = userProfile.friends || [];

      const friendIds = new Set(friends.map((friend: { id: string }) => friend.id));
      friendIds.add(userId);

      const statusUpdatesCollection = collection(db, "statusUpdates");
      const snapshot = await getDocs(statusUpdatesCollection);

      const posts: StatusPost[] = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            profileId: data.profileId || "",
            fullName: data.fullName || "",
            status: data.statusMessage[0]?.status || "",
            timestamp: data.statusMessage[0]?.timestamp || "",
          } as StatusPost;
        })
        .filter((post) => friendIds.has(post.profileId));

      posts.reverse();

      return posts;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error fetching status posts');
    }
  }
);

export const fetchUpdateStatus = createAsyncThunk<void, { status: string }>(  'posts/updateStatus',
 async ({ status }, { rejectWithValue }) => {
    try {
      const localStorageData = localStorage.getItem('userData');
      const id = localStorageData ? JSON.parse(localStorageData).id : '';

      const userRef = doc(db, `users/${id}`);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {

        const user = userDoc.data();
        const friendsList = user.friends || [];
        const fullName = user.fullName || [];

      const timestampHash = Date.now().toString();
      const statusDocRef = doc(db, `statusUpdates/${timestampHash}`);
      const newPost = {
        status,
        timestamp: formatDate(new Date()),
        fullName: fullName,
        profileId: id,
      };

      await setDoc(statusDocRef, {
        email: fullName.replace(/[\.@]/g, '_'),
        fullName: fullName,
        profileId: id,
        statusMessage: arrayUnion(newPost),
        timestamp: formatDate(new Date()),
      });

      const notifyFriends = async (friendsList: any[], userFullName: string) => {

        for (const friend of friendsList) {
          const friendRef = doc(db, `users/${friend.id}`);
          const friendDoc = await getDoc(friendRef);

          if (friendDoc.exists()) {
            const notificationsRef = doc(db, `users/${friend.id}`);
            const notificationsSnap = await getDoc(notificationsRef);
            let existingNotifications = notificationsSnap.exists() ? (notificationsSnap.data().notifications || []) : [];

            const newNotification = {
              type: 'statusUpdate',
              message: `${userFullName} posted a new status.`,
              timestamp: new Date().toISOString(),
            };
            existingNotifications = [newNotification, ...existingNotifications];

            await updateDoc(notificationsRef, {
              notifications: existingNotifications,
            });
          }
        }
      };

      await notifyFriends(friendsList, fullName);
          }
    } catch (error) {
      return rejectWithValue('Failed to update status');
    }
  }
);

export const fetchStatusUpdates = createAsyncThunk<StatusUpdate[], void>(
  'posts/fetchStatusUpdates',
  async (_, { rejectWithValue }) => {
    try {
      const statusCollectionRef = collection(db, 'statusUpdates');
      const statusSnapshot = await getDocs(statusCollectionRef);

      const statusObject: { [key: string]: StatusUpdate } = {};

      statusSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const statusMessages: StatusUpdate[] = data.statusMessage || [];
        const id = data.profileId;

        if (id && statusMessages.length > 0) {
          const latestMessage = statusMessages[0];
          statusObject[id] = {
            profileId: id,
            fullName: latestMessage.fullName,
            status: latestMessage.status,
            timestamp: latestMessage.timestamp,
          };
        }
      });

      return statusObject;
    } catch (error) {
      return rejectWithValue('Failed to fetch status updates');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setStatusUpdates: (state, action: PayloadAction<{ [key: string]: StatusUpdate }>) => {
      state.statusUpdates = action.payload;
    },
    setStatusPosts: (state, action: PayloadAction<StatusPost[]>) => {
      state.statusPosts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatusPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.statusPosts = action.payload;
      })
      .addCase(fetchStatusPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStatusUpdates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusUpdates.fulfilled, (state, action) => {
        state.loading = false;
        state.statusUpdates = action.payload;
      })
      .addCase(fetchStatusUpdates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProfilePosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfilePosts.fulfilled, (state, action) => {
        state.loading = false;
        state.statusPosts = action.payload; // Fixed to update statusPosts
      })
      .addCase(fetchProfilePosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setStatusUpdates, setStatusPosts} = postsSlice.actions;
export default postsSlice.reducer;
