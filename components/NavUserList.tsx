import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../src/store/store";
import {
  fetchFriends,
  fetchAllUsers,
  fetchStatusUpdates,
} from "../src/features/friends/friendsSlice";



import Link from "next/link";
import "../styles/styles.css";

const NavUserList: React.FC = () => {
  const dispatch = useDispatch();
  const { friends, allUsers, statusUpdates, loading, error } = useSelector(
    (state: RootState) => state.friends
  );

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("userData") || "{}").id;

    if (id) {

      dispatch(fetchFriends(id));
      dispatch(fetchStatusUpdates());
      dispatch(fetchAllUsers());

    }
  }, [dispatch]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="overflow-y-auto scrollable-container flex-shrink-0 w-[290px] min-w-[290px] bg-gray-100 border-r border-gray-200 min-h-screen">
      <div className="px-6 py-4">
        <div className="flex items-center space-x-4 flex-grow">
          {/* Logo Text */}
          <a href="/" className="text-xl font-bold text-blue-600">
            Friend Connections
          </a>
        </div>{" "}
      </div>
      <div className="relative overflow-hidden h-full">
        <div className="absolute inset-0  pr-3 pb-3">
          <nav className="px-4 pb-4">
            <div className="space-y-2">
              <div className="text-lg font-semibold text-gray-700 mb-2">
                Friends
              </div>
              <ul>
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="relative flex items-center p-3 mb-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 ease-in-out"
                    >
                      <div className="border rounded-full flex overflow-hidden w-10 h-10">
                        <img
                          alt={friend.name}
                          src={friend.imgSrc || "/images/resources/user.png"}
                          className="object-cover w-full h-full rounded-full"
                        />
                      </div>
                      <div className="ml-3 flex flex-col">
                        <p className="font-medium text-base">
                          <a
                            href={`profile?profileId=${friend.id}`}
                            title="View Profile"
                            className="hover:underline text-blue-600"
                          >
                            {friend.name}
                          </a>
                        </p>
                        <p className="text-gray-500 text-xs">
                          {statusUpdates[friend.id]?.status ||
                            "No status available"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500 bg-gray-100 border border-gray-200 rounded-lg">
                    <div className="text-lg font-semibold mb-2"></div>
                    <p>No friends found</p>
                  </div>
                )}

                <div className="text-lg font-semibold text-gray-700 mb-2">
                  All Users
                </div>

                {allUsers.length > 0 ? (
                  allUsers.map((user) => (
                    <div
                      key={user.id}
                      className="relative flex items-center p-3 mb-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 ease-in-out"
                    >
                      <div className="border rounded-full flex overflow-hidden w-7 h-7">
                        <img
                          alt={user.name}
                          src={user.imgSrc || "/images/resources/user.png"}
                          className="object-cover w-full h-full rounded-full"
                        />
                      </div>
                      <div className="ml-3 flex flex-col">
                        <p className="font-medium text-base">
                          <a
                            href={`profile?profileId=${user.id}`}
                            title="View Profile"
                            className="hover:underline text-blue-600"
                          >
                            {user.name}
                          </a>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500 bg-gray-100 border border-gray-200 rounded-lg">
                    <div className="text-lg font-semibold mb-2">All Users</div>
                    <p>No users found</p>
                  </div>
                )}
              </ul>
            </div>
            <div className="mb-10"></div>
            <div className="mb-10"></div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NavUserList;
