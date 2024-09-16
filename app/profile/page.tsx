"use client"
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '../lib/firebase';
import { doc, updateDoc, arrayUnion, getDoc, getDocs, collection } from 'firebase/firestore';
import TopNavigation from '../../components/TopNavigation';
import Sidebar from '../../components/Sidebar';
import ProfileComponent from '../../components/ProfileComponent';

interface UserProfile {
  name: string;
  role?: string;
  imgSrc?: string;
  bio?: string;
  location?: string;
  id?: string;
  friends?: string[];
}

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileId = searchParams.get('profileId');

 const [posts, setPosts] = useState<StatusPost[]>([]);

  const storedUserData = localStorage.getItem('userData');
  const userData = storedUserData ? JSON.parse(storedUserData) : {};
  const currentUserProfileId = userData.profileId || '';
  const currentUserFullName = userData.fullName || 'User';

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!profileId) {
        console.error('No profile ID provided.');
        setLoading(false);
        return;
      }

      try {
        const profileRef = doc(db, 'users', profileId);
        const profileDoc = await getDoc(profileRef);

        if (!profileDoc.exists()) {
          console.error('No document found for the provided profile ID.');
          setLoading(false);
          return;
        }

        const userData = profileDoc.data();

        if (!userData) {
          console.error('No user data found.');
          setLoading(false);
          return;
        }

        // Construct userProfileData object with the expected UserProfile fields
        const userProfileData: UserProfile = {
          fullName: userData.fullName || 'No name provided',
          profileId: profileId,
          friends: userData.friends,
        };

        // Update state with the constructed userProfileData
        setUserProfile(userProfileData);

      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchStatusPosts = async () => {
       try {
         if (!profileId) return;

         const statusUpdatesCollection = collection(db, 'statusUpdates');
         const snapshot = await getDocs(statusUpdatesCollection);

         const allPosts = snapshot.docs.map((doc) => {
           const data = doc.data();
           return {
             profileId: data.profileId || '',
             fullName: data.fullName || '',
             status: data.statusMessage[0]?.status || '',
             timestamp: data.statusMessage[0]?.timestamp || '',
           } as StatusPost;
         });

         const userPosts = allPosts.filter(post => post.profileId === profileId);
         userPosts.reverse();

         setPosts(userPosts);
         console.log(userPosts)
         console.log(profileId)
       } catch (error) {
         console.error('Error fetching status posts:', error);
       }
     };

     fetchStatusPosts();
    fetchUserProfile();
  }, [profileId]);

  if (loading) {
    return       <div className="page-loader" id="page-loader">
         <div className="loader">
           <span className="loader-item"></span>
           <span className="loader-item"></span>
           <span className="loader-item"></span>
           <span className="loader-item"></span>
           <span className="loader-item"></span>
           <span className="loader-item"></span>
           <span className="loader-item"></span>
           <span className="loader-item"></span>
           <span className="loader-item"></span>
           <span className="loader-item"></span>
         </div>
       </div>;
  }

  if (!userProfile) {
    return <div>User profile not found</div>;
  }

  return (
    <div className="profile-page">
      <ProfileComponent profile={userProfile} posts={posts}/>
    </div>
  );
};

export default ProfilePage;
