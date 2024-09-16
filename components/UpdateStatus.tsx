import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUpdateStatus } from "../src/features/posts/postsSlice"; 

interface UpdateStatusProps {
  onAddPost: (post: {
    status: string;
    timestamp: string;
    fullName: string;
    id: string;
  }) => void;
}

const UpdateStatus: React.FC<UpdateStatusProps> = ({ onAddPost }) => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!status.trim()) return;

    const storedUserData = localStorage.getItem("userData");
    const userData = storedUserData ? JSON.parse(storedUserData) : null;

    if (!userData || !userData.fullName || !userData.id) {
      console.error("User data is missing");
      return;
    }

    setLoading(true);
    try {
      const newPost = {
        status,
        timestamp: new Date().toISOString(),
        fullName: userData.fullName,
        id: userData.id, // Adjusted to match the expected property
      };
      console.log(status);

      // Dispatch fetchUpdateStatus thunk with userData
      await dispatch(fetchUpdateStatus({ status })).unwrap();

      console.log(newPost);
      onAddPost(newPost);
      setStatus("");
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl bg-gray-100 rounded-lg shadow-md border border-gray-300 text-gray-700 font-medium mt-6">
      <div className="flex items-start space-x-4">
        {/* Profile Picture */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          <img
            src="https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Input Form */}
        <form
          className="flex flex-1 items-center space-x-2"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="outline-none p-3 rounded-full bg-gray-100 flex-grow text-gray-900 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="What's on your mind?"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-full font-medium shadow hover:bg-blue-600 transition duration-150"
            disabled={loading}
          >
            {loading ? "Updating..." : "Post"}
          </button>
        </form>
      </div>

      {/* Optional: Add buttons for media upload */}
      <div className="flex justify-evenly p-3 border-t border-gray-200">
        {/* Add media buttons here */}
      </div>
    </div>
  );
};

export default UpdateStatus;
