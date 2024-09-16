"use client";
import Image from "next/image";
import TopNavigation from "../components/TopNavigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchFriendStatus,
  sendFriendRequest,
} from "../src/features/profile/profileSlice";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ProfileHeader = () => {
  const dispatch = useDispatch();
  const { profileId, fullName, isRequestSent, isFriend } = useSelector(
    (state) => state.profile
  );
  const searchParams = useSearchParams();
  const currentProfileId = searchParams.get("profileId");
  const [loading, setLoading] = useState(true);
  const localStorageUserId = JSON.parse(localStorage.getItem('userData') || '{}').id;

  useEffect(() => {
    if (currentProfileId) {
      const fetchStatus = async () => {
        try {
          await dispatch(fetchFriendStatus(currentProfileId));
        } finally {
          setLoading(false);
        }
      };

      fetchStatus();
    }
  }, [dispatch, currentProfileId]);

  const handleSendRequest = () => {
    if (currentProfileId) {
      dispatch(
        sendFriendRequest({
          userProfileId: currentProfileId,
        })
      );
    }
  };

  return (
    <div className="bg-white shadow lg:rounded-b-2xl lg:-mt-10 dark:bg-dark2">
      {/* Cover */}
      <div className="relative overflow-hidden w-full lg:h-60 h-40">
        <img
          src="https://www.cinematheque.qc.ca/workspace/uploads/projections/blue_still1-fr-1713295206.jpg"
          alt="Group Cover"
          layout="fill"
          objectFit="cover"
          className="inset-0"
        />
        <div className="w-full bottom-0 absolute left-0 bg-gradient-to-t from-black/60 pt-10 z-10"></div>
      </div>

      <div className="lg:px-10 md:p-5 p-3">
        <div className="flex flex-col justify-center -mt-20">
          <div className="relative h-20 w-20 mb-4 z-10">
            <div className="relative overflow-hidden rounded-full md:border-[2px] border-gray-100 dark:border-slate-900 shadow">
              <img
                src="/images/resources/userblank.jpeg"
                alt="Avatar"
                layout="fill"
                objectFit="cover"
                className="inset-0"
              />
            </div>
          </div>

          <div className="flex lg:items-center justify-between max-md:flex-col max-md:gap-3">
            <div className="flex-1">
              {!loading && (
                <h3 className="md:text-2xl text-lg font-bold text-black">
                  {fullName}
                </h3>
              )}
            </div>
            {currentProfileId !== localStorageUserId && (
    <>
      {/* Show the "Send Friend Request" button if the user is not a friend and no request has been sent */}
      {!loading && !isFriend && !isRequestSent && (
        <button
          className="mt-[5px] py-[7px] px-6 rounded-3xl bg-[#eff3f4] h-fit mt-4 font-bold text-sm text-black hover:bg-[#d1d1d1] duration-200"
          onClick={handleSendRequest}
        >
          <i className="icofont-check-circled"></i>
          {"Send Friend Request"}
        </button>
      )}

      {/* Show a disabled "Request Sent" button if the request has been sent */}
      {!loading && !isFriend && isRequestSent && (
        <button
          className="mt-[5px] py-[7px] px-6 rounded-3xl bg-[#d1d1d1] h-fit mt-4 font-bold text-sm text-black duration-200"
          disabled
        >
          <i className="icofont-check-circled"></i>
          {"Request Sent"}
        </button>
      )}

      {/* Show a disabled "Friend" button if the user is already a friend */}
      {isFriend && (
        <button
          className="mt-[5px] py-2 px-6 rounded-3xl bg-[#d1d1d1] text-sm font-bold text-black hover:bg-[#b0b0b0] duration-200"
          disabled
        >
          <i className="icofont-check-circled"></i>
          {"Friend"}
        </button>
      )}
    </>
  )}

          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-2 dark:border-slate-700">
        <nav className="flex gap-0.5 rounded-xl overflow-hidden text-gray-500 font-medium text-sm overflow-x-auto dark:text-white">
          <button className="inline-block py-3 leading-8 px-3.5 border-b-2 border-blue-600 text-blue-600">
            Timeline
          </button>
          {/* Add other navigation items here if needed */}
        </nav>
      </div>
    </div>
  );
};

export default ProfileHeader;
