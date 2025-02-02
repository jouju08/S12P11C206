import React, { useRef, useState } from 'react';
import KeywordMenu from './KeywordMenu';

export default function KeywordVoice({ back, next, reload }) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaStreamRef = useRef(null);

  const startRecording = async () => {
    try {
      //오디오 스트림 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]); // 기존 청크 초기화

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks((prev) => [...prev, e.data]);
        }
      };

      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error('권한 요청 실패:', error);
    }

    // 녹음 중지
    const stopRecording = () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
        // 사용한 스트림의 모든 트랙 중지 -> 마이크 해제
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        setRecording(false);
      }
    };
  };

  return (
    <div className="flex flex-col h-full justify-evenly">
      <div className="flex justify-between items-center h-auto w-full p-2">
        <button className="flex justify-center items-center bg-main-strawberry rounded-[2.3rem] w-[5.55rem] h-[7.75rem] ml-[20rem] text-text-first">
          <img src="/Common/fill-heart.png" />
        </button>
      </div>
      <KeywordMenu
        back={back}
        next={next}
        reload={reload}
      />
    </div>
  );
}
