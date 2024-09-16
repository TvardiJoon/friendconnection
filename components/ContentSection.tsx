"use client"
import React, { useState, useEffect } from "react";
import UpdateStatus from "./UpdateStatus";
import NavUserList from "./NavUserList";
import Link from "next/link";
import StatusFeed from "./StatusFeed";
import { db } from "../app/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../src/store/store";
import {
  fetchFriends,
  fetchAllUsers,
} from "../src/features/friends/friendsSlice";
import {
  fetchStatusUpdates,
  fetchStatusPosts,
} from "../src/features/posts/postsSlice";
import TopNavigation from "../components/TopNavigation";
interface ContentSectionProps {
  userData: any;
}

interface StatusPost {
  profileId: string;
  fullName: string;
  status: string;
  timestamp: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({ userData }) => {
  const [statusPosts, setStatusPosts] = useState<StatusPost[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("Fetching status posts...");
    dispatch(fetchStatusPosts());
  }, [refreshTrigger]);

  const handleAddPost = (newPost: StatusPost) => {
    setRefreshTrigger((prev) => !prev);
    console.log(statusPosts);
    console.log(newPost);
    setStatusPosts([newPost, ...statusPosts]);
  };

  return (
    <div
      id="root"
      className="flex flex-col min-h-screen bg-white text-gray-900"
    >
      <div className="friend-list-container ">
        <div className="flex flex-1 overflow-hidden">
          <NavUserList />

          <div className="flex flex-col flex-1 bg-white border-l border-gray-200">
            <TopNavigation />

            <main className="h-full">
              <div className="page-container relative h-full flex flex-auto flex-col px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:px-8">
                <div className="flex flex-col gap-4 h-full">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div
                      className="card lg:col-span-2 card-border"
                      role="presentation"
                    >
                      <div className="card-body">
                        <UpdateStatus onAddPost={handleAddPost} />
                        <div style={{ marginTop: "20px" }}>
                          <StatusFeed />
                        </div>
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
            <footer className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="text-gray-600"></div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
