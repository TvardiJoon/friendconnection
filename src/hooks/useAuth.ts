// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { login, logout } from '../features/auth/authSlice';
import { useRouter } from 'next/navigation';
export function useAuth() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSignOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      dispatch(logout());
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Only update Redux state with user data, without needing credentials
        dispatch(login({ id: user.uid, email: user.email || '' })); // Adjust as needed
        setUser(user);
      } else {
        dispatch(logout());
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, router]);

  return {
    user,
    loading,
    handleSignOut
  };
}
