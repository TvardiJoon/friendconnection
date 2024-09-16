import Image from "next/image";
import TopNavigation from "../components/TopNavigation";
import { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../app/lib/firebase"; 
import StatusFeed from "./StatusFeed";
import NavUserList from "./NavUserList";
import SuggestFriendList from "./SuggestFriendList";
import Link from "next/link";
import ProfileHeader from "./ProfileHeader";
const ProfileComponent = ({ profile: userProfile, posts }) => {
  const [activeTab, setActiveTab] = useState("posts");
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  // Retrieve userData from localStorage and parse it
  const storedUserData = localStorage.getItem("userData");
  const userData = storedUserData ? JSON.parse(storedUserData) : {};
  const currentUserProfileId = userData.profileId || ""; // Default to empty string if not available
  const currentUserFullName = userData.fullName || "User"; // Default to 'User' if not available
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 500); // 500ms delay

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  if (!userProfile) return <p>No profile data available.</p>;

  return (
    <div
      id="root"
      className="flex flex-col min-h-screen bg-white text-gray-900 overflow-y-auto h-full scrollable-container"
    >
      <div className="">
        {" "}
        {/* Add this wrapper div for scroll functionality */}
        <div className="friend-list-container overflow-auto">
          <div className="flex flex-1 ">
            <NavUserList />

            <div className="flex flex-col flex-1 bg-white border-l border-gray-200">
              <TopNavigation />

              <main className="">
                <div className="page-container relative h-full flex flex-auto flex-col px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:px-8">
                  <div className="flex flex-col gap-4 h-full">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div
                        className="card lg:col-span-2 card-border"
                        role="presentation"
                      >
                        <div className="card-body">
                          <div className="overflow-x-auto"></div>
                        </div>
                      </div>
                      <div className="card card-border" role="presentation">
                        <div className="card-body">
                          <div className="overflow-x-auto"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>

              <div className="max-w-[1065px] mx-auto max-lg:-m-2.5">
                {/* Cover */}
                <div className="bg-white lg:rounded-b-2xl lg:-mt-10 dark:bg-dark2">
                  {/* Cover Image */}

                  {/* User Info */}

                  {/* Navigations */}

                  <ProfileHeader />

                  <StatusFeed />
                </div>
                <div
                  className="flex 2xl:gap-12 gap-10 mt-8 max-lg:flex-col"
                  id="js-oversized"
                >
                  {/* Feed Story */}
                  {/* Sidebar */}
                  <div className="lg:w-[400px]"></div>
                </div>
              </div>

              <footer className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="text-gray-600"></div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
