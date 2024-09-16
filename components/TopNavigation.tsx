import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Notifications from "./Notifications";
import { logout } from "../src/features/auth/authSlice";

const TopNavigation: React.FC = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const userDataString = localStorage.getItem("userData"); // Get the data as a string
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const togglePopup = () => {
    setPopupOpen((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleNameClick = () => {
    router.push("/"); // Use router.push or navigate to go to the profile page
  };

  return (
    <header className="border-b border-gray-200 h-16 flex items-center px-4 bg-gray-50">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4"></div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <a
              href="/"
              className="flex items-center p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <div className="border rounded-full flex items-center justify-center">
                <div className="overflow-hidden box-border inline-block relative w-6 h-6">
                  <img
                    src="/images/resources/user.png"
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <p className="whitespace-nowrap font-semibold pl-2 pr-2">
                {userData?.fullName || "User"}
              </p>
            </a>
          </div>
          <div className="relative">
            <button onClick={togglePopup} className="text-2xl p-2 relative">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="text-2xl p-2 rounded hover:bg-gray-200"
          >
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <Notifications isPopupOpen={isPopupOpen} togglePopup={togglePopup} />
    </header>
  );
};

export default TopNavigation;
