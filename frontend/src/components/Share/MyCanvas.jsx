import React from 'react';
import StreamCanvas from './StreamCanvas';

export default function MyCanvas({ streamManager, userType }) {
  const streamCanvas = `streamManager ? ( <StreamCanvas streamManager={streamManager} /> ) : null`;

  const getNicknameTag = () => {
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow-lg p-2">
      <div className="h-full w-full border border-gray-300 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">
          내 화면
          <div className="border-gray-300 rounded-lg">
            <StreamCanvas streamManager={streamManager} />
            <div>
              <p className="">{getNicknameTag()}</p>
            </div>
          </div>
        </span>
      </div>
    </div>
  );
}
