import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../lib/firebase'; // Adjust import path if necessary
import { collection, query, where, getDocs, setDoc, doc,getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

interface AuthState {
  loading: boolean;
  error: string | null;
  user: any | null; // Replace 'any' with a specific user type if you have one
}

const initialState: AuthState = {
  loading: false,
  error: null,
  user: null, // Initialize user as null
};

// Asynchronous thunk to handle registration
// Helper functions
const generateProfileId = () => uuidv4();

const isProfileIdUnique = async (profileId: string) => {
  const profileDocRef = doc(db, `profileIds/${profileId}`);
  const querySnapshot = await getDoc(profileDocRef);
  return !querySnapshot.exists();
};

const capitalizeWords = (str: string) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Registration thunk
export const register = createAsyncThunk(
  'auth/register',
  async ({ firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }, { rejectWithValue }) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Generate and check unique profile ID
      let profileId = generateProfileId();
      while (!(await isProfileIdUnique(profileId))) {
        profileId = generateProfileId();
      }

      // Capitalize full name
      const fullName = capitalizeWords(`${firstName} ${lastName}`);

      // Update user profile with first and last name
      await updateProfile(user, { displayName: fullName });

      // Create a document for the user in Firestore
      const sanitizedEmail = email.replace(/[\.@]/g, '_').toLowerCase();
      await setDoc(doc(db, `users/${profileId}`), {
        fullName,
        sanitizedEmail,
        profileId,
      });

      // Return user data

      const userData = { id: profileId, fullName, sanitizedEmail };
      const userPayload = {
        id: userData.id,
        fullName: userData.fullName,
      };

      // Save user data in local storage
      localStorage.setItem('userData', JSON.stringify(userPayload));
      console.log(userPayload)
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<any>) { // Replace 'any' with a specific user type
      state.loading = false;
      state.user = action.payload;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    signOutUser(state) {
      state.user = null; // Clear user data on logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { loginStart, loginSuccess, loginFailure, signOutUser } = authSlice.actions;
export default authSlice.reducer;

// Function to find user by sanitized email
const findUserByEmail = async (email: string) => {
  const sanitizedEmail = email.replace(/[\.@]/g, '_').toLowerCase();
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('sanitizedEmail', '==', sanitizedEmail));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  } else {
    throw new Error('No matching user found');
  }
};
// Helper functions to handle Firebase interactions
export const login = (credentials: { email: string, password: string }) => async (dispatch: any) => {
  dispatch(loginStart());
  try {
    const { email, password } = credentials;

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user data from Firestore
    const userData = await findUserByEmail(email);
    console.log('Fetched user data:', userData);

    // Prepare the user payload
    const userPayload = {
      id: userData.id,
      fullName: userData.fullName,
    };

    // Save user data in local storage
    localStorage.setItem('userData', JSON.stringify(userPayload));
    console.log(userPayload)
    // Dispatch success action with user data
    dispatch(loginSuccess(userPayload));

    // Optional: Dispatch a success message or log success
    console.log('Login successful');
  } catch (error: any) {
    console.error('Error during login:', error.message);

    // Dispatch failure action with error message
    dispatch(loginFailure('Invalid email or password.'));
  }
};
export const logout = () => async (dispatch: any) => {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem('userData');
    dispatch(signOutUser());
  } catch (error: any) {
    console.error('Error during logout:', error.message);
    dispatch(loginFailure('Error logging out.'));
  }
};
