import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PostCard from "./PostCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../src/store/store";
import {
  fetchStatusPosts,
  fetchProfilePosts,
} from "../src/features/posts/postsSlice";

const StatusFeed: React.FC = () => {
  const dispatch = useDispatch();
  const { statusPosts, loading, error } = useSelector(
    (state: RootState) => state.posts
  );
  const searchParams = useSearchParams();
  const currentProfileId = searchParams.get("profileId");

  useEffect(() => {
    const pathname = window.location.pathname;

    if (pathname === "/") {
      // Dispatch action for fetching status updates on the root path
      dispatch(fetchStatusPosts());
    } else if (pathname.startsWith("/profile")) {
      // Extract profile ID from the URL
      if (currentProfileId) {
        // Dispatch action for fetching profile-specific posts
        dispatch(fetchProfilePosts(currentProfileId));
      }
    }
  }, [dispatch, currentProfileId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 mb-5 bg-gray-100 rounded-lg shadow-md border border-gray-300">
        <div className="text-center p-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto mb-4 text-gray-400 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v1m0 14v1m8-8h-1m-14 0H3m15.36-6.36l-.7.71M7.04 16.95l-.71.71m11.31.7l-.71-.71M7.04 7.05l-.71.71"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg shadow-md border border-gray-300">
        <div className="text-center p-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto mb-4 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M12 4a8 8 0 11-8 8 8 8 0 018-8z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700">
            Something went wrong
          </h2>
          <p className="text-gray-500 mt-2">
            Unable to load status updates. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!statusPosts.length) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg shadow-md border border-gray-300">
        <div className="text-center p-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6M12 9v6"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700">
            No Status Updates Available
          </h2>
          <p className="text-gray-500 mt-2">
            It seems there are no status updates at the moment. Please check
            back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {statusPosts.map((status, index) => (
        <PostCard
          key={index}
          profileId={status.profileId}
          fullName={status.fullName}
          date={status.timestamp} // Adjust this based on your actual data structure
          content={status.status} // Adjust this based on your actual data structure
        />
      ))}
    </>
  );
};

export default StatusFeed;
