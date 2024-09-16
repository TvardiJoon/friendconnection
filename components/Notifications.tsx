import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../src/store/store";
import { fetchData, handleAcceptRequest, handleRejectRequest } from "../src/features/notifications/notificationsSlice";

interface NotificationsProps {
  isPopupOpen: boolean;
  togglePopup: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ isPopupOpen, togglePopup }) => {
  const dispatch: AppDispatch = useDispatch();
  const { friendRequests, notifications } = useSelector((state: RootState) => state.notifications);
  const [activeTab, setActiveTab] = React.useState<'friendRequests' | 'notifications'>('friendRequests');

  useEffect(() => {
      dispatch(fetchData());

  }, [isPopupOpen, dispatch]);

  return (
    isPopupOpen && (
      <div className="fixed top-0 right-0 mt-12 mr-4 bg-white rounded-lg shadow-lg w-80 max-w-xs z-50">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <button onClick={togglePopup} className="text-gray-500 hover:text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col">
          <ul className="flex border-b border-gray-200">
            <li
              className={`flex-1 cursor-pointer p-2 ${activeTab === 'friendRequests' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('friendRequests')}
            >
              Friend Requests
            </li>
            <li
              className={`flex-1 cursor-pointer p-2 ${activeTab === 'notifications' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </li>
          </ul>
          <div className="p-4">
            {activeTab === 'friendRequests' && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Friend Requests</h4>
                <ul>
                  {friendRequests.length > 0 ? (
                    friendRequests.map((request) => (
                      <li key={request.from} className="flex items-center space-x-4 mb-4">
                        <img src="images/resources/user.png" alt={request.name} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <p className="font-semibold">{request.name}</p>
                          <p className="text-gray-600">Sent you a friend request</p>
                          <div className="mt-2 flex space-x-2">
                          <button
          onClick={() => dispatch(handleAcceptRequest({ requestId: request.from, requestName: request.name }))}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Accept
        </button>
        <button
          onClick={() => dispatch(handleRejectRequest(request.from))}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Reject
        </button>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-600">No new friend requests</li>
                  )}
                </ul>
              </div>
            )}
            {activeTab === 'notifications' && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Notifications</h4>
                <ul>
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <li key={index} className="flex items-center space-x-4 mb-4">
                        <div className="flex-1">
                          <p className="text-gray-800">{notification.message}</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-600">No notifications</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Notifications;
