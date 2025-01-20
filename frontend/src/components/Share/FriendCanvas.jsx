import React from 'react';

export default function FriendCanvas({ streamManager, userType }) {
  return (
    <div className="h-1/3 bg-white rounded-lg shadow-md flex items-center justify-center border border-gray-300">
      <span className="text-gray-500">{userType} </span>
    </div>
  );
}
