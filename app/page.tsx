"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // or 'next/router' if using pages directory
import { useDispatch, useSelector } from 'react-redux';
import { signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/lib/firebase';
import { RootState, AppDispatch } from '../src/store/store';
import { logout, loginSuccess } from '../src/features/auth/authSlice'; // Ensure `loginSuccess` action is defined if needed
import TopNavigation from '../components/TopNavigation';
import ContentSection from '../components/ContentSection';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const storedUserData = localStorage.getItem('userData');

        if (storedUserData) {
          try {
            const parsedUserData = JSON.parse(storedUserData);
            const userPayload = {
              id: parsedUserData.id,
              fullName: parsedUserData.fullName,
            };
            dispatch(loginSuccess(userPayload)); // Update Redux state with user data
          } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
          }
        } else {
          const userPayload = {
            id: firebaseUser.uid,
            fullName: firebaseUser.displayName || 'Unknown',
          };
          dispatch(loginSuccess(userPayload)); // Update Redux state with user data
        }
      } else {
        dispatch(logout()); // Ensure Redux state reflects logout
        localStorage.removeItem('userData'); // Remove user data from localStorage
        router.push('/login');
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [dispatch, router]);

  if (loading) {
    return (
      <div className="page-loader" id="page-loader">
        {/* Loader content */}
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <ContentSection  />
    </div>
  );
}
