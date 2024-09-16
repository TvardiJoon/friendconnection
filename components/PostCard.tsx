import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PostCardProps {
  profileId: string;
  fullName: string;
  date: string;
  title: string;
  content: string;
}

const PostCard: React.FC<PostCardProps> = ({ profileId, fullName, date, title, content }) => {
  return (
    <div className="bg-white border border-gray-300 text-gray-700 mt-6 mb-8 mx-auto rounded-lg p-6">
    <div className="py-3">
      <div className="flex pb-3">
        <div>
          <div className="border rounded-full flex">
            <div className="relative w-10 h-10 overflow-hidden rounded-full">
              <img
                alt={fullName}
                src="/images/resources/user.png" // Update this to dynamic if needed
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="ml-2 flex flex-col justify-center">
          <div
            onClick={() => window.location.href = `/profile?profileId=${profileId}`}
            className="font-medium m-0 hover:underline cursor-pointer"
          >
            {fullName || 'User'}
          </div>
          <span className="text-gray-400 text-xs">published: {date}</span>
        </div>
      </div>
      <div
        onClick={() => window.location.href = "/post-detail"}
        className="text-lg font-semibold hover:underline cursor-pointer"
      >
        {title}
      </div>
      <p>{content}</p>
    </div>


  </div>
  );
};

export default PostCard;
