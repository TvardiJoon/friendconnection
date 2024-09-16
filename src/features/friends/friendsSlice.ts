// Asynchronous thunk to handle friend and all users operations left nav bar
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';


interface Friend {
  id: string;
  name: string;
  imgSrc: string;
}
interface User {
  id: string;
  name: string;
  imgSrc: string;

}
interface StatusUpdate {
  id: string;
  status: string;
  timestamp: string;
}

interface FriendsState {
  friends: Friend[];
  loading: boolean;
  error: string | null;
}

const initialState: FriendsState = {
  friends: [],
  statusUpdates: {},
  statusPosts: [],
  allUsers: [],
  loading: false,
  error: null,
};
export const fetchStatusUpdates = createAsyncThunk<StatusUpdate[], void>(
  'friends/fetchStatusUpdates',
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

export const fetchStatusPosts = createAsyncThunk<StatusPost[], string>(
  'friends/fetchStatusPosts',
    async (_, { rejectWithValue }) => {

    try {
      const localStorageData = localStorage.getItem('userData');
      const userProfileId = localStorageData ? JSON.parse(localStorageData).id : '';

      const userProfileDoc = await getDoc(doc(db, "users", userProfileId));
      if (!userProfileDoc.exists()) {
        console.error("User profile not found");
        return rejectWithValue("User profile not found");
      }

      const userProfile = userProfileDoc.data();
      const userId = userProfile.profileId; // User's profile ID
      const friends = userProfile.friends || []; // Friends list

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
      console.error("Error fetching status posts:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch friends from Firebase
export const fetchFriends = createAsyncThunk<Friend[], string>(
  'friends/fetchFriends',
  async (id, { rejectWithValue }) => {
    try {
      const userDocRef = doc(db, `users/${id}`); // Use id here
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.friends || [];
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      return rejectWithValue('Failed to fetch friends');
    }
  }
);
export const fetchAllUsers = createAsyncThunk<User[]>(
  'friends/fetchAllUsers',
  async (_, { rejectWithValue }) => {

    try {
      const localStorageData = localStorage.getItem('userData');
      const currentUserProfileId = localStorageData ? JSON.parse(localStorageData).id : '';
      const usersCollectionRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollectionRef);

      const usersList: User[] = [];

      usersSnapshot.docs.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const docId = data.profileId;

        // Filter out the current user

        if (docId !== currentUserProfileId) {
          usersList.push({
            id: docId, // Use docId as id
            name: data.fullName || '',
            imgSrc: data.imgSrc || '/images/resources/user.png'
            // Add additional fields if needed
          });
        }

      });

      return usersList;
    } catch (error) {
      return rejectWithValue('Failed to fetch all users');
    }
  }
);
// Async thunk to fetch status updates from Firebase


// Redux slice
const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      state.friends = action.payload;
    },
    setAllUsers: (state, action: PayloadAction<User[]>) => {
      state.allUsers = action.payload;
    },
    setStatusUpdates: (state, action: PayloadAction<{ [key: string]: StatusUpdate }>) => {
      state.statusUpdates = action.payload;
    },
    setStatusPosts: (state, action: PayloadAction<{ [key: string]: StatusUpdate }>) => {
      state.statusPosts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })      .addCase(fetchStatusUpdates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusUpdates.fulfilled, (state, action) => {
        state.loading = false;
        state.statusUpdates = action.payload; // Update this line
      })
      .addCase(fetchStatusUpdates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFriends, setAllUsers, setStatusUpdates } = friendsSlice.actions;
export default friendsSlice.reducer;
