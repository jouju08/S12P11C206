import FriendCanvas from '@/components/Share/FriendCanvas';
import MyCanvas from '@/components/Share/MyCanvas';
import React, { useEffect, useRef, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';

const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/'
    : 'https://demos.openvidu.io/';

export default function Share() {
  const [mySessionId, setMySessionId] = useState('SessionA');
  const [myUserName, setMyUserName] = useState(
    'Participant' + Math.floor(Math.random() * 100)
  );
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);

  const OV = useRef(null);

  useEffect(() => {
    window.addEventListener('beforeunload', leaveSession);
    joinSession({ preventDefault: () => {} });
    return () => {
      window.removeEventListener('beforeunload', leaveSession);
    };
  }, []);

  const handleChangeSessionId = (e) => setMySessionId(e.target.value);
  const handleChangeUserName = (e) => setMyUserName(e.target.value);

  const deleteSubscriber = (streamManager) => {
    setSubscribers((prev) => prev.filter((sub) => sub !== streamManager));
  };

  const joinSession = async (event) => {
    event.preventDefault();
    OV.current = new OpenVidu();
    const newSession = OV.current.initSession();

    newSession.on('streamCreated', (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prev) => [...prev, subscriber]);
    });

    newSession.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    newSession.on('exception', (exception) => {
      console.warn(exception);
    });

    try {
      const token = await getToken();
      await newSession.connect(token, { clientData: myUserName });

      const newPublisher = await OV.current.initPublisherAsync(undefined, {
        audioSource: false,
        videoSource: undefined, // undefined
        publishAudio: false,
        publishVideo: true, //false
        mirror: false,
      });

      await newSession.publish(newPublisher);

      setSession(newSession);
      setPublisher(newPublisher);
      setMainStreamManager(newPublisher);
      setCurrentVideoDevice(currentVideoDevice);
    } catch (error) {
      console.log(
        'There was an error connecting to the session:',
        error.code,
        error.message
      );
    }
  };

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }

    OV.current = null;
    setSession(undefined);
    setSubscribers([]);
    setMySessionId('SessionA');
    setMyUserName('Participant' + Math.floor(Math.random() * 100));
    setMainStreamManager(undefined);
    setPublisher(undefined);
  };

  const getToken = async () => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  };

  const createSession = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + 'api/sessions',
      { customSessionId: sessionId },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  };

  const createToken = async (sessionId) => {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data;
  };

  return (
    <div className="flex h-screen w-[100%] bg-gray-100 p-4">
      {mainStreamManager && <MyCanvas streamManager={mainStreamManager} />}
      {/* <div className="w-1/4 flex flex-col gap-2 ml-4">
        {[...Array(parseInt(3))].map((friend, index) => (
          <FriendCanvas key={index} />
        ))}
      </div> */}
    </div>
  );
}
